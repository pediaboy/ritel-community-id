import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// sync route: admin panel calls POST to sync bulk data, GET to fetch all
export async function POST(req: Request) {
  const body = await req.json();
  const { type, data } = body;

  if (type === "signals") {
    // Bulk replace signals
    await sb("DELETE", "/signals?id=neq.NONE");
    if (data && data.length > 0) {
      const rows = data.map((s: any) => ({
        id: s.id || Date.now().toString(),
        saham: s.saham || "", kode: s.kode || "", action: s.action || "BUY",
        entry: s.entry || "", tp: s.tp || "", sl: s.sl || "",
        notes: s.notes || "", package: s.package || ["gold"],
      }));
      await sb("POST", "/signals", rows);
    }
    return NextResponse.json({ success: true });
  }

  if (type === "tokens") {
    await sb("DELETE", "/tokens?id=neq.NONE");
    if (data && data.length > 0) {
      const rows = data.map((t: any) => ({
        id: t.id || Date.now().toString(),
        email: t.email || "", name: t.name || "", package: t.package || "gold",
        token: t.token || "RC-TOKEN", expired_at: t.expiredAt || t.expired_at || null,
        is_active: t.isActive !== undefined ? t.isActive : true,
      }));
      await sb("POST", "/tokens", rows);
    }
    return NextResponse.json({ success: true });
  }

  // For ticker, pricing, premiumSignals, stocks_mode - save to settings table
  const settingsKeys = ["ticker", "pricing", "premiumSignals", "stocks_mode", "motivasi", "ticker_speed"];
  if (settingsKeys.includes(type)) {
    await sb("POST", "/settings", 
      { key: type, value: data, updated_at: new Date().toISOString() },
      { "Prefer": "resolution=merge-duplicates,return=representation" }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Unknown type" });
}

export async function GET() {
  const [signals, tokens, settingsRows, liveRows, customStocks] = await Promise.all([
    sb("GET", "/signals?order=created_at.desc"),
    sb("GET", "/tokens?order=created_at.desc"),
    sb("GET", "/settings"),
    sb("GET", "/liveinfo?id=eq.1"),
    sb("GET", "/custom_stocks?order=kode.asc"),
  ]);

  const settings: any = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({
    signals,
    tokens,
    ticker: settings.ticker || [],
    pricing: settings.pricing || [],
    premiumSignals: settings.premiumSignals || [],
    stocks_mode: settings.stocks_mode || "live",
    liveinfo: liveRows[0] || { message: "", is_active: false },
    customStocks,
    motivasi: settings.motivasi || [],
    ticker_speed: settings.ticker_speed || 32,
  });
}
