import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Moon, Globe, Smartphone } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h2 className="text-2xl font-normal text-on-surface mb-2">Settings</h2>
      <p className="text-sm text-on-surface-variant mb-8">Manage your preferences and account settings</p>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="m3-card overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20">
            <h3 className="text-lg font-medium text-on-surface">Appearance</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-surface-variant rounded-full text-on-surface-variant">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">Dark Mode</p>
                  <p className="text-xs text-on-surface-variant">Adjust the appearance to reduce eye strain</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="m3-card overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20">
            <h3 className="text-lg font-medium text-on-surface">Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-surface-variant rounded-full text-on-surface-variant">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">Push Notifications</p>
                  <p className="text-xs text-on-surface-variant">Receive alerts about critical reviews</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="m3-card overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20">
            <h3 className="text-lg font-medium text-on-surface">Security</h3>
          </div>
          <div className="p-6 space-y-6">
            <button className="w-full flex items-center justify-between p-4 bg-surface-variant/30 rounded-xl hover:bg-surface-variant/50 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-surface-variant rounded-full text-on-surface-variant">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">Change Password</p>
                  <p className="text-xs text-on-surface-variant">Update your password regularly</p>
                </div>
              </div>
              <span className="text-xs font-medium text-primary">Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
