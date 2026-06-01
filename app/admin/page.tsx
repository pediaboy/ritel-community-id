"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "ritel2025";

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
      } else { setErr("Username atau password salah."); }
      setLoading(false);
    }, 400);
  };
  return (
    <div className="min-h-screen bg-[#04060f] flex items-center justify-center px-4">
      <div className="galaxy-stars" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="card-glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl mb-4">RC</div>
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
          <Link href="/" className="block text-center text-xs text-slate-600 hover:text-cyan-400 mt-5 transition-colors">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = "signals" | "tokens" | "topstocks" | "liveinfo" | "testimonials" | "pricing" | "ticker";

function Btn({ onClick, color, children, className = "" }: { onClick: () => void; color: string; children: React.ReactNode; className?: string }) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 hover:bg-green-500/25 border-green-500/20",
    red: "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/25 border-cyan-500/20",
  };
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${colors[color] || colors.blue} ${className}`}>
      {children}
    </button>
  );
}

function isExpired(dt: string) { return dt ? new Date(dt) < new Date() : false; }
function isNearExpiry(dt: string) { if (!dt) return false; const d = new Date(dt); const now = new Date(); return d > now && d.getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000; }

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");

  const [signals, setSignals] = useLocalStore<any[]>("signals", []);
  const [tokens, setTokens] = useLocalStore<any[]>("tokens", [
    { id:"demo1", email:"demo@ritelcommunity.id", name:"Demo User", package:"gold", token:"RC-GOLD-DEMO1234", expiredAt: new Date(Date.now()+30*24*60*60*1000).toISOString(), isActive:true, createdAt:new Date().toISOString() }
  ]);
  const [testimonials, setTestimonials] = useLocalStore<any[]>("testimonials", [
    { id:"t1", name:"Budi Santoso", package:"gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%.", date:"Mei 2025", isApproved:true },
    { id:"t2", name:"Sari Dewi", package:"platinum", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja.", date:"April 2025", isApproved:true },
    { id:"t3", name:"Rizky Pratama", package:"silver", rating:5, text:"Modul fundamental-nya komprehensif banget.", date:"Maret 2025", isApproved:true },
    { id:"t4", name:"Diana Putri", package:"elite", rating:5, text:"Worth every penny! Return gua konsisten tiap bulan.", date:"Februari 2025", isApproved:true },
    { id:"t5", name:"Ahmad Fauzi", package:"pro", rating:5, text:"AI Agent Pro bantu watchlist dan ingatkan sinyal. Mantap!", date:"Januari 2025", isApproved:true },
    { id:"t6", name:"Mira Susanti", package:"gold", rating:5, text:"Tadinya nyoba Basic dulu, langsung upgrade ke Gold setelah lihat kualitasnya!", date:"Des 2024", isApproved:true },
    { id:"t7", name:"Hendra Gunawan", package:"platinum", rating:5, text:"Konsultasi 1-on-1 bantu porto gua naik 60% dalam 3 bulan.", date:"Nov 2024", isApproved:true },
    { id:"t8", name:"Lia Rahayu", package:"silver", rating:5, text:"Buat pemula kayak gue modul-modulnya gampang dipahami.", date:"Okt 2024", isApproved:true },
    { id:"t9", name:"Doni Wibowo", package:"elite", rating:5, text:"Fitur elite paling lengkap. Laporan harian bikin keputusan lebih tepat.", date:"Sep 2024", isApproved:true },
    { id:"t10", name:"Nani Kurniawati", package:"pro", rating:5, text:"Grup WA-nya aktif banget, diskusi sama member nambah banyak insight.", date:"Agu 2024", isApproved:true },
  ]);
  const [liveMsg, setLiveMsgState] = useLocalStore<string>("liveinfo_msg", "");
  const [liveActive, setLiveActiveState] = useLocalStore<boolean>("liveinfo_active", false);
  const [customStocks, setCustomStocks] = useLocalStore<any[]>("custom_stocks", []);
  const [stockMode, setStockMode] = useLocalStore<"live"|"custom">("stock_mode", "live");

  // PRICING DATA
  const defaultPricing = [
    { id:"basic", name:"Basic", price:100000, priceLabel:"Rp 100.000", period:"/bulan", color:"blue", description:"Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.", features:["Sinyal saham harian","Berita pasar realtime","Chart IHSG live","Modul dasar investasi","Grup WA Basic"], flashSale:null },
    { id:"silver", name:"Silver", price:250000, priceLabel:"Rp 250.000", period:"/bulan", color:"cyan", description:"Untuk investor yang ingin memahami fundamental dan mulai screening saham potensial.", features:["Semua fitur Basic","Analisis fundamental saham","Screening saham bagger","Risk & money management","Grup WA Silver"], flashSale:null },
    { id:"gold", name:"Gold", price:500000, priceLabel:"Rp 500.000", period:"/bulan", color:"gold", popular:true, description:"Paket terlaris! Lengkap dengan sinyal premium dan panduan psikologi trading.", features:["Semua fitur Silver","Sinyal entry, antri, TP, SL premium","Analisis teknikal mendalam","Modul psikologi & emosi trading","Potensi saham multi-bagger","Grup WA Gold Eksklusif"], flashSale:null },
    { id:"pro", name:"Pro", price:750000, priceLabel:"Rp 750.000", period:"/bulan", color:"purple", description:"Dilengkapi AI Agent personal untuk bantu analisis dan keputusan trading.", features:["Semua fitur Gold","AI Agent trading assistant","Watchlist saham personal","Laporan mingguan eksklusif","Priority support","Grup WA Pro VIP"], hasAI:true, flashSale:null },
    { id:"platinum", name:"Platinum", price:900000, priceLabel:"Rp 900.000", period:"/bulan", color:"platinum", description:"Pengalaman investasi terdepan dengan AI Agent canggih dan konsultasi personal.", features:["Semua fitur Pro","AI Agent + analisis portofolio","Konsultasi 1-on-1 dengan analis","Akses semua modul VIP","Sinyal real-time 24/7","Grup WA Platinum Elite"], hasAI:true, flashSale:null },
    { id:"elite", name:"Elite", price:1000000, priceLabel:"Rp 1.000.000", period:"/bulan", color:"elite", isElite:true, description:"Paket paling eksklusif. Mentoring langsung, AI Agent Elite, dan akses penuh semua fitur.", features:["Semua fitur Platinum","AI Agent Elite terdepan","Portofolio management personal","Akses mentor langsung","Event & webinar eksklusif","Grup WA Elite Master","Laporan harian personal"], hasAI:true, flashSale:null },
  ];
  const [pricing, setPricing] = useLocalStore<any[]>("pricing", defaultPricing);

  // TICKER DATA
  const defaultTicker = [
    { id:"t1", kode:"IHSG", price:"7.333", change:"+0.66%" },
    { id:"t2", kode:"BBCA", price:"9.875", change:"+1.28%" },
    { id:"t3", kode:"BBRI", price:"4.680", change:"-0.64%" },
    { id:"t4", kode:"TLKM", price:"3.290", change:"+1.54%" },
    { id:"t5", kode:"ASII", price:"5.200", change:"-1.42%" },
    { id:"t6", kode:"GOTO", price:"86", change:"+4.88%" },
  ];
  const [tickerStocks, setTickerStocks] = useLocalStore<any[]>("ticker_stocks", defaultTicker);

  // PREMIUM SIGNALS (halaman sinyal premium)
  const defaultPremiumSignals = [
    { id:"ps1", title:"Bandarmologi Report", content:"Analisis bandarmologi mingguan. Deteksi akumulasi & distribusi big player.", isActive:true },
    { id:"ps2", title:"Tape Reading Live", content:"Laporan tape reading intraday. Baca pergerakan smart money secara real-time.", isActive:true },
    { id:"ps3", title:"Bagger Pick Bulanan", content:"1-3 saham bagger pilihan analis setiap bulan. Potensi naik 2x-10x.", isActive:true },
  ];
  const [premiumSignals, setPremiumSignals] = useLocalStore<any[]>("premium_signals", defaultPremiumSignals);

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

  const [testiForm, setTestiForm] = useState<any>({ name:"", package:"gold", rating:5, text:"", date:"", isApproved:true });
  const [editTestiId, setEditTestiId] = useState<string|null>(null);
  const [showTestiForm, setShowTestiForm] = useState(false);

  const [pricingForm, setPricingForm] = useState<any>({ id:"", name:"", priceLabel:"", period:"/bulan", description:"", features:"", flashSale:{ discount:"", price:"" }, hasFlashSale:false });
  const [editPricingId, setEditPricingId] = useState<string|null>(null);
  const [showPricingForm, setShowPricingForm] = useState(false);

  const [tickerForm, setTickerForm] = useState<any>({ kode:"", price:"", change:"" });
  const [editTickerId, setEditTickerId] = useState<string|null>(null);
  const [showTickerForm, setShowTickerForm] = useState(false);

  const [premSigForm, setPremSigForm] = useState<any>({ title:"", content:"", isActive:true });
  const [editPremSigId, setEditPremSigId] = useState<string|null>(null);
  const [showPremSigForm, setShowPremSigForm] = useState(false);

  const [liveInput, setLiveInput] = useState("");
  const [liveSaved, setLiveSaved] = useState(false);
  const [topStocksLive, setTopStocksLive] = useState<any[]>([]);

  useEffect(() => { setLiveInput(liveMsg); }, [liveMsg]);
  useEffect(() => {
    fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[])).catch(()=>{});
  }, []);

  const syncToAPI = async (type: string, data: any) => {
    try {
      await fetch("/api/admin/sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type, data }) });
    } catch {}
  };

  const pkgOpts = ["basic","silver","gold","pro","platinum","elite"];
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-cyan-400" };

  // ===== SIGNALS =====
  const saveSig = () => {
    if (!sigForm.kode.trim() || !sigForm.saham.trim()) { alert("Isi kode dan nama saham!"); return; }
    let updated;
    if (editSigId) {
      updated = signals.map(s => s.id === editSigId ? { ...sigForm, id: editSigId } : s);
    } else {
      updated = [{ ...sigForm, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...signals];
    }
    setSignals(updated); syncToAPI("signals", updated);
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSigId(null); setShowSigForm(false);
  };
  const editSig = (s: any) => { setSigForm({...s}); setEditSigId(s.id); setShowSigForm(true); window.scrollTo(0,0); };
  const delSig = (id: string) => { if (!confirm("Hapus sinyal?")) return; const updated = signals.filter(s=>s.id!==id); setSignals(updated); syncToAPI("signals", updated); };

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
    setTokens(updated); syncToAPI("tokens", updated);
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    setEditTokId(null); setShowTokForm(false);
  };
  const editTok = (t: any) => { setTokForm({ email:t.email, name:t.name, package:t.package, expiredAt:t.expiredAt?.slice(0,16) }); setEditTokId(t.id); setShowTokForm(true); window.scrollTo(0,0); };
  const delTok = (id: string) => { if (!confirm("Hapus token?")) return; const updated = tokens.filter(t=>t.id!==id); setTokens(updated); syncToAPI("tokens", updated); };
  const toggleTok = (t: any) => { const updated = tokens.map(x=>x.id===t.id?{...x,isActive:!x.isActive}:x); setTokens(updated); syncToAPI("tokens", updated); };
  const extendTok = (t: any) => {
    const days = prompt("Tambah berapa hari?"); if (!days || isNaN(parseInt(days))) return;
    const newExp = new Date(t.expiredAt); newExp.setDate(newExp.getDate()+parseInt(days));
    const updated = tokens.map(x=>x.id===t.id?{...x,expiredAt:newExp.toISOString()}:x);
    setTokens(updated); syncToAPI("tokens", updated);
  };

  // ===== TOP STOCKS =====
  const importLive = () => {
    const imported = topStocksLive.map(s => ({
      id: s.symbol || Date.now().toString(), kode: s.symbol?.replace(".JK",""), name: s.name,
      price: s.price?.toString(), changePercent: s.changePercent?.toFixed(2)
    }));
    setCustomStocks(imported); setStockMode("custom");
  };
  const resetLive = () => { setCustomStocks([]); setStockMode("live"); };
  const saveStock = () => {
    if (!stockForm.kode.trim()) { alert("Isi kode saham!"); return; }
    let updated;
    if (editStockId) {
      updated = customStocks.map(s => s.id === editStockId ? { ...stockForm, id: editStockId } : s);
    } else {
      updated = [...customStocks, { ...stockForm, id: Date.now().toString() }];
    }
    setCustomStocks(updated); setStockMode("custom");
    syncToAPI("stocks", updated);
    setStockForm({ kode:"", name:"", price:"", changePercent:"" });
    setEditStockId(null); setShowStockForm(false);
  };
  const editStock = (s: any) => { setStockForm({...s}); setEditStockId(s.id); setShowStockForm(true); };
  const delStock = (id: string) => { if (!confirm("Hapus saham?")) return; const updated = customStocks.filter(s=>s.id!==id); setCustomStocks(updated); syncToAPI("stocks", updated); };

  // ===== TESTIMONIALS =====
  const saveTesti = () => {
    if (!testiForm.name.trim() || !testiForm.text.trim()) { alert("Isi nama dan testimoni!"); return; }
    let updated;
    if (editTestiId) {
      updated = testimonials.map(t => t.id === editTestiId ? { ...testiForm, id: editTestiId } : t);
    } else {
      updated = [{ ...testiForm, id: Date.now().toString() }, ...testimonials];
    }
    setTestimonials(updated);
    setTestiForm({ name:"", package:"gold", rating:5, text:"", date:"", isApproved:true });
    setEditTestiId(null); setShowTestiForm(false);
  };
  const editTesti = (t: any) => { setTestiForm({...t}); setEditTestiId(t.id); setShowTestiForm(true); window.scrollTo(0,0); };
  const delTesti = (id: string) => { if (!confirm("Hapus testimoni?")) return; setTestimonials(testimonials.filter(t=>t.id!==id)); };
  const toggleTesti = (t: any) => { setTestimonials(testimonials.map(x=>x.id===t.id?{...x,isApproved:!x.isApproved}:x)); };

  // ===== PRICING =====
  const openPricingEdit = (p: any) => {
    setPricingForm({
      id: p.id, name: p.name, priceLabel: p.priceLabel, period: p.period,
      description: p.description, features: (p.features||[]).join("\n"),
      flashSale: p.flashSale || { discount:"", price:"" },
      hasFlashSale: !!p.flashSale,
    });
    setEditPricingId(p.id); setShowPricingForm(true); window.scrollTo(0,0);
  };
  const savePricing = () => {
    if (!pricingForm.priceLabel.trim()) { alert("Isi harga!"); return; }
    const features = pricingForm.features.split("\n").map((f:string)=>f.trim()).filter(Boolean);
    const flashSale = pricingForm.hasFlashSale && pricingForm.flashSale.price ? pricingForm.flashSale : null;
    const updated = pricing.map(p => p.id === editPricingId ? { ...p, priceLabel: pricingForm.priceLabel, period: pricingForm.period, description: pricingForm.description, features, flashSale } : p);
    setPricing(updated);
    setEditPricingId(null); setShowPricingForm(false);
  };

  // ===== TICKER =====
  const saveTicker = () => {
    if (!tickerForm.kode.trim()) { alert("Isi kode saham!"); return; }
    let updated;
    if (editTickerId) {
      updated = tickerStocks.map(t => t.id === editTickerId ? { ...tickerForm, id: editTickerId } : t);
    } else {
      updated = [...tickerStocks, { ...tickerForm, id: Date.now().toString() }];
    }
    setTickerStocks(updated);
    setTickerForm({ kode:"", price:"", change:"" });
    setEditTickerId(null); setShowTickerForm(false);
  };
  const editTicker = (t: any) => { setTickerForm({...t}); setEditTickerId(t.id); setShowTickerForm(true); };
  const delTicker = (id: string) => { if (!confirm("Hapus dari ticker?")) return; setTickerStocks(tickerStocks.filter(t=>t.id!==id)); };

  // ===== PREMIUM SIGNALS PAGE =====
  const savePremSig = () => {
    if (!premSigForm.title.trim()) { alert("Isi judul!"); return; }
    let updated;
    if (editPremSigId) {
      updated = premiumSignals.map(s => s.id === editPremSigId ? { ...premSigForm, id: editPremSigId } : s);
    } else {
      updated = [{ ...premSigForm, id: Date.now().toString() }, ...premiumSignals];
    }
    setPremiumSignals(updated);
    setPremSigForm({ title:"", content:"", isActive:true });
    setEditPremSigId(null); setShowPremSigForm(false);
  };
  const editPremSig = (s: any) => { setPremSigForm({...s}); setEditPremSigId(s.id); setShowPremSigForm(true); window.scrollTo(0,0); };
  const delPremSig = (id: string) => { if (!confirm("Hapus?")) return; setPremiumSignals(premiumSignals.filter(s=>s.id!==id)); };

  const tabs: { id: Tab; label: string }[] = [
    { id:"signals", label:"Sinyal" },
    { id:"tokens", label:"Token VIP" },
    { id:"topstocks", label:"Top Saham" },
    { id:"liveinfo", label:"Live Info" },
    { id:"testimonials", label:"Testimoni" },
    { id:"pricing", label:"Harga/Paket" },
    { id:"ticker", label:"Ticker" },
  ];

  return (
    <div className="min-h-screen bg-[#04060f] text-white">
      <div className="galaxy-stars" />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
              <span className="font-black text-white text-sm">Admin Panel</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-all">Lihat Web</Link>
              <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all">Keluar</button>
            </div>
          </div>
          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-1 pb-0">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`text-xs px-3 py-2.5 font-medium whitespace-nowrap border-b-2 transition-all ${tab===t.id ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* ======== SIGNALS ======== */}
          {tab==="signals" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Sinyal Harian</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{signals.length} sinyal aktif</p>
                </div>
                <button onClick={()=>{setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditSigId(null);setShowSigForm(!showSigForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showSigForm&&!editSigId?"Tutup":"Tambah Sinyal"}
                </button>
              </div>
              {showSigForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editSigId?"Edit Sinyal":"Tambah Sinyal Baru"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="input-dark">
                        {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="9.750–9.800" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Target (TP)</label><input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="10.200 | 10.500" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="9.500" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Catatan/Analisis</label><textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Breakout resistance, volume tinggi..." rows={2} className="input-dark resize-none"/></div>
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-2 block">Akses Paket</label>
                    <div className="flex flex-wrap gap-3">
                      {pkgOpts.map(p=>(
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e=>{const cur=sigForm.package||[];setSigForm({...sigForm,package:e.target.checked?[...cur,p]:cur.filter((x:string)=>x!==p)});}} className="accent-cyan-500 w-4 h-4"/>
                          <span className="text-xs text-slate-300 capitalize">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveSig} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editSigId?"Update Sinyal":"Simpan Sinyal"}</button>
                    <button onClick={()=>{setShowSigForm(false);setEditSigId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {signals.length===0 ? (
                  <div className="col-span-3 card rounded-2xl p-12 text-center">
                    <p className="text-slate-400 text-sm">Belum ada sinyal. Klik "Tambah Sinyal" untuk membuat sinyal.</p>
                  </div>
                ) : signals.map(s=>(
                  <div key={s.id} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div><span className="font-black text-white text-base">{s.kode}</span><div className="text-slate-500 text-xs mt-0.5">{s.saham}</div></div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action]||"text-white"} bg-white/5`}>{s.action}</span>
                    </div>
                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry||"—"}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">TP</span><span className="text-green-400 font-medium">{s.tp||"—"}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">SL</span><span className="text-red-400 font-medium">{s.sl||"—"}</span></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-500 border-t border-white/5 pt-2 mb-3 line-clamp-2">{s.notes}</p>}
                    <div className="flex flex-wrap gap-1 mb-3">{(s.package||[]).map((p:string)=><span key={p} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500 capitalize">{p}</span>)}</div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <Btn onClick={()=>editSig(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={()=>delSig(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
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
                  <h2 className="text-white font-bold text-sm">Manajemen Token VIP</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{tokens.length} token · {tokens.filter(t=>t.isActive&&!isExpired(t.expiredAt)).length} aktif</p>
                </div>
                <button onClick={()=>{setTokForm({email:"",name:"",package:"gold",expiredAt:""});setEditTokId(null);setShowTokForm(!showTokForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTokForm&&!editTokId?"Tutup":"Tambah Token"}
                </button>
              </div>
              {showTokForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTokId?"Edit Token":"Generate Token Baru"}</h3>
                  <div className="space-y-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama User</label><input value={tokForm.name} onChange={e=>setTokForm({...tokForm,name:e.target.value})} placeholder="Nama lengkap" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Email</label><input value={tokForm.email} onChange={e=>setTokForm({...tokForm,email:e.target.value})} placeholder="user@email.com" className="input-dark" type="email"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                      <select value={tokForm.package} onChange={e=>setTokForm({...tokForm,package:e.target.value})} className="input-dark">
                        {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Expired Tanggal</label><input type="datetime-local" value={tokForm.expiredAt} onChange={e=>setTokForm({...tokForm,expiredAt:e.target.value})} className="input-dark"/></div>
                    <div className="flex gap-2">
                      <button onClick={saveTok} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTokId?"Update Token":"Generate Token"}</button>
                      <button onClick={()=>{setShowTokForm(false);setEditTokId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tokens.length===0 ? (
                  <div className="col-span-2 card rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">Belum ada token.</p></div>
                ) : tokens.map(t=>{
                  const expired=isExpired(t.expiredAt); const near=isNearExpiry(t.expiredAt);
                  return (
                    <div key={t.id} className={`card rounded-xl p-4 ${expired?"border-red-500/20":near?"border-yellow-500/15":""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-white">{t.name||"—"}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${expired?"bg-red-400/10 text-red-400":t.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>
                            {expired?"EXPIRED":t.isActive?"AKTIF":"NONAKTIF"}
                          </span>
                        </div>
                        <span className="text-xs text-cyan-400 font-bold capitalize">{t.package}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1.5">{t.email}</div>
                      <div className="font-mono text-xs bg-white/5 rounded-lg px-3 py-2 text-slate-300 mb-2 break-all select-all">{t.token}</div>
                      <div className={`text-xs mb-3 ${expired?"text-red-400":near?"text-yellow-400":"text-slate-600"}`}>
                        Expired: {new Date(t.expiredAt).toLocaleString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                      </div>
                      <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                        <Btn onClick={()=>editTok(t)} color="blue">Edit</Btn>
                        <Btn onClick={()=>toggleTok(t)} color={t.isActive?"yellow":"green"}>{t.isActive?"Nonaktif":"Aktifkan"}</Btn>
                        <Btn onClick={()=>extendTok(t)} color="purple">+Hari</Btn>
                        <Btn onClick={()=>delTok(t.id)} color="red">Hapus</Btn>
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
                  <h2 className="text-white font-bold text-sm">Manajemen Top Saham</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${stockMode==="custom"?"bg-yellow-400/10 text-yellow-400":"bg-green-400/10 text-green-400"}`}>
                    {stockMode==="custom"?"Mode Custom":"Mode Live"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn onClick={()=>fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[]))} color="green">Refresh Live</Btn>
                  {stockMode==="live" && <Btn onClick={importLive} color="blue">Import & Edit</Btn>}
                  {stockMode==="custom" && <Btn onClick={resetLive} color="yellow">Reset ke Live</Btn>}
                  <button onClick={()=>{setStockForm({kode:"",name:"",price:"",changePercent:""});setEditStockId(null);setShowStockForm(!showStockForm);setStockMode("custom");}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                    {showStockForm&&!editStockId?"Tutup":"Tambah Saham"}
                  </button>
                </div>
              </div>
              {showStockForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editStockId?"Edit Saham":"Tambah Saham Custom"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={stockForm.kode} onChange={e=>setStockForm({...stockForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={stockForm.name} onChange={e=>setStockForm({...stockForm,name:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Harga</label><input value={stockForm.price} onChange={e=>setStockForm({...stockForm,price:e.target.value})} placeholder="9875" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Perubahan %</label><input value={stockForm.changePercent} onChange={e=>setStockForm({...stockForm,changePercent:e.target.value})} placeholder="1.28" className="input-dark"/></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveStock} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editStockId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowStockForm(false);setEditStockId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(stockMode==="custom"?customStocks:topStocksLive).map((s,i)=>{
                  const pct = parseFloat(stockMode==="custom"?s.changePercent:s.changePercent);
                  const pos = pct >= 0;
                  return (
                    <div key={i} className="card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-1">
                        <div><div className="font-black text-white">{stockMode==="custom"?s.kode:s.symbol?.replace(".JK","")}</div><div className="text-xs text-slate-500">{s.name}</div></div>
                        <span className={`text-xs font-bold ${pos?"text-green-400":"text-red-400"}`}>{pos?"+":""}{pct?.toFixed?.(2)||pct}%</span>
                      </div>
                      <div className="text-lg font-black text-white mb-3">{stockMode==="custom"?Number(s.price).toLocaleString("id-ID"):s.price?.toLocaleString("id-ID")}</div>
                      {stockMode==="custom" && (
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <Btn onClick={()=>editStock(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                          <Btn onClick={()=>delStock(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======== LIVE INFO ======== */}
          {tab==="liveinfo" && (
            <div className="max-w-2xl">
              <h2 className="text-white font-bold text-sm mb-4">Info Live (Halaman VIP)</h2>
              <div className="card rounded-2xl p-5 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-white">Tampilkan Info Live</label>
                  <button onClick={()=>setLiveActiveState(!liveActive)} className={`relative w-12 h-6 rounded-full transition-all ${liveActive?"bg-cyan-500":"bg-slate-700"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${liveActive?"left-7":"left-1"}`}/>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Pesan Info</label>
                  <textarea value={liveInput} onChange={e=>setLiveInput(e.target.value)} rows={4} placeholder="Contoh: Market hari ini volatile, harap perhatikan manajemen risiko..." className="input-dark resize-none"/>
                </div>
                <button onClick={()=>{setLiveMsgState(liveInput);setLiveSaved(true);setTimeout(()=>setLiveSaved(false),2000);}} className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold">
                  {liveSaved?"Tersimpan!":"Simpan Info"}
                </button>
              </div>
              {/* Premium Signals Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-white font-bold text-sm">Konten Sinyal Premium (Halaman VIP)</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Isi bagian sinyal premium yang muncul di halaman VIP</p>
                  </div>
                  <button onClick={()=>{setPremSigForm({title:"",content:"",isActive:true});setEditPremSigId(null);setShowPremSigForm(!showPremSigForm);}} className="btn-primary text-xs px-3 py-1.5 rounded-xl">
                    {showPremSigForm&&!editPremSigId?"Tutup":"Tambah"}
                  </button>
                </div>
                {showPremSigForm && (
                  <div className="card rounded-2xl p-5 mb-4 border border-cyan-500/20">
                    <div className="space-y-3">
                      <div><label className="text-xs text-slate-500 mb-1 block">Judul</label><input value={premSigForm.title} onChange={e=>setPremSigForm({...premSigForm,title:e.target.value})} placeholder="Bandarmologi Report" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">Konten/Deskripsi</label><textarea value={premSigForm.content} onChange={e=>setPremSigForm({...premSigForm,content:e.target.value})} rows={4} placeholder="Isi konten sinyal premium..." className="input-dark resize-none"/></div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={premSigForm.isActive} onChange={e=>setPremSigForm({...premSigForm,isActive:e.target.checked})} className="accent-cyan-500"/>
                        <label className="text-xs text-slate-300">Aktif (tampil di halaman VIP)</label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={savePremSig} className="btn-primary flex-1 py-2 rounded-xl text-sm">{editPremSigId?"Update":"Simpan"}</button>
                        <button onClick={()=>{setShowPremSigForm(false);setEditPremSigId(null);}} className="px-4 py-2 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {premiumSignals.map(s=>(
                    <div key={s.id} className="card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white text-sm">{s.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>{s.isActive?"Aktif":"Nonaktif"}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{s.content}</p>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Btn onClick={()=>editPremSig(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                        <Btn onClick={()=>delPremSig(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======== TESTIMONIALS ======== */}
          {tab==="testimonials" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Testimoni</h2>
                  <p className="text-slate-500 text-xs">{testimonials.filter(t=>t.isApproved).length} aktif · {testimonials.length} total</p>
                </div>
                <button onClick={()=>{setTestiForm({name:"",package:"gold",rating:5,text:"",date:"",isApproved:true});setEditTestiId(null);setShowTestiForm(!showTestiForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTestiForm&&!editTestiId?"Tutup":"Tambah Testimoni"}
                </button>
              </div>
              {showTestiForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTestiId?"Edit":"Tambah"} Testimoni</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={testiForm.name} onChange={e=>setTestiForm({...testiForm,name:e.target.value})} placeholder="Nama member" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                      <select value={testiForm.package} onChange={e=>setTestiForm({...testiForm,package:e.target.value})} className="input-dark">
                        {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Rating (1-5)</label>
                      <select value={testiForm.rating} onChange={e=>setTestiForm({...testiForm,rating:parseInt(e.target.value)})} className="input-dark">
                        {[5,4,3,2,1].map(r=><option key={r} value={r} className="bg-black">{r} Bintang</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input value={testiForm.date} onChange={e=>setTestiForm({...testiForm,date:e.target.value})} placeholder="Mei 2025" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Testimoni</label><textarea value={testiForm.text} onChange={e=>setTestiForm({...testiForm,text:e.target.value})} rows={3} placeholder="Isi testimoni..." className="input-dark resize-none"/></div>
                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" checked={testiForm.isApproved} onChange={e=>setTestiForm({...testiForm,isApproved:e.target.checked})} className="accent-cyan-500"/>
                    <label className="text-xs text-slate-300">Tampilkan di halaman (approved)</label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTesti} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">{editTestiId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowTestiForm(false);setEditTestiId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map(t=>(
                  <div key={t.id} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white">{t.name}</span>
                        <span className="ml-2 text-xs text-cyan-400 capitalize">{t.package}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.isApproved?"bg-green-400/10 text-green-400":"bg-red-400/10 text-red-400"}`}>
                        {t.isApproved?"Tampil":"Hidden"}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">{Array(t.rating||5).fill(0).map((_,i)=><span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
                    <p className="text-slate-400 text-xs mb-2 line-clamp-3">{t.text}</p>
                    <div className="text-xs text-slate-600 mb-3">{t.date}</div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <Btn onClick={()=>editTesti(t)} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={()=>toggleTesti(t)} color={t.isApproved?"yellow":"green"} className="flex-1 text-center">{t.isApproved?"Sembunyikan":"Tampilkan"}</Btn>
                      <Btn onClick={()=>delTesti(t.id)} color="red">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== PRICING ======== */}
          {tab==="pricing" && (
            <div>
              <div className="mb-4">
                <h2 className="text-white font-bold text-sm">Manajemen Harga Paket</h2>
                <p className="text-slate-500 text-xs mt-0.5">Edit harga, deskripsi, fitur, dan flash sale setiap paket</p>
              </div>
              {showPricingForm && editPricingId && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Edit Paket: {pricing.find(p=>p.id===editPricingId)?.name}</h3>
                  <div className="space-y-3 mb-4">
                    <div><label className="text-xs text-slate-500 mb-1 block">Label Harga (tampil di web)</label><input value={pricingForm.priceLabel} onChange={e=>setPricingForm({...pricingForm,priceLabel:e.target.value})} placeholder="Rp 100.000" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Periode</label><input value={pricingForm.period} onChange={e=>setPricingForm({...pricingForm,period:e.target.value})} placeholder="/bulan" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Deskripsi Paket</label><textarea value={pricingForm.description} onChange={e=>setPricingForm({...pricingForm,description:e.target.value})} rows={3} className="input-dark resize-none"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Fitur (1 per baris)</label><textarea value={pricingForm.features} onChange={e=>setPricingForm({...pricingForm,features:e.target.value})} rows={6} placeholder="Sinyal saham harian&#10;Berita pasar realtime" className="input-dark resize-none"/></div>
                  </div>
                  <div className="card rounded-xl p-4 mb-4 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <input type="checkbox" checked={pricingForm.hasFlashSale} onChange={e=>setPricingForm({...pricingForm,hasFlashSale:e.target.checked})} className="accent-orange-500"/>
                      <label className="text-sm font-bold text-white">Aktifkan Flash Sale</label>
                    </div>
                    {pricingForm.hasFlashSale && (
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-slate-500 mb-1 block">Diskon (contoh: 50%)</label><input value={pricingForm.flashSale?.discount||""} onChange={e=>setPricingForm({...pricingForm,flashSale:{...pricingForm.flashSale,discount:e.target.value}})} placeholder="50%" className="input-dark"/></div>
                        <div><label className="text-xs text-slate-500 mb-1 block">Harga Flash Sale</label><input value={pricingForm.flashSale?.price||""} onChange={e=>setPricingForm({...pricingForm,flashSale:{...pricingForm.flashSale,price:e.target.value}})} placeholder="Rp 50.000" className="input-dark"/></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={savePricing} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">Simpan Perubahan</button>
                    <button onClick={()=>{setShowPricingForm(false);setEditPricingId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricing.map(p=>{
                  const colorMap: any = { blue:"border-blue-500/30", cyan:"border-cyan-500/30", gold:"border-yellow-500/30", purple:"border-purple-500/30", platinum:"border-slate-400/30", elite:"border-yellow-400/50" };
                  return (
                    <div key={p.id} className={`card rounded-xl p-5 border ${colorMap[p.color]||"border-white/10"}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div><div className="font-black text-white text-base">{p.name}</div><div className="text-xs text-slate-500 mt-0.5">{p.period}</div></div>
                        <div className="text-right">
                          <div className="text-lg font-black text-white">{p.priceLabel}</div>
                          {p.flashSale && <span className="flash-badge">FLASH {p.flashSale.discount}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.description}</p>
                      <ul className="space-y-1 mb-4">
                        {(p.features||[]).slice(0,3).map((f:string,i:number)=><li key={i} className="text-xs text-slate-500 flex gap-1"><span className="text-cyan-400">✓</span>{f}</li>)}
                        {(p.features||[]).length>3 && <li className="text-xs text-slate-600">+{p.features.length-3} fitur lainnya</li>}
                      </ul>
                      <button onClick={()=>openPricingEdit(p)} className="w-full py-2 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all">
                        Edit Paket
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======== TICKER ======== */}
          {tab==="ticker" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Ticker Saham</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Kelola saham yang muncul di ticker berjalan atas halaman</p>
                </div>
                <button onClick={()=>{setTickerForm({kode:"",price:"",change:""});setEditTickerId(null);setShowTickerForm(!showTickerForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTickerForm&&!editTickerId?"Tutup":"Tambah Ticker"}
                </button>
              </div>
              {showTickerForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTickerId?"Edit":"Tambah"} Item Ticker</h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={tickerForm.kode} onChange={e=>setTickerForm({...tickerForm,kode:e.target.value.toUpperCase()})} placeholder="IHSG" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Harga</label><input value={tickerForm.price} onChange={e=>setTickerForm({...tickerForm,price:e.target.value})} placeholder="7.333" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Perubahan</label><input value={tickerForm.change} onChange={e=>setTickerForm({...tickerForm,change:e.target.value})} placeholder="+0.66%" className="input-dark"/></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTicker} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">{editTickerId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowTickerForm(false);setEditTickerId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tickerStocks.map((t,i)=>{
                  const pos = t.change?.startsWith("+");
                  return (
                    <div key={i} className="card rounded-xl p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-white text-sm">{t.kode}</span>
                        <span className={`text-xs font-bold ${pos?"text-green-400":"text-red-400"}`}>{t.change}</span>
                      </div>
                      <div className="font-bold text-slate-300 text-sm mb-3">{t.price}</div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Btn onClick={()=>editTicker(t)} color="blue" className="flex-1 text-center">Edit</Btn>
                        <Btn onClick={()=>delTicker(t.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setAuthed(localStorage.getItem("admin_auth") === "1");
    setLoading(false);
  }, []);
  if (loading) return <div className="min-h-screen bg-[#04060f] flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { localStorage.removeItem("admin_auth"); setAuthed(false); }} />;
}
