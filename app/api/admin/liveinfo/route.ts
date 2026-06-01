import { NextResponse } from "next/server";
import { serverStore } from "@/app/api/admin/sync/route";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ liveInfo: { ...serverStore.liveinfo, id:"1", updatedAt:new Date().toISOString() } });
}

export async function PUT(req: Request) {
  const body = await req.json();
  serverStore.liveinfo = { message: body.message || "", isActive: body.isActive || false };
  return NextResponse.json({ success: true, liveInfo: serverStore.liveinfo });
}
