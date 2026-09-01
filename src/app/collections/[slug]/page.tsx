import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getCollections } from "@/lib/supabase/api";
import { CollectionClientView } from "./CollectionClientView";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const maxPriceParam = typeof sParams.maxPrice === "string" ? parseInt(sParams.maxPrice, 10) : undefined;

  const [allProducts, allCollections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  // Determine active collection details
  let collectionTitle = "All Sarees & Lehengas";
  let collectionDesc = "Explore our entire catalog of handcrafted authentic Indian weaves.";

  if (slug === "all") {
    collectionTitle = "Complete Storefront Collection";
    collectionDesc = "Handcrafted sarees, bridal lehengas, and festive ensembles direct from master looms.";
  } else if (slug === "offer-zone") {
    collectionTitle = "Festive Offer Zone";
    collectionDesc = "Unbelievable discounts on premium silk sarees and bridal sets for a limited time.";
  } else if (slug === "best-sellers") {
    collectionTitle = "Best Selling Handlooms";
    collectionDesc = "Our most beloved customer favorites with five-star artisan reviews.";
  } else if (slug === "new-arrivals") {
    collectionTitle = "New Arrivals";
    collectionDesc = "Fresh designs, contemporary colorways, and new bridal styles just added.";
  } else {
    const col = allCollections.find((c) => c.slug === slug);
    if (col) {
      collectionTitle = col.name;
      collectionDesc = col.description || `Handcrafted ${col.name} direct from master weavers.`;
    } else {
      // If it's a category slug
      collectionTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  }

  // Initial filtered products for SSR
  let initialProducts = allProducts;
  if (slug === "offer-zone") {
    initialProducts = allProducts.filter((p) => p.sale_price !== null && p.sale_price < p.price);
  } else if (slug === "best-sellers") {
    initialProducts = allProducts.filter((p) => p.is_bestseller);
  } else if (slug === "new-arrivals") {
    initialProducts = allProducts.filter((p) => p.is_new);
  } else if (slug !== "all") {
    initialProducts = allProducts.filter((p) => p.category === slug);
  }

  if (maxPriceParam) {
    initialProducts = initialProducts.filter(
      (p) => (p.sale_price || p.price) <= maxPriceParam
    );
  }

  return (
    <main className="min-h-screen bg-[#FCF3ED] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#341B09]/60 mb-6">
          <Link href="/" className="hover:text-[#7B3D14] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-[#7B3D14] transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#7B3D14] font-semibold capitalize">{collectionTitle}</span>
        </nav>

        {/* Collection Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#7B3D14]/15 shadow-sm mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
              Shopin Showroom
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#341B09] mt-1.5 capitalize">
              {collectionTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#341B09]/70 mt-2.5 leading-relaxed">
              {collectionDesc}
            </p>
          </div>
        </div>

        {/* Client Interactive Filter, Sort and Grid Component */}
        <CollectionClientView
          initialProducts={initialProducts}
          allCollections={allCollections}
          currentSlug={slug}
          maxPriceParam={maxPriceParam}
        />
      </div>
    </main>
  );
}
