import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getCollections } from "@/lib/supabase/api";
import { CollectionClientView } from "./CollectionClientView";
import { LotusMedallion, CornerFiligree } from "@/components/ui/RoyalMotifs";

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
  let collectionDesc = "Explore handcrafted Kanchipuram silk, pure Banarasi drapes, and royal bridal couture direct from master looms.";

  if (slug === "all") {
    collectionTitle = "All Masterpiece Sarees & Lehengas";
    collectionDesc = "Browse our entire repository of handcrafted pure silk, organza, and bridal couture.";
  } else if (slug === "offer-zone") {
    collectionTitle = "Festive Offer Zone";
    collectionDesc = "Exclusive festive discounts on handpicked pure silk and designer party sarees.";
  } else if (slug === "best-sellers") {
    collectionTitle = "Heirloom Best Sellers";
    collectionDesc = "Customer favorite drapes loved across thousands of weddings and celebrations.";
  } else if (slug === "new-arrivals") {
    collectionTitle = "Fresh Off The Looms";
    collectionDesc = "Newly woven festive silk collections, pure zari statements, and seasonal pastels.";
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
    <main className="min-h-screen bg-royal-raw-silk py-8 sm:py-12">
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

        {/* Royal Collection Hero Header with Damask & Filigree */}
        <div className="relative bg-royal-damask rounded-3xl p-6 sm:p-10 border-2 border-[#C59A4E]/30 shadow-md mb-8 overflow-hidden">
          <CornerFiligree position="top-right" className="w-8 h-8 text-[#C59A4E]/40" />
          <CornerFiligree position="bottom-left" className="w-8 h-8 text-[#C59A4E]/40" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8E4718]">
              <LotusMedallion className="w-3.5 h-3.5 text-[#C59A4E]" />
              <span>Shopin Vault • Authentic Since 1996</span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#341B09] mt-2 capitalize">
              {collectionTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#341B09]/75 mt-2.5 leading-relaxed font-light">
              {collectionDesc}
            </p>
          </div>
        </div>

        {/* Client Interactive Filter, Sort and Grid Component */}
        <React.Suspense fallback={<div className="py-20 text-center text-[#7B3D14]">Loading weaves...</div>}>
          <CollectionClientView
            initialProducts={initialProducts}
            allCollections={allCollections}
            currentSlug={slug}
            maxPriceParam={maxPriceParam}
          />
        </React.Suspense>
      </div>
    </main>
  );
}
