import { NextResponse } from "next/server";
import { store } from "@/lib/adminStore";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const found = store.tokens.find(t => t.token === token);

  if (!found) {
    return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." });
  }

  if (!found.isActive) {
    return NextResponse.json({ success: false, message: "Token dinonaktifkan. Hubungi admin." });
  }

  if (new Date(found.expiredAt) < new Date()) {
    return NextResponse.json({ success: false, message: "Token sudah expired. Hubungi admin untuk perpanjangan." });
  }

  return NextResponse.json({
    success: true,
    user: {
      name: found.name,
      email: found.email,
      package: found.package,
      expiredAt: found.expiredAt,
    },
  });
}
