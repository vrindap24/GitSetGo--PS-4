import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { User } from '../types';

/* ── Import real SVG assets ─────────────────────────────────────────── */
import leaf1 from '../assets/leaf1.svg';
import leaf2 from '../assets/leaf2.svg';
import cashew from '../assets/cashew.svg';
import badam from '../assets/badam.svg';
import chilly1 from '../assets/chilly1.svg';
import pistachio from '../assets/pistacchio.svg';
import jalebi from '../assets/jalebi.svg';
import kajukatli from '../assets/kajukatli.svg';
import paneertikka from '../assets/paneertikka.svg';
import rasgulla from '../assets/rasgulla.svg';
import halwa from '../assets/halwa.svg';
import gulabjamun from '../assets/gulab-jamun.svg';
import reflologo from '../assets/reflologo.PNG';

/* ──────────────────────────────────────────────────────────────────── */
/*  Floating Decorative Asset                                         */
/* ──────────────────────────────────────────────────────────────────── */

interface FloatingAssetProps {
  src: string;
  alt: string;
  className: string;
  duration?: number;
  yRange?: [number, number, number];
  rotate?: [number, number, number];
}

const FloatingAsset = ({
  src, alt, className, duration = 6,
  yRange = [0, -20, 0], rotate = [0, 10, 0],
}: FloatingAssetProps) => (
  <motion.img
    src={src}
    alt={alt}
    animate={{
      y: yRange,
      rotate,
      scale: [1, 1.05, 1],
      filter: ['drop-shadow(0 5px 15px rgba(0,0,0,0.1))', 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))', 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))']
    }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={`${className} transition-opacity duration-500`}
    draggable={false}
  />
);

/* ──────────────────────────────────────────────────────────────────── */
/*  Reflo Logo                                                        */
/* ──────────────────────────────────────────────────────────────────── */

const RefloLogo = () => (
  <div className="flex items-center gap-3">
    <img src={reflologo} alt="Reflo Logo" className="h-16 w-auto object-contain" />
  </div>
);

/* ──────────────────────────────────────────────────────────────────── */
/*  Demo Users                                                        */
/* ──────────────────────────────────────────────────────────────────── */

