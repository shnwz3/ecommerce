"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/919848000000?text=Hello%20Shopin%20Showroom,%20I%20am%20interested%20in%20your%20sarees%20and%20lehengas"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden lg:flex fixed bottom-8 right-8 z-40 items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba59] hover:scale-105 transition-all duration-300 group border border-white/20"
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
      <span className="text-xs font-bold tracking-wide">Chat with Stylist</span>
    </a>
  );
};
