/**
 * SignupCard — Clean, elevated signup form card.
 *
 * Pure UI component. No API logic.
 * Receives onLogin callback for demo authentication.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { User } from '../types';

/* ── Demo users ─────────────────────────────────────────────────────── */
const DEMO_USERS: User[] = [
    { id: 'u1', name: 'HQ Administrator', email: 'hq@reflo.app', role: 'HQ' },
    { id: 'u2', name: 'Branch Manager', email: 'branch@reflo.app', role: 'BRANCH', branchId: 'b1' },
    { id: 'u3', name: 'Amit Sharma', email: 'staff@reflo.app', role: 'STAFF', branchId: 'b1' },
];

/* ── Component ──────────────────────────────────────────────────────── */
interface SignupCardProps {
    onLogin: (user: User) => void;
}

export default function SignupCard({ onLogin }: SignupCardProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const user = DEMO_USERS.find(u => u.email === email);
            if (user && password === 'password') {
                onLogin(user);
                navigate('/');
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative z-20 w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-amber-900/8 border border-amber-100/40 p-10"
        >
            {/* ── Logo + Title ──────────────────────────────────────────── */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-800/20 mb-4">
                    <RotateCw className="w-5 h-5 text-amber-100 stroke-[2.5]" />
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Welcome to Reflo
                </h1>
                <p className="mt-1.5 text-sm text-gray-400 font-medium text-center leading-relaxed">
                    AI-powered reputation intelligence.
                </p>
            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label htmlFor="signup-email" className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                    </label>
                    <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@reflo.app"
                        autoComplete="email"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 placeholder-gray-300 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all duration-200"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label htmlFor="signup-password" className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Password
                    </label>
                    <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 placeholder-gray-300 text-sm font-medium tracking-widest
              focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all duration-200"
                    />
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2"
                    >
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-red-600">{error}</span>
                    </motion.div>
                )}

                {/* Demo credentials */}
                <div className="text-xs text-center text-gray-400 bg-amber-50/40 p-3 rounded-xl border border-amber-100/50">
                    <p className="font-semibold text-gray-500 mb-1">Demo Credentials</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] leading-tight">
                        <div><span className="block font-bold text-gray-500">HQ</span>hq@reflo.app</div>
                        <div><span className="block font-bold text-gray-500">Branch</span>branch@reflo.app</div>
                        <div><span className="block font-bold text-gray-500">Staff</span>staff@reflo.app</div>
                    </div>
                    <p className="mt-1 text-gray-300 text-[10px]">Password: password</p>
                </div>

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2
            shadow-lg shadow-amber-800/15 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                        <>
                            <span>Access Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}
