import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Sparkles, MessageSquare, Zap } from 'lucide-react';

const FeatureCard = ({ title, tag, icon: Icon, image, aspect = "aspect-[4/3]" }) => (
    <motion.article
        whileHover={{ scale: 1.02 }}
        className={`group relative overflow-hidden ${aspect} rounded-2xl border border-white/10 bg-slate-900/40`}
    >
        <div
            className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80 group-hover:via-black/40" />

        <div className="absolute top-3 left-3">
            <div className="p-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-3.5 h-3.5 text-white" />
            </div>
        </div>

        <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-[10px] text-white/90 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
                {tag}
            </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 transition-transform duration-300 group-hover:-translate-y-1">
            <p className="text-white text-lg font-medium tracking-tight leading-tight">{title}</p>
        </div>
    </motion.article>
);

const TimelineItem = ({ color, title, desc, delay }) => (
    <div className="relative pl-8 pb-8 last:pb-0">
        <div className={`absolute left-0 top-1.5 bottom-0 w-px bg-gradient-to-b ${color}`} />
        <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className={`absolute left-[-6px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 ${color.split(' ')[2]} flex items-center justify-center`}
        >
            <div className={`w-1 h-1 rounded-full ${color.split(' ').pop()}`} />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            <span className={`text-sm font-medium ${color.split(' ').pop().replace('bg-', 'text-')}`}>{title}</span>
            <p className="text-xs text-slate-400 mt-1">{desc}</p>
        </motion.div>
    </div>
);

const Features = () => {
    return (
        <section className="relative z-10 py-40 px-6 max-w-7xl mx-auto">
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-slate-900/60 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
                    <div className="grid grid-cols-2 gap-4 order-2 lg:order-2">
                        <FeatureCard
                            title="Smart Price Prediction"
                            tag="AI Analysis"
                            icon={Filter}
                            image="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800"
                        />
                        <FeatureCard
                            title="Automated Coupon Hunter"
                            tag="Savings"
                            icon={Zap}
                            image="https://images.unsplash.com/photo-1614850523296-62c0af475ADa?auto=format&fit=crop&q=80&w=800"
                        />
                        <FeatureCard
                            title="Context-Aware Alerts"
                            tag="Tracking"
                            icon={MessageSquare}
                            aspect="aspect-[4/5]"
                            image="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
                        />
                        <FeatureCard
                            title="Targeted Deal Sourcing"
                            tag="Discovery"
                            icon={Sparkles}
                            aspect="aspect-[4/5]"
                            image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800"
                        />
                    </div>

                    <div className="flex flex-col h-full justify-between order-1 lg:order-1">
                        <div>
                            <span className="text-sm font-normal text-slate-400 font-mono uppercase tracking-widest">Core Engine</span>
                            <h2 className="text-4xl sm:text-6xl font-manrope font-medium text-white tracking-tighter mt-4 leading-[1.1]">
                                An inbox built for speed and focus.
                            </h2>

                            <div className="mt-12 space-y-2">
                                <TimelineItem
                                    color="from-lime-400 via-emerald-400 to-cyan-400 border-lime-400 bg-lime-400"
                                    title="Smart prioritization"
                                    desc="AI learns which products you need most and prioritizes their alerts"
                                    delay={0.1}
                                />
                                <TimelineItem
                                    color="from-emerald-400 via-cyan-400 to-blue-400 border-emerald-400 bg-emerald-400"
                                    title="Instant summaries"
                                    desc="Get the gist of price movements across 40+ retailers instantly"
                                    delay={0.2}
                                />
                                <TimelineItem
                                    color="from-cyan-400 via-blue-400 to-indigo-400 border-cyan-400 bg-cyan-400"
                                    title="Auto-draft replies"
                                    desc="Automate purchase decisions with pre-set logic and AI suggestions"
                                    delay={0.3}
                                />
                            </div>
                        </div>

                        <div className="mt-16 space-y-6">
                            <div>
                                <p className="text-sm font-medium text-white tracking-tight">Transform your shopping workflow</p>
                                <p className="text-sm text-slate-300 mt-2 max-w-sm">
                                    InsightCart AI manages the noise so you can focus on the savings. Integrated logic for the smart consumer.
                                </p>
                            </div>
                            <button className="inline-flex items-center gap-3 px-6 py-3 bg-accent-emerald hover:bg-emerald-500 rounded-full text-sm font-medium transition-colors text-white">
                                Explore Core Features
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
