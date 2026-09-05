import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { StorefrontChrome } from "@/components/StorefrontChrome";

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
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#FCF3ED] text-[#341B09] selection:bg-[#7B3D14] selection:text-white"
      >
        <StoreProvider>
          <StorefrontChrome>{children}</StorefrontChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
