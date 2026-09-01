"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Collection } from "@/lib/types";
import { RoyalDivider, LotusMedallion } from "./ui/RoyalMotifs";

interface ShopByCollectionsProps {
  collections: Collection[];
}

export const ShopByCollections: React.FC<ShopByCollectionsProps> = ({ collections }) => {
  return (
    <section className="py-14 sm:py-20 bg-royal-damask relative overflow-hidden border-b border-[#7B3D14]/15">
      {/* Decorative Gold Glow Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#DFB873]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#7B3D14]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Royal Section Header with Lotus Flourish */}
        <RoyalDivider
          kicker="Curated Heirloom Weaves"
          title="Shop By Collections"
          subtitle="Discover authentic Kanchipuram Pattu, Banarasi Silks, Designer Drapes, and Royal Bridal Lehengas."
        />

        {/* 5-Column Jharokha Arch Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative flex flex-col items-center text-center p-3 sm:p-4 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#C59A4E]/30 shadow-sm hover:shadow-2xl hover:border-[#C59A4E] transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Jharokha Arch Portal Image Frame with Double Gold Zari Ring */}
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 rounded-t-[50%_35%] rounded-b-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#8E4718] via-[#DFB873] to-[#4A0E17] shadow-lg group-hover:scale-105 transition-transform duration-500">
                <div className="relative w-full h-full rounded-t-[50%_35%] rounded-b-xl overflow-hidden bg-[#241206]">
                  <Image
                    src={
                      col.image_url ||
                      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={col.name}
                    fill
                    sizes="(max-width: 640px) 120px, 180px"
                    className="object-cover group-hover:scale-115 transition-transform duration-700"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>
              </div>

              {/* Lotus Crest Accents */}
              <div className="mt-3 flex items-center justify-center gap-1 text-[#C59A4E]">
                <LotusMedallion className="w-3.5 h-3.5 text-[#C59A4E]" />
              </div>

              {/* Title & Count */}
              <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#341B09] group-hover:text-[#7B3D14] transition-colors mt-1 line-clamp-1">
                {col.name}
              </h3>
              <span className="text-[11px] font-semibold text-[#8E4718] mt-0.5 flex items-center gap-0.5">
                <span>{col.item_count ? `${col.item_count}+ Masterpieces` : "Explore All"}</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
