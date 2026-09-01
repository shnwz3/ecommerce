"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Banner } from "@/lib/types";
import { CornerFiligree, LotusMedallion } from "./ui/RoyalMotifs";

interface TwoUpPromoProps {
  banners: Banner[];
}

export const TwoUpPromo: React.FC<TwoUpPromoProps> = ({ banners }) => {
  const promo1 = banners.find((b) => b.position === "promo-1") || {
    id: "promo-fallback-1",
    image_url:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop",
    link_url: "/collections/fancy-sarees",
    title: "Festive Grandeur Offer Zone",
    subtitle: "Up to 70% Off on Trending Silk & Shimmer Party Drapes",
    cta_text: "Claim Festive Offers",
    position: "promo-1",
    sort_order: 1,
  };

  const promo2 = banners.find((b) => b.position === "promo-2") || {
    id: "promo-fallback-2",
    image_url:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
    link_url: "/collections/lehengas",
    title: "Royal Heritage Bridal Edit",
    subtitle: "Hand-Embroidered Velvet & Georgette Lehengas from ₹3,999",
    cta_text: "Explore Bridal Vault",
    position: "promo-2",
    sort_order: 2,
  };

  const cards = [promo1, promo2];

  return (
    <section className="py-8 sm:py-12 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {cards.map((promo, idx) => (
            <Link
              key={promo.id || idx}
              href={promo.link_url || "/collections/all"}
              className="group relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-[#C59A4E]/40 flex flex-col justify-end p-6 sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#DFB873]"
            >
              {/* Background Image */}
              <Image
                src={promo.image_url}
                alt={promo.title || "Promo Banner"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-1000"
              />

              {/* Royal Darkening Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

              {/* Ornate Inset Filigree Border */}
              <div className="absolute inset-3 sm:inset-4 border border-[#DFB873]/30 pointer-events-none rounded-2xl z-10 hidden sm:block">
                <CornerFiligree position="top-left" className="w-8 h-8 text-[#DFB873]/60" />
                <CornerFiligree position="top-right" className="w-8 h-8 text-[#DFB873]/60" />
                <CornerFiligree position="bottom-left" className="w-8 h-8 text-[#DFB873]/60" />
                <CornerFiligree position="bottom-right" className="w-8 h-8 text-[#DFB873]/60" />
              </div>

              {/* Overlay Content */}
              <div className="relative z-20 space-y-2.5 text-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A0E17]/90 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wider uppercase text-[#DFB873] border border-[#DFB873]/40 shadow-md">
                  <LotusMedallion className="w-3 h-3 text-[#DFB873]" />
                  <span>Limited Festive Edition</span>
                </div>

                <h3 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {promo.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#FCF3ED]/85 max-w-md font-light leading-relaxed">
                  {promo.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#DFB873] hover:bg-[#EAD09E] text-[#241206] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg group-hover:scale-105">
                    <span>{promo.cta_text || "Explore Collection"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
