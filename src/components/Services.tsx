import { motion } from 'motion/react';
import { FileText, Plane, Hotel, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const iconMap: Record<string, any> = {
  "0": <FileText className="w-5 h-5" />,
  "1": <Plane className="w-5 h-5" />,
  "2": <Hotel className="w-5 h-5" />,
};

export function Services({ onBookClick }: { onBookClick?: (service: any) => void }) {
  const { data } = useData();
  const services = data?.services || [];

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* Subtle glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(200,169,110,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4"
            style={{ color: '#C8A96E' }}
          >
            What We Offer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            style={{ color: '#F0EDE8' }}
          >
            Travel Solutions<br />
            <em style={{ fontFamily: '"DM Serif Display", serif', color: '#C8A96E', fontWeight: 400, fontStyle: 'italic' }}>
              Without Compromise
            </em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,169,110,0.2)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(200,169,110,0.08), 0 4px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
              }}
            >
              {/* Image */}
              <div className="h-44 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(0.75) saturate(0.8)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(8,14,24,0.9) 100%)' }} />
                {/* Icon badge */}
                <div
                  className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.25)', color: '#C8A96E' }}
                >
                  {iconMap[i] || <ShieldCheck className="w-5 h-5" />}
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="text-lg font-bold mb-3 leading-snug" style={{ color: '#F0EDE8' }}>
                  {service.title}
                </h3>
                <p className="text-sm font-light leading-relaxed mb-6 line-clamp-2" style={{ color: 'rgba(240,237,232,0.5)' }}>
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-wider" style={{ color: '#C8A96E' }}>
                    {data?.settings.currency} {service.price}
                  </span>
                  <button
                    onClick={() => onBookClick?.(service)}
                    className="text-[10px] font-bold uppercase tracking-widest pb-0.5 transition-all duration-200"
                    style={{ color: 'rgba(240,237,232,0.4)', borderBottom: '1px solid rgba(200,169,110,0.3)' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.color = '#C8A96E';
                      el.style.borderBottomColor = '#C8A96E';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.color = 'rgba(240,237,232,0.4)';
                      el.style.borderBottomColor = 'rgba(200,169,110,0.3)';
                    }}
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
