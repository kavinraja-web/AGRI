import { PRODUCT_SYNONYMS } from '../services/smartSearchService';

const ADJECTIVES = {
  'fresh': 'புதிய',
  'red': 'சிவப்பு',
  'farm': 'பண்ணை',
  'organic': 'இயற்கை',
  'raw': 'பச்சை',
  'premium': 'உயர்தர',
  'green': 'பச்சை',
  'sweet': 'இனிப்பான',
  'ponni': 'பொன்னி',
  'banganapalli': 'பங்கனப்பள்ளி',
  'dry': 'உலர்',
  'desi': 'நாட்டு'
};

export function translateProductName(name, lang) {
  if (lang !== 'ta' || !name) return name;

  const lowerName = name.toLowerCase();

  // 1. Identify base product
  let baseProductTa = null;
  let matchedTerm = null;

  // Sort by length to match longest synonyms first (e.g. "watermelon" before "melon")
  const allTerms = [];
  for (const info of Object.values(PRODUCT_SYNONYMS)) {
    for (const term of info.terms) {
      // Only match against english letters
      if (/^[a-z\s]+$/.test(term)) {
        allTerms.push({ term, ta: info.displayTa });
      }
    }
  }
  allTerms.sort((a, b) => b.term.length - a.term.length);

  for (const item of allTerms) {
    // strict word boundary match to avoid 'potato' matching inside 'sweet potato' if order gets messed up
    // but includes is safer for plurals/etc since we sort by length.
    if (lowerName.includes(item.term)) {
      baseProductTa = item.ta;
      matchedTerm = item.term;
      break;
    }
  }

  if (!baseProductTa) return name; // No match, return original English name

  // 2. Identify adjectives
  let adjPrefix = [];
  for (const [adjEn, adjTa] of Object.entries(ADJECTIVES)) {
    // Only add adjective if it's not part of the matched term itself
    if (lowerName.includes(adjEn) && !matchedTerm.includes(adjEn)) {
      adjPrefix.push(adjTa);
    }
  }

  // 3. Handle specific suffixes like "(Raw)" or "(Dry)"
  let suffix = '';
  if (lowerName.includes('(raw)')) suffix = ' (பச்சை)';
  if (lowerName.includes('(dry)')) suffix = ' (உலர்)';

  let translated = '';
  if (adjPrefix.length > 0) {
    translated = adjPrefix.join(' ') + ' ' + baseProductTa;
  } else {
    translated = baseProductTa;
  }

  return translated + suffix;
}
