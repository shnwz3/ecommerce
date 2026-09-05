import fs from 'fs';
import path from 'path';
import { supabase } from './client';
import { createServerSupabaseClient } from './server';
import { Product, Collection, Banner } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_BANNERS } from '../data/initial-data';

const getDbClient = () => {
  return createServerSupabaseClient() || supabase;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring products data file:', err);
  }
}

export function loadLocalProducts(): Product[] {
  try {
    ensureDataFile();
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('Error reading local products:', err);
  }
  return [];
}

export function saveLocalProducts(products: Product[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local products:', err);
  }
}

// In-memory runtime cache for seamless live demo updates even before database sync
let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];
let inMemoryBanners: Banner[] = [...INITIAL_BANNERS];

/**
 * Fetch products with optional filtering
 */
export async function getProducts(options?: {
  category?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const db = getDbClient();
  let dbProducts: Product[] = [];

  if (db) {
    try {
      let query = db.from('products').select('*').order('created_at', { ascending: false });

      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }
      if (options?.isBestseller) {
        query = query.eq('is_bestseller', true);
      }
      if (options?.isNew) {
        query = query.eq('is_new', true);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        dbProducts = data as Product[];
      }
    } catch (e) {
      console.warn('Supabase query error, falling back to local dataset:', e);
    }
  }

  // Load any local fallback products
  const localProducts = loadLocalProducts();

  // Combine products: Supabase products + local products not in Supabase + initial seed if empty
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const combined: Product[] = [];

  for (const p of [...localProducts, ...dbProducts, ...inMemoryProducts]) {
    if (!seenIds.has(p.id) && !seenSlugs.has(p.slug)) {
      seenIds.add(p.id);
      seenSlugs.add(p.slug);
      combined.push(p);
    }
  }

  let result = combined.length > 0 ? combined : [...inMemoryProducts];

  if (options?.category && options.category !== 'all') {
    result = result.filter(p => p.category === options.category);
  }
  if (options?.isBestseller) {
    result = result.filter(p => p.is_bestseller);
  }
  if (options?.isNew) {
    result = result.filter(p => p.is_new);
  }
  if (options?.limit) {
    result = result.slice(0, options.limit);
  }
  return result;
}

/**
 * Fetch a single product by its URL slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDbClient();
  if (db) {
    try {
      const { data, error } = await db
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Product;
      }
    } catch (e) {
      console.warn('Supabase getProductBySlug error, using fallback:', e);
    }
  }

  const localProducts = loadLocalProducts();
  const foundLocal = localProducts.find((p) => p.slug === slug);
  if (foundLocal) return foundLocal;

  return inMemoryProducts.find((p) => p.slug === slug) || null;
}

/**
 * Fetch collections
 */
export async function getCollections(): Promise<Collection[]> {
  const db = getDbClient();
  if (db) {
    try {
      const { data, error } = await db.from('collections').select('*');
      if (!error && data && data.length > 0) {
        return data as Collection[];
      }
    } catch (e) {
      console.warn('Supabase getCollections error, using fallback:', e);
    }
  }

  return INITIAL_COLLECTIONS;
}

/**
 * Fetch banners by position
 */
export async function getBanners(position?: string): Promise<Banner[]> {
  const db = getDbClient();
  if (db) {
    try {
      let query = db.from('banners').select('*').order('sort_order', { ascending: true });
      if (position) {
        query = query.eq('position', position);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Banner[];
      }
    } catch (e) {
      console.warn('Supabase getBanners error, using fallback:', e);
    }
  }

  if (position) {
    return inMemoryBanners.filter((b) => b.position === position);
  }
  return inMemoryBanners;
}

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * Add a new product (used by Admin Panel)
 */
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  let savedProduct: Product = newProduct;

  const db = getDbClient();
  if (db) {
    try {
      const { data, error } = await db
        .from('products')
        .insert([product])
        .select()
        .single();
      if (!error && data) {
        savedProduct = data as Product;
      } else if (error) {
        console.warn('Supabase insert error in api.ts:', error);
      }
    } catch (e) {
      console.warn('Supabase insert exception, saving to local disk:', e);
    }
  }

  // Update in-memory
  inMemoryProducts.unshift(savedProduct);

  // Update local disk cache
  const localProducts = loadLocalProducts();
  const filtered = localProducts.filter((p) => p.id !== savedProduct.id && p.slug !== savedProduct.slug);
  saveLocalProducts([savedProduct, ...filtered]);

  return savedProduct;
}

/**
 * Update an existing product by ID
 */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  let updatedProduct: Product | null = null;

  const db = getDbClient();
  if (db && isUUID(id)) {
    try {
      const { data, error } = await db
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        updatedProduct = data as Product;
      }
    } catch (e) {
      console.warn('Supabase update exception:', e);
    }
  }

  // Update in-memory
  const memIndex = inMemoryProducts.findIndex((p) => p.id === id);
  if (memIndex !== -1) {
    inMemoryProducts[memIndex] = { ...inMemoryProducts[memIndex], ...updates };
    if (!updatedProduct) updatedProduct = inMemoryProducts[memIndex];
  }

  // Update local disk cache
  const localProducts = loadLocalProducts();
  const diskIndex = localProducts.findIndex((p) => p.id === id);
  if (diskIndex !== -1) {
    localProducts[diskIndex] = { ...localProducts[diskIndex], ...updates };
    saveLocalProducts(localProducts);
    if (!updatedProduct) updatedProduct = localProducts[diskIndex];
  }

  return updatedProduct;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const db = getDbClient();
  if (db && isUUID(id)) {
    try {
      const { error } = await db.from('products').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete error in api.ts:', error);
      }
    } catch (e) {
      console.warn('Supabase delete exception:', e);
    }
  }

  inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
  const localProducts = loadLocalProducts();
  saveLocalProducts(localProducts.filter((p) => p.id !== id));
  return true;
}

/**
 * Direct file upload to Supabase Storage
 */
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-media')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('product-media').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (e) {
    console.error('Upload exception:', e);
    return null;
  }
}
