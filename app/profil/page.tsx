"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="inline-block ml-1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function SubBadge({ sub, expired_at }: { sub: string; expired_at?: string | null }) {
  // Use tag-chip design system with distinguishing subtle colors instead of full rainbow
  const colors: Record<string, string> = {
    free: "border-neutral-700 bg-neutral-900 text-neutral-400",
    basic: "border-emerald-900/60 bg-emerald-950/40 text-emerald-400",
    silver: "border-slate-500/40 bg-slate-800/40 text-slate-200",
    gold: "border-amber-500/40 bg-amber-950/40 text-amber-400",
    platinum: "border-purple-500/40 bg-purple-950/40 text-purple-400",
    owner: "solid",
  };

  const labels: Record<string, string> = {
    free: "Free Member",
    basic: "Member Basic",
    silver: "Member Silver",
    gold: "Member Gold",
    platinum: "Member Platinum",
    owner: "Owner",
  };

  let expiredStr = "";
  if (expired_at && sub !== "owner") {
    const exp = new Date(expired_at);
    expiredStr = exp.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  }

  const isSolid = colors[sub] === "solid";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`tag-chip ${isSolid ? "solid" : colors[sub] || colors.free}`}>
        {labels[sub] || sub}
      </span>
      {expiredStr && (
        <span className="text-neutral-500 text-[11px] tracking-wide uppercase font-semibold">Aktif hingga {expiredStr}</span>
      )}
      {!expired_at && sub === "free" && (
        <span className="text-neutral-600 text-[11px] tracking-wide uppercase font-semibold">Upgrade untuk akses premium</span>
      )}
    </div>
  );
}

function JakartaClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const jkt = now.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      setTime(jkt);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono text-emerald-400 tracking-wider text-xs">{time} WIB</span>;
}

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id: "beranda", label: "Beranda", href: "/" },
    { id: "cari", label: "Cari", href: "/cari" },
    { id: "alat", label: "Alat", href: "/alat" },
    { id: "vip", label: "VIP", href: "/vip" },
    { id: "profil", label: "Profil", href: "/profil" },
  ];
  const icons: Record<string, any> = {
    beranda: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    cari: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    vip: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>,
    profil: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800/80" style={{ background: "rgba(10,11,13,0.95)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map(t => (
          <Link key={t.id} href={t.href} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active === t.id ? "text-emerald-400" : "text-neutral-500 hover:text-neutral-300"}`}>
            <div className={active === t.id ? "drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" : ""}>{icons[t.id]}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase">{t.label}</span>
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
        setLinkMsg("Langganan berhasil disinkronkan!");
        setLinkToken("");
      } else {
        setLinkMsg(data.message);
      }
    } catch {
      setLinkMsg("Koneksi error.");
    }
    setLinkLoading(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B0D]">
      <div className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Memuat...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-[#0A0B0D] text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80" style={{ background: "rgba(10,11,13,0.95)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-neutral-500 hover:text-neutral-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <span className="headline text-base tracking-wider"><span className="accent">PROFIL</span> ANGGOTA</span>
          <JakartaClock />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* Profile Card */}
        <div className="glass-card p-6 mb-4">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="index-badge w-20 h-20 rounded-xl text-3xl font-black mb-4 bg-neutral-900 border border-emerald-500/30 text-emerald-400">
              {user.avatar || user.display_name?.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div className="flex items-center gap-1 mb-1 justify-center">
              <h2 className="headline text-lg tracking-wider">{user.display_name}</h2>
              {user.is_verified && <VerifiedBadge />}
            </div>
            <p className="text-neutral-500 text-xs font-mono">@{user.username}</p>
            <div className="mt-4">
              <SubBadge sub={user.subscription || "free"} expired_at={user.expired_at} />
            </div>
          </div>

          {/* Bio */}
          <div className="border-t border-neutral-800/80 pt-4">
            {editBio ? (
              <div>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full bg-[#15161A] border border-neutral-800 rounded-none px-3 py-2 text-neutral-100 text-sm resize-none outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Tulis bio singkat kamu..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveBio}
                    disabled={saving}
                    className="btn-primary py-2 px-4 rounded-none text-xs font-bold disabled:opacity-50"
                  >
                    {saving ? "MENYIMPAN..." : "SIMPAN"}
                  </button>
                  <button
                    onClick={() => { setEditBio(false); setBio(user.bio || ""); }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-bold hover:text-neutral-200 transition-colors"
                  >
                    BATAL
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <p className="text-neutral-400 text-sm flex-1 leading-relaxed">{user.bio || "Belum ada bio."}</p>
                <button
                  onClick={() => setEditBio(true)}
                  className="text-emerald-400 text-xs font-bold uppercase tracking-wider ml-3 hover:text-emerald-300 transition-colors"
                >
                  EDIT
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Link Token (untuk upgrade subscription) */}
        {user.subscription === "free" && (
          <div className="glass-card no-mark p-5 mb-4 border border-emerald-500/20">
            <h3 className="headline text-sm tracking-wider mb-1"><span className="accent">PUNYA</span> TOKEN VIP?</h3>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-4">Hubungkan token VIP untuk unlock premium</p>
            <div className="flex gap-2">
              <input
                value={linkToken}
                onChange={e => setLinkToken(e.target.value)}
                placeholder="RC-GOLD-XXXXXXXX"
                className="flex-1 bg-[#15161A] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 font-mono tracking-wider text-sm outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={handleLinkToken}
                disabled={linkLoading || !linkToken.trim()}
                className="px-6 bg-emerald-500 text-neutral-950 text-xs font-black uppercase tracking-wider disabled:opacity-40 hover:bg-emerald-400 transition-colors"
              >
                {linkLoading ? "..." : "LINK"}
              </button>
            </div>
            {linkMsg && (
              <p className={`text-xs mt-3 uppercase tracking-wider font-bold ${linkMsg.includes("berhasil") ? "text-emerald-400" : "text-red-400"}`}>
                {linkMsg}
              </p>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="glass-card no-mark overflow-hidden mb-4 p-0">
          <Link href="/paket" className="flex items-center justify-between px-5 py-4 hover:bg-neutral-900/40 transition-colors border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <span className="index-badge w-6 h-6 text-[10px] rounded-md">01</span>
              <span className="text-neutral-200 text-sm font-bold uppercase tracking-wider">Upgrade Langganan</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-600">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
          <Link href="/vip" className="flex items-center justify-between px-5 py-4 hover:bg-neutral-900/40 transition-colors border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <span className="index-badge w-6 h-6 text-[10px] rounded-md">02</span>
              <span className="text-neutral-200 text-sm font-bold uppercase tracking-wider">Area VIP</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-600">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
          <Link href="/alat" className="flex items-center justify-between px-5 py-4 hover:bg-neutral-900/40 transition-colors">
            <div className="flex items-center gap-3">
              <span className="index-badge w-6 h-6 text-[10px] rounded-md">03</span>
              <span className="text-neutral-200 text-sm font-bold uppercase tracking-wider">Alat Trading</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-600">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider hover:bg-red-500/10 transition-colors"
        >
          Keluar dari Akun
        </button>
      </main>

      <BottomNav active="profil" />
    </div>
  );
}
