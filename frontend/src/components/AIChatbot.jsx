import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, Minimize2, Search, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const AIChatbot = ({ onSearch, productContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your InsightCart assistant. Ask me about any product and I\'ll search for the best deals!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // When product context changes, add a system message
    const prevContextRef = useRef(null);
    useEffect(() => {
        if (productContext && productContext.name !== prevContextRef.current) {
            prevContextRef.current = productContext.name;
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I see you're looking at **${productContext.name}**${productContext.price > 0 ? ` (₹${productContext.price.toLocaleString('en-IN')})` : ''}. Ask me anything about it — pricing, predictions, or whether you should buy now!`,
                isContext: true,
            }]);
        }
    }, [productContext]);

    // Detect if query is about a product
    const extractProductQuery = (text) => {
        const productKeywords = ['find', 'search', 'look for', 'want', 'need', 'buy', 'price', 'compare', 'best deal', 'where to buy'];
        const textLower = text.toLowerCase();
        if (productKeywords.some(kw => textLower.includes(kw))) {
            let product = text;
            productKeywords.forEach(kw => {
                product = product.replace(new RegExp(kw, 'gi'), '').trim();
            });
            product = product.replace(/\b(the|a|an|for|me|please|can you|could you|i)\b/gi, '').trim();
            if (product.length > 2) return product;
        }
        const productPatterns = /\b(iphone|samsung|macbook|laptop|headphones|airpods|playstation|ps5|xbox|tv|monitor|camera|watch|shoes|nike|adidas)\b/i;
        const match = text.match(productPatterns);
        if (match) return text;
        return null;
    };

    // Build context string for the backend
    const buildContextString = () => {
        if (!productContext) return '';
        const parts = [
            `Product: ${productContext.name}`,
            productContext.price > 0 ? `Current price: ₹${productContext.price.toLocaleString('en-IN')}` : null,
            `AI recommendation: ${productContext.recommendation}`,
            `Best seller: ${productContext.bestSeller}`,
            productContext.dealScore ? `Deal score: ${productContext.dealScore}/100` : null,
        ].filter(Boolean);

        // Add prediction summary
        if (productContext.predictions?.length) {
            const prices = productContext.predictions.map(p => p.predicted_price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            parts.push(`Predicted price range (next 7 days): ₹${Math.round(min).toLocaleString('en-IN')} - ₹${Math.round(max).toLocaleString('en-IN')}`);
        }

        return parts.join('. ');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const productQuery = extractProductQuery(currentInput);

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${API_BASE}/chat/`, {
                message: currentInput,
                context: buildContextString(),
            });

            const aiResponse = response.data.response || response.data.message || 'I found some insights for you.';

            if (productQuery && onSearch) {
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, searchQuery: productQuery }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            // Context-aware fallback when backend is unavailable
            let fallback = "I'm having trouble connecting. Please try again.";
            if (productContext) {
                const q = currentInput.toLowerCase();
                if (q.includes('buy') || q.includes('should i') || q.includes('worth')) {
                    fallback = productContext.recommendation === 'Buy Now'
                        ? `Based on our analysis, ${productContext.name} is at a good price right now. Our AI recommends buying now from ${productContext.bestSeller}.`
                        : `Our AI suggests waiting — ${productContext.name} is expected to drop in price soon. Hold off for a better deal.`;
                } else if (q.includes('price') || q.includes('drop') || q.includes('cheaper')) {
                    if (productContext.predictions?.length) {
                        const prices = productContext.predictions.map(p => p.predicted_price);
                        const lowest = Math.round(Math.min(...prices));
                        fallback = `${productContext.name} is currently ₹${productContext.price?.toLocaleString('en-IN')}. Our model predicts it could go as low as ₹${lowest.toLocaleString('en-IN')} in the next 7 days.`;
                    }
                } else if (q.includes('where') || q.includes('cheapest') || q.includes('best')) {
                    fallback = `The best price we found for ${productContext.name} is at ${productContext.bestSeller}${productContext.price > 0 ? ` for ₹${productContext.price.toLocaleString('en-IN')}` : ''}.`;
                }
            }
            setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchClick = (query) => {
        if (onSearch) {
            setIsOpen(false);
            onSearch(query);
        }
    };

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    // Quick questions when product context exists
    const quickQuestions = productContext ? [
        'Should I buy this now?',
        'Will the price drop?',
        'Where is it cheapest?',
    ] : [];

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="pointer-events-auto mb-6 w-[380px] h-[580px] rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative bg-[#0a0a0a]/90 backdrop-blur-xl"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-emerald/10 blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-violet/10 blur-[80px]" />

                        {/* Header */}
                        <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center backdrop-blur-md relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-emerald to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-display font-medium text-white text-base">Insight Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        <span className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest">
                                            {productContext ? 'Context Active' : 'System Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                                <Minimize2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Product Context Banner */}
                        {productContext && (
                            <div className="px-5 py-2.5 bg-accent-emerald/5 border-b border-accent-emerald/10 relative z-10">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                                    <p className="text-[11px] text-accent-emerald/80 font-mono truncate">
                                        Viewing: {productContext.name}
                                        {productContext.price > 0 ? ` — ₹${productContext.price.toLocaleString('en-IN')}` : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <Sparkles size={14} className="text-accent-emerald" />
                                        </div>
                                    )}
                                    <div className={`rounded-2xl max-w-[85%] shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-accent-emerald to-emerald-600 text-white rounded-br-none shadow-emerald-900/20 p-4'
                                            : `bg-white/5 text-white/90 border border-white/10 rounded-bl-none backdrop-blur-md ${msg.isContext ? 'border-accent-emerald/20 bg-accent-emerald/5' : ''}`
                                    }`}>
                                        <div className={msg.role === 'assistant' ? 'p-4 pb-2' : ''}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                        {msg.searchQuery && (
                                            <button onClick={() => handleSearchClick(msg.searchQuery)}
                                                className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-accent-emerald to-emerald-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                                <Search size={14} />
                                                Search "{msg.searchQuery}"
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Sparkles size={14} className="text-accent-emerald" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-bl-none flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-accent-emerald/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-accent-emerald/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-accent-emerald/50 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {quickQuestions.length > 0 && !isLoading && (
                            <div className="px-5 py-2 border-t border-white/5 relative z-10 flex gap-2 overflow-x-auto scrollbar-none">
                                {quickQuestions.map((q) => (
                                    <button key={q} onClick={() => handleQuickQuestion(q)}
                                        className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-5 border-t border-white/5 bg-white/[0.02] backdrop-blur-md relative z-10">
                            <form onSubmit={handleSend} className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={productContext ? `Ask about ${productContext.name?.split(' ').slice(0, 3).join(' ')}...` : 'Ask about prices...'}
                                    className="w-full bg-black/20 text-white text-sm rounded-xl pl-4 pr-12 py-4 border border-white/10 focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/50 outline-none placeholder:text-white/20 transition-all shadow-inner"
                                />
                                <button type="submit" disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-accent-emerald text-white disabled:opacity-50 disabled:bg-transparent disabled:text-white/20 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
                                    <Send size={16} className={input.trim() ? 'translate-x-0.5' : ''} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)] transition-all duration-300 relative z-50 ${
                    isOpen
                        ? 'bg-neutral-900 border border-white/10 text-white'
                        : 'bg-gradient-to-tr from-accent-emerald to-emerald-500 text-white'
                }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={28} className="fill-white/20" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#020617]"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default AIChatbot;
