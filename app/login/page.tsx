"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vip_session");
      if (saved) router.push("/vip");
    } catch {}
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setErr("Masukkan alamat email yang valid."); return; }
    setLoading(true); setErr(""); setInfo("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setInfo("Kode OTP 6 digit sudah dikirim ke email kamu.");
        setResendIn(30);
        setTimeout(() => otpRef.current?.focus(), 100);
      } else {
        setErr(data.message || "Gagal mengirim kode OTP.");
      }
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    const code = otp.trim();
    if (!code || code.length < 6) { setErr("Masukkan kode OTP 6 digit."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vip_session", JSON.stringify({ email: data.user.email, access_token: data.access_token }));
        localStorage.setItem("vip_user", JSON.stringify(data.user));
        router.push("/vip");
      } else {
        setErr(data.message || "Kode OTP salah atau sudah kedaluwarsa.");
      }
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
    }
    setLoading(false);
  };

  const pasteOtp = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = (text.match(/\d/g) || []).join("").slice(0, 6);
      if (digits) { setOtp(digits); setErr(""); }
    } catch {
      setErr("Gagal akses clipboard. Ketik manual kode OTP-nya.");
    }
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

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="index-badge w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-blue-600/40 text-blue-400">
              VIP
            </div>
            <h1 className="headline text-2xl tracking-wider mb-2">MASUK <span className="accent">AKUN</span></h1>
            <p className="text-neutral-500 text-[11px] uppercase tracking-wider font-semibold">
              {step === "email" ? "Login / daftar cukup pakai email" : "Masukkan kode OTP yang dikirim ke email kamu"}
            </p>
          </div>

          {step === "email" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Alamat Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && sendOtp()}
                  placeholder="nama@email.com"
                  type="email"
                  autoComplete="email"
                  className="w-full bg-[#08111F] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 text-sm placeholder-neutral-700 outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-[10px] text-neutral-600 mt-1.5">Belum punya akun? Otomatis terdaftar setelah verifikasi email.</p>
              </div>

              {err && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {err}
                </div>
              )}

              <button
                onClick={sendOtp}
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-none font-black text-xs tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? "MENGIRIM KODE..." : "KIRIM KODE OTP"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Kode OTP (6 digit)</label>
                <div className="flex gap-2">
                  <input
                    ref={otpRef}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={e => e.key === "Enter" && !loading && verifyOtp()}
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="flex-1 min-w-0 bg-[#08111F] border border-neutral-800 rounded-none px-4 py-3 text-neutral-100 font-mono tracking-[0.4em] text-lg text-center placeholder-neutral-700 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={pasteOtp}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3.5 bg-blue-600/10 border border-blue-600/40 text-blue-400 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-600/20 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/></svg>
                    Tempel
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 mt-1.5">Terkirim ke <span className="text-neutral-400">{email}</span></p>
              </div>

              {info && !err && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-none px-4 py-3 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {info}
                </div>
              )}
              {err && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-none px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {err}
                </div>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-none font-black text-xs tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? "MEMVERIFIKASI..." : "VERIFIKASI & MASUK"}
              </button>

              <button
                onClick={() => { if (resendIn === 0) sendOtp(); }}
                disabled={resendIn > 0 || loading}
                className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-300 disabled:opacity-40 transition-colors"
              >
                {resendIn > 0 ? `Kirim Ulang Kode (${resendIn}s)` : "Kirim Ulang Kode OTP"}
              </button>
              <button
                onClick={() => { setStep("email"); setOtp(""); setErr(""); setInfo(""); }}
                className="w-full py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Ganti Email
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Mau upgrade ke VIP?</p>
            <div className="space-y-2">
              <a
                href="https://wa.me/6282218723401?text=Halo%20min%20mau%20upgrade%20ke%20VIP!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block py-3 border border-blue-600/40 bg-blue-950/20 text-blue-400 hover:bg-blue-950/40 text-xs font-black uppercase tracking-wider transition-all"
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
          Akun VIP aktif setelah admin mengonfirmasi pembayaran.
        </p>
      </div>
    </div>
  );
}
