"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Edit3,
  Trash2,
  Plus,
  Save,
  X,
  Upload,
  MapPin,
} from "lucide-react";
import { Banner } from "@/lib/types";
import {
  updateBannerServerAction,
  deleteBannerServerAction,
  uploadImageServerAction,
} from "../actions";

interface BannersManagerProps {
  banners: Banner[];
  adminPassword: string;
  onBannersChange: (banners: Banner[]) => void;
  onStatusNotice: (notice: { type: "success" | "error"; message: string }) => void;
}

const POSITION_LABELS: Record<string, string> = {
  hero: "🎠 Hero Slider",
  "promo-1": "📢 Promo Left",
  "promo-2": "📢 Promo Right",
  "full-promo": "🖼️ Full-Width Promo",
  "price-1": "💰 Shop by Price #1",
  "price-2": "💰 Shop by Price #2",
  "price-3": "💰 Shop by Price #3",
  "price-4": "💰 Shop by Price #4",
};

export const BannersManager: React.FC<BannersManagerProps> = ({
  banners,
  adminPassword,
  onBannersChange,
  onStatusNotice,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Banner>>({});
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setEditForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      cta_text: banner.cta_text || "",
      link_url: banner.link_url || "",
      image_url: banner.image_url,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (bannerId: string) => {
    const res = await updateBannerServerAction(bannerId, editForm, adminPassword);
    if (res.success) {
      onBannersChange(banners.map((b) => (b.id === bannerId ? { ...b, ...editForm } : b)));
      onStatusNotice({ type: "success", message: "Banner updated successfully!" });
      setEditingId(null);
    } else {
      onStatusNotice({ type: "error", message: res.error || "Failed to update banner." });
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    const res = await deleteBannerServerAction(bannerToDelete.id, adminPassword);
    if (res.success) {
      onBannersChange(banners.filter((b) => b.id !== bannerToDelete.id));
      onStatusNotice({ type: "success", message: `Deleted banner "${bannerToDelete.title}".` });
    } else {
      onStatusNotice({ type: "error", message: res.error || "Failed to delete banner." });
    }
    setBannerToDelete(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImageServerAction(formData, adminPassword);
    setIsUploadingImage(false);
    if (res.success && res.url) {
      setEditForm((prev) => ({ ...prev, image_url: res.url }));
      onStatusNotice({ type: "success", message: "Banner image uploaded!" });
    } else {
      onStatusNotice({ type: "error", message: res.error || "Upload failed." });
    }
  };

  // Group banners by position
  const grouped = banners.reduce<Record<string, Banner[]>>((acc, b) => {
    const key = b.position;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#341B09]">Banners & Promos</h2>
        <p className="text-sm text-[#341B09]/60 mt-0.5">
          Manage homepage hero slides, promotional banners, and feature images.
        </p>
      </div>

      {/* Position Map */}
      <div className="bg-white rounded-2xl p-5 border border-[#7B3D14]/10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#7B3D14]" />
          <h3 className="font-bold text-sm text-[#341B09]">Banner Positions on Homepage</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(POSITION_LABELS).map(([key, label]) => {
            const count = grouped[key]?.length || 0;
            return (
              <span
                key={key}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                  count > 0
                    ? "bg-[#7B3D14]/10 text-[#7B3D14] border border-[#7B3D14]/15"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {label} ({count})
              </span>
            );
          })}
        </div>
      </div>

      {/* Banner Cards by Position */}
      {Object.entries(grouped).map(([position, positionBanners]) => (
        <div key={position} className="space-y-4">
          <h3 className="font-bold text-sm text-[#341B09] flex items-center gap-2">
            {POSITION_LABELS[position] || position}
            <span className="px-2 py-0.5 bg-[#FCF3ED] rounded-full text-[10px] font-bold text-[#7B3D14]">
              {positionBanners.length} slide{positionBanners.length > 1 ? "s" : ""}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positionBanners.map((banner) => {
              const isEditing = editingId === banner.id;
              return (
                <div
                  key={banner.id}
                  className={`rounded-2xl border overflow-hidden bg-white shadow-sm transition-all ${
                    isEditing ? "border-[#7B3D14] ring-2 ring-[#7B3D14]/20" : "border-[#7B3D14]/10"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-[#F8EFEA]">
                    <Image
                      src={isEditing ? (editForm.image_url || banner.image_url) : banner.image_url}
                      alt={banner.title || "Banner"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#341B09]/80 text-white text-[9px] font-bold uppercase rounded">
                      {banner.position} #{banner.sort_order}
                    </span>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-[#7B3D14] cursor-pointer hover:bg-white transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        {isUploadingImage ? "Uploading..." : "Replace Image"}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Banner Title"
                          className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-lg border border-[#7B3D14]/15 text-xs font-bold text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                        />
                        <input
                          type="text"
                          value={editForm.subtitle || ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Subtitle"
                          className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-lg border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editForm.link_url || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, link_url: e.target.value }))}
                            placeholder="Link URL"
                            className="px-3 py-2 bg-[#FCF3ED]/40 rounded-lg border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                          />
                          <input
                            type="text"
                            value={editForm.cta_text || ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, cta_text: e.target.value }))}
                            placeholder="CTA Button Text"
                            className="px-3 py-2 bg-[#FCF3ED]/40 rounded-lg border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleSave(banner.id)}
                            className="flex-1 py-2 bg-[#7B3D14] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-2 bg-gray-100 text-[#341B09] rounded-lg text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-bold text-sm text-[#341B09]">{banner.title || "Untitled Banner"}</h4>
                        <p className="text-xs text-[#341B09]/60">{banner.subtitle}</p>
                        <div className="text-[10px] text-[#7B3D14] font-semibold">
                          Link: {banner.link_url} • CTA: {banner.cta_text}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => startEdit(banner)}
                            className="flex-1 py-2 bg-[#FCF3ED] hover:bg-[#F0E4DA] rounded-lg text-xs font-bold text-[#7B3D14] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setBannerToDelete({ id: banner.id, title: banner.title || "banner" })}
                            className="py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Delete Confirmation */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-lg text-[#341B09]">Delete Banner?</h3>
              <p className="text-xs text-[#341B09]/70">This banner will be removed from the homepage.</p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setBannerToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
