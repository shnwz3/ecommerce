"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronDown,
  Sparkles,
  Check,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { CheckoutModal } from "@/components/CheckoutModal";

interface ProductDetailClientViewProps {
  product: Product;
}

export const ProductDetailClientView: React.FC<ProductDetailClientViewProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Gallery Images List
  const images = [
    product.image_url,
    ...(product.gallery_urls || []).filter((url) => url !== product.image_url),
  ];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState(
    (product.sizes && product.sizes[0]) || "Free Size"
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    desc: true,
    care: false,
    shipping: false,
    faq: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sticky Mobile ATC Observer using robust hybrid observer
  const mainAtcRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (mainAtcRef.current) {
        const rect = mainAtcRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    const target = mainAtcRef.current;
    let observer: IntersectionObserver | null = null;

    if (target && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        },
        { threshold: 0 }
      );
      observer.observe(target);
    }

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  const discountPercent =
    product.sale_price && product.price > product.sale_price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : null;

  const currentPrice = product.sale_price || product.price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* LEFT: Multi-Image Thumbnail & Main Gallery (7 Columns) */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 self-start lg:sticky lg:top-28">
        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#FAF5EE] ${
                  selectedImage === img
                    ? "border-[#7B3D14] shadow-md scale-105"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image Viewer with Aspect Ratio */}
        <div className="relative flex-1 rounded-3xl overflow-hidden bg-[#FAF5EE] border-2 border-[#C59A4E]/30 shadow-xl group">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.sale_price && product.in_stock && (
              <span className="px-3 py-1 bg-[#DA3F3F] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            {product.is_bestseller && (
              <span className="px-3 py-1 bg-[#7B3D14] text-white text-xs font-semibold rounded-full uppercase tracking-wider shadow-md">
                Best Seller
              </span>
            )}
          </div>

          {/* Floating Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#341B09] hover:text-[#DA3F3F] transition-all shadow-md hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${inWishlist ? "fill-[#DA3F3F] text-[#DA3F3F]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* RIGHT: Product Buy Box & Accordions (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
        {/* Title, Category & Star Rating */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7B3D14] capitalize">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Authentic Handloom Weave</span>
            </div>
          </div>

          <h1 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#341B09] mt-2 leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Pricing */}
        <div className="p-4 rounded-2xl bg-white border border-[#7B3D14]/15 shadow-sm space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#7B3D14]">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {product.sale_price && (
              <span className="text-sm sm:text-base text-[#341B09]/50 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
            {discountPercent && (
              <span className="px-2.5 py-0.5 bg-[#DA3F3F]/10 text-[#DA3F3F] text-xs font-bold rounded-md">
                Save ₹{(product.price - product.sale_price!).toLocaleString("en-IN")} ({discountPercent}%)
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#341B09]/60">
            Inclusive of all taxes • Free express shipping on this order
          </p>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#341B09]">Select Size / Option:</span>
              <span className="text-[#7B3D14] font-medium">{selectedSize}</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? "bg-[#7B3D14] text-white border-[#7B3D14] shadow-md scale-105"
                      : "bg-white text-[#341B09] border-[#7B3D14]/20 hover:border-[#7B3D14]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and CTA Buttons */}
        <div ref={mainAtcRef} className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-[#7B3D14]/20 rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg text-sm font-bold text-[#341B09] hover:bg-[#FCF3ED] flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#341B09]">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg text-sm font-bold text-[#341B09] hover:bg-[#FCF3ED] flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>

            {/* Add To Bag Button */}
            <button
              onClick={() => addToCart(product, selectedSize, quantity)}
              disabled={!product.in_stock}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
                product.in_stock
                  ? "bg-[#7B3D14] text-white hover:bg-[#632f0e] hover:shadow-xl hover:scale-[1.01]"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.in_stock ? "Add to Shopping Bag" : "Sold Out"}</span>
            </button>
          </div>

          {/* Buy Now Button */}
          {product.in_stock && (
            <button
              onClick={() => {
                addToCart(product, selectedSize, quantity);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 px-6 bg-[#341B09] hover:bg-black text-[#FCF3ED] rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-[#C59A4E]" />
              <span>Instant Buy Now</span>
            </button>
          )}
        </div>

        {/* 4 Trust Badges Horizontal Strip */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#7B3D14]/10 text-xs text-[#341B09]/80 font-medium">
            <Truck className="w-4 h-4 text-[#7B3D14] shrink-0" />
            <span>Pan-India 3-Day Shipping</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#7B3D14]/10 text-xs text-[#341B09]/80 font-medium">
            <RotateCcw className="w-4 h-4 text-[#7B3D14] shrink-0" />
            <span>7-Day Easy Returns</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#7B3D14]/10 text-xs text-[#341B09]/80 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Authentic Handloom</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#7B3D14]/10 text-xs text-[#341B09]/80 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>COD & UPI Accepted</span>
          </div>
        </div>

        {/* Collapsible Accordions */}
        <div className="space-y-3 pt-4 border-t border-[#7B3D14]/15">
          {/* Accordion 1: Description */}
          <div className="bg-white rounded-2xl border border-[#7B3D14]/15 overflow-hidden">
            <button
              onClick={() => toggleAccordion("desc")}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-serif-heading font-bold text-[#341B09] text-base"
            >
              <span>Product Details & Craftsmanship</span>
              <ChevronDown
                className={`w-4 h-4 text-[#7B3D14] transition-transform ${
                  openAccordions.desc ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordions.desc && (
              <div className="px-5 pb-4 text-xs text-[#341B09]/80 leading-relaxed space-y-2">
                <p>{product.description}</p>
                <p>
                  Every weave is handcrafted by experienced weavers using time-tested heritage looms. Slight irregularities in the motifs are the authentic signature of handcrafted art.
                </p>
              </div>
            )}
          </div>

          {/* Accordion 2: Care Instructions */}
          <div className="bg-white rounded-2xl border border-[#7B3D14]/15 overflow-hidden">
            <button
              onClick={() => toggleAccordion("care")}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-serif-heading font-bold text-[#341B09] text-base"
            >
              <span>Fabric & Care Instructions</span>
              <ChevronDown
                className={`w-4 h-4 text-[#7B3D14] transition-transform ${
                  openAccordions.care ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordions.care && (
              <div className="px-5 pb-4 text-xs text-[#341B09]/80 leading-relaxed space-y-1.5">
                <p>• <strong>Wash Care:</strong> Dry Clean recommended for the first 3 washes.</p>
                <p>• <strong>Ironing:</strong> Medium heat with a protective cotton cloth over zari embroidery.</p>
                <p>• <strong>Storage:</strong> Wrap in pure muslin or cotton cloth in a cool dry wardrobe.</p>
              </div>
            )}
          </div>

          {/* Accordion 3: Shipping & Returns */}
          <div className="bg-white rounded-2xl border border-[#7B3D14]/15 overflow-hidden">
            <button
              onClick={() => toggleAccordion("shipping")}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-serif-heading font-bold text-[#341B09] text-base"
            >
              <span>Shipping & Return Policy</span>
              <ChevronDown
                className={`w-4 h-4 text-[#7B3D14] transition-transform ${
                  openAccordions.shipping ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordions.shipping && (
              <div className="px-5 pb-4 text-xs text-[#341B09]/80 leading-relaxed space-y-1.5">
                <p>• <strong>Dispatch:</strong> Orders dispatched within 24-48 hours from Godavarikhani showroom.</p>
                <p>• <strong>Delivery:</strong> 3-5 business days across India via BlueDart/Delhivery.</p>
                <p>• <strong>Easy Returns:</strong> 7 days return window for unstitched/unworn sarees with original tags.</p>
              </div>
            )}
          </div>

          {/* Accordion 4: FAQs */}
          <div className="bg-white rounded-2xl border border-[#7B3D14]/15 overflow-hidden">
            <button
              onClick={() => toggleAccordion("faq")}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-serif-heading font-bold text-[#341B09] text-base"
            >
              <span>Frequently Asked Questions</span>
              <ChevronDown
                className={`w-4 h-4 text-[#7B3D14] transition-transform ${
                  openAccordions.faq ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordions.faq && (
              <div className="px-5 pb-4 text-xs text-[#341B09]/80 leading-relaxed space-y-2">
                <p><strong>Q: Does this saree include an unstitched blouse piece?</strong><br />A: Yes, all sarees include a running 0.8 meter matching unstitched blouse piece.</p>
                <p><strong>Q: How should I care for this garment?</strong><br />A: Dry clean only is recommended for all pure silk and zari weaves to preserve the natural sheen and delicate craftsmanship.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Placeholder */}
        <div className="bg-white rounded-2xl border border-[#7B3D14]/15 p-6 mt-6 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1 text-[#DFB873] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#DFB873]/30 text-[#DFB873]" />
            ))}
          </div>
          <h4 className="font-serif-heading font-bold text-[#341B09] text-base mb-1">
            Customer Reviews
          </h4>
          <p className="text-xs text-[#341B09]/70 mb-4 max-w-sm mx-auto">
            No reviews yet for this handcrafted piece. Have you purchased this? Share your experience with future patrons.
          </p>
          <button
            type="button"
            onClick={() => alert("Review submission will be enabled after order verification.")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B3D14] hover:text-[#5E2C0C] bg-[#F8EFEA] hover:bg-[#F0DFD5] px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write the First Review</span>
          </button>
        </div>
      </div>

      {/* Tactic 2: Sticky Mobile "Add to Cart" Bar */}
      {showStickyBar && (
        <div className="fixed bottom-14 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#7B3D14]/20 p-3 shadow-2xl animate-fade-in flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/15">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="50px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-[#341B09] truncate">{product.name}</h5>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-[#7B3D14]">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {product.sale_price && (
                  <span className="text-[10px] text-[#341B09]/50 line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, selectedSize, 1)}
            disabled={!product.in_stock}
            className="px-5 py-2.5 bg-[#7B3D14] text-white rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      )}

      {/* Instant Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
