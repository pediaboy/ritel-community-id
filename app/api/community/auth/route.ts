import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function hashPass(pass: string) {
  // Simple hash - bisa upgrade ke bcrypt di production
  let h = 0;
  for (let i = 0; i < pass.length; i++) {
    h = (h << 5) - h + pass.charCodeAt(i);
    h |= 0;
  }
  return "h_" + Math.abs(h).toString(36) + "_" + pass.length;
}

async function getUsers(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.community_users&limit=1");
  return rows[0]?.value || [];
}

async function saveUsers(users: any[]) {
  await sb("POST", "/settings", { key: "community_users", value: users, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, username, password, display_name } = body;

  if (action === "register") {
    if (!username || !password || !display_name) return NextResponse.json({ success: false, message: "Semua field wajib diisi." });
    if (username.length < 3) return NextResponse.json({ success: false, message: "Username minimal 3 karakter." });
    if (password.length < 6) return NextResponse.json({ success: false, message: "Password minimal 6 karakter." });
    if (!/^[a-z0-9_.]+$/.test(username)) return NextResponse.json({ success: false, message: "Username hanya boleh huruf kecil, angka, titik, underscore." });

    const users = await getUsers();
    if (users.find((u: any) => u.username === username.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Username sudah digunakan." });
    }

    // Ambil role dari token yang aktif (jika ada)
    let subscription = "free";
    let expired_at = null;
    const tokenRows = await sb("GET", `/tokens?email=eq.&limit=1`);

    const newUser = {
      id: "u_" + Date.now(),
      username: username.toLowerCase(),
      display_name: display_name.trim(),
      password_hash: hashPass(password),
      role: "user",
      is_verified: false,
      subscription: "free",
      expired_at: null,
      is_blocked: false,
      avatar: display_name.trim().slice(0, 2).toUpperCase(),
      bio: "",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    const { password_hash: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  }

  if (action === "login") {
    if (!username || !password) return NextResponse.json({ success: false, message: "Username dan password wajib diisi." });

    const users = await getUsers();
    const found = users.find((u: any) => u.username === username.toLowerCase());

    if (!found) return NextResponse.json({ success: false, message: "Username tidak ditemukan." });
    if (found.is_blocked) return NextResponse.json({ success: false, message: "Akun diblokir. Hubungi admin." });
    if (found.password_hash !== hashPass(password)) return NextResponse.json({ success: false, message: "Password salah." });

    // Cek expired subscription
    if (found.expired_at && new Date(found.expired_at) < new Date()) {
      // Update ke free
      found.subscription = "free";
      found.expired_at = null;
      await saveUsers(users);
    }

    const { password_hash: _, ...safeUser } = found;
    return NextResponse.json({ success: true, user: safeUser });
  }

  if (action === "link_token") {
    // Link token ke user untuk sync subscription
    const { user_id, token } = body;
    if (!user_id || !token) return NextResponse.json({ success: false, message: "Missing params." });

    const tokenRows = await sb("GET", `/tokens?token=eq.${encodeURIComponent(token)}&limit=1`);
    const tk = tokenRows[0];
    if (!tk) return NextResponse.json({ success: false, message: "Token tidak valid." });
    if (!tk.is_active) return NextResponse.json({ success: false, message: "Token tidak aktif." });

    const users = await getUsers();
    const userIdx = users.findIndex((u: any) => u.id === user_id);
    if (userIdx < 0) return NextResponse.json({ success: false, message: "User tidak ditemukan." });

    users[userIdx].subscription = tk.package || "basic";
    users[userIdx].expired_at = tk.expired_at || null;
    users[userIdx].linked_token = token;
    await saveUsers(users);

    const { password_hash: _, ...safeUser } = users[userIdx];
    return NextResponse.json({ success: true, user: safeUser });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenal." });
}
