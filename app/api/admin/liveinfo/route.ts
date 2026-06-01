import { NextResponse } from "next/server";
import { store } from "@/lib/adminStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ liveInfo: store.liveInfo });
}

export async function PUT(req: Request) {
  const body = await req.json();
  store.liveInfo = {
    ...store.liveInfo,
    message: body.message !== undefined ? body.message : store.liveInfo.message,
    isActive: body.isActive !== undefined ? body.isActive : store.liveInfo.isActive,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true, liveInfo: store.liveInfo });
}
