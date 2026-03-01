import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Settings,
    Search,
    CheckCircle2,
    Loader2,
    Activity,
    AlertCircle
} from 'lucide-react';

interface AgentActivity {
    id: string;
    agent: string;
    action: string;
    status: 'working' | 'completed' | 'error';
    timestamp: string;
}

export default function AgentTimeline() {
    const [activities, setActivities] = useState<AgentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/activity');
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error("Error fetching agent activity:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
        const interval = setInterval(fetchActivity, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="m3-card p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base font-medium text-on-surface">AI Pipeline</h3>
                </div>
                <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest bg-surface-variant/50 px-1.5 py-0.5 rounded">Live</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {loading && activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-xs font-medium">Connecting...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {activities.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative pl-6 border-l-2 border-outline-variant/30 pb-0.5"
                            >
                                {/* Status Indicator Dot */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${item.status === 'working' ? 'bg-amber-500' :
                                    item.status === 'error' ? 'bg-red-500' : 'bg-green-500'
                                    }`}>
                                    {item.status === 'working' ? (
                                        <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
                                    ) : item.status === 'error' ? (
                                        <AlertCircle className="w-2.5 h-2.5 text-white" />
                                    ) : (
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                    )}
                                </div>

                                <div className="bg-surface-variant/10 rounded-xl p-3 border border-outline-variant/5 hover:border-primary/20 transition-colors group">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tight flex items-center gap-1">
                                            <Bot className="w-3 h-3" />
                                            {item.agent}
                                        </span>
                                        <span className="text-[9px] text-on-surface-variant font-mono">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-on-surface font-medium leading-tight group-hover:text-primary transition-colors">
                                        {item.action}
                                    </p>

                                    {item.status === 'working' && (
                                        <motion.div
                                            className="mt-2 h-0.5 w-full bg-outline-variant/10 rounded-full overflow-hidden"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="h-full w-full bg-primary origin-left animate-progress" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                        <Settings className="w-3 h-3" /> System Active
                    </span>
                    <span className="font-bold text-green-600">6 Agents</span>
                </div>
            </div>
        </div>
    );
}
