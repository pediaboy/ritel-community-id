import { NextResponse } from "next/server";
import { sbAuth } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Step 1 of registration: create (or resend OTP for) an unconfirmed Supabase Auth
// user with email + password. Supabase sends a signup-confirmation email containing
// a 6-digit OTP code (see mailer_templates_confirmation_content). Calling this again
// for the same still-unconfirmed email naturally resends a fresh code.
export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const password = (body.password || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Masukkan alamat email yang valid." });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, message: "Kata sandi minimal 6 karakter." });
  }

  const { ok, data } = await sbAuth("/signup", {
    email,
    password,
    data: { source: "ritel_community_web" },
  });

  if (!ok) {
    const msg = data?.msg || data?.error_description || data?.message || "";

    if (/already registered|already exists/i.test(msg)) {
      return NextResponse.json({
        success: false,
        message: "Email ini sudah terdaftar & terverifikasi. Silakan masuk dengan kata sandi kamu.",
        alreadyRegistered: true,
      });
    }

    // Supabase's built-in per-email resend cooldown (default ~60s) — surfaces as
    // "For security purposes, you can only request this after N seconds."
    // Translate it into a friendly, human Indonesian message instead of raw English.
    const cooldownMatch = msg.match(/after (\d+) seconds?/i);
    if (cooldownMatch) {
      const secs = Math.max(parseInt(cooldownMatch[1], 10), 1);
      return NextResponse.json({
        success: false,
        message: `Kode OTP baru saja dikirim ke email ini. Tunggu ${secs} detik lagi sebelum minta kode baru ya.`,
        cooldownSeconds: secs,
      });
    }

    // Global sending rate limit hit (too many emails sent across the whole project).
    if (/rate limit exceeded/i.test(msg)) {
      return NextResponse.json({
        success: false,
        message: "Terlalu banyak permintaan kode OTP saat ini. Coba lagi dalam beberapa menit ya.",
      });
    }

    return NextResponse.json({ success: false, message: msg || "Gagal mendaftar. Coba lagi." });
  }

  return NextResponse.json({ success: true, message: "Kode OTP verifikasi telah dikirim ke email kamu." });
}
