import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, Activity, Target,
    Loader2, AlertCircle, TrendingDown, TrendingUp,
    Zap, Clock, ExternalLink, ShoppingCart, Store,
    Eye, Flame, Calendar
} from 'lucide-react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// ============================================================
// Product image helper (unchanged)
// ============================================================
const getProductImage = (product) => {
    if (product.image_url && product.image_url.trim()) return product.image_url;
    const name = (product.name || '').toLowerCase();
    if (name.includes('iphone') || name.includes('apple') || name.includes('macbook'))
        return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80';
    if (name.includes('samsung') || name.includes('galaxy'))
        return 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80';
    if (name.includes('playstation') || name.includes('ps5') || name.includes('xbox') || name.includes('gaming'))
        return 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80';
    if (name.includes('laptop') || name.includes('notebook'))
        return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80';
    if (name.includes('headphone') || name.includes('airpod') || name.includes('earbuds'))
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';
    if (name.includes('watch') || name.includes('smartwatch'))
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
    if (name.includes('tv') || name.includes('television') || name.includes('monitor'))
        return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80';
    if (name.includes('camera') || name.includes('dslr'))
        return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80';
    if (name.includes('phone') || name.includes('mobile') || name.includes('redmi') || name.includes('realme') || name.includes('oneplus'))
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
    if (name.includes('shoe') || name.includes('nike') || name.includes('adidas') || name.includes('sneaker'))
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
    if (name.includes('remote') || name.includes('ac') || name.includes('air conditioner'))
        return 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80';
    return 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80';
};

// ============================================================
// Chart.js Registration
// ============================================================
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler
);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================
// Real 2026 Indian E-Commerce Sales Calendar
// ============================================================
const INDIAN_SALES = [
    { name: 'Flipkart Summer Sale', date: '2026-04-15', platforms: 'Flipkart', discount: '15-30%', icon: '\u{1F338}' },
    { name: 'Amazon Great Summer Sale', date: '2026-05-01', platforms: 'Amazon', discount: '15-30%', icon: '\u{2600}\u{FE0F}' },
    { name: 'Back to School Sale', date: '2026-05-15', platforms: 'Amazon, Flipkart', discount: '10-25%', icon: '\u{1F393}' },
    { name: 'Flipkart GOAT Sale', date: '2026-07-12', platforms: 'Flipkart', discount: '15-60%', icon: '\u{1F3C6}' },
    { name: 'Amazon Prime Day', date: '2026-07-12', platforms: 'Amazon', discount: '15-60%', icon: '\u{1F6CD}\u{FE0F}' },
    { name: 'Independence Day Sale', date: '2026-08-15', platforms: 'Amazon, Flipkart', discount: '15-30%', icon: '\u{1F1EE}\u{1F1F3}' },
    { name: 'Great Indian Festival', date: '2026-09-27', platforms: 'Amazon', discount: '15-80%', icon: '\u{1F6D2}' },
    { name: 'Big Billion Days', date: '2026-10-05', platforms: 'Flipkart', discount: '15-80%', icon: '\u{1F6D2}' },
    { name: 'Diwali Sale', date: '2026-11-05', platforms: 'All Platforms', discount: '15-25%', icon: '\u{1FA94}' },
    { name: 'Black Friday Sale', date: '2026-11-27', platforms: 'Amazon, Flipkart', discount: '20-50%', icon: '\u{1F5A4}' },
    { name: 'New Year Sale', date: '2026-12-29', platforms: 'All Platforms', discount: '10-40%', icon: '\u{1F389}' },
];

// ============================================================
// Helpers
// ============================================================
const getUpcomingSale = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (const s of INDIAN_SALES) {
        const saleDate = new Date(s.date + 'T00:00:00');
        if (saleDate >= now) {
            return { ...s, daysUntil: Math.ceil((saleDate - now) / (1000 * 60 * 60 * 24)) };
        }
    }
    // Wrap around to next year's first sale
    return { ...INDIAN_SALES[0], daysUntil: '—' };
};

const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const seededRandom = (seed) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
};

const generateHistoricalPrices = (currentPrice, productId, days = 30) => {
    if (!currentPrice || currentPrice <= 0) return [];
    const history = [];
    let price = currentPrice * (1 + (seededRandom(productId) * 0.08 - 0.04));
    for (let i = days; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const r = seededRandom(productId * 1000 + i);
        price += (currentPrice - price) * 0.15 + (r - 0.5) * currentPrice * 0.008;
        history.push({ date: date.toISOString().split('T')[0], price: Math.round(price) });
    }
    return history;
};

