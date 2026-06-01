import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const signals = await sb("GET", "/signals?order=created_at.desc");
  return NextResponse.json({ signals });
}

export async function POST(req: Request) {
  const body = await req.json();
  const row = {
    id: body.id || Date.now().toString(),
    saham: body.saham || "",
    kode: body.kode || "",
    action: body.action || "BUY",
    entry: body.entry || "",
    tp: body.tp || "",
    sl: body.sl || "",
    notes: body.notes || "",
    package: body.package || ["gold","pro","platinum","elite"],
  };
  const result = await sb("POST", "/signals", row);
  return NextResponse.json({ success: true, signal: result[0] || row });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  await sb("PATCH", `/signals?id=eq.${id}`, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await sb("DELETE", `/signals?id=eq.${id}`);
  return NextResponse.json({ success: true });
}
