import { motion } from 'motion/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export function Packages({ onItemClick, onBookClick }: { onItemClick?: (item: any) => void, onBookClick?: () => void }) {
  const { data } = useData();
  const packages = data?.packages || [];

  if (packages.length === 0) return null;

  return (
    <section id="packages" className="py-24 md:py-32 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4"
            >
              Exclusive Offers
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tighter"
            >
              Tour <br />
              <span className="font-serif italic text-accent">Packages</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/packages" className="flex items-center gap-2 group text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Explore All <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 custom-scrollbar snap-x">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative min-w-[300px] md:min-w-[400px] h-[550px] overflow-hidden rounded-3xl snap-start"
            >
              <img 
                src={pkg.image} 
                alt={pkg.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-accent" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">{pkg.location}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">{pkg.title}</h3>
                
                <div className="flex items-center justify-between overflow-hidden">
                  <div className="space-y-1">
                    <p className="text-accent font-bold text-sm tracking-widest">
                      {data?.settings.currency} {pkg.price}
                    </p>
                    <button 
                      onClick={() => onItemClick?.(pkg)}
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
        </div>
      </div>
    </section>
  );
}
