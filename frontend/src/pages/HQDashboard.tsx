import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  MapPin,
  Star,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { BRANCHES, REVIEWS } from '../data/mockData';
import AgentTimeline from '../components/AgentTimeline';
import { fetchReviews } from '../services/apiService';
import { ReviewBackend } from '../types';

// --- DATA MAPPING ---

const getBranchName = (id: string) => {
  const branch = BRANCHES.find(b => b.id === id || b.name.includes(id) || id.includes(b.location));
  return branch ? branch.name : (id.length > 10 ? 'Main Branch' : id);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

// --- MOCK DATA ---

const SENTIMENT_DATA = [
  { category: 'Food', positive: 85, negative: 15 },
  { category: 'Staff', positive: 65, negative: 35 },
  { category: 'Ambience', positive: 92, negative: 8 },
  { category: 'Delivery', positive: 45, negative: 55 },
  { category: 'Hygiene', positive: 98, negative: 2 },
];

const REVENUE_SENTIMENT_DATA = [
  { time: '10 AM', revenue: 4000, sentiment: 4.2 },
  { time: '12 PM', revenue: 12000, sentiment: 4.5 },
  { time: '2 PM', revenue: 18000, sentiment: 3.8 },
  { time: '4 PM', revenue: 8000, sentiment: 4.6 },
  { time: '6 PM', revenue: 22000, sentiment: 4.1 },
  { time: '8 PM', revenue: 35000, sentiment: 3.5 },
  { time: '10 PM', revenue: 28000, sentiment: 4.0 },
];

const BRANCH_DATA = BRANCHES.map((branch, index) => ({
  id: branch.id,
  name: branch.name,
  purity: branch.purityScore,
  responseTime: `${Math.floor(Math.random() * 45 + 5)}m`, // Mock response time
  trend: Math.random() > 0.5 ? 'up' : 'down',
  rank: index + 1 // Assuming BRANCHES is somewhat ordered or we can sort
})).sort((a, b) => b.purity - a.purity).map((b, i) => ({ ...b, rank: i + 1 }));

const ALERTS = REVIEWS
  .filter(r => (r.urgencyScore && r.urgencyScore > 5) || r.sentiment === 'Negative')
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)
  .map(r => ({
    id: r.id,
    branch: getBranchName(r.branchId),
    text: r.text,
    rating: r.rating,
    time: formatTime(r.date),
    urgent: (r.urgencyScore || 0) > 7
  }));

// --- MAP CONFIG ---

const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10]
});

const MAP_LOCATIONS = BRANCHES.map(b => ({
  id: b.id,
  name: b.location,
  purity: b.purityScore,
  lat: b.coordinates.lat,
  lng: b.coordinates.lng,
  color: b.status === 'Green' ? '#0F9D58' : b.status === 'Yellow' ? '#F4B400' : '#DB4437'
}));

// --- WIDGETS ---

const NetworkHealthMap = () => (
  <div className="m3-card p-0 h-[400px] relative overflow-hidden group flex flex-col">
    <div className="absolute top-4 left-4 z-[400] bg-surface/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-outline-variant/20">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-lg font-medium text-on-surface">Network Health</h3>
          <p className="text-xs text-on-surface-variant">Live purity scores across India</p>
        </div>
        <button className="m3-icon-button ml-2"><MoreVertical className="w-5 h-5 text-on-surface-variant" /></button>
      </div>
    </div>

    <div className="flex-1 w-full h-full z-0">
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; Google Maps'
        />
        {MAP_LOCATIONS.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createCustomIcon(loc.color)}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-sm">{loc.name}</h3>
                <p className="text-xs">Purity: {loc.purity}%</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>

    <div className="absolute bottom-4 left-4 z-[400] flex space-x-3 bg-surface/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-outline-variant/20">
      <div className="flex items-center space-x-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D58]"></span>
        <span className="text-[10px] font-medium text-on-surface-variant">Excellent (&gt;95%)</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F4B400]"></span>
        <span className="text-[10px] font-medium text-on-surface-variant">Good (90-95%)</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#DB4437]"></span>
        <span className="text-[10px] font-medium text-on-surface-variant">Critical (&lt;90%)</span>
      </div>
    </div>
  </div>
);

