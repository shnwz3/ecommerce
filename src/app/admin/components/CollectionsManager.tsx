"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  FolderOpen,
  Save,
  X,
  Upload,
  Package,
} from "lucide-react";
import { Collection, Product } from "@/lib/types";
import {
  createCollectionServerAction,
  deleteCollectionServerAction,
  updateCollectionServerAction,
  uploadImageServerAction,
} from "../actions";

interface CollectionsManagerProps {
  collections: Collection[];
  products: Product[];
  adminPassword: string;
  onCollectionsChange: (collections: Collection[]) => void;
  onStatusNotice: (notice: { type: "success" | "error"; message: string }) => void;
}

export const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  collections,
  products,
  adminPassword,
  onCollectionsChange,
  onStatusNotice,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  const getProductCount = (slug: string) => products.filter((p) => p.category === slug).length;

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("");
  };

  const startEdit = (col: Collection) => {
    setEditingId(col.id);
    setFormName(col.name);
    setFormSlug(col.slug);
    setFormDescription(col.description || "");
    setFormImageUrl(col.image_url || "");
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formSlug) {
      onStatusNotice({ type: "error", message: "Name and slug are required." });
      return;
    }

    if (editingId) {
      const res = await updateCollectionServerAction(
        editingId,
        { name: formName, slug: formSlug, description: formDescription, image_url: formImageUrl },
        adminPassword
      );
      if (res.success) {
        onCollectionsChange(
          collections.map((c) =>
            c.id === editingId
              ? { ...c, name: formName, slug: formSlug, description: formDescription, image_url: formImageUrl }
              : c
          )
        );
        onStatusNotice({ type: "success", message: `Updated "${formName}" collection.` });
      } else {
        onStatusNotice({ type: "error", message: res.error || "Failed to update." });
      }
    } else {
      const res = await createCollectionServerAction(
        { name: formName, slug: formSlug, description: formDescription, image_url: formImageUrl },
        adminPassword
      );
      if (res.success && res.collection) {
        onCollectionsChange([...collections, res.collection]);
        onStatusNotice({ type: "success", message: `Created "${formName}" collection!` });
      } else {
        onStatusNotice({ type: "error", message: res.error || "Failed to create." });
      }
    }

    setIsAddOpen(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;
    const res = await deleteCollectionServerAction(collectionToDelete.id, adminPassword);
    if (res.success) {
      onCollectionsChange(collections.filter((c) => c.id !== collectionToDelete.id));
      onStatusNotice({ type: "success", message: `Deleted "${collectionToDelete.name}".` });
    } else {
      onStatusNotice({ type: "error", message: res.error || "Failed to delete." });
    }
    setCollectionToDelete(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImageServerAction(formData, adminPassword);
    if (res.success && res.url) {
      setFormImageUrl(res.url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#341B09]">Collections</h2>
          <p className="text-sm text-[#341B09]/60 mt-0.5">Manage product categories and collection pages.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setIsAddOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-2xl border border-[#7B3D14]/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-36 bg-[#FCF3ED]">
              {col.image_url ? (
                <Image src={col.image_url} alt={col.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen className="w-10 h-10 text-[#7B3D14]/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#341B09]">{col.name}</h4>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FCF3ED] rounded-full text-[10px] font-bold text-[#7B3D14]">
                  <Package className="w-3 h-3" /> {getProductCount(col.slug)}
                </span>
              </div>
              <p className="text-[11px] text-[#341B09]/50 font-mono">/{col.slug}</p>
              {col.description && (
                <p className="text-xs text-[#341B09]/60 line-clamp-2">{col.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => startEdit(col)}
                  className="flex-1 py-2 bg-[#FCF3ED] hover:bg-[#F0E4DA] rounded-lg text-xs font-bold text-[#7B3D14] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setCollectionToDelete({ id: col.id, name: col.name })}
                  className="py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#7B3D14]/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#341B09]">{editingId ? "Edit Collection" : "Add Collection"}</h3>
              <button onClick={() => { setIsAddOpen(false); setEditingId(null); resetForm(); }} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingId) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Slug *</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/15 text-xs font-mono text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#341B09] uppercase mb-1">Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Paste URL or upload..."
                    className="flex-1 px-3.5 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-[#7B3D14]/15 text-xs text-[#341B09] focus:outline-none focus:border-[#7B3D14]"
                  />
                  <label className="px-3 py-2.5 bg-[#7B3D14] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#632f0e] flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formImageUrl && (
                  <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden bg-[#FCF3ED]">
                    <Image src={formImageUrl} alt="Preview" fill sizes="100vw" className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => { setIsAddOpen(false); setEditingId(null); resetForm(); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#7B3D14] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> {editingId ? "Save Changes" : "Create Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {collectionToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6" /></div>
              <h3 className="font-bold text-lg text-[#341B09]">Delete &quot;{collectionToDelete.name}&quot;?</h3>
              <p className="text-xs text-[#341B09]/70">Products in this collection won&apos;t be deleted, but the collection page will be removed.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCollectionToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
