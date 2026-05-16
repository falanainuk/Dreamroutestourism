import { motion, AnimatePresence } from 'motion/react';
import { X, Plane, Clock, DollarSign, ArrowRight, MapPin } from 'lucide-react';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onBookClick: () => void;
}

export function ItemDetailModal({ isOpen, onClose, item, onBookClick }: ItemDetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Column */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={item.image} 
                alt={item.title || item.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary/60 to-transparent" />
            </div>

            {/* Content Column */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 text-accent mb-4">
                <Plane size={16} className="-rotate-45" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {item.departureType ? `${item.departureType} Departure` : "Premium Experience"}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{item.title || item.name}</h2>
              
              {item.country && (
                <div className="flex items-center gap-2 mb-6 opacity-60">
                  <MapPin size={16} className="text-accent" />
                  <span className="text-sm uppercase tracking-widest font-bold">{item.country || item.location}</span>
                </div>
              )}

              <div className="space-y-6 mb-12">
                <p className="text-gray-300 leading-relaxed font-light">
                  {item.details}
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Availability</p>
                      <p className="text-sm font-bold">Daily / Flexible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Price Starting From</p>
                      <p className="text-sm font-bold">AED {item.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => {
                    onClose();
                    onBookClick();
                  }}
                  className="w-full bg-accent text-primary py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-accent/20"
                >
                  Request Booking
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
