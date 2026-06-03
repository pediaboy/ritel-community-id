import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getUsers(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.community_users&limit=1");
  return rows[0]?.value || [];
}

async function saveUsers(users: any[]) {
  await sb("POST", "/settings", { key: "community_users", value: users, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" });
}

// GET: list users (admin only via query param) atau get profile by username
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const id = searchParams.get("id");

  const users = await getUsers();

  if (username) {
    const found = users.find((u: any) => u.username === username);
    if (!found) return NextResponse.json({ success: false, message: "User tidak ditemukan." });
    const { password_hash: _, ...safe } = found;
    return NextResponse.json({ success: true, user: safe });
  }

  if (id) {
    const found = users.find((u: any) => u.id === id);
    if (!found) return NextResponse.json({ success: false, message: "User tidak ditemukan." });
    const { password_hash: _, ...safe } = found;
    return NextResponse.json({ success: true, user: safe });
  }

  // Return all (for admin)
  const safe = users.map(({ password_hash: _, ...u }: any) => u);
  return NextResponse.json({ success: true, users: safe });
}

// POST: update profile, block/unblock, set subscription
export async function POST(req: Request) {
  const body = await req.json();
  const { action, target_id, requester_role, requester_id } = body;

  const users = await getUsers();
  const idx = users.findIndex((u: any) => u.id === target_id);
  if (idx < 0) return NextResponse.json({ success: false, message: "User tidak ditemukan." });

  if (action === "block" || action === "unblock") {
    if (requester_role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized." });
    users[idx].is_blocked = action === "block";
    await saveUsers(users);
    return NextResponse.json({ success: true });
  }

  if (action === "set_subscription") {
    if (requester_role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized." });
    const { subscription, expired_at } = body;
    users[idx].subscription = subscription;
    users[idx].expired_at = expired_at || null;
    await saveUsers(users);
    const { password_hash: _, ...safe } = users[idx];
    return NextResponse.json({ success: true, user: safe });
  }

  if (action === "set_verified") {
    if (requester_role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized." });
    const { is_verified } = body;
    users[idx].is_verified = is_verified;
    await saveUsers(users);
    return NextResponse.json({ success: true });
  }

  if (action === "delete") {
    if (requester_role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized." });
    users.splice(idx, 1);
    await saveUsers(users);
    return NextResponse.json({ success: true });
  }

  if (action === "update_profile") {
    if (requester_id !== target_id && requester_role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized." });
    }
    const { bio, display_name } = body;
    if (bio !== undefined) users[idx].bio = bio.slice(0, 200);
    if (display_name) users[idx].display_name = display_name.trim().slice(0, 50);
    users[idx].avatar = (users[idx].display_name || "U").slice(0, 2).toUpperCase();
    await saveUsers(users);
    const { password_hash: _, ...safe } = users[idx];
    return NextResponse.json({ success: true, user: safe });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenal." });
}
