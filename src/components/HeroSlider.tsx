"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface HeroSliderProps {
  banners: Banner[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroBanners = banners.filter((b) => b.position === "hero");
  const slides = heroBanners.length > 0 ? heroBanners : [
    {
      id: "hero-fallback-1",
      image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
      link_url: "/collections/pattu-sarees",
      title: "Heritage Weaves of India",
      subtitle: "Handcrafted Sarees & Lehengas from ₹300",
      cta_text: "Explore Sarees",
      position: "hero",
      sort_order: 1,
    },
    {
      id: "hero-fallback-2",
      image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
      link_url: "/collections/lehengas",
      title: "The Royal Bridal Edition",
      subtitle: "Exquisite Velvet & Georgette Masterpieces",
      cta_text: "Shop Lehengas",
      position: "hero",
      sort_order: 2,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden bg-[#341B09]">
      {/* Slider Container */}
      <div className="relative h-[480px] sm:h-[560px] md:h-[640px] lg:h-[700px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image_url}
              alt={slide.title || "Shopin Sarees & Lehengas"}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover object-center scale-105 transition-transform duration-10000"
            />

            {/* Gradient Overlays for High Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="max-w-xl text-white space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B3D14]/80 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#FCF3ED]">
                    <span>✨</span>
                    <span>Direct From Master Weavers</span>
                  </div>

                  <h1 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                    {slide.title || "Heritage Weaves of India"}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-white/85 font-light leading-relaxed max-w-md">
                    {slide.subtitle || "Sarees & Lehengas from ₹300 – Honest Prices Since 1996"}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                      href={slide.link_url || "/collections/all"}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20"
                    >
                      <span>{slide.cta_text || "Shop Collection"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/collections/offer-zone"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white rounded-full text-xs sm:text-sm font-medium tracking-wider backdrop-blur-md transition-all border border-white/30"
                    >
                      Offer Zone
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 border border-white/30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 border border-white/30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Bullets */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[#C59A4E]" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
