import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Analytics from './components/Analytics';
import Specs from './components/Specs';
import DashboardRecap from './components/DashboardRecap';
import InsightDashboard from './components/InsightDashboard';

import UserInterests from './components/UserInterests';
import AIChatbot from './components/AIChatbot';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productContext, setProductContext] = useState(null);

  // Handler for chatbot to trigger search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowDashboard(true);
  };

  useEffect(() => {
    if (showDashboard) {
      window.scrollTo(0, 0);
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showDashboard]);

  return (
    <main className="bg-[#020617] text-white selection:bg-accent-emerald/30 selection:text-white overflow-x-hidden min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-emerald/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-violet/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10">
        {showDashboard ? (
          <InsightDashboard onBack={() => { setShowDashboard(false); setSearchQuery(''); setProductContext(null); }} initialQuery={searchQuery} onProductContext={setProductContext} />
        ) : (
          <>
            <Hero onStart={() => setShowDashboard(true)} />

            {/* Content Sections with consistent spacing */}
            <div className="space-y-40 pb-40">
              <section className="animate-on-scroll px-6">
                <Features />
              </section>

              <section className="animate-on-scroll px-6">
                <Analytics />
              </section>

              <section className="animate-on-scroll">
                <UserInterests onStart={() => setShowDashboard(true)} />
              </section>

              <section className="animate-on-scroll max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-8">
                    <Specs onStart={() => setShowDashboard(true)} />
                  </div>
                  <div className="lg:col-span-4 lg:sticky lg:top-32">
                    <DashboardRecap />
                  </div>
                </div>
              </section>

            </div>

            <footer className="py-20 border-t border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-display font-medium tracking-tighter text-white">Insight Cart</div>
                  <p className="text-sm text-white/30 font-light font-mono">© 2026 AI-Powered Price Intelligence</p>
                </div>

              </div>
            </footer>
          </>
        )}

        {/* Persistent Chatbot */}
        <AIChatbot onSearch={handleSearch} productContext={productContext} />
      </div>
    </main>
  );
}

export default App;
