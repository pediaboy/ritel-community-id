import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function sendTelegramNotif(name: string, pkg: string, token: string, ip: string) {
  try {
    const chatRows = await sb("GET", "/settings?key=eq.telegram_admin_chat_id&limit=1");
    const chatId = chatRows[0]?.value;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!chatId || !botToken) return;
    const wib = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" } as any);
    const msg = `🔐 <b>LOGIN BARU — ${pkg.toUpperCase()}</b>\n\n👤 <b>${name}</b>\n🌐 IP: ${ip}\n🎟 Token: ...${token.slice(-8)}\n⏰ ${wib}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
    }).catch(() => {});
  } catch {}
}

async function saveLoginLog(name: string, pkg: string, token: string, ip: string) {
  try {
    const rows = await sb("GET", "/settings?key=eq.login_logs&limit=1");
    const existing: any[] = rows[0]?.value || [];
    const newLog = { id: Date.now().toString(), name, package: pkg, token: token.slice(-8), ip, time: new Date().toISOString() };
    const updated = [newLog, ...existing].slice(0, 50);
    await sb("POST", "/settings", { key: "login_logs", value: updated, updated_at: new Date().toISOString() }, { Prefer: "resolution=merge-duplicates,return=representation" });
  } catch {}
}

export async function POST(req: Request) {
  const body = await req.json();
  const { token, action, isNewLogin } = body;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "-";

  // LOGOUT
  if (action === "logout") {
    return NextResponse.json({ success: true });
  }

  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const rows = await sb("GET", `/tokens?token=eq.${encodeURIComponent(token)}&limit=1`);
  const found = rows[0];

  if (!found) return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." });
  if (!found.is_active) return NextResponse.json({ success: false, message: "Token dinonaktifkan. Hubungi admin." });
  if (found.expired_at && new Date(found.expired_at) < new Date()) return NextResponse.json({ success: false, message: "Token sudah expired. Hubungi admin untuk perpanjangan." });

  const userPayload = { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at };

  // Only log + notify on actual new login (not re-verify on page load)
  if (isNewLogin) {
    saveLoginLog(found.name, found.package, token, ip);
    sendTelegramNotif(found.name, found.package, token, ip);
  }

  return NextResponse.json({ success: true, user: userPayload });
}
