import { NextResponse } from "next/server";
import crypto from "crypto";
import { store } from "@/lib/adminStore";

export async function GET() {
  return NextResponse.json({ tokens: store.tokens });
}

export async function POST(req: Request) {
  const body = await req.json();
  const token = "RC-" + body.package.toUpperCase() + "-" + crypto.randomBytes(6).toString("hex").toUpperCase();
  const newToken = {
    ...body,
    id: Date.now().toString(),
    token,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  store.tokens.push(newToken);
  return NextResponse.json({ success: true, token: newToken });
}

export async function PUT(req: Request) {
  const body = await req.json();
  store.tokens = store.tokens.map(t => t.id === body.id ? { ...t, ...body } : t);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  store.tokens = store.tokens.filter(t => t.id !== id);
  return NextResponse.json({ success: true });
}
