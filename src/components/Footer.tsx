import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Footer() {
  const { data } = useData();
  const socials = data?.settings.socials;

  const socialIcons = [
    { Icon: Instagram, href: socials?.instagram },
    { Icon: Twitter, href: socials?.twitter },
    { Icon: Facebook, href: socials?.facebook },
  ];

  return (
    <footer id="contact" className="bg-primary pt-24 pb-12 border-t border-text/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img
                src={data?.settings.logo || '/logo.png'}
                alt={data?.settings.siteName || 'Dream Routes Tourism'}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-text/60 text-lg max-w-md leading-relaxed font-light mb-8">
              {data?.settings.description}
            </p>
            <div className="flex gap-4">
              {socialIcons.map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-12 h-12 rounded-full border border-text/20 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 text-text">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-accent">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Destinations', href: '/#destinations' },
                { name: 'Packages', href: '/#packages' },
                { name: 'Services', href: '/#services' },
                { name: 'About Us', href: '/#about' },
                { name: 'Contact', href: '/#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-text/60 hover:text-accent transition-colors uppercase text-xs tracking-widest font-medium">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-accent">Newsletter</h4>
            <p className="text-text/60 text-sm mb-6 font-light">Subscribe to get secret travel deals.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-text/5 border border-text/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-accent transition-colors text-text placeholder:text-text/40"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary hover:scale-105 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-text/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text/40 text-xs tracking-widest uppercase">
            © 2024 Dream Route Tourism LLC. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-text/40 hover:text-accent text-xs tracking-widest uppercase transition-colors">Privacy Policy</a>
            <a href="#" className="text-text/40 hover:text-accent text-xs tracking-widest uppercase transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
