"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Package,
  Layers,
  ShoppingBag,
  RefreshCw,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Product, Collection, Banner } from "@/lib/types";
import {
  verifyAdminPassword,
  createProductServerAction,
  deleteProductServerAction,
  uploadImageServerAction,
  updateBannerServerAction,
} from "./actions";

interface AdminDashboardProps {
  initialProducts: Product[];
  collections: Collection[];
  initialBanners: Banner[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialProducts,
  collections,
  initialBanners,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"products" | "banners" | "orders">("products");

  // Products State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("pattu-sarees");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrl2, setGalleryUrl2] = useState("");
  const [sizesInput, setSizesInput] = useState("Free Size");
  const [inStock, setInStock] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Auto-generate slug when name changes
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  }, [name]);

  // Check saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("shopin_admin_auth");
    if (saved) {
      setPasswordInput(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");

    const res = await verifyAdminPassword(passwordInput);
    setIsVerifying(false);

    if (res.success) {
      setIsAuthenticated(true);
      sessionStorage.setItem("shopin_admin_auth", passwordInput);
    } else {
      setAuthError(res.message || "Invalid password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("shopin_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageServerAction(formData, passwordInput);
    setIsUploadingImage(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
      setStatusNotice({ type: "success", message: "Image uploaded to Supabase Storage!" });
    } else {
      // Create a local blob preview if cloud upload fails
      const localBlob = URL.createObjectURL(file);
      setImageUrl(localBlob);
      setStatusNotice({
        type: "error",
        message: res.error || "Storage upload issue. Using local preview.",
      });
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) {
      setStatusNotice({ type: "error", message: "Please fill in product name, price, and image." });
      return;
    }

    setIsSubmitting(true);
    setStatusNotice(null);

    const sizesArray = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const galleryArray = [imageUrl];
    if (galleryUrl2.trim()) {
      galleryArray.push(galleryUrl2.trim());
    }

    const productPayload: Omit<Product, "id"> = {
      name,
      slug: slug || `product-${Date.now()}`,
      description: description || null,
      price: parseFloat(price),
      sale_price: salePrice ? parseFloat(salePrice) : null,
      image_url: imageUrl,
      gallery_urls: galleryArray,
      category,
      sizes: sizesArray.length > 0 ? sizesArray : ["Free Size"],
      in_stock: inStock,
      is_new: isNew,
      is_bestseller: isBestseller,
    };

    const res = await createProductServerAction(productPayload, passwordInput);
    setIsSubmitting(false);

    if (res.success && res.product) {
      setProducts((prev) => [res.product!, ...prev]);
      setStatusNotice({
        type: "success",
        message: `✨ Product "${name}" published live! It now appears on the storefront.`,
      });
      setIsAddModalOpen(false);

      // Reset form
      setName("");
      setSlug("");
      setPrice("");
      setSalePrice("");
      setDescription("");
      setImageUrl("");
      setGalleryUrl2("");
      setSelectedFile(null);
    } else {
      setStatusNotice({ type: "error", message: res.error || "Failed to create product." });
    }
  };

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    setProductToDelete(null);

    const res = await deleteProductServerAction(id, passwordInput);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setStatusNotice({ type: "success", message: `Deleted "${name}".` });
    } else {
      setStatusNotice({ type: "error", message: res.error || "Failed to delete product." });
    }
  };

  // 1. Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#341B09] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FCF3ED] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C59A4E]/30 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#7B3D14] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif-heading text-3xl font-bold text-[#341B09]">
              Shopin Admin Portal
            </h1>
            <p className="text-xs text-[#341B09]/70">
              Enter store admin password to access live product management & uploads.
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
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#7B3D14]/20 text-[#341B09] text-sm focus:outline-none focus:border-[#7B3D14] shadow-sm"
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
              className="w-full py-3.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#7B3D14] hover:underline font-semibold flex items-center justify-center gap-1"
            >
              ← Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FCF3ED] text-[#341B09]">
      {/* Top Admin Navigation Bar */}
      <header className="bg-white border-b border-[#7B3D14]/15 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-serif-heading text-xl sm:text-2xl font-bold text-[#7B3D14]">
                Shopin Admin
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#341B09]/60 font-semibold">
                Live Storefront Control Panel
              </span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
              ● Live Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCF3ED] hover:bg-[#F8EFEA] border border-[#7B3D14]/20 text-xs font-semibold text-[#7B3D14] transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-[#341B09]/70 hover:text-red-600 font-medium px-2 py-1 transition-colors"
            >
              Lock / Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Status Notice Banner */}
        {statusNotice && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in ${
              statusNotice.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-red-50 border border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              {statusNotice.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{statusNotice.message}</span>
            </div>
            <button
              onClick={() => setStatusNotice(null)}
              className="p-1 hover:bg-black/5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-[#7B3D14]/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FCF3ED] border border-[#7B3D14]/20 text-[#7B3D14] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#341B09]/60 font-semibold uppercase tracking-wider">
                Total Products
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#341B09]">
                {products.length} Items
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#7B3D14]/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FCF3ED] border border-[#7B3D14]/20 text-[#7B3D14] flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#341B09]/60 font-semibold uppercase tracking-wider">
                Categories
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#341B09]">
                {collections.length} Collections
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#7B3D14]/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FCF3ED] border border-[#7B3D14]/20 text-[#7B3D14] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#341B09]/60 font-semibold uppercase tracking-wider">
                Active Banners
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#341B09]">
                {initialBanners.length} Live Slides
              </h3>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7B3D14]/15 pb-4">
          <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-[#7B3D14]/20 shadow-sm">
            <button
              onClick={() => setActiveTab("products")}
              data-tab="products"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "products"
                  ? "bg-[#7B3D14] text-white shadow-sm"
                  : "text-[#341B09] hover:text-[#7B3D14]"
              }`}
            >
              📦 Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("banners")}
              data-tab="banners"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "banners"
                  ? "bg-[#7B3D14] text-white shadow-sm"
                  : "text-[#341B09] hover:text-[#7B3D14]"
              }`}
            >
              🖼️ Hero & Promo Banners
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              data-tab="orders"
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-[#7B3D14] text-white shadow-sm"
                  : "text-[#341B09] hover:text-[#7B3D14]"
              }`}
            >
              🛍️ Orders (Demo View)
            </button>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product Live</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRODUCTS TABLE */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-[#7B3D14]/15 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#7B3D14]/10 flex justify-between items-center">
              <div>
                <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">
                  Storefront Product Inventory
                </h3>
                <p className="text-xs text-[#341B09]/60 mt-0.5">
                  Products added here appear live on the storefront immediately without a redeploy.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF3ED] text-[#341B09] uppercase tracking-wider font-bold border-b border-[#7B3D14]/10">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Sizes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7B3D14]/10 text-[#341B09]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FCF3ED]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/15">
                            <Image src={prod.image_url} alt={prod.name} fill sizes="50px" className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#341B09] line-clamp-1">{prod.name}</h4>
                            <span className="text-[11px] text-[#341B09]/50 font-mono">{prod.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 capitalize font-medium">
                        {prod.category.replace("-", " ")}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#7B3D14]">
                          ₹{(prod.sale_price || prod.price).toLocaleString("en-IN")}
                        </div>
                        {prod.sale_price && (
                          <div className="text-[10px] text-[#341B09]/50 line-through">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-[#FCF3ED] rounded-md text-[11px] font-medium border border-[#7B3D14]/15">
                          {prod.sizes?.join(", ") || "Free Size"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {prod.in_stock ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-bold text-[10px]">
                              Sold Out
                            </span>
                          )}
                          {prod.is_bestseller && (
                            <span className="px-1.5 py-0.5 bg-[#7B3D14] text-white rounded font-bold text-[9px]">
                              BESTSELLER
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-[#FCF3ED] text-[#7B3D14]"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setProductToDelete({ id: prod.id, name: prod.name })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BANNERS MANAGEMENT */}
        {activeTab === "banners" && (
          <div className="bg-white rounded-3xl border border-[#7B3D14]/15 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">
                Homepage Banners & Hero Slider
              </h3>
              <p className="text-xs text-[#341B09]/60 mt-0.5">
                Manage hero slider slides, promo banners, and special offers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="rounded-2xl border border-[#7B3D14]/15 overflow-hidden bg-[#FCF3ED]/30 p-4 space-y-3"
                >
                  <div className="relative h-44 rounded-xl overflow-hidden bg-[#F8EFEA] border border-[#7B3D14]/15">
                    <Image src={banner.image_url} alt={banner.title || "Banner"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#341B09]/80 text-[#FCF3ED] text-[10px] font-bold uppercase rounded">
                      Position: {banner.position}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#341B09]">{banner.title}</h4>
                    <p className="text-xs text-[#341B09]/70">{banner.subtitle}</p>
                    <div className="text-[11px] text-[#7B3D14] font-semibold mt-1">
                      Link: {banner.link_url} • CTA: {banner.cta_text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MOCK ORDERS GESTURE */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-[#7B3D14]/15 shadow-sm p-6 space-y-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Simulated Sample Data (Client Pitch Demonstration)
                  </h4>
                  <p className="text-[11px] text-amber-800/80">
                    These entries are sample mock orders demonstrating the future order fulfillment and customer management module.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-200/80 text-amber-900 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                Sample Preview Only
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF3ED] text-[#341B09] font-bold border-b border-[#7B3D14]/10">
                  <tr>
                    <th className="p-3">Sample Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7B3D14]/10">
                  <tr className="hover:bg-[#FCF3ED]/30">
                    <td className="p-3 font-mono font-bold text-[#7B3D14]">#DEMO-8921</td>
                    <td className="p-3">Priya Sharma</td>
                    <td className="p-3">Royal Banarasi Silk Saree</td>
                    <td className="p-3 font-bold">₹1,699</td>
                    <td className="p-3">Hyderabad, TG</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">Sample Dispatched</span></td>
                  </tr>
                  <tr className="hover:bg-[#FCF3ED]/30">
                    <td className="p-3 font-mono font-bold text-[#7B3D14]">#DEMO-8920</td>
                    <td className="p-3">Ananya Reddy</td>
                    <td className="p-3">Maroon Velvet Bridal Lehenga</td>
                    <td className="p-3 font-bold">₹4,999</td>
                    <td className="p-3">Bengaluru, KA</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">Sample Delivered</span></td>
                  </tr>
                  <tr className="hover:bg-[#FCF3ED]/30">
                    <td className="p-3 font-mono font-bold text-[#7B3D14]">#DEMO-8919</td>
                    <td className="p-3">Kavitha Rao</td>
                    <td className="p-3">Heavy Hand-Work Zardozi Saree</td>
                    <td className="p-3 font-bold">₹1,899</td>
                    <td className="p-3">Godavarikhani, TG</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">Sample Processing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">
                Delete Product?
              </h3>
              <p className="text-xs text-[#341B09]/70">
                Are you sure you want to remove <strong className="text-red-700">"{productToDelete.name}"</strong>? It will be removed live from the catalog.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#341B09] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD PRODUCT MODAL DRAWER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#FCF3ED] rounded-3xl shadow-2xl border border-[#7B3D14]/20 p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#7B3D14]/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#7B3D14] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#341B09]">
                  Add Product Live to Storefront
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white text-[#341B09]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              {/* Product Name & Auto Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Banarasi Zari Saree"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    URL Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 rounded-xl border border-[#7B3D14]/20 text-xs font-mono text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>
              </div>

              {/* Category & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs font-semibold text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  >
                    <option value="pattu-sarees">Pattu Sarees</option>
                    <option value="fancy-sarees">Fancy Sarees</option>
                    <option value="designer-sarees">Designer Sarees</option>
                    <option value="work-sarees">Work Sarees</option>
                    <option value="lehengas">Lehengas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    Sizes / Options (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Free Size or S, M, L, XL"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>
              </div>

              {/* Pricing (Regular & Sale) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                    Sale Price (₹ Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1699 (leaves discounted badge)"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & URL PASTE (Dual-Mode for Pitch Reliability) */}
              <div className="p-4 bg-white rounded-2xl border border-[#7B3D14]/15 space-y-3">
                <label className="block text-xs font-bold text-[#341B09] uppercase">
                  Product Image * (File Upload or Direct URL)
                </label>

                {/* Drag and Drop File Input */}
                <div className="border-2 border-dashed border-[#7B3D14]/30 rounded-xl p-4 text-center hover:bg-[#FCF3ED]/50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <Upload className="w-5 h-5 text-[#7B3D14]" />
                    <span className="text-xs font-semibold text-[#341B09]">
                      {isUploadingImage
                        ? "Uploading to Supabase Storage..."
                        : selectedFile
                        ? selectedFile.name
                        : "Click to upload image to Supabase Storage"}
                    </span>
                    <span className="text-[10px] text-[#341B09]/50">PNG, JPG, WebP up to 10MB</span>
                  </div>
                </div>

                {/* Fallback Direct Image URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#341B09]/70 mb-1">
                    Or Paste Direct Image URL (Pitch Safe Fallback):
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>

                {/* Secondary Image URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#341B09]/70 mb-1">
                    Secondary Image URL (for Hover Crossfade):
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={galleryUrl2}
                    onChange={(e) => setGalleryUrl2(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                </div>

                {/* Live Image Preview */}
                {imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-[#FCF3ED] rounded-xl border border-[#7B3D14]/15">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image src={imageUrl} alt="Preview" fill sizes="50px" className="object-cover" />
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold truncate">
                      ✓ Image preview active
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the weave, fabric, and occasions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                />
              </div>

              {/* Toggles (In Stock, New Arrival, Best Seller) */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-[#7B3D14]/15">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="accent-[#7B3D14]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-[#7B3D14]"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-[#7B3D14]"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#7B3D14]/20 text-xs font-bold text-[#341B09] hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing Live...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C59A4E]" />
                      <span>Publish to Storefront</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
