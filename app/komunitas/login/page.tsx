"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommunityLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handle = async () => {
    if (loading) return;
    setError("");
    if (!username || !password) { setError("Username & password wajib diisi."); return; }
    if (mode === "register" && !displayName) { setError("Nama tampilan wajib diisi."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/community/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          username: username.toLowerCase().trim(),
          password,
          display_name: displayName.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("rc_community_user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch {
      setError("Koneksi error. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="index-badge w-16 h-16 mx-auto mb-4 bg-neutral-900 border border-emerald-500/30 text-emerald-400">
            RC
          </div>
          <h1 className="headline text-2xl tracking-wider mb-2"><span className="accent">RITEL</span> COMMUNITY</h1>
          <p className="text-neutral-500 text-[11px] uppercase tracking-wider font-semibold">Platform Komunitas Trading Premium</p>
        </div>

        <div className="glass-card mark-lg p-8">
          {/* Tab Switch */}
          <div className="flex bg-[#15161A] border border-neutral-800 rounded-none p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all ${mode === "login" ? "bg-emerald-500 text-neutral-950" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all ${mode === "register" ? "bg-emerald-500 text-neutral-950" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              Daftar
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Nama Tampilan</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-[#15161A] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 text-sm placeholder-neutral-700 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase())}
                placeholder="username"
                className="w-full bg-[#15161A] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 text-sm placeholder-neutral-700 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                onKeyDown={e => e.key === "Enter" && handle()}
                className="w-full bg-[#15161A] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 text-sm placeholder-neutral-700 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <button
            onClick={handle}
            disabled={loading}
            className="w-full mt-6 btn-primary py-3.5 rounded-none font-black text-xs tracking-wider uppercase disabled:opacity-50"
          >
            {loading ? "MEMPROSES..." : mode === "login" ? "MASUK" : "BUAT AKUN"}
          </button>

          {mode === "login" && (
            <div className="mt-6 pt-6 border-t border-neutral-800/80 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Punya token VIP?</p>
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-wider transition-colors">
                Login dengan Token VIP
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-neutral-500 hover:text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
