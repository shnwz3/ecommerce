"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Gem, Sparkles } from "lucide-react";

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: Truck,
      title: "Pan-India Express Shipping",
      desc: "Fast, insured & trackable delivery across 25,000+ pincodes",
      badge: "Free above ₹999",
    },
    {
      icon: Gem,
      title: "Honest Artisan Pricing",
      desc: "Authentic sarees & lehengas direct from master looms since 1996",
      badge: "Zero Middlemen",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Returns",
      desc: "Hassle-free direct exchanges & 100% money-back guarantee",
      badge: "Easy Process",
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Checkout",
      desc: "Encrypted UPI, Cards, NetBanking & COD payment options",
      badge: "256-Bit SSL",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-y border-[#7B3D14]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col items-center sm:items-start text-center sm:text-left p-5 rounded-2xl bg-[#FCF3ED]/40 hover:bg-[#FCF3ED] border border-[#7B3D14]/10 hover:border-[#7B3D14]/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between w-full mb-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#7B3D14]/20 flex items-center justify-center text-[#7B3D14] shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-[#7B3D14] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B3D14] bg-white px-2 py-0.5 rounded-full border border-[#7B3D14]/15 shadow-xs">
                    {item.badge}
                  </span>
                </div>

                <h4 className="font-serif-heading text-base sm:text-lg font-bold text-[#341B09] group-hover:text-[#7B3D14] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#341B09]/70 mt-1 leading-relaxed">
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
