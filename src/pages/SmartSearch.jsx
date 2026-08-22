import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Mic, Sparkles, X, Loader2, ArrowRight, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { smartSearch } from '../services/smartSearchService';
import { useLanguage } from '../context/LanguageContext';

// ─── Example Queries per language ─────────────────────────────────────────────
const EXAMPLES = {
  en: [
    { label: 'Tomatoes under ₹30',              icon: '🍅' },
    { label: '100 kg onions near Chennai',       icon: '🧅' },
    { label: 'Cheapest tomatoes',                icon: '💰' },
    { label: 'Vegetables under ₹50',             icon: '🥬' },
    { label: '100 kg rice under ₹45 per kg',     icon: '🍚' },
    { label: 'Bananas near Kanchipuram',         icon: '🍌' },
  ],
  ta: [
    { label: '30 ரூபாய்க்குள் தக்காளி',           icon: '🍅' },
    { label: '100 கிலோ வெங்காயம்',               icon: '🧅' },
    { label: 'சென்னைக்கு அருகில் தக்காளி',         icon: '📍' },
    { label: '50க்குள் காய்கறிகள் காட்டு',         icon: '🥬' },
    { label: '100 கிலோ அரிசி 45 ரூபாய்க்குள்',   icon: '🍚' },
    { label: 'காஞ்சிபுரத்தில் வாழைப்பழம்',        icon: '🍌' },
  ],
};

// Tanglish examples always shown as a third row
const TANGLISH_EXAMPLES = [
  { label: '30 rupees kulla thakkali venum',      icon: '🍅' },
  { label: 'Chennai pakkathula tomato kaatu',     icon: '📍' },
  { label: '100 kg thakkali venum',               icon: '🧅' },
];

