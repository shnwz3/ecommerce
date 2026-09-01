"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

interface PriceRange {
  title: string;
  price: string;
  tagline: string;
  gradient: string;
  href: string;
}

const priceRanges: PriceRange[] = [
  {
    title: "Pocket Friendly",
    price: "UNDER ₹499",
    tagline: "Everyday Daily Wear Sarees",
    gradient: "from-[#7B3D14] to-[#A0522D]",
    href: "/collections/all?maxPrice=499",
  },
  {
    title: "Festive Value",
    price: "UNDER ₹999",
    tagline: "Trending Fancy & Work Sarees",
    gradient: "from-[#9C381E] to-[#7B3D14]",
    href: "/collections/all?maxPrice=999",
  },
  {
    title: "Occasion Special",
    price: "UNDER ₹1,499",
    tagline: "Organza & Designer Sarees",
    gradient: "from-[#341B09] to-[#602711]",
    href: "/collections/all?maxPrice=1499",
  },
  {
    title: "Royal Boutique",
    price: "UNDER ₹2,499",
    tagline: "Silk Pattu & Bridal Lehengas",
    gradient: "from-[#5B2A0A] to-[#8B4513]",
    href: "/collections/all?maxPrice=2499",
  },
];

export const ShopByPrice: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8EFEA] border-y border-[#7B3D14]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
            Budget Friendly Curation
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1.5">
            Shop By Price
          </h2>
          <p className="text-xs sm:text-sm text-[#341B09]/70 mt-2">
            Unbeatable prices direct from weavers — luxury for every budget.
          </p>
          <div className="w-12 h-0.5 bg-[#7B3D14] mx-auto mt-3 rounded-full opacity-60" />
        </div>

        {/* 4 Price Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {priceRanges.map((range, idx) => (
            <Link
              key={idx}
              href={range.href}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${range.gradient} text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/15 flex flex-col justify-between min-h-[170px]`}
            >
              {/* Subtle Decorative Circle */}
              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59A4E]">
                    {range.title}
                  </span>
                  <Tag className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>

                <h3 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
                  {range.price}
                </h3>
                <p className="text-xs text-white/80 mt-1">{range.tagline}</p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#FCF3ED] border-t border-white/15 mt-3">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
