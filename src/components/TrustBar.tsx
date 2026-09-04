"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Gem, Sparkles, Award } from "lucide-react";
import { LotusMedallion } from "./ui/RoyalMotifs";

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: "Pure Handloom Weaves",
      desc: "Authentic hand-woven textiles crafted by master loom artisans",
      badge: "Heritage Craft",
    },
    {
      icon: Gem,
      title: "Direct Loom Pricing",
      desc: "Handcrafted heritage sarees & lehengas with zero middleman markups",
      badge: "Since 1996",
    },
    {
      icon: Truck,
      title: "Pan-India Insured Dispatch",
      desc: "Express doorstep delivery with tamper-proof luxury packaging",
      badge: "Insured Transit",
    },
    {
      icon: ShieldCheck,
      title: "Safe & Verified Checkout",
      desc: "Encrypted checkout via UPI, NetBanking, Cards & WhatsApp concierge",
      badge: "Secure Payments",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#241206] text-[#FCF3ED] border-t-2 border-[#C59A4E]/40 relative overflow-hidden">
      {/* Decorative Gold Ambient Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#DFB873]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-3xl bg-[#341B09]/90 hover:bg-[#4A0E17]/80 border border-[#DFB873]/25 hover:border-[#DFB873]/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  {/* Royal Gold Crest Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8E4718] to-[#5E2C0C] border border-[#DFB873]/50 flex items-center justify-center text-[#DFB873] shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFB873] bg-[#241206] px-2.5 py-1 rounded-full border border-[#DFB873]/30 shadow-xs">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#DFB873] mb-1">
                  <LotusMedallion className="w-3 h-3 text-[#DFB873]" />
                  <h4 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#DFB873] transition-colors">
                    {item.title}
                  </h4>
                </div>

                <p className="text-xs text-[#FCF3ED]/75 mt-1 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
