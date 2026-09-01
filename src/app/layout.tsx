import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopin | Authentic Sarees & Lehengas Since 1996",
  description:
    "Explore exquisite Banarasi, Kanchi Pattu, Fancy Sarees, and Bridal Lehengas at honest prices direct from master weavers at Shopin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FCF3ED] text-[#341B09] selection:bg-[#7B3D14] selection:text-white">
        <StoreProvider>
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
        </StoreProvider>
      </body>
    </html>
  );
}
