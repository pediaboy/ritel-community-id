import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SETTINGS_KEY = "login_logs";

// Login/register logs are now written directly by /api/auth/verify-otp
// (shape: { id, email, event: "login"|"register", ip, time }).
// This route is read-only for the admin panel.
export async function GET() {
  const rows = await sb("GET", `/settings?key=eq.${SETTINGS_KEY}&limit=1`);
  const logs = rows[0]?.value || [];
  return NextResponse.json({ logs });
}
