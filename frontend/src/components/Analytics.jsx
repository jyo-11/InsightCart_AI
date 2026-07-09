import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3, ArrowRight } from 'lucide-react';

const MarketChart = () => (
    <div className="relative h-64 rounded-2xl bg-neutral-900 ring-1 ring-white/5 mb-8 overflow-hidden">
        <div className="absolute right-6 top-6 w-3/4 h-2/3 rounded-2xl bg-[#111111]/90 backdrop-blur border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-[10px] tracking-widest text-neutral-400 font-medium uppercase font-mono">iPhone 15 Pro / Price Trend</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-accent-emerald font-medium">-12.5%</span>
                    <div className="h-1.5 w-12 rounded-full bg-accent-emerald/20" />
                </div>
            </div>
            <div className="p-4">
                <svg viewBox="0 0 300 100" className="w-full h-24 text-neutral-800">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M0,20 Q30,30 60,15 T120,40 T180,25 T240,60 T300,50 L300,100 L0,100 Z" fill="url(#chartGradient)" />
                    <path d="M0,20 Q30,30 60,15 T120,40 T180,25 T240,60 T300,50" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>

        <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="absolute left-6 bottom-8 w-1/2 rounded-2xl bg-[#111111]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4"
        >
            <div className="text-[10px] tracking-widest text-neutral-400 mb-3 font-bold uppercase font-mono">Watchlist Drops</div>
            <div className="space-y-3">
                {[
                    { s: 'Sony PS5', p: '-$50', c: 'text-accent-emerald' },
                    { s: 'MacBook Air', p: '-$120', c: 'text-accent-emerald' },
                ].map((item) => (
                    <div key={item.s} className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300 font-medium">{item.s}</span>
                        <span className={item.c}>{item.p}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    </div>
);

const TechFeature = ({ icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white/5 group">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-emerald/10 flex items-center justify-center border border-accent-emerald/20 text-accent-emerald group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h5 className="font-semibold text-white group-hover:text-accent-emerald transition-colors uppercase tracking-tight text-sm">{title}</h5>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const Analytics = () => {
    return (
        <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    <div className="absolute -inset-4 bg-gradient-to-br from-accent-emerald/20 to-accent-indigo/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 rounded-[36px] bg-slate-900 border border-white/10 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-semibold tracking-tight text-white font-manrope">Real‑Time Market Data</h3>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-300 uppercase tracking-wider">
                                <TrendingUp className="w-3 h-3 text-accent-emerald" />
                                Live Price Feeds
                            </span>
                        </div>
                        <MarketChart />
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-lg font-semibold text-white tracking-tight">Price Volatility Index</h4>
                                <p className="mt-2 text-sm text-neutral-400">Professional-grade technical analysis for every product.</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white tracking-tight">Smart Watchlists</h4>
                                <p className="mt-2 text-sm text-neutral-400">Curated deal tracking with sub-second price updates.</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-accent-emerald transition-colors group">
                            View Detailed Analytics
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </motion.div>

                <div className="space-y-12">
                    <div className="max-w-lg">
                        <h2 className="text-4xl sm:text-5xl font-semibold text-white leading-[1.1] tracking-tighter font-manrope">
                            Industry‑leading precision, AI certified
                        </h2>
                        <p className="mt-6 text-lg text-white/50">
                            InsightCart AI uses advanced neural networks to predict price movements with 94% accuracy, ensuring you never overpay again.
                        </p>
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-8">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Core Technology Features</h4>
                        <TechFeature icon={Clock} title="Real-time Processing" desc="Sub-second analysis of millions of SKU price points." />
                        <TechFeature icon={BarChart3} title="Predictive Algorithms" desc="Machine learning-enhanced purchase recommendations." />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Analytics;
