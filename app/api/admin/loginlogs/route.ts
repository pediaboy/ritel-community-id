import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SETTINGS_KEY = "login_logs";
const MAX_LOGS = 50;
const SILVER_UP = ["silver","gold","pro","platinum","elite"];

export async function GET() {
  const rows = await sb("GET", `/settings?key=eq.${SETTINGS_KEY}&limit=1`);
  const logs = rows[0]?.value || [];
  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, pkg, token, ip } = body;

  if (!SILVER_UP.includes(pkg)) return NextResponse.json({ ok: true });

  // Get existing logs
  const rows = await sb("GET", `/settings?key=eq.${SETTINGS_KEY}&limit=1`);
  const existing: any[] = rows[0]?.value || [];

  const newLog = {
    id: Date.now().toString(),
    name: name || "Unknown",
    package: pkg,
    token: token?.slice(-8) || "???",
    ip: ip || "-",
    time: new Date().toISOString(),
  };

  const updated = [newLog, ...existing].slice(0, MAX_LOGS);

  await sb("POST", "/settings", { key: SETTINGS_KEY, value: updated, updated_at: new Date().toISOString() }, {
    Prefer: "resolution=merge-duplicates,return=representation",
  });

  // Also notify Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (botToken && chatId) {
    const msg = `🔐 <b>LOGIN BARU</b>\n\n👤 ${newLog.name}\n📦 ${newLog.package.toUpperCase()}\n🎟 ...${newLog.token}\n🌐 ${newLog.ip}\n⏰ ${new Date(newLog.time).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
