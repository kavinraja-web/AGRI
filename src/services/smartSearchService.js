/**
 * FarmConnect Smart Search Service
 *
 * Parses natural-language queries (English / Tamil / Tanglish / Mixed)
 * into structured filters and ranks real product results.
 *
 * Architecture is designed so an LLM parser can be plugged in later
 * without changing the UI or filtering layer.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRODUCT SYNONYM DICTIONARY
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCT_SYNONYMS = {
  tomato: {
    canonical: 'tomato',
    displayEn: 'Tomato',
    displayTa: 'தக்காளி',
    category: 'Vegetables',
    emoji: '🍅',
    terms: [
      'tomato','tomatoes','tomatos','தக்காளி','thakkali','takkali',
      'thakaali','tamata','thakkaali','thakali',
    ],
  },
  onion: {
    canonical: 'onion',
    displayEn: 'Onion',
    displayTa: 'வெங்காயம்',
    category: 'Vegetables',
    emoji: '🧅',
    terms: [
      'onion','onions','வெங்காயம்','vengayam','vengaayam',
      'vengaya','vengaayam','vengaayam',
    ],
  },
  potato: {
    canonical: 'potato',
    displayEn: 'Potato',
    displayTa: 'உருளைக்கிழங்கு',
    category: 'Vegetables',
    emoji: '🥔',
    terms: [
      'potato','potatoes','உருளைக்கிழங்கு','urulaikizhangu',
      'aloo','alu','urulaikilangu','aloo',
    ],
  },
  brinjal: {
    canonical: 'brinjal',
    displayEn: 'Brinjal',
    displayTa: 'கத்திரிக்காய்',
    category: 'Vegetables',
    emoji: '🍆',
    terms: [
      'brinjal','eggplant','kathirikkai','கத்திரிக்காய்',
      'katharikkai','katrika','baingan',
    ],
  },
  banana: {
    canonical: 'banana',
    displayEn: 'Banana',
    displayTa: 'வாழைப்பழம்',
    category: 'Fruits',
    emoji: '🍌',
    terms: [
      'banana','bananas','வாழைப்பழம்','vazhaipazham',
      'vaazhai','vazhai','vaazhapazham','vaazhaipazham',
    ],
  },
  rice: {
    canonical: 'rice',
    displayEn: 'Rice',
    displayTa: 'அரிசி',
    category: 'Grains',
    emoji: '🍚',
    terms: ['rice','அரிசி','arisi','arrisi','samba','ponni','raw rice'],
  },
  paddy: {
    canonical: 'paddy',
    displayEn: 'Paddy',
    displayTa: 'நெல்',
    category: 'Grains',
    emoji: '🌾',
    terms: ['paddy','nel','நெல்'],
  },
  carrot: {
    canonical: 'carrot',
    displayEn: 'Carrot',
    displayTa: 'கேரட்',
    category: 'Vegetables',
    emoji: '🥕',
    terms: ['carrot','carrots','கேரட்','kaerat'],
  },
  chilli: {
    canonical: 'chilli',
    displayEn: 'Chilli',
    displayTa: 'மிளகாய்',
    category: 'Spices',
    emoji: '🌶️',
    terms: [
      'chilli','chilly','chillies','chilies','மிளகாய்',
      'milagai','milagay','milagaay','red chilli',
    ],
  },
  coconut: {
    canonical: 'coconut',
    displayEn: 'Coconut',
    displayTa: 'தேங்காய்',
    category: 'Fruits',
    emoji: '🥥',
    terms: [
      'coconut','coconuts','தேங்காய்','thengai',
      'thengay','thengaai',
    ],
  },
  turmeric: {
    canonical: 'turmeric',
    displayEn: 'Turmeric',
    displayTa: 'மஞ்சள்',
    category: 'Spices',
    emoji: '🟡',
    terms: ['turmeric','மஞ்சள்','manjal'],
  },
  groundnut: {
    canonical: 'groundnut',
    displayEn: 'Groundnut',
    displayTa: 'நிலக்கடலை',
    category: 'Grains',
    emoji: '🥜',
    terms: [
      'groundnut','groundnuts','நிலக்கடலை','nilakadalai',
      'peanut','peanuts','kadalai',
    ],
  },
  mango: {
    canonical: 'mango',
    displayEn: 'Mango',
    displayTa: 'மாம்பழம்',
    category: 'Fruits',
    emoji: '🥭',
    terms: [
      'mango','mangoes','mangos','மாம்பழம்','maambazham',
      'maampazham','maambi','banganapalli',
    ],
  },
  spinach: {
    canonical: 'spinach',
    displayEn: 'Spinach / Greens',
    displayTa: 'கீரை',
    category: 'Vegetables',
    emoji: '🥬',
    terms: ['spinach','greens','கீரை','keerai','keera'],
  },
  garlic: {
    canonical: 'garlic',
    displayEn: 'Garlic',
    displayTa: 'பூண்டு',
    category: 'Spices',
    emoji: '🧄',
    terms: ['garlic','பூண்டு','poondu'],
  },
  ginger: {
    canonical: 'ginger',
    displayEn: 'Ginger',
    displayTa: 'இஞ்சி',
    category: 'Spices',
    emoji: '🫚',
    terms: ['ginger','இஞ்சி','inji'],
  },
  drumstick: {
    canonical: 'drumstick',
    displayEn: 'Drumstick',
    displayTa: 'முருங்கைக்காய்',
    category: 'Vegetables',
    emoji: '🌿',
    terms: ['drumstick','drumsticks','murungakkai','முருங்கைக்காய்','murungai'],
  },
  corn: {
    canonical: 'corn',
    displayEn: 'Corn / Maize',
    displayTa: 'சோளம்',
    category: 'Grains',
    emoji: '🌽',
    terms: ['corn','maize','சோளம்','solam'],
  },
  wheat: {
    canonical: 'wheat',
    displayEn: 'Wheat',
    displayTa: 'கோதுமை',
    category: 'Grains',
    emoji: '🌾',
    terms: ['wheat','கோதுமை','gothuma','gochumai'],
  },
  papaya: {
    canonical: 'papaya',
    displayEn: 'Papaya',
    displayTa: 'பப்பாளி',
    category: 'Fruits',
    emoji: '🍈',
    terms: ['papaya','பப்பாளி','pappali','papali'],
  },
  watermelon: {
    canonical: 'watermelon',
    displayEn: 'Watermelon',
    displayTa: 'தர்பூசணி',
    category: 'Fruits',
    emoji: '🍉',
    terms: ['watermelon','தர்பூசணி','tharpusani','tharbusani'],
  },
  guava: {
    canonical: 'guava',
    displayEn: 'Guava',
    displayTa: 'கொய்யா',
    category: 'Fruits',
    emoji: '🍐',
    terms: ['guava','கொய்யா','koyya'],
  },
  okra: {
    canonical: 'okra',
    displayEn: 'Okra / Ladies Finger',
    displayTa: 'வெண்டைக்காய்',
    category: 'Vegetables',
    emoji: '🥦',
    terms: ['okra','ladies finger','ladiesfinger','vendakkai','வெண்டைக்காய்','vendakkay'],
  },
  cucumber: {
    canonical: 'cucumber',
    displayEn: 'Cucumber',
    displayTa: 'வெள்ளரி',
    category: 'Vegetables',
    emoji: '🥒',
    terms: ['cucumber','வெள்ளரி','vellari','vellary'],
  },
};

// Category-level keywords (when no specific product is named)
const CATEGORY_KEYWORDS = {
  Vegetables: ['vegetable','vegetables','veggies','veggie','காய்கறி','காய்கறிகள்','saabji','sabzi'],
  Fruits: ['fruit','fruits','பழம்','பழங்கள்','pazham','pazhangal'],
  Grains: ['grain','grains','cereal','cereals','தானியம்','தானியங்கள்'],
  Spices: ['spice','spices','masala','மசாலா','seasoning'],
  Dairy: ['dairy','milk','பால்','cheese','curd'],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. BUILD FLAT TERM LOOKUP (term → productKey)
// ─────────────────────────────────────────────────────────────────────────────

const TERM_TO_PRODUCT = {};
for (const [key, info] of Object.entries(PRODUCT_SYNONYMS)) {
  for (const term of info.terms) {
    TERM_TO_PRODUCT[term.toLowerCase()] = key;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LANGUAGE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function detectLanguage(query) {
  const tamilScript  = /[\u0B80-\u0BFF]/;
  const tanglishWords = /\b(venum|vendum|kaatu|pannu|iruka|kulla|keela|pakkathula|pakkam|venam|venaam|kaatu|kaattu)\b/i;
  const englishWords  = /\b(find|show|get|need|want|under|below|near|kg|price|available|farmers?|produce)\b/i;

  const hasTamil    = tamilScript.test(query);
  const hasTanglish = tanglishWords.test(query);
  const hasEnglish  = englishWords.test(query);

  if (hasTamil && (hasEnglish || hasTanglish)) return 'mixed';
  if (hasTamil) return 'ta';
  if (hasTanglish) return 'ta'; // Treat Tanglish as Tamil intent for UI switching
  return 'en';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRODUCT & CATEGORY EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function extractProduct(query) {
  const q = query.toLowerCase();
  // Match longest term first to avoid partial conflicts
  const sortedTerms = Object.keys(TERM_TO_PRODUCT).sort((a, b) => b.length - a.length);
  for (const term of sortedTerms) {
    if (q.includes(term)) {
      const productKey = TERM_TO_PRODUCT[term];
      return PRODUCT_SYNONYMS[productKey];
    }
  }
  return null;
}

function extractCategory(query) {
  const q = query.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => q.includes(k.toLowerCase()))) return cat;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PRICE EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function extractPrice(query) {
  let minPrice = null;
  let maxPrice = null;

  // Between X and Y
  const betweenMatch = query.match(
    /(?:between|from)\s*[₹rs]?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*[₹rs]?\s*(\d+(?:\.\d+)?)/i
  );
  if (betweenMatch) {
    return { minPrice: parseFloat(betweenMatch[1]), maxPrice: parseFloat(betweenMatch[2]) };
  }

  // MAX PRICE: all English / Tamil / Tanglish forms
  const maxPatterns = [
    // "under ₹30", "below 30", "less than 30", "within 30", "upto 30", "max 30"
    /(?:under|below|less\s*than|within|upto|up\s*to|maximum|max|not\s*more\s*than)\s*[₹rs\.]*\s*(\d+(?:\.\d+)?)/i,
    // "₹30 or less"
    /₹\s*(\d+(?:\.\d+)?)\s*(?:or\s*less|or\s*below|or\s*under)/i,
    // "30 rupees or less"
    /(\d+(?:\.\d+)?)\s*(?:rupees?|rs\.?)\s*(?:or\s*less|or\s*below)/i,
    // Tamil: "30 ரூபாய்க்குள்", "30க்கு கீழே", "30க்குள்"
    /(\d+(?:\.\d+)?)\s*(?:ரூபாய்க்குள்|ரூபாய்க்கு\s*கீழ்|ரூபாய்க்கு\s*கீழே)/,
    /(\d+(?:\.\d+)?)\s*(?:க்கு\s*கீழே|க்கு\s*கீழ்|க்குள்)/,
    // Tanglish: "30 rupees kulla", "30 rs kulla", "30 ku keela"
    /(\d+(?:\.\d+)?)\s*(?:rupees?|rs\.?|ru\.?)?\s*(?:kulla|ku\s*keela|keela\s*ku|kull)\b/i,
    // "₹30" followed by product context (alone)
    /₹\s*(\d+(?:\.\d+)?)/,
    // "30 ரூபாய்" — price without explicit max/min indicator
    /(\d+(?:\.\d+)?)\s*ரூபாய்/,
  ];

  for (const pat of maxPatterns) {
    const m = query.match(pat);
    if (m) { maxPrice = parseFloat(m[1]); break; }
  }

  // MIN PRICE
  const minPatterns = [
    /(?:above|over|more\s*than|greater\s*than|minimum|min|atleast|at\s*least)\s*[₹rs\.]*\s*(\d+(?:\.\d+)?)/i,
    /₹\s*(\d+(?:\.\d+)?)\s*(?:or\s*more|or\s*above|or\s*over)/i,
    /(\d+(?:\.\d+)?)\s*(?:rupees?|rs\.?)\s*(?:or\s*more|or\s*above)/i,
    /(\d+(?:\.\d+)?)\s*(?:ரூபாய்க்கு\s*மேல்|க்கு\s*மேல்)/,
  ];

  for (const pat of minPatterns) {
    const m = query.match(pat);
    if (m) { minPrice = parseFloat(m[1]); break; }
  }

  return { minPrice, maxPrice };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. QUANTITY EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function extractQuantity(query) {
  // kg / kgs / kilogram / கிலோ / kilo — must appear BEFORE or AFTER the number
  const kgMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|kilograms?|கிலோகிராம்|கிலோ|kilos?)\b/i);
  if (kgMatch) return { quantity: parseFloat(kgMatch[1]), unit: 'kg' };

  const gramMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:grams?|grms?)\b/i);
  if (gramMatch) return { quantity: parseFloat(gramMatch[1]), unit: 'grams' };

  const pieceMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:pieces?|pcs?|units?)\b/i);
  if (pieceMatch) return { quantity: parseFloat(pieceMatch[1]), unit: 'pieces' };

  const bunchMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:bunches?|bundles?)\b/i);
  if (bunchMatch) return { quantity: parseFloat(bunchMatch[1]), unit: 'bunches' };

  const literMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:lit(?:ers?|res?)?)\b/i);
  if (literMatch) return { quantity: parseFloat(literMatch[1]), unit: 'liters' };

  return { quantity: null, unit: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LOCATION EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

const TN_LOCATIONS = [
  { en: 'Chennai',         ta: 'சென்னை',        variants: ['chennai','chenai','madras'] },
  { en: 'Kanchipuram',    ta: 'காஞ்சிபுரம்',   variants: ['kanchipuram','kanjipuram','kanchi','kanchipuramla','kanchipuram la'] },
  { en: 'Coimbatore',     ta: 'கோயம்புத்தூர்', variants: ['coimbatore','kovai'] },
  { en: 'Madurai',        ta: 'மதுரை',          variants: ['madurai'] },
  { en: 'Trichy',         ta: 'திருச்சி',       variants: ['trichy','tiruchirappalli','tricchi'] },
  { en: 'Salem',          ta: 'சேலம்',          variants: ['salem'] },
  { en: 'Erode',          ta: 'ஈரோடு',          variants: ['erode'] },
  { en: 'Vellore',        ta: 'வேலூர்',         variants: ['vellore'] },
  { en: 'Thanjavur',      ta: 'தஞ்சாவூர்',     variants: ['thanjavur','tanjore'] },
  { en: 'Tiruppur',       ta: 'திருப்பூர்',     variants: ['tiruppur','tirupur'] },
  { en: 'Dindigul',       ta: 'திண்டுக்கல்',   variants: ['dindigul'] },
  { en: 'Nagercoil',      ta: 'நாகர்கோவில்',   variants: ['nagercoil'] },
  { en: 'Krishnagiri',    ta: 'கிருஷ்ணகிரி',   variants: ['krishnagiri'] },
  { en: 'Cuddalore',      ta: 'கடலூர்',         variants: ['cuddalore'] },
  { en: 'Namakkal',       ta: 'நாமக்கல்',       variants: ['namakkal'] },
  { en: 'Villupuram',     ta: 'விழுப்புரம்',   variants: ['villupuram'] },
  { en: 'Hosur',          ta: 'ஓசூர்',          variants: ['hosur'] },
  { en: 'Ooty',           ta: 'உதகமண்டலம்',    variants: ['ooty','udhagamandalam'] },
  { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை', variants: ['tiruvannamalai','thiruvannamalai'] },
  { en: 'Pondicherry',    ta: 'புதுச்சேரி',     variants: ['pondicherry','puducherry','pondy'] },
  { en: 'Chengalpattu',   ta: 'செங்கல்பட்டு',  variants: ['chengalpattu','chengalpet'] },
  { en: 'Tiruvallur',     ta: 'திருவள்ளூர்',   variants: ['tiruvallur'] },
];

function extractLocation(query, allProducts = []) {
  const q = query.toLowerCase();
  const qNoSpace = q.replace(/\s+/g, '');

  for (const loc of TN_LOCATIONS) {
    // Check Tamil script
    if (q.includes(loc.ta)) return loc.en;
    // Check all variants (spaceless for robust matching)
    for (const v of loc.variants) {
      if (qNoSpace.includes(v.toLowerCase().replace(/\s+/g, ''))) return loc.en;
    }
  }

  // Dynamic fallback: Match any location dynamically present in the DB
  if (allProducts && allProducts.length > 0) {
    const dbLocations = [...new Set(allProducts.map(p => p.location).filter(Boolean))];
    for (const dbLoc of dbLocations) {
      const locStrNoSpace = dbLoc.toLowerCase().replace(/\s+/g, '');
      // Ensure we don't match very short strings accidentally
      if (locStrNoSpace.length > 3 && qNoSpace.includes(locStrNoSpace)) {
        return dbLoc;
      }
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7.5 DISTANCE EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function extractDistance(query) {
  const q = query.toLowerCase();
  // "within 2km", "2 km distance", "2 கிலோமீட்டர்", "2 km kulla"
  const distMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers?|கிலோமீட்டர்|கி\.மீ)\b/i);
  if (distMatch) return parseFloat(distMatch[1]);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SORT EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function extractSort(query) {
  const q = query.toLowerCase();
  if (/cheapest|lowest\s*price|price.*low|low.*price|குறைந்த\s*விலை|மலிவான|malivu/.test(q)) return 'price_asc';
  if (/expensive|highest\s*price|price.*high|high.*price|costly/.test(q)) return 'price_desc';
  if (/most\s*available|highest\s*quantity|max\s*stock|அதிகமான/.test(q)) return 'quantity_desc';
  if (/nearest|closest|nearby|அருகில்|pakkathu|pakkathil/.test(q)) return 'nearest';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. AMBIGUITY DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function detectAmbiguity(query, extracted) {
  const q = query.toLowerCase();

  // "cheap tomatoes" — has "cheap" but no price
  if (/\b(cheap|affordable|மலிவு|kuzhanda|malivu)\b/i.test(q) && !extracted.maxPrice) {
    return {
      type: 'need_price',
      message: 'How much would you like to spend per kg?',
      messageTa: 'ஒரு கிலோவிற்கு எவ்வளவு செலவழிக்க விரும்புகிறீர்கள்?',
      options: [
        { label: '₹20 or less', value: 'maxprice', param: 20 },
        { label: '₹30 or less', value: 'maxprice', param: 30 },
        { label: '₹40 or less', value: 'maxprice', param: 40 },
        { label: '₹50 or less', value: 'maxprice', param: 50 },
      ],
    };
  }

  // Standalone number — ambiguous price vs qty
  const allNums = [...query.matchAll(/\b(\d{1,4})\b/g)].map(m => parseInt(m[1]));
  if (
    allNums.length === 1 &&
    extracted.product &&
    !extracted.maxPrice &&
    !extracted.minPrice &&
    !extracted.quantity
  ) {
    const n = allNums[0];
    return {
      type: 'ambiguous_number',
      number: n,
      message: `Did you mean ₹${n}/kg or ${n} kg?`,
      messageTa: `₹${n}/kg என்று சொன்னீர்களா அல்லது ${n} கிலோ என்று சொன்னீர்களா?`,
      options: [
        { label: `Under ₹${n}/kg`, value: 'maxprice', param: n },
        { label: `Need ${n} kg`,   value: 'quantity',  param: n },
      ],
    };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. QUERY PARSER
// ─────────────────────────────────────────────────────────────────────────────

export function parseQuery(rawQuery, allProducts = []) {
  const query = rawQuery.trim();
  const language = detectLanguage(query);
  const product  = extractProduct(query);
  const category = product?.category || extractCategory(query);
  const { minPrice, maxPrice } = extractPrice(query);
  const { quantity, unit }     = extractQuantity(query);
  const location               = extractLocation(query, allProducts);
  const maxDistance            = extractDistance(query);
  const sort                   = extractSort(query);

  const extracted = { product, maxPrice, minPrice, quantity };
  const clarification = detectAmbiguity(query, extracted);

  // Confidence scoring
  let confidence = 0.3;
  if (product)             confidence += 0.35;
  if (category && !product) confidence += 0.15;
  if (maxPrice || minPrice) confidence += 0.15;
  if (quantity)            confidence += 0.10;
  if (location)            confidence += 0.10;
  if (maxDistance)         confidence += 0.05;
  if (clarification)       confidence -= 0.15;

  return {
    query,
    language,
    product,
    filters: {
      productName: product?.canonical || null,
      category:    category || null,
      maxPrice:    maxPrice || null,
      minPrice:    minPrice || null,
      quantity:    quantity || null,
      unit:        unit || (quantity ? 'kg' : null),
      location:    location || null,
      maxDistance: maxDistance || null,
    },
    sort,
    clarification,
    confidence: Math.min(1, Math.max(0, confidence)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. PRODUCT FILTERING & SMART RANKING
// ─────────────────────────────────────────────────────────────────────────────

export function filterAndRank(products, parsed) {
  const { filters, sort, query } = parsed;

  const hasStructuredFilter = filters.productName || filters.category || filters.maxPrice || filters.minPrice || filters.quantity || filters.location || filters.maxDistance;
  const rawTerm = (query || '').toLowerCase();

  // --- Filter ---
  let results = products.filter(p => {
    const pNameLower = (p.name || '').toLowerCase();
    const pDescLower = (p.description || '').toLowerCase();

    // If no structured fields were understood, do a raw text fallback
    if (!hasStructuredFilter) {
      if (!pNameLower.includes(rawTerm) && !pDescLower.includes(rawTerm)) {
        return false;
      }
      // If it passes basic text search, we don't need to check other structured filters
      return true;
    }

    // Product name match: check all synonym terms
    if (filters.productName) {
      const info = Object.values(PRODUCT_SYNONYMS).find(s => s.canonical === filters.productName);
      const terms = info?.terms || [filters.productName];
      const matches = terms.some(t => pNameLower.includes(t.toLowerCase()));
      if (!matches) return false;
    }

    // Category fallback (when no specific product)
    if (!filters.productName && filters.category) {
      if (p.category !== filters.category) return false;
    }

    // Price filters
    const price = Number(p.price);
    if (filters.maxPrice != null && price > filters.maxPrice) return false;
    if (filters.minPrice != null && price < filters.minPrice) return false;

    // Exclude out-of-stock
    if (p.status === 'Out of Stock') return false;

    // Location filter (loose substring)
    if (filters.location) {
      const loc = (p.location || p.farmerLocation || '').toLowerCase();
      if (!loc.includes(filters.location.toLowerCase())) return false;
    }

    // Distance filter
    if (filters.maxDistance != null) {
      const dist = Number(p.distanceValue) || 50; // Mock distance if undefined
      if (dist > filters.maxDistance) return false;
    }

    return true;
  });

  // --- Score & Rank ---
  results = results.map(p => {
    let score = 0;

    // Exact product name match → highest priority
    if (filters.productName) {
      const info = Object.values(PRODUCT_SYNONYMS).find(s => s.canonical === filters.productName);
      const terms = info?.terms || [];
      const pName = (p.name || '').toLowerCase();
      if (terms.some(t => pName === t.toLowerCase())) score += 30;
      else score += 15;
    }

    // Price satisfaction bonus (lower = better when user has maxPrice)
    if (filters.maxPrice) {
      const price = Number(p.price);
      const headroom = filters.maxPrice - price;
      score += Math.max(0, headroom / filters.maxPrice * 20);
    }

    // Quantity satisfaction
    if (filters.quantity && Number(p.quantity) >= filters.quantity) score += 15;

    // Availability
    if (p.status === 'Available') score += 10;
    else if (p.status === 'Low Stock') score += 3;

    // Nearness (smaller distanceValue = better)
    const dist = Number(p.distanceValue) || 50;
    score += Math.max(0, (50 - dist) / 50 * 5);

    return { ...p, _score: score };
  });

  // --- Sort ---
  if (sort === 'price_asc') {
    results.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price_desc') {
    results.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'quantity_desc') {
    results.sort((a, b) => Number(b.quantity) - Number(a.quantity));
  } else if (sort === 'nearest') {
    results.sort((a, b) => (Number(a.distanceValue) || 99) - (Number(b.distanceValue) || 99));
  } else {
    results.sort((a, b) => b._score - a._score);
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * smartSearch(query, allProducts) → { parsed, results, clarification }
 *
 * Designed for LLM drop-in: replace parseQuery() with an async LLM call
 * and filterAndRank() continues to work unchanged.
 */
export async function smartSearch(query, allProducts) {
  if (!query?.trim()) return { parsed: null, results: [], clarification: null };

  const parsed = parseQuery(query.trim(), allProducts);

  if (parsed.clarification) {
    return { parsed, results: [], clarification: parsed.clarification };
  }

  const results = filterAndRank(allProducts, parsed);
  return { parsed, results, clarification: null };
}
