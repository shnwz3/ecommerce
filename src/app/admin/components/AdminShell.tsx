"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Product, Collection, Banner, Order, Customer, Coupon, AdminNotification, AdminSection } from "@/lib/types";
import { verifyAdminPassword } from "../actions";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ProductsManager } from "./ProductsManager";
import { CollectionsManager } from "./CollectionsManager";
import { BannersManager } from "./BannersManager";
import { OrdersManager } from "./OrdersManager";
import { SettingsPanel } from "./SettingsPanel";

interface AdminShellProps {
  initialProducts: Product[];
  collections: Collection[];
  initialBanners: Banner[];
}

export const AdminShell: React.FC<AdminShellProps> = ({
  initialProducts,
  collections: initialCollections,
  initialBanners,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Navigation State - Products as primary workspace
  const [activeSection, setActiveSection] = useState<AdminSection>("products");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Entities State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [orders, setOrders] = useState<Order[]>([]);

  // Toast / Status notification
  const [statusNotice, setStatusNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync props if changed
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  useEffect(() => {
    setBanners(initialBanners);
  }, [initialBanners]);

  // Check existing session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("shopin_admin_pwd");
    if (savedAuth) {
      setAdminPassword(savedAuth);
      setIsAuthenticated(true);
    }
  }, []);

  // Real-time Orders Poller: Syncs live orders placed on the storefront every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchLiveOrders = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders) && isMounted) {
          setOrders((prev) => {
            if (data.orders.length > prev.length && prev.length > 0) {
              const newest = data.orders[0];
              setStatusNotice({
                type: "success",
                message: `🎉 New Order Received! #${newest.order_number} by ${newest.customer_name} (₹${newest.total.toLocaleString("en-IN")})`,
              });
            }
            return data.orders;
          });
        }
      } catch (e) {
        // silent polling
      }
    };

    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      setStatusNotice({ type: "success", message: `Order status updated to ${status}.` });
    } catch {
      setStatusNotice({ type: "error", message: "Failed to update order status." });
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    payment_status: NonNullable<Order["payment_status"]>
  ) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, payment_status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, payment_status } : o)));
      setStatusNotice({ type: "success", message: "Payment verified and marked as received." });
    } catch {
      setStatusNotice({ type: "error", message: "Failed to update payment status." });
    }
  };

  // Dismiss toast after 4s
  useEffect(() => {
    if (statusNotice) {
      const timer = setTimeout(() => setStatusNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusNotice]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setAuthError("Please enter your admin password.");
      return;
    }

    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await verifyAdminPassword(adminPassword);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("shopin_admin_pwd", adminPassword);
      } else {
        setAuthError(res.message || "Invalid admin password.");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("shopin_admin_pwd");
    setIsAuthenticated(false);
    setAdminPassword("");
  };

  // ─── LOGIN GATE SCREEN ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "radial-gradient(ellipse at top, #4A2810 0%, #341B09 50%, #1A0E05 100%)",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C59A4E]/30 space-y-6 animate-fade-in relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C59A4E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 relative">
            <div className="w-14 h-14 bg-[#7B3D14] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#7B3D14]/30">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B3D14] bg-[#FCF3ED] px-3 py-1 rounded-full inline-block">
              Shopin Boutique Management
            </span>
            <h1 className="font-serif-heading text-3xl font-bold text-[#341B09]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#341B09]/70 leading-relaxed">
              Enter your store management password to access live inventory, orders, analytics, and creative controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#341B09] uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/20 text-[#341B09] text-sm focus:outline-none focus:border-[#7B3D14] focus:bg-white shadow-sm transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#7B3D14] hover:bg-[#5a2c0e] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#7B3D14]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                "Authenticating..."
              ) : (
                <>
                  Access Store Control <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#7B3D14]/10 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[#7B3D14] hover:text-[#5a2c0e] transition-colors"
            >
              ← Back to Shopin Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED ADMIN DASHBOARD ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          productCount={products.length}
          orderCount={orders.filter((o) => o.status === "pending" || o.status === "processing").length}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-[260px] shadow-2xl z-50 animate-fade-in">
            <Sidebar
              activeSection={activeSection}
              onSectionChange={(s) => {
                setActiveSection(s);
                setMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              productCount={products.length}
              orderCount={orders.filter((o) => o.status === "pending" || o.status === "processing").length}
            />
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        <TopBar
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Global Toast Notice */}
        {statusNotice && (
          <div className="fixed top-20 right-6 z-50 max-w-md animate-fade-in">
            <div
              className={`p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold border ${
                statusNotice.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-red-50 text-red-900 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusNotice.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusNotice.message}</span>
              </div>
              <button
                onClick={() => setStatusNotice(null)}
                className="text-[#341B09]/40 hover:text-[#341B09]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Section Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeSection === "products" && (
            <ProductsManager
              products={products}
              collections={collections}
              adminPassword={adminPassword}
              onProductsChange={setProducts}
              onStatusNotice={setStatusNotice}
            />
          )}

          {activeSection === "orders" && (
            <OrdersManager
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
            />
          )}

          {activeSection === "collections" && (
            <CollectionsManager
              collections={collections}
              products={products}
              adminPassword={adminPassword}
              onCollectionsChange={setCollections}
              onStatusNotice={setStatusNotice}
            />
          )}

          {activeSection === "banners" && (
            <BannersManager
              banners={banners}
              adminPassword={adminPassword}
              onBannersChange={setBanners}
              onStatusNotice={setStatusNotice}
            />
          )}

          {activeSection === "settings" && (
            <SettingsPanel />
          )}
        </main>
      </div>
    </div>
  );
};
