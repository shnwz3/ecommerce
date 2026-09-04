"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const announcements = [
  "Master Loom Heritage Since 1996 • Authentic Kanchipuram & Banarasi Weaves",
  "Complimentary Insured Doorstep Delivery Across India on Orders Above ₹999",
  "Direct Artisan Loom Pricing • Handcrafted Heirloom Textiles",
  "Personalized Video Styling & Bridal Concierge via WhatsApp",
];

export const AnnouncementBar: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  const next = () => setCurrent((prev) => (prev + 1) % announcements.length);
  const prev = () => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="bg-[#241206] text-[#FCF3ED] text-xs sm:text-sm font-medium tracking-wide py-2 px-3 sm:px-6 relative flex items-center justify-between border-b border-[#C59A4E]/30 select-none animate-fade-in z-50">
      {/* Left Navigation Arrow */}
      <button
        onClick={prev}
        aria-label="Previous announcement"
        className="hidden md:flex p-1 text-[#DFB873]/70 hover:text-[#DFB873] transition-colors focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Rotating Announcement Message */}
      <div className="w-full text-center truncate px-2 sm:px-8">
        <span className="inline-block transition-opacity duration-500 font-serif-heading sm:font-sans tracking-wide">
          {announcements[current]}
        </span>
      </div>

      {/* Right Controls: Next Arrow + Dismiss Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={next}
          aria-label="Next announcement"
          className="hidden md:flex p-1 text-[#DFB873]/70 hover:text-[#DFB873] transition-colors focus:outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement bar"
          className="p-1 rounded-full text-[#DFB873]/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none ml-1"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
