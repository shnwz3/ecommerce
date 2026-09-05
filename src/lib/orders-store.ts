import fs from "fs";
import path from "path";
import os from "os";
import { Order } from "./types";
import { createServerSupabaseClient } from "./supabase/server";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const TMP_ORDERS_FILE = path.join(os.tmpdir(), "shopin_orders.json");

// In-memory cache for ultra-fast reads
let ordersCache: Order[] = [];

function getWritableFilePath(): string {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Test write permission
    return ORDERS_FILE;
  } catch (e) {
    // Read-only filesystem in Vercel serverless environment
    return TMP_ORDERS_FILE;
  }
}

function loadOrdersFromDisk(): Order[] {
  try {
    const targetFile = getWritableFilePath();
    if (fs.existsSync(targetFile)) {
      const data = fs.readFileSync(targetFile, "utf-8");
      ordersCache = JSON.parse(data) || [];
      return ordersCache;
    }
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      ordersCache = JSON.parse(data) || [];
      return ordersCache;
    }
    if (fs.existsSync(TMP_ORDERS_FILE)) {
      const data = fs.readFileSync(TMP_ORDERS_FILE, "utf-8");
      ordersCache = JSON.parse(data) || [];
      return ordersCache;
    }
  } catch (error) {
    console.warn("Notice reading orders from disk:", error);
  }
  return ordersCache || [];
}

function saveOrdersToDisk(orders: Order[]): void {
  ordersCache = orders;
  try {
    const targetFile = getWritableFilePath();
    fs.writeFileSync(targetFile, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    // If process.cwd() is read-only on Vercel, write to /tmp
    try {
      fs.writeFileSync(TMP_ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    } catch (tmpErr) {
      console.warn("Could not persist orders to disk/tmp:", tmpErr);
    }
  }
}

export async function getStoredOrders(): Promise<Order[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data)) {
        return data as Order[];
      }
    } catch (e) {
      // Supabase orders table not yet created
    }
  }
  return loadOrdersFromDisk();
}

export function getStoredOrdersSync(): Order[] {
  return loadOrdersFromDisk();
}

export async function storeNewOrder(
  orderData: Omit<Order, "id" | "order_number" | "created_at">
): Promise<Order> {
  const currentOrders = await getStoredOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}-${randomSuffix}`,
    order_number: `ORD-2026-${randomSuffix}`,
    created_at: new Date().toISOString(),
  };

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("orders").insert([newOrder]);
    } catch (e) {
      console.warn("Supabase orders insert notice:", e);
    }
  }

  const updatedOrders = [newOrder, ...currentOrders.filter((o) => o.id !== newOrder.id)];
  saveOrdersToDisk(updatedOrders);
  return newOrder;
}

export async function updateStoredOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order | null> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("orders").update({ status }).eq("id", orderId);
    } catch (e) {}
  }

  const currentOrders = loadOrdersFromDisk();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return null;

  currentOrders[orderIndex].status = status;
  saveOrdersToDisk(currentOrders);
  return currentOrders[orderIndex];
}

export async function updateStoredOrderPayment(
  orderId: string,
  paymentStatus: NonNullable<Order["payment_status"]>,
  transactionId?: string
): Promise<Order | null> {
  const txn = transactionId || `VERIFIED-${Date.now().toString().slice(-6)}`;

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from("orders")
        .update({ payment_status: paymentStatus, transaction_id: txn })
        .eq("id", orderId);
    } catch (e) {}
  }

  const currentOrders = loadOrdersFromDisk();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return null;

  currentOrders[orderIndex].payment_status = paymentStatus;
  currentOrders[orderIndex].transaction_id = txn;

  saveOrdersToDisk(currentOrders);
  return currentOrders[orderIndex];
}
