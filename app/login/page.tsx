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
    try {
      const saved = localStorage.getItem("vip_token");
      if (saved) router.push("/vip");
    } catch {}
    const params = new URLSearchParams(window.location.search);
    const errParam = params.get("error");
    if (errParam) setErr(decodeURIComponent(errParam));
  }, []);

  const doLogin = async () => {
    const t = token.trim();
    if (!t) { setErr("Masukkan token VIP kamu."); return; }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t, isNewLogin: true }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vip_token", t);
        localStorage.setItem("vip_user", JSON.stringify(data.user));
        router.push("/vip");
      } else {
        setErr(data.message || "Token tidak valid atau sudah expired.");
      }
    } catch (e) {
      setErr("Gagal terhubung ke server. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-200 text-xs font-bold uppercase tracking-wider mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Beranda
        </Link>

        <div className="glass-card mark-lg p-8">
          <div className="text-center mb-8">
            <div className="index-badge w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-emerald-500/30 text-emerald-400">
              VIP
            </div>
            <h1 className="headline text-2xl tracking-wider mb-2">LOGIN <span className="accent">VIP</span></h1>
            <p className="text-neutral-500 text-[11px] uppercase tracking-wider font-semibold">Masukkan token VIP untuk akses eksklusif</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Token VIP</label>
              <div className="flex gap-2">
                <input
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && doLogin()}
                  placeholder="RC-GOLD-XXXXXXXX"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 min-w-0 bg-[#08111F] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 font-mono tracking-widest text-sm placeholder-neutral-700 outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) { setToken(text.trim()); setErr(""); }
                    } catch {
                      setErr("Gagal akses clipboard. Paste manual (long-press) di kolom token.");
                    }
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/></svg>
                  Tempel
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 mt-1.5">Salin token dari WhatsApp admin, lalu tap Tempel.</p>
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                {err}
              </div>
            )}

            <button
              onClick={doLogin}
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-none font-black text-xs tracking-wider uppercase disabled:opacity-50"
            >
              {loading ? "MEMVERIFIKASI..." : "MASUK VIP"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Belum punya token?</p>
            <div className="space-y-2">
              <a
                href="https://wa.me/6282218723401?text=Halo%20min%20mau%20daftar%20VIP!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block py-3 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 text-xs font-black uppercase tracking-wider transition-all"
              >
                Hubungi Admin WA
              </a>
              <Link
                href="/paket"
                className="w-full block py-3 border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 text-xs font-black uppercase tracking-wider transition-all"
              >
                Lihat Paket VIP
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] uppercase font-semibold tracking-wider text-neutral-600 mt-6">
          Token VIP diberikan setelah pembayaran dikonfirmasi admin.
        </p>
      </div>
    </div>
  );
}
