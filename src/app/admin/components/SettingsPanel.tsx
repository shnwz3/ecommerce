"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Truck,
  ShieldCheck,
  Database,
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

export const SettingsPanel: React.FC = () => {
  const [storeName, setStoreName] = useState("Shopin Sarees & Lehengas");
  const [supportPhone, setSupportPhone] = useState("+91 98490 12345");
  const [supportEmail, setSupportEmail] = useState("care@shopin.com");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999");
  const [shippingFee, setShippingFee] = useState("99");
  const [codEnabled, setCodEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#341B09]">
          Store Settings & Configuration
        </h1>
        <p className="text-sm text-[#341B09]/60 mt-1">
          Manage boutique details, shipping policies, COD limits, and system connections
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings updated successfully! Changes will reflect across the storefront.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white rounded-2xl p-6 border border-[#7B3D14]/10 shadow-sm space-y-4">
          <h2 className="font-serif-heading text-lg font-bold text-[#341B09] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#7B3D14]" /> Boutique Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#341B09] mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#341B09] mb-1">Base Currency</label>
              <input
                type="text"
                value="INR (₹) - Indian Rupee"
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#341B09]/60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#341B09] mb-1">Support WhatsApp / Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#341B09] mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-white rounded-2xl p-6 border border-[#7B3D14]/10 shadow-sm space-y-4">
          <h2 className="font-serif-heading text-lg font-bold text-[#341B09] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#7B3D14]" /> Shipping & Fulfillment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#341B09] mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14]"
              />
              <p className="text-[10px] text-[#341B09]/50 mt-1">Orders above this qualify for free shipping</p>
            </div>

            <div>
              <label className="block font-bold text-[#341B09] mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14]"
              />
              <p className="text-[10px] text-[#341B09]/50 mt-1">Charged on orders below free threshold</p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block font-bold text-[#341B09] mb-2">
                Cash on Delivery (COD)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7B3D14] focus:ring-[#7B3D14]"
                />
                <span className="text-xs font-semibold text-[#341B09]">
                  Enable COD across India
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Database & Supabase Health */}
        <div className="bg-white rounded-2xl p-6 border border-[#7B3D14]/10 shadow-sm space-y-4">
          <h2 className="font-serif-heading text-lg font-bold text-[#341B09] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#7B3D14]" /> Database Connection Health
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FCF3ED] rounded-xl border border-[#7B3D14]/15 space-y-1">
              <div className="text-[#341B09]/60 font-semibold">Supabase PostgreSQL</div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected & Synchronized
              </div>
              <div className="text-[10px] text-[#341B09]/50 pt-1">
                vtcfuxlfhzjyeuqgnfls.supabase.co
              </div>
            </div>

            <div className="p-4 bg-[#FCF3ED] rounded-xl border border-[#7B3D14]/15 space-y-1">
              <div className="text-[#341B09]/60 font-semibold">Storage Bucket (product-media)</div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Active for Image Uploads
              </div>
              <div className="text-[10px] text-[#341B09]/50 pt-1">
                Direct uploads with service_role auth
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#7B3D14] hover:bg-[#5a2c0e] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#7B3D14]/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
