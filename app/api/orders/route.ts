import { NextResponse } from "next/server";
import { sb, getVipUsers, saveVipUsers } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

// Aktivasi VIP untuk user (keyed by email) di settings key "vip_users"
async function activateVipForOrder(order: any): Promise<boolean> {
  const email = (order.email || "").trim().toLowerCase();
  if (!email) return false; // butuh email untuk login OTP - tidak bisa auto-aktivasi tanpa email

  const now = new Date();
  const expiredAt = new Date(now);
  expiredAt.setMonth(expiredAt.getMonth() + 1); // default 1 bulan

  const users = await getVipUsers();
  const idx = users.findIndex((u: any) => u.email === email);
  const record = {
    auth_user_id: idx >= 0 ? users[idx].auth_user_id || null : null,
    email,
    name: order.nama,
    role: "vip",
    subscription: (order.paket || "basic").toLowerCase(),
    expired_at: expiredAt.toISOString(),
    hp: order.hp || "",
    source: order.source || "ritel",
    order_id: order.id,
    created_at: idx >= 0 ? users[idx].created_at : now.toISOString(),
    last_login_at: idx >= 0 ? users[idx].last_login_at : null,
  };
  if (idx >= 0) users[idx] = { ...users[idx], ...record };
  else users.push(record);
  await saveVipUsers(users);
  return true;
}

async function deactivateVipForOrder(orderId: string) {
  try {
    const users = await getVipUsers();
    const idx = users.findIndex((u: any) => u.order_id === orderId);
    if (idx >= 0) {
      users[idx].role = "free";
      users[idx].subscription = "basic";
      await saveVipUsers(users);
    }
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
      vip_activated: false,
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

      // Auto-aktivasi VIP (role=vip) jika belum
      if (!orders[idx].vip_activated) {
        try {
          const activated = await activateVipForOrder(orders[idx]);
          orders[idx].vip_activated = activated;

          // Notif Telegram ke admin
          const chatRows = await sb("GET", "/settings?key=eq.telegram_admin_chat_id&limit=1");
          const chatId = chatRows[0]?.value;
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (chatId && botToken) {
            const src = orders[idx].source === "analisis" ? "[analisis.io] " : "";
            const emailNote = activated
              ? `Akun VIP aktif untuk email: <code>${orders[idx].email}</code>\n<i>User tinggal login pakai email + kode OTP di /login</i>`
              : `<b>PERHATIAN:</b> order ini tidak punya email — VIP belum bisa diaktivasi otomatis, hubungi customer untuk minta email lalu aktivasi manual di Admin &gt; User VIP.`;
            const msg = ` <b>${src}PEMBAYARAN DIKONFIRMASI</b>\n\n ${orders[idx].nama}\n Paket: <b>${orders[idx].paket}</b>\n WA: ${orders[idx].hp}\n ${orders[idx].harga?.toLocaleString("id-ID")}\n\n${emailNote}`;
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method:"POST", headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ chat_id:chatId, text:msg, parse_mode:"HTML" }),
            }).catch(()=>{});
          }
        } catch (e) {
          console.error("VIP activation error:", e);
        }
      }
    }

    if (status === "cancelled" && prev === "paid") {
      await removeMutasi(id);
      if (orders[idx].vip_activated) {
        await deactivateVipForOrder(id);
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
