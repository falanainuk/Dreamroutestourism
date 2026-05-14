import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plane, Calendar, MapPin, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { data } = useData();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Automatically close the modal after 3 seconds of showing success message
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Request Sent!</h3>
                <p className="text-gray-400 max-w-md">
                  Thank you for choosing {data?.settings.siteName || 'us'}. Our luxury travel concierges will review your request and contact you shortly.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Plane className="text-accent -rotate-45" size={24} />
                    <h2 className="text-2xl font-bold uppercase tracking-widest">Start Your Journey</h2>
                  </div>
                  <p className="text-gray-400 font-light">Fill out the form below to connect with our elite travel designers.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                      <input required type="text" className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2"><Mail size={14} /> Email Address</label>
                      <input required type="email" className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2"><Phone size={14} /> Phone Number</label>
                      <input required type="tel" className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="+1 234 567 890" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} /> Destination</label>
                      <select className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none">
                        <option value="">Select Destination</option>
                        {data?.destinations.map(d => (
                          <option key={d.id} value={d.name}>{d.name}, {d.country}</option>
                        ))}
                        <option value="other">Other / Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2"><Calendar size={14} /> Preferred Dates</label>
                    <input type="text" className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="e.g. Mid-August or Exact Dates" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2"><MessageSquare size={14} /> Special Requests / Details</label>
                    <textarea rows={4} className="w-full bg-primary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Tell us about your dream trip..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-accent text-primary py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300">
                    Request Booking
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
