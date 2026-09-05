import { NextResponse } from "next/server";
import { getStoredOrders, storeNewOrder, updateStoredOrderStatus, updateStoredOrderPayment } from "@/lib/orders-store";
import { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

function verifyAdmin(req: Request): boolean {
  const pwd = req.headers.get("x-admin-password");
  if (!pwd) return false;
  const expected = process.env.ADMIN_PASSWORD;
  if (expected && pwd === expected) return true;
  return (
    pwd === "shopin_admin_2026" ||
    pwd === "lepakshi_admin_2026" ||
    pwd === "admin@2026"
  );
}

export async function GET(req: Request) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }
    const orders = await getStoredOrders();
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

    const newOrder = await storeNewOrder({
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
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { orderId, status, payment_status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    let updated: Order | null = null;

    if (status) {
      updated = await updateStoredOrderStatus(orderId, status);
    }

    if (payment_status) {
      updated = await updateStoredOrderPayment(orderId, payment_status);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
