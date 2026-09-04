import React from "react";
import Link from "next/link";
import { ArrowRight, Crown, Home, ShoppingBag, Sparkles } from "lucide-react";
import { LotusMedallion, CornerFiligree } from "@/components/ui/RoyalMotifs";

export default function GlobalNotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#FAF5EE] relative overflow-hidden">
      {/* Decorative Golden Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#DFB873]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#7B3D14]/15 shadow-2xl">
        <CornerFiligree position="top-left" className="w-8 h-8 text-[#DFB873]/40" />
        <CornerFiligree position="top-right" className="w-8 h-8 text-[#DFB873]/40" />

        {/* Crown & Lotus Medallion */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8E4718] to-[#5E2C0C] border-2 border-[#DFB873]/60 flex items-center justify-center text-[#DFB873] mx-auto mb-6 shadow-lg">
          <Crown className="w-8 h-8" />
        </div>

        {/* 404 Kicker */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7B3D14]/10 text-[#7B3D14] text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#DFB873]" />
          <span>404 • Page Not Found</span>
        </div>

        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#341B09] tracking-tight mb-3">
          Heirloom Piece Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#341B09]/75 leading-relaxed mb-8 max-w-md mx-auto font-light">
          The page or drape you are searching for might have been moved, renamed, or is resting in our weavers' looms. Let us guide you back to our curated vaults.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7B3D14] hover:bg-[#5E2C0C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Return to Showroom</span>
          </Link>

          <Link
            href="/collections/all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF5EE] text-[#7B3D14] border border-[#7B3D14]/30 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse All Collections</span>
          </Link>
        </div>

        {/* Quick Collections Shortcuts */}
        <div className="pt-6 border-t border-[#7B3D14]/15">
          <div className="flex items-center justify-center gap-1.5 text-[#7B3D14] mb-3">
            <LotusMedallion className="w-3.5 h-3.5 text-[#DFB873]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#341B09]/80">
              Popular Handloom Vaults
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Pure Pattu Sarees", href: "/collections/pattu-sarees" },
              { label: "Bridal Lehengas", href: "/collections/lehengas" },
              { label: "Fancy Silks", href: "/collections/fancy-sarees" },
              { label: "Designer Cutwork", href: "/collections/designer-sarees" },
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#F3E7DC] text-[#7B3D14] text-xs font-medium border border-[#7B3D14]/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
