"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface NewArrivalsGridProps {
  products: Product[];
}

export const NewArrivalsGrid: React.FC<NewArrivalsGridProps> = ({ products }) => {
  const newItems = products.filter((p) => p.is_new).slice(0, 4);
  const itemsToShow = newItems.length > 0 ? newItems : products.slice(2, 6);

  return (
    <section className="py-12 sm:py-16 bg-[#FCF3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
              <Sparkles className="w-4 h-4 text-[#7B3D14]" />
              <span>Fresh Off The Looms</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/collections/new-arrivals"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#7B3D14]/25 text-[#7B3D14] text-xs font-bold hover:bg-[#7B3D14] hover:text-white transition-all shadow-sm group"
          >
            <span>Shop More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {itemsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View More */}
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7B3D14] text-white text-xs font-bold shadow-md"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
