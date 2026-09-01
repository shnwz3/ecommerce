"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/lib/types";

interface ShopByCollectionsProps {
  collections: Collection[];
}

export const ShopByCollections: React.FC<ShopByCollectionsProps> = ({ collections }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FCF3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
            Curated Categories
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1.5">
            Shop By Collections
          </h2>
          <div className="w-12 h-0.5 bg-[#7B3D14] mx-auto mt-3 rounded-full opacity-60" />
        </div>

        {/* Categories Grid (Circular / Rounded Portrait Tiles) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#7B3D14]/15 shadow-sm hover:shadow-xl hover:border-[#7B3D14]/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Circular/Oval Image Frame with Gold Border Accent */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#7B3D14] via-[#C59A4E] to-[#FCF3ED] shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F8EFEA]">
                  <Image
                    src={col.image_url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop"}
                    alt={col.name}
                    fill
                    sizes="(max-width: 640px) 100px, 150px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Title & Item Count */}
              <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#341B09] group-hover:text-[#7B3D14] transition-colors mt-3.5 line-clamp-1">
                {col.name}
              </h3>
              <span className="text-[11px] text-[#341B09]/60 mt-0.5 font-medium">
                {col.item_count ? `${col.item_count}+ Designs` : "View All"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
