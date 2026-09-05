export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string;
  gallery_urls: string[] | null;
  category: string;
  sizes: string[] | null;
  in_stock: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  created_at?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description?: string | null;
  item_count?: number;
}

export interface Banner {
  id: string;
  image_url: string;
  link_url: string | null;
  title?: string | null;
  subtitle?: string | null;
  cta_text?: string | null;
  position: string; // 'hero' | 'promo-1' | 'promo-2' | 'full-promo' | 'shop-by-price-1' ...
  sort_order: number;
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  quantity: number;
}

// ─── Admin Panel Types ──────────────────────────────────────────────────

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  status: "pending" | "ordered" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: "COD" | "UPI" | "Card" | "NetBanking";
  payment_status?: "paid" | "pending" | "failed" | "refunded";
  transaction_id?: string;
  created_at: string;
}

export interface OrderItem {
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  min_order: number;
  max_discount: number | null;
  expiry_date: string;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
  applicable_categories: string[] | null;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  total_orders: number;
  total_spent: number;
  segment: "new" | "returning" | "vip" | "inactive";
  joined_at: string;
  last_order_at: string;
}

export interface AdminNotification {
  id: string;
  message: string;
  type: "order" | "product" | "coupon" | "system";
  read: boolean;
  created_at: string;
}

export type AdminSection =
  | "products"
  | "orders"
  | "collections"
  | "banners"
  | "settings";
