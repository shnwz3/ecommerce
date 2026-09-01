import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/supabase/api";
import { ProductDetailClientView } from "./ProductDetailClientView";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.is_bestseller))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FCF3ED] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#341B09]/60 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-[#7B3D14] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${product.category}`}
            className="hover:text-[#7B3D14] transition-colors capitalize"
          >
            {product.category.replace("-", " ")}
          </Link>
          <span>/</span>
          <span className="text-[#7B3D14] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Detail Interactive Viewer */}
        <ProductDetailClientView product={product} />

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#7B3D14]/15">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
                You May Also Like
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1.5">
                Similar Handcrafted Styles
              </h2>
              <div className="w-12 h-0.5 bg-[#7B3D14] mx-auto mt-3 rounded-full opacity-60" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
