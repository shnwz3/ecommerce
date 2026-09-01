"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, MapPin, Mail, ArrowRight, Crown, Check, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-royal-ebony text-[#FCF3ED] pt-16 pb-24 lg:pb-14 border-t-2 border-[#C59A4E]/40 relative overflow-hidden">
      {/* Decorative Golden Ambient Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C59A4E]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Subscription Strip */}
        <div className="bg-[#341B09] rounded-3xl p-8 sm:p-10 border border-[#C59A4E]/30 shadow-2xl mb-14 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DFB873]">
              Join the Shopin Heritage Club
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#FCF3ED]">
              Get ₹500 Off Your First Handloom Order
            </h3>
            <p className="text-xs text-[#FCF3ED]/70">
              Be the first to receive new silk weave drops, festive flash offers, and VIP bridal previews.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 px-6 py-3.5 bg-emerald-900/60 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Welcome to the Shopin Heritage Family.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-[#FCF3ED] placeholder-[#FCF3ED]/50 focus:outline-none focus:border-[#DFB873] min-w-[280px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C59A4E] hover:bg-[#b0873e] text-[#241206] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Heritage Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E4718] to-[#5E2C0C] border border-[#DFB873]/40 flex items-center justify-center text-[#DFB873]">
                <Crown className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading text-2xl font-bold tracking-wider text-[#DFB873] uppercase">
                  Shopin
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#FCF3ED]/60 font-semibold -mt-1">
                  Handlooms • Since 1996
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FCF3ED]/75 leading-relaxed">
              Rooted in Indian tradition since 1996, Shopin Showroom brings handcrafted Kanchipuram Pattu, Banarasi silk sarees, and designer bridal lehengas directly from master looms at honest artisan prices.
            </p>

            {/* Direct Clean SVG Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C59A4E] hover:text-[#241206] flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C59A4E] hover:text-[#241206] flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C59A4E] hover:text-[#241206] flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-lg font-bold text-[#DFB873]">
              Handloom Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#FCF3ED]/80">
              <li>
                <Link href="/collections/pattu-sarees" className="hover:text-[#DFB873] transition-colors">
                  Pure Silk Pattu Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/fancy-sarees" className="hover:text-[#DFB873] transition-colors">
                  Fancy & Daily Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/designer-sarees" className="hover:text-[#DFB873] transition-colors">
                  Designer Cutwork Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/work-sarees" className="hover:text-[#DFB873] transition-colors">
                  Heavy Zardozi Work Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/lehengas" className="hover:text-[#DFB873] transition-colors">
                  Bridal & Festive Lehengas
                </Link>
              </li>
              <li>
                <Link href="/collections/offer-zone" className="hover:text-[#DFB873] transition-colors flex items-center gap-1.5">
                  <span>Festive Offer Zone</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-lg font-bold text-[#DFB873]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#FCF3ED]/80">
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  Track Your Consignment
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  Shipping & Pan-India Delivery
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  7-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  Authentic Silk Care Guide
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-[#DFB873] transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom Address & WhatsApp Stylist */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-lg font-bold text-[#DFB873]">
              Showroom & Stylist
            </h4>
            <div className="space-y-2.5 text-xs text-[#FCF3ED]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DFB873] shrink-0 mt-0.5" />
                <span>Shopin Showroom, Reddy colony, Warangal, Telangana - 505209</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DFB873] shrink-0" />
                <span>+91 98480 00000 / +91 98480 11111</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DFB873] shrink-0" />
                <span>orders@shopin.com</span>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919848000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-bold transition-all shadow-md hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Order via WhatsApp Stylist</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Guarantees */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FCF3ED]/60 gap-4">
          <p>© {new Date().getFullYear()} Shopin Showroom. Handcrafted with pride in India.</p>
          <div className="flex items-center gap-3">
            
            <span>🇮🇳 100% Authentic Indian Weaves</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
