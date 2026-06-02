import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function genSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function clearSession(tokenId: string) {
  await sb("DELETE", `/settings?key=eq.session_${tokenId}`);
}

async function logAndNotify(name: string, pkg: string, token: string, ip: string) {
  try {
    const rows = await sb("GET", "/settings?key=eq.login_logs&limit=1");
    const existing: any[] = rows[0]?.value || [];
    const newLog = { id: Date.now().toString(), name, package: pkg, token: token.slice(-8), ip, time: new Date().toISOString() };
    const updated = [newLog, ...existing].slice(0, 50);
    await sb("POST", "/settings", { key: "login_logs", value: updated, updated_at: new Date().toISOString() }, { Prefer: "resolution=merge-duplicates,return=representation" });

    const chatRows = await sb("GET", "/settings?key=eq.telegram_admin_chat_id&limit=1");
    const chatId = chatRows[0]?.value;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (chatId && botToken) {
      const wib = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" } as any);
      const msg = `🔐 <b>LOGIN BARU — ${pkg.toUpperCase()}</b>\n\n👤 <b>${name}</b>\n🌐 IP: ${ip}\n🎟 Token: ...${token.slice(-8)}\n⏰ ${wib}`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
      }).catch(() => {});
    }
  } catch {}
}

export async function POST(req: Request) {
  const body = await req.json();
  const { token, action, tokenId } = body;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "-";

  // LOGOUT
  if (action === "logout" && tokenId) {
    await clearSession(tokenId);
    return NextResponse.json({ success: true });
  }

  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const rows = await sb("GET", `/tokens?token=eq.${encodeURIComponent(token)}&limit=1`);
  const found = rows[0];

  if (!found) return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." });
  if (!found.is_active) return NextResponse.json({ success: false, message: "Token dinonaktifkan. Hubungi admin." });
  if (found.expired_at && new Date(found.expired_at) < new Date()) return NextResponse.json({ success: false, message: "Token sudah expired. Hubungi admin untuk perpanjangan." });

  const userPayload = { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at };
  const newSession = genSessionId();

  // Semua role: unlimited device, tidak ada session check
  logAndNotify(found.name, found.package, token, ip);
  return NextResponse.json({ success: true, sessionId: newSession, tokenId: found.id, user: userPayload });
}
