"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommunityLogin() {
  const [mode, setMode] = useState<"login"|"register">("login");
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#04070F" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg,#1e5af0,#00c8ff)", boxShadow: "0 0 30px rgba(30,90,240,0.5)" }}>
            <span className="text-white font-black text-xl">RC</span>
          </div>
          <h1 className="text-white font-black text-xl tracking-wider">RITEL COMMUNITY.ID</h1>
          <p className="text-gray-500 text-sm mt-1">Platform Komunitas Trading Premium</p>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          <button onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode==="login" ? "bg-blue-600 text-white" : "text-gray-400"}`}>
            Login
          </button>
          <button onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode==="register" ? "bg-blue-600 text-white" : "text-gray-400"}`}>
            Daftar
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Nama Tampilan</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="Nama lengkap kamu"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
              />
            </div>
          )}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value.toLowerCase())}
              placeholder="username (huruf kecil, angka, _)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              onKeyDown={e => e.key === "Enter" && handle()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button onClick={handle} disabled={loading}
          className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#1e5af0,#0070f3)", boxShadow: "0 0 20px rgba(30,90,240,0.4)" }}>
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Buat Akun"}
        </button>

        {mode === "login" && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">Punya token VIP?</p>
            <Link href="/login" className="text-blue-400 text-xs hover:underline">Login dengan Token VIP </Link>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-600 text-xs hover:text-gray-400"> Kembali ke beranda</Link>
        </div>
      </div>
    </div>
  );
}
