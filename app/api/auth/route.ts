import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const SINGLE_SESSION_PACKAGES = ["silver","gold","pro","platinum","elite"];

function genSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function getSession(tokenId: string): Promise<string|null> {
  const rows = await sb("GET", `/settings?key=eq.session_${tokenId}&limit=1`);
  return rows[0]?.value || null;
}

async function setSession(tokenId: string, sessionId: string|null) {
  if (sessionId === null) {
    await sb("DELETE", `/settings?key=eq.session_${tokenId}`);
  } else {
    await sb("POST", `/settings`, { key: `session_${tokenId}`, value: sessionId, updated_at: new Date().toISOString() }, { Prefer: "resolution=merge-duplicates,return=representation" });
  }
}

async function logLogin(name: string, pkg: string, token: string, ip: string) {
  if (!["silver","gold","pro","platinum","elite"].includes(pkg)) return;
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/loginlogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pkg, token, ip }),
    });
  } catch {}
}

export async function POST(req: Request) {
  const body = await req.json();
  const { token, action, sessionId, tokenId } = body;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "-";

  // LOGOUT - clear session
  if (action === "logout" && tokenId) {
    await setSession(tokenId, null);
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
    const storedSession = await getSession(found.id);
    const incomingSession = sessionId || null;

    if (storedSession && storedSession !== incomingSession) {
      return NextResponse.json({ 
        success: false, 
        message: "Token ini sedang digunakan di perangkat lain. Logout dari perangkat lain terlebih dahulu atau hubungi admin." 
      });
    }

    if (!storedSession) {
      const newSession = genSessionId();
      await setSession(found.id, newSession);
      // Log this new login
      logLogin(found.name, found.package, token, ip);
      return NextResponse.json({
        success: true,
        sessionId: newSession,
        tokenId: found.id,
        user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at },
      });
    }
  }

  return NextResponse.json({
    success: true,
    sessionId: sessionId || null,
    tokenId: found.id,
    user: { name: found.name, email: found.email, package: found.package, expiredAt: found.expired_at },
  });
}
