import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Camera,
  QrCode,
  AlertCircle,
  TrendingUp,
  Flame,
  Snowflake
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const LIVE_REVIEWS = [
  { id: 1, user: 'Rahul K.', rating: 5, text: 'Amazing service by Amit!', time: 'Just now', tags: ['Service', 'Staff'] },
  { id: 2, user: 'Sneha P.', rating: 2, text: 'Food was cold.', time: '5m ago', tags: ['Food'], hasPhoto: true },
  { id: 3, user: 'Vikram S.', rating: 4, text: 'Great ambience but loud music.', time: '12m ago', tags: ['Ambience'] },
];

const PEAK_HOUR_DATA = [
  { time: '12 PM', sentiment: 4.5 },
  { time: '1 PM', sentiment: 3.8 },
  { time: '2 PM', sentiment: 3.2 },
  { time: '3 PM', sentiment: 4.0 },
  { time: '7 PM', sentiment: 4.8 },
  { time: '8 PM', sentiment: 4.6 },
  { time: '9 PM', sentiment: 4.1 },
];

const STAFF_LEADERBOARD = [
  { name: 'Amit Kumar', score: 98, mentions: 12 },
  { name: 'Priya Singh', score: 95, mentions: 8 },
  { name: 'Rajesh V.', score: 88, mentions: 5 },
];

const LiveReviewFeed = () => (
  <div className="m3-card p-6 h-[600px] flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-on-surface">Live Feed</h3>
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-xs text-on-surface-variant uppercase tracking-wider">Real-time</span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {LIVE_REVIEWS.map((review) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={review.id}
          className="p-4 rounded-xl bg-surface-variant/20 border border-outline-variant/20"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${review.rating >= 4 ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'
                }`}>
                {review.rating}★
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">{review.user}</p>
                <p className="text-xs text-on-surface-variant">{review.time}</p>
              </div>
            </div>
            {review.rating <= 2 && (
              <div className="flex items-center text-error text-xs font-bold bg-error-container px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 mr-1" /> 14:59
              </div>
            )}
          </div>

          <p className="text-sm text-on-surface mb-3">{review.text}</p>

          {review.hasPhoto && (
            <div className="mb-3">
              <div className="w-20 h-20 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <Camera className="w-6 h-6" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {review.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant">
                {tag}
              </span>
            ))}
            <button className="ml-auto text-xs font-medium text-primary hover:underline">Reply</button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const RecoveryTimerWidget = () => (
  <div className="m3-card p-6 bg-error-container/20 border border-error-container">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-error text-on-error rounded-xl shadow-lg">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-on-surface">Critical Recovery</h3>
        <p className="text-sm text-on-surface-variant mb-3">Table 4 (Family Section) reported cold food. 12 mins elapsed.</p>
        <div className="w-full bg-surface-variant rounded-full h-2 mb-2">
          <div className="bg-error h-2 rounded-full w-[60%]"></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-error font-bold">08:00 remaining</span>
          <button className="text-sm bg-error text-on-error px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
            Action Taken
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PeakHourChart = () => (
  <div className="m3-card p-6 h-[300px]">
    <h3 className="text-lg font-medium text-on-surface mb-4">Peak Hour Sentiment</h3>
    <ResponsiveContainer width="100%" height="85%">
      <LineChart data={PEAK_HOUR_DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
        <XAxis dataKey="time" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 5]} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-elevation-2)' }} />
        <Line type="monotone" dataKey="sentiment" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)' }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const DishHotCold = () => (
  <div className="m3-card p-6">
    <h3 className="text-lg font-medium text-on-surface mb-4">Dish Performance</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-surface-variant/30 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-error-container rounded-lg text-error">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Paneer Chilli</p>
            <p className="text-xs text-on-surface-variant">Trending Hot</p>
          </div>
        </div>
        <span className="text-sm font-bold text-primary">+24%</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-surface-variant/30 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-container rounded-lg text-primary">
            <Snowflake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Iced Tea</p>
            <p className="text-xs text-on-surface-variant">Trending Cold</p>
          </div>
        </div>
        <span className="text-sm font-bold text-error">-12%</span>
      </div>
    </div>
  </div>
);

const QRManager = () => (
  <div className="m3-card p-6 flex items-center justify-between bg-secondary-container/20 border border-secondary-container/50">
    <div>
      <h3 className="text-lg font-medium text-on-surface">QR Intake Points</h3>
      <p className="text-sm text-on-surface-variant">12 Active Points • 84 Scans Today</p>
    </div>
    <button className="m3-icon-button bg-secondary-container text-on-secondary-container">
      <QrCode className="w-6 h-6" />
    </button>
  </div>
);

export default function BranchDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6 pb-20">
      {/* Left Column: Feed */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <RecoveryTimerWidget />
        <LiveReviewFeed />
      </div>

      {/* Right Column: Analytics */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="m3-card p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Staff Stars</h3>
            <div className="space-y-3">
              {STAFF_LEADERBOARD.map((staff, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-on-surface-variant">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="text-sm text-on-surface">{staff.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-on-surface-variant">{staff.mentions} mentions</span>
                    <span className="text-sm font-bold text-primary">{staff.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DishHotCold />
        </div>

        <PeakHourChart />
        <QRManager />
      </div>
    </div>
  );
}
