"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageCircle, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CheckoutModal } from "./CheckoutModal";

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, updateCartQuantity, removeFromCart, cartTotal, cartCount } =
    useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen && !isCheckoutOpen) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Shopin Showroom! I would like to place an order for the items in my shopping bag (Total: ₹${cartTotal.toLocaleString(
      "en-IN"
    )}): ${cart.map((i) => `${i.product.name} (${i.selectedSize || "Free Size"} x${i.quantity})`).join(", ")}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCF3ED] shadow-2xl flex flex-col border-l border-[#7B3D14]/20">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-white border-b border-[#7B3D14]/15 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FCF3ED] border border-[#7B3D14]/20 flex items-center justify-center text-[#7B3D14]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-heading text-xl font-bold text-[#341B09]">
                  Shopping Bag
                </h3>
                <span className="text-[11px] text-[#341B09]/60">
                  {cartCount} {cartCount === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close"
              className="p-2 rounded-full hover:bg-[#FCF3ED] text-[#341B09]/70 hover:text-[#341B09] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F8EFEA] px-6 py-3 border-b border-[#7B3D14]/10">
            {cartTotal >= 999 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 Unlocked: Pan-India Free Express Shipping!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs text-[#341B09] mb-1.5 font-semibold">
                  <span>Add ₹{(999 - cartTotal).toLocaleString("en-IN")} more for FREE Delivery</span>
                  <span className="text-[#7B3D14]">{Math.round((cartTotal / 999) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-[#7B3D14]/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DFB873] via-[#C59A4E] to-[#7B3D14] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartTotal / 999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto border border-[#7B3D14]/15 text-[#7B3D14]/50 shadow-sm">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-lg font-serif-heading text-[#341B09] font-bold">
                  Your shopping bag is empty
                </p>
                <p className="text-xs text-[#341B09]/60 max-w-xs mx-auto">
                  Explore our handcrafted Kanchi Pattu weaves, Banarasi silks, and bridal lehengas.
                </p>
                <div className="pt-3">
                  <Link
                    href="/collections/all"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-full text-xs font-bold transition-all shadow-md hover:scale-105"
                  >
                    <span>Explore Handloom Sarees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${index}`}
                  className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-[#7B3D14]/15 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F8EFEA] shrink-0 border border-[#7B3D14]/10">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#341B09] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          className="text-[#341B09]/40 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] px-2 py-0.5 bg-[#FCF3ED] text-[#7B3D14] rounded-md font-semibold border border-[#7B3D14]/15">
                          {item.selectedSize || "Free Size"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#7B3D14]/10">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#7B3D14]/20 rounded-lg bg-[#FCF3ED]/40">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                          }
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#341B09] hover:bg-white rounded-l transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#341B09]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                          }
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#341B09] hover:bg-white rounded-r transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#7B3D14]">
                          ₹
                          {(
                            (item.product.sale_price || item.product.price) *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#7B3D14]/15 space-y-3.5 shadow-2xl">
              <div className="space-y-1.5 text-xs text-[#341B09]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-sm text-[#341B09]">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {cartTotal >= 999 ? "FREE Express" : "₹99"}
                  </span>
                </div>
                <div className="pt-2 flex justify-between text-sm font-extrabold text-[#341B09] border-t border-[#7B3D14]/10">
                  <span>Total Amount</span>
                  <span className="text-base text-[#7B3D14]">
                    ₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-[#341B09]/50 text-center">
                  Inclusive of all GST taxes & pan-India courier insurance
                </p>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-[#7B3D14] hover:bg-[#632f0e] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#DFB873]" />
                  <span>Proceed to Secure Checkout</span>
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Order Directly via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          closeCart();
        }}
      />
    </div>
  );
};
