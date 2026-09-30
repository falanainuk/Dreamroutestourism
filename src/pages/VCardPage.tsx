import { motion } from 'motion/react';
import { Phone, MapPin, Linkedin, Instagram, Navigation, MessageCircle, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VCardPage() {
  const mapLink = "https://www.google.com/maps/place/Dream+Routes+Tourism+LLC/@25.2696307,55.3007339,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f436b8502a453:0xc7e60c3c375eb2a3!8m2!3d25.2696307!4d55.3033088!16s%2Fg%2F11mrc3hcxw?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Vibrant Creative Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      >
        {/* Header / Logo */}
        <div className="text-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-36 h-36 mx-auto bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 rounded-full p-1 mb-6 shadow-2xl shadow-orange-500/40"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner">
              <img src="/logo.png" alt="Dream Routes Tourism" className="w-28 h-28 object-contain" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg">
            Dream Routes Tourism
          </h1>
          <p className="text-amber-400 text-base md:text-lg font-black uppercase tracking-[0.3em] drop-shadow-md">
            Luxury Travel & Tours
          </p>
        </div>

        <div className="space-y-6">
          {/* Primary Action Buttons */}
          <div className="flex gap-4 justify-center">
            <a 
              href="https://wa.me/971565152143" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10"
            >
              <MessageCircle size={28} className="drop-shadow-sm" />
              <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
            </a>
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/10"
            >
              <Navigation size={28} className="drop-shadow-sm" />
              <span className="text-xs font-bold uppercase tracking-wider">Navigate</span>
            </a>
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-3">
            <a href="tel:+971565152143" className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-1">Call Booking</p>
                <p className="text-xl font-bold text-white tracking-wide">+971 56 515 2143</p>
              </div>
            </a>

            <a href="tel:+971565152148" className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-1">Support Line</p>
                <p className="text-xl font-bold text-white tracking-wide">+971 56 515 2148</p>
              </div>
            </a>

            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-lg shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-1">Dubai Office</p>
                <p className="font-semibold text-white leading-tight">905, Abraj Centre, Naif Deira, Dubai UAE</p>
              </div>
            </a>
          </div>

          {/* Social Links */}
          <div className="pt-6">
            <p className="text-center text-sm text-white/60 font-bold uppercase tracking-[0.25em] mb-5">Connect With Us</p>
            <div className="flex justify-center gap-5">
              <a href="https://www.instagram.com/dreamroutestourism/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-2 transition-all duration-300">
                <Instagram size={28} />
              </a>
              <a href="https://ae.linkedin.com/company/dream-routes-tourism-llc" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-2 transition-all duration-300">
                <Linkedin size={28} />
              </a>
              <a href="https://www.tiktok.com/@dreamroutestourism" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f2fe] via-black to-[#fe0979] flex items-center justify-center text-white hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-2 transition-all duration-300">
                <Music2 size={28} />
              </a>
            </div>
          </div>
          
          <div className="pt-6 text-center">
            <Link to="/" className="inline-block px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors duration-300">
              Return to Website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
