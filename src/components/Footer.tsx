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
      id="footer"
      className="pt-20 pb-12 relative z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 18, 30, 0.96) 0%, rgba(6, 11, 19, 0.99) 100%)',
        borderTop: '1px solid rgba(200, 169, 110, 0.3)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={data?.settings.logo || '/logo.png'}
                alt={data?.settings.siteName || 'Dream Routes Tourism'}
                className="h-11 w-auto object-contain"
                style={{ background: 'white', padding: '5px', borderRadius: '8px' }}
              />
            </div>
            <p className="text-base max-w-sm leading-relaxed font-normal mb-8 text-[#E2E8F0]">
              {data?.settings.description}
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    border: '1px solid rgba(200, 169, 110, 0.45)',
                    color: '#E8D5A8',
                    background: 'rgba(200, 169, 110, 0.12)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = '#C8A96E';
                    el.style.color = '#080E18';
                    el.style.borderColor = '#C8A96E';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'rgba(200, 169, 110, 0.12)';
                    el.style.color = '#E8D5A8';
                    el.style.borderColor = 'rgba(200, 169, 110, 0.45)';
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-6 text-[#E8D5A8]"
              style={{ letterSpacing: '0.18em' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3.5">
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
                    className="text-xs uppercase tracking-widest font-medium transition-colors duration-200 inline-block text-[#CBD5E1] hover:text-[#E8D5A8]"
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
              className="text-xs font-bold uppercase tracking-widest mb-6 text-[#E8D5A8]"
              style={{ letterSpacing: '0.18em' }}
            >
              Newsletter
            </h4>
            <p className="text-sm mb-6 font-normal leading-relaxed text-[#E2E8F0]">
              Subscribe for secret travel deals and curated tour itineraries.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-full py-3.5 pl-5 pr-14 text-sm focus:outline-none transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(200, 169, 110, 0.35)',
                  color: '#FFFFFF',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#E8D5A8')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.35)')}
              />
              <button
                aria-label="Subscribe"
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
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-5"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <p className="text-xs tracking-widest uppercase font-normal text-[#94A3B8]">
            © {new Date().getFullYear()} Dream Route Tourism LLC. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a
                key={t}
                href="#"
                className="text-xs tracking-widest uppercase transition-colors duration-200 text-[#94A3B8] hover:text-[#E8D5A8]"
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
