"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "masuk" | "daftar";
type RegStep = "form" | "otp";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("masuk");
  const [regStep, setRegStep] = useState<RegStep>("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const savedUser = localStorage.getItem("vip_user");
      if (saved && savedUser) {
        const parsed = JSON.parse(saved);
        const u = JSON.parse(savedUser);
        if (parsed?.access_token && parsed?.email && u?.email) {
          router.push("/vip");
          return;
        }
      }
      localStorage.removeItem("vip_session");
      localStorage.removeItem("vip_user");
    } catch {
      localStorage.removeItem("vip_session");
      localStorage.removeItem("vip_user");
    }
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const switchTab = (t: Tab) => {
    setTab(t); setRegStep("form"); setErr(""); setInfo("");
    setPassword(""); setConfirmPassword(""); setOtp("");
  };

  const doLogin = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setErr("Masukkan alamat email yang valid."); return; }
    if (!password) { setErr("Masukkan kata sandi kamu."); return; }
    setLoading(true); setErr(""); setInfo("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vip_session", JSON.stringify({ email: data.user.email, access_token: data.access_token }));
        localStorage.setItem("vip_user", JSON.stringify(data.user));
        router.push("/vip");
      } else if (data.needsVerification) {
        setErr("Email belum diverifikasi. Silakan daftar ulang untuk menerima kode OTP baru.");
        setTab("daftar"); setRegStep("form");
      } else {
        setErr(data.message || "Email atau kata sandi salah.");
      }
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
    }
    setLoading(false);
  };

  const doRegister = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setErr("Masukkan alamat email yang valid."); return; }
    if (!password || password.length < 6) { setErr("Kata sandi minimal 6 karakter."); return; }
    if (password !== confirmPassword) { setErr("Konfirmasi kata sandi tidak cocok."); return; }
    setLoading(true); setErr(""); setInfo("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password }),
      });
      const data = await res.json();
      if (data.success) {
        setRegStep("otp");
        setInfo("Kode OTP 6 digit sudah dikirim ke email kamu.");
        setResendIn(30);
        setTimeout(() => otpRef.current?.focus(), 100);
      } else if (data.alreadyRegistered) {
        setErr(data.message);
        setTab("masuk");
      } else {
        setErr(data.message || "Gagal mendaftar.");
      }
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    if (resendIn > 0) return;
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.success) {
        setInfo("Kode OTP baru sudah dikirim ke email kamu.");
        setResendIn(30);
      } else {
        setErr(data.message || "Gagal mengirim ulang kode.");
      }
    } catch {
      setErr("Gagal terhubung ke server.");
    }
    setLoading(false);
  };

  const verifyRegisterOtp = async () => {
    const code = otp.trim();
    if (!code || code.length < 6) { setErr("Masukkan kode OTP 6 digit."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/auth/verify-register", {
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

  const inputCls = "w-full bg-[#08111F] border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 text-sm placeholder-neutral-700 outline-none focus:border-blue-500 transition-colors";

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
          <div className="text-center mb-6">
            <div className="index-badge w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-blue-600/40 text-blue-400">
              VIP
            </div>
            <h1 className="headline text-2xl tracking-wider mb-2">AKUN <span className="accent">SAYA</span></h1>
          </div>

          {/* Tabs */}
          {!(tab === "daftar" && regStep === "otp") && (
            <div className="flex mb-6 rounded-lg overflow-hidden border border-neutral-800">
              <button
                onClick={() => switchTab("masuk")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${tab === "masuk" ? "bg-blue-600 text-white" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
              >
                Masuk
              </button>
              <button
                onClick={() => switchTab("daftar")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${tab === "daftar" ? "bg-blue-600 text-white" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
              >
                Daftar
              </button>
            </div>
          )}

          {/* MASUK */}
          {tab === "masuk" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Alamat Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  type="email"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Kata Sandi</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && doLogin()}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  className={inputCls}
                />
              </div>

              {err && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-xs font-bold">
                  {err}
                </div>
              )}

              <button
                onClick={doLogin}
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-lg font-black text-xs tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? "MEMPROSES..." : "MASUK"}
              </button>
              <p className="text-center text-[11px] text-neutral-600">
                Belum punya akun? <button onClick={() => switchTab("daftar")} className="text-blue-400 font-bold">Daftar dulu</button>
              </p>
            </div>
          )}

          {/* DAFTAR — step 1: form */}
          {tab === "daftar" && regStep === "form" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Alamat Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  type="email"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Kata Sandi</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  type="password"
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Konfirmasi Kata Sandi</label>
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !loading && doRegister()}
                  placeholder="Ulangi kata sandi"
                  type="password"
                  autoComplete="new-password"
                  className={inputCls}
                />
                <p className="text-[10px] text-neutral-600 mt-1.5">Kami akan kirim kode OTP ke email untuk verifikasi sebelum akun aktif.</p>
              </div>

              {err && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-xs font-bold">
                  {err}
                </div>
              )}

              <button
                onClick={doRegister}
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-lg font-black text-xs tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? "MENGIRIM KODE..." : "DAFTAR & KIRIM OTP"}
              </button>
            </div>
          )}

          {/* DAFTAR — step 2: otp */}
          {tab === "daftar" && regStep === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-1.5 block">Kode OTP (6 digit)</label>
                <div className="flex gap-2">
                  <input
                    ref={otpRef}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={e => e.key === "Enter" && !loading && verifyRegisterOtp()}
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="flex-1 min-w-0 bg-[#08111F] border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 font-mono tracking-[0.4em] text-lg text-center placeholder-neutral-700 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={pasteOtp}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3.5 bg-blue-600/10 border border-blue-600/40 text-blue-400 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-600/20 transition-colors rounded-lg"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/></svg>
                    Tempel
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 mt-1.5">Terkirim ke <span className="text-neutral-400">{email}</span></p>
              </div>

              {info && !err && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-blue-400 text-xs font-bold">
                  {info}
                </div>
              )}
              {err && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-xs font-bold">
                  {err}
                </div>
              )}

              <button
                onClick={verifyRegisterOtp}
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-lg font-black text-xs tracking-wider uppercase disabled:opacity-50"
              >
                {loading ? "MEMVERIFIKASI..." : "VERIFIKASI & MASUK"}
              </button>

              <button
                onClick={resendOtp}
                disabled={resendIn > 0 || loading}
                className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-300 disabled:opacity-40 transition-colors"
              >
                {resendIn > 0 ? `Kirim Ulang Kode (${resendIn}s)` : "Kirim Ulang Kode OTP"}
              </button>
              <button
                onClick={() => { setRegStep("form"); setOtp(""); setErr(""); setInfo(""); }}
                className="w-full py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Kembali
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Mau upgrade ke VIP?</p>
            <div className="flex gap-2 justify-center">
              <Link href="/paket" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">Lihat Paket VIP</Link>
              <span className="text-neutral-700">•</span>
              <a href="https://wa.me/6289663874700" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">WhatsApp Admin</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
