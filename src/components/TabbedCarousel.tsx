"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { RoyalDivider, LotusMedallion } from "./ui/RoyalMotifs";

interface TabbedCarouselProps {
  products: Product[];
}

const TABS = [
  { id: "all", label: "All Masterpieces" },
  { id: "pattu-sarees", label: "Kanchi Pattu" },
  { id: "fancy-sarees", label: "Fancy Sarees" },
  { id: "designer-sarees", label: "Designer Cutwork" },
  { id: "work-sarees", label: "Zardozi Work" },
  { id: "lehengas", label: "Bridal Lehengas" },
];

export const TabbedCarousel: React.FC<TabbedCarouselProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-royal-damask relative overflow-hidden border-y border-[#7B3D14]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Royal Section Divider Header */}
        <RoyalDivider
          kicker="Drape The Beauty • Discover The Offers"
          title="Trending Silk & Bridal Vault"
          subtitle="Hand-selected pure silk weaves, festive organzas, and regal bridal couture with honest loom pricing."
        />

        {/* Royal Velvet Ribbon Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-6 pt-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap select-none flex items-center gap-1.5 shadow-sm ${
                  isActive
                    ? "bg-[#4A0E17] text-[#DFB873] border border-[#DFB873]/60 shadow-lg shadow-[#4A0E17]/25 scale-105"
                    : "bg-white/90 text-[#341B09]/80 border border-[#7B3D14]/20 hover:border-[#DFB873] hover:text-[#7B3D14]"
                }`}
              >
                {isActive && <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873]" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel Container with Gold Medallion Nav Arrows */}
        <div className="relative mt-4">
          <button
            onClick={scrollLeft}
            aria-label="Previous products"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#241206]/85 hover:bg-[#4A0E17] text-[#DFB873] border border-[#DFB873]/40 shadow-xl items-center justify-center transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollRight}
            aria-label="Next products"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#241206]/85 hover:bg-[#4A0E17] text-[#DFB873] border border-[#DFB873]/40 shadow-xl items-center justify-center transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Product Cards Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-1 py-4"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[240px] sm:w-[270px] md:w-[290px] shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12 text-[#341B09]/60 text-sm">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
