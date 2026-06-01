import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Single source of truth - server-side store updated by admin via sync
export const serverStore = {
  signals: [] as any[],
  tokens: [
    { id:"demo1", email:"demo@ritelcommunity.id", name:"Demo User", package:"gold", token:"RC-GOLD-DEMO1234", expiredAt: new Date(Date.now()+30*24*60*60*1000).toISOString(), isActive:true },
  ] as any[],
  liveinfo: { message:"", isActive:false },
};

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "signals") serverStore.signals = body.data || [];
  if (body.type === "tokens") serverStore.tokens = body.data || [];
  if (body.type === "liveinfo") serverStore.liveinfo = body.data || { message:"", isActive:false };
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(serverStore);
}
