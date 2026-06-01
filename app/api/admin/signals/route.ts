import { NextResponse } from "next/server";
let signals: any[] = [
  { id:"1", saham:"Bank Central Asia", kode:"BBCA", action:"BUY", entry:"9750 - 9800", tp:"10.200 | 10.500", sl:"9.500", notes:"Breakout resistance kuat, volume tinggi. Fundamental solid.", createdAt:new Date().toISOString(), package:["gold","pro","platinum","elite"] },
  { id:"2", saham:"Aneka Tambang", kode:"ANTM", action:"ANTRI", entry:"1580 - 1620", tp:"1750 | 1850", sl:"1520", notes:"Harga emas global support. Tunggu konfirmasi di support area.", createdAt:new Date().toISOString(), package:["silver","gold","pro","platinum","elite"] },
  { id:"3", saham:"GoTo Group", kode:"GOTO", action:"BUY", entry:"80 - 85", tp:"100 | 115", sl:"72", notes:"First profitable quarter. Momentum positif jangka menengah.", createdAt:new Date().toISOString(), package:["pro","platinum","elite"] },
];
export async function GET() { return NextResponse.json({ signals }); }
export async function POST(req: Request) {
  const body = await req.json();
  const newSignal = { ...body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  signals.push(newSignal);
  return NextResponse.json({ success:true, signal:newSignal });
}
export async function PUT(req: Request) {
  const body = await req.json();
  signals = signals.map(s => s.id===body.id ? {...s,...body} : s);
  return NextResponse.json({ success:true });
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  signals = signals.filter(s => s.id!==id);
  return NextResponse.json({ success:true });
}
