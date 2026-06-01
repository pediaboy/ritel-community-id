import { NextResponse } from "next/server";
import crypto from "crypto";
let userTokens: any[] = [
  { id:"1", email:"user@example.com", name:"John Doe", package:"gold", token:"RC-GOLD-DEMO1234", expiredAt: new Date(Date.now()+30*24*60*60*1000).toISOString(), isActive:true },
];
export async function GET() { return NextResponse.json({ tokens: userTokens }); }
export async function POST(req: Request) {
  const body = await req.json();
  const token = "RC-" + body.package.toUpperCase() + "-" + crypto.randomBytes(6).toString("hex").toUpperCase();
  const newToken = { ...body, id:Date.now().toString(), token, isActive:true, createdAt:new Date().toISOString() };
  userTokens.push(newToken);
  return NextResponse.json({ success:true, token:newToken });
}
export async function PUT(req: Request) {
  const body = await req.json();
  userTokens = userTokens.map(t => t.id===body.id ? {...t,...body} : t);
  return NextResponse.json({ success:true });
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  userTokens = userTokens.filter(t => t.id!==id);
  return NextResponse.json({ success:true });
}
