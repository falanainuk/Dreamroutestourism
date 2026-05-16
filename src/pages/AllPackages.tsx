import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { useState, useEffect } from 'react';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';

export function AllPackages() {
  const { data, loading } = useData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading || !data) return null;

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const packages = data.packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary">
      <Navbar onBookClick={() => setIsBookingOpen(true)} />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4"
              >
                Our Collection
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter"
              >
                Explore All <br />
                <span className="font-serif italic text-accent">Travel Packages</span>
              </motion.h1>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by destination..."
                className="w-full bg-surface border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-accent transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative h-[500px] overflow-hidden rounded-3xl"
              >
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">{pkg.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{pkg.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-accent font-bold text-lg tracking-widest">
                        {data.settings.currency} {pkg.price}
                      </p>
                      <button 
                        onClick={() => handleItemClick(pkg)}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-accent transition-colors"
                      >
                        More Information
                      </button>
                    </div>
                    <div 
                      onClick={() => setIsBookingOpen(true)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary cursor-pointer hover:bg-accent transition-colors"
                    >
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {packages.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 font-light">No packages found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ItemDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        item={selectedItem}
        onBookClick={() => setIsBookingOpen(true)}
      />
    </div>
  );
}
