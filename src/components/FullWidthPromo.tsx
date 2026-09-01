"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { Banner } from "@/lib/types";

interface FullWidthPromoProps {
  banners: Banner[];
}

export const FullWidthPromo: React.FC<FullWidthPromoProps> = ({ banners }) => {
  const promo = banners.find((b) => b.position === "full-promo") || {
    id: "full-fallback",
    image_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600&auto=format&fit=crop",
    link_url: "/collections/designer-sarees",
    title: "Pure Elegance in Every Drape",
    subtitle: "Honest Prices Since 1996 • Direct from Artisans",
    cta_text: "Discover Collection",
    position: "full-promo",
    sort_order: 1,
  };

  return (
    <section className="py-8 sm:py-12 bg-[#FCF3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[340px] sm:h-[420px] border border-[#7B3D14]/20 flex items-center">
          {/* Background Image */}
          <Image
            src={promo.image_url}
            alt={promo.title || "Feature Banner"}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

          {/* Content */}
          <div className="relative z-10 max-w-lg px-8 sm:px-12 text-white space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59A4E]/90 text-[#341B09] text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Artisan Heritage Spotlight</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {promo.title}
            </h2>

            <p className="text-xs sm:text-sm text-white/85 max-w-sm">
              {promo.subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={promo.link_url || "/collections/all"}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
              >
                <span>{promo.cta_text || "Discover Collection"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
