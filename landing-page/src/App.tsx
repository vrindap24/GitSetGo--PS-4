import { motion } from 'framer-motion';
import { ArrowRight, Settings, Users, Star, QrCode } from 'lucide-react';

export default function App() {
    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden relative font-sans">

            {/* Dynamic Background Assets */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
                <motion.img
                    initial={{ y: -20, rotate: 0 }}
                    animate={{ y: 20, rotate: 5 }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                    src="/assets/leaf1.svg" className="absolute top-[10%] left-[5%] w-32 md:w-48"
                />
                <motion.img
                    initial={{ y: 20, rotate: 0 }}
                    animate={{ y: -20, rotate: -10 }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                    src="/assets/badam.svg" className="absolute top-[60%] right-[10%] w-24 md:w-32"
                />
                <motion.img
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ scale: 1.1, rotate: 15 }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                    src="/assets/gulab-jamun.svg" className="absolute bottom-[-10%] left-[20%] w-48 md:w-64"
                />
                <motion.img
                    initial={{ x: -10, rotate: 0 }}
                    animate={{ x: 10, rotate: -5 }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
                    src="/assets/chilly1.svg" className="absolute top-[40%] left-[45%] w-16 md:w-24"
                />
            </div>

            {/* Reflo Logo Badge */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-xl px-8 py-4 rounded-[40px] shadow-2xl flex items-center justify-center border border-white/40">
                <img src="/reflologo.PNG" alt="Reflo" className="h-10 md:h-12 w-auto object-contain" />
            </div>

            {/* Track 1: Management (Admin Dashboard) */}
            <motion.a
                href="https://reflo-admin.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ flex: 1.4 }}
                className="relative flex-1 group flex flex-col items-center justify-center p-8 transition-all duration-700 hover:z-10 bg-white/30 backdrop-blur-sm md:border-r border-white/20"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center flex flex-col items-center"
                >
                    <div className="w-24 h-24 mb-8 bg-primary rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(141,64,4,0.3)] group-hover:scale-110 transition-transform duration-500">
                        <Settings className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary italic mb-4">Management Dashboard</h2>
                    <p className="max-w-xs text-on-background/70 font-medium text-lg mb-8 leading-relaxed">
                        Unified access to <span className="text-primary font-bold">HQ, Branch,</span> and <span className="text-primary font-bold">Staff</span> analytics pipelines.
                    </p>

                    <div className="flex gap-4 mb-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold text-xl shadow-xl group-hover:shadow-primary/40 transition-all border-2 border-white/20">
                        Enter Dashboard
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </div>
                </motion.div>
            </motion.a>

            {/* Track 2: Customer (PWA) */}
            <motion.a
                href="https://reflo-pwa.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ flex: 1.4 }}
                className="relative flex-1 group flex flex-col items-center justify-center p-8 transition-all duration-700 bg-white/40 backdrop-blur-sm"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 text-center flex flex-col items-center"
                >
                    <div className="w-24 h-24 mb-8 bg-white rounded-[32px] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 border-2 border-primary/10">
                        <QrCode className="w-12 h-12 text-primary" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary italic mb-4">Customer Experience</h2>
                    <p className="max-w-md text-on-background/70 font-medium text-lg mb-8 leading-relaxed">
                        Review your meal and help us serve you better. Because for us, <span className="italic font-bold text-primary">the customer is always king.</span>
                    </p>

                    <div className="flex items-center justify-center gap-1 mb-10">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-bold text-xl shadow-xl group-hover:shadow-black/5 transition-all border-2 border-primary">
                        Leave a Review
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </div>
                </motion.div>

                {/* Call to action text for PWA */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-primary/40 uppercase tracking-[0.2em] whitespace-nowrap">
                    Scan QR to give back to the hospitality
                </div>
            </motion.a>

        </div>
    );
}
