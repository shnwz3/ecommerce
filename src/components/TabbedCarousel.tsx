"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface TabbedCarouselProps {
  products: Product[];
}

export const TabbedCarousel: React.FC<TabbedCarouselProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"sarees" | "offers">("sarees");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sareeProducts = products.filter(
    (p) =>
      p.category === "pattu-sarees" ||
      p.category === "fancy-sarees" ||
      p.category === "designer-sarees" ||
      p.category === "work-sarees"
  );

  const offerProducts = products.filter((p) => p.sale_price !== null && p.sale_price < p.price);

  const displayedProducts = activeTab === "sarees" ? sareeProducts : offerProducts;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F8EFEA] border-y border-[#7B3D14]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
              Exclusive Showcase
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1">
              Drape the Beauty. Discover the Offers
            </h2>
          </div>

          {/* Tabs Selector & Navigation Arrows */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex p-1 bg-white rounded-full border border-[#7B3D14]/20 shadow-sm">
              <button
                onClick={() => setActiveTab("sarees")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === "sarees"
                    ? "bg-[#7B3D14] text-white shadow-md"
                    : "text-[#341B09] hover:text-[#7B3D14]"
                }`}
              >
                Sarees
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === "offers"
                    ? "bg-[#DA3F3F] text-white shadow-md"
                    : "text-[#341B09] hover:text-[#DA3F3F]"
                }`}
              >
                Offer Zone 🔥
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll Left"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#FCF3ED] border border-[#7B3D14]/20 text-[#341B09] flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll Right"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#FCF3ED] border border-[#7B3D14]/20 text-[#341B09] flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
        >
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="w-[240px] sm:w-[280px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Footer Link */}
        <div className="text-center mt-8">
          <Link
            href={`/collections/${activeTab === "sarees" ? "sarees" : "offer-zone"}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#7B3D14]/25 text-[#7B3D14] text-xs font-bold hover:bg-[#7B3D14] hover:text-white transition-all shadow-sm group"
          >
            <span>View All {activeTab === "sarees" ? "Sarees" : "Offer Zone"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
