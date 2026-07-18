import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function generateToken(pkg: string): string {
  const prefix = pkg.toUpperCase().slice(0, 2);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
  return `RC-${prefix}${seg()}-${seg()}-${seg()}`;
}

async function getOrders(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.orders_data&limit=1");
  return rows[0]?.value || [];
}

async function saveOrders(orders: any[]) {
  await sb("POST", "/settings",
    { key:"orders_data", value:orders, updated_at:new Date().toISOString() },
    { Prefer:"resolution=merge-duplicates,return=representation" }
  );
}

async function addMutasi(order: any) {
  try {
    const d = new Date();
    const key = `mutasi_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const rows = await sb("GET", `/settings?key=eq.${key}&limit=1`);
    const existing = rows[0]?.value || [];
    const src = order.source === "analisis" ? "[analisis.io] " : "";
    const newItem = {
      id: `mut-${order.id}`,
      date: new Date().toISOString().split("T")[0],
      description: `${src}Order ${order.paket} - ${order.nama} (${order.metode||"-"})`,
      amount: order.harga,
      type: "income",
      order_id: order.id,
      source: order.source || "ritel",
      created_at: new Date().toISOString(),
    };
    const filtered = existing.filter((m: any) => m.order_id !== order.id);
    filtered.unshift(newItem);
    await sb("POST", "/settings",
      { key, value:filtered, updated_at:new Date().toISOString() },
      { Prefer:"resolution=merge-duplicates,return=representation" }
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
      { key, value:filtered, updated_at:new Date().toISOString() },
      { Prefer:"resolution=merge-duplicates,return=representation" }
    );
  } catch {}
}

// Auto-create token di Supabase /tokens tabel
async function createVIPToken(order: any): Promise<string> {
  const token = generateToken(order.paket);
  const now = new Date();
  const expiredAt = new Date(now);
  expiredAt.setMonth(expiredAt.getMonth() + 1); // default 1 bulan

  await sb("POST", "/tokens", [{
    id: `tok-${order.id}`,
    email: order.email || "",
    name: order.nama,
    package: (order.paket || "basic").toLowerCase(),
    token,
    expired_at: expiredAt.toISOString(),
    is_active: true,
    verified: false,
    hp: order.hp || "",
    source: order.source || "ritel",
    order_id: order.id,
    created_at: now.toISOString(),
  }]);

  return token;
}

async function deactivateToken(tokenStr: string) {
  try {
    await sb("PATCH", `/tokens?token=eq.${encodeURIComponent(tokenStr)}`,
      { is_active:false }, { Prefer:"return=minimal" });
  } catch {}
}

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  // ── CREATE ────────────────────────────────────────────────────
  if (action === "create") {
    const { nama, hp, paket, harga, metode, email, note } = body;
    if (!nama || !hp || !paket || !harga) {
      return NextResponse.json({ success:false, message:"Data tidak lengkap" });
    }
    const orders = await getOrders();
    const invoiceNum = `INV-${Date.now().toString().slice(-8)}`;
    const newOrder = {
      id: invoiceNum,
      nama, hp, email:email||"", paket,
      harga: Number(harga),
      metode: metode||"-",
      status: "pending",
      note: note||"",
      source: "ritel",
      created_at: new Date().toISOString(),
      paid_at: null,
      token_generated: null,
    };
    orders.unshift(newOrder);
    await saveOrders(orders);
    return NextResponse.json({ success:true, order:newOrder });
  }

  // ── UPDATE STATUS ─────────────────────────────────────────────
  if (action === "update_status") {
    const { id, status, note, metode } = body;
    const orders = await getOrders();
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx === -1) return NextResponse.json({ success:false, message:"Order tidak ditemukan" });

    const prev = orders[idx].status;
    orders[idx].status = status || orders[idx].status;
    if (note !== undefined) orders[idx].note = note;
    if (metode !== undefined) orders[idx].metode = metode;

    if (status === "paid" && prev !== "paid") {
      orders[idx].paid_at = new Date().toISOString();
      await addMutasi(orders[idx]);

      // Auto-generate token jika belum ada
      if (!orders[idx].token_generated) {
        try {
          const token = await createVIPToken(orders[idx]);
          orders[idx].token_generated = token;

          // Notif Telegram ke admin
          const chatRows = await sb("GET", "/settings?key=eq.telegram_admin_chat_id&limit=1");
          const chatId = chatRows[0]?.value;
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (chatId && botToken) {
            const src = orders[idx].source === "analisis" ? "[analisis.io] " : "";
            const msg = ` <b>${src}PEMBAYARAN DIKONFIRMASI</b>\n\n ${orders[idx].nama}\n Paket: <b>${orders[idx].paket}</b>\n Token VIP: <code>${token}</code>\n WA: ${orders[idx].hp}\n ${orders[idx].harga?.toLocaleString("id-ID")}\n\n<i>Token aktif — bisa login di ritelcommunity.web.id/vip</i>`;
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method:"POST", headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ chat_id:chatId, text:msg, parse_mode:"HTML" }),
            }).catch(()=>{});
          }
        } catch (e) {
          console.error("Token generation error:", e);
        }
      }
    }

    if (status === "cancelled" && prev === "paid") {
      await removeMutasi(id);
      if (orders[idx].token_generated) {
        await deactivateToken(orders[idx].token_generated);
      }
    }

    await saveOrders(orders);
    return NextResponse.json({ success:true, order:orders[idx] });
  }

  // ── DELETE ────────────────────────────────────────────────────
  if (action === "delete") {
    const { id } = body;
    const orders = await getOrders();
    const found = orders.find((o: any) => o.id === id);
    const filtered = orders.filter((o: any) => o.id !== id);
    await saveOrders(filtered);
    if (found) await removeMutasi(id);
    return NextResponse.json({ success:true });
  }

  return NextResponse.json({ success:false, message:"Action tidak dikenal" }, { status:400 });
}
