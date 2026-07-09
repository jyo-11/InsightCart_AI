import { motion } from 'framer-motion';
import { ArrowRight, Star, Target } from 'lucide-react';

const Hero = ({ onStart }) => {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-center bg-cover pt-24 pb-12 md:pt-32 md:pb-20"
            style={{
                backgroundImage: 'url("https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80")',
                maskImage: 'linear-gradient(180deg, transparent, black 0%, black 70%, transparent)',
                WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 70%, transparent)'
            }}
        >
            {/* Content Overlay & Masking */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20 mb-20 md:mb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] font-medium tracking-tighter font-manrope drop-shadow-lg"
                            style={{
                                maskImage: 'linear-gradient(150deg, transparent, black 0%, black 40%, transparent)',
                                WebkitMaskImage: 'linear-gradient(150deg, transparent, black 0%, black 40%, transparent)'
                            }}
                        >
                            The Future of<br />
                            <span className="bg-clip-text font-medium text-transparent tracking-tighter font-manrope bg-gradient-to-br from-white to-accent-emerald pr-1">
                                Smart Shopping
                            </span><br />
                            is Here
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base sm:text-lg text-white/70 max-w-xl"
                        >
                            InsightCart AI analyzes global marketplace data to predict price trends
                            and score deals with unmatched precision. Never overpay again.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <button
                                onClick={onStart}
                                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium text-zinc-900 bg-white rounded-full transition-all duration-300 hover:shadow-lg hover:bg-zinc-200 shadow-[5.7px_5.7px_8.6px_rgba(0,_0,_0,_0.07),_13.7px_13.7px_10.9px_rgba(0,_0,_0,_0.099),_25.7px_25.7px_20.5px_rgba(0,_0,_0,_0.123),_45.8px_45.8px_36.6px_rgba(0,_0,_0,_0.147),_85.8px_85.8px_68.5px_rgba(0,_0,_0,_0.176),_205px_205px_163.4px_rgba(0,_0,_0,_0.246)]"
                            >
                                <span className="font-sans">Launch Intelligence Engine</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Stats */}
                    <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-gradient-to-br from-white/10 via-white/0 to-white/10 w-full h-fit rounded-2xl sm:rounded-3xl relative border border-white/10 shadow-[2.8px_2.8px_2.2px_rgba(0,_0,_0,_0.034),_6.7px_6.7px_5.3px_rgba(0,_0,_0,_0.048),_12.5px_12.5px_10px_rgba(0,_0,_0,_0.06),_22.3px_22.3px_17.9px_rgba(0,_0,_0,_0.072),_41.8px_41.8px_33.4px_rgba(0,_0,_0,_0.086),_100px_100px_80px_rgba(0,_0,_0,_0.12)]"
                            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                        >
                            <div className="p-6 sm:p-8 relative">
                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ring-1 flex items-center justify-center bg-white/10 ring-white/20">
                                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl sm:text-3xl tracking-tighter font-manrope font-medium">10M+</div>
                                        <div className="text-xs sm:text-sm text-white/70 font-sans">Products Tracked</div>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-white/70 font-sans">Market Coverage</span>
                                        <span className="text-xs sm:text-sm font-sans">87%</span>
                                    </div>
                                    <div className="h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r rounded-full from-accent-emerald to-accent-emerald/70" style={{ width: '87%' }}></div>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent my-3 sm:my-4"></div>

                                <div className="flex justify-between mb-3 sm:mb-4 gap-2">
                                    <div className="text-center px-1 sm:px-2 cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl hover:bg-white/5 hover:-translate-y-0.5 flex-1">
                                        <div className="text-xl sm:text-2xl leading-tight bg-gradient-to-r from-white/95 to-neutral-200/80 bg-clip-text text-transparent font-sans font-medium">
                                            15+
                                        </div>
                                        <div className="text-[10px] sm:text-xs opacity-70 uppercase tracking-wide font-sans">Categories</div>
                                    </div>
                                    <div className="w-px h-10 sm:h-12 my-auto bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                                    <div className="text-center px-1 sm:px-2 cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl hover:bg-white/5 hover:-translate-y-0.5 flex-1">
                                        <div className="text-xl sm:text-2xl leading-tight bg-gradient-to-r from-white/95 to-neutral-200/80 bg-clip-text text-transparent font-sans font-medium">
                                            6+
                                        </div>
                                        <div className="text-[10px] sm:text-xs opacity-70 uppercase tracking-wide font-sans">Retailers</div>
                                    </div>
                                    <div className="w-px h-10 sm:h-12 my-auto bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                                    <div className="text-center px-1 sm:px-2 cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl hover:bg-white/5 hover:-translate-y-0.5 flex-1">
                                        <div className="text-xl sm:text-2xl leading-tight bg-gradient-to-r from-white/95 to-neutral-200/80 bg-clip-text text-transparent font-sans font-medium">
                                            Real-time
                                        </div>
                                        <div className="text-[10px] sm:text-xs opacity-70 uppercase tracking-wide font-sans">Updates</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-zinc-300 cursor-pointer transition-all duration-300 hover:-translate-y-px font-sans">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-emerald animate-pulse"></div>
                                        LIVE
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-zinc-300 cursor-pointer transition-all duration-300 hover:-translate-y-px font-sans">
                                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        AI-POWERED
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Supported Retailers Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="overflow-hidden transition-all duration-300 bg-gradient-to-br from-white/10 via-white/0 to-white/10 w-full h-fit rounded-2xl sm:rounded-3xl relative border border-white/10 shadow-[4px_4px_6px_rgba(0,_0,_0,_0.049),_9.6px_9.6px_7.6px_rgba(0,_0,_0,_0.069),_18px_18px_14.3px_rgba(0,_0,_0,_0.086),_32px_32px_25.6px_rgba(0,_0,_0,_0.103),_60px_60px_47.8px_rgba(0,_0,_0,_0.123),_143px_143px_114.3px_rgba(0,_0,_0,_0.172)]"
                            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                        >
                            <div className="p-6 sm:p-8 relative">
                                <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-sans">Supported Retailers</h3>
                                <div className="overflow-hidden relative">
                                    <div
                                        style={{
                                            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                                        }}
                                    >
                                        <div
                                            className="flex gap-4 sm:gap-6 will-change-transform"
                                            style={{ animation: 'marquee-logos 30s linear infinite' }}
                                        >
                                            <div className="flex gap-4 sm:gap-6 shrink-0 items-center">
                                                <span className="text-white/60 font-medium text-sm">Amazon</span>
                                                <span className="text-white/60 font-medium text-sm">Flipkart</span>
                                                <span className="text-white/60 font-medium text-sm">Best Buy</span>
                                                <span className="text-white/60 font-medium text-sm">Walmart</span>
                                                <span className="text-white/60 font-medium text-sm">Target</span>
                                                <span className="text-white/60 font-medium text-sm">eBay</span>
                                            </div>
                                            <div className="flex gap-4 sm:gap-6 shrink-0 items-center">
                                                <span className="text-white/60 font-medium text-sm">Amazon</span>
                                                <span className="text-white/60 font-medium text-sm">Flipkart</span>
                                                <span className="text-white/60 font-medium text-sm">Best Buy</span>
                                                <span className="text-white/60 font-medium text-sm">Walmart</span>
                                                <span className="text-white/60 font-medium text-sm">Target</span>
                                                <span className="text-white/60 font-medium text-sm">eBay</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
