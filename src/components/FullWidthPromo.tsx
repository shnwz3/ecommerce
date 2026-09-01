"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Banner } from "@/lib/types";
import { CornerFiligree, LotusMedallion } from "./ui/RoyalMotifs";

interface FullWidthPromoProps {
  banners: Banner[];
}

export const FullWidthPromo: React.FC<FullWidthPromoProps> = ({ banners }) => {
  const promo = banners.find((b) => b.position === "full-promo") || {
    id: "full-fallback",
    image_url:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1600&auto=format&fit=crop",
    link_url: "/collections/designer-sarees",
    title: "Pure Elegance in Every Drape",
    subtitle: "Honest Loom Pricing Since 1996 • Handcrafted Direct from Master Artisans",
    cta_text: "Discover Vault",
    position: "full-promo",
    sort_order: 1,
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[480px] border-2 border-[#C59A4E]/40 flex items-center bg-[#1E0D05]">
          {/* Background Image Anchored to the Right */}
          <Image
            src={promo.image_url}
            alt={promo.title || "Feature Banner"}
            fill
            sizes="100vw"
            className="object-cover object-[90%_20%] sm:object-[85%_20%] scale-100 transition-transform duration-1000"
          />

          {/* Directional Luxury Shadow Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E0D05] via-[#1E0D05]/50 to-transparent sm:hidden" />
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#1E0D05]/95 via-[#1E0D05]/75 to-transparent/10 w-[65%]" />

          {/* Ornate Inset Filigree Border */}
          <div className="absolute inset-3 sm:inset-5 border border-[#DFB873]/30 pointer-events-none rounded-2xl z-10 hidden sm:block">
            <CornerFiligree position="top-left" className="w-8 h-8 text-[#DFB873]/70" />
            <CornerFiligree position="top-right" className="w-8 h-8 text-[#DFB873]/70" />
            <CornerFiligree position="bottom-left" className="w-8 h-8 text-[#DFB873]/70" />
            <CornerFiligree position="bottom-right" className="w-8 h-8 text-[#DFB873]/70" />
          </div>

          {/* Left Text Plaque */}
          <div className="relative z-20 max-w-sm sm:max-w-md px-6 sm:px-12 text-white space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A0E17]/90 backdrop-blur-md border border-[#DFB873]/50 text-[#DFB873] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-md">
              <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873]" />
              <span>Artisan Loom Spotlight</span>
            </div>

            <h2 className="font-serif-heading text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-white">
              {promo.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#FCF3ED]/85 font-light leading-relaxed">
              {promo.subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={promo.link_url || "/collections/all"}
                className="royal-btn-gold inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-105 border border-white/20"
              >
                <span>{promo.cta_text || "Discover Vault"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
