"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { openCart, cartCount, wishlist } = useStore();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/collections/all", icon: Grid },
    {
      name: "Wishlist",
      href: "/collections/all",
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : null,
    },
    {
      name: "Cart",
      onClick: openCart,
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/?text=Hi%20Shopin%20Showroom,%20I%20would%20like%20to%20inquire%20about%20sarees",
      icon: MessageCircle,
      external: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#FCF3ED]/95 backdrop-blur-md border-t border-[#7B3D14]/20 py-1.5 px-3 lg:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center p-1.5 text-xs text-[#341B09] hover:text-[#7B3D14] transition-colors relative"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-[#7B3D14] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.name}</span>
              </button>
            );
          }

          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-1.5 text-xs text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.name}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`flex flex-col items-center justify-center p-1.5 text-xs transition-colors relative ${
                isActive ? "text-[#7B3D14] font-bold" : "text-[#341B09] hover:text-[#7B3D14]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#DA3F3F] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
