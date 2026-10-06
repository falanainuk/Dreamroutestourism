import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export function Contact() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("");
    
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "ac92ac9a-c19a-4d16-beca-48430c2864ba");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Request sent successfully!");
      event.currentTarget.reset();
    } else {
      console.log("Error", data);
      setResult(data.message || "An error occurred");
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-primary relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Contact Info */}
          <div className="flex-1">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4"
            >
              Contact Us
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
            >
              Get In Touch <br />
              <span className="font-serif italic text-accent">With Us</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text/60 font-light leading-relaxed mb-12 max-w-md"
            >
              Whether you need to plan a luxury getaway, manage corporate travel, or secure a visa, our team is here to help make your dream route a reality.
            </motion.p>

            <div className="space-y-8">
              {[
                {
                  icon: <MapPin className="w-6 h-6 text-accent" />,
                  title: "Our Location",
                  content: "905, Abraj Centre, Naif Deira, Dubai UAE",
                  link: "https://www.google.com/maps/place/Dream+Routes+Tourism+LLC/@25.2696307,55.3007339,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f436b8502a453:0xc7e60c3c375eb2a3!8m2!3d25.2696307!4d55.3033088!16s%2Fg%2F11mrc3hcxw?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D"
                },
                {
                  icon: <Phone className="w-6 h-6 text-accent" />,
                  title: "Phone Number",
                  content: "+971 04 220 7472",
                  link: "tel:+971042207472"
                },
                {
                  icon: <Mail className="w-6 h-6 text-accent" />,
                  title: "Email Address",
                  content: "info@dreamroutestourism.com",
                  link: "mailto:info@dreamroutestourism.com"
                }
              ].map((item, i) => {
                const innerContent = (
                  <>
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-surface/80 border border-text/10 flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors duration-300">{item.title}</h4>
                      <p className="text-text/60 font-light">{item.content}</p>
                    </div>
                  </>
                );

                return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="group"
                >
                  {item.link ? (
                    <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-start gap-6 w-full cursor-pointer">
                      {innerContent}
                    </a>
                  ) : (
                    <div className="flex items-start gap-6 w-full">
                      {innerContent}
                    </div>
                  )}
                </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-text/10 p-8 md:p-12 rounded-3xl shadow-2xl relative">
              {/* Decorative accent element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-[20px]" />
              
              <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-6">
                <input type="hidden" name="subject" value="New Inquiry from Dream Routes Tourism Website" />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-4 py-4 text-text placeholder:text-text/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Your Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-4 py-4 text-text placeholder:text-text/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Your Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="+971 XX XXX XXXX"
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-4 py-4 text-text placeholder:text-text/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text/60 mb-2">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    placeholder="How can we help you plan your journey?"
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-4 py-4 text-text placeholder:text-text/40 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-primary font-bold uppercase tracking-widest py-4 rounded-xl mt-2 flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  {!isSubmitting && <Send size={18} />}
                </button>
                {result && (
                  <p className={`text-center font-medium mt-2 ${result.includes("Error") || result.includes("error") ? "text-red-400" : "text-green-400"}`}>
                    {result}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
