import React from "react";
import { getProducts, getCollections, getBanners } from "@/lib/supabase/api";
import { getStoredOrders } from "@/lib/orders-store";
import { AdminShell } from "./components/AdminShell";

export const revalidate = 0;

export default async function AdminPage() {
  const [products, collections, banners, orders] = await Promise.all([
    getProducts(),
    getCollections(),
    getBanners(),
    Promise.resolve().then(() => getStoredOrders()).catch(() => []),
  ]);

  return (
    <AdminShell
      initialProducts={products}
      collections={collections}
      initialBanners={banners}
      initialOrders={orders}
    />
  );
}
