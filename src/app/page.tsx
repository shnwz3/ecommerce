import { getProducts, getCollections, getBanners } from "@/lib/supabase/api";
import { HeroSlider } from "@/components/HeroSlider";
import { ShopByCollections } from "@/components/ShopByCollections";
import { TwoUpPromo } from "@/components/TwoUpPromo";
import { TabbedCarousel } from "@/components/TabbedCarousel";
import { FullWidthPromo } from "@/components/FullWidthPromo";
import { BestSellersGrid } from "@/components/BestSellersGrid";
import { ShopByPrice } from "@/components/ShopByPrice";
import { NewArrivalsGrid } from "@/components/NewArrivalsGrid";
import { FeaturedVideos } from "@/components/FeaturedVideos";
import { TrustBar } from "@/components/TrustBar";

export const revalidate = 0; // Fresh dynamic rendering for live admin updates

export default async function HomePage() {
  const [products, collections, banners] = await Promise.all([
    getProducts(),
    getCollections(),
    getBanners(),
  ]);

  return (
    <main className="min-h-screen">
      {/* 1. Hero Carousel */}
      <HeroSlider banners={banners} />

      {/* 2. Shop By Collections */}
      <ShopByCollections collections={collections} />

      {/* 3. Two-Up Promo Banners */}
      <TwoUpPromo banners={banners} />

      {/* 4. Tabbed Product Carousel ("Drape the Beauty. Discover the Offers") */}
      <TabbedCarousel products={products} />

      {/* 5. Full-Width Feature Banner */}
      <FullWidthPromo banners={banners} />

      {/* 6. Best Sellers Grid */}
      <BestSellersGrid products={products} />

      {/* 7. Shop By Price Banners */}
      <ShopByPrice />

      {/* 8. New Arrivals Grid */}
      <NewArrivalsGrid products={products} />

      {/* 9. Featured Videos Carousel */}
      <FeaturedVideos />

      {/* 10. Trust Bar */}
      <TrustBar />
    </main>
  );
}
