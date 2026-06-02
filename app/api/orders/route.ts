import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

interface OrderPayload {
  name: string;
  phone: string;
  packageId: string;
  packageName: string;
  packagePrice: string;
  paymentMethod: string;
  invoiceId: string;
  status: "pending" | "confirmed" | "completed";
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();

    if (!body.name || !body.phone || !body.packageId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Simpan order ke table "orders"
    const orderData = {
      name: body.name,
      phone: body.phone,
      package_id: body.packageId,
      package_name: body.packageName,
      package_price: parseInt(body.packagePrice.replace(/[^\d]/g, "")),
      payment_method: body.paymentMethod,
      invoice_id: body.invoiceId,
      status: body.status,
      created_at: new Date().toISOString(),
    };

    const result = await sb("POST", "/orders", orderData);

    // 2. Auto-add income ke mutasi jika status bukan pending
    if (body.status === "confirmed" || body.status === "completed") {
      const today = new Date().toISOString().split("T")[0];
      const price = parseInt(body.packagePrice.replace(/[^\d]/g, ""));

      const mutasiData = {
        date: today,
        description: `Pembelian paket ${body.packageName} - ${body.name}`,
        amount: price,
        type: "income",
        order_id: body.invoiceId,
      };

      await sb("POST", "/mutasi", mutasiData);
    }

    return NextResponse.json({ success: true, order: result }, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orders = await sb("GET", "/orders?order=created_at.desc");
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
