import { motion } from 'motion/react';
import { Phone, MapPin, Linkedin, Instagram, Navigation, MessageCircle, Music2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function VCardPage() {
  const mapLink = "https://www.google.com/maps/place/Dream+Routes+Tourism+LLC/@25.2696307,55.3007339,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f436b8502a453:0xc7e60c3c375eb2a3!8m2!3d25.2696307!4d55.3033088!16s%2Fg%2F11mrc3hcxw?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D";

  const stagger = {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
    },
    item: {
      hidden: { opacity: 0, y: 18 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    },
  };

  return (
    <div className="vcard-root">
      {/* Live canvas wallpaper */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="vcard-card"
        style={{ position: 'relative', zIndex: 10 }}
      >
        {/* Decorative top rule */}
        <div className="vcard-rule" />

        {/* ── LOGO ── */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 220, damping: 18 }}
          className="vcard-logo-wrap"
        >
          <img src="/logo.png" alt="Dream Routes Tourism" className="vcard-logo-img" />
        </motion.div>

        {/* ── BRAND ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="vcard-brand"
        >
          <h1 className="vcard-brand-name">Dream Routes Tourism</h1>
          <p className="vcard-brand-tagline">Luxury Travel &amp; Tours · Dubai UAE</p>
        </motion.div>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="vcard-divider"
        />

        {/* ── PRIMARY ACTIONS ── */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="vcard-actions"
        >
          <motion.a
            variants={stagger.item}
            href="https://wa.me/971565152143"
            target="_blank"
            rel="noopener noreferrer"
            className="vcard-btn vcard-btn-wa"
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </motion.a>
          <motion.a
            variants={stagger.item}
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="vcard-btn vcard-btn-nav"
          >
            <Navigation size={20} />
            <span>Navigate</span>
          </motion.a>
        </motion.div>

        {/* ── CONTACT ROWS ── */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="vcard-contacts"
        >
          {[
            { label: 'Call Booking', value: '+971 56 515 2143', href: 'tel:+971565152143', Icon: Phone },
            { label: 'Support Line', value: '+971 56 515 2148', href: 'tel:+971565152148', Icon: Phone },
            { label: 'Dubai Office', value: '905, Abraj Centre, Naif Deira, Dubai UAE', href: mapLink, blank: true, Icon: MapPin },
          ].map(({ label, value, href, blank, Icon }) => (
            <motion.a
              key={label}
              variants={stagger.item}
              href={href}
              {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="vcard-contact-row"
            >
              <div className="vcard-contact-icon">
                <Icon size={17} />
              </div>
              <div className="vcard-contact-text">
                <span className="vcard-contact-label">{label}</span>
                <span className="vcard-contact-value">{value}</span>
              </div>
              <ArrowUpRight size={15} className="vcard-contact-arrow" />
            </motion.a>
          ))}
        </motion.div>

        {/* ── SOCIAL ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="vcard-social-section"
        >
          <p className="vcard-social-label">Connect</p>
          <div className="vcard-socials">
            <a
              href="https://www.instagram.com/dreamroutestourism/"
              target="_blank"
              rel="noopener noreferrer"
              className="vcard-social-btn"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://ae.linkedin.com/company/dream-routes-tourism-llc"
              target="_blank"
              rel="noopener noreferrer"
              className="vcard-social-btn"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@dreamroutestourism"
              target="_blank"
              rel="noopener noreferrer"
              className="vcard-social-btn"
              aria-label="TikTok"
            >
              <Music2 size={20} />
            </a>
          </div>
        </motion.div>

        {/* ── RETURN LINK ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="vcard-return"
        >
          <Link to="/" className="vcard-return-link">
            Return to Website ↗
          </Link>
        </motion.div>

        {/* Decorative bottom rule */}
        <div className="vcard-rule vcard-rule-bottom" />
      </motion.div>
    </div>
  );
}
