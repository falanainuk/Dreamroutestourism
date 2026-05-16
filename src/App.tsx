/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Destinations } from './components/Destinations';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { Admin } from './components/Admin';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider, useData } from './contexts/DataContext';
import { FloatingActions } from './components/FloatingActions';
import { BookingModal } from './components/BookingModal';
import { Contact } from './components/Contact';
import { Packages } from './components/Packages';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AllPackages } from './pages/AllPackages';

function MainLayout() {
  const { data, loading } = useData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (loading) return null;

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-primary selection:bg-accent selection:text-primary"
    >
      <Navbar onBookClick={() => setIsBookingOpen(true)} />
      
      <main>
        <Hero onBookClick={() => setIsBookingOpen(true)} />
        
        {/* About Section / Sub-Hero */}
        <section id="about" className="py-24 md:py-40 bg-surface text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight mb-12">
                We believe travel should be an <br />
                <span className="font-serif italic text-accent underline decoration-accent/30 underline-offset-8">extension of your lifestyle</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-12">
                {data?.settings.description}
              </p>
              <div className="flex justify-center items-center gap-12 grayscale opacity-50 overflow-x-auto pb-4">
                {['LUXURY', 'ELITE', 'PREMIUM', 'BESPOKE'].map((brand) => (
                  <span key={brand} className="text-xs font-bold tracking-[0.5em]">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Destinations 
          onItemClick={handleItemClick} 
          onBookClick={() => setIsBookingOpen(true)} 
        />
        
        <Services onBookClick={handleItemClick} />

        <Packages 
          onItemClick={handleItemClick} 
          onBookClick={() => setIsBookingOpen(true)} 
        />
        
        {/* Experience Banner */}
        <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Scenic view"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
          <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-widest text-white">Elevate Your Reality</h2>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-white text-primary px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300"
            >
              Start Planning
            </button>
          </div>
        </section>

        <Contact />
        
      </main>

      <Footer />
      
      <FloatingActions />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ItemDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        item={selectedItem}
        onBookClick={() => setIsBookingOpen(true)}
      />
    </motion.div>
  );
}

function AppContent() {
  const { data } = useData();

  useEffect(() => {
    if (data?.settings.logo) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = data.settings.logo;
    }
    
    if (data?.settings.siteName) {
      document.title = data.settings.siteName;
    }
  }, [data]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/packages" element={<AllPackages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

