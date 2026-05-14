import { motion } from 'motion/react';
import { ArrowRight, Plane, Shield, Globe } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Hero() {
  const { data } = useData();
  const heroImage = data?.settings.heroImage || "https://images.unsplash.com/photo-1506953823976-52e1bdc0149a?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury Resort" 
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent">Discover Your Dream Route</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-bold leading-[0.9] tracking-tighter mb-8"
        >
          THE WORLD <br />
          <span className="text-accent italic font-serif">Awaits You</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-text opacity-70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Experience premium travel solutions, from tailored visas to exclusive global stays. 
          Your journey is our passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative bg-accent text-primary px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:pr-14">
            <span className="relative z-10">Start Your Journey</span>
            <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
          <button className="px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all duration-300">
            View Destinations
          </button>
        </motion.div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-10 left-0 right-0 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
          {[
            { icon: <Globe size={20} />, label: "Global Coverage", value: "150+ Countries" },
            { icon: <Shield size={20} />, label: "Secure Travel", value: "100% Protection" },
            { icon: <Plane size={20} />, label: "Flight Options", value: "Premium Partner" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="flex items-center gap-4 border-l border-white/10 pl-6"
            >
              <div className="text-accent">{stat.icon}</div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{stat.label}</p>
                <p className="text-lg font-medium">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
