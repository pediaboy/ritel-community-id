import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const custom = await sb("GET", "/custom_stocks?order=kode.asc");
  return NextResponse.json({ custom });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const newStocks: any[] = body.custom || [];
  // Delete all then insert
  await sb("DELETE", "/custom_stocks?id=neq.NONE");
  if (newStocks.length > 0) {
    const rows = newStocks.map((s: any) => ({
      id: s.id || Date.now().toString() + Math.random(),
      kode: s.kode || "",
      name: s.name || "",
      price: s.price?.toString() || "",
      change_percent: s.changePercent?.toString() || s.change_percent?.toString() || "",
    }));
    await sb("POST", "/custom_stocks", rows);
  }
  return NextResponse.json({ success: true, custom: newStocks });
}
