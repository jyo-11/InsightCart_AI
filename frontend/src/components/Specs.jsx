import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Specs = ({ onStart }) => {
    const [activeTab, setActiveTab] = useState('technology');

    const tabs = ['technology', 'specs', 'certifications'];

    const handleNextTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
    };

    const getButtonText = () => {
        switch (activeTab) {
            case 'technology': return 'View Tech Specs';
            case 'specs': return 'View Certifications';
            case 'certifications': return 'Back to Overview';
            default: return 'Next';
        }
    };

    return (
        <section className="relative z-10 animate-[fadeInUp_1s_ease-out_0.2s_forwards]" style={{ transform: 'translateY(0px)' }}>
            <div className="max-w-7xl mr-auto ml-auto pt-16 pr-6 pb-16 pl-6">
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Diagram */}
                    <div
                        className="relative bg-cover rounded-[36px] pt-5 pr-5 pb-5 pl-5 overflow-hidden"
                        style={{ backgroundImage: 'url("https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/ac30327e-f74e-4f00-871e-19b69c6e0feb_1600w.jpg")' }}
                    >
                        {/* Overlay for better contrast since the image might be missing or bright */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

                        <article
                            className="group relative z-10 overflow-hidden transition-shadow hover:shadow-md bg-neutral-900/70 border-neutral-700 border rounded-3xl shadow-xl backdrop-blur-xl"
                            style={{ background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(64, 64, 64, 0.35)' }}
                        >
                            <div className="sm:p-10 pt-6 pr-6 pb-6 pl-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <h3 className="text-2xl font-semibold tracking-tight text-white">Real‑Time Market Data</h3>
                                    <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-neutral-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                            <path d="M16 7h6v6"></path>
                                            <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                                        </svg>
                                        Live streaming
                                    </span>
                                </div>

                                {/* Illustration */}
                                <div className="relative h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-800 ring-1 ring-inset ring-white/5 mb-8">
                                    {/* Main trading chart */}
                                    <div className="absolute right-3 sm:right-6 top-4 sm:top-6 w-[78%] h-[68%] rounded-2xl bg-neutral-900/90 backdrop-blur border border-neutral-800 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800/70">
                                            <span className="text-[10px] sm:text-xs tracking-widest text-neutral-400">AAPL</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-green-400">+2.34%</span>
                                                <span className="h-2 w-12 rounded bg-green-500/20"></span>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <svg viewBox="0 0 300 90" className="w-full h-20 sm:h-24 text-neutral-700">
                                                <defs>
                                                    <pattern id="dots1" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                                        <circle cx="1" cy="1" r="0.5" fill="currentColor" opacity="0.3"></circle>
                                                    </pattern>
                                                </defs>
                                                <rect width="100%" height="100%" fill="url(#dots1)"></rect>
                                                {/* Candlestick-style bars */}
                                                <rect x="20" y="45" width="3" height="20" fill="#EF4444"></rect>
                                                <rect x="40" y="35" width="3" height="25" fill="#10B981"></rect>
                                                <rect x="60" y="50" width="3" height="15" fill="#EF4444"></rect>
                                                <rect x="80" y="30" width="3" height="30" fill="#10B981"></rect>
                                                <rect x="100" y="40" width="3" height="20" fill="#10B981"></rect>
                                                <rect x="120" y="25" width="3" height="35" fill="#10B981"></rect>
                                                <rect x="140" y="45" width="3" height="18" fill="#EF4444"></rect>
                                                <rect x="160" y="20" width="3" height="40" fill="#10B981"></rect>
                                                <rect x="180" y="35" width="3" height="25" fill="#10B981"></rect>
                                                <rect x="200" y="15" width="3" height="45" fill="#10B981"></rect>
                                                <polyline points="22,55 42,47 62,57 82,45 102,50 122,42 142,54 162,40 182,47 202,37" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"></polyline>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Watchlist */}
                                    <div className="absolute left-6 sm:left-12 bottom-10 sm:bottom-12 w-[62%] h-[52%] rounded-2xl bg-neutral-900/90 backdrop-blur border border-neutral-800 shadow-sm">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800/70">
                                            <span className="text-[10px] sm:text-xs tracking-widest text-neutral-400">WATCHLIST</span>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-neutral-300">TSLA</span>
                                                <span className="text-green-400">+1.2%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-neutral-300">MSFT</span>
                                                <span className="text-red-400">-0.5%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-neutral-300">GOOGL</span>
                                                <span className="text-green-400">+0.8%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile view */}
                                    <div className="absolute left-3 sm:left-6 bottom-3 sm:bottom-4 w-[38%] h-[44%] rounded-2xl bg-neutral-900/90 backdrop-blur border border-neutral-800 shadow-sm">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800/70">
                                            <span className="text-[10px] sm:text-xs tracking-widest text-neutral-400">MOBILE</span>
                                        </div>
                                        <div className="p-2">
                                            <svg viewBox="0 0 180 70" className="w-full h-14 sm:h-16 text-neutral-700">
                                                <rect x="10" y="35" width="2" height="12" fill="#10B981"></rect>
                                                <rect x="25" y="30" width="2" height="17" fill="#10B981"></rect>
                                                <rect x="40" y="40" width="2" height="10" fill="#EF4444"></rect>
                                                <rect x="55" y="25" width="2" height="22" fill="#10B981"></rect>
                                                <rect x="70" y="20" width="2" height="27" fill="#10B981"></rect>
                                                <rect x="85" y="35" width="2" height="12" fill="#EF4444"></rect>
                                                <rect x="100" y="15" width="2" height="32" fill="#10B981"></rect>
                                                <rect x="115" y="28" width="2" height="19" fill="#10B981"></rect>
                                                <rect x="130" y="12" width="2" height="35" fill="#10B981"></rect>
                                                <polyline points="11,41 26,38 41,45 56,36 71,33 86,41 101,31 116,36 131,29" fill="none" stroke="#10B981" strokeWidth="1" strokeLinecap="round"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Features grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h4 className="text-lg font-semibold tracking-tight text-white">Advanced Charting</h4>
                                        <p className="mt-2 text-sm text-neutral-400">Professional-grade technical analysis tools with real-time candlestick patterns.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold tracking-tight text-white">Smart Watchlists</h4>
                                        <p className="mt-2 text-sm text-neutral-400">Curated stock tracking with instant performance updates and alerts.</p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="inline-flex items-center gap-2 text-xs font-medium text-neutral-100 hover:text-neutral-300">
                                        Launch Search Engine
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <path d="M5 12h14"></path>
                                            <path d="m12 5 7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Copy & stats */}
                    <div>
                        <AnimatePresence mode="wait">
                            {activeTab === 'technology' && (
                                <motion.div
                                    key="technology"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="tech-content"
                                >
                                    <h3 className="sm:text-5xl transition-colors duration-500 text-4xl font-semibold text-white tracking-tight">
                                        Smart price tracking, AI powered
                                    </h3>

                                    {/* Additional technology details */}
                                    <div className="mt-8">
                                        <div className="border-t border-neutral-700/50 pt-6">
                                            <h4 className="text-lg font-semibold text-white mb-4">Core Technology Features</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <path d="M12 6v6l4 2"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-white">Real-time Processing</h5>
                                                        <p className="text-sm text-neutral-400 mt-1">Sub-second color analysis with continuous calibration and temperature compensation for consistent results.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                            <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-white">Advanced Algorithms</h5>
                                                        <p className="text-sm text-neutral-400 mt-1">Machine learning-enhanced color matching with proprietary spectral analysis for superior accuracy.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'specs' && (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="tech-content"
                                >
                                    <h3 className="text-4xl tracking-tight text-white sm:text-5xl font-sans font-semibold">Technical Specifications</h3>
                                    <p className="mt-4 text-neutral-400 font-sans">Precision engineered with cutting-edge hardware and software integration for professional color analysis workflows.</p>

                                    <div className="mt-8 border-t border-neutral-700/50 pt-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">Hardware Specifications</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Spectral Range', value: '380-780 nm' },
                                                { label: 'Accuracy', value: '±0.03 ΔE*ab' },
                                                { label: 'Measurement Time', value: '0.5 seconds' },
                                                { label: 'Illumination', value: 'LED D65/A/C/D50/D55/F2/F7/F11' },
                                                { label: 'Observer Angle', value: '2°/10° standard observer' },
                                                { label: 'Repeatability', value: 'ΔE*ab ≤ 0.04 (σ)' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between py-2 border-b border-neutral-700/30">
                                                    <span className="text-sm text-neutral-400 font-sans">{spec.label}</span>
                                                    <span className="text-sm text-white font-sans">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-neutral-700/50 pt-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">Connectivity &amp; Power</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Interface', value: 'USB-C 3.0, Bluetooth 5.2, Wi-Fi 6' },
                                                { label: 'Battery Life', value: '8 hours continuous use' },
                                                { label: 'Operating Temperature', value: '0°C to 40°C (32°F to 104°F)' },
                                                { label: 'Dimensions', value: '95 × 65 × 28 mm' },
                                                { label: 'Weight', value: '280g (9.9 oz)' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between py-2 border-b border-neutral-700/30">
                                                    <span className="text-sm text-neutral-400 font-sans">{spec.label}</span>
                                                    <span className="text-sm text-white font-sans">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'certifications' && (
                                <motion.div
                                    key="certifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="tech-content"
                                >
                                    <h3 className="text-4xl tracking-tight text-white sm:text-5xl font-sans font-semibold">Certifications &amp; Standards</h3>
                                    <p className="mt-4 text-neutral-400 font-sans">Meets and exceeds international standards for color measurement and professional certification requirements.</p>

                                    <div className="mt-8 border-t border-neutral-700/50 pt-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">International Standards</h4>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {[
                                                { title: 'ISO 11664', desc: 'Colorimetry Standards' },
                                                { title: 'CIE Standard', desc: 'Illuminant D65' },
                                                { title: 'ASTM E308', desc: 'Standard Practice for Computing Colors' },
                                                { title: 'DIN 5033', desc: 'Colorimetry Guidelines' }
                                            ].map((std, i) => (
                                                <div key={i} className="rounded-lg bg-neutral-800/50 p-3 ring-1 ring-neutral-700 shadow-sm">
                                                    <div className="text-sm font-medium text-white font-sans">{std.title}</div>
                                                    <div className="text-xs text-neutral-400 font-sans">{std.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-neutral-700/50 pt-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">Industry Certifications</h4>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-lg bg-neutral-800/50 p-3 ring-1 ring-neutral-700 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                                        <path d="m9 12 2 2 4-4"></path>
                                                        <path d="m21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                                                        <path d="m3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                                                    </svg>
                                                    <div className="text-sm font-medium text-white font-sans">FDA Approved</div>
                                                </div>
                                                <div className="text-xs text-neutral-400 font-sans">Medical device classification for clinical use</div>
                                            </div>
                                            <div className="rounded-lg bg-neutral-800/50 p-3 ring-1 ring-neutral-700 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                                                        <path d="m9 12 2 2 4-4"></path>
                                                    </svg>
                                                    <div className="text-sm font-medium text-white font-sans">CE Marking</div>
                                                </div>
                                                <div className="text-xs text-neutral-400 font-sans">European conformity for commercial distribution</div>
                                            </div>
                                            {/* ... and so on for other certs */}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="border-t border-neutral-700/50 pt-6 mt-8">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer items-center">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl tracking-tight font-sans font-semibold rating-number text-white" data-target="4.8">4.8</span>
                                            <span className="text-sm text-neutral-400 font-sans">/5</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 font-sans">22k+ professional reviews</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl tracking-tight font-sans font-semibold rating-number text-white" data-target="94">94%</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 font-sans">Users recommend to colleagues</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-700/50 pt-6 mt-8">
                            <button
                                onClick={handleNextTab}
                                className="cursor-pointer inline-flex flex-col leading-none outline-none overflow-hidden no-underline align-baseline whitespace-nowrap select-none transition-all duration-150 hover:opacity-85 focus:outline-none focus:ring-4 focus:ring-black/50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] text-base text-white text-center bg-gradient-to-b from-neutral-700 to-neutral-900 border-0 rounded-xl pt-2.5 pr-5 pb-2.5 pl-5 items-center justify-center w-full sm:w-auto"
                                role="button"
                            >
                                {getButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Specs;
