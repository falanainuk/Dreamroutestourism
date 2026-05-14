import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Instagram, Twitter, Facebook, Plus, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { cn } from '../lib/utils';

export function FloatingActions() {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const WHATSAPP_NUMBER = "971565152143";
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}`;
  
  const socials = data?.settings.socials;

  const socialLinks = [
    { Icon: Instagram, href: socials?.instagram, color: "hover:bg-pink-600 hover:text-white" },
    { Icon: Twitter, href: socials?.twitter, color: "hover:bg-blue-400 hover:text-white" },
    { Icon: Facebook, href: socials?.facebook, color: "hover:bg-blue-600 hover:text-white" },
  ].filter(link => link.href);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-12 h-12 bg-surface/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg",
                  social.color
                )}
              >
                <social.Icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Main WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:scale-110 hover:bg-green-600 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-0" />
          <MessageCircle size={28} />
        </a>

        {/* Social Toggle Button */}
        {socialLinks.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/10 transition-all duration-300"
          >
            {isOpen ? <X size={20} /> : <Plus size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
