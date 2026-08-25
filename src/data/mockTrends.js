// src/data/mockTrends.js

export const TREND_PRODUCTS = [
  "Tomato",
  "Onion",
  "Paddy",
  "Chilli",
  "Brinjal",
  "Groundnut",
  "Banana"
];

const generateHistory = (basePrice, volatility, trend) => {
  const data = [];
  let current = basePrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Add random volatility + slight trend
    const change = (Math.random() * volatility * 2) - volatility + trend;
    current = Math.max(1, current + change);
    
    // Correlated demand (e.g., lower price -> slightly higher demand)
    const demandBase = 100 - (current / basePrice * 20);
    const demand = Math.max(10, demandBase + (Math.random() * 20 - 10));

    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(current),
      demand: Math.round(demand)
    });
  }
  return data;
};

export const productTrends = {
  "Tomato": {
    currentPrice: 40,
    previousPrice: 36,
    avgPrice: 35,
    minPrice: 28,
    maxPrice: 45,
    demandLevel: "High", // Low | Moderate | High | Very High
    demandChange: 18, // percentage
    supplyCount: 45, // farmers
    supplyQuantity: 8420, // kg
    supplyTrend: -12, // percentage change
    opportunityScore: 82, // out of 100
    insight: "Tomato prices have increased over the last 3 weeks while available supply has decreased. Demand is currently high. Consider monitoring the market before selling your entire stock.",
    history: generateHistory(32, 2.5, 0.3),
    regions: [
      { market: "Kovilpatti", price: 40, change: 8, demandStr: "High" },
      { market: "Thoothukudi", price: 38, change: 5, demandStr: "Moderate" },
      { market: "Madurai", price: 42, change: 12, demandStr: "Very High" },
      { market: "Chennai", price: 46, change: 15, demandStr: "Very High" }
    ],
    buyerDemand: 1250,
    unit: "kg",
    alerts: [
      { type: "demand", message: "Buyer demand for tomatoes in your region increased by 23% this week." },
      { type: "price", message: "Price is trending upwards." }
    ],
    forecast: "Increasing",
    forecastConfidence: 78
  },
  "Onion": {
    currentPrice: 35,
    previousPrice: 40,
    avgPrice: 38,
    minPrice: 30,
    maxPrice: 42,
    demandLevel: "Moderate",
    demandChange: -5,
    supplyCount: 60,
    supplyQuantity: 15000,
    supplyTrend: 8,
    opportunityScore: 45,
    insight: "Onion supply has been steadily increasing, leading to a slight drop in prices. Demand remains stable.",
    history: generateHistory(42, 1.5, -0.2),
    regions: [
      { market: "Kovilpatti", price: 35, change: -12, demandStr: "Moderate" },
      { market: "Thoothukudi", price: 34, change: -15, demandStr: "Low" },
      { market: "Madurai", price: 38, change: -5, demandStr: "High" }
    ],
    buyerDemand: 850,
    unit: "kg",
    alerts: [
      { type: "supply", message: "Supply has increased by 8% this week." }
    ],
    forecast: "Decreasing",
    forecastConfidence: 65
  },
  "Paddy": {
    currentPrice: 2400,
    previousPrice: 2350,
    avgPrice: 2380,
    minPrice: 2200,
    maxPrice: 2500,
    demandLevel: "Very High",
    demandChange: 15,
    supplyCount: 120,
    supplyQuantity: 50000, // quintals
    supplyTrend: -2,
    opportunityScore: 75,
    insight: "Paddy prices are showing slow but steady growth due to high seasonal demand and stable supply.",
    history: generateHistory(2300, 20, 3),
    regions: [
      { market: "Thanjavur", price: 2400, change: 2, demandStr: "Very High" },
      { market: "Tiruvarur", price: 2380, change: 1, demandStr: "High" },
      { market: "Madurai", price: 2450, change: 4, demandStr: "High" }
    ],
    buyerDemand: 15000,
    unit: "quintal",
    alerts: [
      { type: "demand", message: "Millers are actively looking for fresh harvest." }
    ],
    forecast: "Stable",
    forecastConfidence: 85
  },
  "Chilli": {
    currentPrice: 150,
    previousPrice: 145,
    avgPrice: 140,
    minPrice: 120,
    maxPrice: 160,
    demandLevel: "High",
    demandChange: 10,
    supplyCount: 30,
    supplyQuantity: 4200,
    supplyTrend: -5,
    opportunityScore: 88,
    insight: "Chilli prices have spiked recently due to lower yields this season. High demand makes it an excellent time to sell.",
    history: generateHistory(135, 5, 0.5),
    regions: [
      { market: "Ramanathapuram", price: 155, change: 7, demandStr: "Very High" },
      { market: "Virudhunagar", price: 150, change: 4, demandStr: "High" },
      { market: "Madurai", price: 145, change: 2, demandStr: "Moderate" }
    ],
    buyerDemand: 420,
    unit: "kg",
    alerts: [
      { type: "price", message: "Price hit a 3-month high yesterday." },
      { type: "supply", message: "Regional supply is lower than average." }
    ],
    forecast: "Increasing",
    forecastConfidence: 72
  },
  "Brinjal": {
    currentPrice: 25,
    previousPrice: 22,
    avgPrice: 20,
    minPrice: 15,
    maxPrice: 28,
    demandLevel: "Moderate",
    demandChange: 5,
    supplyCount: 50,
    supplyQuantity: 6000,
    supplyTrend: 2,
    opportunityScore: 60,
    insight: "Brinjal prices are recovering from a recent slump. Both supply and demand are currently stable.",
    history: generateHistory(20, 1.5, 0.1),
    regions: [
      { market: "Kovilpatti", price: 25, change: 13, demandStr: "Moderate" },
      { market: "Madurai", price: 24, change: 9, demandStr: "Moderate" },
      { market: "Dindigul", price: 28, change: 15, demandStr: "High" }
    ],
    buyerDemand: 350,
    unit: "kg",
    alerts: [],
    forecast: "Stable",
    forecastConfidence: 60
  },
  "Groundnut": {
    currentPrice: 85,
    previousPrice: 80,
    avgPrice: 78,
    minPrice: 70,
    maxPrice: 90,
    demandLevel: "Very High",
    demandChange: 25,
    supplyCount: 40,
    supplyQuantity: 12000,
    supplyTrend: -8,
    opportunityScore: 92,
    insight: "Strong demand from oil extractors combined with tightening supply has pushed groundnut prices significantly higher.",
    history: generateHistory(75, 2, 0.4),
    regions: [
      { market: "Pollachi", price: 88, change: 6, demandStr: "Very High" },
      { market: "Erode", price: 85, change: 5, demandStr: "High" },
      { market: "Salem", price: 82, change: 3, demandStr: "High" }
    ],
    buyerDemand: 5400,
    unit: "kg",
    alerts: [
      { type: "demand", message: "Industrial buyer demand is very strong." },
      { type: "opportunity", message: "Excellent selling opportunity window right now." }
    ],
    forecast: "Increasing",
    forecastConfidence: 81
  },
  "Banana": {
    currentPrice: 250, // per bunch
    previousPrice: 260,
    avgPrice: 255,
    minPrice: 220,
    maxPrice: 280,
    demandLevel: "Moderate",
    demandChange: -2,
    supplyCount: 85,
    supplyQuantity: 3200, // bunches
    supplyTrend: 5,
    opportunityScore: 55,
    insight: "Banana market is currently well-supplied. Prices might see a slight dip before stabilizing.",
    history: generateHistory(265, 8, -0.5),
    regions: [
      { market: "Trichy", price: 240, change: -4, demandStr: "Moderate" },
      { market: "Theni", price: 250, change: -2, demandStr: "Moderate" },
      { market: "Coimbatore", price: 265, change: 2, demandStr: "High" }
    ],
    buyerDemand: 450, // bunches
    unit: "bunch",
    alerts: [
      { type: "supply", message: "High volume of fresh arrivals expected this weekend." }
    ],
    forecast: "Slight Decrease",
    forecastConfidence: 68
  }
};
