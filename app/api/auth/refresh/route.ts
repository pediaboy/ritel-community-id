import { NextResponse } from "next/server";
import { sbAuth, getVipUsers } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Silently exchange a stored refresh_token for a new access_token, so a user's
// session survives past the ~1hr JWT expiry without ever having to re-enter
// their password (this is the actual mechanism behind "Ingat Saya" — the
// refresh_token itself is long-lived and only dies if explicitly revoked).
export async function POST(req: Request) {
  const body = await req.json();
  const refresh_token = (body.refresh_token || "").trim();

  if (!refresh_token) {
    return NextResponse.json({ success: false, message: "refresh_token wajib diisi." }, { status: 400 });
  }

  const { ok, data } = await sbAuth("/token?grant_type=refresh_token", { refresh_token });

  if (!ok || !data?.access_token) {
    return NextResponse.json({ success: false, message: "Sesi kedaluwarsa. Silakan masuk kembali." });
  }

  const email = (data.user?.email || "").toLowerCase();
  const users = await getVipUsers();
  const record = users.find((u: any) => u.email === email);

  const userPayload = {
    email,
    name: record?.name || email.split("@")[0],
    role: record?.role || "free",
    package: record?.role === "vip" ? (record?.subscription || "gold") : "basic",
    expiredAt: record?.expired_at || null,
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
