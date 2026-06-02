import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const SINGLE_SESSION_PACKAGES = ["silver","gold","pro","platinum","elite"];

export async function POST(req: Request) {
  const body = await req.json();
  const { token, action, sessionId } = body;

  // LOGOUT action - clear session
  if (action === "logout" && sessionId) {
    // Clear session from token
    const rows = await sb("GET", `/tokens?session_id=eq.${encodeURIComponent(sessionId)}&limit=1`);
    if (rows[0]) {
      await sb("PATCH", `/tokens?id=eq.${rows[0].id}`, { session_id: null });
    }
    return NextResponse.json({ success: true });
  }

  if (!token) return NextResponse.json({ success: false, message: "Token tidak boleh kosong." });

  const rows = await sb("GET", `/tokens?token=eq.${encodeURIComponent(token)}&limit=1`);
  const found = rows[0];

  if (!found) return NextResponse.json({ success: false, message: "Token tidak ditemukan. Hubungi admin." });
  if (!found.is_active) return NextResponse.json({ success: false, message: "Token dinonaktifkan. Hubungi admin." });
  if (found.expired_at && new Date(found.expired_at) < new Date()) return NextResponse.json({ success: false, message: "Token sudah expired. Hubungi admin untuk perpanjangan." });

  // Single session check for silver and above
  if (SINGLE_SESSION_PACKAGES.includes(found.package)) {
    const incomingSession = sessionId || null;
    if (found.session_id && found.session_id !== incomingSession) {
      return NextResponse.json({ success: false, message: "Token ini sedang digunakan di perangkat lain. Logout dari perangkat lain terlebih dahulu atau hubungi admin." });
    }
    // Assign new session if none
    if (!found.session_id) {
      const newSessionId = uuidv4();
      await sb("PATCH", `/tokens?id=eq.${found.id}`, { session_id: newSessionId });
      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
        user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at },
      });
    }
  }

  return NextResponse.json({
    success: true,
    sessionId: found.session_id || null,
    user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at },
  });
}
