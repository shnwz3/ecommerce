import React from "react";
import Link from "next/link";
import { ArrowRight, Home, ShoppingBag, Sparkles, MessageCircle } from "lucide-react";
import { CornerFiligree, LotusMedallion } from "@/components/ui/RoyalMotifs";

export default function ProductNotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#FAF5EE] relative overflow-hidden">
      <div className="relative z-10 max-w-xl w-full text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#7B3D14]/15 shadow-2xl">
        <CornerFiligree position="top-left" className="w-8 h-8 text-[#DFB873]/40" />
        <CornerFiligree position="top-right" className="w-8 h-8 text-[#DFB873]/40" />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7B3D14]/10 text-[#7B3D14] text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#DFB873]" />
          <span>Product Unavailable</span>
        </div>

        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#341B09] tracking-tight mb-3">
          This Handcrafted Piece Is Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#341B09]/75 leading-relaxed mb-8 max-w-md mx-auto font-light">
          This specific weave may have sold out, returned to the artisan looms, or the link may be outdated. Explore our active handloom collections or reach out to our concierge stylist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/collections/all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7B3D14] hover:bg-[#5E2C0C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Drapes</span>
          </Link>

          <a
            href="https://wa.me/?text=Hello%20Shopin%20Showroom,%20I%20am%20looking%20for%20a%20specific%20saree%20that%20seems%20out%20of%20stock."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Ask Stylist on WhatsApp</span>
          </a>
        </div>

        <div className="pt-6 border-t border-[#7B3D14]/15 flex items-center justify-center gap-2">
          <Home className="w-4 h-4 text-[#7B3D14]" />
          <Link href="/" className="text-xs font-bold text-[#7B3D14] hover:underline">
            Return to Grand Showroom Home
          </Link>
        </div>
      </div>
    </main>
  );
}
