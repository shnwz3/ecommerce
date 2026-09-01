"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Sparkles, X, Volume2, VolumeX, ArrowRight, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface VideoCard {
  id: string;
  title: string;
  category: string;
  price: string;
  thumbnail: string;
  videoUrl: string;
  link: string;
}

const mockVideos: VideoCard[] = [
  {
    id: "v-1",
    title: "Pure Banarasi Silk Drape & Zari Shimmer",
    category: "Pattu Sarees",
    price: "₹1,699",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    link: "/products/royal-banarasi-katan-silk-saree",
  },
  {
    id: "v-2",
    title: "Bridal Velvet Lehenga Twirl & Flare",
    category: "Lehengas",
    price: "₹4,999",
    thumbnail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    link: "/products/maroon-velvet-embroidered-bridal-lehenga",
  },
  {
    id: "v-3",
    title: "Organza Pastel Scallop Cutwork Showcase",
    category: "Designer Sarees",
    price: "₹1,250",
    thumbnail: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    link: "/products/designer-organza-floral-pastel-saree",
  },
  {
    id: "v-4",
    title: "Heritage Kanchipuram Silk & Zari Weave",
    category: "Pattu Sarees",
    price: "₹2,199",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4",
    link: "/products/kanchipuram-silk-saree-gold-border",
  },
];

interface VideoItemCardProps {
  video: VideoCard;
  onOpenModal: (video: VideoCard) => void;
}

const VideoItemCard: React.FC<VideoItemCardProps> = ({ video, onOpenModal }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="group relative rounded-3xl overflow-hidden shadow-lg border border-[#7B3D14]/20 bg-black pt-[165%] cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(video)}
    >
      {/* Poster Image (Visible when not hovering/playing) */}
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className={`object-cover transition-opacity duration-500 ${
          isPlaying ? "opacity-0" : "opacity-100 group-hover:scale-105"
        }`}
      />

      {/* HTML5 Hover Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Dark Vignette Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Category Pill (Top Left) */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-0.5 rounded-full bg-[#7B3D14]/90 backdrop-blur-md text-[#FCF3ED] text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/10">
          {video.category}
        </span>
      </div>

      {/* Floating Center Reel Play Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/40 text-white flex items-center justify-center transition-all duration-300 shadow-xl ${
            isHovered
              ? "bg-[#7B3D14] scale-110 opacity-90"
              : "bg-white/30 scale-100 opacity-80 group-hover:opacity-100"
          }`}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-4 bg-white rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-75" />
              <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-150" />
            </div>
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="absolute bottom-3 inset-x-3 z-10 text-white space-y-1.5">
        <h4 className="font-serif-heading text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
          {video.title}
        </h4>

        <div className="flex items-center justify-between pt-1 border-t border-white/15">
          <span className="text-xs sm:text-sm font-extrabold text-[#DFB873]">
            {video.price}
          </span>
          <Link
            href={video.link}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-[#DFB873] transition-colors"
          >
            <span>Shop Drape</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const FeaturedVideos: React.FC = () => {
  const [activeModalVideo, setActiveModalVideo] = useState<VideoCard | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F8EFEA] border-t border-[#7B3D14]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B3D14]">
            Reels & Live Drapes
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#341B09] mt-1">
            Our Featured Videos
          </h2>
          <p className="text-xs sm:text-sm text-[#341B09]/70 mt-2">
            Hover to watch real drapes, fabric close-ups, and live styling in motion.
          </p>
          <div className="w-12 h-0.5 bg-[#7B3D14] mx-auto mt-3 rounded-full opacity-60" />
        </div>

        {/* 4 Portrait Video Cards with Hover Auto-Play */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {mockVideos.map((video) => (
            <VideoItemCard
              key={video.id}
              video={video}
              onOpenModal={(v) => setActiveModalVideo(v)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Video Reel Lightbox Modal */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setActiveModalVideo(null)}
          />

          <div className="relative z-10 w-full max-w-md bg-[#241206] rounded-3xl overflow-hidden shadow-2xl border border-[#DFB873]/30 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#7B3D14] text-[10px] font-bold uppercase text-[#FCF3ED]">
                  {activeModalVideo.category}
                </span>
                <span className="text-xs font-semibold text-[#DFB873]">{activeModalVideo.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#DFB873]" />}
                </button>
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative pt-[140%] w-full bg-black overflow-hidden">
              <video
                ref={modalVideoRef}
                src={activeModalVideo.videoUrl}
                autoPlay
                loop
                playsInline
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Modal Footer Buy CTA */}
            <div className="p-5 bg-[#341B09] border-t border-[#DFB873]/20 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h4 className="font-serif-heading text-base font-bold text-white truncate">
                  {activeModalVideo.title}
                </h4>
                <span className="text-xs text-[#DFB873] font-extrabold">
                  {activeModalVideo.price} • Free Express Shipping
                </span>
              </div>

              <Link
                href={activeModalVideo.link}
                onClick={() => setActiveModalVideo(null)}
                className="px-5 py-2.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop This Look</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
