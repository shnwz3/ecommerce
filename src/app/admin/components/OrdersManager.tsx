"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Eye,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  X,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  Check,
} from "lucide-react";
import { Order } from "@/lib/types";

interface OrdersManagerProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: Order["status"]) => void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: NonNullable<Order["payment_status"]>) => void;
}

const ORDER_STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-800", icon: Clock },
  processing: { label: "Processing", bg: "bg-blue-100", text: "text-blue-800", icon: ShoppingBag },
  shipped: { label: "Shipped", bg: "bg-purple-100", text: "text-purple-800", icon: Truck },
  delivered: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800", icon: XCircle },
};

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders: initialOrders,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Financial Stats
  const financials = useMemo(() => {
    let collectedOnline = 0;
    let pendingCod = 0;
    orders.forEach((o) => {
      const isPaid = o.payment_status === "paid" || (o.payment_method !== "COD" && o.status !== "cancelled");
      if (isPaid) {
        collectedOnline += o.total;
      } else if (o.payment_method === "COD" && o.status !== "cancelled") {
        pendingCod += o.total;
      }
    });
    return {
      collectedOnline,
      pendingCod,
      totalRevenue: collectedOnline + pendingCod,
      totalOrders: orders.length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone.includes(searchQuery) ||
        (order.transaction_id && order.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const isPaid = order.payment_status === "paid" || order.payment_method !== "COD";
      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && isPaid) ||
        (paymentFilter === "pending" && !isPaid) ||
        order.payment_method === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
    }
  };

  const handleMarkAsPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              payment_status: "paid",
              transaction_id: ord.transaction_id || `COD-PAID-${Date.now().toString().slice(-6)}`,
            }
          : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              payment_status: "paid",
              transaction_id: prev.transaction_id || `COD-PAID-${Date.now().toString().slice(-6)}`,
            }
          : null
      );
    }
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(orderId, "paid");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#341B09]">
            Orders & Payment Verification
          </h1>
          <p className="text-sm text-[#341B09]/60 mt-1">
            Review customer orders, check payment status (UPI, Card, COD), and update fulfillment
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/60 shadow-sm bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Verified Payments (Prepaid)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif-heading text-2xl font-bold text-emerald-900 mt-2">
            ₹{financials.collectedOnline.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700/70 mt-1 font-medium">
            UPI, Cards & NetBanking transactions
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-sm bg-gradient-to-br from-white to-amber-50/20">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>COD Pending on Delivery</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif-heading text-2xl font-bold text-amber-900 mt-2">
            ₹{financials.pendingCod.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-amber-700/70 mt-1 font-medium">
            Cash to collect from customer at doorstep
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#7B3D14]/15 shadow-sm bg-gradient-to-br from-white to-[#FCF3ED]/30">
          <div className="flex items-center justify-between text-xs font-semibold text-[#341B09]">
            <span>Total Gross Order Value</span>
            <ShoppingBag className="w-4 h-4 text-[#7B3D14]" />
          </div>
          <div className="font-serif-heading text-2xl font-bold text-[#341B09] mt-2">
            ₹{financials.totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#341B09]/60 mt-1 font-medium">
            Across {financials.totalOrders} total store orders
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Order Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#7B3D14]/10">
          {(
            [
              { id: "all", label: "All Orders" },
              { id: "pending", label: "Pending" },
              { id: "processing", label: "Processing" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-[#341B09] text-white shadow-md shadow-[#341B09]/15"
                  : "bg-white text-[#341B09]/70 hover:bg-[#FCF3ED] border border-[#7B3D14]/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Payment Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[#341B09]/60 text-[11px] font-semibold flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#7B3D14]" /> Payment:
            </span>
            {(
              [
                { id: "all", label: "All Methods" },
                { id: "paid", label: "Paid" },
                { id: "pending", label: "COD Pending" },
                { id: "UPI", label: "UPI" },
                { id: "COD", label: "COD" },
                { id: "Card", label: "Card" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPaymentFilter(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  paymentFilter === p.id
                    ? "bg-[#7B3D14] text-white"
                    : "bg-white text-[#341B09]/70 hover:bg-[#FCF3ED] border border-[#7B3D14]/10"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#341B09]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order #, customer, txn ID, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#7B3D14]/15 text-xs text-[#341B09] placeholder:text-[#341B09]/40 focus:outline-none focus:border-[#7B3D14]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#7B3D14]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FCF3ED]/60 border-b border-[#7B3D14]/10 text-[11px] font-bold text-[#341B09]/70 uppercase tracking-wider">
                <th className="px-5 py-3.5">Order / Date</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Payment Verification</th>
                <th className="px-5 py-3.5">Fulfillment Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7B3D14]/5 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#341B09]/50">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#7B3D14]/30" />
                    {orders.length === 0
                      ? "No customer orders placed yet. New orders from the storefront will appear here."
                      : "No orders found matching your search."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = ORDER_STATUS_CONFIG[order.status];
                  const isPaid = order.payment_status === "paid" || (order.payment_method !== "COD" && order.status !== "cancelled");
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FCF3ED]/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#341B09]">
                        {order.order_number}
                        <div className="text-[10px] font-normal text-[#341B09]/50 font-sans mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#341B09]">{order.customer_name}</div>
                        <div className="text-[11px] text-[#341B09]/60">{order.customer_phone}</div>
                        <div className="text-[10px] text-[#341B09]/40">{order.city}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-10 rounded bg-[#FCF3ED] overflow-hidden shrink-0 border border-[#7B3D14]/10">
                            {order.items[0]?.product_image && (
                              <Image
                                src={order.items[0].product_image}
                                alt={order.items[0].product_name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="truncate max-w-[150px] font-medium text-[#341B09]">
                              {order.items[0]?.product_name}
                            </div>
                            <div className="text-[10px] text-[#341B09]/50">
                              Size: {order.items[0]?.size} {order.items.length > 1 ? `(+${order.items.length - 1} more)` : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#341B09]">
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isPaid
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isPaid ? "PAID" : "COD PENDING"}
                            </span>
                            <span className="text-[10px] text-[#341B09]/60 font-semibold">
                              via {order.payment_method}
                            </span>
                          </div>
                          {order.transaction_id && (
                            <div className="text-[10px] font-mono text-[#341B09]/50">
                              {order.transaction_id}
                            </div>
                          )}
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkAsPaid(order.id)}
                              className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold underline flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Mark as Received
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order["status"])
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold appearance-none pr-6 cursor-pointer border border-black/5 focus:outline-none focus:ring-1 focus:ring-[#7B3D14] ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg text-[#341B09]/60 hover:text-[#7B3D14] hover:bg-[#FCF3ED] transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C59A4E]/20 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#7B3D14]/10">
              <div>
                <span className="text-xs font-mono text-[#7B3D14] font-bold">
                  {selectedOrder.order_number}
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-[#341B09]">
                  Order & Payment Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-[#341B09]/50 hover:text-[#341B09] hover:bg-[#FCF3ED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment & Status Banner */}
            <div className="p-4 bg-[#FCF3ED] rounded-2xl border border-[#7B3D14]/15 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-[#341B09]/50 font-bold uppercase tracking-wider">
                    Payment Status
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.payment_status === "paid" || selectedOrder.payment_method !== "COD"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {selectedOrder.payment_status === "paid" || selectedOrder.payment_method !== "COD"
                        ? "PAID ONLINE"
                        : "COD PENDING"}
                    </span>
                    <span className="text-xs font-semibold text-[#341B09]">
                      via {selectedOrder.payment_method}
                    </span>
                  </div>
                </div>

                {selectedOrder.payment_method === "COD" && selectedOrder.payment_status !== "paid" && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedOrder.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Mark Payment Received
                  </button>
                )}
              </div>

              {selectedOrder.transaction_id && (
                <div className="text-xs text-[#341B09]/70 pt-2 border-t border-[#7B3D14]/10">
                  <span className="font-semibold">Transaction Reference:</span>{" "}
                  <span className="font-mono">{selectedOrder.transaction_id}</span>
                </div>
              )}
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-[#7B3D14]/10 space-y-2">
                <h3 className="text-xs font-bold text-[#341B09] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7B3D14]" /> Customer Info
                </h3>
                <p className="font-semibold text-sm text-[#341B09]">{selectedOrder.customer_name}</p>
                <p className="text-xs text-[#341B09]/70 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#341B09]/40" /> {selectedOrder.customer_email}
                </p>
                <p className="text-xs text-[#341B09]/70 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#341B09]/40" /> {selectedOrder.customer_phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#7B3D14]/10 space-y-2">
                <h3 className="text-xs font-bold text-[#341B09] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#7B3D14]" /> Delivery Address
                </h3>
                <p className="text-xs text-[#341B09]/80 leading-relaxed">
                  {selectedOrder.shipping_address}, {selectedOrder.city},{" "}
                  {selectedOrder.state} - {selectedOrder.pincode}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#341B09] uppercase tracking-wider">
                Purchased Items ({selectedOrder.items.length})
              </h3>
              <div className="divide-y divide-[#7B3D14]/10 border border-[#7B3D14]/10 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg bg-[#FCF3ED] overflow-hidden border border-[#7B3D14]/10 shrink-0">
                        {item.product_image && (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#341B09]">{item.product_name}</div>
                        <div className="text-[11px] text-[#341B09]/60 mt-0.5">
                          Size: {item.size} • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-xs text-[#341B09]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-[#FCF3ED]/60 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-[#341B09]/70">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{selectedOrder.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[#341B09]/70">
                <span>Shipping</span>
                <span>{selectedOrder.shipping_fee === 0 ? "FREE" : `₹${selectedOrder.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#341B09] pt-2 border-t border-[#7B3D14]/10">
                <span>Total Payable</span>
                <span>₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
