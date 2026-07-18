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

// Step 2 of registration: verify the OTP code that was emailed. On success the
// Supabase account becomes confirmed and from then on the user logs in with
// email + password via /api/auth/login (no OTP needed again).
export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const otp = (body.otp || "").trim();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "-";

  if (!email || !otp) {
    return NextResponse.json({ success: false, message: "Email dan kode OTP wajib diisi." });
  }

  const { ok, data } = await sbAuth("/verify", { email, token: otp, type: "signup" });

  if (!ok || !data?.access_token) {
    const msg = data?.msg || data?.error_description || "Kode OTP salah atau sudah kedaluwarsa.";
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
    await saveVipUsers(users);
    await sendTelegramNotif(`<b>USER BARU DAFTAR</b>\n\nEmail: ${email}\nWaktu: ${wib} WIB`);
  } else {
    record.last_login_at = new Date().toISOString();
    await saveVipUsers(users);
  }
  saveLoginLog(email, "register", ip);

  const userPayload = {
    email: record.email,
    name: record.name || email.split("@")[0],
    role: record.role || "free",
    package: record.role === "vip" ? (record.subscription || "gold") : "basic",
    expiredAt: record.expired_at,
    isNewUser: true,
  };

  return NextResponse.json({ success: true, user: userPayload, access_token: data.access_token });
}
