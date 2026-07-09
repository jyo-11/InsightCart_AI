import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const PricingCard = () => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-manrope font-bold text-white mb-4">Simple, transparent pricing</h2>
                <p className="text-white/50 max-w-2xl mx-auto">Choose the plan that's right for your shopping habits. No hidden fees, cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Basic Plan */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">₹0</span>
                            <span className="text-white/40">/month</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {['Basic price tracking', 'Daily alerts', 'Web extension access', 'Up to 5 tracked items'].map((feat) => (
                            <li key={feat} className="flex items-center gap-3 text-sm text-white/70">
                                <Check className="w-4 h-4 text-accent-emerald" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-medium">
                        Get Started
                    </button>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="p-8 rounded-[2rem] bg-gradient-to-br from-accent-emerald/20 to-accent-emerald/5 border border-accent-emerald/30 backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-[10px] text-accent-emerald font-bold tracking-widest uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Popular
                        </span>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">Insight Pro</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">₹999</span>
                            <span className="text-white/40">/month</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {['Unlimited price tracking', 'Real-time push notifications', 'AI-powered price predictions', 'Automated coupon application', 'Priority support'].map((feat) => (
                            <li key={feat} className="flex items-center gap-3 text-sm text-white/90 font-medium">
                                <Check className="w-4 h-4 text-accent-emerald" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-4 rounded-xl bg-white text-bg-dark hover:bg-accent-emerald hover:text-white transition-all font-bold">
                        Go Pro Now
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingCard;
