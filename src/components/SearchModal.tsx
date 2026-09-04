"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { INITIAL_PRODUCTS } from "@/lib/data/initial-data";
import { Product } from "@/lib/types";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useStore();
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={closeSearch}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#FCF3ED] rounded-2xl shadow-2xl border border-[#7B3D14]/20 overflow-hidden z-10">
        {/* Search Header */}
        <div className="flex items-center px-5 py-4 border-b border-[#7B3D14]/15 bg-white">
          <Search className="w-5 h-5 text-[#7B3D14] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search Banarasi sarees, bridal lehengas, silk pattu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#341B09] placeholder-[#341B09]/50 text-base focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 text-xs text-[#341B09]/60 hover:text-[#341B09] mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="p-1.5 rounded-full hover:bg-[#FCF3ED] text-[#341B09]/70 hover:text-[#341B09] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 bg-[#F8EFEA] border-b border-[#7B3D14]/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-[#7B3D14] uppercase tracking-wider shrink-0">
            Curated Tags:
          </span>
          {["Pure Silk Pattu", "Bridal Lehengas", "Banarasi Silk", "Zardozi Work", "Organza Cutwork"].map(
            (tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-[#341B09] border border-[#7B3D14]/15 hover:border-[#7B3D14] whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {searchQuery && results.length === 0 ? (
            <div className="text-center py-10 text-[#341B09]/60">
              <p className="text-sm">No sarees or lehengas found for &quot;{searchQuery}&quot;</p>
              <p className="text-xs mt-1">Try searching for &quot;Banarasi&quot;, &quot;Pattu&quot;, or &quot;Lehenga&quot;</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-[#7B3D14]/10">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-colors group"
                >
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/15">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="60px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7B3D14]">
                      {product.category}
                    </span>
                    <h4 className="font-serif-heading font-bold text-sm text-[#341B09] truncate group-hover:text-[#7B3D14] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-sm font-bold text-[#7B3D14]">
                        ₹{(product.sale_price || product.price).toLocaleString("en-IN")}
                      </span>
                      {product.sale_price && (
                        <span className="text-xs text-[#341B09]/50 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#341B09]/40 group-hover:text-[#7B3D14] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#341B09]/60">
              Type above to discover sarees, bridal lehengas, and festive offers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
