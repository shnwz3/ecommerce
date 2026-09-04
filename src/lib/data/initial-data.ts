import { Product, Collection, Banner } from '../types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Lehengas',
    slug: 'lehengas',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    description: 'Bridal & Festive Hand-Embroidered Lehengas',
    item_count: 24
  },
  {
    id: 'col-2',
    name: 'Fancy Sarees',
    slug: 'fancy-sarees',
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    description: 'Lightweight handloom & festive celebration sarees',
    item_count: 48
  },
  {
    id: 'col-3',
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    description: 'Handcrafted sheer organza & tissue cutwork collections',
    item_count: 36
  },
  {
    id: 'col-4',
    name: 'Pattu Sarees',
    slug: 'pattu-sarees',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    description: 'Traditional pure silk Kanchipuram & Banarasi weaves',
    item_count: 52
  },
  {
    id: 'col-5',
    name: 'Work Sarees',
    slug: 'work-sarees',
    image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop',
    description: 'Intricate zardozi, sequin, and thread embroidery sarees',
    item_count: 30
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Pattu Sarees
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
    name: 'Kanchipuram Temple Brocade Silk Saree',
    slug: 'kanchipuram-silk-saree-gold-border',
    description: 'Masterfully woven in authentic Kanchi temple border motifs with contrast ruby pallu and antique gold zari detailing.',
    price: 6999,
    sale_price: 2199,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'pattu-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: true
  },
  {
    id: 'prod-3',
    name: 'Dharmavaram Traditional Butta Silk Saree',
    slug: 'dharmavaram-traditional-butta-silk-saree',
    description: 'Heirloom South Indian weave featuring double-shaded warp threads, solid zari border, and delicate peacock motifs.',
    price: 4800,
    sale_price: 1899,
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'pattu-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: false
  },

  // 2. Lehengas
  {
    id: 'prod-4',
    name: 'Maroon Velvet Embroidered Bridal Lehenga',
    slug: 'maroon-velvet-embroidered-bridal-lehenga',
    description: 'Opulent micro-velvet lehenga layered with heritage dori, resham, and glittering sequins. Comes with matching blouse piece and double shaded net dupatta.',
    price: 12999,
    sale_price: 4999,
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'lehengas',
    sizes: ['S', 'M', 'L', 'XL', 'Semi-Stitched'],
    in_stock: true,
    is_new: true,
    is_bestseller: true
  },
  {
    id: 'prod-5',
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
  },
  {
    id: 'prod-6',
    name: 'Emerald Raw Silk Sangeet Lehenga',
    slug: 'emerald-raw-silk-sangeet-lehenga',
    description: 'Regal jewel-tone raw silk silhouette embellished with botanical cutdana and antique zardozi borders.',
    price: 11500,
    sale_price: 4299,
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'lehengas',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },

  // 3. Designer Sarees
  {
    id: 'prod-7',
    name: 'Designer Organza Floral Pastel Saree',
    slug: 'designer-organza-floral-pastel-saree',
    description: 'Ethereal organza silk featuring handcrafted digital floral art with hand-embellished scallop cutwork border. Soft, breathable, and ultra chic.',
    price: 3200,
    sale_price: 1250,
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'designer-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },
  {
    id: 'prod-8',
    name: 'Scalloped Border Tissue Silk Festive Saree',
    slug: 'scalloped-border-tissue-silk-festive-saree',
    description: 'Shimmering tissue silk drape accented with handcrafted cutwork scalloped borders and tonal resham thread embroidery.',
    price: 3800,
    sale_price: 1450,
    image_url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'designer-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: true
  },
  {
    id: 'prod-9',
    name: 'Chanderi Foil Shimmer Celebration Saree',
    slug: 'chanderi-foil-shimmer-celebration-saree',
    description: 'Lightweight Chanderi blend woven with delicate gold foil motifs, finished with tassels on the pallu.',
    price: 2600,
    sale_price: 990,
    image_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'designer-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },

  // 4. Fancy Sarees
  {
    id: 'prod-10',
    name: 'Semi Kanchi Vintage Gold Border Saree',
    slug: 'semi-kanchi-vintage-gold-border-saree',
    description: 'Lightweight semi-silk saree adorned with temple borders and geometric woven patterns. Effortless to drape for day festivals and family functions.',
    price: 1899,
    sale_price: 555,
    image_url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'fancy-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: true
  },
  {
    id: 'prod-11',
    name: 'Soft Silk Gadwal Festive Saree',
    slug: 'soft-silk-gadwal-festive-saree',
    description: 'Traditional Gadwal weave crafted with contrasting kuttu border and pure zari butta work. Soft drape finish designed for all-day comfort.',
    price: 1699,
    sale_price: 599,
    image_url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'fancy-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: true,
    is_bestseller: false
  },

  // 5. Work Sarees
  {
    id: 'prod-12',
    name: 'Heavy Hand-Work Zardozi Saree',
    slug: 'heavy-hand-work-zardozi-saree',
    description: 'Pure georgette saree heavily accented with antique gold zardozi, cutdana, and pearl border craftsmanship. Perfect statement heirloom piece.',
    price: 4500,
    sale_price: 1899,
    image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop',
    gallery_urls: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'work-sarees',
    sizes: ['Free Size'],
    in_stock: true,
    is_new: false,
    is_bestseller: false
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/pattu-sarees',
    title: 'Heritage Weaves of India',
    subtitle: 'Pure Kanchipuram Silks, Banarasi Drapes & Royal Bridal Masterpieces',
    cta_text: 'Explore All Weaves',
    position: 'hero',
    sort_order: 1
  },
  {
    id: 'ban-2',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/lehengas',
    title: 'The Royal Bridal Edit',
    subtitle: 'Hand-Embroidered Velvet & Raw Silk Lehengas Crafted by Master Karigars',
    cta_text: 'Discover Bridal Vault',
    position: 'hero',
    sort_order: 2
  },
  {
    id: 'ban-3',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
    link_url: '/collections/designer-sarees',
    title: 'The Festive Grandeur Edit',
    subtitle: 'Handpicked Ethereal Organzas & Contemporary Party Drapes',
    cta_text: 'View Curated Edit',
    position: 'promo-1',
    sort_order: 1
  },
  {
    id: 'ban-4',
    image_url: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=1000&auto=format&fit=crop',
    link_url: '/collections/lehengas',
    title: 'Royal Heritage Trousseau',
    subtitle: 'Artisan Lehengas & Sangeet Sets Tailored for Auspicious Celebrations',
    cta_text: 'Explore Trousseau',
    position: 'promo-2',
    sort_order: 2
  },
  {
    id: 'ban-5',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1600&auto=format&fit=crop',
    link_url: '/collections/all',
    title: 'Pure Elegance in Every Drape',
    subtitle: 'Direct Loom Pricing Since 1996 • Handcrafted Indian Heritage',
    cta_text: 'Discover Showroom Vault',
    position: 'full-promo',
    sort_order: 1
  }
];
