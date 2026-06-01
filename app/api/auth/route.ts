import { NextResponse } from "next/server";
import crypto from "crypto";

// In-memory token store (same as tokens API)
// In production: use DB
const ADMIN_CREDS = { username: "admin", password: "ritel2025" };

// Token store (shared mock — same data as /api/admin/tokens)
let userTokens: any[] = [
  {
    id: "1",
    email: "member@ritelcommunity.id",
    name: "Demo Member",
    package: "gold",
    token: "RC-GOLD-DEMO123456",
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "2",
    email: "vip@ritelcommunity.id",
    name: "VIP Elite Member",
    package: "elite",
    token: "RC-ELITE-VIP789ABC",
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

export async function POST(req: Request) {
  const body = await req.json();
  const { type, username, password, token } = body;

  // Admin login
  if (type === "admin") {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      return NextResponse.json({ success: true, role: "admin" });
    }
    return NextResponse.json({ success: false, message: "Username atau password salah." }, { status: 401 });
  }

  // Member login via token
  if (type === "member") {
    const found = userTokens.find(t => t.token === token?.trim().toUpperCase());
    if (!found) {
      return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." }, { status: 404 });
    }
    if (!found.isActive) {
      return NextResponse.json({ success: false, message: "Token tidak aktif. Hubungi admin." }, { status: 403 });
    }
    const expired = new Date(found.expiredAt) < new Date();
    if (expired) {
      return NextResponse.json({ success: false, message: "Token sudah expired. Perpanjang paket Anda." }, { status: 403 });
    }
    return NextResponse.json({
      success: true,
      role: "member",
      member: {
        id: found.id,
        name: found.name,
        email: found.email,
        package: found.package,
        expiredAt: found.expiredAt,
        token: found.token,
      },
    });
  }

  return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
}
