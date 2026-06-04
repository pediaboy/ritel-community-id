import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  
  if (key) {
    // Get specific key
    const rows = await sb("GET", `/settings?key=eq.${encodeURIComponent(key)}&limit=1`);
    if (!rows || rows.length === 0) return NextResponse.json({ key, value: null });
    return NextResponse.json({ key, value: rows[0].value });
  }
  
  // Get all
  const rows = await sb("GET", "/settings");
  const result: any = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { key, value } = body;
  if (!key) return NextResponse.json({ success: false, error: "key required" }, { status: 400 });
  await sb("POST", "/settings", { key, value, updated_at: new Date().toISOString() }, 
    { "Prefer": "resolution=merge-duplicates,return=representation" });
  return NextResponse.json({ success: true });
}
