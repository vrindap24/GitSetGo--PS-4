import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Star,
  Clock,
  CheckCircle,
  Zap,
  TrendingUp,
  MessageCircle,
  Coffee
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip
} from 'recharts';

const CREDITS_DATA = [
  { name: 'Credits', value: 88, fill: 'var(--color-primary)' }
];

const PERFORMANCE_DATA = [
  { subject: 'Speed', A: 120, fullMark: 150 },
  { subject: 'Politeness', A: 98, fullMark: 150 },
  { subject: 'Accuracy', A: 86, fullMark: 150 },
  { subject: 'Upselling', A: 99, fullMark: 150 },
  { subject: 'Punctuality', A: 85, fullMark: 150 },
  { subject: 'Teamwork', A: 65, fullMark: 150 },
];

const COMPLIMENTS = [
  { id: 1, text: "Amishi was super fast with the refills!", author: "Table 4" },
  { id: 2, text: "Loved the dessert recommendation.", author: "Table 12" },
  { id: 3, text: "Very polite and smiling.", author: "Walk-in" },
];

const BADGES = [
  { id: 1, icon: Zap, label: 'Speedster', active: true },
  { id: 2, icon: Star, label: '5-Star Hero', active: true },
  { id: 3, icon: Coffee, label: 'Early Bird', active: false },
  { id: 4, icon: Award, label: 'Upsell King', active: false },
];

const CreditsScore = () => (
  <div className="m3-card p-6 flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
    <h3 className="text-lg font-medium text-on-surface absolute top-6 left-6">Service Credits</h3>
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" barSize={20} data={CREDITS_DATA} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-on-surface text-4xl font-bold font-sans">
            88
          </text>
          <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-on-surface-variant text-sm font-medium">
            Excellent
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
    <p className="text-xs text-on-surface-variant text-center absolute bottom-6">Top 5% in your branch!</p>
  </div>
);

const PunchCard = () => {
  const [punchedIn, setPunchedIn] = useState(false);

  return (
    <div className="m3-card p-6 flex flex-col justify-between h-[300px] bg-primary-container/20 border border-primary-container">
      <div>
        <h3 className="text-lg font-medium text-on-surface">Shift Status</h3>
        <p className="text-sm text-on-surface-variant">Tuesday, 14 Oct</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="text-3xl font-mono font-bold text-on-surface">09:41 AM</div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setPunchedIn(!punchedIn)}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-elevation-2 transition-colors ${punchedIn
              ? 'bg-error-container text-on-error-container hover:bg-error-container/80'
              : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
        >
          <Clock className="w-8 h-8 mb-2" />
          <span className="font-bold uppercase tracking-wider text-sm">{punchedIn ? 'Punch Out' : 'Punch In'}</span>
        </motion.button>
      </div>

      <div className="flex justify-between text-xs text-on-surface-variant">
        <span>Scheduled: 9:00 - 18:00</span>
        <span>Overtime: 0h</span>
      </div>
    </div>
  );
};

const PerformanceChart = () => (
  <div className="m3-card p-6 h-[400px]">
    <h3 className="text-lg font-medium text-on-surface mb-4">Skill Breakdown</h3>
    <ResponsiveContainer width="100%" height="90%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={PERFORMANCE_DATA}>
        <PolarGrid stroke="var(--color-outline-variant)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
        <Radar name="Amishi Verma" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-elevation-2)' }} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const ComplimentWall = () => (
  <div className="m3-card p-6 h-[400px] overflow-hidden flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-on-surface">Compliment Wall</h3>
      <MessageCircle className="w-5 h-5 text-secondary" />
    </div>

    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
      {COMPLIMENTS.map((comp) => (
        <div key={comp.id} className="p-4 bg-secondary-container/20 rounded-xl border border-secondary-container/40 relative">
          <div className="absolute -top-2 -left-2 bg-secondary text-on-secondary rounded-full p-1">
            <Star className="w-3 h-3" />
          </div>
          <p className="text-sm font-medium text-on-surface italic">"{comp.text}"</p>
          <p className="text-xs text-on-surface-variant mt-2 text-right">- {comp.author}</p>
        </div>
      ))}
      <div className="p-4 bg-surface-variant/30 rounded-xl border border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant text-sm">
        Keep it up to earn more!
      </div>
    </div>
  </div>
);

const DailyGoals = () => (
  <div className="m3-card p-6">
    <h3 className="text-lg font-medium text-on-surface mb-4">Daily Goals</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-on-surface">Collect 5 Reviews</span>
          <span className="text-primary font-bold">3/5</span>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-[60%]"></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-on-surface">Upsell 2 Desserts</span>
          <span className="text-primary font-bold">1/2</span>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2">
          <div className="bg-secondary h-2 rounded-full w-[50%]"></div>
        </div>
      </div>
    </div>
  </div>
);

const BadgeGrid = () => (
  <div className="m3-card p-6">
    <h3 className="text-lg font-medium text-on-surface mb-4">My Badges</h3>
    <div className="grid grid-cols-4 gap-4">
      {BADGES.map((badge) => (
        <div key={badge.id} className={`flex flex-col items-center text-center p-2 rounded-xl ${badge.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.active ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
            <badge.icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-on-surface">{badge.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const AIMotivation = () => (
  <div className="col-span-12 m3-card p-6 bg-surface text-on-surface flex items-center justify-between border border-outline-variant/20">
    <div>
      <h3 className="text-lg font-bold">Great job, Amishi Verma! 🚀</h3>
      <p className="text-on-surface-variant text-sm">You're responding 20% faster than last week. Keep focusing on the "Dessert" upsells to hit your weekly bonus.</p>
    </div>
    <button className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
      View Tips
    </button>
  </div>
);

export default function StaffDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6 pb-20">
      <AIMotivation />

      <div className="col-span-12 md:col-span-4 space-y-6">
        <CreditsScore />
      </div>

      <div className="col-span-12 md:col-span-4 space-y-6">
        <PerformanceChart />
        <DailyGoals />
      </div>

      <div className="col-span-12 md:col-span-4 space-y-6">
        <ComplimentWall />
        <BadgeGrid />
      </div>
    </div>
  );
}
