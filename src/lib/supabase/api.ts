import { supabase } from './client';
import { Product, Collection, Banner } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_BANNERS } from '../data/initial-data';

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
  if (supabase) {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

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
        return data as Product[];
      }
    } catch (e) {
      console.warn('Supabase query error, falling back to local dataset:', e);
    }
  }

  // Fallback to in-memory / initial seed dataset
  let result = [...inMemoryProducts];
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
  if (supabase) {
    try {
      const { data, error } = await supabase
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

  return inMemoryProducts.find(p => p.slug === slug) || null;
}

/**
 * Fetch collections
 */
export async function getCollections(): Promise<Collection[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('collections').select('*');
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
  if (supabase) {
    try {
      let query = supabase.from('banners').select('*').order('sort_order', { ascending: true });
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
    return inMemoryBanners.filter(b => b.position === position);
  }
  return inMemoryBanners;
}

/**
 * Add a new product (used by Admin Panel)
 */
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      if (!error && data) {
        inMemoryProducts.unshift(data as Product);
        return data as Product;
      }
    } catch (e) {
      console.warn('Supabase insert error, saving to memory:', e);
    }
  }

  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
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
