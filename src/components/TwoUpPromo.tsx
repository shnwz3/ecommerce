"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Banner } from "@/lib/types";

interface TwoUpPromoProps {
  banners: Banner[];
}

export const TwoUpPromo: React.FC<TwoUpPromoProps> = ({ banners }) => {
  const promo1 = banners.find((b) => b.position === "promo-1") || {
    id: "promo-fallback-1",
    image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop",
    link_url: "/collections/fancy-sarees",
    title: "Festive Offer Zone",
    subtitle: "Up to 70% Off on Trending Fancy Sarees",
    cta_text: "View Offers",
    position: "promo-1",
    sort_order: 1,
  };

  const promo2 = banners.find((b) => b.position === "promo-2") || {
    id: "promo-fallback-2",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop",
    link_url: "/collections/lehengas",
    title: "Royal Heritage Bridal Edit",
    subtitle: "Designer Lehengas & Sets from ₹3,999",
    cta_text: "Shop Bridal",
    position: "promo-2",
    sort_order: 2,
  };

  const cards = [promo1, promo2];

  return (
    <section className="py-6 sm:py-10 bg-[#FCF3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((promo, idx) => (
            <Link
              key={promo.id || idx}
              href={promo.link_url || "/collections/all"}
              className="group relative h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-lg border border-[#7B3D14]/20 flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Background Image */}
              <Image
                src={promo.image_url}
                alt={promo.title || "Promo Banner"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Darkening Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Overlay Content */}
              <div className="relative z-10 space-y-2 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7B3D14]/90 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wider uppercase text-[#FCF3ED]">
                  <Sparkles className="w-3 h-3 text-[#C59A4E]" />
                  Limited Time
                </span>

                <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {promo.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/80 max-w-sm">
                  {promo.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FCF3ED] group-hover:text-[#C59A4E] transition-colors">
                    <span>{promo.cta_text || "Explore Collection"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
