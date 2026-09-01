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
