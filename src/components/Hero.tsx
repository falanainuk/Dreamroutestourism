import { motion } from 'motion/react';
import { ArrowRight, Plane, Shield, Globe } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Hero({ onBookClick }: { onBookClick?: () => void }) {
  const { data } = useData();
  const heroImage = data?.settings.heroImage || "https://images.unsplash.com/photo-1506953823976-52e1bdc0149a?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Resort"
          className="w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.55) saturate(0.85)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,14,24,0.45) 0%, rgba(8,14,24,0.25) 40%, rgba(8,14,24,0.95) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border mb-10"
          style={{ borderColor: 'rgba(200,169,110,0.3)', background: 'rgba(200,169,110,0.07)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ backgroundColor: '#C8A96E' }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#C8A96E' }}>
            Discover Your Dream Route
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-bold leading-none tracking-tight mb-8"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontFamily: 'Inter, sans-serif', color: '#F0EDE8' }}
        >
          THE WORLD<br />
          <em style={{ fontFamily: '"DM Serif Display", serif', color: '#C8A96E', fontStyle: 'italic', fontWeight: 400 }}>
            Awaits You
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-lg md:text-xl max-w-xl mx-auto mb-12 font-light leading-relaxed"
          style={{ color: 'rgba(240,237,232,0.6)' }}
        >
          Premium travel solutions — tailored visas, exclusive stays, and bespoke itineraries crafted for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onBookClick}
            className="group relative overflow-hidden rounded-full px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: '#C8A96E', color: '#080E18', boxShadow: '0 8px 32px rgba(200,169,110,0.3)' }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Your Journey
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
          <a
            href="#destinations"
            className="rounded-full px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            style={{ border: '1px solid rgba(240,237,232,0.18)', color: '#F0EDE8', background: 'rgba(255,255,255,0.04)' }}
          >
            View Destinations
          </a>
        </motion.div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-10 left-0 right-0 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8">
          {[
            { icon: <Globe size={18} />, label: 'Global Coverage', value: '150+ Countries' },
            { icon: <Shield size={18} />, label: 'Secure Travel', value: '100% Protection' },
            { icon: <Plane size={18} />, label: 'Flight Options', value: 'Premium Partner' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-4 pl-6"
              style={{ borderLeft: '1px solid rgba(200,169,110,0.2)' }}
            >
              <div style={{ color: '#C8A96E' }}>{stat.icon}</div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: 'rgba(240,237,232,0.4)' }}>
                  {stat.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: '#F0EDE8' }}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
