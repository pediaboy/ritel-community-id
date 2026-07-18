import { NextResponse } from "next/server";
import { sbAuth, getVipUsers, saveVipUsers, sendTelegramNotif, sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function saveLoginLog(email: string, event: "register" | "login", ip: string) {
  try {
    const rows = await sb("GET", "/settings?key=eq.login_logs&limit=1");
    const existing: any[] = rows[0]?.value || [];
    const newLog = { id: Date.now().toString(), email, event, ip, time: new Date().toISOString() };
    const updated = [newLog, ...existing].slice(0, 50);
    await sb("POST", "/settings", { key: "login_logs", value: updated, updated_at: new Date().toISOString() }, { Prefer: "resolution=merge-duplicates,return=representation" });
  } catch {}
}

// Regular login for already-verified accounts: email + password, no OTP.
export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const password = (body.password || "").trim();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "-";

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email dan kata sandi wajib diisi." });
  }

  const { ok, data } = await sbAuth("/token?grant_type=password", { email, password });

  if (!ok || !data?.access_token) {
    const msg = data?.error_description || data?.msg || "Email atau kata sandi salah.";
    if (/not confirmed/i.test(msg)) {
      return NextResponse.json({
        success: false,
        message: "Email belum diverifikasi. Silakan daftar ulang untuk menerima kode OTP baru.",
        needsVerification: true,
      });
    }
    return NextResponse.json({ success: false, message: msg });
  }

  const users = await getVipUsers();
  let record = users.find((u: any) => u.email === email);
  const wib = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } as any);

  if (!record) {
    record = {
      auth_user_id: data.user?.id || null,
      email,
      role: "free",
      subscription: "basic",
      expired_at: null,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };
    users.push(record);
  } else {
    record.last_login_at = new Date().toISOString();
    if (record.expired_at && new Date(record.expired_at) < new Date()) {
      record.role = "free";
      record.subscription = "basic";
    }
  }
  await saveVipUsers(users);
  await sendTelegramNotif(`<b>USER LOGIN</b>\n\nEmail: ${email}\nRole: ${(record.role || "free").toUpperCase()}\nWaktu: ${wib} WIB`);
  saveLoginLog(email, "login", ip);

  const userPayload = {
    email: record.email,
    name: record.name || email.split("@")[0],
    role: record.role || "free",
    package: record.role === "vip" ? (record.subscription || "gold") : "basic",
    expiredAt: record.expired_at,
    isNewUser: false,
  };

  return NextResponse.json({
    success: true,
    user: userPayload,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in || 3600,
  });
}
