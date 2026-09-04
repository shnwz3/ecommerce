import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const occasions = [
  {
    title: 'The Grand Muhurtham',
    subtitle: 'Pure Kanjivaram & Zari Silks',
    description: 'Heirloom weaves sanctified for auspicious wedding vows and temple rituals.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80',
    href: '/collections/pattu-sarees',
    badge: 'Bridal Heritage',
  },
  {
    title: 'The Royal Trousseau',
    subtitle: 'Handcrafted Bridal Lehengas',
    description: 'Voluminous kalis, intricate zardozi, and hand-embroidered velvet drapes.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80',
    href: '/collections/lehengas',
    badge: 'Couture Editions',
  },
  {
    title: 'Festive Store',
    subtitle: 'Designer Georgette & Organza',
    description: 'Contemporary silhouettes woven with cutwork mirrors and metallic sequins.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80',
    href: '/collections/designer-sarees',
    badge: 'Evening Splendor',
  },
  {
    title: 'Day Elegance & fashion',
    subtitle: 'Artisanal Chiffon & Fancy Drapes',
    description: 'Weightless elegance and pastel botanicals crafted for intimate celebrations.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900&auto=format&fit=crop&q=80',
    href: '/collections/fancy-sarees',
    badge: 'Prêt-à-Porter',
  },
];

export default function ShopByOccasion() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF7F2] via-[#FDFBF7] to-[#FAF7F2] border-y border-[#E8DFC8]/60 relative overflow-hidden">
      {/* Subtle Royal Damask / Radial Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#8C1D40] text-xs uppercase tracking-[0.25em] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Celebrations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight mb-3">
            Curated by Occasion
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
          <p className="text-[#666666] text-sm sm:text-base font-light">
            Every chapter of your celebration deserves an authentic weave sculpted with royal grandeur.
          </p>
        </div>

        {/* 4 Occasion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group relative flex flex-col justify-end h-[420px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E8DFC8]/80 bg-[#1A1A1A]"
            >
              {/* Background Garment Image with Ken Burns / Zoom Effect */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-top filter brightness-[0.88] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-95"
                />
                {/* Multi-layered luxury gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/30" />
              </div>

              {/* Jharokha / Royal Filigree Top Accent */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 text-[10px] uppercase font-serif tracking-[0.2em] bg-black/60 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 rounded-full">
                  {item.badge}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A] group-hover:rotate-45 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Content Card */}
              <div className="relative z-10 p-5 transform transition-transform duration-300 group-hover:-translate-y-1">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#E8DFC8] font-medium mb-1">
                  {item.subtitle}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="inline-flex items-center text-xs font-serif text-[#D4AF37] tracking-wider uppercase font-semibold">
                  <span className="border-b border-[#D4AF37]/40 pb-0.5 group-hover:border-[#D4AF37]">
                    Explore Atelier
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
