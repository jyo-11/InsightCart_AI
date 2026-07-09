import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react';

const UserInterests = ({ onStart }) => {
    // Mock data for "AI User Likes"
    const interests = [
        { id: 1, name: "Luxury Handbags", growth: "+12%", color: "text-rose-400", bg: "bg-rose-400/10", icon: ShoppingBag },
        { id: 2, name: "Tech Accessories", growth: "+8%", color: "text-blue-400", bg: "bg-blue-400/10", icon: Sparkles },
        { id: 3, name: "Sustainable Wear", growth: "+24%", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Heart },
    ];

    return (
        <section className="py-32 px-6 bg-[#020617] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6">
                        Curated by <span className="text-gradient-emerald">Artificial Intelligence</span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                        Your personal chartboard. InsightCart's neural engine analyzes your preferences to surface the categories and deals that matter most to you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: The "And Backs" Image / Visual Focus */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-accent-emerald/20 to-accent-violet/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />

                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-square lg:aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2000&auto=format&fit=crop"
                                alt="Luxury Red Handbag"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Card - Notification Style */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm p-4 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="pl-2">
                                        <h3 className="text-white font-display text-lg font-medium leading-tight">Designer Collections</h3>
                                        <p className="text-white/60 text-xs mt-1 font-medium">Found 12 rare deals in "Handbags"</p>
                                    </div>
                                    <div
                                        onClick={onStart}
                                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                    >
                                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: AI Chartboard / User Likes */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="glass-premium p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-indigo/5 blur-3xl" />

                            <div className="flex items-center gap-4 mb-8">
                                <ActivityIcon className="w-6 h-6 text-accent-emerald" />
                                <h3 className="text-xl text-white font-medium">Interest Graph</h3>
                            </div>

                            <div className="space-y-4">
                                {interests.map((item, index) => (
                                    <div key={item.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="text-white font-medium">{item.name}</h4>
                                                <span className={`text-xs font-mono ${item.color} px-2 py-0.5 rounded-full bg-white/5`}>
                                                    {item.growth} Interest
                                                </span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${60 + (index * 15)}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                    className={`h-full ${item.bg.replace('/10', '')}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                                <div className="flex-1 bg-white/[0.02] rounded-xl p-4 text-center">
                                    <div className="text-2xl font-display text-white mb-1">24</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/30">New Matches</div>
                                </div>
                                <div className="flex-1 bg-white/[0.02] rounded-xl p-4 text-center">
                                    <div className="text-2xl font-display text-white mb-1">98%</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/30">Relevance</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ActivityIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 12L12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default UserInterests;
