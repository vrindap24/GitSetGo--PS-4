import React from 'react';
import { User, Phone, MapPin, CreditCard, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useStore } from '../store';

export function ProfileScreen() {
    const localReviews = useStore(state => state.myReviews) || [];

    return (
        <div className="pb-24 pt-8 px-4 bg-background min-h-screen">
            <h1 className="text-3xl font-bold text-on-surface mb-6">Profile</h1>

            {/* User Card */}
            <div className="bg-surface-container-high rounded-3xl p-6 mb-6 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-xl font-bold">
                    P
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-on-surface">PWA User</h2>
                    <p className="text-on-surface-variant text-sm">+91 98765 43210</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-container rounded-2xl p-4 border border-outline/5 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{localReviews.length}</div>
                    <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Reviews Given</div>
                </div>
                <div className="bg-surface-container rounded-2xl p-4 border border-outline/5 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">0</div>
                    <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Saved Places</div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
                {[
                    { icon: User, label: 'Edit Profile' },
                    { icon: MapPin, label: 'Saved Addresses' },
                    { icon: CreditCard, label: 'Payment Methods' },
                    { icon: Phone, label: 'Contact Support' },
                ].map((item, idx) => (
                    <button
                        key={idx}
                        className="w-full flex items-center justify-between p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-surface-variant text-on-surface">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-on-surface">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-outline/10 text-center text-sm font-bold text-error flex items-center justify-center gap-2 cursor-pointer">
                <LogOut className="w-4 h-4" />
                Log Out
            </div>
        </div>
    );
}
