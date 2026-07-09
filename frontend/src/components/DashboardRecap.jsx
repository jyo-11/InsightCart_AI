import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCcw } from 'lucide-react';

const DashboardRecap = () => {
    const insights = [
        "AI detected 15% price drop at Retailer A.",
        "New deal cluster found in 'Electronics'.",
        "Predictive engine suggests buying 'Item X' today."
    ];

    return (
        <aside className="glass-premium p-8 rounded-[2.5rem] w-full max-w-sm sticky top-24">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl glass flex-center border-accent-violet/30 bg-accent-violet/5">
                        <Sparkles className="w-5 h-5 text-accent-violet" />
                    </div>
                    <h3 className="font-display text-xl font-medium text-white">AI Recap</h3>
                </div>
                <button className="p-2 rounded-xl glass hover:bg-white/5 transition-colors">
                    <RefreshCcw className="w-4 h-4 text-white/40" />
                </button>
            </div>

            <div className="space-y-4">
                {insights.map((text, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-5 rounded-2xl border-white/5 bg-white/[0.02] relative group overflow-hidden"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-violet transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                        <p className="text-sm text-white/50 leading-relaxed font-light">
                            {text}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
                <div className="glass p-4 rounded-2xl bg-accent-violet/5 border-accent-violet/20 flex flex-col items-center gap-3">
                    <p className="text-[10px] uppercase tracking-widest text-accent-violet font-mono text-center">
                        Synthesizing Activity
                    </p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-1/2 h-full bg-accent-violet"
                        ></motion.div>
                    </div>
                    <p className="text-[11px] text-white/30 font-light">Analyzing real-time streams...</p>
                </div>
            </div>
        </aside>
    );
};

export default DashboardRecap;
