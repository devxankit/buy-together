import React, { useState, useEffect } from 'react';
import { Button } from '../../../components';

/**
 * Auto-sliding compact Promo Banner carousel for the userMain homepage.
 * Slides automatically every 3 seconds inside the exact mockup color theme.
 */
const PromoBanner = ({ onExplore }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badge: 'Smarter Together',
      titleLine1: 'Buy more.',
      titleLine2: 'Save more.',
      titleHighlight: 'Save more.',
      description: 'Join with other buyers, unlock bulk discounts and save big!',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
      activeBuyers: '2.4K+'
    },
    {
      badge: 'Mega Pools Live',
      titleLine1: 'Share deals.',
      titleLine2: 'Slash prices.',
      titleHighlight: 'Slash prices.',
      description: 'Send group invites to neighbors and secure up to 40% OFF!',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
      activeBuyers: '1.8K+'
    },
    {
      badge: 'Direct Farm Drops',
      titleLine1: 'Pure quality.',
      titleLine2: 'Zero middleman.',
      titleHighlight: 'Zero middleman.',
      description: 'Fresh vegetables and fruits shipped directly from verified sources.',
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80',
      activeBuyers: '3.1K+'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex flex-col gap-2">
      {/* Outer Banner Wrapper with compact height (h-[155px]) */}
      <div className="relative bg-gradient-to-br from-[#E6F6F3] to-[#C9ECE5] rounded-[24px] p-4 pt-4.5 overflow-hidden flex flex-col items-start h-[155px] transition-all duration-500">
        
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          
          return (
            <div
              key={index}
              className={`absolute inset-0 p-4 pt-4.5 flex flex-col items-start justify-between transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {/* Badge capsule */}
              <div className="bg-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-line/10 active:scale-95 transition-all cursor-pointer">
                <svg className="w-2.5 h-2.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-[7.5px] font-black text-ink tracking-wider uppercase">{slide.badge}</span>
              </div>

              {/* Title & Description stack */}
              <div className="flex flex-col mt-1.5">
                <h2 className="text-[17px] font-black tracking-tight leading-[1.1] text-ink">
                  {slide.titleLine1}<br />
                  <span className="text-primary">{slide.titleHighlight}</span>
                </h2>
                <p className="text-[9px] font-semibold text-muted max-w-[190px] leading-snug mt-1">
                  {slide.description}
                </p>
              </div>

              {/* Explorer CTA button */}
              <Button
                variant="primary"
                size="sm"
                onClick={onExplore}
                className="h-[28px] px-3 rounded-[10px] text-[10px] font-bold gap-1 mt-auto"
              >
                Explore Groups
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>

              {/* Graphics collage stack on the right */}
              <div className="absolute right-0 top-0 bottom-0 w-[140px] flex items-center justify-end pointer-events-none select-none">
                <div className="absolute right-2 w-[100px] h-[100px] bg-primary/5 rounded-full border border-primary/10" />

                <div className="relative w-full h-full">
                  {/* Phone Image Mockup */}
                  <img
                    src={slide.image}
                    alt="Mockup mockup"
                    className="absolute right-2 top-6 w-16 h-16 object-contain rounded-xl shadow-lg border border-white/40"
                  />
                  
                  {/* Avatars */}
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80"
                    alt="User 1"
                    className="absolute left-6 top-12 w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80"
                    alt="User 2"
                    className="absolute right-10 top-2.5 w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                  />

                  {/* Stat Card */}
                  <div className="absolute bottom-2.5 right-4 bg-white rounded-lg p-1 px-2 shadow-md border border-line/10 flex flex-col items-center">
                    <span className="text-[10px] font-black text-primary leading-none">{slide.activeBuyers}</span>
                    <span className="text-[6.5px] font-black text-muted leading-none mt-0.5 uppercase tracking-wide">Active Buyers</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Under-banner dots indicators */}
      <div className="flex justify-center items-center gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`transition-all duration-300 ${idx === activeSlide ? 'w-4 h-1 bg-primary rounded-full' : 'w-1 h-1 bg-line rounded-full'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
