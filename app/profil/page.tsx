"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function VerifiedBadge() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1E5AF0" className="inline-block ml-1">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" fill="#1E5AF0"/>
    </svg>
  );
}

function SubBadge({ sub, expired_at }: { sub: string; expired_at?: string | null }) {
  const colors: Record<string, string> = {
    free: "bg-gray-700 text-gray-300 border border-gray-600",
    basic: "bg-blue-900/60 text-blue-300 border border-blue-500/40",
    silver: "bg-cyan-900/60 text-cyan-300 border border-cyan-500/40",
    gold: "bg-yellow-900/60 text-yellow-300 border border-yellow-500/40",
    platinum: "bg-purple-900/60 text-purple-300 border border-purple-500/40",
    owner: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-none",
  };
  const labels: Record<string, string> = {
    free: "Free Member", basic: "Member Basic", silver: "Member Silver",
    gold: "Member Gold", platinum: "Member Platinum", owner: "Owner",
  };

  let expiredStr = "";
  if (expired_at && sub !== "owner") {
    const exp = new Date(expired_at);
    expiredStr = exp.toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${colors[sub] || colors.free}`}>
        {labels[sub] || sub}
      </span>
      {expiredStr && (
        <span className="text-gray-500 text-[11px]">Aktif hingga {expiredStr}</span>
      )}
      {(!expired_at && sub === "free") && (
        <span className="text-gray-600 text-[11px]">Upgrade untuk akses premium</span>
      )}
    </div>
  );
}

function JakartaClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const jkt = now.toLocaleTimeString("id-ID", { timeZone:"Asia/Jakarta", hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });
      setTime(jkt);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono text-blue-400">{time} WIB</span>;
}

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id: "beranda", label: "Beranda", href: "/" },
    { id: "cari", label: "Cari", href: "/cari" },
    { id: "alat", label: "Alat", href: "/alat" },
    { id: "vip", label: "VIP", href: "/vip" },
    { id: "profil", label: "Profil", href: "/profil" },
  ];
  const icons: Record<string,any> = {
    beranda: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    cari: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>,
    vip: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    profil: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5" style={{ background:"rgba(4,7,15,0.97)", backdropFilter:"blur(20px)" }}>
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map(t => (
          <Link key={t.id} href={t.href} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active===t.id?"text-blue-400":"text-gray-600 hover:text-gray-400"}`}>
            <div className={active===t.id?"drop-shadow-[0_0_6px_rgba(30,90,240,0.8)]":""}>{icons[t.id]}</div>
            <span className="text-[10px] font-medium">{t.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState("");
  const [linkToken, setLinkToken] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMsg, setLinkMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("rc_community_user");
    if (!saved) { router.push("/komunitas/login"); return; }
    try {
      const u = JSON.parse(saved);
      setUser(u);
      setBio(u.bio || "");
    } catch { router.push("/komunitas/login"); }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("rc_community_user");
    router.push("/");
  };

  const handleSaveBio = async () => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/community/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_profile", target_id: user.id, requester_id: user.id, bio }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, bio: data.user.bio };
        setUser(updated);
        localStorage.setItem("rc_community_user", JSON.stringify(updated));
        setEditBio(false);
      }
    } catch {}
    setSaving(false);
  };

  const handleLinkToken = async () => {
    if (!linkToken.trim() || linkLoading) return;
    setLinkLoading(true);
    setLinkMsg("");
    try {
      const res = await fetch("/api/community/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link_token", user_id: user.id, token: linkToken.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, ...data.user };
        setUser(updated);
        localStorage.setItem("rc_community_user", JSON.stringify(updated));
        setLinkMsg("✅ Langganan berhasil disinkronkan!");
        setLinkToken("");
      } else {
        setLinkMsg("❌ " + data.message);
      }
    } catch {
      setLinkMsg("❌ Koneksi error.");
    }
    setLinkLoading(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#04070F" }}>
      <div className="text-gray-500">Memuat...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "#04070F", color: "white" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background:"rgba(4,7,15,0.97)", backdropFilter:"blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <span className="text-white font-bold">Profil</span>
          <JakartaClock />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* Profile Card */}
        <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-6 mb-4">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-3"
              style={{ background: "linear-gradient(135deg,#1e5af0,#00c8ff)", boxShadow: "0 0 24px rgba(30,90,240,0.5)" }}>
              {user.avatar || user.display_name?.slice(0,2).toUpperCase() || "U"}
            </div>
            <div className="flex items-center gap-1 mb-0.5">
              <h2 className="text-white font-bold text-lg">{user.display_name}</h2>
              {user.is_verified && <VerifiedBadge />}
            </div>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            <div className="mt-3">
              <SubBadge sub={user.subscription || "free"} expired_at={user.expired_at} />
            </div>
          </div>

          {/* Bio */}
          <div className="border-t border-white/5 pt-4">
            {editBio ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={200} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none outline-none focus:border-blue-500/50"
                  placeholder="Tulis bio singkat kamu..."
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSaveBio} disabled={saving}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-semibold disabled:opacity-50">
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button onClick={() => { setEditBio(false); setBio(user.bio||""); }}
                    className="px-4 py-1.5 bg-white/5 text-gray-400 text-xs rounded-lg">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <p className="text-gray-400 text-sm flex-1">{user.bio || "Belum ada bio."}</p>
                <button onClick={() => setEditBio(true)} className="text-blue-400 text-xs ml-3 hover:text-blue-300 flex-shrink-0">Edit</button>
              </div>
            )}
          </div>
        </div>

        {/* Link Token (untuk upgrade subscription) */}
        {user.subscription === "free" && (
          <div className="bg-[#0A1628] border border-blue-500/20 rounded-2xl p-4 mb-4">
            <h3 className="text-white font-semibold text-sm mb-1">Punya Token VIP?</h3>
            <p className="text-gray-500 text-xs mb-3">Hubungkan token VIP kamu untuk unlock fitur premium</p>
            <div className="flex gap-2">
              <input value={linkToken} onChange={e => setLinkToken(e.target.value)}
                placeholder="Masukkan token VIP..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              />
              <button onClick={handleLinkToken} disabled={linkLoading || !linkToken.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-xs rounded-xl font-semibold disabled:opacity-40">
                {linkLoading ? "..." : "Link"}
              </button>
            </div>
            {linkMsg && <p className={`text-xs mt-2 ${linkMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{linkMsg}</p>}
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-[#0A1628] border border-white/5 rounded-2xl overflow-hidden mb-4">
          <Link href="/paket" className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-blue-400">⭐</span>
              <span className="text-white text-sm">Upgrade Langganan</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </Link>
          <Link href="/vip" className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-purple-400">💎</span>
              <span className="text-white text-sm">Area VIP</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </Link>
          <Link href="/alat" className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-green-400">🔧</span>
              <span className="text-white text-sm">Alat Trading</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full py-3.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors">
          Keluar dari Akun
        </button>
      </main>

      <BottomNav active="profil" />
    </div>
  );
}
