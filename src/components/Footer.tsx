import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Footer() {
  const { data } = useData();
  const socials = data?.settings.socials;

  const socialIcons = [
    { Icon: Instagram, href: socials?.instagram },
    { Icon: Twitter,   href: socials?.twitter   },
    { Icon: Facebook,  href: socials?.facebook  },
  ];

  return (
    <footer
      id="contact"
      className="pt-24 pb-12"
      style={{ background: 'var(--surface)', borderTop: '1px solid rgba(200,169,110,0.1)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={data?.settings.logo || '/logo.png'}
                alt={data?.settings.siteName || 'Dream Routes Tourism'}
                className="h-10 w-auto object-contain"
                style={{ background: 'white', padding: '4px', borderRadius: '6px' }}
              />
            </div>
            <p className="text-lg max-w-sm leading-relaxed font-light mb-8" style={{ color: 'rgba(240,237,232,0.5)' }}>
              {data?.settings.description}
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    border: '1px solid rgba(200,169,110,0.2)',
                    color: 'rgba(240,237,232,0.55)',
                    background: 'rgba(200,169,110,0.05)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = '#C8A96E';
                    el.style.color = '#080E18';
                    el.style.borderColor = '#C8A96E';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'rgba(200,169,110,0.05)';
                    el.style.color = 'rgba(240,237,232,0.55)';
                    el.style.borderColor = 'rgba(200,169,110,0.2)';
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[10px] font-bold uppercase tracking-widest mb-8"
              style={{ color: '#C8A96E' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Destinations', href: '/#destinations' },
                { name: 'Packages',     href: '/#packages'     },
                { name: 'Services',     href: '/#services'     },
                { name: 'About Us',     href: '/#about'        },
                { name: 'Contact',      href: '/#contact'      },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-[11px] uppercase tracking-widest font-semibold transition-colors duration-200"
                    style={{ color: 'rgba(240,237,232,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C8A96E')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.45)')}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="text-[10px] font-bold uppercase tracking-widest mb-8"
              style={{ color: '#C8A96E' }}
            >
              Newsletter
            </h4>
            <p className="text-sm mb-6 font-light" style={{ color: 'rgba(240,237,232,0.45)' }}>
              Subscribe for secret travel deals.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full py-3.5 pl-5 pr-14 text-sm focus:outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,169,110,0.15)',
                  color: '#F0EDE8',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(200,169,110,0.45)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(200,169,110,0.15)')}
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ background: '#C8A96E', color: '#080E18' }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-10 flex flex-col md:flex-row justify-between items-center gap-5"
          style={{ borderTop: '1px solid rgba(240,237,232,0.07)' }}
        >
          <p className="text-[11px] tracking-widest uppercase" style={{ color: 'rgba(240,237,232,0.3)' }}>
            © 2024 Dream Route Tourism LLC. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a
                key={t}
                href="#"
                className="text-[11px] tracking-widest uppercase transition-colors duration-200"
                style={{ color: 'rgba(240,237,232,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8A96E')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.3)')}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
