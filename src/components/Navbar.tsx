import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onBookClick?: () => void;
}

export function Navbar({ onBookClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Destinations', href: '/#destinations' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6",
        isScrolled ? "bg-surface/90 backdrop-blur-lg py-4 border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          {data?.settings.logo ? (
            <img src={data.settings.logo} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plane className="text-primary w-6 h-6 -rotate-45" />
            </div>
          )}
          <span className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">
            {data?.settings.siteName || 'Dream Route'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium tracking-widest uppercase hover:text-accent transition-colors duration-300 pointer-events-auto"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-accent" />}
          </button>

          <button 
            onClick={onBookClick}
            className="bg-accent text-primary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="p-2 rounded-full">
            {theme === 'dark' ? <Sun size={22} className="text-accent" /> : <Moon size={22} className="text-accent" />}
          </button>
          <button 
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} className="text-accent" /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium tracking-widest uppercase py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookClick?.();
                }}
                className="w-full mt-4 bg-accent text-primary py-3 rounded-lg font-bold uppercase tracking-widest text-sm"
              >
                Book Now
              </button>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-gray-500 uppercase tracking-widest mt-4 text-center"
              >
                Admin console
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
