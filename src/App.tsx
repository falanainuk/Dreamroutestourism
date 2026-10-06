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
import { GoogleReviews } from './components/GoogleReviews';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AllPackages } from './pages/AllPackages';
import { OfferPopup } from './components/OfferPopup';
import { VCardPage } from './pages/VCardPage';

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
              <p className="text-text/60 text-lg md:text-xl font-light leading-relaxed mb-12">
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
        
        <GoogleReviews />

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
      <OfferPopup onContactClick={() => setIsBookingOpen(true)} />
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

    // Dynamic SEO from admin settings
    const seo = data?.settings.seo;
    const siteName = data?.settings.siteName || 'Dream Routes Tourism';
    document.title = seo?.title || siteName;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    const setOgMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    if (seo?.description) setMeta('description', seo.description);
    if (seo?.keywords) setMeta('keywords', seo.keywords);
    setOgMeta('og:title', seo?.title || siteName);
    setOgMeta('og:description', seo?.description || data?.settings.description || '');
    setOgMeta('og:type', 'website');
    setMeta('robots', 'index, follow');
    setMeta('author', siteName);
  }, [data]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/packages" element={<AllPackages />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dreamroutes" element={<VCardPage />} />
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

