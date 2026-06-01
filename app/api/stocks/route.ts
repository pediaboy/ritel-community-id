import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchStockData(symbols: string[]) {
  try {
    const symbolStr = symbols.join(",");
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${symbolStr}&range=1d&interval=5m`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 30 } }
    );
    const data = await res.json();
    return data?.spark?.result || [];
  } catch {
    return [];
  }
}

async function fetchQuote(symbols: string[]) {
  try {
    const symbolStr = symbols.join(",");
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolStr}&lang=id&region=ID`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 30 } }
    );
    const data = await res.json();
    return data?.quoteResponse?.result || [];
  } catch {
    return [];
  }
}

const mockStocks = [
  { symbol: "BBCA.JK", name: "Bank Central Asia", price: 9875, change: 125, changePercent: 1.28, volume: "12.5M", sector: "Perbankan" },
  { symbol: "BBRI.JK", name: "Bank Rakyat Indonesia", price: 4680, change: -30, changePercent: -0.64, volume: "45.2M", sector: "Perbankan" },
  { symbol: "TLKM.JK", name: "Telkom Indonesia", price: 3290, change: 50, changePercent: 1.54, volume: "22.1M", sector: "Telekomunikasi" },
  { symbol: "ASII.JK", name: "Astra International", price: 5200, change: -75, changePercent: -1.42, volume: "18.7M", sector: "Otomotif" },
  { symbol: "GOTO.JK", name: "GoTo Group", price: 86, change: 4, changePercent: 4.88, volume: "892.3M", sector: "Teknologi" },
  { symbol: "ANTM.JK", name: "Aneka Tambang", price: 1640, change: 35, changePercent: 2.18, volume: "33.4M", sector: "Tambang" },
  { symbol: "BMRI.JK", name: "Bank Mandiri", price: 6325, change: 75, changePercent: 1.20, volume: "28.6M", sector: "Perbankan" },
  { symbol: "ICBP.JK", name: "Indofood CBP", price: 10250, change: -150, changePercent: -1.44, volume: "7.2M", sector: "Konsumer" },
];

export async function GET() {
  // Try Yahoo Finance first
  const symbols = ["BBCA.JK","BBRI.JK","TLKM.JK","ASII.JK","GOTO.JK","ANTM.JK","BMRI.JK","^JKSE"];
  let quotes = await fetchQuote(symbols);

  let stocks = mockStocks;
  if (quotes.length > 0) {
    stocks = quotes.map((q: any) => ({
      symbol: q.symbol,
      name: q.longName || q.shortName || q.symbol,
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0,
      volume: q.regularMarketVolume ? (q.regularMarketVolume / 1000000).toFixed(1) + "M" : "-",
      sector: "-",
    }));
  }

  // IHSG data
  const ihsgData = quotes.find((q: any) => q.symbol === "^JKSE");
  const ihsg = ihsgData
    ? { value: ihsgData.regularMarketPrice, change: ihsgData.regularMarketChange, changePercent: ihsgData.regularMarketChangePercent }
    : { value: 7285.4, change: 58.3, changePercent: 0.81 };

  return NextResponse.json({ stocks: stocks.filter(s => s.symbol !== "^JKSE"), ihsg, updatedAt: new Date().toISOString() });
}
