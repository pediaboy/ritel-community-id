"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"member"|"admin">("member");

  // Member state
  const [token, setToken] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberErr, setMemberErr] = useState("");

  // Admin state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErr, setAdminErr] = useState("");

  const loginMember = async () => {
    if (!token.trim()) { setMemberErr("Masukkan token Anda."); return; }
    setMemberLoading(true); setMemberErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "member", token }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("vip_member", JSON.stringify(data.member));
        router.push("/vip");
      } else {
        setMemberErr(data.message || "Login gagal.");
      }
    } catch {
      setMemberErr("Gagal menghubungi server.");
    } finally {
      setMemberLoading(false);
    }
  };

  const loginAdmin = async () => {
    if (!username || !password) { setAdminErr("Isi username dan password."); return; }
    setAdminLoading(true); setAdminErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "admin", username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_auth", "1");
        router.push("/admin");
      } else {
        setAdminErr(data.message || "Login gagal.");
      }
    } catch {
      setAdminErr("Gagal menghubungi server.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg,#020818 0%,#050f2c 60%,#020818 100%)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)" }}/>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.05) 0%,transparent 70%)" }}/>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg" style={{ background: "linear-gradient(135deg,#0ea5e9,#22d3ee)" }}>RC</div>
            <div className="text-left">
              <span className="text-white font-black text-xl">RITEL</span>
              <span style={{ background: "linear-gradient(135deg,#38bdf8,#22d3ee,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} className="font-black text-xl"> COMMUNITY</span>
              <span className="text-blue-400 font-black text-xl">.ID</span>
            </div>
          </Link>
          <p className="text-slate-400 text-sm">Masuk ke akun Anda</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(10,26,62,0.85)", border: "1px solid rgba(14,165,233,0.25)", backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: "1px solid rgba(14,165,233,0.15)" }}>
            <button
              onClick={() => setTab("member")}
              className="flex-1 py-4 text-sm font-bold transition-all"
              style={{
                color: tab === "member" ? "#38bdf8" : "#64748b",
                background: tab === "member" ? "rgba(14,165,233,0.08)" : "transparent",
                borderBottom: tab === "member" ? "2px solid #0ea5e9" : "2px solid transparent",
              }}
            >
              💎 Login Member VIP
            </button>
            <button
              onClick={() => setTab("admin")}
              className="flex-1 py-4 text-sm font-bold transition-all"
              style={{
                color: tab === "admin" ? "#38bdf8" : "#64748b",
                background: tab === "admin" ? "rgba(14,165,233,0.08)" : "transparent",
                borderBottom: tab === "admin" ? "2px solid #0ea5e9" : "2px solid transparent",
              }}
            >
              ⚙️ Admin Panel
            </button>
          </div>

          <div className="p-7">
            {/* MEMBER LOGIN */}
            {tab === "member" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}>
                    <span className="text-2xl">🔑</span>
                    <div>
                      <p className="text-white font-semibold text-sm">Login dengan Token VIP</p>
                      <p className="text-slate-400 text-xs mt-0.5">Token dikirim setelah pembayaran dikonfirmasi admin</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Token VIP Anda</label>
                  <input
                    value={token}
                    onChange={e => setToken(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && loginMember()}
                    placeholder="RC-GOLD-XXXXXXXXXXXX"
                    className="w-full rounded-2xl px-4 py-3.5 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all"
                    style={{
                      background: "rgba(14,165,233,0.06)",
                      border: memberErr ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(14,165,233,0.25)",
                    }}
                  />
                  {memberErr && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><span>⚠</span>{memberErr}</p>}
                </div>

                <button
                  onClick={loginMember}
                  disabled={memberLoading}
                  className="w-full py-4 rounded-2xl font-black text-base transition-all"
                  style={{
                    background: memberLoading ? "rgba(14,165,233,0.3)" : "linear-gradient(135deg,#0ea5e9,#0284c7)",
                    color: "white",
                    opacity: memberLoading ? 0.7 : 1,
                  }}
                >
                  {memberLoading ? "Memverifikasi..." : "🚀 Masuk ke Area VIP"}
                </button>

                <div className="mt-6 p-4 rounded-2xl text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <p className="text-slate-400 text-xs mb-2">Belum punya token? Order paket sekarang!</p>
                  <a href="https://wa.me/6282218723401?text=Halo%20min%20saya%20mau%20order%20paket%20VIP" target="_blank"
                    className="text-yellow-400 font-bold text-sm hover:underline">📱 Chat WhatsApp Admin →</a>
                </div>
              </div>
            )}

            {/* ADMIN LOGIN */}
            {tab === "admin" && (
              <div>
                <div className="flex items-center gap-3 p-4 rounded-2xl mb-6" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Area Admin</p>
                    <p className="text-slate-400 text-xs mt-0.5">Hanya untuk pengelola RITEL COMMUNITY.ID</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-600 outline-none"
                      style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && loginAdmin()}
                      placeholder="••••••••"
                      className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-600 outline-none"
                      style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
                    />
                  </div>
                  {adminErr && <p className="text-red-400 text-xs flex items-center gap-1.5"><span>⚠</span>{adminErr}</p>}
                </div>

                <button
                  onClick={loginAdmin}
                  disabled={adminLoading}
                  className="w-full py-4 rounded-2xl font-black text-base transition-all"
                  style={{
                    background: adminLoading ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg,#dc2626,#b91c1c)",
                    color: "white",
                    opacity: adminLoading ? 0.7 : 1,
                  }}
                >
                  {adminLoading ? "Memverifikasi..." : "🔐 Masuk Admin Panel"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}
