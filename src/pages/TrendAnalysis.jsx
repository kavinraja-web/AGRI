import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Info, 
  MapPin, AlertCircle, Sparkles, BarChart3, 
  PackageSearch, BellRing
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, Bar
} from 'recharts';
import { TREND_PRODUCTS, productTrends } from '../data/mockTrends';
import { useLanguage } from '../context/LanguageContext';

export default function TrendAnalysis() {
  const { lang } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(TREND_PRODUCTS[0]);
  const [timeRange, setTimeRange] = useState('30 Days');

  const data = productTrends[selectedProduct];
  if (!data) return null;

  // Calculate percentage change
  const priceChange = ((data.currentPrice - data.previousPrice) / data.previousPrice) * 100;
  const isPriceUp = priceChange > 0;
  
  const getOpportunityColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getOpportunityLabel = (score) => {
    if (score >= 80) return 'HIGH';
    if (score >= 50) return 'MODERATE';
    return 'LOW';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-earth-50 min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-forest-600" />
            Product Trend Analysis
          </h1>
          <p className="text-gray-600">Understand market trends to make better selling decisions.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-semibold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-forest-500"
          >
            {TREND_PRODUCTS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>
      </div>

      {/* Top Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.alerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 p-3 rounded-lg border ${
              alert.type === 'demand' ? 'bg-orange-50 border-orange-200 text-orange-800' :
              alert.type === 'supply' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              alert.type === 'opportunity' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              'bg-purple-50 border-purple-200 text-purple-800'
            }`}>
              {alert.type === 'demand' ? '🔥' : alert.type === 'supply' ? '⚠️' : alert.type === 'opportunity' ? '🌟' : '📈'}
              <span className="font-medium text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Price Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Current Price</p>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="text-3xl font-bold text-gray-900">₹{data.currentPrice}</h3>
            <span className="text-gray-500 mb-1">/{data.unit}</span>
          </div>
          <div className={`flex items-center text-sm font-semibold ${isPriceUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPriceUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(priceChange).toFixed(1)}% {isPriceUp ? 'Up' : 'Down'}
            <span className="text-gray-400 font-normal ml-2 text-xs">vs last week</span>
          </div>
        </div>

        {/* Demand Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Market Demand</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-1">
            {data.demandLevel === 'Very High' ? '🔥 Very High' : 
             data.demandLevel === 'High' ? '📈 High' : 
             data.demandLevel === 'Moderate' ? '⚖️ Moderate' : '📉 Low'}
          </h3>
          <div className={`flex items-center text-sm font-semibold ${data.demandChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {data.demandChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            Demand {data.demandChange > 0 ? 'increased' : 'decreased'} by {Math.abs(data.demandChange)}%
          </div>
        </div>

        {/* Supply Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Available Supply</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-1">
            {data.supplyQuantity.toLocaleString()} <span className="text-base font-normal text-gray-500">{data.unit}s</span>
          </h3>
          <div className={`flex items-center text-sm font-semibold ${data.supplyTrend < 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {data.supplyTrend < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
            Supply is {data.supplyTrend < 0 ? 'decreasing' : 'increasing'} ({Math.abs(data.supplyTrend)}%)
          </div>
        </div>

        {/* Opportunity Card */}
        <div className={`rounded-2xl p-5 border shadow-sm ${getOpportunityColor(data.opportunityScore)}`}>
          <p className="text-sm font-bold uppercase tracking-wide opacity-80 mb-1">Selling Opportunity</p>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="text-4xl font-extrabold">{data.opportunityScore}</h3>
            <span className="opacity-75 mb-1 font-medium">/ 100</span>
          </div>
          <p className="text-sm font-bold opacity-90">{getOpportunityLabel(data.opportunityScore)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Price vs Demand Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Price vs Demand Analysis ({timeRange})</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {/* Demand as an Area in the background */}
                  <Area yAxisId="right" type="monotone" dataKey="demand" name="Demand Score" fill="#fef3c7" stroke="#f59e0b" fillOpacity={0.5} />
                  {/* Price as a solid line */}
                  <Line yAxisId="left" type="monotone" dataKey="price" name={`Price (₹/${data.unit})`} stroke="#059669" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Market Insight */}
          <div className="bg-gradient-to-r from-forest-50 to-emerald-50 p-6 rounded-2xl border border-forest-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-forest-600" />
              <h3 className="text-lg font-bold text-forest-900">Market Insight</h3>
            </div>
            <p className="text-forest-800 leading-relaxed font-medium">
              "{data.insight}"
            </p>
            {data.forecast && (
              <div className="mt-4 pt-4 border-t border-forest-200 flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-forest-700">AI Expected Trend: </span>
                  <strong className="text-forest-900">{data.forecast}</strong>
                </div>
                <div className="text-sm">
                  <span className="text-forest-700">Confidence: </span>
                  <strong className="text-forest-900">{data.forecastConfidence}%</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Regional Comparison */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              Regional Comparison
            </h3>
            <div className="space-y-4">
              {data.regions.map((region, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">{region.market}</p>
                    <p className="text-xs text-gray-500">Demand: {region.demandStr}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{region.price}<span className="text-xs font-normal text-gray-500">/{data.unit}</span></p>
                    <p className={`text-xs font-semibold flex items-center justify-end ${region.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {region.change > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {Math.abs(region.change)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Demand Signals */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-gray-400" />
              Buyer Demand Signals
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Verified Buyer Requests</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {data.buyerDemand.toLocaleString()} <span className="text-base font-medium text-gray-500">{data.unit}s</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Aggregated from marketplace requirements
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
