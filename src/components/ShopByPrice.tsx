"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { LotusMedallion, CornerFiligree } from "./ui/RoyalMotifs";

interface PriceRange {
  title: string;
  price: string;
  tagline: string;
  gradient: string;
  borderAccent: string;
  href: string;
}

const priceRanges: PriceRange[] = [
  {
    title: "Daily Grace",
    price: "UNDER ₹499",
    tagline: "Everyday Handloom & Lightweight Sarees",
    gradient: "from-[#5B2A0A] via-[#7B3D14] to-[#4A0E17]",
    borderAccent: "border-[#DFB873]/30",
    href: "/collections/all?maxPrice=499",
  },
  {
    title: "Festive Splendor",
    price: "UNDER ₹999",
    tagline: "Trending Fancy Silks & Work Sarees",
    gradient: "from-[#7B1113] via-[#8E2800] to-[#58111A]",
    borderAccent: "border-[#DFB873]/40",
    href: "/collections/all?maxPrice=999",
  },
  {
    title: "Grand Occasions",
    price: "UNDER ₹1,499",
    tagline: "Organza Cutwork & Designer Sarees",
    gradient: "from-[#341B09] via-[#4A0E17] to-[#200408]",
    borderAccent: "border-[#DFB873]/40",
    href: "/collections/all?maxPrice=1499",
  },
  {
    title: "Royal Couture",
    price: "UNDER ₹2,499",
    tagline: "Pure Kanchi Pattu & Bridal Vault",
    gradient: "from-[#2A1002] via-[#5E2C0C] to-[#34070D]",
    borderAccent: "border-[#DFB873]/50",
    href: "/collections/all?maxPrice=2499",
  },
];

export const ShopByPrice: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF5EE] border-b border-[#7B3D14]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pill-Badge Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7B3D14]/10 border border-[#7B3D14]/20 text-[#7B3D14] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Tag className="w-3.5 h-3.5 text-[#DFB873]" />
            <span>Budget-Friendly Luxury</span>
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#341B09] tracking-tight">
            Shop By Price & Budget
          </h2>
          <p className="text-xs sm:text-sm text-[#341B09]/70 mt-2 font-light">
            Direct from master weavers — uncompromised royal elegance for every celebration.
          </p>
        </div>

        {/* 4 Price Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {priceRanges.map((range, idx) => (
            <Link
              key={idx}
              href={range.href}
              className={`group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${range.gradient} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden border ${range.borderAccent} flex flex-col justify-between min-h-[190px]`}
            >
              {/* Corner Filigree Ornaments */}
              <CornerFiligree position="top-right" className="w-6 h-6 text-[#DFB873]/40" />

              {/* Ambient Glow */}
              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-[#DFB873]/15 blur-xl group-hover:scale-150 transition-transform duration-700" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#DFB873]">
                    <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {range.title}
                    </span>
                  </div>
                  <Tag className="w-4 h-4 text-[#DFB873]/60 group-hover:text-[#DFB873] transition-colors" />
                </div>

                <h3 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#DFB873] mt-2.5 tracking-tight">
                  {range.price}
                </h3>
                <p className="text-xs text-[#FCF3ED]/80 mt-1 leading-relaxed">{range.tagline}</p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#FCF3ED] border-t border-white/15 mt-3">
                <span className="group-hover:text-[#DFB873] transition-colors">Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 text-[#DFB873] transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
