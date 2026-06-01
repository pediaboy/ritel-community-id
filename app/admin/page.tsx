"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASS = "ritel2025";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
    if(user === "admin" && pass === ADMIN_PASS) {
      localStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setErr("Username atau password salah.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020818] flex items-center justify-center px-4">
      <div className="card-glass rounded-2xl p-8 w-full max-w-sm border border-blue-500/30">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl mb-3">RC</div>
          <h1 className="text-xl font-black text-white">Admin Panel</h1>
          <p className="text-slate-400 text-xs mt-1">RITEL COMMUNITY.ID</p>
        </div>
        <div className="space-y-3">
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Password" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button onClick={login} className="btn-primary w-full py-2.5 rounded-lg font-bold text-sm">Masuk</button>
        </div>
        <Link href="/" className="block text-center text-xs text-slate-500 hover:text-blue-400 mt-4 transition-colors">← Kembali ke Beranda</Link>
      </div>
    </div>
  );
}

type Tab = "signals"|"tokens"|"testimonials";

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");
  const [signals, setSignals] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [testis, setTestis] = useState<any[]>([]);
  const [sigForm, setSigForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
  const [tokForm, setTokForm] = useState<any>({ email:"", name:"", package:"gold", expiredAt:"" });
  const [editSig, setEditSig] = useState<string|null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    fetch("/api/admin/signals").then(r=>r.json()).then(d=>setSignals(d.signals||[]));
    fetch("/api/admin/tokens").then(r=>r.json()).then(d=>setTokens(d.tokens||[]));
    fetch("/api/testimonials").then(r=>r.json()).then(d=>setTestis(d.testimonials||[]));
  };

  // SIGNALS
  const saveSignal = async () => {
    const method = editSig ? "PUT" : "POST";
    const body = editSig ? { ...sigForm, id: editSig } : sigForm;
    await fetch("/api/admin/signals", { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSig(null);
    loadAll();
  };

  const deleteSignal = async (id: string) => {
    if(!confirm("Hapus sinyal ini?")) return;
    await fetch("/api/admin/signals?id=" + id, { method:"DELETE" });
    loadAll();
  };

  const editSignal = (s: any) => {
    setSigForm({ ...s });
    setEditSig(s.id);
    window.scrollTo(0, 0);
  };

  // TOKENS
  const saveToken = async () => {
    await fetch("/api/admin/tokens", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(tokForm) });
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    loadAll();
  };

  const toggleToken = async (t: any) => {
    await fetch("/api/admin/tokens", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:t.id, isActive:!t.isActive }) });
    loadAll();
  };

  const extendToken = async (t: any) => {
    const days = prompt("Tambah berapa hari?");
    if(!days) return;
    const newExp = new Date(t.expiredAt);
    newExp.setDate(newExp.getDate() + parseInt(days));
    await fetch("/api/admin/tokens", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:t.id, expiredAt:newExp.toISOString() }) });
    loadAll();
  };

  // TESTI
  const approveTesti = async (t: any) => {
    await fetch("/api/testimonials", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...t, isApproved:true }) });
    loadAll();
  };
  const deleteTesti = async (id: string) => {
    await fetch("/api/testimonials?id=" + id, { method:"DELETE" });
    loadAll();
  };

  const pkgOpts = ["basic","silver","gold","pro","platinum","elite"];
  const actionColors: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-blue-400" };

  return (
    <div className="min-h-screen bg-[#020818]">
      {/* Header */}
      <header className="bg-[#050f2c] border-b border-blue-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">RC</div>
          <div>
            <div className="text-white font-bold text-sm">Admin Panel</div>
            <div className="text-slate-400 text-xs">RITEL COMMUNITY.ID</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">← Lihat Web</Link>
          <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition-all">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 flex gap-0">
          {([["signals","⚡ Sinyal"],["tokens","🔑 Token User"],["testimonials","⭐ Testimoni"]] as [Tab,string][]).map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${tab===t ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* SIGNALS TAB */}
        {tab === "signals" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="card-glass rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4">{editSig ? "✏️ Edit Sinyal" : "➕ Tambah Sinyal"}</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Nama Saham" className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                  <input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value})} placeholder="Kode (cth: BBCA)" className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400 uppercase"/>
                </div>
                <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400">
                  {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-[#0a1a3e]">{a}</option>)}
                </select>
                <input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="Entry (cth: 9750 - 9800)" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                <input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="Target Profit (cth: 10.200 | 10.500)" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                <input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="Stop Loss (cth: 9.500)" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                <textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Catatan / analisis singkat..." rows={3} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400 resize-none"/>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Paket akses:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkgOpts.map(p => (
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e => {
                          const cur = sigForm.package || [];
                          setSigForm({...sigForm, package: e.target.checked ? [...cur,p] : cur.filter((x:string)=>x!==p)});
                        }} className="accent-blue-500"/>
                        <span className="text-xs text-slate-300 capitalize">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveSignal} className="btn-primary flex-1 py-2.5 rounded-lg text-sm font-bold">{editSig ? "Update" : "Simpan"}</button>
                  {editSig && <button onClick={() => { setEditSig(null); setSigForm({ saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"] }); }} className="px-4 py-2.5 rounded-lg text-sm text-slate-400 border border-slate-600 hover:border-slate-400">Batal</button>}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              <h2 className="text-white font-bold">📋 Daftar Sinyal ({signals.length})</h2>
              {signals.map(s => (
                <div key={s.id} className="card-glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{s.kode}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${s.action==="BUY"?"text-green-400 border-green-400/30 bg-green-400/10":s.action==="SELL"?"text-red-400 border-red-400/30 bg-red-400/10":s.action==="ANTRI"?"text-blue-400 border-blue-400/30 bg-blue-400/10":"text-yellow-400 border-yellow-400/30 bg-yellow-400/10"}`}>{s.action}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editSignal(s)} className="text-xs text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => deleteSignal(s.id)} className="text-xs text-red-400 hover:underline">Hapus</button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{s.saham} · Entry: {s.entry} · TP: {s.tp} · SL: {s.sl}</div>
                  {s.notes && <div className="text-xs text-slate-500 mt-1 italic">{s.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOKENS TAB */}
        {tab === "tokens" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-glass rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4">➕ Buat Token User</h2>
              <div className="space-y-3">
                <input value={tokForm.name} onChange={e=>setTokForm({...tokForm,name:e.target.value})} placeholder="Nama User" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                <input value={tokForm.email} onChange={e=>setTokForm({...tokForm,email:e.target.value})} placeholder="Email User" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
                <select value={tokForm.package} onChange={e=>setTokForm({...tokForm,package:e.target.value})} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400">
                  {pkgOpts.map(p=><option key={p} value={p} className="bg-[#0a1a3e] capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tanggal Expired</label>
                  <input type="date" value={tokForm.expiredAt?.split("T")[0]||""} onChange={e=>setTokForm({...tokForm,expiredAt:e.target.value})} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400"/>
                </div>
                <button onClick={saveToken} className="btn-primary w-full py-2.5 rounded-lg text-sm font-bold">Generate Token</button>
              </div>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4">🔑 Token Aktif ({tokens.length})</h2>
              <div className="space-y-3">
                {tokens.map(t => {
                  const expired = new Date(t.expiredAt) < new Date();
                  return (
                    <div key={t.id} className={`card-glass rounded-xl p-4 ${!t.isActive || expired ? "opacity-60" : ""}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-white font-semibold text-sm">{t.name}</div>
                          <div className="text-slate-400 text-xs">{t.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${t.isActive&&!expired?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>
                            {!t.isActive?"Nonaktif":expired?"Expired":"Aktif"}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-xs text-blue-300 bg-blue-500/10 rounded px-2 py-1 mb-2 break-all">{t.token}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          <span className="capitalize font-semibold text-slate-300">{t.package}</span> · Exp: {new Date(t.expiredAt).toLocaleDateString("id-ID")}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => extendToken(t)} className="text-xs text-blue-400 hover:underline">+Hari</button>
                          <button onClick={() => toggleToken(t)} className={`text-xs hover:underline ${t.isActive?"text-yellow-400":"text-green-400"}`}>{t.isActive?"Nonaktifkan":"Aktifkan"}</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {tab === "testimonials" && (
          <div>
            <h2 className="text-white font-bold mb-4">⭐ Kelola Testimoni ({testis.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testis.map(t => (
                <div key={t.id} className="card-glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300">{t.name?.substring(0,2).toUpperCase()}</div>
                      <div>
                        <div className="text-white font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-slate-400">Paket {t.package} · {t.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {!t.isApproved && <button onClick={() => approveTesti(t)} className="text-xs text-green-400 hover:underline">Approve</button>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.isApproved?"bg-green-500/20 text-green-400":"bg-yellow-500/20 text-yellow-400"}`}>{t.isApproved?"Tayang":"Pending"}</span>
                      <button onClick={() => deleteTesti(t.id)} className="text-xs text-red-400 hover:underline">Hapus</button>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xs mb-2">{"★".repeat(t.rating)}</div>
                  <p className="text-slate-300 text-sm italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthed(localStorage.getItem("admin_auth") === "1");
    setChecking(false);
  }, []);

  const logout = () => { localStorage.removeItem("admin_auth"); setAuthed(false); };

  if(checking) return <div className="min-h-screen bg-[#020818] flex items-center justify-center"><div className="text-slate-400 text-sm">Loading...</div></div>;
  if(!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={logout} />;
}
