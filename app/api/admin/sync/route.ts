import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Single source of truth - server-side store updated by admin via sync
// NOTE: This is in-memory. For production, use a database/Redis.
export const serverStore: any = {
  signals: [],
  tokens: [
    { id:"demo1", email:"demo@ritelcommunity.id", name:"Demo User", package:"gold", token:"RC-GOLD-DEMO1234", expiredAt: new Date(Date.now()+30*24*60*60*1000).toISOString(), isActive:true },
  ],
  liveinfo: { message:"", isActive:false },
  ticker: [],
  pricing: [],
  premiumSignals: [],
  stocks: [],
  stocks_mode: "live",
};

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "signals") serverStore.signals = body.data || [];
  if (body.type === "tokens") serverStore.tokens = body.data || [];
  if (body.type === "liveinfo") serverStore.liveinfo = body.data || { message:"", isActive:false };
  if (body.type === "ticker") serverStore.ticker = body.data || [];
  if (body.type === "pricing") serverStore.pricing = body.data || [];
  if (body.type === "premiumSignals") serverStore.premiumSignals = body.data || [];
  if (body.type === "stocks") serverStore.stocks = body.data || [];
  if (body.type === "stocks_mode") serverStore.stocks_mode = body.data || "live";
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(serverStore);
}
