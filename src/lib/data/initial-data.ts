import { Product, Collection, Banner } from '../types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Lehengas',
    slug: 'lehengas',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    description: 'Bridal & Party Wear Embroidered Lehengas',
    item_count: 19
  },
  {
    id: 'col-2',
    name: 'Fancy Sarees',
    slug: 'fancy-sarees',
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    description: 'Contemporary lightweight & shimmer party sarees',
    item_count: 219
  },
  {
    id: 'col-3',
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    description: 'Handcrafted designer drape collections',
    item_count: 32
  },
  {
    id: 'col-4',
    name: 'Pattu Sarees',
    slug: 'pattu-sarees',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    description: 'Traditional pure silk Kanchipuram & Banarasi weaves',
    item_count: 45
  },
  {
    id: 'col-5',
    name: 'Work Sarees',
    slug: 'work-sarees',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
    description: 'Intricate zardozi, sequin, and thread embroidery sarees',
    item_count: 58
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Banarasi Katan Silk Saree',
    slug: 'royal-banarasi-katan-silk-saree',
    description: 'Woven with pure gold zari floral motifs across a rich crimson body. Features an opulent pallu with intricate meenakari detailing, ideal for weddings and royal celebrations.',
    price: 5500,
    sale_price: 1699,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'pattu-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: true
  },
  {
    id: 'prod-2',
    name: 'Maroon Velvet Embroidered Bridal Lehenga',
    slug: 'maroon-velvet-embroidered-bridal-lehenga',
    description: 'Opulent micro-velvet lehenga layered with heritage dori, resham, and glittering sequins. Comes with matching blouse piece and double shaded net dupatta.',
    price: 12999,
    sale_price: 4999,
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'lehengas',
    sizes: ['S', 'M', 'L', 'XL', 'Semi-Stitched'],
    in_stock: true,
    is_new: true,
    is_bestseller: true
  },
  {
    id: 'prod-3',
    name: 'Semi Kanchi Vintage Gold Border Saree',
    slug: 'semi-kanchi-vintage-gold-border-saree',
    description: 'Lightweight semi-silk saree adorned with temple borders and geometric woven patterns. Effortless to drape for day festivals and family functions.',
    price: 1899,
    sale_price: 555,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'fancy-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: true
  },
  {
    id: 'prod-4',
    name: 'Designer Organza Floral Pastel Saree',
    slug: 'designer-organza-floral-pastel-saree',
    description: 'Ethereal organza silk featuring handcrafted digital floral art with hand-embellished scallop cutwork border. Soft, breathable, and ultra chic.',
    price: 3200,
    sale_price: 1250,
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'designer-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },
  {
    id: 'prod-5',
    name: 'Soft Silk Gadwal Festive Saree',
    slug: 'soft-silk-gadwal-festive-saree',
    description: 'Traditional Gadwal weave crafted with contrasting kuttu border and pure zari butta work. Soft drape finish designed for all-day comfort.',
    price: 1699,
    sale_price: 599,
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'fancy-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },
  {
    id: 'prod-7',
    name: 'Heavy Hand-Work Zardozi Saree',
    slug: 'heavy-hand-work-zardozi-saree',
    description: 'Pure georgette saree heavily accented with antique gold zardozi, cutdana, and pearl border craftsmanship. Perfect statement heirloom piece.',
    price: 4500,
    sale_price: 1899,
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'work-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: false
  },
  {
    id: 'prod-8',
    name: 'Dusty Rose Georgette Mirror-Work Lehenga',
    slug: 'dusty-rose-georgette-mirror-work-lehenga',
    description: 'Contemporary pastel lehenga set accented with real foil mirror work and thread embroidery. Includes flared skirt, stitched designer blouse, and ruffled dupatta.',
    price: 8999,
    sale_price: 3499,
    image_url: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'lehengas',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true,
    is_new: false,
    is_bestseller: true
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/pattu-sarees',
    title: 'Heritage Weaves of India',
    subtitle: 'Handcrafted Sarees & Lehengas from ₹300',
    cta_text: 'Explore Sarees',
    position: 'hero',
    sort_order: 1
  },
  {
    id: 'ban-2',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/lehengas',
    title: 'The Royal Bridal Edition',
    subtitle: 'Exquisite Velvet & Georgette Masterpieces',
    cta_text: 'Shop Lehengas',
    position: 'hero',
    sort_order: 2
  },
  {
    id: 'ban-3',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
    link_url: '/collections/fancy-sarees',
    title: 'Festive Offer Zone',
    subtitle: 'Up to 70% Off on Trending Sarees',
    cta_text: 'View Offers',
    position: 'promo-1',
    sort_order: 1
  },
  {
    id: 'ban-4',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
    link_url: '/collections/lehengas',
    title: 'Royal Heritage Bridal Edit',
    subtitle: 'Designer Lehengas & Sets from ₹3,999',
    cta_text: 'Shop Bridal',
    position: 'promo-2',
    sort_order: 2
  },
  {
    id: 'ban-5',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/designer-sarees',
    title: 'Pure Elegance in Every Drape',
    subtitle: 'Honest Prices Since 1996 • Direct from Artisans',
    cta_text: 'Discover Collection',
    position: 'full-promo',
    sort_order: 1
  }
];
