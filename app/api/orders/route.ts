import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getOrders(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.orders_data&limit=1");
  return rows[0]?.value || [];
}

async function saveOrders(orders: any[]) {
  await sb("POST", "/settings",
    { key: "orders_data", value: orders, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" }
  );
}

async function addMutasi(order: any) {
  try {
    const d = new Date();
    const key = `mutasi_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const rows = await sb("GET", `/settings?key=eq.${key}&limit=1`);
    const existing = rows[0]?.value || [];
    const newItem = {
      id: `mut-${order.id}`,
      date: new Date().toISOString().split("T")[0],
      description: `Order ${order.paket} - ${order.nama} (${order.metode || "-"})`,
      amount: order.harga,
      type: "income",
      order_id: order.id,
      created_at: new Date().toISOString(),
    };
    // Jangan duplikat
    const filtered = existing.filter((m: any) => m.order_id !== order.id);
    filtered.unshift(newItem);
    await sb("POST", "/settings",
      { key, value: filtered, updated_at: new Date().toISOString() },
      { Prefer: "resolution=merge-duplicates,return=representation" }
    );
  } catch {}
}

async function removeMutasi(orderId: string) {
  try {
    const d = new Date();
    const key = `mutasi_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const rows = await sb("GET", `/settings?key=eq.${key}&limit=1`);
    const existing = rows[0]?.value || [];
    const filtered = existing.filter((m: any) => m.order_id !== orderId);
    await sb("POST", "/settings",
      { key, value: filtered, updated_at: new Date().toISOString() },
      { Prefer: "resolution=merge-duplicates,return=representation" }
    );
  } catch {}
}

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "create") {
    const { nama, hp, paket, harga, metode } = body;
    if (!nama || !hp || !paket || !harga) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" });
    }

    const orders = await getOrders();
    const invoiceNum = `INV-${Date.now().toString().slice(-8)}`;
    const newOrder = {
      id: invoiceNum,
      nama,
      hp,
      paket,
      harga: Number(harga),
      metode: metode || "-",
      status: "pending",
      created_at: new Date().toISOString(),
      paid_at: null,
      note: "",
    };
    orders.unshift(newOrder);
    await saveOrders(orders);

    return NextResponse.json({ success: true, order: newOrder });
  }

  if (action === "update_status") {
    const { id, status, note, metode } = body;
    const orders = await getOrders();
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx === -1) return NextResponse.json({ success: false, message: "Order tidak ditemukan" });

    const prev = orders[idx].status;
    orders[idx].status = status || orders[idx].status;
    if (note !== undefined) orders[idx].note = note;
    if (metode !== undefined) orders[idx].metode = metode;
    if (status === "paid") {
      orders[idx].paid_at = new Date().toISOString();
      // Auto tambah mutasi ketika paid
      await addMutasi(orders[idx]);
    }
    // Kalau di-cancel setelah paid, hapus mutasi
    if (status === "cancelled" && prev === "paid") {
      await removeMutasi(id);
    }

    await saveOrders(orders);
    return NextResponse.json({ success: true, order: orders[idx] });
  }

  if (action === "delete") {
    const { id } = body;
    const orders = await getOrders();
    const found = orders.find((o: any) => o.id === id);
    const filtered = orders.filter((o: any) => o.id !== id);
    await saveOrders(filtered);
    // Hapus mutasi terkait juga
    if (found) await removeMutasi(id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenal" });
}
