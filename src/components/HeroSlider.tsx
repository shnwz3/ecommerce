"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Banner } from "@/lib/types";
import { LotusMedallion, CornerFiligree } from "./ui/RoyalMotifs";

interface HeroSliderProps {
  banners: Banner[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const heroBanners = banners.filter((b) => b.position === "hero");
  const slides =
    heroBanners.length > 0
      ? heroBanners
      : [
          {
            id: "hero-fallback-1",
            image_url:
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
            link_url: "/collections/lehengas",
            title: "The Imperial Bridal Edition",
            subtitle:
              "Opulent Velvet & Georgette Masterpieces with Heavy Zardozi, Cutdana & Antique Gold Weaves.",
            cta_text: "Explore Bridal Vault",
            position: "hero",
            sort_order: 1,
          },
          {
            id: "hero-fallback-2",
            image_url:
              "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1600&auto=format&fit=crop",
            link_url: "/collections/pattu-sarees",
            title: "Royal Heritage Weaves of India",
            subtitle:
              "Authentic Kanchipuram Pattu & Pure Banarasi Silk Direct from Master Looms at Honest Weaver Prices.",
            cta_text: "Shop Pattu Sarees",
            position: "hero",
            sort_order: 2,
          },
          {
            id: "hero-fallback-3",
            image_url:
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
            link_url: "/collections/designer-sarees",
            title: "Pure Elegance in Every Drape",
            subtitle:
              "Shimmer Organza & Hand-Cutwork Sarees Crafted for Weddings, Celebrations & Festive Grandeur.",
            cta_text: "Discover Festive Looks",
            position: "hero",
            sort_order: 3,
          },
        ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay with Hover Pause
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers for Mobile UX
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide(); // Swiped left -> next slide
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Swiped right -> prev slide
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#1E0D05] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-label="Featured Collections Carousel"
    >
      {/* Slider Viewport Container */}
      <div className="relative h-[540px] sm:h-[620px] md:h-[680px] lg:h-[750px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Responsive Focal Point Positioning */}
              <Image
                src={slide.image_url}
                alt={slide.title || "Shopin Sarees & Lehengas"}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover object-[center_15%] sm:object-[center_20%] md:object-[right_20%] lg:object-[right_25%] transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />

              {/* Regal Gradients Tailored for Text Legibility & Preserving Saree Luster */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0D05] via-[#1E0D05]/40 to-transparent sm:hidden" />
              <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#1E0D05]/95 via-[#1E0D05]/65 md:via-[#1E0D05]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0D05]/90 via-transparent to-transparent" />

              {/* Royal Decorative Arch Inset Border */}
              <div className="absolute inset-4 sm:inset-8 border border-[#DFB873]/30 pointer-events-none rounded-3xl z-10 hidden sm:block">
                <CornerFiligree position="top-left" className="w-10 h-10 text-[#DFB873]/70" />
                <CornerFiligree position="top-right" className="w-10 h-10 text-[#DFB873]/70" />
                <CornerFiligree position="bottom-left" className="w-10 h-10 text-[#DFB873]/70" />
                <CornerFiligree position="bottom-right" className="w-10 h-10 text-[#DFB873]/70" />
              </div>

              {/* Slide Hero Content */}
              <div className="absolute inset-0 flex items-center z-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                  <div className="max-w-xl md:max-w-2xl text-white space-y-4 sm:space-y-6">
                    {/* Traditional Kicker with Lotus Medallion */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A0E17]/85 backdrop-blur-md border border-[#DFB873]/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#DFB873] shadow-lg">
                      <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873]" />
                      <span>Royal Heritage Weaves • Since 1996</span>
                    </div>

                    {/* Majestic Headline */}
                    <h1 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-base md:text-lg text-[#FCF3ED]/90 font-light leading-relaxed max-w-lg">
                      {slide.subtitle}
                    </p>

                    {/* Royal CTAs */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-5">
                      <Link
                        href={slide.link_url || "/collections/all"}
                        className="royal-btn-gold inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xl hover:scale-105 border border-white/30"
                      >
                        <span>{slide.cta_text || "Shop Collection"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/collections/offer-zone"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#4A0E17]/60 hover:bg-[#4A0E17]/90 text-[#DFB873] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md transition-all border border-[#DFB873]/40 shadow-lg"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#DFB873]" />
                        <span>Festive Offer Zone</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Royal Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-[#241206]/75 hover:bg-[#7B3D14] backdrop-blur-md text-[#DFB873] flex items-center justify-center transition-all hover:scale-110 border border-[#DFB873]/40 shadow-xl focus:outline-none"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-[#241206]/75 hover:bg-[#7B3D14] backdrop-blur-md text-[#DFB873] flex items-center justify-center transition-all hover:scale-110 border border-[#DFB873]/40 shadow-xl focus:outline-none"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Royal Pagination Indicators with Progress Fill */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30 flex justify-center items-center gap-2.5">
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-500 rounded-full overflow-hidden ${
                isActive
                  ? "w-10 sm:w-12 h-2 sm:h-2.5 bg-[#DFB873] shadow-md shadow-[#DFB873]/50"
                  : "w-2.5 sm:w-3 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};
