import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.community_posts&limit=1");
  return rows[0]?.value || [];
}

async function savePosts(posts: any[]) {
  await sb("POST", "/settings", { key: "community_posts", value: posts, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" });
}

async function getUsers(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.community_users&limit=1");
  return rows[0]?.value || [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "semua";
  const search = searchParams.get("search") || "";

  let posts = await getPosts();
  // Sort newest first
  posts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (filter !== "semua") {
    posts = posts.filter((p: any) => p.tag === filter);
  }
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p: any) =>
      p.content?.toLowerCase().includes(q) ||
      p.author_name?.toLowerCase().includes(q) ||
      p.author_username?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, posts });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, user_id, post_id, content, tag } = body;

  if (action === "create") {
    if (!user_id || !content) return NextResponse.json({ success: false, message: "Login dulu untuk posting." });
    if (content.trim().length < 5) return NextResponse.json({ success: false, message: "Konten terlalu pendek." });
    if (content.length > 2000) return NextResponse.json({ success: false, message: "Konten maksimal 2000 karakter." });

    const users = await getUsers();
    const author = users.find((u: any) => u.id === user_id);
    if (!author) return NextResponse.json({ success: false, message: "User tidak ditemukan." });
    if (author.is_blocked) return NextResponse.json({ success: false, message: "Akun diblokir." });

    const posts = await getPosts();
    const newPost = {
      id: "p_" + Date.now(),
      author_id: user_id,
      author_name: author.display_name,
      author_username: author.username,
      author_verified: author.is_verified || false,
      avatar: author.avatar || author.display_name.slice(0, 2).toUpperCase(),
      subscription: author.subscription || "free",
      content: content.trim(),
      tag: tag || "info",
      likes: [],
      comments: [],
      created_at: new Date().toISOString(),
    };
    posts.unshift(newPost);
    // Keep max 200 posts
    if (posts.length > 200) posts.splice(200);
    await savePosts(posts);
    return NextResponse.json({ success: true, post: newPost });
  }

  if (action === "like") {
    if (!user_id || !post_id) return NextResponse.json({ success: false, message: "Missing params." });
    const posts = await getPosts();
    const idx = posts.findIndex((p: any) => p.id === post_id);
    if (idx < 0) return NextResponse.json({ success: false, message: "Post tidak ditemukan." });

    const likeIdx = posts[idx].likes.indexOf(user_id);
    if (likeIdx >= 0) {
      posts[idx].likes.splice(likeIdx, 1);
    } else {
      posts[idx].likes.push(user_id);
    }
    await savePosts(posts);
    return NextResponse.json({ success: true, likes: posts[idx].likes });
  }

  if (action === "comment") {
    const { comment_text } = body;
    if (!user_id || !post_id || !comment_text) return NextResponse.json({ success: false, message: "Missing params." });
    if (comment_text.trim().length < 1) return NextResponse.json({ success: false, message: "Komentar kosong." });

    const users = await getUsers();
    const commenter = users.find((u: any) => u.id === user_id);
    if (!commenter) return NextResponse.json({ success: false, message: "User tidak ditemukan." });

    const posts = await getPosts();
    const idx = posts.findIndex((p: any) => p.id === post_id);
    if (idx < 0) return NextResponse.json({ success: false, message: "Post tidak ditemukan." });

    const newComment = {
      id: "c_" + Date.now(),
      user_id,
      username: commenter.username,
      display_name: commenter.display_name,
      is_verified: commenter.is_verified || false,
      avatar: commenter.avatar,
      text: comment_text.trim(),
      created_at: new Date().toISOString(),
    };
    if (!posts[idx].comments) posts[idx].comments = [];
    posts[idx].comments.push(newComment);
    await savePosts(posts);
    return NextResponse.json({ success: true, comment: newComment });
  }

  if (action === "delete") {
    const { requester_id, requester_role } = body;
    if (!post_id) return NextResponse.json({ success: false, message: "Missing post_id." });

    const posts = await getPosts();
    const idx = posts.findIndex((p: any) => p.id === post_id);
    if (idx < 0) return NextResponse.json({ success: false, message: "Post tidak ditemukan." });

    const post = posts[idx];
    if (post.author_id !== requester_id && requester_role !== "admin") {
      return NextResponse.json({ success: false, message: "Tidak punya akses hapus post ini." });
    }
    posts.splice(idx, 1);
    await savePosts(posts);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenal." });
}
