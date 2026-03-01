import React, { useEffect, useState } from 'react';
import { Database, Brain, Tags, PenTool, Lightbulb, ShieldAlert, Activity } from 'lucide-react';

const AGENTS = [
    { id: 'extraction', name: 'Extraction', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'sentiment', name: 'Sentiment', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'categ', name: 'Categorization', icon: Tags, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'drafting', name: 'Drafting', icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'insights', name: 'Insights', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'escalation', name: 'Escalation', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' }
];

export default function LiveAgentsNetwork() {
    const [activeAgents, setActiveAgents] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/activity');
                const data = await response.json();
                const active: Record<string, boolean> = {};

                data.forEach((activity: any) => {
                    if (activity.status === 'working') {
                        const actStr = (activity.agent + " " + activity.action).toLowerCase();
                        if (actStr.includes('extract')) active['extraction'] = true;
                        else if (actStr.includes('sentiment')) active['sentiment'] = true;
                        else if (actStr.includes('categor')) active['categ'] = true;
                        else if (actStr.includes('draft') || actStr.includes('respon')) active['drafting'] = true;
                        else if (actStr.includes('insight')) active['insights'] = true;
                        else if (actStr.includes('escalat')) active['escalation'] = true;
                    }
                });

                // If data is empty, maybe periodically "fake" activity for visual flair if we want to show it's alive, 
                // but let's stick to true state for now.
                setActiveAgents(active);
            } catch (error) {
                console.error("Error fetching agent activity:", error);
            }
        };

        fetchActivity();
        const interval = setInterval(fetchActivity, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="m3-card p-6 border-2 border-primary/20 bg-surface-container-lowest shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-on-surface">Live AI Pipeline</h3>
                    <p className="text-sm text-on-surface-variant">Real-time status of the 6-Agent cognitive architecture</p>
                </div>
                <span className="ml-auto flex items-center gap-2 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {AGENTS.map(agent => {
                    const isActive = activeAgents[agent.id];
                    const Icon = agent.icon;

                    return (
                        <div
                            key={agent.id}
                            className={`relative p-5 rounded-[24px] border-2 transition-all duration-500 ${isActive ? 'bg-primary-container/20 border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] scale-105' : 'bg-surface border-outline-variant/10'}`}
                        >
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className={`p-4 rounded-full ${agent.bg} relative transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}>
                                    <Icon className={`w-8 h-8 ${agent.color}`} />
                                    {isActive && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-on-surface mb-1">{agent.name}</h4>
                                    <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isActive ? 'text-primary animate-pulse' : 'text-on-surface-variant/70'}`}>
                                        {isActive ? 'PROCESSING...' : 'STANDBY'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
