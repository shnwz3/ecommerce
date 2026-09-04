"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Menu } from "lucide-react";

interface TopBarProps {
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
  sidebarCollapsed?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onLogout,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#7B3D14]/10">
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle + Store title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-[#FCF3ED] text-[#341B09] transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#341B09] tracking-tight">
              Shopin Store Admin
            </h1>
            <p className="text-[11px] text-[#341B09]/50 hidden sm:block">
              Catalog, Orders & Content Management
            </p>
          </div>
        </div>

        {/* Right: Functional actions only: View Storefront & Logout */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FCF3ED] hover:bg-[#F0E4DA] border border-[#7B3D14]/15 text-xs font-semibold text-[#7B3D14] transition-colors"
          >
            <span>View Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 text-[#341B09]/60 hover:text-red-700 border border-transparent hover:border-red-200 text-xs font-medium transition-all"
            title="Log Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
