"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface BestSellersGridProps {
  products: Product[];
}

export const BestSellersGrid: React.FC<BestSellersGridProps> = ({ products }) => {
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);
  const itemsToShow = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  const totalBestsellersCount = products.filter((p) => p.is_bestseller).length || products.length;

  return (
    <section className="py-14 sm:py-20 bg-[#FAF5EE] border-b border-[#7B3D14]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-[#7B3D14]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-0.5 bg-[#7B3D14]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#7B3D14]">
                Heirloom Favorites
              </span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#341B09] tracking-tight">
              Most Coveted Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-[#341B09]/70 mt-1 max-w-xl font-light">
              Celebrated across thousands of weddings and grand celebrations across India.
            </p>
          </div>

          <Link
            href="/collections/best-sellers"
            className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-[#7B3D14] hover:text-[#5E2C0C] group uppercase tracking-wider shrink-0"
          >
            <span>View All ({totalBestsellersCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {itemsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Centered View All CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/collections/best-sellers"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#7B3D14] hover:bg-[#7B3D14] hover:text-white border border-[#C59A4E]/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:scale-105 group"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