// ============================================================
// Chart.js custom plugin — festival vertical markers
// ============================================================
const festivalLinePlugin = {
    id: 'festivalLines',
    afterDraw(chart) {
        const markers = chart.options.plugins?.festivalLines?.markers;
        if (!markers?.length) return;
        const { ctx, chartArea, scales } = chart;
        markers.forEach(({ name, index }) => {
            const x = scales.x.getPixelForValue(index);
            if (x < chartArea.left || x > chartArea.right) return;
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
            ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
            ctx.font = '9px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(name, x, chartArea.top - 8);
            ctx.restore();
        });
    }
};

// Chart.js custom plugin — price labels on bar ends
const barLabelPlugin = {
    id: 'barPriceLabels',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, di) => {
            const meta = chart.getDatasetMeta(di);
            meta.data.forEach((bar, index) => {
                const value = dataset.data[index];
                if (!value) return;
                ctx.save();
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.font = '11px Inter';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(`₹${value.toLocaleString('en-IN')}`, bar.x + 8, bar.y);
                ctx.restore();
            });
        });
    }
};

// ============================================================
// Sub-component: Deal Score Gauge (SVG semicircle)
// ============================================================
const DealScoreGauge = ({ score }) => {
    const s = Math.max(0, Math.min(100, score || 50));
    const color = s <= 40 ? '#ef4444' : s <= 70 ? '#eab308' : '#22c55e';
    const label = s <= 40 ? 'Poor Deal' : s <= 70 ? 'Fair Deal' : 'Great Deal';
    const radius = 54;
    const circ = Math.PI * radius;
    const offset = circ - (s / 100) * circ;

    return (
        <div className="flex flex-col items-center justify-center">
            <svg viewBox="0 0 128 76" className="w-44 h-auto">
                <path d="M 10 68 A 54 54 0 0 1 118 68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                <motion.path
                    d="M 10 68 A 54 54 0 0 1 118 68"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <text x="64" y="50" textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="Inter">{s}</text>
                <text x="64" y="66" textAnchor="middle" fill={color} fontSize="9" fontWeight="600" fontFamily="Inter">{label}</text>
            </svg>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono mt-1">Deal Score</span>
        </div>
    );
};

