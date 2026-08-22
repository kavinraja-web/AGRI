export const initialLivestockFarms = [
  {
    id: "farm-1",
    name: "Sri Murugan Hen Farm",
    ownerName: "Murugan Swamy",
    phone: "9876543210",
    farmType: "Hen / Poultry Farm",
    typeBadge: "hen",
    fertilizerType: "Hen Manure + Soil & Sand Blend",
    npkRatio: "High Nitrogen & Organic Sand Blend",
    quantity: 45,
    unit: "Tons",
    pricePerUnit: 1400,
    priceUnit: "Ton",
    location: "Kanchipuram, TN",
    distance: 14,
    deliveryMode: "Pickup & Farm Truck Delivery",
    organicRating: "Ready-to-Apply Soil Mix",
    verified: true,
    description: "Composted hen litter mixed with nutrient-rich farm sand and soil. Ready for direct soil application.",
    image: "/assets/poultry_fertilizer_soil.png",
    dateAdded: "2026-08-20"
  },
  {
    id: "farm-2",
    name: "Gokulam Dairy & Cow Farm",
    ownerName: "Lakshmi Narayanan",
    phone: "9840123456",
    farmType: "Cow / Dairy Farm",
    typeBadge: "cow",
    fertilizerType: "Cow Dung Vermicompost + Sand Mix",
    npkRatio: "Bio-Active Cow Dung & Soil Humus",
    quantity: 120,
    unit: "Tons",
    pricePerUnit: 1100,
    priceUnit: "Ton",
    location: "Tiruvallur, TN",
    distance: 18,
    deliveryMode: "Farm Delivery Available",
    organicRating: "Earthworm Bio-Humus Blend",
    verified: true,
    description: "Pure cow manure decomposed with organic sand & soil. Restores soil moisture retention by up to 50%.",
    image: "/assets/cow_fertilizer_blend.png",
    dateAdded: "2026-08-19"
  },
  {
    id: "farm-3",
    name: "Green Pastures Goat Farm",
    ownerName: "Venkatesh Perumal",
    phone: "9443218765",
    farmType: "Goat & Sheep Farm",
    typeBadge: "goat",
    fertilizerType: "Goat Manure Pellets + Soil Blend",
    npkRatio: "High Potassium Organic Carbon",
    quantity: 30,
    unit: "Tons",
    pricePerUnit: 2200,
    priceUnit: "Ton",
    location: "Chengalpattu, TN",
    distance: 22,
    deliveryMode: "Self Pickup & Delivery",
    organicRating: "Slow Release Soil Aerator",
    verified: true,
    description: "Aged goat dung pellets mixed with organic river sand & black soil. Does not burn crop roots.",
    image: "/assets/goat_fertilizer_pellets.png",
    dateAdded: "2026-08-21"
  },
  {
    id: "farm-4",
    name: "Kongu Organic Fertilizer Farm",
    ownerName: "Karthik Raja",
    phone: "9176549870",
    farmType: "Hen & Cow Farm",
    typeBadge: "mixed",
    fertilizerType: "Organic Manure + Rich Soil & Sand Mix",
    npkRatio: "Balanced Bio NPK Blend",
    quantity: 60,
    unit: "Tons",
    pricePerUnit: 1300,
    priceUnit: "Ton",
    location: "Ranipet, TN",
    distance: 35,
    deliveryMode: "Truck Delivery Available",
    organicRating: "100% Bio-Active Soil Compost",
    verified: true,
    description: "Multi-source organic manure blended with sand & river soil for paddy and vegetable crops.",
    image: "/assets/organic_manure_soil.png",
    dateAdded: "2026-08-22"
  }
];

export const fertilizerComparisonData = [
  {
    metric: "Cost per Ton",
    naturalHen: "₹ 1,400 / Ton",
    naturalCow: "₹ 1,100 / Ton",
    artificialChemical: "₹ 18,000 / Ton (Urea)",
    winner: "Natural Manure (Save 85%)"
  },
  {
    metric: "Soil Health & Sand Mix",
    naturalHen: "Adds natural carbon & moisture",
    naturalCow: "Builds permanent soil humus",
    artificialChemical: "Hardens soil & burns roots",
    winner: "Natural Manure (Regenerative)"
  },
  {
    metric: "Water Retention",
    naturalHen: "+40% Soil Water Absorption",
    naturalCow: "+50% Water Retention",
    artificialChemical: "Zero (Dries out soil)",
    winner: "Natural Manure (Drought Proof)"
  }
];

export const cropCalculatorPresets = {
  paddy: {
    name: "Paddy / Rice",
    chemicalCostPerAcre: 6800,
    henCostPerAcre: 2400,
    cowCostPerAcre: 2100,
    recommendedTonsPerAcre: 1.8
  },
  vegetables: {
    name: "Vegetables (Tomato, Onion, Chili)",
    chemicalCostPerAcre: 7500,
    henCostPerAcre: 2600,
    cowCostPerAcre: 2300,
    recommendedTonsPerAcre: 2.0
  },
  sugarcane: {
    name: "Sugarcane & Orchards",
    chemicalCostPerAcre: 12500,
    henCostPerAcre: 4200,
    cowCostPerAcre: 3600,
    recommendedTonsPerAcre: 3.0
  }
};
