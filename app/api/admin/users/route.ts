import { NextResponse } from "next/server";
import { getVipUsers, saveVipUsers } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = await getVipUsers();
  return NextResponse.json({ users });
}

// Update a single user's role/subscription/expiry (admin only)
export async function PUT(req: Request) {
  const body = await req.json();
  const { email, role, subscription, expiredAt } = body;
  if (!email) return NextResponse.json({ success: false, message: "email wajib diisi." }, { status: 400 });

  const users = await getVipUsers();
  const idx = users.findIndex((u: any) => u.email === email);
  if (idx < 0) return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });

  if (role !== undefined) users[idx].role = role;
  if (subscription !== undefined) users[idx].subscription = subscription;
  if (expiredAt !== undefined) users[idx].expired_at = expiredAt || null;

  await saveVipUsers(users);
  return NextResponse.json({ success: true, user: users[idx] });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ success: false, message: "email wajib diisi." }, { status: 400 });

  const users = await getVipUsers();
  const filtered = users.filter((u: any) => u.email !== email);
  await saveVipUsers(filtered);
  return NextResponse.json({ success: true });
}
