"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, ArrowUpDown, X, SlidersHorizontal, Check, ChevronDown, Heart } from "lucide-react";
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

export const CollectionClientView: React.FC<CollectionClientViewProps> = ({
  initialProducts,
  allCollections,
  currentSlug,
  categoryTitle,
  maxPriceParam,
}) => {
  const searchParams = useSearchParams();
  const { wishlist } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<number | null>(maxPriceParam || null);
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

        // Price Filter
        if (priceFilter !== null) {
          const effectivePrice = p.sale_price || p.price;
          if (effectivePrice > priceFilter) return false;
        }

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
  }, [initialProducts, selectedCategory, currentSlug, priceFilter, inStockOnly, wishlistOnly, wishlist, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceFilter(null);
    setSortBy("featured");
    setInStockOnly(false);
    setWishlistOnly(false);
  };

  const hasActiveFilters = selectedCategory !== "all" || priceFilter !== null || inStockOnly || wishlistOnly;

  return (
    <div>
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <Link
          href="/collections/all"
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            currentSlug === "all" && selectedCategory === "all"
              ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-md"
              : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/60"
          }`}
        >
          All Items ({initialProducts.length})
        </Link>
        {allCollections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              currentSlug === col.slug
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-md"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/60"
            }`}
          >
            {col.name}
          </Link>
        ))}
      </div>

      {/* Control Bar: Modern Luxury Filters & Sort Toolbar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3.5 border border-[#7B3D14]/15 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#7B3D14] mr-1">
            <Filter className="w-3.5 h-3.5 text-[#7B3D14]" />
            <span>Filters:</span>
          </div>

          {/* Price Range Buttons */}
          <button
            onClick={() => setPriceFilter(priceFilter === 999 ? null : 999)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-2xs ${
              priceFilter === 999
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/50"
            }`}
          >
            Under ₹999
          </button>
          <button
            onClick={() => setPriceFilter(priceFilter === 1999 ? null : 1999)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-2xs ${
              priceFilter === 1999
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/50"
            }`}
          >
            Under ₹1,999
          </button>

          {/* Liked / Wishlist Filter Button */}
          <button
            onClick={() => setWishlistOnly(!wishlistOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-2xs ${
              wishlistOnly
                ? "bg-[#DA3F3F] text-white border-[#DA3F3F] shadow-sm"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#DA3F3F] hover:bg-rose-50/50"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistOnly ? "fill-white text-white" : "text-[#DA3F3F]"}`} />
            <span>Liked ({wishlist.length})</span>
          </button>

          {/* In Stock Toggle Button */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-2xs ${
              inStockOnly
                ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-sm"
                : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14] hover:bg-[#FCF3ED]/50"
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
            <span>In Stock Only</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#DA3F3F] hover:text-[#a82828] font-bold transition-colors ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort By Dropdown & Count */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <span className="text-xs text-[#341B09]/70 font-medium">
            Showing <strong className="text-[#341B09] font-bold">{filteredProducts.length}</strong> items
          </span>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-[#7B3D14]/25 rounded-full pl-3.5 pr-8 py-1.5 text-xs font-semibold text-[#341B09] focus:outline-none focus:border-[#7B3D14] shadow-2xs hover:border-[#7B3D14] cursor-pointer transition-colors"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7B3D14] absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#7B3D14]/15 shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-[#FCF3ED] border border-[#7B3D14]/20 flex items-center justify-center mx-auto mb-4 text-[#7B3D14]">
            {wishlistOnly ? (
              <Heart className="w-8 h-8 fill-[#DA3F3F]/20 text-[#DA3F3F]" />
            ) : (
              <SlidersHorizontal className="w-8 h-8 opacity-70" />
            )}
          </div>
          <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">
            {wishlistOnly ? "No liked weaves found" : "No matching weaves found"}
          </h3>
          <p className="text-xs sm:text-sm text-[#341B09]/60 mt-1 max-w-sm mx-auto">
            {wishlistOnly
              ? "Click the heart icon on any saree or lehenga while browsing to add your favorite pieces to your liked collection."
              : "Try loosening your price filters or exploring other categories."}
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 bg-[#7B3D14] text-white rounded-full text-xs font-semibold hover:bg-[#632f0e] transition-colors shadow-md"
          >
            {wishlistOnly ? "Browse All Sarees" : "Clear All Filters"}
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
