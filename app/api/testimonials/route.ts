import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let testimonials: any[] = [
  { id:"t1", name:"Budi Santoso", package:"gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%. Komunitas juga aktif dan supportif.", date:"Mei 2025", isApproved:true },
  { id:"t2", name:"Sari Dewi", package:"platinum", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja. Mentor juga responsif dan helpful banget.", date:"April 2025", isApproved:true },
  { id:"t3", name:"Rizky Pratama", package:"silver", rating:5, text:"Modul fundamental-nya komprehensif. Sekarang udah bisa analisis sendiri tanpa bingung.", date:"Maret 2025", isApproved:true },
  { id:"t4", name:"Diana Putri", package:"elite", rating:5, text:"Worth every penny! Sinyal elite + mentor langsung bikin return gua konsisten tiap bulan.", date:"Februari 2025", isApproved:true },
];

export async function GET() {
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTesti = { ...body, id: "t" + Date.now(), isApproved: body.isApproved ?? false };
  testimonials.unshift(newTesti);
  return NextResponse.json({ success: true, testimonial: newTesti });
}

export async function PUT(req: Request) {
  const body = await req.json();
  testimonials = testimonials.map(t => t.id === body.id ? { ...t, ...body } : t);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  testimonials = testimonials.filter(t => t.id !== id);
  return NextResponse.json({ success: true });
}
