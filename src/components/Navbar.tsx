import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Destinations', href: '/#destinations' },
    { name: 'Packages',    href: '/#packages' },
    { name: 'Services',    href: '/#services' },
    { name: 'About',       href: '/#about' },
    { name: 'Contact',     href: '/#contact' },
    { name: 'Connect',     href: '/dreamroutes' },
  ];

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.5s ease, padding 0.4s ease, border-color 0.4s ease',
        padding: isScrolled ? '1rem 0' : '1.75rem 0',
        background: isScrolled ? 'rgba(8,14,24,0.88)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(200,169,110,0.1)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <img
              src={data?.settings.logo || '/logo.png'}
              alt={data?.settings.siteName || 'Dream Routes Tourism'}
              className="h-10 w-auto object-contain"
              style={{ background: 'white', padding: '4px', borderRadius: '6px' }}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300"
              style={{ color: 'rgba(240,237,232,0.65)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C8A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.65)')}
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'rgba(240,237,232,0.5)' }}
          >
            {theme === 'dark'
              ? <Sun size={17} style={{ color: '#C8A96E' }} />
              : <Moon size={17} style={{ color: '#C8A96E' }} />}
          </button>

          <button
            onClick={onBookClick}
            className="rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: '#C8A96E', color: '#080E18',
              padding: '0.6rem 1.4rem',
              boxShadow: '0 4px 16px rgba(200,169,110,0.25)',
            }}
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="p-2 rounded-full">
            {theme === 'dark'
              ? <Sun size={19} style={{ color: '#C8A96E' }} />
              : <Moon size={19} style={{ color: '#C8A96E' }} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: '#F0EDE8' }}
          >
            {isMobileMenuOpen
              ? <X size={26} style={{ color: '#C8A96E' }} />
              : <Menu size={26} />}
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
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(8,14,24,0.97)', borderBottom: '1px solid rgba(200,169,110,0.1)' }}
          >
            <div className="flex flex-col gap-1 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-widest uppercase py-3 transition-colors duration-200"
                  style={{
                    color: 'rgba(240,237,232,0.65)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => { setIsMobileMenuOpen(false); onBookClick?.(); }}
                className="w-full mt-5 rounded-full font-bold uppercase tracking-widest text-sm py-3.5 transition-all duration-300"
                style={{ background: '#C8A96E', color: '#080E18' }}
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
