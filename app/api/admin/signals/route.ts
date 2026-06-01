import { NextResponse } from "next/server";
import { store } from "@/lib/adminStore";

export async function GET() {
  return NextResponse.json({ signals: store.signals });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newSignal = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  store.signals.unshift(newSignal);
  return NextResponse.json({ success: true, signal: newSignal });
}

export async function PUT(req: Request) {
  const body = await req.json();
  store.signals = store.signals.map(s => s.id === body.id ? { ...s, ...body } : s);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  store.signals = store.signals.filter(s => s.id !== id);
  return NextResponse.json({ success: true });
}
