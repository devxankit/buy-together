import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanners } from '../../../../../services/banner.api';
import { swr } from '../../../../../services/swr';
import { cldImg } from '../../../../../utils/imageUrl';

const DEFAULT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
    link: '/groups'
  },
  {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=800&q=80',
    link: '/categories'
  }
];

/**
 * Dynamic Promo Banner carousel displaying only the banner image.
 * Fetches banners from database on mount, falling back to mock banner slides.
 * Clicking a slide redirects to its attached link (internal or external).
 */
const PromoBanner = ({ onExplore }) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let active = true;
    // Stale-while-revalidate: show cached banners instantly, refresh silently.
    // Keep the default slides if the API returns nothing.
    swr(
      'banners',
      async () => {
        const { data } = await getBanners();
        return Array.isArray(data) ? data : [];
      },
      { onData: (data) => { if (active && data.length > 0) setSlides(data); } }
    ).catch((err) => console.warn('Failed to load active promo banners, using fallbacks:', err));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds transition for better readability
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex flex-col gap-2">
      {/* Outer Banner Wrapper with compact height */}
      <div className="relative rounded-[24px] overflow-hidden flex flex-col items-start h-[142px] transition-all duration-500 bg-[#E6F6F3] border border-line/10 shadow-sm">
        
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          
          return (
            <div
              key={index}
              onClick={() => {
                if (slide.link) {
                  if (slide.link.startsWith('http://') || slide.link.startsWith('https://')) {
                    window.open(slide.link, '_blank', 'noopener,noreferrer');
                  } else {
                    navigate(slide.link);
                  }
                } else if (onExplore) {
                  onExplore();
                }
              }}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              } cursor-pointer`}
            >
              {/* Full-width Banner Image. The first slide is the home-page LCP,
                  so load it eagerly with high priority; the rest can lazy-load. */}
              <img
                src={cldImg(slide.image, { w: 800 })}
                alt="Promo Banner"
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      {/* Under-banner dots indicators */}
      {slides.length > 1 && (
        <div className="flex justify-center items-center gap-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 ${
                idx === activeSlide ? 'w-4 h-1 bg-primary rounded-full' : 'w-1 h-1 bg-line rounded-full'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoBanner;
