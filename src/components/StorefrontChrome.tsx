"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin routes should have their own isolated workspace without storefront navbar, footer, or overlays
  if (isAdmin) {
    return <div className="flex-1 w-full min-h-screen">{children}</div>;
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Header with Mega-Menu & Search */}
      <Header />

      {/* Page Content */}
      <div className="flex-1">{children}</div>

      {/* Store Footer */}
      <Footer />

      {/* Interactive Drawers & Overlays */}
      <CartDrawer />
      <SearchModal />
      <MobileBottomNav />
      <WhatsAppButton />
    </>
  );
}
