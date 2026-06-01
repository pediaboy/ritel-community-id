import { NextResponse } from "next/server";
import { serverStore } from "@/app/api/admin/sync/route";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const found = serverStore.tokens.find((t: any) => t.token === token);

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
    user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expiredAt },
  });
}
