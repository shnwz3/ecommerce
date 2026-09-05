"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  X,
  Upload,
  RefreshCw,
  Sparkles,
  Edit3,
} from "lucide-react";
import { Product, Collection } from "@/lib/types";
import {
  createProductServerAction,
  updateProductServerAction,
  uploadImageServerAction,
} from "../actions";

interface ProductFormModalProps {
  product: Product | null; // null = create mode, object = edit mode
  collections: Collection[];
  adminPassword: string;
  onClose: () => void;
  onSaved: (product: Product, isEdit: boolean) => void;
  onStatusNotice: (notice: { type: "success" | "error"; message: string }) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  collections,
  adminPassword,
  onClose,
  onSaved,
  onStatusNotice,
}) => {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [category, setCategory] = useState(product?.category || "pattu-sarees");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [salePrice, setSalePrice] = useState(product?.sale_price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [galleryUrl2, setGalleryUrl2] = useState(product?.gallery_urls?.[1] || "");
  const [sizesInput, setSizesInput] = useState(product?.sizes?.join(", ") || "Free Size");
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [isBestseller, setIsBestseller] = useState(product?.is_bestseller ?? false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug when name changes (only in create mode)
  useEffect(() => {
    if (!isEdit) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [name, isEdit]);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("adminPassword", adminPassword);

      // Primary: Call robust /api/upload
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        setIsUploadingImage(false);
        return data.url;
      }

      // Secondary fallback: Server Action
      const saRes = await uploadImageServerAction(formData, adminPassword);
      if (saRes.success && saRes.url) {
        setImageUrl(saRes.url);
        setIsUploadingImage(false);
        return saRes.url;
      }

      onStatusNotice({
        type: "error",
        message: data.error || saRes.error || "Failed to upload image.",
      });
    } catch (err: any) {
      console.error("Upload exception:", err);
      // Try server action directly
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("adminPassword", adminPassword);
        const saRes = await uploadImageServerAction(formData, adminPassword);
        if (saRes.success && saRes.url) {
          setImageUrl(saRes.url);
          setIsUploadingImage(false);
          return saRes.url;
        }
      } catch {}
      onStatusNotice({
        type: "error",
        message: "Failed to upload image file. Please check connection or paste direct URL.",
      });
    } finally {
      setIsUploadingImage(false);
    }
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      onStatusNotice({ type: "success", message: "Image uploaded and active!" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = imageUrl.trim();

    // If file was selected but not uploaded yet, upload it now
    if (!finalImageUrl && selectedFile) {
      setIsSubmitting(true);
      const uploadedUrl = await uploadFile(selectedFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    if (!name.trim() || !price || !finalImageUrl) {
      setIsSubmitting(false);
      onStatusNotice({
        type: "error",
        message: "Please fill in product title, price, and select or upload an image.",
      });
      return;
    }

    setIsSubmitting(true);

    const sizesArray = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const galleryArray = [finalImageUrl];
    if (galleryUrl2.trim()) {
      galleryArray.push(galleryUrl2.trim());
    }

    const productPayload = {
      name: name.trim(),
      slug: slug.trim() || `product-${Date.now()}`,
      description: description.trim() || null,
      price: parseFloat(price),
      sale_price: salePrice ? parseFloat(salePrice) : null,
      image_url: finalImageUrl,
      gallery_urls: galleryArray,
      category,
      sizes: sizesArray.length > 0 ? sizesArray : ["Free Size"],
      in_stock: inStock,
      is_new: isNew,
      is_bestseller: isBestseller,
    };

    if (isEdit && product) {
      const res = await updateProductServerAction(product.id, productPayload, adminPassword);
      setIsSubmitting(false);

      if (res.success && res.product) {
        onSaved(res.product, true);
        onStatusNotice({ type: "success", message: `Product "${name}" updated successfully.` });
      } else {
        onStatusNotice({ type: "error", message: res.error || "Failed to update product." });
      }
    } else {
      const res = await createProductServerAction(productPayload, adminPassword);
      setIsSubmitting(false);

      if (res.success && res.product) {
        onSaved(res.product, false);
        onStatusNotice({ type: "success", message: `Product "${name}" published live.` });
      } else {
        onStatusNotice({ type: "error", message: res.error || "Failed to create product." });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FCF3ED] rounded-3xl shadow-2xl border border-[#7B3D14]/20 p-6 sm:p-8 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#7B3D14]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7B3D14] text-white flex items-center justify-center">
              {isEdit ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#341B09]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white text-[#341B09]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Product Name & Auto Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Product Title *</label>
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
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">URL Slug</label>
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
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Category *</label>
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
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Sizes (Comma Separated)</label>
              <input
                type="text"
                placeholder="Free Size or S, M, L, XL"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Regular Price (₹) *</label>
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
              <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Sale Price (₹ Optional)</label>
              <input
                type="number"
                placeholder="e.g. 1699"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="p-4 bg-white rounded-2xl border border-[#7B3D14]/15 space-y-3">
            <label className="block text-xs font-bold text-[#341B09] uppercase">Product Image *</label>
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
                    : "Click to upload image"}
                </span>
                <span className="text-[10px] text-[#341B09]/50">PNG, JPG, WebP up to 10MB</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#341B09]/70 mb-1">Or Paste Direct URL:</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#341B09]/70 mb-1">Secondary Image URL (Hover):</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={galleryUrl2}
                onChange={(e) => setGalleryUrl2(e.target.value)}
                className="w-full px-3 py-2 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
              />
            </div>
            {imageUrl && (
              <div className="flex items-center gap-3 p-2 bg-[#FCF3ED] rounded-xl border border-[#7B3D14]/15">
                <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                  <Image src={imageUrl} alt="Preview" fill sizes="50px" className="object-cover" />
                </div>
                <span className="text-xs text-emerald-800 font-semibold truncate">✓ Image preview active</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Product Description</label>
            <textarea
              rows={3}
              placeholder="Describe the weave, fabric, and occasions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#7B3D14]/20 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-[#7B3D14]/15">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-[#7B3D14]" />
              <span>In Stock</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="accent-[#7B3D14]" />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="accent-[#7B3D14]" />
              <span>Best Seller</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
                  <span>{isEdit ? "Saving..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C59A4E]" />
                  <span>{isEdit ? "Save Changes" : "Save Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
