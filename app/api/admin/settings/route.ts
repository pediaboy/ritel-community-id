import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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
  await sb("POST", "/settings", { key, value, updated_at: new Date().toISOString() }, 
    { "Prefer": "resolution=merge-duplicates,return=representation" });
  return NextResponse.json({ success: true });
}