const USERS: User[] = [
  { id: 'u1', name: 'HQ Administrator', email: 'hq@reflo.app', role: 'HQ' },
  { id: 'u2', name: 'Branch Manager', email: 'branch@reflo.app', role: 'BRANCH', branchId: 'b1' },
  { id: 'u3', name: 'Amit Sharma', email: 'staff@reflo.app', role: 'STAFF', branchId: 'b1' },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Login Page                                                        */
/* ──────────────────────────────────────────────────────────────────── */

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = USERS.find(u => u.email === email);
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
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 relative overflow-hidden">

      {/* ── Floating Food Decorations (higher opacity for clarity) ── */}

      {/* --- CORNER ASSETS (Clearly Visible) --- */}

      {/* Top-Left: Leaf 1 */}
      <FloatingAsset
        src={leaf1}
        alt=""
        className="absolute top-[2%] left-[2%] w-32 opacity-80 z-0 hidden lg:block"
        duration={7}
      />

      {/* Top-Right: Badam */}
      <FloatingAsset
        src={badam}
        alt=""
        className="absolute top-[4%] right-[4%] w-24 opacity-80 z-0 hidden md:block"
        duration={6}
      />

      {/* Bottom-Left: Halwa (Large corner base) */}
      <FloatingAsset
        src={halwa}
        alt=""
        className="absolute bottom-[2%] left-[2%] w-44 opacity-30 z-0 hidden lg:block"
        duration={10}
      />

      {/* Bottom-Right: Kaju Katli */}
      <FloatingAsset
        src={kajukatli}
        alt=""
        className="absolute bottom-[4%] right-[4%] w-36 opacity-80 z-0 hidden xl:block"
        duration={8}
      />

      {/* Mid-Right: Chilly */}
      <FloatingAsset
        src={chilly1}
        alt=""
        className="absolute top-[75%] right-[2%] w-28 opacity-80 z-0 hidden md:block"
        duration={7}
        rotate={[0, 20, 0]}
      />

      {/* Top-Center/Right Area: Rasgulla (Away from card) */}
      <FloatingAsset
        src={rasgulla}
        alt=""
        className="absolute top-[8%] left-[65%] w-28 opacity-75 z-0 hidden lg:block"
        duration={9}
      />

      {/* --- HERO CENTER ASSET --- */}

      {/* ONLY Paneer Tikka in the gap */}
      <FloatingAsset
        src={paneertikka}
        alt="Paneer tikka"
        className="absolute top-[35%] left-[46%] w-52 opacity-90 z-0 hidden xl:block"
        duration={8}
        yRange={[0, 15, 0]}
        rotate={[0, -12, 0]}
      />

      {/* Bottom Center: Jalebi (Moved to bottom boundary to fill empty floor space) */}
      <FloatingAsset
        src={jalebi}
        alt=""
        className="absolute -bottom-8 left-[40%] w-48 opacity-80 z-0 hidden lg:block"
        duration={12}
      />

      {/* ── Left Panel – Branding ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <RefloLogo />

          <h2 className="mt-8 text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
              Reflo
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
            The <strong className="text-amber-800">Re</strong>view <strong className="text-amber-800">F</strong>eedback <strong className="text-amber-800">Lo</strong>op platform.{' '}
            Reviews flow in → AI analyzes → Actions taken → Brands improve → Cycle repeats.
          </p>

          {/* Feedback loop visual pills */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {[
              { label: 'Reviews In', dot: 'bg-amber-600' },
              { label: 'AI Analyzes', dot: 'bg-amber-700' },
              { label: 'Action Taken', dot: 'bg-amber-800' },
              { label: 'Brand Improves', dot: 'bg-amber-900' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <div className={`w-2 h-2 rounded-full ${step.dot}`} />
                  {step.label}
                </div>
                {i < 3 && <span className="text-gray-300 text-xs">→</span>}
              </React.Fragment>
            ))}
            <span className="text-amber-600 text-xs font-bold">↻</span>
          </div>

          {/* Micro-assets near branding text */}
          <FloatingAsset
            src={cashew}
            alt=""
            className="absolute -top-6 -left-8 w-8 opacity-40 z-0"
            duration={5}
            yRange={[0, -4, 0]}
          />
          <FloatingAsset
            src={badam}
            alt=""
            className="absolute -bottom-8 right-12 w-8 opacity-40 z-0"
            duration={6}
            yRange={[0, 4, 0]}
          />

          {/* Halwa decorative near text */}
          <motion.img
            src={halwa}
            alt=""
            className="absolute bottom-[12%] right-[6%] w-28 opacity-20"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            draggable={false}
          />
        </motion.div>
      </div>

      {/* ── Right Panel – Sign In Card ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl shadow-amber-200/40 border border-amber-100/60 p-10"
        >
          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <RefloLogo />
            <p className="mt-3 text-sm text-gray-400 font-medium text-center">
              The Review Feedback Loop Platform
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Sign in
          </h3>
          <p className="text-sm text-gray-400 mb-8 font-medium">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@reflo.app"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm font-medium tracking-widest
                  focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-200"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs font-medium text-red-600">{error}</span>
              </motion.div>
            )}

            <div className="text-xs text-center text-gray-400 bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
              <p className="font-semibold text-gray-500 mb-1.5">Demo Credentials</p>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span className="block font-bold text-gray-500">HQ</span>
                  hq@reflo.app
                </div>
                <div>
                  <span className="block font-bold text-gray-500">Branch</span>
                  branch@reflo.app
                </div>
                <div>
                  <span className="block font-bold text-gray-500">Staff</span>
                  staff@reflo.app
                </div>
              </div>
              <p className="mt-1.5 text-gray-300">Password: password</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2
                shadow-lg shadow-amber-800/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
