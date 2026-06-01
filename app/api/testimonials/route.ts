import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await sb("GET", "/testimonials?order=created_at.desc");
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const body = await req.json();
  const row = {
    id: body.id || Date.now().toString(),
    name: body.name || "",
    package: body.package || "gold",
    rating: body.rating || 5,
    text: body.text || "",
    date: body.date || new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    is_approved: body.isApproved !== undefined ? body.isApproved : (body.is_approved !== undefined ? body.is_approved : false),
  };
  const result = await sb("POST", "/testimonials", row);
  return NextResponse.json({ success: true, testimonial: result[0] || row });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.package !== undefined) updateData.package = data.package;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.text !== undefined) updateData.text = data.text;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.isApproved !== undefined) updateData.is_approved = data.isApproved;
  if (data.is_approved !== undefined) updateData.is_approved = data.is_approved;
  await sb("PATCH", `/testimonials?id=eq.${id}`, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await sb("DELETE", `/testimonials?id=eq.${id}`);
  return NextResponse.json({ success: true });
}
