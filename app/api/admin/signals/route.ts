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
    tp2: body.tp2 || "",
    tp3: body.tp3 || "",
    sl: body.sl || "",
    notes: body.notes || "",
    package: body.package || ["gold","pro","platinum","elite"],
    is_bagger: body.is_bagger || false,
    is_bandar: body.is_bandar || false,
    is_done: body.is_done || false,
    is_pinned: body.is_pinned || false,
    is_tomorrow: body.is_tomorrow || false,
    created_at: new Date().toISOString(),
  };

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
  const fields = ["saham","kode","action","entry","tp","tp2","tp3","sl","notes","package","is_bagger","is_bandar","is_done","is_pinned","is_tomorrow","done_at","category"];
  for (const f of fields) {
    if (data[f] !== undefined) updateData[f] = data[f];
  }
  
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
  try {
    await sb("DELETE", `/signals?id=eq.${id}`);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}
