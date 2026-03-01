import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  User as UserIcon,
  LayoutDashboard,
  Store,
  Users,
  Settings,
  HelpCircle,
  Mic,
  Send,
  Paperclip,
  Image as ImageIcon,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
  RotateCw
} from 'lucide-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import reflologo from '../assets/reflologo.PNG';
import { User } from '../types';

// --- Components ---

import RefloAssistant from './DivineAssistant';

const GoogleAssistantLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="12" r="5" fill="#4285F4" />
    <circle cx="18" cy="12" r="3" fill="#DB4437" />
    <circle cx="18" cy="19" r="3" fill="#F4B400" />
    <circle cx="21" cy="9" r="1.5" fill="#0F9D58" />
  </svg>
);

const NavRail = ({ activeRole, collapsed, onToggle, onLogout, onAssistantClick }: { activeRole: string, collapsed: boolean, onToggle: () => void, onLogout: () => void, onAssistantClick: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    HQ: [
      { icon: LayoutDashboard, label: 'Overview', path: '/' },
      { icon: Store, label: 'Branch Network', path: '/branch' },
      { icon: Users, label: 'Staff Global', path: '/staff' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
    BRANCH: [
      { icon: LayoutDashboard, label: 'Overview', path: '/' },
      { icon: Users, label: 'My Staff', path: '/staff' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
    STAFF: [
      { icon: LayoutDashboard, label: 'My Dashboard', path: '/' },
      { icon: HelpCircle, label: 'Help', path: '/help' },
    ]
  };

  const items = menuItems[activeRole as keyof typeof menuItems] || [];

  return (
    <motion.div
      className="h-full bg-surface-variant/30 border-r border-outline-variant/20 flex flex-col items-center py-4 z-20"
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="mb-8 flex items-center w-full px-4 gap-3">
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-on-surface-variant/10 flex-shrink-0">
          <Menu className="w-6 h-6 text-on-surface-variant" />
        </button>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 whitespace-nowrap overflow-hidden"
          >
            <img src={reflologo} alt="Reflo Logo" className="h-8 w-auto object-contain" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 w-full px-3 space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center p-4 rounded-full transition-all duration-200 group ${isActive
                ? 'bg-secondary-container text-on-secondary-container'
                : 'hover:bg-on-surface-variant/10 text-on-surface-variant'
                }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-4 font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      <div className="w-full px-3 mb-2">
        <button
          onClick={onAssistantClick}
          className="w-full flex items-center p-4 rounded-full hover:bg-primary/10 text-on-surface-variant transition-colors group"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <GoogleAssistantLogo className="w-full h-full" />
          </div>
          {!collapsed && <span className="ml-4 font-medium text-sm">Reflo AI</span>}
        </button>
      </div>

      <div className="w-full px-3 mb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-4 rounded-full hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition-colors group"
        >
          <LogOut className="w-6 h-6" />
          {!collapsed && <span className="ml-4 font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </motion.div>
  );
};

// --- Components ---

const TopBar = ({ title, user }: { title: string, user: User }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-16 px-6 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-outline-variant/20">
      <h1 className="text-2xl font-sans font-normal text-on-surface">{title}</h1>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search insights..."
            className="pl-10 pr-4 py-2 bg-surface-variant/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
          />
        </div>

        <div className="relative">
          <button
            className="m3-icon-button relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-6 h-6 text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { title: 'New Review Alert', desc: 'Negative review detected at Virar branch', time: '2m ago', urgent: true },
                    { title: 'Staff Check-in', desc: 'Rahul checked in at Pune branch', time: '15m ago', urgent: false },
                    { title: 'Inventory Low', desc: 'Tomato stock low at Powai', time: '1h ago', urgent: true },
                  ].map((notif, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${notif.urgent ? 'text-red-600' : 'text-gray-900'}`}>{notif.title}</span>
                        <span className="text-xs text-gray-400">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{notif.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button className="text-xs font-medium text-primary hover:underline">Mark all as read</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-3 pl-2 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-on-surface">{user.name}</p>
            <p className="text-xs text-on-surface-variant capitalize">{user.role.toLowerCase()} Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};



export default function Layout({ user, onLogout }: { user: User, onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('hq')) return 'HQ Command Center';
    if (location.pathname.includes('branch')) return 'Branch Operations';
    if (location.pathname.includes('staff')) return 'My Service Credits';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <NavRail
        activeRole={user.role}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={onLogout}
        onAssistantClick={() => setIsAssistantOpen(true)}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <TopBar title={getPageTitle()} user={user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>

        <RefloAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      </div>
    </div>
  );
}