const RedAlertFeed = ({ reviews, loading }: { reviews: ReviewBackend[], loading: boolean }) => {
  const alerts = reviews
    .filter(r => (r.ai_analysis?.risk_score && r.ai_analysis.risk_score > 50) || r.ai_analysis?.sentiment_label === 'Negative')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="m3-card p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <h3 className="text-lg font-medium text-error">Live Red Alerts</h3>
        </div>
        <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded-full">
          {loading ? '...' : alerts.length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full opacity-50">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <p className="text-sm font-medium">All clear! No red alerts.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {getBranchName(alert.branch_id)}
                </span>
                <span className="text-xs text-error font-mono flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {formatTime(alert.timestamp)}
                </span>
              </div>
              <p className="text-sm text-on-surface font-medium mb-3 line-clamp-2">"{alert.review_text}"</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < alert.rating ? 'fill-secondary text-secondary' : 'text-outline-variant'}`} />
                    ))}
                  </div>
                  {alert.ai_analysis?.risk_score && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                      Risk: {alert.ai_analysis.risk_score}%
                    </span>
                  )}
                </div>
                <button className="text-xs bg-error text-on-error px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  Escalate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const BranchLeaderboard = () => (
  <div className="m3-card p-6">
    <h3 className="text-lg font-medium text-on-surface mb-4">Branch Leaderboard</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant/20">
            <th className="pb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider pl-2">Rank</th>
            <th className="pb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Branch</th>
            <th className="pb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Purity</th>
            <th className="pb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Resp. Time</th>
            <th className="pb-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-center">Trend</th>
          </tr>
        </thead>
        <tbody>
          {BRANCH_DATA.map((branch) => (
            <tr key={branch.id} className="group hover:bg-surface-variant/20 transition-colors border-b border-outline-variant/10 last:border-0">
              <td className="py-4 pl-2 font-mono text-sm text-on-surface-variant">#{branch.rank}</td>
              <td className="py-4 font-medium text-sm text-on-surface">{branch.name}</td>
              <td className="py-4 text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${branch.purity >= 95 ? 'bg-primary-container text-on-primary-container' :
                  branch.purity >= 90 ? 'bg-secondary-container text-on-secondary-container' :
                    'bg-error-container text-on-error-container'
                  }`}>
                  {branch.purity}%
                </span>
              </td>
              <td className="py-4 text-right text-sm text-on-surface-variant font-mono">{branch.responseTime}</td>
              <td className="py-4 text-center">
                {branch.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-primary inline" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-error inline" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CategorySentiment = () => (
  <div className="m3-card p-6 h-[320px]">
    <h3 className="text-lg font-medium text-on-surface mb-6">Sentiment Breakdown</h3>
    <ResponsiveContainer width="100%" height="80%">
      <BarChart layout="vertical" data={SENTIMENT_DATA} margin={{ top: 0, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" opacity={0.3} />
        <XAxis type="number" hide />
        <YAxis dataKey="category" type="category" width={80} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-elevation-2)' }}
          cursor={{ fill: 'var(--color-surface-variant)', opacity: 0.2 }}
        />
        {/* Google Blue for positive */}
        <Bar dataKey="positive" stackId="a" fill="#4285F4" radius={[0, 4, 4, 0]} barSize={20} />
        {/* Google Red for negative */}
        <Bar dataKey="negative" stackId="a" fill="#DB4437" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const RevenueChart = () => (
  <div className="m3-card p-6 h-[320px]">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-on-surface">Revenue vs Sentiment</h3>
      <div className="flex space-x-4 text-xs">
        <div className="flex items-center"><span className="w-2 h-2 bg-[#0F9D58] rounded-full mr-2"></span>Revenue</div>
        <div className="flex items-center"><span className="w-2 h-2 bg-[#F4B400] rounded-full mr-2"></span>Sentiment</div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <AreaChart data={REVENUE_SENTIMENT_DATA}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F9D58" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#0F9D58" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
        <XAxis dataKey="time" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-elevation-2)' }} />
        {/* Google Green for Revenue */}
        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0F9D58" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
        {/* Google Yellow for Sentiment */}
        <Line yAxisId="right" type="monotone" dataKey="sentiment" stroke="#F4B400" strokeWidth={2} dot={{ r: 4, fill: '#F4B400' }} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const MenuIntelligence = () => (
  <div className="m3-card p-6">
    <h3 className="text-lg font-medium text-on-surface mb-4">Menu Intelligence</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-primary-container/30 rounded-xl border border-primary-container">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary uppercase">Hero Dish</span>
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
        <p className="font-medium text-on-surface">Paneer Butter Masala</p>
        <p className="text-xs text-on-surface-variant mt-1">+14% Positive Mentions</p>
      </div>
      <div className="p-4 bg-error-container/30 rounded-xl border border-error-container">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-error uppercase">Zero Dish</span>
          <ArrowDownRight className="w-4 h-4 text-error" />
        </div>
        <p className="font-medium text-on-surface">Lemon Soda</p>
        <p className="text-xs text-on-surface-variant mt-1">-8% Negative Trend</p>
      </div>
    </div>
  </div>
);

const AIInsightCard = ({ insight, loading }: { insight: any, loading: boolean }) => (
  <div className="m3-card p-6 bg-tertiary-container/20 border border-tertiary-container/50">
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-tertiary-container rounded-lg">
        <Sparkles className="w-6 h-6 text-on-tertiary-container" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-on-surface mb-1">Daily Executive Summary</h3>
        {loading ? (
          <div className="h-4 w-64 bg-surface-variant/30 animate-pulse rounded mt-2" />
        ) : (
          <>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {insight?.summary || "AI is currently aggregating network data. Check back in a few minutes for a fresh executive summary."}
            </p>
            {insight?.recommendations && insight.recommendations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {insight.recommendations.slice(0, 2).map((rec: string, i: number) => (
                  <span key={i} className="text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full font-medium">
                    Recommendation: {rec}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
export default function HQDashboard() {
  const [reviews, setReviews] = React.useState<ReviewBackend[]>([]);
  const [insight, setInsight] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [insightLoading, setInsightLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadInsight = async () => {
      try {
        // Just pick Powai as a placeholder for HQ overview for now
        // In a real app, this would be a network-wide insight
        const response = await fetch('http://localhost:8000/api/v1/insights/branch?branch_id=Powai&days=7');
        if (response.ok) {
          const data = await response.json();
          setInsight(data);
        }
      } catch (error) {
        console.warn("Failed to load insights:", error);
      } finally {
        setInsightLoading(false);
      }
    };

    loadData();
    loadInsight();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 pb-20">
      {/* Row 1: Top Level Map (Left) and Agents (Right) */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <NetworkHealthMap />
        <RedAlertFeed reviews={reviews} loading={loading} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <AgentTimeline />
      </div>

      {/* Row 2: AI Insight */}
      <div className="col-span-12">
        <AIInsightCard insight={insight} loading={insightLoading} />
      </div>

      {/* Row 3: Detailed Metrics */}
      <div className="col-span-12 lg:col-span-6">
        <BranchLeaderboard />
      </div>
      <div className="col-span-12 lg:col-span-6 grid grid-cols-1 gap-6">
        <MenuIntelligence />
        <CategorySentiment />
      </div>

      {/* Row 4: Revenue */}
      <div className="col-span-12">
        <RevenueChart />
      </div>
    </div>
  );
}
