import { motion } from 'motion/react';
import { CreditCard, FileText, LayoutDashboard, Utensils, Plane, Hotel, ShieldCheck, Headphones } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const iconMap: Record<string, any> = {
  "0": <FileText className="w-8 h-8" />,
  "1": <Plane className="w-8 h-8" />,
  "2": <Hotel className="w-8 h-8" />,
};

export function Services({ onBookClick }: { onBookClick?: (service: any) => void }) {
  const { data } = useData();
  const services = data?.services || [];

  return (
    <section id="services" className="py-24 md:py-32 bg-surface backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4"
          >
            What We Offer
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            Travel Solutions <br />
            <span className="font-serif italic text-accent">Without Compromise</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-0 rounded-3xl bg-primary/20 border border-white/5 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 backdrop-blur-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent backdrop-blur-md">
                  {iconMap[i] || <ShieldCheck className="w-6 h-6" />}
                </div>
              </div>

              <div className="p-10">
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed mb-6 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-accent font-bold tracking-widest text-sm">
                    {data?.settings.currency} {service.price}
                  </span>
                  <button 
                    onClick={() => onBookClick?.(service)}
                    className="text-[10px] font-bold uppercase tracking-widest text-accent border-b border-accent/30 pb-1 hover:border-accent transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
