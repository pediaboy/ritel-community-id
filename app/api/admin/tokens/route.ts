import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const tokens = await sb("GET", "/tokens?order=created_at.desc");
  return NextResponse.json({ tokens });
}

export async function POST(req: Request) {
  const body = await req.json();
  const token = "RC-" + (body.package || "gold").toUpperCase() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const row = {
    id: Date.now().toString(),
    email: body.email || "",
    name: body.name || "",
    package: body.package || "gold",
    token,
    expired_at: body.expiredAt || body.expired_at || null,
    is_active: true,
  };
  const result = await sb("POST", "/tokens", row);
  return NextResponse.json({ success: true, token: result[0] || row });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const updateData: any = {};
  if (data.email !== undefined) updateData.email = data.email;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.package !== undefined) updateData.package = data.package;
  if (data.expiredAt !== undefined) updateData.expired_at = data.expiredAt;
  if (data.expired_at !== undefined) updateData.expired_at = data.expired_at;
  if (data.isActive !== undefined) updateData.is_active = data.isActive;
  if (data.is_active !== undefined) updateData.is_active = data.is_active;
  await sb("PATCH", `/tokens?id=eq.${id}`, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await sb("DELETE", `/tokens?id=eq.${id}`);
  return NextResponse.json({ success: true });
}
