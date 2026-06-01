import { NextResponse } from "next/server";
let testimonials: any[] = [
  { id:"1", name:"Budi Santoso", package:"Gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%. Komunitas juga aktif dan supportif.", date:"Mei 2025", isApproved:true },
  { id:"2", name:"Sari Dewi", package:"Platinum", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja. Mentor juga responsif dan helpful banget.", date:"April 2025", isApproved:true },
  { id:"3", name:"Rizky Pratama", package:"Silver", rating:5, text:"Modul fundamental-nya komprehensif. Sekarang udah bisa analisis sendiri tanpa bingung.", date:"Maret 2025", isApproved:true },
  { id:"4", name:"Diana Putri", package:"Elite", rating:5, text:"Worth every penny! Sinyal elite + mentor langsung bikin return gua konsisten tiap bulan.", date:"Februari 2025", isApproved:true },
  { id:"5", name:"Ahmad Fauzi", package:"Pro", rating:5, text:"AI Agent Pro bisa bantu watchlist dan ingatkan sinyal. Fiturnya nambah terus, mantap!", date:"Januari 2025", isApproved:true },
];
export async function GET() { return NextResponse.json({ testimonials: testimonials.filter(t=>t.isApproved) }); }
export async function POST(req: Request) {
  const body = await req.json();
  const newT = { ...body, id:Date.now().toString(), date:new Date().toLocaleDateString("id-ID",{month:"long",year:"numeric"}), isApproved:false };
  testimonials.push(newT);
  return NextResponse.json({ success:true });
}
export async function PUT(req: Request) {
  const body = await req.json();
  testimonials = testimonials.map(t => t.id===body.id ? {...t,...body} : t);
  return NextResponse.json({ success:true });
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  testimonials = testimonials.filter(t => t.id!==id);
  return NextResponse.json({ success:true });
}
