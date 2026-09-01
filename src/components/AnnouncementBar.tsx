"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const announcements = [
  "✨ Sarees & Lehengas from ₹300 – Honest Prices Since 1996",
  "🚚 Pan-India Free Express Shipping on Orders Above ₹999",
  "🔄 Easy 7-Day Returns & Instant Refunds Available",
  "💎 Handpicked Authentic Weaves • Direct From Master Artisans",
];

export const AnnouncementBar: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % announcements.length);
  const prev = () => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="bg-[#341B09] text-[#FCF3ED] text-xs md:text-sm font-medium tracking-wide py-2 px-4 relative flex items-center justify-between border-b border-[#7B3D14]/20 transition-all duration-300">
      <button
        onClick={prev}
        aria-label="Previous announcement"
        className="hidden md:flex p-1 hover:text-[#C59A4E] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="w-full text-center truncate px-2">
        <span className="inline-block transition-opacity duration-500">
          {announcements[current]}
        </span>
      </div>

      <button
        onClick={next}
        aria-label="Next announcement"
        className="hidden md:flex p-1 hover:text-[#C59A4E] transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
