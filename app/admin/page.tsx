"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "ritel2025";

// ===== PERSISTENT STORAGE (localStorage) =====
function useLocalStore<T>(key: string, initial: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rc_admin_" + key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);

  const set = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      try { localStorage.setItem("rc_admin_" + key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [state, set];
}

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

function Btn({ onClick, color, children, className = "" }: { onClick: () => void; color: string; children: React.ReactNode; className?: string }) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 hover:bg-green-500/25 border-green-500/20",
    red: "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 border-purple-500/20",
  };
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${colors[color]} ${className}`}>
      {children}
    </button>
  );
}

// ===== DASHBOARD =====
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");

  // All data stored in localStorage
  const [signals, setSignals] = useLocalStore<any[]>("signals", []);
  const [tokens, setTokens] = useLocalStore<any[]>("tokens", [
    { id:"demo1", email:"demo@ritelcommunity.id", name:"Demo User", package:"gold", token:"RC-GOLD-DEMO1234", expiredAt: new Date(Date.now()+30*24*60*60*1000).toISOString(), isActive:true, createdAt:new Date().toISOString() }
  ]);
  const [testimonials, setTestimonials] = useLocalStore<any[]>("testimonials", [
    { id:"t1", name:"Budi Santoso", package:"gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%.", date:"Mei 2025", isApproved:true },
    { id:"t2", name:"Sari Dewi", package:"platinum", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja.", date:"April 2025", isApproved:true },
    { id:"t3", name:"Rizky Pratama", package:"silver", rating:5, text:"Modul fundamental-nya komprehensif banget.", date:"Maret 2025", isApproved:true },
    { id:"t4", name:"Diana Putri", package:"elite", rating:5, text:"Worth every penny! Return gua konsisten tiap bulan.", date:"Februari 2025", isApproved:true },
  ]);
  const [liveMsg, setLiveMsgState] = useLocalStore<string>("liveinfo_msg", "");
  const [liveActive, setLiveActiveState] = useLocalStore<boolean>("liveinfo_active", false);
  const [customStocks, setCustomStocks] = useLocalStore<any[]>("custom_stocks", []);
  const [stockMode, setStockMode] = useLocalStore<"live"|"custom">("stock_mode", "live");

  // Form states
  const [sigForm, setSigForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
  const [editSigId, setEditSigId] = useState<string|null>(null);
  const [showSigForm, setShowSigForm] = useState(false);

  const [tokForm, setTokForm] = useState<any>({ email:"", name:"", package:"gold", expiredAt:"" });
  const [editTokId, setEditTokId] = useState<string|null>(null);
  const [showTokForm, setShowTokForm] = useState(false);

  const [stockForm, setStockForm] = useState<any>({ kode:"", name:"", price:"", changePercent:"" });
  const [editStockId, setEditStockId] = useState<string|null>(null);
  const [showStockForm, setShowStockForm] = useState(false);

  const [testiForm, setTestiForm] = useState<any>({ name:"", package:"gold", rating:5, text:"", date:"" });
  const [editTestiId, setEditTestiId] = useState<string|null>(null);
  const [showTestiForm, setShowTestiForm] = useState(false);

  const [liveInput, setLiveInput] = useState("");
  const [liveSaved, setLiveSaved] = useState(false);
  const [topStocksLive, setTopStocksLive] = useState<any[]>([]);

  useEffect(() => { setLiveInput(liveMsg); }, [liveMsg]);
  useEffect(() => {
    fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[])).catch(()=>{});
  }, []);

  // Sync signals/tokens/liveinfo to API so VIP page can read them
  const syncToAPI = async (type: string, data: any) => {
    try {
      await fetch("/api/admin/sync", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ type, data })
      });
    } catch {}
  };

  const pkgOpts = ["basic","silver","gold","pro","platinum","elite"];
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-blue-400" };

  // ===== SIGNALS =====
  const saveSig = () => {
    if (!sigForm.kode.trim() || !sigForm.saham.trim()) { alert("Isi kode dan nama saham!"); return; }
    let updated;
    if (editSigId) {
      updated = signals.map(s => s.id === editSigId ? { ...sigForm, id: editSigId } : s);
    } else {
      updated = [{ ...sigForm, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...signals];
    }
    setSignals(updated);
    syncToAPI("signals", updated);
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSigId(null); setShowSigForm(false);
  };
  const editSig = (s: any) => { setSigForm({...s}); setEditSigId(s.id); setShowSigForm(true); window.scrollTo(0,0); };
  const delSig = (id: string) => { if (!confirm("Hapus sinyal ini?")) return; const updated = signals.filter(s=>s.id!==id); setSignals(updated); syncToAPI("signals", updated); };

  // ===== TOKENS =====
  const genToken = (pkg: string) => "RC-" + pkg.toUpperCase() + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
  const saveTok = () => {
    if (!tokForm.email.trim() || !tokForm.expiredAt) { alert("Isi email dan tanggal expired!"); return; }
    let updated;
    if (editTokId) {
      updated = tokens.map(t => t.id === editTokId ? { ...t, ...tokForm } : t);
    } else {
      const newTok = { ...tokForm, id: Date.now().toString(), token: genToken(tokForm.package), isActive:true, createdAt:new Date().toISOString() };
      updated = [newTok, ...tokens];
    }
    setTokens(updated);
    syncToAPI("tokens", updated);
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    setEditTokId(null); setShowTokForm(false);
  };
  const editTok = (t: any) => { setTokForm({ email:t.email, name:t.name, package:t.package, expiredAt:t.expiredAt?.slice(0,16) }); setEditTokId(t.id); setShowTokForm(true); window.scrollTo(0,0); };
  const delTok = (id: string) => { if (!confirm("Hapus token? User tidak bisa login lagi.")) return; const updated = tokens.filter(t=>t.id!==id); setTokens(updated); syncToAPI("tokens", updated); };
  const toggleTok = (t: any) => { const updated = tokens.map(x=>x.id===t.id?{...x,isActive:!x.isActive}:x); setTokens(updated); syncToAPI("tokens", updated); };
  const extendTok = (t: any) => {
    const days = prompt("Tambah berapa hari?"); if (!days || isNaN(parseInt(days))) return;
    const newExp = new Date(t.expiredAt); newExp.setDate(newExp.getDate()+parseInt(days));
    const updated = tokens.map(x=>x.id===t.id?{...x,expiredAt:newExp.toISOString()}:x);
    setTokens(updated); syncToAPI("tokens", updated);
  };

  // ===== STOCKS =====
  const saveStock = () => {
    if (!stockForm.kode.trim()) { alert("Isi kode saham!"); return; }
    const newStock = { ...stockForm, id: editStockId || Date.now().toString(), changePercent: parseFloat(stockForm.changePercent)||0, price: parseFloat(stockForm.price)||0 };
    let updated;
    if (editStockId) { updated = customStocks.map(s=>s.id===editStockId?newStock:s); }
    else { updated = [...customStocks, newStock]; }
    setCustomStocks(updated); setStockMode("custom");
    setStockForm({ kode:"", name:"", price:"", changePercent:"" });
    setEditStockId(null); setShowStockForm(false);
  };
  const editStock = (s: any) => { setStockForm({kode:s.kode||s.symbol?.replace(".JK",""),name:s.name,price:String(s.price),changePercent:String(s.changePercent)}); setEditStockId(s.id||String(s)); setShowStockForm(true); };
  const delStock = (id: string) => { if (!confirm("Hapus saham ini?")) return; setCustomStocks(c=>c.filter(s=>s.id!==id)); };
  const importLive = () => { const imp = topStocksLive.map((s,i)=>({...s,id:s.symbol||String(i),kode:s.symbol?.replace(".JK","")||s.kode})); setCustomStocks(imp); setStockMode("custom"); };
  const resetLive = () => { if(!confirm("Reset ke data live?")) return; setCustomStocks([]); setStockMode("live"); };

  // ===== LIVE INFO =====
  const saveLive = async () => {
    const active = liveInput.trim().length > 0;
    setLiveMsgState(liveInput);
    setLiveActiveState(active);
    await syncToAPI("liveinfo", { message: liveInput, isActive: active });
    setLiveSaved(true);
    setTimeout(()=>setLiveSaved(false), 2000);
  };
  const clearLive = () => { setLiveInput(""); setLiveMsgState(""); setLiveActiveState(false); syncToAPI("liveinfo", { message:"", isActive:false }); };

  // ===== TESTIMONIALS =====
  const saveTesti = () => {
    if (!testiForm.name.trim() || !testiForm.text.trim()) { alert("Isi nama dan isi testimoni!"); return; }
    const data = { ...testiForm, isApproved:true, date: testiForm.date || new Date().toLocaleDateString("id-ID",{month:"long",year:"numeric"}) };
    let updated;
    if (editTestiId) { updated = testimonials.map(t=>t.id===editTestiId?{...data,id:editTestiId}:t); }
    else { updated = [{ ...data, id:"t"+Date.now() }, ...testimonials]; }
    setTestimonials(updated);
    setTestiForm({ name:"", package:"gold", rating:5, text:"", date:"" });
    setEditTestiId(null); setShowTestiForm(false);
  };
  const editTesti = (t: any) => { setTestiForm({...t}); setEditTestiId(t.id); setShowTestiForm(true); window.scrollTo(0,0); };
  const delTesti = (id: string) => { if(!confirm("Hapus testimoni?")) return; setTestimonials(t=>t.filter(x=>x.id!==id)); };
  const approveTesti = (t: any) => { setTestimonials(list=>list.map(x=>x.id===t.id?{...x,isApproved:true}:x)); };

  const isExpired = (exp: string) => new Date(exp) < new Date();
  const isNearExpiry = (exp: string) => { const d=new Date(exp).getTime()-Date.now(); return d>0 && d<7*24*60*60*1000; };
  const displayStocks = stockMode === "custom" ? customStocks : topStocksLive;

  const tabs: [Tab,string][] = [["signals","⚡ Sinyal"],["tokens","🔑 Token"],["topstocks","📈 Top Saham"],["liveinfo","📢 Live Info"],["testimonials","⭐ Testimoni"]];

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
          {tabs.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-5 py-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${tab===t?"border-blue-500 text-blue-400":"border-transparent text-slate-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ======== SIGNALS ======== */}
        {tab==="signals" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">⚡ Manajemen Sinyal</h2>
                <p className="text-slate-500 text-xs mt-0.5">{signals.length} sinyal tersimpan</p>
              </div>
              <button onClick={()=>{setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditSigId(null);setShowSigForm(!showSigForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                {showSigForm && !editSigId ? "✕ Tutup" : "➕ Tambah Sinyal"}
              </button>
            </div>

            {showSigForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editSigId?"✏️ Edit Sinyal":"➕ Tambah Sinyal Baru"}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                  </div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                    <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="input-dark">
                      {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="9.750 – 9.800" className="input-dark"/></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Target Profit</label><input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="10.200 | 10.500" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="9.500" className="input-dark"/></div>
                  </div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Catatan / Analisis</label><textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Breakout resistance, volume tinggi, sentimen positif..." rows={3} className="input-dark resize-none"/></div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Paket yang bisa akses sinyal ini:</p>
                    <div className="flex flex-wrap gap-3">
                      {pkgOpts.map(p=>(
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e=>{const cur=sigForm.package||[];setSigForm({...sigForm,package:e.target.checked?[...cur,p]:cur.filter((x:string)=>x!==p)});}} className="accent-blue-500 w-4 h-4"/>
                          <span className="text-xs text-slate-300 capitalize">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveSig} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editSigId?"✅ Update Sinyal":"✅ Simpan Sinyal"}</button>
                    <button onClick={()=>{setShowSigForm(false);setEditSigId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {signals.length===0 ? (
                <div className="col-span-3 card rounded-2xl p-12 text-center">
                  <p className="text-slate-400 text-sm mb-2">Belum ada sinyal</p>
                  <p className="text-slate-600 text-xs">Klik "Tambah Sinyal" untuk membuat sinyal pertama</p>
                </div>
              ) : signals.map(s=>(
                <div key={s.id} className="card rounded-xl p-4 hover:border-white/15 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-black text-white text-base">{s.kode}</span>
                      <div className="text-slate-500 text-xs mt-0.5">{s.saham}</div>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action]||"text-white"} bg-white/5`}>{s.action}</span>
                  </div>
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry||"—"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">TP</span><span className="text-green-400 font-medium">{s.tp||"—"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">SL</span><span className="text-red-400 font-medium">{s.sl||"—"}</span></div>
                  </div>
                  {s.notes && <p className="text-xs text-slate-500 border-t border-white/5 pt-2 mb-3 line-clamp-2">{s.notes}</p>}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(s.package||[]).map((p:string)=><span key={p} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500 capitalize">{p}</span>)}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Btn onClick={()=>editSig(s)} color="blue" className="flex-1 text-center">✏️ Edit</Btn>
                    <Btn onClick={()=>delSig(s.id)} color="red" className="flex-1 text-center">🗑️ Hapus</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== TOKENS ======== */}
        {tab==="tokens" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">🔑 Manajemen Token VIP</h2>
                <p className="text-slate-500 text-xs mt-0.5">{tokens.length} token · {tokens.filter(t=>t.isActive&&!isExpired(t.expiredAt)).length} aktif</p>
              </div>
              <button onClick={()=>{setTokForm({email:"",name:"",package:"gold",expiredAt:""});setEditTokId(null);setShowTokForm(!showTokForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                {showTokForm && !editTokId?"✕ Tutup":"➕ Tambah Token"}
              </button>
            </div>

            {showTokForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editTokId?"✏️ Edit Token":"➕ Generate Token Baru"}</h3>
                <div className="space-y-3">
                  <div><label className="text-xs text-slate-500 mb-1 block">Nama User</label><input value={tokForm.name} onChange={e=>setTokForm({...tokForm,name:e.target.value})} placeholder="Nama lengkap" className="input-dark"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Email</label><input value={tokForm.email} onChange={e=>setTokForm({...tokForm,email:e.target.value})} placeholder="user@email.com" className="input-dark" type="email"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                    <select value={tokForm.package} onChange={e=>setTokForm({...tokForm,package:e.target.value})} className="input-dark">
                      {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Expired Tanggal</label><input type="datetime-local" value={tokForm.expiredAt} onChange={e=>setTokForm({...tokForm,expiredAt:e.target.value})} className="input-dark"/></div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveTok} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTokId?"✅ Update Token":"✅ Generate Token"}</button>
                    <button onClick={()=>{setShowTokForm(false);setEditTokId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tokens.length===0 ? (
                <div className="col-span-2 card rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">Belum ada token. Klik "Tambah Token" untuk generate.</p></div>
              ) : tokens.map(t=>{
                const expired=isExpired(t.expiredAt); const near=isNearExpiry(t.expiredAt);
                return (
                  <div key={t.id} className={`card rounded-xl p-4 transition-all ${expired?"border-red-500/20":near?"border-yellow-500/15":""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white">{t.name||"—"}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${expired?"bg-red-400/10 text-red-400":t.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>
                          {expired?"EXPIRED":t.isActive?"AKTIF":"NONAKTIF"}
                        </span>
                      </div>
                      <span className="text-xs text-blue-400 font-bold capitalize">{t.package}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-1.5">{t.email}</div>
                    <div className="font-mono text-xs bg-white/5 rounded-lg px-3 py-2 text-slate-300 mb-2 break-all select-all">{t.token}</div>
                    <div className={`text-xs mb-3 ${expired?"text-red-400":near?"text-yellow-400":"text-slate-600"}`}>
                      Expired: {new Date(t.expiredAt).toLocaleString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                      {expired&&" ⚠️"}{near&&!expired&&" ⏰"}
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                      <Btn onClick={()=>editTok(t)} color="blue">✏️ Edit</Btn>
                      <Btn onClick={()=>toggleTok(t)} color={t.isActive?"yellow":"green"}>{t.isActive?"⏸ Off":"▶ On"}</Btn>
                      <Btn onClick={()=>extendTok(t)} color="purple">📅 +Hari</Btn>
                      <Btn onClick={()=>delTok(t.id)} color="red">🗑️ Hapus</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======== TOP STOCKS ======== */}
        {tab==="topstocks" && (
          <div>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div>
                <h2 className="text-white font-bold text-sm">📈 Manajemen Top Saham</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${stockMode==="custom"?"bg-yellow-400/10 text-yellow-400":"bg-green-400/10 text-green-400"}`}>
                  {stockMode==="custom"?"✏️ Mode Custom":"🔄 Mode Live"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn onClick={()=>fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[]))} color="green">🔄 Refresh Live</Btn>
                {stockMode==="live" && <Btn onClick={importLive} color="blue">📥 Import & Edit</Btn>}
                {stockMode==="custom" && <Btn onClick={resetLive} color="yellow">↩ Reset Live</Btn>}
                <button onClick={()=>{setStockForm({kode:"",name:"",price:"",changePercent:""});setEditStockId(null);setShowStockForm(!showStockForm);setStockMode("custom");}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showStockForm&&!editStockId?"✕ Tutup":"➕ Tambah Saham"}
                </button>
              </div>
            </div>

            {showStockForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editStockId?"✏️ Edit Saham":"➕ Tambah Saham Custom"}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={stockForm.kode} onChange={e=>setStockForm({...stockForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Nama Perusahaan</label><input value={stockForm.name} onChange={e=>setStockForm({...stockForm,name:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Harga (Rp)</label><input value={stockForm.price} onChange={e=>setStockForm({...stockForm,price:e.target.value})} placeholder="9875" className="input-dark" type="number"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">% Perubahan</label><input value={stockForm.changePercent} onChange={e=>setStockForm({...stockForm,changePercent:e.target.value})} placeholder="1.28 atau -0.64" className="input-dark" type="number" step="0.01"/></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveStock} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editStockId?"✅ Update":"✅ Tambah"}</button>
                  <button onClick={()=>{setShowStockForm(false);setEditStockId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayStocks.map((s:any,i:number)=>{
                const pos=(s.changePercent??0)>=0;
                const kode=s.kode||s.symbol?.replace(".JK","")||s.symbol||"—";
                return (
                  <div key={s.id||i} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-white">{kode}</span>
                      <span className={`text-xs font-bold ${pos?"text-green-400":"text-red-400"}`}>{pos?"+":""}{parseFloat(s.changePercent||0).toFixed(2)}%</span>
                    </div>
                    <div className="text-lg font-black text-white mb-0.5">{typeof s.price==="number"?s.price.toLocaleString("id-ID"):s.price}</div>
                    <div className="text-xs text-slate-500 truncate mb-3">{s.name||"—"}</div>
                    {stockMode==="custom" && (
                      <div className="flex gap-1.5 border-t border-white/5 pt-2">
                        <Btn onClick={()=>editStock(s)} color="blue" className="flex-1 text-center">✏️</Btn>
                        <Btn onClick={()=>delStock(s.id)} color="red" className="flex-1 text-center">🗑️</Btn>
                      </div>
                    )}
                  </div>
                );
              })}
              {displayStocks.length===0 && <div className="col-span-4 card rounded-2xl p-10 text-center text-slate-500 text-sm">Klik "Refresh Live" untuk load data saham.</div>}
            </div>
          </div>
        )}

        {/* ======== LIVE INFO ======== */}
        {tab==="liveinfo" && (
          <div className="max-w-2xl">
            <div className="mb-5">
              <h2 className="text-white font-bold text-sm">📢 Live Info Member VIP</h2>
              <p className="text-slate-500 text-xs mt-0.5">Muncul di semua halaman VIP. Kosong = tidak muncul.</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${liveActive?"bg-green-400/10 text-green-400 border-green-400/20":"bg-slate-400/10 text-slate-500 border-slate-500/20"}`}>
                {liveActive?"🟢 AKTIF — Sedang Ditampilkan":"⚫ Tidak Aktif"}
              </span>
            </div>
            <div className="card rounded-2xl p-5 mb-4">
              <label className="text-xs text-slate-400 mb-2 block font-medium">Isi Pesan Info</label>
              <textarea value={liveInput} onChange={e=>setLiveInput(e.target.value)} placeholder="Contoh: 🚨 Market Update — IHSG breakout 7.400, siapkan posisi di saham perbankan. Update sinyal jam 14.00 WIB." rows={6} className="input-dark resize-none mb-4"/>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveLive} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${liveSaved?"bg-green-600 text-white":"btn-primary"}`}>
                  {liveSaved?"✅ Tersimpan!":"💾 Simpan & Tampilkan"}
                </button>
                {liveInput && <Btn onClick={clearLive} color="red">🗑️ Hapus</Btn>}
              </div>
            </div>
            {liveInput.trim() ? (
              <div>
                <p className="text-xs text-slate-500 mb-2">Preview:</p>
                <div className="live-info-box">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl flex-shrink-0">📢</span>
                    <div>
                      <div className="text-yellow-400 text-xs font-black mb-1.5">INFO DARI ADMIN</div>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{liveInput}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card rounded-xl p-8 text-center text-slate-600 text-sm">Kotak info tidak ditampilkan saat pesan kosong.</div>
            )}
          </div>
        )}

        {/* ======== TESTIMONIALS ======== */}
        {tab==="testimonials" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white font-bold text-sm">⭐ Manajemen Testimoni</h2>
                <p className="text-slate-500 text-xs mt-0.5">{testimonials.length} total · {testimonials.filter(t=>t.isApproved).length} approved</p>
              </div>
              <button onClick={()=>{setTestiForm({name:"",package:"gold",rating:5,text:"",date:""});setEditTestiId(null);setShowTestiForm(!showTestiForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                {showTestiForm&&!editTestiId?"✕ Tutup":"➕ Tambah Testimoni"}
              </button>
            </div>

            {showTestiForm && (
              <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                <h3 className="text-white font-bold mb-4 text-sm">{editTestiId?"✏️ Edit Testimoni":"➕ Tambah Testimoni"}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={testiForm.name} onChange={e=>setTestiForm({...testiForm,name:e.target.value})} placeholder="Nama member" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                      <select value={testiForm.package} onChange={e=>setTestiForm({...testiForm,package:e.target.value})} className="input-dark">
                        {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Rating</label>
                      <select value={testiForm.rating} onChange={e=>setTestiForm({...testiForm,rating:parseInt(e.target.value)})} className="input-dark">
                        {[5,4,3,2,1].map(r=><option key={r} value={r} className="bg-black">{"⭐".repeat(r)} ({r} bintang)</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input value={testiForm.date} onChange={e=>setTestiForm({...testiForm,date:e.target.value})} placeholder="Mei 2025" className="input-dark"/></div>
                  </div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Isi Testimoni</label><textarea value={testiForm.text} onChange={e=>setTestiForm({...testiForm,text:e.target.value})} placeholder="Tulis testimoni member..." rows={3} className="input-dark resize-none"/></div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveTesti} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTestiId?"✅ Update":"✅ Simpan & Approve"}</button>
                    <button onClick={()=>{setShowTestiForm(false);setEditTestiId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.length===0 ? (
                <div className="col-span-3 card rounded-2xl p-12 text-center text-slate-500 text-sm">Belum ada testimoni.</div>
              ) : testimonials.map(t=>(
                <div key={t.id} className={`card rounded-xl p-4 ${!t.isApproved?"border-yellow-500/15":""}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.isApproved?"bg-green-400/10 text-green-400":"bg-yellow-400/10 text-yellow-400"}`}>{t.isApproved?"✓":"Pending"}</span>
                  </div>
                  <div className="text-xs text-blue-400 capitalize mb-1">Paket {t.package}</div>
                  <div className="text-yellow-400 text-xs mb-2">{"★".repeat(t.rating||5)}</div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-1 line-clamp-3">"{t.text}"</p>
                  <div className="text-slate-600 text-xs mb-3">{t.date}</div>
                  <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                    <Btn onClick={()=>editTesti(t)} color="blue" className="flex-1 text-center">✏️ Edit</Btn>
                    {!t.isApproved && <Btn onClick={()=>approveTesti(t)} color="green">✓</Btn>}
                    <Btn onClick={()=>delTesti(t.id)} color="red" className="flex-1 text-center">🗑️ Hapus</Btn>
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
  useEffect(() => { setAuth(localStorage.getItem("admin_auth")==="1"); setChecking(false); }, []);
  const logout = () => { localStorage.removeItem("admin_auth"); setAuth(false); };
  if (checking) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!auth) return <LoginScreen onLogin={()=>setAuth(true)}/>;
  return <AdminDashboard onLogout={logout}/>;
}
