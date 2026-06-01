import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const rows = await sb("GET", `/tokens?token=eq.${encodeURIComponent(token)}&limit=1`);
  const found = rows[0];

  if (!found) return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." });
  if (!found.is_active) return NextResponse.json({ success: false, message: "Token dinonaktifkan. Hubungi admin." });
  if (new Date(found.expired_at) < new Date()) return NextResponse.json({ success: false, message: "Token sudah expired. Hubungi admin untuk perpanjangan." });

  return NextResponse.json({
    success: true,
    user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at },
  });
}
