export const initialLivestockFarms = [
  {
    id: "farm-1",
    name: "Sri Murugan Poultry & Hen Farm",
    ownerName: "Murugan Swamy",
    phone: "9876543210",
    farmType: "Hen / Poultry Farm",
    typeBadge: "hen",
    fertilizerType: "Processed Poultry Litter (Hen Manure)",
    npkRatio: "3.0 - 2.8 - 2.0 (Rich in Nitrogen & Phosphorus)",
    quantity: 45,
    unit: "Tons",
    pricePerUnit: 1400,
    priceUnit: "Ton",
    location: "Kanchipuram, Tamil Nadu",
    distance: 14,
    deliveryMode: "Both (Pickup & Farm Truck Delivery)",
    organicRating: "High Nitrogen & Quick Decomposition",
    verified: true,
    description: "Well-composted layer hen manure. Excellent for paddy, sugarcane, and high-yielding vegetable crops. Low moisture content, ready for field application.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600&h=400",
    dateAdded: "2026-08-20"
  },
  {
    id: "farm-2",
    name: "Green Pastures Goat & Sheep Farm",
    ownerName: "Venkatesh Perumal",
    phone: "9443218765",
    farmType: "Goat & Sheep Farm",
    typeBadge: "goat",
    fertilizerType: "Aged Goat Manure Pellets",
    npkRatio: "2.7 - 1.5 - 2.9 (High Potassium & Organic Carbon)",
    quantity: 30,
    unit: "Tons",
    pricePerUnit: 2200,
    priceUnit: "Ton",
    location: "Chengalpattu, Tamil Nadu",
    distance: 22,
    deliveryMode: "Self Pickup Only",
    organicRating: "Slow Release & Soil Aeration Boost",
    verified: true,
    description: "Dry and odor-free goat manure pellets. Does not burn crop roots. Ideal for fruit orchards, coconut trees, banana, and pulses.",
    image: "https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&q=80&w=600&h=400",
    dateAdded: "2026-08-21"
  },
  {
    id: "farm-3",
    name: "Gokulam Dairy & Cow Farm",
    ownerName: "Lakshmi Narayanan",
    phone: "9840123456",
    farmType: "Cow / Dairy Farm",
    typeBadge: "cow",
    fertilizerType: "Pure Cow Dung & Organic Vermicompost",
    npkRatio: "2.0 - 1.2 - 1.8 + Bio-Microbes (Jeevamrutha Base)",
    quantity: 120,
    unit: "Tons",
    pricePerUnit: 1100,
    priceUnit: "Ton",
    location: "Tiruvallur, Tamil Nadu",
    distance: 18,
    deliveryMode: "Farm Truck Delivery Available",
    organicRating: "Humus Rich & Soil Microbe Booster",
    verified: true,
    description: "Desi cow dung aged naturally with earthworms. Restores dead soil health, increases water retention by up to 40%, and reduces irrigation needs.",
    image: "https://images.unsplash.com/photo-1570042707222-6b3a3d6b0e8b?auto=format&fit=crop&q=80&w=600&h=400",
    dateAdded: "2026-08-19"
  },
  {
    id: "farm-4",
    name: "Kongu Integrated Broiler & Hen Farm",
    ownerName: "Karthik Raja",
    phone: "9176549870",
    farmType: "Hen / Poultry Farm",
    typeBadge: "hen",
    fertilizerType: "Broiler Litter & Sawdust Compost",
    npkRatio: "3.2 - 2.5 - 2.1 (Fast Acting Organic Nitrogen)",
    quantity: 60,
    unit: "Tons",
    pricePerUnit: 1300,
    priceUnit: "Ton",
    location: "Ranipet, Tamil Nadu",
    distance: 35,
    deliveryMode: "Both (Pickup & Farm Truck Delivery)",
    organicRating: "High Calcium & Micronutrient Mix",
    verified: true,
    description: "High organic matter poultry litter from clean broiler housing. Great alternative to expensive Chemical Urea.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600&h=400",
    dateAdded: "2026-08-22"
  },
  {
    id: "farm-5",
    name: "Cauvery Multi-Livestock Agro Farm",
    ownerName: "Selvam Arumugam",
    phone: "9894561230",
    farmType: "Mixed Livestock (Cow & Goat)",
    typeBadge: "mixed",
    fertilizerType: "Mixed Livestock Compost & Bio-Slurry",
    npkRatio: "2.5 - 2.0 - 2.2 (Balanced Organic NPK)",
    quantity: 80,
    unit: "Tons",
    pricePerUnit: 1600,
    priceUnit: "Ton",
    location: "Vellore, Tamil Nadu",
    distance: 42,
    deliveryMode: "Farm Truck Delivery Available",
    organicRating: "Multi-Source Nutrient Synergy",
    verified: true,
    description: "Combined cow dung, goat manure, and bio-gas slurry compost. 100% natural, pathogen-free and enriched with beneficial soil fungi.",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=600&h=400",
    dateAdded: "2026-08-18"
  }
];

