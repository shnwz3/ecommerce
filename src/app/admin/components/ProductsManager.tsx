"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Filter,
  Package,
  Edit3,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import { Product, Collection } from "@/lib/types";
import { deleteProductServerAction, updateProductServerAction } from "../actions";
import { ProductFormModal } from "./ProductFormModal";

interface ProductsManagerProps {
  products: Product[];
  collections: Collection[];
  adminPassword: string;
  onProductsChange: (products: Product[]) => void;
  onStatusNotice: (notice: { type: "success" | "error"; message: string }) => void;
}

type ProductFilter = "all" | "in-stock" | "out-of-stock" | "bestsellers" | "new-arrivals" | "on-sale";

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  collections,
  adminPassword,
  onProductsChange,
  onStatusNotice,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name">("newest");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filters: { key: ProductFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: products.length },
    { key: "in-stock", label: "In Stock", count: products.filter((p) => p.in_stock).length },
    { key: "out-of-stock", label: "Out of Stock", count: products.filter((p) => !p.in_stock).length },
    { key: "bestsellers", label: "Bestsellers", count: products.filter((p) => p.is_bestseller).length },
    { key: "new-arrivals", label: "New Arrivals", count: products.filter((p) => p.is_new).length },
    { key: "on-sale", label: "On Sale", count: products.filter((p) => p.sale_price !== null && p.sale_price !== undefined).length },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (activeFilter) {
      case "in-stock":
        result = result.filter((p) => p.in_stock);
        break;
      case "out-of-stock":
        result = result.filter((p) => !p.in_stock);
        break;
      case "bestsellers":
        result = result.filter((p) => p.is_bestseller);
        break;
      case "new-arrivals":
        result = result.filter((p) => p.is_new);
        break;
      case "on-sale":
        result = result.filter((p) => p.sale_price !== null && p.sale_price !== undefined);
        break;
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [products, searchQuery, activeFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    setProductToDelete(null);

    const res = await deleteProductServerAction(id, adminPassword);
    if (res.success) {
      onProductsChange(products.filter((p) => p.id !== id));
      onStatusNotice({ type: "success", message: `Deleted "${name}".` });
    } else {
      onStatusNotice({ type: "error", message: res.error || "Failed to delete product." });
    }
  };

  const handleToggleField = async (product: Product, field: "in_stock" | "is_bestseller" | "is_new") => {
    const newValue = !product[field];
    const res = await updateProductServerAction(product.id, { [field]: newValue }, adminPassword);
    if (res.success) {
      onProductsChange(products.map((p) => (p.id === product.id ? { ...p, [field]: newValue } : p)));
      const fieldLabel = field === "in_stock" ? "stock status" : field === "is_bestseller" ? "bestseller" : "new arrival";
      onStatusNotice({ type: "success", message: `Updated ${fieldLabel} for "${product.name}".` });
    } else {
      onStatusNotice({ type: "error", message: res.error || "Failed to update." });
    }
  };

  const handleProductSaved = (product: Product, isEdit: boolean) => {
    if (isEdit) {
      onProductsChange(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      onProductsChange([product, ...products]);
    }
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#341B09]">Products</h2>
          <p className="text-sm text-[#341B09]/60 mt-0.5">
            Manage your storefront product catalog. Products appear live immediately.
          </p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsAddModalOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl text-xs font-bold tracking-wide shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search + Filters Bar */}
      <div className="bg-white rounded-2xl border border-[#7B3D14]/10 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#341B09]/30" />
            <input
              type="text"
              placeholder="Search by name, slug, or category..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-transparent focus:border-[#7B3D14]/20 focus:bg-white text-xs text-[#341B09] placeholder:text-[#341B09]/40 outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-[#FCF3ED]/40 rounded-xl border border-transparent focus:border-[#7B3D14]/20 text-xs font-semibold text-[#341B09] outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#341B09]/40 pointer-events-none" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-[#341B09]/40 shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                activeFilter === f.key
                  ? "bg-[#7B3D14] text-white shadow-sm"
                  : "bg-[#FCF3ED]/60 text-[#341B09]/60 hover:bg-[#FCF3ED] hover:text-[#341B09]"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#7B3D14]/10 shadow-sm overflow-hidden">
        {/* Table Header Summary */}
        <div className="px-5 py-3 border-b border-[#7B3D14]/8 flex items-center justify-between text-[11px] text-[#341B09]/50">
          <span>
            Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filteredProducts.length)} of {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-transparent font-bold text-[#341B09] outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FCF3ED] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#7B3D14]/40" />
            </div>
            <h4 className="font-bold text-sm text-[#341B09]">
              {searchQuery || activeFilter !== "all" ? "No products match your filters" : "No products yet"}
            </h4>
            <p className="text-xs text-[#341B09]/50 mt-1 max-w-sm mx-auto">
              {searchQuery || activeFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Add your first product to see it appear live on the storefront."}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-5 py-2 bg-[#7B3D14] text-white rounded-xl text-xs font-bold"
              >
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF3ED]/50 text-[#341B09]/60 uppercase tracking-wider font-bold border-b border-[#7B3D14]/8">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Sizes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7B3D14]/6">
                {paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FCF3ED]/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/10">
                          <Image src={prod.image_url} alt={prod.name} fill sizes="50px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[#341B09] line-clamp-1">{prod.name}</h4>
                          <span className="text-[10px] text-[#341B09]/40 font-mono">{prod.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#FCF3ED] rounded-lg text-[11px] font-semibold text-[#7B3D14] capitalize border border-[#7B3D14]/10">
                        {prod.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#7B3D14]">
                        ₹{(prod.sale_price || prod.price).toLocaleString("en-IN")}
                      </div>
                      {prod.sale_price && (
                        <div className="text-[10px] text-[#341B09]/40 line-through">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-[#FCF3ED]/60 rounded-md text-[10px] font-medium border border-[#7B3D14]/10">
                        {prod.sizes?.join(", ") || "Free Size"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        {/* In Stock Toggle */}
                        <button
                          onClick={() => handleToggleField(prod, "in_stock")}
                          className="flex items-center gap-1.5 group/toggle"
                          title="Toggle stock status"
                        >
                          {prod.in_stock ? (
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-300" />
                          )}
                          <span className={`text-[10px] font-bold ${prod.in_stock ? "text-emerald-700" : "text-gray-400"}`}>
                            {prod.in_stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </button>
                        {/* Tags */}
                        <div className="flex items-center gap-1">
                          {prod.is_bestseller && (
                            <button
                              onClick={() => handleToggleField(prod, "is_bestseller")}
                              className="px-1.5 py-0.5 bg-[#7B3D14] text-white rounded text-[8px] font-bold hover:opacity-80 transition-opacity"
                              title="Click to remove bestseller tag"
                            >
                              BEST
                            </button>
                          )}
                          {prod.is_new && (
                            <button
                              onClick={() => handleToggleField(prod, "is_new")}
                              className="px-1.5 py-0.5 bg-blue-500 text-white rounded text-[8px] font-bold hover:opacity-80 transition-opacity"
                              title="Click to remove new tag"
                            >
                              NEW
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingProduct(prod); setIsAddModalOpen(true); }}
                          className="p-2 rounded-lg hover:bg-[#FCF3ED] text-[#7B3D14] transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-[#FCF3ED] text-[#7B3D14] transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete({ id: prod.id, name: prod.name })}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#7B3D14]/8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-[#7B3D14] text-white shadow-sm"
                    : "bg-[#FCF3ED]/40 text-[#341B09]/60 hover:bg-[#FCF3ED]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">Delete Product?</h3>
              <p className="text-xs text-[#341B09]/70">
                Are you sure you want to remove <strong className="text-red-700">&quot;{productToDelete.name}&quot;</strong>? It will be removed live from the catalog.
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
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isAddModalOpen && (
        <ProductFormModal
          product={editingProduct}
          collections={collections}
          adminPassword={adminPassword}
          onClose={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
          onSaved={handleProductSaved}
          onStatusNotice={onStatusNotice}
        />
      )}
    </div>
  );
};
