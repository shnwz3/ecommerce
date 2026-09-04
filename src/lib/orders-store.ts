import fs from "fs";
import path from "path";
import { Order } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// In-memory cache for ultra-fast reads
let ordersCache: Order[] = [];
let isInitialized = false;

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function loadOrdersFromDisk(): Order[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    ordersCache = JSON.parse(data);
    isInitialized = true;
    return ordersCache;
  } catch (error) {
    console.error("Error reading orders from disk:", error);
    return ordersCache || [];
  }
}

function saveOrdersToDisk(orders: Order[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    ordersCache = orders;
  } catch (error) {
    console.error("Error writing orders to disk:", error);
  }
}

export function getStoredOrders(): Order[] {
  return loadOrdersFromDisk();
}

export function storeNewOrder(orderData: Omit<Order, "id" | "order_number" | "created_at">): Order {
  const currentOrders = getStoredOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}-${randomSuffix}`,
    order_number: `ORD-2026-${randomSuffix}`,
    created_at: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...currentOrders];
  saveOrdersToDisk(updatedOrders);
  return newOrder;
}

export function updateStoredOrderStatus(orderId: string, status: Order["status"]): Order | null {
  const currentOrders = getStoredOrders();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return null;

  currentOrders[orderIndex].status = status;
  saveOrdersToDisk(currentOrders);
  return currentOrders[orderIndex];
}

export function updateStoredOrderPayment(
  orderId: string,
  paymentStatus: NonNullable<Order["payment_status"]>,
  transactionId?: string
): Order | null {
  const currentOrders = getStoredOrders();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return null;

  currentOrders[orderIndex].payment_status = paymentStatus;
  if (transactionId) {
    currentOrders[orderIndex].transaction_id = transactionId;
  } else if (!currentOrders[orderIndex].transaction_id) {
    currentOrders[orderIndex].transaction_id = `VERIFIED-${Date.now().toString().slice(-6)}`;
  }

  saveOrdersToDisk(currentOrders);
  return currentOrders[orderIndex];
}
