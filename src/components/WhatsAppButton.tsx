"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/?text=Hello%20Shopin%20Showroom,%20I%20am%20interested%20in%20your%20sarees%20and%20lehengas"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Stylist on WhatsApp"
      title="Chat with Stylist on WhatsApp"
      className="hidden lg:flex fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-110 transition-all duration-300 items-center justify-center border border-white/20"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
    </a>
  );
};
