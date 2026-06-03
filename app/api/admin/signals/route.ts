import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const signals = await sb("GET", "/signals?order=created_at.desc");
    return NextResponse.json({ signals: signals || [] });
  } catch {
    return NextResponse.json({ signals: [] });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const row: any = {
    id: body.id || Date.now().toString(),
    saham: body.saham || "",
    kode: body.kode || "",
    action: body.action || "BUY",
    entry: body.entry || "",
    tp: body.tp || "",
    sl: body.sl || "",
    notes: body.notes || "",
    package: body.package || ["gold","pro","platinum","elite"],
    created_at: new Date().toISOString(),
  };
  // Optional fields
  if (body.is_bagger !== undefined) row.is_bagger = body.is_bagger;
  if (body.is_bandar !== undefined) row.is_bandar = body.is_bandar;
  if (body.is_done !== undefined) row.is_done = body.is_done;
  if (body.done_at !== undefined) row.done_at = body.done_at;
  if (body.category !== undefined) row.category = body.category;

  try {
    const result = await sb("POST", "/signals", row);
    return NextResponse.json({ success: true, signal: result[0] || row });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
  const updateData: any = {};
  if (data.saham !== undefined) updateData.saham = data.saham;
  if (data.kode !== undefined) updateData.kode = data.kode;
  if (data.action !== undefined) updateData.action = data.action;
  if (data.entry !== undefined) updateData.entry = data.entry;
  if (data.tp !== undefined) updateData.tp = data.tp;
  if (data.sl !== undefined) updateData.sl = data.sl;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.package !== undefined) updateData.package = data.package;
  if (data.is_bagger !== undefined) updateData.is_bagger = data.is_bagger;
  if (data.is_bandar !== undefined) updateData.is_bandar = data.is_bandar;
  if (data.is_done !== undefined) updateData.is_done = data.is_done;
  if (data.done_at !== undefined) updateData.done_at = data.done_at;
  if (data.category !== undefined) updateData.category = data.category;
  
  try {
    await sb("PATCH", `/signals?id=eq.${id}`, updateData);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await sb("DELETE", `/signals?id=eq.${id}`);
  return NextResponse.json({ success: true });
}
