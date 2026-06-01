import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory custom stocks store
let customStocksStore: any[] = [];

export async function GET() {
  return NextResponse.json({ custom: customStocksStore });
}

export async function PUT(req: Request) {
  const body = await req.json();
  customStocksStore = body.custom || [];
  return NextResponse.json({ success: true, custom: customStocksStore });
}
