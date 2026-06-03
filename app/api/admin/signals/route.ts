import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Encode extra fields ke notes sebagai hidden JSON suffix
function encodeMeta(body: any, notesText: string): string {
  const meta: any = {};
  const extras = ["tp2","tp3","is_tomorrow","is_pinned","is_done","category","done_at"];
  for (const k of extras) {
    if (body[k] !== undefined) meta[k] = body[k];
  }
  if (Object.keys(meta).length === 0) return notesText;
  return notesText + "\n__META__:" + JSON.stringify(meta);
}

// Decode meta dari notes field
function decodeMeta(row: any): any {
  const notes: string = row.notes || "";
  const idx = notes.lastIndexOf("\n__META__:");
  if (idx === -1) return row;
  const plainNotes = notes.slice(0, idx);
  try {
    const meta = JSON.parse(notes.slice(idx + 10));
    return { ...row, notes: plainNotes, ...meta };
  } catch { return row; }
}

export async function GET() {
  try {
    const signals = await sb("GET", "/signals?order=created_at.desc");
    return NextResponse.json({ signals: (signals || []).map(decodeMeta) });
  } catch {
    return NextResponse.json({ signals: [] });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const notesText = body.notes || "";
  const row: any = {
    id: body.id || Date.now().toString(),
    saham: body.saham || "",
    kode: body.kode || "",
    action: body.action || "BUY",
    entry: body.entry || "",
    tp: body.tp || "",
    sl: body.sl || "",
    notes: encodeMeta(body, notesText),
    package: body.package || ["gold","pro","platinum","elite"],
    created_at: new Date().toISOString(),
  };

  try {
    const result = await sb("POST", "/signals", row);
    return NextResponse.json({ success: true, signal: decodeMeta(result[0] || row) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let existingNotes = "";
  try {
    const rows = await sb("GET", `/signals?id=eq.${id}&limit=1`);
    existingNotes = rows[0]?.notes || "";
    const metaIdx = existingNotes.lastIndexOf("\n__META__:");
    if (metaIdx !== -1) existingNotes = existingNotes.slice(0, metaIdx);
  } catch {}

  const notesText = data.notes !== undefined ? (data.notes || "") : existingNotes;
  const updateData: any = {};
  if (data.saham !== undefined) updateData.saham = data.saham;
  if (data.kode !== undefined) updateData.kode = data.kode;
  if (data.action !== undefined) updateData.action = data.action;
  if (data.entry !== undefined) updateData.entry = data.entry;
  if (data.tp !== undefined) updateData.tp = data.tp;
  if (data.sl !== undefined) updateData.sl = data.sl;
  if (data.package !== undefined) updateData.package = data.package;
  updateData.notes = encodeMeta(data, notesText);

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
