import { NextResponse } from "next/server";
import { sbAuth } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Masukkan alamat email yang valid." });
  }

  // create_user: true -> allow signup on first OTP request (acts as Register)
  const { ok, data } = await sbAuth("/otp", {
    email,
    create_user: true,
    data: { source: "lastquestion_forex_web" },
  });

  if (!ok) {
    const msg = data?.msg || data?.error_description || data?.message || "Gagal mengirim kode OTP. Coba lagi.";
    return NextResponse.json({ success: false, message: msg });
  }

  return NextResponse.json({ success: true, message: "Kode OTP telah dikirim ke email kamu." });
}
