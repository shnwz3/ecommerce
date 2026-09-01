import React from "react";
import { getProducts, getCollections, getBanners } from "@/lib/supabase/api";
import { AdminDashboard } from "./AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const [products, collections, banners] = await Promise.all([
    getProducts(),
    getCollections(),
    getBanners(),
  ]);

  return <AdminDashboard initialProducts={products} collections={collections} initialBanners={banners} />;
}
