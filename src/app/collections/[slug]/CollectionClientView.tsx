"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal, Check, ChevronDown, Heart } from "lucide-react";
import { Product, Collection } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

interface CollectionClientViewProps {
  initialProducts: Product[];
  allCollections: Collection[];
  currentSlug: string;
  categoryTitle?: string;
  maxPriceParam?: number;
}

type PriceTier = "all" | "under-1500" | "1500-3500" | "above-3500";

export const CollectionClientView: React.FC<CollectionClientViewProps> = ({
  initialProducts,
  allCollections,
  currentSlug,
  maxPriceParam,
}) => {
  const searchParams = useSearchParams();
  const { wishlist } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Price tier state
  const [priceTier, setPriceTier] = useState<PriceTier>(() => {
    if (maxPriceParam && maxPriceParam <= 1500) return "under-1500";
    if (maxPriceParam && maxPriceParam <= 3500) return "1500-3500";
    return "all";
  });

  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(
    searchParams?.get("wishlist") === "true" || searchParams?.get("likes") === "true"
  );
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    if (searchParams?.get("wishlist") === "true" || searchParams?.get("likes") === "true") {
      setWishlistOnly(true);
    }
  }, [searchParams]);

  // Multi-dimensional filtering and sorting
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Liked / Wishlist filter
        if (wishlistOnly && !wishlist.includes(p.id)) {
          return false;
        }

        // Slug/category match
        if (currentSlug !== "all" && currentSlug !== "offer-zone" && currentSlug !== "best-sellers") {
          if (p.category !== currentSlug) return false;
        }

        if (currentSlug === "offer-zone" && (!p.sale_price || p.sale_price >= p.price)) {
          return false;
        }

        if (currentSlug === "best-sellers" && !p.is_bestseller) {
          return false;
        }

        // Secondary category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Price Tier Filter
        const effectivePrice = p.sale_price || p.price;
        if (priceTier === "under-1500" && effectivePrice > 1500) return false;
        if (priceTier === "1500-3500" && (effectivePrice < 1500 || effectivePrice > 3500)) return false;
        if (priceTier === "above-3500" && effectivePrice < 3500) return false;

        // Stock Filter
        if (inStockOnly && !p.in_stock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.sale_price || a.price;
        const priceB = b.sale_price || b.price;

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "newest") return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return 0; // featured default
      });
  }, [initialProducts, selectedCategory, currentSlug, priceTier, inStockOnly, wishlistOnly, wishlist, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceTier("all");
    setSortBy("featured");
    setInStockOnly(false);
    setWishlistOnly(false);
  };

  const hasActiveFilters = selectedCategory !== "all" || priceTier !== "all" || inStockOnly || wishlistOnly;

  return (
    <div>
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <Link
          href="/collections/all"
          className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all border ${
            currentSlug === "all" && selectedCategory === "all"
              ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-md font-semibold"
              : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/60 font-medium"
          }`}
        >
          All Silks ({initialProducts.length})
        </Link>
        {allCollections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all border ${
              currentSlug === col.slug
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-md font-semibold"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/60 font-medium"
            }`}
          >
            {col.name}
          </Link>
        ))}
      </div>

      {/* Control Bar: Modern Luxury Filters & Sort Toolbar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-4 border border-[#7B3D14]/15 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-serif text-[#7B3D14] uppercase tracking-wider text-[11px] font-bold mr-1">
            <Filter className="w-3.5 h-3.5 text-[#7B3D14]" />
            <span>Price:</span>
          </div>

          {/* Price Range Buttons */}
          <button
            onClick={() => setPriceTier(priceTier === "under-1500" ? "all" : "under-1500")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              priceTier === "under-1500"
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm font-semibold"
                : "bg-[#FAF7F2] text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-white"
            }`}
          >
            Under ₹1,500
          </button>
          <button
            onClick={() => setPriceTier(priceTier === "1500-3500" ? "all" : "1500-3500")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              priceTier === "1500-3500"
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm font-semibold"
                : "bg-[#FAF7F2] text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-white"
            }`}
          >
            ₹1,500 – ₹3,500
          </button>
          <button
            onClick={() => setPriceTier(priceTier === "above-3500" ? "all" : "above-3500")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              priceTier === "above-3500"
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm font-semibold"
                : "bg-[#FAF7F2] text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-white"
            }`}
          >
            ₹3,500 & Above
          </button>

          <span className="w-px h-5 bg-[#7B3D14]/20 mx-1 hidden sm:inline-block" />

          {/* Liked / Wishlist Filter Button */}
          <button
            onClick={() => setWishlistOnly(!wishlistOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
              wishlistOnly
                ? "bg-[#8C1D40] text-white border-[#8C1D40] shadow-sm font-semibold"
                : "bg-[#FAF7F2] text-[#341B09] border-[#7B3D14]/20 hover:border-[#8C1D40] hover:bg-rose-50/50"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistOnly ? "fill-white text-white" : "text-[#8C1D40]"}`} />
            <span>Curated Liked ({wishlist.length})</span>
          </button>

          {/* In Stock Toggle Button */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
              inStockOnly
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm font-semibold"
                : "bg-[#FAF7F2] text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-white"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                inStockOnly
                  ? "bg-white border-white text-[#7B3D14]"
                  : "border-[#7B3D14]/40 bg-white"
              }`}
            >
              {inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Ready in Atelier</span>
          </button>
        </div>

        {/* Right: Sort By Dropdown & Count */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <span className="text-xs text-[#666666] font-light">
            Displaying <strong className="text-[#1A1A1A] font-semibold">{filteredProducts.length}</strong> creations
          </span>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#FAF7F2] border border-[#7B3D14]/25 rounded-full pl-3.5 pr-8 py-1.5 text-xs font-serif text-[#341B09] focus:outline-none focus:border-[#7B3D14] hover:border-[#7B3D14] cursor-pointer transition-colors"
            >
              <option value="featured">Sort: Featured Heirloom</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest from Loom</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7B3D14] absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
          <span className="text-xs text-[#666666] font-serif uppercase tracking-wider">Active:</span>
          {priceTier !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DFC8]/50 border border-[#C59A4E]/40 text-xs text-[#341B09] font-medium">
              <span>
                {priceTier === "under-1500" && "Under ₹1,500"}
                {priceTier === "1500-3500" && "₹1,500 – ₹3,500"}
                {priceTier === "above-3500" && "₹3,500 & Above"}
              </span>
              <button
                onClick={() => setPriceTier("all")}
                className="hover:text-[#8C1D40] transition-colors"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {wishlistOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C1D40]/10 border border-[#8C1D40]/30 text-xs text-[#8C1D40] font-medium">
              <span>Liked Weaves</span>
              <button
                onClick={() => setWishlistOnly(false)}
                className="hover:text-red-700 transition-colors"
                aria-label="Remove wishlist filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-medium">
              <span>Ready in Atelier</span>
              <button
                onClick={() => setInStockOnly(false)}
                className="hover:text-emerald-950 transition-colors"
                aria-label="Remove in-stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-[#8C1D40] hover:underline font-serif tracking-wider font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#7B3D14]/15 shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-[#FCF3ED] border border-[#7B3D14]/20 flex items-center justify-center mx-auto mb-4 text-[#7B3D14]">
            {wishlistOnly ? (
              <Heart className="w-8 h-8 fill-[#8C1D40]/20 text-[#8C1D40]" />
            ) : (
              <SlidersHorizontal className="w-8 h-8 opacity-70" />
            )}
          </div>
          <h3 className="font-serif text-xl font-bold text-[#341B09]">
            {wishlistOnly ? "No liked weaves found" : "No matching weaves found"}
          </h3>
          <p className="text-xs sm:text-sm text-[#341B09]/60 mt-1 max-w-sm mx-auto">
            {wishlistOnly
              ? "Click the heart icon on any saree or lehenga while browsing to curate your private showroom favorites."
              : "Try adjusting your price range or exploring other atelier collections."}
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 bg-[#7B3D14] text-white rounded-full text-xs font-serif uppercase tracking-wider hover:bg-[#632f0e] transition-colors shadow-md"
          >
            {wishlistOnly ? "Browse All Weaves" : "Reset All Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
