import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getFeed(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.admin_feed&limit=1");
  return rows[0]?.value || [];
}

async function saveFeed(feed: any[]) {
  await sb("POST", "/settings", { key: "admin_feed", value: feed, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" });
}

export async function GET() {
  const feed = await getFeed();
  const sorted = [...feed].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return NextResponse.json({ success: true, feed: sorted });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, id, content, tag, pinned } = body;

  if (action === "create") {
    if (!content?.trim()) return NextResponse.json({ success: false, message: "Konten kosong." });
    const feed = await getFeed();
    const newPost = {
      id: "af_" + Date.now(),
      author: "Admin RITEL COMMUNITY.ID",
      avatar: "RC",
      verified: true,
      content: content.trim(),
      tag: tag || "info",
      pinned: pinned || false,
      show_home: body.show_home !== false,
      show_vip: body.show_vip !== false,
      created_at: new Date().toISOString(),
    };
    feed.unshift(newPost);
    if (feed.length > 100) feed.splice(100);
    await saveFeed(feed);
    return NextResponse.json({ success: true, post: newPost });
  }

  if (action === "delete") {
    if (!id) return NextResponse.json({ success: false, message: "ID tidak ada." });
    const feed = await getFeed();
    const updated = feed.filter(p => p.id !== id);
    await saveFeed(updated);
    return NextResponse.json({ success: true });
  }

  if (action === "pin") {
    if (!id) return NextResponse.json({ success: false, message: "ID tidak ada." });
    const feed = await getFeed();
    const updated = feed.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p);
    await saveFeed(updated);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenal." });
}
