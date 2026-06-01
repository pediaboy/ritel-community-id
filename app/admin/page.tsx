"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "ritel2025";

// ===== LOGIN =====
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem("admin_auth", "1");
        onLogin();
      } else {
        setErr("Username atau password salah.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="card-glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mb-4">RC</div>
            <h1 className="text-xl font-black text-white">Admin Panel</h1>
            <p className="text-slate-500 text-xs mt-1">RITEL COMMUNITY.ID</p>
          </div>
          <div className="space-y-3">
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Username" className="input-dark" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password" className="input-dark" />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <button onClick={login} disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </div>
          <Link href="/" className="block text-center text-xs text-slate-600 hover:text-blue-400 mt-5 transition-colors">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = "signals" | "tokens" | "testimonials" | "liveinfo" | "topstocks";

// ===== DASHBOARD =====
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");
  const [signals, setSignals] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [testis, setTestis] = useState<any[]>([]);
  const [liveInfo, setLiveInfo] = useState({ message: "", isActive: false });
  const [liveMsg, setLiveMsg] = useState("");
  const [liveSaving, setLiveSaving] = useState(false);
  const [topStocks, setTopStocks] = useState<any[]>([]);

  const [sigForm, setSigForm] = useState<any>({ saham: "", kode: "", action: "BUY", entry: "", tp: "", sl: "", notes: "", package: ["gold","pro","platinum","elite"] });
  const [editSigId, setEditSigId] = useState<string | null>(null);
  const [tokForm, setTokForm] = useState<any>({ email: "", name: "", package: "gold", expiredAt: "" });

  const pkgOpts = ["basic", "silver", "gold", "pro", "platinum", "elite"];
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-blue-400" };

  const loadAll = () => {
    fetch("/api/admin/signals").then(r => r.json()).then(d => setSignals(d.signals || []));
    fetch("/api/admin/tokens").then(r => r.json()).then(d => setTokens(d.tokens || []));
    fetch("/api/testimonials").then(r => r.json()).then(d => setTestis(d.testimonials || []));
    fetch("/api/admin/liveinfo").then(r => r.json()).then(d => {
      if (d.liveInfo) { setLiveInfo(d.liveInfo); setLiveMsg(d.liveInfo.message || ""); }
    }).catch(() => {});
    fetch("/api/stocks").then(r => r.json()).then(d => setTopStocks(d.stocks || [])).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  // SIGNALS
  const saveSignal = async () => {
    const method = editSigId ? "PUT" : "POST";
    const body = editSigId ? { ...sigForm, id: editSigId } : sigForm;
    await fetch("/api/admin/signals", { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSigId(null);
    loadAll();
  };
  const deleteSignal = async (id: string) => {
    if (!confirm("Hapus sinyal ini?")) return;
    await fetch("/api/admin/signals?id=" + id, { method: "DELETE" });
    loadAll();
  };
  const editSignal = (s: any) => {
    setSigForm({ ...s });
    setEditSigId(s.id);
    setTab("signals");
    window.scrollTo(0, 0);
  };

  // TOKENS
  const saveToken = async () => {
    if (!tokForm.email || !tokForm.expiredAt) return alert("Isi email dan tanggal expired!");
    await fetch("/api/admin/tokens", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(tokForm) });
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    loadAll();
  };
  const toggleToken = async (t: any) => {
    await fetch("/api/admin/tokens", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: t.id, isActive: !t.isActive }) });
    loadAll();
  };
  const deleteToken = async (id: string) => {
    if (!confirm("Hapus token ini? User tidak bisa login lagi.")) return;
    await fetch("/api/admin/tokens?id=" + id, { method: "DELETE" });
    loadAll();
  };
  const extendToken = async (t: any) => {
    const days = prompt("Tambah berapa hari?");
    if (!days) return;
    const newExp = new Date(t.expiredAt);
    newExp.setDate(newExp.getDate() + parseInt(days));
    await fetch("/api/admin/tokens", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: t.id, expiredAt: newExp.toISOString() }) });
    loadAll();
  };

  // TESTIMONIALS
  const approveTesti = async (t: any) => {
    await fetch("/api/testimonials", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ...t, isApproved: true }) });
    loadAll();
  };
  const deleteTesti = async (id: string) => {
    await fetch("/api/testimonials?id=" + id, { method: "DELETE" });
    loadAll();
  };

  // LIVE INFO
  const saveLiveInfo = async () => {
    setLiveSaving(true);
    await fetch("/api/admin/liveinfo", {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message: liveMsg, isActive: liveMsg.trim().length > 0 }),
    });
    setLiveSaving(false);
    loadAll();
    alert("Live info disimpan!");
  };
  const clearLiveInfo = async () => {
    setLiveMsg("");
    await fetch("/api/admin/liveinfo", {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message: "", isActive: false }),
    });
    loadAll();
  };

  const tabs: [Tab, string][] = [
    ["signals", "⚡ Sinyal"],
    ["tokens", "🔑 Token"],
    ["topstocks", "📈 Top Saham"],
    ["liveinfo", "📢 Live Info"],
    ["testimonials", "⭐ Testimoni"],
  ];

  const isExpired = (exp: string) => new Date(exp) < new Date();
  const isNearExpiry = (exp: string) => {
    const diff = new Date(exp).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">RC</div>
          <div>
            <div className="text-white font-bold text-sm">Admin Panel</div>
            <div className="text-slate-500 text-xs">RITEL COMMUNITY.ID</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">← Lihat Web</Link>
          <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 rounded-lg transition-all">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {tabs.map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3.5 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${tab === t ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ===== SIGNALS TAB ===== */}
        {tab === "signals" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4 text-sm">{editSigId ? "✏️ Edit Sinyal" : "➕ Tambah Sinyal"}</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={sigForm.saham} onChange={e => setSigForm({...sigForm, saham:e.target.value})} placeholder="Nama Saham" className="input-dark" />
                  <input value={sigForm.kode} onChange={e => setSigForm({...sigForm, kode:e.target.value.toUpperCase()})} placeholder="Kode (BBCA)" className="input-dark" />
                </div>
                <select value={sigForm.action} onChange={e => setSigForm({...sigForm, action:e.target.value})} className="input-dark">
                  {["BUY","SELL","HOLD","ANTRI"].map(a => <option key={a} value={a} className="bg-black">{a}</option>)}
                </select>
                <input value={sigForm.entry} onChange={e => setSigForm({...sigForm, entry:e.target.value})} placeholder="Entry (9750 - 9800)" className="input-dark" />
                <input value={sigForm.tp} onChange={e => setSigForm({...sigForm, tp:e.target.value})} placeholder="Target Profit (10.200 | 10.500)" className="input-dark" />
                <input value={sigForm.sl} onChange={e => setSigForm({...sigForm, sl:e.target.value})} placeholder="Stop Loss (9.500)" className="input-dark" />
                <textarea value={sigForm.notes} onChange={e => setSigForm({...sigForm, notes:e.target.value})} placeholder="Catatan / analisis..." rows={3} className="input-dark resize-none" />
                <div>
                  <p className="text-xs text-slate-500 mb-2">Paket akses:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkgOpts.map(p => (
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer text-xs">
                        <input type="checkbox" checked={(sigForm.package || []).includes(p)} onChange={e => {
                          const cur = sigForm.package || [];
                          setSigForm({...sigForm, package: e.target.checked ? [...cur, p] : cur.filter((x: string) => x !== p)});
                        }} className="accent-blue-500"/>
                        <span className="text-slate-400 capitalize">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveSignal} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editSigId ? "Update" : "Simpan"}</button>
                  {editSigId && <button onClick={() => { setEditSigId(null); setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]}); }} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4 text-sm">📋 Daftar Sinyal ({signals.length})</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {signals.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-10">Belum ada sinyal. Tambah di form sebelah.</div>
                ) : signals.map(s => (
                  <div key={s.id} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-black text-white">{s.kode}</span>
                        <span className="text-slate-500 text-xs ml-2">{s.saham}</span>
                      </div>
                      <span className={`text-xs font-bold ${actionColor[s.action]}`}>{s.action}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">Entry: {s.entry} · TP: {s.tp} · SL: {s.sl}</div>
                    <div className="flex gap-2">
                      <button onClick={() => editSignal(s)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Edit</button>
                      <button onClick={() => deleteSignal(s.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TOKENS TAB ===== */}
        {tab === "tokens" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4 text-sm">➕ Tambah Token User</h2>
              <div className="space-y-3">
                <input value={tokForm.name} onChange={e => setTokForm({...tokForm, name:e.target.value})} placeholder="Nama user" className="input-dark" />
                <input value={tokForm.email} onChange={e => setTokForm({...tokForm, email:e.target.value})} placeholder="Email user" className="input-dark" />
                <select value={tokForm.package} onChange={e => setTokForm({...tokForm, package:e.target.value})} className="input-dark">
                  {pkgOpts.map(p => <option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Expired tanggal</label>
                  <input type="datetime-local" value={tokForm.expiredAt} onChange={e => setTokForm({...tokForm, expiredAt:e.target.value})} className="input-dark" />
                </div>
                <button onClick={saveToken} className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold">Generate Token</button>
              </div>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4 text-sm">🔑 Daftar Token ({tokens.length})</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tokens.map(t => {
                  const expired = isExpired(t.expiredAt);
                  const nearExpiry = isNearExpiry(t.expiredAt);
                  return (
                    <div key={t.id} className={`card rounded-xl p-4 ${expired ? "border-red-500/20" : nearExpiry ? "border-yellow-500/20" : ""}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="font-bold text-white text-sm">{t.name || t.email}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full capitalize ${t.isActive && !expired ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                            {expired ? "EXPIRED" : t.isActive ? "AKTIF" : "NONAKTIF"}
                          </span>
                        </div>
                        <span className="text-xs text-blue-400 capitalize">{t.package}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1">{t.email}</div>
                      <div className="font-mono text-xs text-slate-400 bg-white/5 rounded px-2 py-1 mb-2">{t.token}</div>
                      <div className={`text-xs mb-3 ${expired ? "text-red-400" : nearExpiry ? "text-yellow-400" : "text-slate-500"}`}>
                        Expired: {new Date(t.expiredAt).toLocaleDateString("id-ID", {day:"numeric",month:"long",year:"numeric"})}
                        {expired && " — SUDAH EXPIRED"}
                        {nearExpiry && !expired && " — Hampir expired!"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => toggleToken(t)} className={`text-xs px-3 py-1.5 rounded-lg ${t.isActive ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                          {t.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button onClick={() => extendToken(t)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Perpanjang</button>
                        <button onClick={() => deleteToken(t.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Hapus</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== TOP STOCKS TAB ===== */}
        {tab === "topstocks" && (
          <div>
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-1">📈 Top Saham Live</h2>
              <p className="text-slate-500 text-xs">Data realtime dari Yahoo Finance. Refresh untuk update terbaru.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {topStocks.map((s: any, i: number) => {
                const pos = s.changePercent >= 0;
                return (
                  <div key={i} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-white">{s.symbol?.replace(".JK","") || s.kode}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                        {pos ? "+" : ""}{s.changePercent?.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xl font-black text-white">{s.price?.toLocaleString("id-ID")}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{s.name}</div>
                    <div className="text-xs text-slate-600 mt-1">Vol: {s.volume || "-"}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocks(d.stocks||[]))} className="btn-primary text-sm px-5 py-2.5 rounded-xl">🔄 Refresh Data</button>
          </div>
        )}

        {/* ===== LIVE INFO TAB ===== */}
        {tab === "liveinfo" && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-1">📢 Live Info untuk Member VIP</h2>
              <p className="text-slate-500 text-xs">Teks ini akan muncul sebagai kotak notifikasi di semua halaman VIP. Kosongkan untuk menyembunyikan.</p>
            </div>

            <div className="card rounded-2xl p-5 mb-4">
              <label className="text-xs text-slate-400 mb-2 block font-medium">Isi Pesan Live Info</label>
              <textarea
                value={liveMsg}
                onChange={e => setLiveMsg(e.target.value)}
                placeholder="Contoh: 🚨 Market Update: IHSG sedang konsolidasi di 7.300. Hold posisi, tunggu breakout 7.500. Update sinyal akan dikirim jam 14.00 WIB."
                rows={5}
                className="input-dark resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={saveLiveInfo} disabled={liveSaving} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">
                  {liveSaving ? "Menyimpan..." : "💾 Simpan & Tampilkan"}
                </button>
                <button onClick={clearLiveInfo} className="px-4 py-2.5 rounded-xl text-sm text-red-400 border border-red-400/20 hover:bg-red-400/5">🗑️ Hapus</button>
              </div>
            </div>

            {/* Preview */}
            {liveMsg.trim() && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Preview:</p>
                <div className="live-info-box">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-lg mt-0.5">📢</span>
                    <div>
                      <div className="text-yellow-400 text-xs font-bold mb-1">INFO DARI ADMIN</div>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{liveMsg}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!liveMsg.trim() && (
              <div className="text-center py-8 text-slate-600 text-sm">
                Kotak live info tidak ditampilkan (pesan kosong)
              </div>
            )}
          </div>
        )}

        {/* ===== TESTIMONIALS TAB ===== */}
        {tab === "testimonials" && (
          <div>
            <h2 className="text-white font-bold text-sm mb-4">⭐ Manajemen Testimoni ({testis.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testis.length === 0 ? (
                <div className="text-slate-500 text-sm col-span-3 text-center py-10">Belum ada testimoni yang masuk.</div>
              ) : testis.map(t => (
                <div key={t.id} className={`card rounded-xl p-4 ${t.isApproved ? "" : "border-yellow-500/20"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.isApproved ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                      {t.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="text-xs text-blue-400 capitalize mb-1">Paket {t.package}</div>
                  <div className="text-yellow-400 text-xs mb-2">{"★".repeat(t.rating || 5)}</div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex gap-2">
                    {!t.isApproved && <button onClick={() => approveTesti(t)} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">Approve</button>}
                    <button onClick={() => deleteTesti(t.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAIN =====
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const a = localStorage.getItem("admin_auth");
    setAuth(a === "1");
    setChecking(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_auth");
    setAuth(false);
  };

  if (checking) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;
  return <AdminDashboard onLogout={logout} />;
}
