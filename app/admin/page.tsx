"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "ritel2025";

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
    }, 400);
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
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            <button onClick={login} disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </div>
          <Link href="/" className="block text-center text-xs text-slate-600 hover:text-blue-400 mt-5 transition-colors">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = "signals" | "tokens" | "topstocks" | "liveinfo" | "testimonials";

function Btn({ onClick, color, children }: { onClick: () => void; color: string; children: React.ReactNode }) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20",
    red: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20",
  };
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${colors[color]}`}>
      {children}
    </button>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");

  // SIGNALS
  const [signals, setSignals] = useState<any[]>([]);
  const [sigForm, setSigForm] = useState<any>({ saham: "", kode: "", action: "BUY", entry: "", tp: "", sl: "", notes: "", package: ["gold","pro","platinum","elite"] });
  const [editSigId, setEditSigId] = useState<string | null>(null);
  const [showSigForm, setShowSigForm] = useState(false);

  // TOKENS
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokForm, setTokForm] = useState<any>({ email: "", name: "", package: "gold", expiredAt: "" });
  const [editTokId, setEditTokId] = useState<string | null>(null);
  const [showTokForm, setShowTokForm] = useState(false);

  // TOP STOCKS (custom override)
  const [topStocks, setTopStocks] = useState<any[]>([]);
  const [customStocks, setCustomStocks] = useState<any[]>([]);
  const [stockForm, setStockForm] = useState<any>({ kode: "", name: "", price: "", change: "", changePercent: "" });
  const [editStockId, setEditStockId] = useState<string | null>(null);
  const [showStockForm, setShowStockForm] = useState(false);
  const [stockMode, setStockMode] = useState<"live" | "custom">("live");

  // LIVE INFO
  const [liveMsg, setLiveMsg] = useState("");
  const [liveSaving, setLiveSaving] = useState(false);
  const [liveActive, setLiveActive] = useState(false);

  // TESTIMONIALS
  const [testis, setTestis] = useState<any[]>([]);
  const [testiForm, setTestiForm] = useState<any>({ name: "", package: "gold", rating: 5, text: "", date: "" });
  const [editTestiId, setEditTestiId] = useState<string | null>(null);
  const [showTestiForm, setShowTestiForm] = useState(false);

  const pkgOpts = ["basic","silver","gold","pro","platinum","elite"];
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-blue-400" };

  const loadAll = () => {
    fetch("/api/admin/signals").then(r => r.json()).then(d => setSignals(d.signals || []));
    fetch("/api/admin/tokens").then(r => r.json()).then(d => setTokens(d.tokens || []));
    fetch("/api/testimonials").then(r => r.json()).then(d => setTestis(d.testimonials || []));
    fetch("/api/admin/liveinfo").then(r => r.json()).then(d => {
      if (d.liveInfo) { setLiveMsg(d.liveInfo.message || ""); setLiveActive(d.liveInfo.isActive || false); }
    }).catch(() => {});
    fetch("/api/admin/stocks").then(r => r.json()).then(d => {
      if (d.custom && d.custom.length > 0) { setCustomStocks(d.custom); setStockMode("custom"); }
      else fetch("/api/stocks").then(r => r.json()).then(d2 => setTopStocks(d2.stocks || []));
    }).catch(() => {
      fetch("/api/stocks").then(r => r.json()).then(d2 => setTopStocks(d2.stocks || []));
    });
  };

  useEffect(() => { loadAll(); }, []);

  // ===== SIGNALS =====
  const saveSig = async () => {
    if (!sigForm.kode || !sigForm.saham) return alert("Isi kode dan nama saham!");
    const method = editSigId ? "PUT" : "POST";
    const body = editSigId ? { ...sigForm, id: editSigId } : sigForm;
    await fetch("/api/admin/signals", { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSigId(null); setShowSigForm(false);
    loadAll();
  };
  const editSig = (s: any) => { setSigForm({...s}); setEditSigId(s.id); setShowSigForm(true); window.scrollTo(0,0); };
  const delSig = async (id: string) => { if (!confirm("Hapus sinyal ini?")) return; await fetch("/api/admin/signals?id="+id,{method:"DELETE"}); loadAll(); };

  // ===== TOKENS =====
  const saveTok = async () => {
    if (!tokForm.email || !tokForm.expiredAt) return alert("Isi email dan tanggal expired!");
    if (editTokId) {
      await fetch("/api/admin/tokens", { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...tokForm, id:editTokId}) });
    } else {
      await fetch("/api/admin/tokens", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(tokForm) });
    }
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    setEditTokId(null); setShowTokForm(false);
    loadAll();
  };
  const editTok = (t: any) => {
    setTokForm({ email:t.email, name:t.name, package:t.package, expiredAt:t.expiredAt?.slice(0,16) });
    setEditTokId(t.id); setShowTokForm(true); window.scrollTo(0,0);
  };
  const delTok = async (id: string) => { if (!confirm("Hapus token? User tidak bisa login lagi.")) return; await fetch("/api/admin/tokens?id="+id,{method:"DELETE"}); loadAll(); };
  const toggleTok = async (t: any) => { await fetch("/api/admin/tokens",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t.id,isActive:!t.isActive})}); loadAll(); };
  const extendTok = async (t: any) => {
    const days = prompt("Tambah berapa hari?"); if (!days) return;
    const newExp = new Date(t.expiredAt); newExp.setDate(newExp.getDate()+parseInt(days));
    await fetch("/api/admin/tokens",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t.id,expiredAt:newExp.toISOString()})}); loadAll();
  };

  // ===== TOP STOCKS =====
  const saveStock = async () => {
    if (!stockForm.kode) return alert("Isi kode saham!");
    const newStock = { ...stockForm, id: editStockId || Date.now().toString(), changePercent: parseFloat(stockForm.changePercent)||0, price: parseFloat(stockForm.price)||0 };
    let updated;
    if (editStockId) {
      updated = customStocks.map(s => s.id === editStockId ? newStock : s);
    } else {
      updated = [...customStocks, newStock];
    }
    setCustomStocks(updated); setStockMode("custom");
    await fetch("/api/admin/stocks",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:updated})}).catch(()=>{});
    setStockForm({ kode:"", name:"", price:"", change:"", changePercent:"" });
    setEditStockId(null); setShowStockForm(false);
  };
  const editStock = (s: any) => { setStockForm({...s}); setEditStockId(s.id); setShowStockForm(true); };
  const delStock = async (id: string) => {
    if (!confirm("Hapus saham ini?")) return;
    const updated = customStocks.filter(s => s.id !== id);
    setCustomStocks(updated);
    await fetch("/api/admin/stocks",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:updated})}).catch(()=>{});
  };
  const resetToLive = async () => {
    if (!confirm("Reset ke data live dari Yahoo Finance?")) return;
    setCustomStocks([]); setStockMode("live");
    await fetch("/api/admin/stocks",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:[]})}).catch(()=>{});
    fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocks(d.stocks||[]));
  };
  const refreshLive = () => fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocks(d.stocks||[]));
  const importLiveToCustom = () => {
    const imported = topStocks.map(s=>({...s, id:s.symbol||Date.now().toString(), kode:s.symbol?.replace(".JK","")||s.kode}));
    setCustomStocks(imported); setStockMode("custom");
    fetch("/api/admin/stocks",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:imported})}).catch(()=>{});
  };

  // ===== LIVE INFO =====
  const saveLive = async () => {
    setLiveSaving(true);
    await fetch("/api/admin/liveinfo",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:liveMsg,isActive:liveMsg.trim().length>0})});
    setLiveActive(liveMsg.trim().length>0); setLiveSaving(false);
  };
  const clearLive = async () => { setLiveMsg(""); setLiveActive(false); await fetch("/api/admin/liveinfo",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:"",isActive:false})}); };

  // ===== TESTIMONIALS =====
  const saveTesti = async () => {
    if (!testiForm.name || !testiForm.text) return alert("Isi nama dan testimoni!");
    const data = { ...testiForm, isApproved: true, date: testiForm.date || new Date().toLocaleDateString("id-ID",{month:"long",year:"numeric"}) };
    if (editTestiId) {
      await fetch("/api/testimonials",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,id:editTestiId})});
    } else {
      await fetch("/api/testimonials",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    }
    setTestiForm({ name:"", package:"gold", rating:5, text:"", date:"" });
    setEditTestiId(null); setShowTestiForm(false); loadAll();
  };
  const editTesti = (t: any) => { setTestiForm({...t}); setEditTestiId(t.id); setShowTestiForm(true); window.scrollTo(0,0); };
  const delTesti = async (id: string) => { if (!confirm("Hapus testimoni?")) return; await fetch("/api/testimonials?id="+id,{method:"DELETE"}); loadAll(); };
  const approveTesti = async (t: any) => { await fetch("/api/testimonials",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...t,isApproved:true})}); loadAll(); };

  const isExpired = (exp: string) => new Date(exp) < new Date();
  const isNearExpiry = (exp: string) => { const d=new Date(exp).getTime()-Date.now(); return d>0 && d<7*24*60*60*1000; };

  const tabs: [Tab, string][] = [["signals","⚡ Sinyal"],["tokens","🔑 Token"],["topstocks","📈 Top Saham"],["liveinfo","📢 Live Info"],["testimonials","⭐ Testimoni"]];

  const displayStocks = stockMode === "custom" ? customStocks : topStocks;

  return (
    <div className="min-h-screen bg-black">
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
          <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 px-3 py-1.5 rounded-lg transition-all">Logout</button>
        </div>
      </header>

      <div className="border-b border-white/5 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {tabs.map(([t,l]) => (
            <button key={t} onClick={()=>setTab(t)} className={`px-5 py-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${tab===t?"border-blue-500 text-blue-400":"border-transparent text-slate-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ========== SIGNALS ========== */}
        {tab === "signals" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">⚡ Manajemen Sinyal</h2>
                <p className="text-slate-500 text-xs mt-0.5">{signals.length} sinyal aktif</p>
              </div>
              <button onClick={()=>{setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditSigId(null);setShowSigForm(true);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                ➕ Tambah Sinyal
              </button>
            </div>

            {showSigForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editSigId ? "✏️ Edit Sinyal" : "➕ Tambah Sinyal Baru"}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Nama Saham" className="input-dark"/>
                    <input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value.toUpperCase()})} placeholder="Kode (BBCA)" className="input-dark"/>
                  </div>
                  <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="input-dark">
                    {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                  </select>
                  <input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="Entry (9750 - 9800)" className="input-dark"/>
                  <input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="Target Profit (10.200 | 10.500)" className="input-dark"/>
                  <input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="Stop Loss (9.500)" className="input-dark"/>
                  <textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Catatan / analisis..." rows={3} className="input-dark resize-none"/>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Paket yang bisa lihat sinyal ini:</p>
                    <div className="flex flex-wrap gap-3">
                      {["basic","silver","gold","pro","platinum","elite"].map(p=>(
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e=>{const cur=sigForm.package||[];setSigForm({...sigForm,package:e.target.checked?[...cur,p]:cur.filter((x:string)=>x!==p)});}} className="accent-blue-500"/>
                          <span className="text-slate-400 capitalize">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveSig} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editSigId?"Update Sinyal":"Simpan Sinyal"}</button>
                    <button onClick={()=>{setShowSigForm(false);setEditSigId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {signals.length === 0 ? (
                <div className="col-span-3 card rounded-2xl p-10 text-center text-slate-500 text-sm">Belum ada sinyal. Klik "Tambah Sinyal" untuk mulai.</div>
              ) : signals.map(s => (
                <div key={s.id} className="card rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-black text-white text-base">{s.kode}</span>
                      <span className="text-slate-500 text-xs ml-2">{s.saham}</span>
                    </div>
                    <span className={`text-xs font-black ${actionColor[s.action]}`}>{s.action}</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                    <div>Entry: <span className="text-white">{s.entry}</span></div>
                    <div>TP: <span className="text-green-400">{s.tp}</span> · SL: <span className="text-red-400">{s.sl}</span></div>
                    {s.notes && <div className="text-slate-400 mt-1 line-clamp-2">{s.notes}</div>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(s.package||[]).map((p:string)=><span key={p} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500 capitalize">{p}</span>)}
                  </div>
                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <Btn onClick={()=>editSig(s)} color="blue">✏️ Edit</Btn>
                    <Btn onClick={()=>delSig(s.id)} color="red">🗑️ Hapus</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== TOKENS ========== */}
        {tab === "tokens" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">🔑 Manajemen Token User</h2>
                <p className="text-slate-500 text-xs mt-0.5">{tokens.length} token · {tokens.filter(t=>!isExpired(t.expiredAt)&&t.isActive).length} aktif</p>
              </div>
              <button onClick={()=>{setTokForm({email:"",name:"",package:"gold",expiredAt:""});setEditTokId(null);setShowTokForm(true);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                ➕ Tambah Token
              </button>
            </div>

            {showTokForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editTokId ? "✏️ Edit Token" : "➕ Generate Token Baru"}</h3>
                <div className="space-y-3">
                  <input value={tokForm.name} onChange={e=>setTokForm({...tokForm,name:e.target.value})} placeholder="Nama user" className="input-dark"/>
                  <input value={tokForm.email} onChange={e=>setTokForm({...tokForm,email:e.target.value})} placeholder="Email user" className="input-dark"/>
                  <select value={tokForm.package} onChange={e=>setTokForm({...tokForm,package:e.target.value})} className="input-dark">
                    {["basic","silver","gold","pro","platinum","elite"].map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Tanggal expired</label>
                    <input type="datetime-local" value={tokForm.expiredAt} onChange={e=>setTokForm({...tokForm,expiredAt:e.target.value})} className="input-dark"/>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveTok} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTokId?"Update Token":"Generate Token"}</button>
                    <button onClick={()=>{setShowTokForm(false);setEditTokId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tokens.map(t => {
                const expired = isExpired(t.expiredAt);
                const near = isNearExpiry(t.expiredAt);
                return (
                  <div key={t.id} className={`card rounded-xl p-4 ${expired?"border-red-500/15":near?"border-yellow-500/15":""}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{t.name || "—"}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-blue-400 capitalize">{t.package}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${expired?"bg-red-400/10 text-red-400":t.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>
                          {expired?"EXPIRED":t.isActive?"AKTIF":"OFF"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-1">{t.email}</div>
                    <div className="font-mono text-xs text-slate-400 bg-white/5 rounded px-2 py-1.5 mb-2 break-all">{t.token}</div>
                    <div className={`text-xs mb-3 ${expired?"text-red-400":near?"text-yellow-400":"text-slate-600"}`}>
                      Expired: {new Date(t.expiredAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                      {expired&&" ⚠️ EXPIRED"}{near&&!expired&&" ⏰ Hampir expired"}
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                      <Btn onClick={()=>editTok(t)} color="blue">✏️ Edit</Btn>
                      <Btn onClick={()=>toggleTok(t)} color={t.isActive?"yellow":"green"}>{t.isActive?"⏸ Nonaktif":"▶ Aktifkan"}</Btn>
                      <Btn onClick={()=>extendTok(t)} color="purple">📅 Perpanjang</Btn>
                      <Btn onClick={()=>delTok(t.id)} color="red">🗑️ Hapus</Btn>
                    </div>
                  </div>
                );
              })}
              {tokens.length === 0 && (
                <div className="col-span-2 card rounded-2xl p-10 text-center text-slate-500 text-sm">Belum ada token. Klik "Tambah Token" untuk generate token user baru.</div>
              )}
            </div>
          </div>
        )}

        {/* ========== TOP STOCKS ========== */}
        {tab === "topstocks" && (
          <div>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div>
                <h2 className="text-white font-bold text-sm">📈 Manajemen Top Saham</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${stockMode==="custom"?"bg-yellow-400/10 text-yellow-400":"bg-green-400/10 text-green-400"}`}>
                    {stockMode==="custom"?"✏️ Mode Custom":"🔄 Mode Live"}
                  </span>
                  <span className="text-slate-500 text-xs">{displayStocks.length} saham</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn onClick={refreshLive} color="green">🔄 Refresh Live</Btn>
                {stockMode==="live" && <Btn onClick={importLiveToCustom} color="blue">📥 Import & Edit</Btn>}
                {stockMode==="custom" && <Btn onClick={resetToLive} color="yellow">↩ Reset ke Live</Btn>}
                <button onClick={()=>{setStockForm({kode:"",name:"",price:"",change:"",changePercent:""});setEditStockId(null);setShowStockForm(true);setStockMode("custom");}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  ➕ Tambah Saham
                </button>
              </div>
            </div>

            {showStockForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editStockId ? "✏️ Edit Saham" : "➕ Tambah Saham Custom"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={stockForm.kode} onChange={e=>setStockForm({...stockForm,kode:e.target.value.toUpperCase()})} placeholder="Kode (BBCA)" className="input-dark"/>
                  <input value={stockForm.name} onChange={e=>setStockForm({...stockForm,name:e.target.value})} placeholder="Nama Perusahaan" className="input-dark"/>
                  <input value={stockForm.price} onChange={e=>setStockForm({...stockForm,price:e.target.value})} placeholder="Harga (9875)" className="input-dark" type="number"/>
                  <input value={stockForm.changePercent} onChange={e=>setStockForm({...stockForm,changePercent:e.target.value})} placeholder="% Perubahan (1.28 atau -0.64)" className="input-dark" type="number" step="0.01"/>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveStock} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editStockId?"Update":"Tambah"}</button>
                  <button onClick={()=>{setShowStockForm(false);setEditStockId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayStocks.map((s: any, i: number) => {
                const pos = (s.changePercent ?? 0) >= 0;
                const kode = s.kode || s.symbol?.replace(".JK","") || s.symbol;
                return (
                  <div key={s.id || i} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-white">{kode}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos?"bg-green-400/10 text-green-400":"bg-red-400/10 text-red-400"}`}>
                        {pos?"+":""}{parseFloat(s.changePercent)?.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xl font-black text-white mb-0.5">{typeof s.price === "number" ? s.price.toLocaleString("id-ID") : s.price}</div>
                    <div className="text-xs text-slate-500 truncate mb-3">{s.name}</div>
                    {stockMode === "custom" && (
                      <div className="flex gap-2 border-t border-white/5 pt-3">
                        <Btn onClick={()=>editStock(s)} color="blue">✏️ Edit</Btn>
                        <Btn onClick={()=>delStock(s.id)} color="red">🗑️ Hapus</Btn>
                      </div>
                    )}
                    {stockMode === "live" && (
                      <div className="text-xs text-slate-600">Data live · <button onClick={importLiveToCustom} className="text-blue-400 hover:underline">Edit manual</button></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== LIVE INFO ========== */}
        {tab === "liveinfo" && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm">📢 Live Info untuk Halaman VIP</h2>
              <p className="text-slate-500 text-xs mt-0.5">Muncul sebagai kotak notifikasi di SEMUA halaman VIP. Kosongkan = tidak muncul.</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${liveActive?"bg-green-400/10 text-green-400 border-green-400/20":"bg-slate-400/10 text-slate-500 border-slate-500/20"}`}>
                {liveActive ? "🟢 LIVE — Sedang Ditampilkan" : "⚫ Tidak Aktif"}
              </span>
            </div>

            <div className="card rounded-2xl p-5 mb-4">
              <label className="text-xs text-slate-400 mb-2 block font-medium">Isi Pesan Info</label>
              <textarea
                value={liveMsg}
                onChange={e=>setLiveMsg(e.target.value)}
                placeholder="Contoh: 🚨 Market Update: IHSG konsolidasi di 7.300. Hold posisi, tunggu breakout 7.500. Update sinyal jam 14.00 WIB."
                rows={6}
                className="input-dark resize-none mb-4"
              />
              <div className="flex flex-wrap gap-2">
                <button onClick={saveLive} disabled={liveSaving} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">
                  {liveSaving ? "Menyimpan..." : "💾 Simpan & Tampilkan"}
                </button>
                {liveMsg && <Btn onClick={clearLive} color="red">🗑️ Hapus & Sembunyikan</Btn>}
              </div>
            </div>

            {liveMsg.trim() ? (
              <div>
                <p className="text-xs text-slate-500 mb-2">Preview tampilan di halaman VIP:</p>
                <div className="live-info-box">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl flex-shrink-0">📢</span>
                    <div>
                      <div className="text-yellow-400 text-xs font-black mb-1.5">INFO DARI ADMIN</div>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{liveMsg}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card rounded-xl p-8 text-center text-slate-600 text-sm">Kotak info tidak ditampilkan saat pesan kosong.</div>
            )}
          </div>
        )}

        {/* ========== TESTIMONIALS ========== */}
        {tab === "testimonials" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">⭐ Manajemen Testimoni</h2>
                <p className="text-slate-500 text-xs mt-0.5">{testis.length} total · {testis.filter(t=>t.isApproved).length} approved</p>
              </div>
              <button onClick={()=>{setTestiForm({name:"",package:"gold",rating:5,text:"",date:""});setEditTestiId(null);setShowTestiForm(true);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                ➕ Tambah Testimoni
              </button>
            </div>

            {showTestiForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editTestiId ? "✏️ Edit Testimoni" : "➕ Tambah Testimoni"}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={testiForm.name} onChange={e=>setTestiForm({...testiForm,name:e.target.value})} placeholder="Nama" className="input-dark"/>
                    <select value={testiForm.package} onChange={e=>setTestiForm({...testiForm,package:e.target.value})} className="input-dark">
                      {["basic","silver","gold","pro","platinum","elite"].map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={testiForm.rating} onChange={e=>setTestiForm({...testiForm,rating:parseInt(e.target.value)})} className="input-dark">
                      {[5,4,3,2,1].map(r=><option key={r} value={r} className="bg-black">{"⭐".repeat(r)} ({r})</option>)}
                    </select>
                    <input value={testiForm.date} onChange={e=>setTestiForm({...testiForm,date:e.target.value})} placeholder="Tanggal (Mei 2025)" className="input-dark"/>
                  </div>
                  <textarea value={testiForm.text} onChange={e=>setTestiForm({...testiForm,text:e.target.value})} placeholder="Isi testimoni..." rows={3} className="input-dark resize-none"/>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveTesti} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTestiId?"Update":"Tambah & Approve"}</button>
                    <button onClick={()=>{setShowTestiForm(false);setEditTestiId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testis.length === 0 ? (
                <div className="col-span-3 card rounded-2xl p-10 text-center text-slate-500 text-sm">Belum ada testimoni.</div>
              ) : testis.map(t => (
                <div key={t.id} className={`card rounded-xl p-4 ${!t.isApproved?"border-yellow-500/15":""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.isApproved?"bg-green-400/10 text-green-400":"bg-yellow-400/10 text-yellow-400"}`}>
                      {t.isApproved?"✓ Approved":"Pending"}
                    </span>
                  </div>
                  <div className="text-xs text-blue-400 capitalize mb-1">Paket {t.package}</div>
                  <div className="text-yellow-400 text-xs mb-2">{"★".repeat(t.rating||5)}</div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-1">"{t.text}"</p>
                  <div className="text-slate-600 text-xs mb-3">{t.date}</div>
                  <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                    <Btn onClick={()=>editTesti(t)} color="blue">✏️ Edit</Btn>
                    {!t.isApproved && <Btn onClick={()=>approveTesti(t)} color="green">✓ Approve</Btn>}
                    <Btn onClick={()=>delTesti(t.id)} color="red">🗑️ Hapus</Btn>
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

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuth(localStorage.getItem("admin_auth") === "1");
    setChecking(false);
  }, []);

  const logout = () => { localStorage.removeItem("admin_auth"); setAuth(false); };

  if (checking) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!auth) return <LoginScreen onLogin={()=>setAuth(true)}/>;
  return <AdminDashboard onLogout={logout}/>;
}
