import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sb("GET", "/liveinfo?id=eq.1");
  const liveInfo = rows[0] || { id: "1", message: "", is_active: false };
  return NextResponse.json({ liveInfo: { ...liveInfo, isActive: liveInfo.is_active } });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = {
    id: "1",
    message: body.message || "",
    is_active: body.isActive !== undefined ? body.isActive : (body.is_active || false),
    updated_at: new Date().toISOString(),
  };
  // Upsert
  await sb("POST", "/liveinfo", data, { "Prefer": "resolution=merge-duplicates,return=representation" });
  return NextResponse.json({ success: true, liveInfo: data });
}