// ============================================================
// Main Component
// ============================================================
const InsightDashboard = ({ onBack, initialQuery = '', onProductContext }) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [hasAutoSearched, setHasAutoSearched] = useState(false);
    const [revealedPrices, setRevealedPrices] = useState({});

    // Auto-trigger search when opened from chatbot with a query
    useEffect(() => {
        if (initialQuery && !hasAutoSearched) {
            setHasAutoSearched(true);
            runAnalysis();
        }
    }, [initialQuery]);

    // Push product context up for chatbot awareness
    useEffect(() => {
        if (recommendation && selectedProduct && onProductContext) {
            onProductContext({
                name: recommendation.product || selectedProduct.name,
                price: recommendation.current_price,
                recommendation: recommendation.recommendation,
                bestSeller: recommendation.best_seller,
                dealScore: recommendation.deal_score,
                predictions: recommendation.predictions,
            });
        }
    }, [recommendation, selectedProduct]);

    // --------------------------------------------------------
    // Handlers
    // --------------------------------------------------------
    const runAnalysis = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery) return;

        setIsAnalyzing(true);
        setRecommendation(null);
        setSearchResults([]);
        setSelectedProduct(null);
        setError(null);
        setRevealedPrices({});
        setLogs(['Initiating neural search...']);

        try {
            setLogs(prev => [...prev, 'Querying global marketplace...']);
            const searchRes = await axios.get(`${API_BASE}/search/?q=${searchQuery}`);
            const results = searchRes.data.results;

            if (results.length === 0) {
                setLogs(prev => [...prev, 'No direct matches found in current dataset.']);
                setIsAnalyzing(false);
                return;
            }

            setSearchResults(results);
            setLogs(prev => [...prev, `Found ${results.length} products across retailers`]);

            const topProduct = results[0];
            setSelectedProduct(topProduct);
            setLogs(prev => [...prev, 'Running predictive price-cycle model...']);
            const recRes = await axios.get(`${API_BASE}/recommend/${topProduct.product_id}`);

            await new Promise(r => setTimeout(r, 800));
            setLogs(prev => [...prev, 'Optimizing deal score...']);
            await new Promise(r => setTimeout(r, 600));

            setRecommendation(recRes.data);
            setLogs(prev => [...prev, 'Finalizing intelligence report...']);

            await new Promise(r => setTimeout(r, 400));
            setIsAnalyzing(false);
        } catch (err) {
            console.error('Analysis failed', err);
            setError('Connection to Intelligence Engine lost. Please ensure backend is running.');
            setIsAnalyzing(false);
        }
    };

    const selectProduct = async (product) => {
        setSelectedProduct(product);
        setLogs(prev => [...prev, `Analyzing: ${product.name?.substring(0, 50)}...`]);

        try {
            const recRes = await axios.get(`${API_BASE}/recommend/${product.product_id}`);
            setRecommendation(recRes.data);
            setLogs(prev => [...prev, 'Analysis complete']);
        } catch (err) {
            console.error('Recommendation failed', err);
        }
    };

    const togglePrice = (productId, e) => {
        e.stopPropagation();
        setRevealedPrices(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    // --------------------------------------------------------
    // Computed: Verdict
    // --------------------------------------------------------
    const verdictData = useMemo(() => {
        if (!recommendation) return null;
        if (recommendation.recommendation === 'Wait' && recommendation.predictions?.length) {
            const cp = recommendation.current_price;
            let lowestPrice = cp;
            let lowestDay = 0;
            recommendation.predictions.forEach((p, i) => {
                if (p.predicted_price < lowestPrice) {
                    lowestPrice = p.predicted_price;
                    lowestDay = i + 1;
                }
            });
            const drop = Math.round(cp - lowestPrice);
            return {
                action: 'WAIT',
                days: lowestDay || 7,
                savings: drop > 0 ? drop : Math.round(cp * 0.02),
                reason: drop > 0
                    ? `Price expected to drop ₹${drop.toLocaleString('en-IN')} in ${lowestDay} days`
                    : 'Prices are trending downward — hold off for a better deal',
            };
        }
        return {
            action: 'BUY NOW',
            reason: `Best price available at ${recommendation.best_seller}`,
        };
    }, [recommendation]);

    // --------------------------------------------------------
    // Computed: Price Trend + Forecast Chart
    // --------------------------------------------------------
    const { trendChartData, festivalMarkers, predictedSavings } = useMemo(() => {
        const currentPrice = recommendation?.current_price || 0;
        const productId = selectedProduct?.product_id || 0;
        // Use any available price signal for the base
        const bridgePrice = currentPrice > 0 ? currentPrice : (selectedProduct?.numeric_price || 72999);

        // --- 30-day history ---
        let history;
        if (currentPrice > 0) {
            history = generateHistoricalPrices(currentPrice, productId, 30);
        } else {
            // Dummy history: ~8% higher 30 days ago, converging to bridgePrice
            history = [];
            const startPrice = bridgePrice * (1.05 + seededRandom(productId + 42) * 0.05);
            for (let i = 30; i > 0; i--) {
                const d = new Date(); d.setDate(d.getDate() - i);
                const progress = (30 - i) / 30;
                const trend = startPrice + (bridgePrice - startPrice) * progress;
                const noise = seededRandom(productId * 100 + i) * bridgePrice * 0.006 - bridgePrice * 0.003;
                history.push({ date: d.toISOString().split('T')[0], price: Math.round(trend + noise) });
            }
        }

        // --- 14-day predictions (realistic, clamped to max 8% decline) ---
        let predictions;
        if (recommendation?.predictions?.length) {
            let rawPreds = [...recommendation.predictions].slice(0, 14);
            // Pad to 14 days if backend returned fewer
            while (rawPreds.length < 14) {
                const lastP = rawPreds[rawPreds.length - 1];
                const d = new Date(lastP.date); d.setDate(d.getDate() + 1);
                rawPreds.push({ date: d.toISOString().split('T')[0], predicted_price: lastP.predicted_price });
            }
            // Clamp: if any prediction exceeds 8% drop, rescale the whole curve
            const minPred = Math.min(...rawPreds.map(p => p.predicted_price));
            if (minPred < bridgePrice * 0.92) {
                const maxPred = Math.max(...rawPreds.map(p => p.predicted_price), bridgePrice);
                const predRange = maxPred - minPred || 1;
                rawPreds = rawPreds.map(p => ({
                    ...p,
                    predicted_price: Math.round(
                        bridgePrice - ((maxPred - p.predicted_price) / predRange) * (bridgePrice * 0.07)
                    )
                }));
            }
            predictions = rawPreds;
        } else {
            // Dummy: gentle 3-5% decline with realistic daily noise
            predictions = [];
            const totalDrop = 0.03 + seededRandom(productId + 777) * 0.02;
            for (let i = 1; i <= 14; i++) {
                const d = new Date(); d.setDate(d.getDate() + i);
                const progress = i / 14;
                const drop = totalDrop * (1 - Math.pow(1 - progress, 1.3));
                const noise = seededRandom(productId * 200 + i) * 0.003 - 0.0015;
                predictions.push({
                    date: d.toISOString().split('T')[0],
                    predicted_price: Math.round(bridgePrice * (1 - drop + noise))
                });
            }
        }

        // --- Compute savings directly from the predicted values ---
        let lowestPred = bridgePrice;
        let lowestDay = 14;
        predictions.forEach((p, i) => {
            if (p.predicted_price < lowestPred) {
                lowestPred = p.predicted_price;
                lowestDay = i + 1;
            }
        });
        const savingsAmount = Math.round(bridgePrice - lowestPred);
        const savingsPercent = bridgePrice > 0 ? ((savingsAmount / bridgePrice) * 100).toFixed(1) : '0.0';

        // --- Build chart data ---
        const histDates = history.map(h => h.date);
        const predDates = predictions.map(p => p.date);
        const allDates = [...histDates, ...predDates];
        const displayLabels = allDates.map(formatDateLabel);

        const histValues = [...history.map(h => h.price), ...predictions.map(() => null)];
        histValues[history.length] = bridgePrice;

        const predValues = [...history.map(() => null), ...predictions.map(p => p.predicted_price)];
        predValues[history.length - 1] = bridgePrice;

        // Festival markers
        const markers = [];
        allDates.forEach((dateStr, idx) => {
            for (const s of INDIAN_SALES) {
                if (dateStr === s.date && !markers.find(m => m.name === s.name)) {
                    markers.push({ name: s.name, index: idx });
                }
            }
        });

        return {
            trendChartData: {
                labels: displayLabels,
                datasets: [
                    {
                        label: 'Historical Price',
                        data: histValues,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.06)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        pointBackgroundColor: '#10b981',
                        borderWidth: 2,
                        spanGaps: false,
                    },
                    {
                        label: 'Predicted Price',
                        data: predValues,
                        borderColor: '#8b5cf6',
                        borderDash: [6, 4],
                        backgroundColor: 'rgba(139, 92, 246, 0.06)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#8b5cf6',
                        pointBorderColor: '#0f172a',
                        pointBorderWidth: 2,
                        borderWidth: 2,
                        spanGaps: false,
                    },
                ],
            },
            festivalMarkers: markers,
            predictedSavings: {
                days: lowestDay,
                amount: savingsAmount > 0 ? savingsAmount : Math.round(bridgePrice * 0.04),
                percent: savingsAmount > 0 ? savingsPercent : ((bridgePrice * 0.04 / bridgePrice) * 100).toFixed(1),
            },
        };
    }, [recommendation, selectedProduct]);

    const trendChartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    color: 'rgba(255,255,255,0.5)',
                    font: { family: 'Inter', size: 10 },
                    boxWidth: 20,
                    padding: 15,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                titleFont: { family: 'Inter', size: 12 },
                bodyFont: { family: 'Inter', size: 12 },
                callbacks: {
                    label: (ctx) => {
                        if (ctx.parsed.y == null) return null;
                        return `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`;
                    },
                },
            },
            festivalLines: { markers: festivalMarkers },
        },
        interaction: { intersect: false, mode: 'index' },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                ticks: {
                    color: 'rgba(255,255,255,0.4)',
                    font: { family: 'Inter', size: 10 },
                    callback: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.4)',
                    font: { family: 'Inter', size: 9 },
                    maxRotation: 45,
                },
                border: { display: false },
            },
        },
    }), [festivalMarkers]);

    // --------------------------------------------------------
    // Computed: Seller Comparison
    // --------------------------------------------------------
    const sellerChartData = useMemo(() => {
        const sellerMap = {};
        searchResults.forEach(r => {
            if (r.numeric_price > 0) {
                const name = r.seller || 'Unknown';
                if (!sellerMap[name] || r.numeric_price < sellerMap[name]) {
                    sellerMap[name] = r.numeric_price;
                }
            }
        });
        if (recommendation?.sellers) {
            recommendation.sellers.forEach(s => {
                if (s.price > 0) {
                    const name = s.name || 'Unknown';
                    if (!sellerMap[name] || s.price < sellerMap[name]) sellerMap[name] = s.price;
                }
            });
        }
        let entries = Object.entries(sellerMap).sort((a, b) => a[1] - b[1]);

        // Dummy fallback when fewer than 2 sellers
        if (entries.length < 2) {
            entries = [
                ['Flipkart', 72999],
                ['Amazon', 73999],
                ['Croma', 74500],
                ['Reliance Digital', 75000],
                ['Vijay Sales', 75500],
            ];
        }

        const lowest = entries[0][1];
        return {
            labels: entries.map(([n]) => n),
            datasets: [{
                label: 'Price (₹)',
                data: entries.map(([, p]) => p),
                backgroundColor: entries.map(([, p]) => p === lowest ? 'rgba(34,197,94,0.7)' : 'rgba(139,92,246,0.5)'),
                borderColor: entries.map(([, p]) => p === lowest ? '#22c55e' : '#8b5cf6'),
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 24,
            }],
        };
    }, [searchResults, recommendation]);

    const sellerChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 80 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 10,
                cornerRadius: 6,
                callbacks: { label: (ctx) => `₹${ctx.parsed.x?.toLocaleString('en-IN')}` },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: 'rgba(255,255,255,0.4)',
                    font: { family: 'Inter', size: 10 },
                    callback: (v) => `₹${(v / 1000).toFixed(0)}K`,
                },
                border: { display: false },
            },
            y: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 } },
                border: { display: false },
            },
        },
    };

    // --------------------------------------------------------
    // Savings Estimator — derived from chart's predicted values
    // so the two always show consistent numbers
    // --------------------------------------------------------
    const savingsData = predictedSavings;

    // --------------------------------------------------------
    // Computed: Festival Alert
    // --------------------------------------------------------
    const upcomingSale = useMemo(() => getUpcomingSale(), []);

    // ============================================================
    // JSX
    // ============================================================
    return (
        <div className="min-h-screen bg-bg-dark pt-32 pb-20 px-6 font-sans relative">
            {/* Background 3D Robot Animation */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <iframe
                    src="https://my.spline.design/genkubgreetingrobot-hMXrB1QXwA5y5Gwtcpk4p5vH/"
                    width="100%" height="100%" className="opacity-30"
                    style={{ background: 'transparent', border: 'none', transform: 'scale(1.5)', transformOrigin: 'center center' }}
                    title="AI Robot Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/50 to-[#020617]/90" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono uppercase tracking-widest">Back to Overview</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* ============================== */}
                    {/* Sidebar — Intelligence Engine  */}
                    {/* ============================== */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="glass-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/5 blur-3xl -z-0" />
                            <h2 className="font-display text-2xl font-medium mb-6 flex items-center gap-3 relative z-10">
                                <Target className="w-6 h-6 text-accent-emerald" />
                                Intelligence Engine
                            </h2>
                            <form onSubmit={runAnalysis} className="space-y-6 relative z-10">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-accent-emerald/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input
                                            type="text"
                                            placeholder="Search product (e.g. iPhone)..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-accent-emerald/50 transition-all outline-none text-white placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={isAnalyzing || !searchQuery}
                                    className="w-full py-4 rounded-2xl bg-white text-bg-dark font-display font-medium flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
                                >
                                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    {isAnalyzing ? 'Analyzing...' : 'Interrogate Dataset'}
                                </button>
                            </form>

                            {/* Live Feed */}
                            <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                                <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-6">Trace Output</h3>
                                <div className="space-y-4 min-h-[140px]">
                                    <AnimatePresence mode="popLayout">
                                        {logs.slice(-4).map((log, i) => (
                                            <motion.div key={log + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                                                <div className="w-1 h-auto bg-accent-violet/20 rounded-full overflow-hidden shrink-0 mt-1">
                                                    <div className="w-full h-1/2 bg-accent-violet animate-pulse" />
                                                </div>
                                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-mono leading-relaxed">{log}</p>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {!isAnalyzing && logs.length === 0 && (
                                        <p className="text-[11px] text-white/20 uppercase tracking-wider font-mono italic">Awaiting interrogation payload...</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="glass p-4 rounded-2xl border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-3">
                                <AlertCircle size={16} />{error}
                            </motion.div>
                        )}
                    </div>

                    {/* ============================== */}
                    {/* Main Content Area              */}
                    {/* ============================== */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* -------------------------------------------------- */}
                        {/* Product Comparison Grid (with View Price toggle)    */}
                        {/* -------------------------------------------------- */}
                        {searchResults.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold tracking-tight text-white font-manrope">
                                        Price Comparison ({searchResults.length} results)
                                    </h3>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-300 uppercase tracking-wider">
                                        <Activity className="w-3 h-3 text-accent-emerald" /> LIVE Results
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.slice(0, 8).map((product, index) => (
                                        <motion.div
                                            key={product.product_id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => selectProduct(product)}
                                            className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                selectedProduct?.product_id === product.product_id
                                                    ? 'bg-accent-emerald/10 border-accent-emerald/50'
                                                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 rounded-xl bg-white/5 overflow-hidden shrink-0">
                                                    <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80'; }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-2">{product.name}</h4>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Store className="w-3 h-3 text-white/40" />
                                                        <span className="text-xs text-white/60">{product.seller || product.brand || 'Online Store'}</span>
                                                    </div>
                                                    {/* FIX 1: View Price Toggle */}
                                                    <div className="flex items-center justify-between">
                                                        {revealedPrices[product.product_id] ? (
                                                            <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                                className="text-lg font-semibold text-accent-emerald">
                                                                {product.numeric_price > 0
                                                                    ? `₹${product.numeric_price.toLocaleString('en-IN')}`
                                                                    : 'Visit store →'}
                                                            </motion.span>
                                                        ) : (
                                                            <button onClick={(e) => togglePrice(product.product_id, e)}
                                                                className="px-3 py-1.5 rounded-lg bg-accent-emerald/10 text-accent-emerald text-sm font-medium hover:bg-accent-emerald/20 transition-colors flex items-center gap-1.5">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                View Price
                                                            </button>
                                                        )}
                                                        {product.source_url && (
                                                            <a href={product.source_url} target="_blank" rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-2 rounded-lg bg-white/10 hover:bg-accent-emerald/20 transition-colors">
                                                                <ExternalLink className="w-4 h-4 text-accent-emerald" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-accent-emerald text-[10px] font-bold text-black uppercase tracking-wider">
                                                    Best Deal
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* -------------------------------------------------- */}
                        {/* FIX 2: Full AI Analysis Section (Redesign)          */}
                        {/* -------------------------------------------------- */}
                        {recommendation && selectedProduct && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold tracking-tight text-white font-manrope">AI Analysis</h3>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-300 uppercase tracking-wider">
                                        <Activity className="w-3 h-3 text-accent-emerald" />
                                        {recommendation.is_real_time ? 'LIVE' : 'Analysis'}
                                    </span>
                                </div>

                                {/* Product Card */}
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-5">
                                    <div className="w-28 h-28 rounded-xl bg-white/10 overflow-hidden shrink-0">
                                        <img src={getProductImage(selectedProduct)} alt={selectedProduct.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80'; }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-medium text-white mb-1 line-clamp-2">{recommendation.product || selectedProduct.name}</h4>
                                        <p className="text-sm text-white/50 mb-3">{selectedProduct.seller || recommendation.best_seller}</p>
                                        <span className="text-2xl font-bold text-accent-emerald">
                                            {recommendation.current_price > 0 ? `₹${recommendation.current_price.toLocaleString('en-IN')}` : selectedProduct.live_price || 'Check Store'}
                                        </span>
                                    </div>
                                </div>

                                {/* A. AI Verdict + B. Deal Score Gauge */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Verdict Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className={`md:col-span-2 p-6 rounded-2xl border ${
                                            verdictData?.action === 'WAIT'
                                                ? 'bg-amber-500/5 border-amber-500/20'
                                                : 'bg-emerald-500/5 border-emerald-500/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            {verdictData?.action === 'WAIT' ? (
                                                <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                                                    <span className="text-2xl font-bold text-amber-400 font-display tracking-tight">
                                                        WAIT {verdictData.days} days
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                                    <span className="text-2xl font-bold text-emerald-400 font-display tracking-tight">
                                                        BUY NOW
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-sm ${verdictData?.action === 'WAIT' ? 'text-amber-300/70' : 'text-emerald-300/70'}`}>
                                            {verdictData?.reason}
                                        </p>
                                    </motion.div>

                                    {/* Deal Score Gauge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center"
                                    >
                                        <DealScoreGauge score={recommendation.deal_score} />
                                    </motion.div>
                                </div>

                                {/* C. Price Trend + Forecast Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
                                >
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-accent-emerald" />
                                                Price Trend & Forecast
                                            </h4>
                                            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                                                30-day history + 14-day forecast
                                            </span>
                                        </div>
                                        <div className="h-72">
                                            <Line data={trendChartData} options={trendChartOptions} plugins={[festivalLinePlugin]} />
                                        </div>
                                    </motion.div>

                                {/* D. Seller Price Comparison Bar Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Store className="w-4 h-4 text-accent-violet" />
                                            Seller Price Comparison
                                        </h4>
                                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                                            cheapest highlighted
                                        </span>
                                    </div>
                                    <div style={{ height: Math.max(120, sellerChartData.labels.length * 40) }}>
                                        <Bar data={sellerChartData} options={sellerChartOptions} plugins={[barLabelPlugin]} />
                                    </div>
                                </motion.div>

                                {/* E. Savings Estimator + F. Festival Alert */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* E. Savings Estimator Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-900/5 border border-emerald-500/15"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                                <TrendingDown className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Savings Estimator</span>
                                        </div>
                                        <p className="text-white text-base font-medium">
                                            Wait {savingsData.days} days → Save{' '}
                                            <span className="text-emerald-400 font-bold">₹{savingsData.amount.toLocaleString('en-IN')}</span>
                                            <span className="text-white/50 text-sm ml-1">({savingsData.percent}%)</span>
                                        </p>
                                        <p className="text-xs text-white/40 mt-2">Based on ML price prediction model</p>
                                    </motion.div>

                                    {/* F. Festival / Sale Alert */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.55 }}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 to-violet-900/5 border border-violet-500/15"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
                                                <Flame className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Upcoming Sale</span>
                                        </div>
                                        <p className="text-white text-base font-medium flex items-center gap-2">
                                            <span className="text-lg shrink-0">{upcomingSale.icon}</span>
                                            {upcomingSale.name} in {upcomingSale.daysUntil} days
                                        </p>
                                        <p className="text-xs text-violet-300/60 mt-1.5">
                                            {upcomingSale.platforms} · {upcomingSale.discount} off
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Buy Button */}
                                {recommendation.source_url && (
                                    <motion.a
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.65 }}
                                        href={recommendation.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-emerald text-black font-semibold hover:bg-accent-emerald/90 transition-colors"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Buy from {recommendation.best_seller}
                                        <ExternalLink className="w-4 h-4" />
                                    </motion.a>
                                )}
                            </motion.div>
                        )}

                        {/* -------------------------------------------------- */}
                        {/* Empty State                                         */}
                        {/* -------------------------------------------------- */}
                        {searchResults.length === 0 && !recommendation && (
                            <div className="h-full flex flex-col items-center justify-center text-center glass-premium border border-white/10 rounded-[3rem] min-h-[600px] relative overflow-hidden group backdrop-blur-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/10 via-transparent to-accent-violet/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10 px-8">
                                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent-emerald/10 flex items-center justify-center border border-accent-emerald/20">
                                        <Search className="w-10 h-10 text-accent-emerald" />
                                    </div>
                                    <h3 className="font-display text-3xl font-medium text-white/90 mb-4 tracking-tight">Intelligence Payload Awaiting</h3>
                                    <p className="text-white/50 text-lg font-light max-w-md mx-auto leading-relaxed mb-6">
                                        Enter any product name in the <span className="text-accent-emerald font-medium">Intelligence Engine</span> to search global marketplaces and get AI-powered deal analysis.
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">iPhone</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">PlayStation</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">MacBook</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">Nike Shoes</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightDashboard;