export const fertilizerComparisonData = [
  {
    metric: "Cost per Ton (Average)",
    naturalHen: "₹ 1,300 - ₹ 1,500 / Ton",
    naturalGoat: "₹ 2,000 - ₹ 2,400 / Ton",
    naturalCow: "₹ 1,000 - ₹ 1,200 / Ton",
    artificialChemical: "₹ 14,000 - ₹ 26,000 / Ton (Urea / DAP)",
    winner: "Natural Farms (80% Cheaper)"
  },
  {
    metric: "NPK & Nutrient Source",
    naturalHen: "High Organic N, P, Ca & Trace Minerals",
    naturalGoat: "Balanced N, P, K & High Carbon",
    naturalCow: "Bio-Active Humus & Beneficial Microbes",
    artificialChemical: "Synthetic Salts (Only N, P, or K)",
    winner: "Natural Farms (Full Bio-Nutrients)"
  },
  {
    metric: "Soil Microbial Health",
    naturalHen: "Promotes earthworms & beneficial fungi",
    naturalGoat: "Builds permanent soil organic humus",
    naturalCow: "Massive biological soil regeneration",
    naturalGoat: "Kills soil microbes & hardens soil over time",
    winner: "Natural Farms (Regenerative)"
  },
  {
    metric: "Water Retention Boost",
    naturalHen: "+35% Soil Moisture Holding Capacity",
    naturalGoat: "+45% Soil Water Absorption",
    naturalCow: "+50% Water Retention Capacity",
    artificialChemical: "Zero Water Retention (Requires frequent watering)",
    winner: "Natural Farms (Drought Proofing)"
  },
  {
    metric: "Chemical Toxicity & Safety",
    naturalHen: "100% Non-toxic, safe for groundwater",
    naturalGoat: "100% Safe, zero chemical runoff",
    naturalCow: "100% Safe & Eco-friendly",
    artificialChemical: "Causes groundwater nitrate pollution & soil acidity",
    winner: "Natural Farms (100% Eco-Safe)"
  },
  {
    metric: "Yield Longevity (3-5 Years)",
    naturalHen: "Yield increases steadily every year",
    naturalGoat: "Maintains high soil fertility permanently",
    naturalCow: "Protects land from desertification",
    artificialChemical: "Soil degrades; requires higher chemical dosage each year",
    winner: "Natural Farms (Sustainable)"
  }
];

export const cropCalculatorPresets = {
  paddy: {
    name: "Paddy / Rice",
    chemicalCostPerAcre: 6800,
    henCostPerAcre: 2400,
    goatCostPerAcre: 3100,
    cowCostPerAcre: 2100,
    recommendedTonsPerAcre: 1.8
  },
  sugarcane: {
    name: "Sugarcane",
    chemicalCostPerAcre: 12500,
    henCostPerAcre: 4200,
    goatCostPerAcre: 5200,
    cowCostPerAcre: 3600,
    recommendedTonsPerAcre: 3.0
  },
  vegetables: {
    name: "Vegetables (Tomato, Onion, Chili)",
    chemicalCostPerAcre: 7500,
    henCostPerAcre: 2600,
    goatCostPerAcre: 3400,
    cowCostPerAcre: 2300,
    recommendedTonsPerAcre: 2.0
  },
  banana: {
    name: "Banana & Orchards",
    chemicalCostPerAcre: 11000,
    henCostPerAcre: 3800,
    goatCostPerAcre: 4600,
    cowCostPerAcre: 3200,
    recommendedTonsPerAcre: 2.5
  },
  cotton: {
    name: "Cotton & Maize",
    chemicalCostPerAcre: 6200,
    henCostPerAcre: 2200,
    goatCostPerAcre: 2900,
    cowCostPerAcre: 1900,
    recommendedTonsPerAcre: 1.5
  }
};
