"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, Crown } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { openCart, openSearch, cartCount, wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  interface NavItem {
    name: string;
    href: string;
    badge?: string;
    hasMega?: boolean;
    subCategories?: Array<{
      name: string;
      href: string;
      desc: string;
      image: string;
    }>;
  }

  const navLinks: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Offer Zone", href: "/collections/offer-zone" },
    { name: "Shop All", href: "/collections/all" },
    {
      name: "Sarees",
      href: "/collections/sarees",
      hasMega: true,
      subCategories: [
        {
          name: "Pure Silk Pattu Sarees",
          href: "/collections/pattu-sarees",
          desc: "Kanchipuram, Banarasi & Dharmavaram silks",
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=300&auto=format&fit=crop",
        },
        {
          name: "Fancy & Party Sarees",
          href: "/collections/fancy-sarees",
          desc: "Lightweight Georgette, Chiffon & Net",
          image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300&auto=format&fit=crop",
        },
        {
          name: "Designer Cutwork Sarees",
          href: "/collections/designer-sarees",
          desc: "Organza, Tissue & Scalloped Borders",
          image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop",
        },
        {
          name: "Heavy Work & Zari Sarees",
          href: "/collections/work-sarees",
          desc: "Zardozi, Moti & Hand Embroidery",
          image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop",
        },
      ],
    },
    {
      name: "Lehengas",
      href: "/collections/lehengas",
      hasMega: true,
      subCategories: [
        {
          name: "Bridal Heritage Lehengas",
          href: "/collections/lehengas",
          desc: "Micro Velvet, Raw Silk & Heavy Can-can",
          image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300&auto=format&fit=crop",
        },
        {
          name: "Festive & Sangeet Sets",
          href: "/collections/lehengas",
          desc: "Mirror Work, Georgette & Pastels",
          image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300&auto=format&fit=crop",
        },
      ],
    },
    { name: "Best Sellers", href: "/collections/best-sellers" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FCF3ED]/95 backdrop-blur-md shadow-md border-b border-[#7B3D14]/20 py-2"
          : "bg-[#FCF3ED] py-3 border-b border-[#7B3D14]/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Search trigger */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#341B09] hover:text-[#7B3D14] focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={openSearch}
            className="p-2 text-[#341B09] hover:text-[#7B3D14] focus:outline-none"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo & Heritage Title */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#8E4718] to-[#5E2C0C] border border-[#C59A4E]/50 flex items-center justify-center text-[#DFB873] shadow-md group-hover:scale-105 transition-transform shrink-0">
            <Crown className="w-5 h-5 text-[#DFB873]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-heading text-xl sm:text-2xl font-bold tracking-widest text-[#7B3D14] group-hover:text-[#632f0e] transition-colors uppercase leading-none whitespace-nowrap">
              Shopin
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#341B09]/75 font-semibold mt-0.5 whitespace-nowrap">
              Handlooms • Since 1996
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar with Mega-Menu (Single-line guaranteed) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.hasMega && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className="px-2.5 xl:px-3 py-2 text-xs xl:text-[13px] font-semibold text-[#341B09] hover:text-[#7B3D14] flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <span>{link.name}</span>
                {link.hasMega && (
                  <ChevronDown className="w-3.5 h-3.5 text-[#7B3D14] transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                )}
                {link.badge && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#DA3F3F] text-white text-[9px] font-extrabold rounded-full uppercase tracking-wider shadow-xs leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>

              {/* Mega-Menu Dropdown with Visual Category Thumbnails */}
              {link.hasMega && activeDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white rounded-3xl shadow-2xl border border-[#7B3D14]/20 p-6 animate-fade-in z-50">
                  <div className="grid grid-cols-2 gap-4">
                    {link.subCategories?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-[#FCF3ED] transition-all group/item border border-transparent hover:border-[#7B3D14]/20"
                      >
                        {sub.image && (
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/15">
                            <Image
                              src={sub.image}
                              alt={sub.name}
                              fill
                              sizes="60px"
                              className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div>
                          <h6 className="text-xs font-bold text-[#341B09] group-hover/item:text-[#7B3D14] transition-colors leading-snug">
                            {sub.name}
                          </h6>
                          <p className="text-[11px] text-[#341B09]/65 mt-0.5 leading-tight">
                            {sub.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-5 pt-3.5 border-t border-[#7B3D14]/10 flex items-center justify-between text-xs text-[#7B3D14]">
                    <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59A4E]" />
                      Authentic Weaves Direct From Artisans Since 1996
                    </span>
                    <Link
                      href="/collections/all"
                      className="font-bold text-xs underline hover:text-[#341B09] transition-colors"
                    >
                      View All Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Actions (Search, Wishlist, Cart) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Desktop Search Trigger Pill */}
          <button
            onClick={openSearch}
            aria-label="Search sarees & collections"
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F8EFEA] border border-[#7B3D14]/20 text-xs text-[#341B09]/75 hover:text-[#341B09] shadow-xs transition-all hover:border-[#7B3D14] w-48 xl:w-56"
          >
            <Search className="w-3.5 h-3.5 text-[#7B3D14] shrink-0" />
            <span className="font-medium truncate whitespace-nowrap text-left text-[11px] xl:text-xs">
              Search sarees, lehengas...
            </span>
          </button>

          {/* Wishlist Link */}
          <Link
            href="/collections/all"
            aria-label="Wishlist"
            className="relative p-2 rounded-full hover:bg-white border border-transparent hover:border-[#7B3D14]/20 transition-all text-[#341B09] hover:text-[#DA3F3F] shrink-0"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#DA3F3F] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            aria-label="Shopping Bag Cart"
            className="relative p-2 rounded-full hover:bg-white border border-transparent hover:border-[#7B3D14]/20 transition-all text-[#341B09] hover:text-[#7B3D14] shrink-0"
          >
            <ShoppingBag className="w-5 h-5 text-[#7B3D14]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#7B3D14] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FCF3ED] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#7B3D14]/20">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#7B3D14]/15">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#7B3D14] flex items-center justify-center text-white">
                    <Crown className="w-4 h-4 text-[#DFB873]" />
                  </div>
                  <span className="font-serif-heading text-xl font-bold text-[#7B3D14] uppercase">
                    Shopin
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#341B09]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-base font-bold text-[#341B09] hover:text-[#7B3D14] transition-colors"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="px-2 py-0.5 bg-[#DA3F3F] text-white text-[10px] font-bold rounded">
                          {link.badge}
                        </span>
                      )}
                    </Link>

                    {link.hasMega && (
                      <div className="pl-4 py-1 space-y-2 border-l-2 border-[#7B3D14]/20 my-1">
                        {link.subCategories?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-xs font-semibold text-[#341B09]/80 hover:text-[#7B3D14] py-1"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#7B3D14]/15 text-xs text-[#341B09]/70 space-y-2">
              <p>📍 Godavarikhani, Telangana - 505209</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
