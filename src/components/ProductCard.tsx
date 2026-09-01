"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { LotusMedallion } from "./ui/RoyalMotifs";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const discountPercent =
    product.sale_price && product.price > product.sale_price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : null;

  const secondaryImage =
    product.gallery_urls && product.gallery_urls.length > 1
      ? product.gallery_urls[1]
      : null;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#C59A4E]/25 shadow-sm hover:shadow-2xl hover:border-[#C59A4E] transition-all duration-500 hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable Image Container with 3:4 Portrait Ratio */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative w-full pt-[132%] bg-[#FAF5EE] overflow-hidden cursor-pointer"
        aria-label={`View ${product.name}`}
      >
        {/* Primary Image */}
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover object-top transition-all duration-700 ease-out ${
            secondaryImage && isHovered
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        />

        {/* Secondary Hover Image (Dual Image Hover Swap) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Badges Container (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!product.in_stock && (
            <span className="px-2.5 py-0.5 bg-[#341B09]/90 text-[#FCF3ED] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
          {product.sale_price && product.in_stock && (
            <span className="px-2.5 py-0.5 bg-[#4A0E17] text-[#DFB873] border border-[#DFB873]/50 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_bestseller && product.in_stock && (
            <span className="px-2.5 py-0.5 bg-[#7B3D14] text-[#FCF3ED] text-[10px] font-semibold rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#DFB873]" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#341B09] hover:text-[#DA3F3F] hover:bg-white transition-all shadow-md group-hover:scale-110"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "fill-[#DA3F3F] text-[#DA3F3F]" : ""
            }`}
          />
        </button>

        {/* Desktop Quick Actions Overlay */}
        <div className="hidden lg:flex absolute bottom-3 inset-x-3 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={!product.in_stock}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl transition-all ${
              product.in_stock
                ? "bg-[#7B3D14] hover:bg-[#632f0e] text-white hover:scale-[1.02]"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.in_stock ? "Add to Bag" : "Out of Stock"}</span>
          </button>
          <span
            className="p-2.5 bg-white/95 hover:bg-white text-[#341B09] hover:text-[#7B3D14] rounded-xl shadow-xl transition-colors flex items-center justify-center border border-[#C59A4E]/30"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center gap-1 text-[#8E4718]">
            <LotusMedallion className="w-2.5 h-2.5 text-[#C59A4E]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8E4718] capitalize">
              {product.category.replace("-", " ")}
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block mt-1">
            <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#341B09] group-hover:text-[#7B3D14] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#7B3D14]/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#7B3D14]">
              ₹{(product.sale_price || product.price).toLocaleString("en-IN")}
            </span>
            {product.sale_price && (
              <span className="text-[11px] sm:text-xs text-[#341B09]/50 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={!product.in_stock}
            className="lg:hidden p-2 rounded-xl bg-[#FAF5EE] text-[#7B3D14] hover:bg-[#7B3D14] hover:text-white transition-colors shadow-sm border border-[#C59A4E]/30"
            aria-label="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
