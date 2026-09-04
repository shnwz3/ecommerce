import { NextResponse } from "next/server";
import { getStoredOrders, storeNewOrder, updateStoredOrderStatus, updateStoredOrderPayment } from "@/lib/orders-store";
import { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = getStoredOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      items,
      total,
      subtotal,
      shipping_fee,
      discount,
      shipping_address,
      city,
      state,
      pincode,
      payment_method,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required delivery and contact details." },
        { status: 400 }
      );
    }

    const newOrder = storeNewOrder({
      customer_name: customer_name.trim(),
      customer_email: (customer_email || "customer@shopin.com").trim(),
      customer_phone: customer_phone.trim(),
      items,
      total: Number(total),
      subtotal: Number(subtotal),
      shipping_fee: Number(shipping_fee || 0),
      discount: Number(discount || 0),
      status: "pending",
      shipping_address: shipping_address.trim(),
      city: (city || "Store City").trim(),
      state: (state || "State").trim(),
      pincode: (pincode || "500001").trim(),
      payment_method: payment_method || "COD",
      payment_status: payment_method === "COD" ? "pending" : "paid",
      transaction_id:
        payment_method === "UPI"
          ? `UPI-${Date.now().toString().slice(-8)}`
          : payment_method === "Card"
          ? `TXN-CARD-${Date.now().toString().slice(-6)}`
          : undefined,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, payment_status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    let updated: Order | null = null;

    if (status) {
      updated = updateStoredOrderStatus(orderId, status);
    }

    if (payment_status) {
      updated = updateStoredOrderPayment(orderId, payment_status);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
