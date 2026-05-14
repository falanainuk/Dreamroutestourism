import { motion } from 'motion/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Destinations() {
  const { data } = useData();
  const destinations = data?.destinations || [];

  return (
    <section id="destinations" className="py-24 md:py-32 bg-primary">
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
              className="text-4xl md:text-6xl font-bold tracking-tighter"
            >
              Hand-picked <br />
              <span className="font-serif italic text-accent">Destinations</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
             <button className="flex items-center gap-2 group text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Explore All <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[450px] overflow-hidden rounded-3xl cursor-pointer"
            >
              <img 
                src={dest.image} 
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-accent" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">{dest.country}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{dest.name}</h3>
                
                <div className="flex items-center justify-between overflow-hidden">
                  <p className="text-accent font-bold text-sm tracking-widest">{dest.price}</p>
                  <motion.div 
                    initial={{ x: 100 }}
                    whileHover={{ x: 0 }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300"
                  >
                    <ArrowUpRight size={20} />
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
