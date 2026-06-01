"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("vip_token");
    if (saved) router.push("/vip");
  }, []);

  const login = async () => {
    if (!token.trim()) { setErr("Masukkan token VIP kamu."); return; }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vip_token", token.trim());
        localStorage.setItem("vip_user", JSON.stringify(data.user));
        router.push("/vip");
      } else {
        setErr(data.message || "Token tidak valid atau sudah expired.");
      }
    } catch {
      setErr("Gagal terhubung. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white text-xs mb-8 transition-colors">
          ← Kembali ke Beranda
        </Link>

        <div className="card-glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mb-4">RC</div>
            <h1 className="text-xl font-black text-white">Login VIP</h1>
            <p className="text-slate-500 text-xs mt-1">Masukkan token VIP kamu untuk akses eksklusif</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Token VIP</label>
              <input
                value={token}
                onChange={e => setToken(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="RC-GOLD-XXXXXXXX"
                className="input-dark font-mono tracking-widest"
              />
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-red-400 text-xs">
                {err}
              </div>
            )}

            <button onClick={login} disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              {loading ? "Memverifikasi..." : "🔑 Masuk VIP"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-600 mb-3">Belum punya token?</p>
            <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20daftar%20VIP!" target="_blank" className="btn-green text-xs px-5 py-2.5 rounded-lg inline-block">
              💬 WA Admin untuk Bergabung
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Token VIP diberikan setelah pembayaran dikonfirmasi admin.
        </p>
      </div>
    </div>
  );
}
