import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_SERVICE_KEY, getVipUsers } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Lightweight, always-fresh profile check. Unlike /api/auth/refresh (which
// rotates the Supabase refresh_token and should only be called when the JWT
// is actually about to expire), this just validates the CURRENT access_token
// and re-reads the live vip_users record — safe to call on every single page
// load. This is what keeps a user's VIP status in sync with what the admin
// panel sets, instead of only re-syncing once an hour on token refresh.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const access_token = (body.access_token || "").trim();

  if (!access_token) {
    return NextResponse.json({ success: false, message: "access_token wajib diisi." }, { status: 400 });
  }

  // Validate the token & get the authenticated email directly from Supabase Auth
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!authRes.ok) {
    return NextResponse.json({ success: false, message: "Sesi tidak valid." }, { status: 401 });
  }

  const authUser = await authRes.json();
  const email = (authUser?.email || "").toLowerCase();
  if (!email) {
    return NextResponse.json({ success: false, message: "Sesi tidak valid." }, { status: 401 });
  }

  const users = await getVipUsers();
  const record = users.find((u: any) => u.email === email);

  let role = record?.role || "free";
  let subscription = record?.subscription || "basic";
  // Respect expiry even if admin forgot to flip role back manually
  if (record?.expired_at && new Date(record.expired_at) < new Date()) {
    role = "free";
    subscription = "basic";
  }

  const userPayload = {
    email,
    name: record?.name || email.split("@")[0],
    role,
    package: role === "vip" ? subscription : "basic",
    expiredAt: record?.expired_at || null,
  };

  return NextResponse.json({ success: true, user: userPayload });
}
