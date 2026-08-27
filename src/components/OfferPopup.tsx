import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight } from "lucide-react";
import { useData } from "../contexts/DataContext";

interface OfferPopupProps {
  onContactClick: () => void;
}

export function OfferPopup({ onContactClick }: OfferPopupProps) {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!data?.settings.popup?.enabled) return;
    const offerShown = sessionStorage.getItem("dream_route_offer_shown");
    if (!offerShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("dream_route_offer_shown", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data?.settings.popup?.enabled) return null;

  const { title, description, image } = data.settings.popup;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-accent hover:text-primary transition-all duration-300 z-20 text-white"
              aria-label="Close promotion"
            >
              <X size={18} />
            </button>

            {image && (
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
              </div>
            )}

            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px]">
                  Limited Time Offer
                </span>
                <h3 className="text-2xl font-bold tracking-tighter text-text">
                  {title}
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onContactClick();
                  }}
                  className="flex-grow bg-accent text-primary font-bold uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Contact Now <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:px-6 bg-white/5 border border-white/10 text-text font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
