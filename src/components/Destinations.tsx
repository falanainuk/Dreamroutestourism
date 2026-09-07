import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export function Destinations({ onItemClick, onBookClick }: { onItemClick?: (item: any) => void, onBookClick?: () => void }) {
  const { data } = useData();
  const [filter, setFilter] = useState<'all' | 'fixed' | 'flexible'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const destinations = (data?.destinations || []).filter(dest =>
    filter === 'all' ? true : dest.departureType === filter
  );

  const visibleCount = 3;
  const maxIndex = Math.max(0, destinations.length - visibleCount);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  const visible = destinations.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section id="destinations" className="py-24 md:py-32 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4"
            >
              Curated Experiences
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
            >
              Hand-picked <br />
              <span className="font-serif italic text-accent">Destinations</span>
            </motion.h2>

            <div className="flex gap-2 p-1 bg-surface border border-white/5 rounded-full w-fit">
              {(['all', 'fixed', 'flexible'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setFilter(type); setCurrentIndex(0); }}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    filter === type ? 'bg-accent text-primary' : 'hover:bg-white/5 text-gray-500'
                  }`}
                >
                  {type === 'all' ? 'All Tours' : `${type} departure`}
                </button>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-8"
          >
            <Link to="/packages" className="flex items-center gap-2 group text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Explore All <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Carousel with side nav buttons */}
        <div className="relative">
          {/* Left Nav Button */}
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 shadow-xl disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous destinations"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex + filter}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {visible.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group relative h-[550px] overflow-hidden rounded-3xl"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-6 left-6">
                      <div className="px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[8px] font-bold uppercase tracking-widest">
                        {dest.departureType}
                      </div>
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-accent" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">{dest.country}</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{dest.name}</h3>

                      <div className="flex items-center justify-between overflow-hidden">
                        <div className="space-y-1">
                          <p className="text-accent font-bold text-sm tracking-widest">AED {dest.price}</p>
                          <button
                            onClick={() => onItemClick?.(dest)}
                            className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-accent transition-colors"
                          >
                            More Information
                          </button>
                        </div>
                        <motion.div
                          onClick={onBookClick}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary cursor-pointer hover:bg-accent transition-colors"
                        >
                          <ArrowUpRight size={24} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Nav Button */}
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 shadow-xl disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next destinations"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dot Indicators */}
          {destinations.length > visibleCount && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
