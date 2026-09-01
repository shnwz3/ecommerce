"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { RoyalDivider } from "./ui/RoyalMotifs";

interface BestSellersGridProps {
  products: Product[];
}

export const BestSellersGrid: React.FC<BestSellersGridProps> = ({ products }) => {
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);
  const itemsToShow = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-[#FAF5EE] border-b border-[#7B3D14]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Royal Section Header */}
        <RoyalDivider
          kicker="Heirloom Favorites"
          title="Most Coveted Best Sellers"
          subtitle="Celebrated across thousands of weddings and grand celebrations across India."
        />

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
