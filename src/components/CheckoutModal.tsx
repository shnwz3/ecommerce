"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  ShoppingBag,
  Truck,
  CreditCard,
  Phone,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Order } from "@/lib/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, removeFromCart } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "Card">("UPI");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const shippingFee = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMessage("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || `${customerPhone.trim()}@customer.shopin.com`,
        customer_phone: customerPhone.trim(),
        items: cart.map((item) => ({
          product_name: item.product.name,
          product_image: item.product.image_url,
          quantity: item.quantity,
          price: item.product.sale_price || item.product.price,
          size: item.selectedSize || "Free Size",
        })),
        total: grandTotal,
        subtotal: cartTotal,
        shipping_fee: shippingFee,
        discount: 0,
        shipping_address: shippingAddress.trim(),
        city: city.trim() || "Hyderabad",
        state: state.trim() || "Telangana",
        pincode: pincode.trim() || "500001",
        payment_method: paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.order) {
        setPlacedOrder(data.order);
        // Clear customer cart items
        cart.forEach((i) => removeFromCart(i.product.id, i.selectedSize));
      } else {
        setErrorMessage(data.error || "Could not place order. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage("Network error. Please verify your connection.");
    }
  };

  const handleFinish = () => {
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#7B3D14]/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleFinish}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-[#FCF3ED] text-[#341B09]/50 hover:text-[#341B09] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── SUCCESS SCREEN ──────────────────────────────────────────────── */}
        {placedOrder ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B3D14] bg-[#FCF3ED] px-3 py-1 rounded-full inline-block">
                Order Confirmed
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#341B09] pt-1">
                Thank You, {placedOrder.customer_name}!
              </h2>
              <p className="text-xs text-[#341B09]/70 max-w-md mx-auto">
                Your order has been sent directly to the Shopin Showroom manager and is visible live on the admin order dashboard.
              </p>
            </div>

            <div className="p-4 bg-[#FCF3ED] rounded-2xl border border-[#7B3D14]/15 text-left space-y-2 text-xs">
              <div className="flex justify-between font-mono font-bold text-sm text-[#7B3D14]">
                <span>Order Number:</span>
                <span>{placedOrder.order_number}</span>
              </div>
              <div className="flex justify-between text-[#341B09]">
                <span>Amount Payable:</span>
                <span className="font-bold">₹{placedOrder.total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#341B09]">
                <span>Payment Method:</span>
                <span className="font-semibold">{placedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between text-[#341B09]">
                <span>Delivery Address:</span>
                <span className="text-right truncate max-w-[200px]">
                  {placedOrder.shipping_address}, {placedOrder.city}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hi Shopin! I just placed order ${placedOrder.order_number} for ₹${placedOrder.total}. Customer: ${placedOrder.customer_name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Track via WhatsApp
              </a>

              <button
                onClick={handleFinish}
                className="flex-1 py-3 bg-[#7B3D14] hover:bg-[#5a2c0e] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* ─── CHECKOUT FORM ─────────────────────────────────────────────── */
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="pb-3 border-b border-[#7B3D14]/10">
              <div className="flex items-center gap-2 text-[#7B3D14] text-xs font-bold uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Instant Checkout</span>
              </div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#341B09] mt-0.5">
                Delivery & Payment Details
              </h2>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Customer Information */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-[#341B09] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7B3D14]" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#341B09]/70 mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#341B09]/70 mb-1 font-semibold">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-[#341B09] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7B3D14]" /> Delivery Address
              </h3>
              <div>
                <label className="block text-[#341B09]/70 mb-1 font-semibold">Street / House / Colony Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Lotus Heights, Baner Road"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#341B09]/70 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    placeholder="Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#341B09]/70 mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    placeholder="Telangana"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#341B09]/70 mb-1 font-semibold">Pincode</label>
                  <input
                    type="text"
                    placeholder="500033"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#7B3D14]/20 focus:outline-none focus:border-[#7B3D14] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#341B09] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#7B3D14]" /> Choose Payment Method
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "UPI", label: "UPI", desc: "GPay, PhonePe, Paytm" },
                  { id: "COD", label: "Cash on Delivery", desc: "Pay at Doorstep" },
                  { id: "Card", label: "Card / NetBanking", desc: "Visa, Master, RuPay" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      paymentMethod === opt.id
                        ? "border-[#7B3D14] bg-[#FCF3ED] shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-bold text-xs text-[#341B09]">{opt.label}</div>
                    <div className="text-[10px] text-[#341B09]/60 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-[#FCF3ED]/70 rounded-2xl border border-[#7B3D14]/15 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#341B09]/70">
                <span>Items ({cart.length})</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#341B09]/70">
                <span>Pan-India Delivery</span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? "FREE Express" : "₹99"}
                </span>
              </div>
              <div className="pt-2 flex justify-between font-extrabold text-sm text-[#341B09] border-t border-[#7B3D14]/10">
                <span>Grand Total</span>
                <span className="text-base text-[#7B3D14]">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 bg-[#7B3D14] hover:bg-[#5a2c0e] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7B3D14]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                "Submitting Order to Showroom..."
              ) : (
                <>
                  Confirm & Place Order (₹{grandTotal.toLocaleString("en-IN")}) <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
