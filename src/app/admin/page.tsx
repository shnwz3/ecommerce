import React from "react";
import { getProducts, getCollections, getBanners } from "@/lib/supabase/api";
import { AdminShell } from "./components/AdminShell";

export const revalidate = 0;

export default async function AdminPage() {
  const [products, collections, banners] = await Promise.all([
    getProducts(),
    getCollections(),
    getBanners(),
  ]);

  return <AdminShell initialProducts={products} collections={collections} initialBanners={banners} />;
}
