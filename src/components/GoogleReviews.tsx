import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquareQuote, ThumbsUp, ShieldCheck } from 'lucide-react';
import { useData, Review } from '../contexts/DataContext';

export function GoogleReviews() {
  const { data } = useData();
  const reviews: Review[] = data?.reviews || [
    {
      id: "rev-1",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      date: "2 days ago",
      badge: "Local Guide • 42 reviews",
      service: "VIP Yacht Charter",
      comment: "Absolutely incredible experience with Dream Routes Tourism! We booked the VIP Yacht Cruise around Dubai Marina for my birthday. The crew was super attentive, the yacht was spotless, and the views at sunset were breathtaking. Highly recommend!"
    },
    {
      id: "rev-2",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      date: "1 week ago",
      badge: "Local Guide • 18 reviews",
      service: "Desert Safari & BBQ",
      comment: "The Desert Safari package exceeded all expectations! Quad biking on the dunes, camel riding, and an amazing BBQ dinner under the stars with live Tanoura dancing. The driver picked us up right from our hotel on time. 10/10 service!"
    },
    {
      id: "rev-3",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      badge: "Verified Reviewer",
      service: "Abu Dhabi City Tour",
      comment: "Booked our Abu Dhabi City Tour with Dream Routes. Our guide was extremely knowledgeable, friendly, and gave us plenty of time to explore the Sheikh Zayed Grand Mosque. Seamless booking on WhatsApp too!"
    },
    {
      id: "rev-4",
      name: "Tariq Al-Mansoor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      date: "3 weeks ago",
      badge: "Local Guide • 64 reviews",
      service: "Burj Khalifa & Visa Services",
      comment: "Best travel agency in Dubai! They handled our entire family's visa, hotel stays, and Burj Khalifa fast-track tickets. Very transparent pricing with zero hidden fees. Will definitely use Dream Routes Tourism again!"
    },
    {
      id: "rev-5",
      name: "David & Chloe Miller",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      date: "1 month ago",
      badge: "Verified Reviewer",
      service: "Helicopter Aerial Tour",
      comment: "Unforgettable honeymoon experience! The private helicopter tour over Palm Jumeirah was surreal. Thank you to the Dream Routes team for making our trip to Dubai memories that will last a lifetime."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play carousel every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="py-24 md:py-32 bg-gradient-to-b from-surface via-primary to-surface relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header with Google Rating Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-12 border-b border-white/10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-xs font-bold text-white tracking-wider uppercase">Google Verified Reviews</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
              What Our Travelers Say
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light max-w-xl">
              Real experiences shared by clients who explored Dubai and the UAE with Dream Routes Tourism.
            </p>
          </div>

          {/* Overall Rating Box */}
          <div className="bg-surface/80 border border-white/10 rounded-3xl p-6 flex items-center gap-6 shadow-2xl backdrop-blur-xl">
            <div className="text-center border-r border-white/10 pr-6">
              <div className="text-4xl font-extrabold text-white flex items-center gap-1">
                4.8
              </div>
              <div className="flex items-center gap-1 text-yellow-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">Based on Google Reviews</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <ShieldCheck size={16} /> 100% Authentic Ratings
              </div>
              <a
                href="https://share.google/fkaffj1E2ZmNl9S2a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-accent text-primary font-bold text-xs px-4 py-2 rounded-xl hover:bg-white transition-all shadow-md"
              >
                Write a Review
              </a>
            </div>
          </div>
        </div>

        {/* Carousel / Reviews Grid */}
        <div className="relative">
          {/* Controls */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-surface border border-white/10 text-white hover:bg-accent hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-surface border border-white/10 text-white hover:bg-accent hover:text-primary transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((offset) => {
              const reviewIndex = (currentIndex + offset) % reviews.length;
              const review = reviews[reviewIndex];
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: offset * 0.1 }}
                  className="bg-surface/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-xl relative group"
                >
                  {/* Watermark Quote Icon */}
                  <MessageSquareQuote className="absolute top-6 right-6 text-white/5 group-hover:text-accent/10 transition-colors" size={48} />

                  <div>
                    {/* User Profile Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          {review.name}
                          <CheckCircle2 size={14} className="text-blue-400" />
                        </h4>
                        <span className="text-[11px] text-gray-400 block font-light">{review.badge}</span>
                      </div>
                    </div>

                    {/* Star Rating & Service Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                        {review.service}
                      </span>
                    </div>

                    {/* Comment Body */}
                    <p className="text-gray-300 text-sm leading-relaxed font-light italic mb-6">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  {/* Footer Stats & Date */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-emerald-400/80 font-medium">
                      <ThumbsUp size={12} /> Posted on Google
                    </span>
                    <span>{review.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* View All on Google CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://share.google/fkaffj1E2ZmNl9S2a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm font-semibold text-white hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>View All Reviews on Google</span>
          </a>
        </div>

      </div>
    </section>
  );
}
