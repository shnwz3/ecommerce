"use client";

import React from "react";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AdminSection } from "@/lib/types";

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  productCount: number;
  orderCount: number;
}

const NAV_ITEMS: { section: AdminSection; label: string; icon: React.ElementType; badge?: string }[] = [
  { section: "products", label: "Products", icon: Package },
  { section: "orders", label: "Orders & Payments", icon: ShoppingBag },
  { section: "collections", label: "Collections", icon: FolderOpen },
  { section: "banners", label: "Banners", icon: ImageIcon },
  { section: "settings", label: "Settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
  productCount,
  orderCount,
}) => {
  const getBadge = (section: AdminSection): string | null => {
    if (section === "products" && productCount > 0) return String(productCount);
    if (section === "orders" && orderCount > 0) return String(orderCount);
    return null;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ background: "linear-gradient(180deg, #1a0e06 0%, #341B09 40%, #2a1507 100%)" }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C59A4E] to-[#7B3D14] flex items-center justify-center shrink-0 shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">Shopin</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.section;
          const badge = getBadge(item.section);
          const Icon = item.icon;

          return (
            <button
              key={item.section}
              onClick={() => onSectionChange(item.section)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#7B3D14] text-white shadow-lg shadow-[#7B3D14]/30"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-[#C59A4E]/20 text-[#C59A4E]"
                    }`}>
                      {badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C59A4E] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {Number(badge) > 9 ? "9+" : badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-xs"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

      </div>
    </aside>
  );
};
