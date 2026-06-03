import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { type, data } = body;

  if (type === "signals" || type === "signals_bulk") {
    // Bulk replace signals - preserve ALL fields including is_pinned, is_tomorrow, is_done
    await sb("DELETE", "/signals?id=neq.NONE");
    if (data && data.length > 0) {
      const rows = data.map((s: any) => ({
        id: s.id || Date.now().toString(),
        saham: s.saham || "",
        kode: s.kode || "",
        action: s.action || "BUY",
        entry: s.entry || "",
        tp: s.tp || "",
        tp2: s.tp2 || "",
        tp3: s.tp3 || "",
        sl: s.sl || "",
        notes: s.notes || "",
        package: s.package || ["gold"],
        is_pinned: s.is_pinned || false,
        is_tomorrow: s.is_tomorrow || false,
        is_done: s.is_done || false,
        created_at: s.created_at || new Date().toISOString(),
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
        email: t.email || "",
        name: t.name || "",
        package: t.package || "gold",
        token: t.token || "RC-TOKEN",
        expired_at: t.expiredAt || t.expired_at || null,
        is_active: t.isActive !== undefined ? t.isActive : true,
        verified: t.verified || false,
      }));
      await sb("POST", "/tokens", rows);
    }
    return NextResponse.json({ success: true });
  }

  const settingsKeys = [
    "ticker", "pricing", "premiumSignals", "stocks_mode", "motivasi", "ticker_speed",
    "owners", "partners", "wa_links", "bagger_signals", "bandar_signals", "done_signal_ids",
    "greeting_pagi", "greeting_malam", "testimonials_data"
  ];
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
    owners: settings.owners || [{ name:"Thirafi Thariq Al Idris", role:"Founder & CEO", badge:"👑", tag:"Owner", verified:true }],
    partners: settings.partners || [],
    wa_links: settings.wa_links || { grup:"https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS", channel:"https://whatsapp.com/channel/0029VbCVhf91noz95vIGwo23" },
    bagger_signals: settings.bagger_signals || [],
    bandar_signals: settings.bandar_signals || [],
    done_signal_ids: settings.done_signal_ids || [],
    greeting_pagi: settings.greeting_pagi || "",
    greeting_malam: settings.greeting_malam || "",
    testimonials_data: settings.testimonials_data || [],
  });
}
