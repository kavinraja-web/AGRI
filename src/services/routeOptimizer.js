import { calculateDistanceInKm } from '../utils/distance';

/**
 * Route Optimizer for Smart Bucket List
 * 
 * Algorithm:
 * 1. Find all farmers that sell at least one required item.
 * 2. Generate combinations of farmers that fulfill the entire list.
 * 3. Use Nearest Neighbor to sequence each valid combination.
 * 4. Score routes based on distance, number of stops, and total cost.
 * 5. Return the best route.
 */

export function optimizeRoute(bucketList, startLocation, allProducts, allFarmers) {
  // Normalize bucket list
  const requiredItems = bucketList.map(item => ({
    ...item,
    canonical: item.name.toLowerCase(),
  }));

  const itemNames = requiredItems.map(i => i.canonical);

  // Filter products that match bucket list
  const relevantProducts = allProducts.filter(p => {
    const pName = p.name.toLowerCase();
    return itemNames.some(req => pName.includes(req)) && p.status !== 'Out of Stock';
  });

  // Group by farmer
  const farmerInventory = {};
  for (const product of relevantProducts) {
    const matchedReq = requiredItems.find(req => product.name.toLowerCase().includes(req.canonical));
    if (!matchedReq) continue;

    if (!farmerInventory[product.farmerId]) {
      const farmer = allFarmers.find(f => f.id === product.farmerId);
      farmerInventory[product.farmerId] = {
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        lat: product.lat || farmer?.lat,
        lng: product.lng || farmer?.lng,
        phone: farmer?.phone || '+919876543210',
        products: [],
      };
    }

    farmerInventory[product.farmerId].products.push({
      ...product,
      reqId: matchedReq.id,
      reqName: matchedReq.name,
      reqQuantity: matchedReq.quantity,
    });
  }

  const farmersList = Object.values(farmerInventory).filter(f => f.lat && f.lng);

  // Find valid combinations (Simple greedy/recursive set cover for small N)
  // For hackathons, we can limit the depth or just search all combinations up to length 4.
  const validCombinations = [];
  
  function searchCombinations(currentCombo, remainingFarmers) {
    // Check if currentCombo satisfies all required items
    const coveredReqIds = new Set();
    currentCombo.forEach(f => {
      f.products.forEach(p => coveredReqIds.add(p.reqId));
    });

    if (coveredReqIds.size === requiredItems.length) {
      validCombinations.push([...currentCombo]);
      return;
    }

    if (currentCombo.length >= 4) return; // Limit max stops to 4

    for (let i = 0; i < remainingFarmers.length; i++) {
      searchCombinations([...currentCombo, remainingFarmers[i]], remainingFarmers.slice(i + 1));
    }
  }

  searchCombinations([], farmersList);

  // If no combination covers everything, find the one that covers the most
  const unfulfilledItems = [];
  let combinationsToEvaluate = validCombinations;

  if (validCombinations.length === 0) {
    // Greedy fallback: pick farmers that give the most items
    let bestCombo = [];
    let maxCovered = 0;
    
    const allPossibleCombos = [];
    function getAllCombos(current, remaining) {
      if (current.length > 0) allPossibleCombos.push([...current]);
      if (current.length >= 4) return;
      for (let i = 0; i < remaining.length; i++) {
        getAllCombos([...current, remaining[i]], remaining.slice(i + 1));
      }
    }
    getAllCombos([], farmersList);

    for (const combo of allPossibleCombos) {
      const covered = new Set();
      combo.forEach(f => f.products.forEach(p => covered.add(p.reqId)));
      if (covered.size > maxCovered) {
        maxCovered = covered.size;
        bestCombo = combo;
      }
    }

    combinationsToEvaluate = bestCombo.length > 0 ? [bestCombo] : [];

    // Determine unfulfilled
    const coveredIds = new Set();
    bestCombo.forEach(f => f.products.forEach(p => coveredIds.add(p.reqId)));
    requiredItems.forEach(req => {
      if (!coveredIds.has(req.id)) unfulfilledItems.push(req);
    });
  }

  // Sequence and score combinations
  let bestRoute = null;
  let bestScore = Infinity; // Lower is better

  for (const combo of combinationsToEvaluate) {
    // Determine which products to buy from which farmer to avoid duplicates and minimize cost
    const purchasePlan = new Map(); // reqId -> { product, farmerId }
    
    // Sort all products in this combo by price
    const allComboProducts = [];
    combo.forEach(f => {
      f.products.forEach(p => allComboProducts.push({ ...p, farmerId: f.farmerId }));
    });
    allComboProducts.sort((a, b) => a.price - b.price);

    for (const p of allComboProducts) {
      if (!purchasePlan.has(p.reqId)) {
        purchasePlan.set(p.reqId, p);
      }
    }

    // Filter combo to only include farmers we are actually buying from
    const activeFarmerIds = new Set(Array.from(purchasePlan.values()).map(p => p.farmerId));
    const activeFarmers = combo.filter(f => activeFarmerIds.has(f.farmerId));

    // Route Sequencing: Nearest Neighbor
    const sequencedRoute = [];
    let currentLoc = startLocation;
    let unvisited = [...activeFarmers];
    let totalDistance = 0;

    while (unvisited.length > 0) {
      let nearest = null;
      let minDistance = Infinity;
      let nearestIdx = -1;

      for (let i = 0; i < unvisited.length; i++) {
        const f = unvisited[i];
        const dist = calculateDistanceInKm(currentLoc.lat, currentLoc.lng, f.lat, f.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = f;
          nearestIdx = i;
        }
      }

      sequencedRoute.push(nearest);
      totalDistance += minDistance;
      currentLoc = { lat: nearest.lat, lng: nearest.lng };
      unvisited.splice(nearestIdx, 1);
    }

    // Add return trip distance (optional, but good for total travel cost)
    // totalDistance += calculateDistanceInKm(currentLoc.lat, currentLoc.lng, startLocation.lat, startLocation.lng);

    // Calculate Costs
    let productCost = 0;
    const finalStops = sequencedRoute.map(f => {
      const itemsToBuy = Array.from(purchasePlan.values()).filter(p => p.farmerId === f.farmerId);
      const stopCost = itemsToBuy.reduce((sum, p) => sum + (p.price * (p.reqQuantity || 1)), 0);
      productCost += stopCost;
      return {
        ...f,
        itemsToBuy,
        stopCost,
      };
    });

    const travelCost = totalDistance * 6; // Assume ₹6 per km
    const travelTime = totalDistance * 2; // Assume 2 mins per km on rural/semi-urban roads + stop time

    // Scoring formula (lower is better)
    // 1 km = 1 point, 1 stop = 5 points, 10 rs cost = 1 point
    const score = totalDistance + (finalStops.length * 5) + ((productCost + travelCost) / 10);

    if (score < bestScore) {
      bestScore = score;
      bestRoute = {
        stops: finalStops,
        metrics: {
          totalDistance: totalDistance.toFixed(1),
          travelTime: Math.round(travelTime + (finalStops.length * 10)), // Add 10 mins per stop
          productCost: Math.round(productCost),
          travelCost: Math.round(travelCost),
          totalCost: Math.round(productCost + travelCost),
          farmerCount: finalStops.length,
          itemCount: purchasePlan.size,
        },
        unfulfilledItems
      };
    }
  }

  return bestRoute;
}