// ─── Intent Chip component ────────────────────────────────────────────────────
function IntentChip({ icon, label, color }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SmartSearch() {
  const { lang } = useLanguage();

  const [query, setQuery]           = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults]       = useState([]);
  const [parsedIntent, setParsedIntent] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [loadingStep, setLoadingStep] = useState(null); // 'understanding' | 'finding'
  const [hasSearched, setHasSearched] = useState(false);
  const [dbReady, setDbReady]       = useState(false);
  const [showTanglish, setShowTanglish] = useState(false);
  const inputRef = useRef(null);

  // Load ALL products once (smart search filters client-side)
  useEffect(() => {
    getProducts({}).then(data => {
      setAllProducts(data || []);
      setDbReady(true);
    });
  }, []);

  // ── Execute search ──────────────────────────────────────────────────────────
  const executeSearch = useCallback(async (q) => {
    if (!q?.trim() || !dbReady) return;
    setHasSearched(true);
    setClarification(null);
    setResults([]);
    setParsedIntent(null);

    // Step 1: animate "Understanding..."
    setLoadingStep('understanding');
    await new Promise(r => setTimeout(r, 700));

    // Step 2: animate "Finding farmers..."
    setLoadingStep('finding');
    await new Promise(r => setTimeout(r, 500));

    const { parsed, results: res, clarification: clar } = await smartSearch(q, allProducts);

    setParsedIntent(parsed);
    setResults(res);
    setClarification(clar);
    setLoadingStep(null);
  }, [allProducts, dbReady]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    executeSearch(query);
  };

  const handleExample = (exLabel) => {
    setQuery(exLabel);
    executeSearch(exLabel);
    inputRef.current?.focus();
  };

  const handleClarification = (option) => {
    let newQ = query;
    if (option.value === 'maxprice') newQ += ` under ₹${option.param}`;
    else if (option.value === 'quantity') newQ += ` ${option.param} kg`;
    setQuery(newQ);
    executeSearch(newQ);
  };

  const clearSearch = () => {
    setQuery('');
    setHasSearched(false);
    setParsedIntent(null);
    setResults([]);
    setClarification(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const examples = EXAMPLES[lang === 'ta' ? 'ta' : 'en'];
  const isLoading = !!loadingStep;

  // Sort label helper
  const sortLabel = (sort) => {
    const map = {
      price_asc:      lang === 'ta' ? 'குறைந்த விலை முதலில்'    : 'Cheapest first',
      price_desc:     lang === 'ta' ? 'அதிக விலை முதலில்'       : 'Most expensive first',
      quantity_desc:  lang === 'ta' ? 'அதிக அளவு முதலில்'       : 'Most available first',
      nearest:        lang === 'ta' ? 'அருகில் உள்ளவை முதலில்'  : 'Nearest first',
    };
    return map[sort] || sort;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-forest-50/40 to-white">

      {/* ── Hero Search Section ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">

        {/* Badge + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-forest-50 border border-forest-200 text-forest-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            {lang === 'ta' ? 'AI ஸ்மார்ட் தேடல்' : 'AI Smart Search'}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {lang === 'ta' ? 'இயற்கை மொழியில் தேடுங்கள்' : 'Search in Natural Language'}
          </h1>
          <p className="text-gray-500 text-lg">
            {lang === 'ta'
              ? 'தமிழ், ஆங்கிலம் அல்லது Tanglish — எந்த மொழியிலும் தேடலாம்'
              : 'English, Tamil, or Tanglish — we understand all three'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex items-center bg-white rounded-2xl shadow-lg border-2 border-forest-100 focus-within:border-forest-400 transition-all overflow-hidden">
            <Search className="ml-4 h-5 w-5 text-forest-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'ta'
                  ? 'தக்காளி, வெங்காயம் போன்றவற்றை தேடுங்கள்...'
                  : 'Ask FarmConnect anything... e.g. "Tomatoes under ₹30"'
              }
              className="flex-1 px-3 py-4 text-gray-900 text-lg outline-none bg-transparent placeholder-gray-400"
              autoFocus
            />
            {query && (
              <button type="button" onClick={clearSearch} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Mic placeholder — voice search coming soon */}
            <button
              type="button"
              title={lang === 'ta' ? 'குரல் தேடல் விரைவில் வருகிறது' : 'Voice search coming soon'}
              className="p-3 text-gray-300 cursor-not-allowed"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!query.trim() || isLoading || !dbReady}
              className="mr-2 bg-forest-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
            >
              {isLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <ArrowRight className="h-4 w-4" />
              }
              <span className="hidden sm:inline">{lang === 'ta' ? 'தேடு' : 'Search'}</span>
            </button>
          </div>
        </form>

        {/* Example Queries */}
        {!hasSearched && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(ex.label)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm px-3.5 py-2 rounded-full hover:bg-forest-50 hover:border-forest-300 hover:text-forest-700 transition-all shadow-sm"
                >
                  <span>{ex.icon}</span>
                  <span>{ex.label}</span>
                </button>
              ))}
            </div>

            {/* Tanglish toggle */}
            <div className="text-center">
              <button
                onClick={() => setShowTanglish(v => !v)}
                className="text-xs text-gray-400 hover:text-forest-600 underline underline-offset-2"
              >
                {showTanglish
                  ? (lang === 'ta' ? 'Tanglish உதாரணங்களை மறை' : 'Hide Tanglish examples')
                  : (lang === 'ta' ? 'Tanglish உதாரணங்களை காட்டு' : 'Show Tanglish examples')}
              </button>
              {showTanglish && (
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {TANGLISH_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleExample(ex.label)}
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-3.5 py-2 rounded-full hover:bg-amber-100 transition-all"
                    >
                      <span>{ex.icon}</span>
                      <span className="font-mono text-xs">{ex.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Results Area ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-14">

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="max-w-3xl mx-auto">
            {/* Intent skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded-full w-28" />
                <div className="h-8 bg-gray-100 rounded-full w-36" />
                <div className="h-8 bg-gray-100 rounded-full w-24" />
              </div>
            </div>
            {/* Step label */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Loader2 className="h-5 w-5 animate-spin text-forest-600" />
              <span className="text-gray-600 font-medium">
                {loadingStep === 'understanding'
                  ? (lang === 'ta' ? 'உங்கள் தேடலை புரிந்துகொள்கிறது...' : 'Understanding your search...')
                  : (lang === 'ta' ? 'பொருத்தமான விவசாயிகளை தேடுகிறது...' : 'Finding matching farmers...')}
              </span>
            </div>
            {/* Product card skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* Clarification needed */}
        {!isLoading && clarification && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-7 mb-6 text-center">
            <div className="text-4xl mb-3">🤔</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {lang === 'ta' ? 'தெளிவுபடுத்தல் தேவை' : 'Just to clarify...'}
            </h3>
            <p className="text-gray-600 mb-5">
              {lang === 'ta' ? clarification.messageTa : clarification.message}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {clarification.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleClarification(opt)}
                  className="bg-forest-50 border border-forest-300 text-forest-700 font-semibold px-5 py-2.5 rounded-full hover:bg-forest-600 hover:text-white hover:border-forest-600 transition-all text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Understanding card */}
        {!isLoading && parsedIntent && !clarification && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl border border-forest-100 shadow-sm p-5">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
                {lang === 'ta' ? '🔍 தேடல் புரிதல்' : '🔍 Search Understanding'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {parsedIntent.product && (
                  <IntentChip
                    icon={parsedIntent.product.emoji}
                    label={lang === 'ta' ? parsedIntent.product.displayTa : parsedIntent.product.displayEn}
                    color="bg-green-50 text-green-700 border-green-200"
                  />
                )}
                {!parsedIntent.product && parsedIntent.filters.category && (
                  <IntentChip
                    icon="🗂️"
                    label={parsedIntent.filters.category}
                    color="bg-teal-50 text-teal-700 border-teal-200"
                  />
                )}
                {parsedIntent.filters.maxPrice != null && (
                  <IntentChip
                    icon="💰"
                    label={`≤ ₹${parsedIntent.filters.maxPrice}${parsedIntent.filters.unit ? '/'+parsedIntent.filters.unit : '/kg'}`}
                    color="bg-blue-50 text-blue-700 border-blue-200"
                  />
                )}
                {parsedIntent.filters.minPrice != null && (
                  <IntentChip
                    icon="💰"
                    label={`≥ ₹${parsedIntent.filters.minPrice}${parsedIntent.filters.unit ? '/'+parsedIntent.filters.unit : '/kg'}`}
                    color="bg-blue-50 text-blue-700 border-blue-200"
                  />
                )}
                {parsedIntent.filters.quantity != null && (
                  <IntentChip
                    icon="📦"
                    label={`${parsedIntent.filters.quantity} ${parsedIntent.filters.unit || 'kg'} ${lang === 'ta' ? 'தேவை' : 'needed'}`}
                    color="bg-purple-50 text-purple-700 border-purple-200"
                  />
                )}
                {parsedIntent.filters.location && (
                  <IntentChip
                    icon="📍"
                    label={parsedIntent.filters.location}
                    color="bg-orange-50 text-orange-700 border-orange-200"
                  />
                )}
                {parsedIntent.sort && (
                  <IntentChip
                    icon="↕️"
                    label={sortLabel(parsedIntent.sort)}
                    color="bg-gray-50 text-gray-600 border-gray-200"
                  />
                )}
                {/* Language badge */}
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 font-semibold border border-forest-100">
                  {{ en: '🇬🇧 EN', ta: '🇮🇳 தமிழ்', tanglish: '✨ Tanglish', mixed: '🔀 Mixed' }[parsedIntent.language] || parsedIntent.language}
                </span>
                {/* Confidence */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  parsedIntent.confidence > 0.7
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : parsedIntent.confidence > 0.4
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {Math.round(parsedIntent.confidence * 100)}% {lang === 'ta' ? 'நம்பகம்' : 'confidence'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results count + grid */}
        {!isLoading && hasSearched && !clarification && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {results.length > 0
                    ? `${results.length} ${lang === 'ta' ? 'விளைபொருட்கள் கிடைத்தன' : results.length === 1 ? 'produce found' : 'produce found'}`
                    : (lang === 'ta' ? 'விளைபொருட்கள் கிடைக்கவில்லை' : 'No produce found')}
                </h2>
                {results.length > 0 && query && (
                  <p className="text-gray-500 text-sm">
                    {lang === 'ta' ? `"${query}" க்கான முடிவுகள்` : `Results for "${query}"`}
                  </p>
                )}
              </div>
              {hasSearched && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-forest-600 border border-gray-200 px-4 py-1.5 rounded-full transition-colors"
                >
                  {lang === 'ta' ? 'மீண்டும் தேடு' : 'New Search'}
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-10 border border-gray-100 shadow-sm mt-4">
                <div className="text-5xl mb-4">🌾</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {lang === 'ta' ? 'மன்னிக்கவும்' : 'No matching produce'}
                </h3>
                <p className="text-gray-500 mb-2">
                  {lang === 'ta'
                    ? 'மன்னிக்கவும், இந்த தேடலுக்கு பொருத்தமான விளைபொருட்கள் கிடைக்கவில்லை.'
                    : 'No matching produce was found for your search.'}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  {lang === 'ta'
                    ? 'விலை வரம்பை அதிகரிக்கவும் அல்லது இட வரம்பை நீக்கவும்.'
                    : 'Try increasing your price range or removing the location filter.'}
                </p>
                <button onClick={clearSearch} className="btn-secondary">
                  {lang === 'ta' ? 'மீண்டும் தேடுங்கள்' : 'Try another search'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state — no search yet */}
        {!hasSearched && !isLoading && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: '🗣️',
                  title: lang === 'ta' ? '3 மொழிகளில் தேடு' : 'Search in 3 languages',
                  desc: lang === 'ta'
                    ? 'தமிழ், ஆங்கிலம் அல்லது Tanglish-ல் தேடுங்கள்'
                    : 'English, Tamil or Tanglish — we understand all',
                },
                {
                  icon: '🎯',
                  title: lang === 'ta' ? 'துல்லியமான வடிகட்டல்' : 'Smart Filtering',
                  desc: lang === 'ta'
                    ? 'விலை, அளவு, இடம் — தானாகவே புரிந்துகொள்கிறது'
                    : 'Price, quantity, location — all understood automatically',
                },
                {
                  icon: '🚫',
                  title: lang === 'ta' ? 'கற்பனை இல்லை' : 'Zero Hallucinations',
                  desc: lang === 'ta'
                    ? 'உண்மையான தரவுத்தளத்திலிருந்து மட்டும் முடிவுகள்'
                    : 'Only real products from Supabase — never invented',
                },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Demo queries for hackathon */}
            <div className="mt-8 bg-forest-50 rounded-2xl border border-forest-100 p-5">
              <p className="text-xs font-bold text-forest-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'ta' ? 'டெமோ தேடல்கள் — கிளிக் செய்து பாருங்கள்' : 'Demo queries — click to try'}
              </p>
              <div className="space-y-2 text-sm text-forest-800 font-mono">
                {[
                  '"Find tomatoes under ₹30"',
                  '"100 kg tomatoes under ₹35 near Chennai"',
                  '"30 ரூபாய்க்குள் தக்காளி காட்டு"',
                  '"30 rupees kulla thakkali venum"',
                  '"Cheapest tomatoes near Kanchipuram"',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(q.replace(/"/g, ''))}
                    className="block text-left w-full hover:text-forest-600 transition-colors truncate"
                  >
                    <span className="text-forest-400 mr-2">{i + 1}.</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
