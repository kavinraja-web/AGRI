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
  const requiredItems = bucketList.map(item => ({
    ...item,
    canonical: item.name.toLowerCase(),
  }));

  const itemNames = requiredItems.map(i => i.canonical);

  const relevantProducts = allProducts.filter(p => {
    const pName = p.name.toLowerCase();
    return itemNames.some(req => pName.includes(req)) && p.status !== 'Out of Stock';
  });

  const purchases = [];
  const unfulfilledItems = [];

  // For each requirement, aggregate supply
  for (const req of requiredItems) {
    // Find matching products for this requirement
    let matches = relevantProducts.filter(p => p.name.toLowerCase().includes(req.canonical));
    
    // Sort matches: primarily by price (lowest first), secondarily by distance to start location
    matches.sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;
      const farmerA = allFarmers.find(f => f.id === a.farmerId);
      const farmerB = allFarmers.find(f => f.id === b.farmerId);
      const distA = farmerA ? calculateDistanceInKm(startLocation.lat, startLocation.lng, farmerA.lat, farmerA.lng) : 999;
      const distB = farmerB ? calculateDistanceInKm(startLocation.lat, startLocation.lng, farmerB.lat, farmerB.lng) : 999;
      return distA - distB;
    });

    let quantityNeeded = req.quantity;
    let quantityFulfilled = 0;

    for (const p of matches) {
      if (quantityNeeded <= 0) break;
      
      const availableQty = Number(p.quantity) || 50; // Fallback to 50 if missing in mock
      const qtyToBuy = Math.min(quantityNeeded, availableQty);
      
      if (qtyToBuy > 0) {
        purchases.push({
          reqId: req.id,
          reqName: req.name,
          reqUnit: req.unit,
          productId: p.id,
          productName: p.name,
          price: p.price,
          quantityBought: qtyToBuy,
          farmerId: p.farmerId,
          farmerName: p.farmerName || allFarmers.find(f => f.id === p.farmerId)?.name || 'Unknown Farmer',
        });
        
        quantityNeeded -= qtyToBuy;
        quantityFulfilled += qtyToBuy;
      }
    }

    if (quantityNeeded > 0) {
      unfulfilledItems.push({
        ...req,
        quantity: quantityNeeded, // Pass missing qty back to UI
        originalQuantity: req.quantity
      });
    }
  }

  // Group purchases by Farmer to create Stops
  const stopsMap = new Map();
  for (const buy of purchases) {
    if (!stopsMap.has(buy.farmerId)) {
      const farmer = allFarmers.find(f => f.id === buy.farmerId);
      stopsMap.set(buy.farmerId, {
        farmerId: buy.farmerId,
        farmerName: buy.farmerName,
        lat: farmer?.lat,
        lng: farmer?.lng,
        phone: farmer?.phone || '+919876543210',
        location: farmer?.location || 'Unknown Location',
        itemsToBuy: [],
        stopCost: 0,
      });
    }
    
    const stop = stopsMap.get(buy.farmerId);
    stop.itemsToBuy.push({
      reqId: buy.reqId,
      reqName: buy.reqName,
      reqQuantity: buy.quantityBought,
      unit: buy.reqUnit,
      price: buy.price,
    });
    stop.stopCost += buy.price * buy.quantityBought;
  }

  const activeFarmers = Array.from(stopsMap.values()).filter(f => f.lat && f.lng);

  if (activeFarmers.length === 0) {
    return { error: 'No farmers found matching your requirements.', unfulfilledItems };
  }

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

  // Calculate Metrics
  let productCost = 0;
  for (const stop of sequencedRoute) {
    productCost += stop.stopCost;
  }

  const travelCost = totalDistance * 6; // ₹6 per km
  const travelTime = totalDistance * 2; // 2 mins per km

  return {
    stops: sequencedRoute,
    metrics: {
      totalDistance: totalDistance.toFixed(1),
      travelTime: Math.round(travelTime + (sequencedRoute.length * 10)), // Add 10 mins per stop
      productCost: Math.round(productCost),
      travelCost: Math.round(travelCost),
      totalCost: Math.round(productCost + travelCost),
      farmerCount: sequencedRoute.length,
      itemCount: purchases.length,
    },
    unfulfilledItems
  };
}
