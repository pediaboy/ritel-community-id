"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { packages, testimonials as staticTestimonials, vipModules } from "@/lib/data";

/* ───────── NAVBAR ───────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    ["#chart", "Market"],
    ["#news", "Berita"],
    ["#signals", "Sinyal"],
    ["#pricing", "Paket"],
    ["#testimonial", "Testimoni"],
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(4,7,15,0.96)" : "rgba(4,7,15,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(30,90,240,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
            style={{ background: "linear-gradient(135deg,#1E5AF0,#3B82F6)" }}
          >RC</div>
          <div className="hidden sm:block">
            <span className="text-white font-black text-sm">RITEL</span>
            <span className="text-blue-400 font-black text-sm"> COMMUNITY</span>
            <span className="text-slate-500 font-bold text-sm">.ID</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(([h, l]) => (
            <a key={h} href={h}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all font-medium">
              {l}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/login"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-blue-400 hover:text-white hover:bg-blue-500/10 transition-all border border-blue-500/25">
            Login VIP
          </Link>
          <a href="https://wa.me/6282218723401" target="_blank"
            className="btn-green text-xs px-4 py-2 rounded-lg font-bold">
            Daftar Sekarang
          </a>
          {/* 3-dot */}
          <div className="relative">
            <button onClick={() => setDropOpen(!dropOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {dropOpen && (
              <div className="absolute right-0 top-10 w-52 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.2)" }}>
                {[
                  ["💎 Paket Basic — Rp 100rb", "#pricing"],
                  ["🥇 Paket Gold — Rp 500rb", "#pricing"],
                  ["👑 Semua Paket", "/paket"],
                  ["📰 Berita Pasar", "#news"],
                  ["📈 Chart IHSG", "#chart"],
                  ["⭐ Testimoni", "#testimonial"],
                  ["🔐 Login VIP", "/login"],
                  ["📱 WhatsApp Admin", "https://wa.me/6282218723401"],
                ].map(([label, href], i) => (
                  <a key={i} href={href} onClick={() => setDropOpen(false)}
                    className="block px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    style={{ borderBottom: "1px solid rgba(30,90,240,0.07)" }}>
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mx-3 mb-3 rounded-xl overflow-hidden" style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.15)" }}>
          {navLinks.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5"
              style={{ borderBottom: "1px solid rgba(30,90,240,0.07)" }}>
              {l}
            </a>
          ))}
          <Link href="/login" onClick={() => setMobileOpen(false)}
            className="block px-4 py-3 text-sm font-bold text-blue-400">
            🔐 Login Member VIP
          </Link>
          <a href="https://wa.me/6282218723401" target="_blank"
            className="block px-4 py-3 text-sm font-bold text-green-400">
            📱 Daftar via WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const [price, setPrice] = useState(7285.42);
  const [diff, setDiff] = useState(+48.31);

  useEffect(() => {
    const iv = setInterval(() => {
      setDiff(d => +(d + (Math.random() - 0.5) * 2).toFixed(2));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const isUp = diff >= 0;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden">
      {/* BG grid */}
      <div className="absolute inset-0" style={{ background:"#04070F" }}>
        <div className="absolute inset-0"
          style={{ backgroundImage:"linear-gradient(rgba(30,90,240,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(30,90,240,0.05) 1px,transparent 1px)", backgroundSize:"40px 40px" }}/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64"
          style={{ background:"linear-gradient(180deg,rgba(30,90,240,0.08) 0%,transparent 100%)" }}/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"/>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Live Market · Trusted Platform</span>
            </div>

            <h1 className="font-black text-white mb-4 leading-tight" style={{ fontSize:"clamp(2rem,5vw,3.2rem)" }}>
              Platform Investasi{" "}
              <span className="text-blue-400">Saham Indonesia</span>{" "}
              Terpercaya
            </h1>

            <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-lg">
              Bergabung bersama <strong className="text-white">2.500+ member</strong> aktif. Sinyal realtime, analisis mendalam, modul edukasi lengkap, dan AI Agent eksklusif.
            </p>

            {/* Mini IHSG ticker */}
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-3 rounded-xl"
              style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.2)" }}>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">IHSG</p>
                <p className="text-white font-black text-base">{(price + diff).toFixed(2)}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${isUp ? "text-green-400" : "text-red-400"}`}
                style={{ background: isUp ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)" }}>
                {isUp ? "+" : ""}{diff.toFixed(2)} ({isUp ? "+" : ""}{(diff / price * 100).toFixed(2)}%)
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"/>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/6282218723401?text=Halo%20Ritel%20Community,%20saya%20mau%20bergabung!"
                target="_blank" className="btn-blue px-7 py-3 rounded-xl font-black text-sm">
                🚀 Bergabung Sekarang
              </a>
              <Link href="/login" className="btn-outline px-7 py-3 rounded-xl font-bold text-sm">
                Login VIP →
              </Link>
            </div>
          </div>

          {/* Right — stats cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:"👥", val:"2,500+", label:"Member Aktif", sub:"Bergabung hari ini", color:"#3B82F6" },
              { icon:"🎯", val:"95%", label:"Akurasi Sinyal", sub:"Backtested 2 tahun", color:"#4ADE80" },
              { icon:"💎", val:"6", label:"Paket VIP", sub:"Mulai Rp 100.000", color:"#FACC15" },
              { icon:"🤖", val:"AI", label:"Agent Eksklusif", sub:"Pro, Platinum, Elite", color:"#C084FC" },
            ].map((item) => (
              <div key={item.label} className="card p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="font-black text-xl mb-0.5" style={{ color: item.color }}>{item.val}</p>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-slate-600 text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div className="flex flex-wrap gap-3 mt-12 pt-8" style={{ borderTop:"1px solid rgba(30,90,240,0.1)" }}>
          {["✅ Sinyal Harian", "✅ Chart Realtime", "✅ Modul Edukasi", "✅ Grup WA Eksklusif", "✅ AI Agent (Pro+)"].map(t => (
            <span key={t} className="text-xs text-slate-400 flex items-center gap-1.5">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── MARKET TICKER ───────── */
function MarketTicker() {
  const stocks = [
    { sym:"BBCA", price:"9.875", chg:"+1.28%", up:true },
    { sym:"BBRI", price:"4.680", chg:"-0.64%", up:false },
    { sym:"TLKM", price:"3.290", chg:"+1.54%", up:true },
    { sym:"ASII", price:"5.200", chg:"-1.42%", up:false },
    { sym:"GOTO", price:"86", chg:"+4.88%", up:true },
    { sym:"ANTM", price:"1.640", chg:"+2.18%", up:true },
    { sym:"BMRI", price:"6.175", chg:"+0.90%", up:true },
    { sym:"ADRO", price:"3.580", chg:"-0.55%", up:false },
  ];
  const doubled = [...stocks, ...stocks];

  return (
    <div className="overflow-hidden py-2" style={{ background:"#080D1A", borderTop:"1px solid rgba(30,90,240,0.1)", borderBottom:"1px solid rgba(30,90,240,0.1)" }}>
      <div className="flex gap-0 animate-[scroll_30s_linear_infinite]"
        style={{ width:"max-content", animation:"scroll 30s linear infinite" }}>
        <style>{`@keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
        {doubled.map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-2 border-r" style={{ borderColor:"rgba(30,90,240,0.08)" }}>
            <span className="text-xs font-bold text-slate-300">{s.sym}</span>
            <span className="text-xs text-white font-mono">{s.price}</span>
            <span className={`text-xs font-bold ${s.up ? "text-green-400" : "text-red-400"}`}>{s.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── CHART SECTION ───────── */
function ChartSection() {
  const [ihsg, setIhsg] = useState<any>({ value:7285.4, change:58.3, changePercent:0.81 });
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      fetch("/api/stocks").then(r=>r.json()).then(d => {
        if(d.ihsg) setIhsg(d.ihsg);
        if(d.stocks) setStocks(d.stocks.slice(0,8));
      }).catch(()=>{});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const isUp = ihsg.change >= 0;
  const fallback = [
    { symbol:"BBCA", name:"Bank Central Asia", price:9875, changePercent:1.28, volume:"12.5M", up:true },
    { symbol:"BBRI", name:"Bank Rakyat Indonesia", price:4680, changePercent:-0.64, volume:"45.2M", up:false },
    { symbol:"TLKM", name:"Telkom Indonesia", price:3290, changePercent:1.54, volume:"22.1M", up:true },
    { symbol:"ASII", name:"Astra International", price:5200, changePercent:-1.42, volume:"18.7M", up:false },
    { symbol:"GOTO", name:"GoTo Group", price:86, changePercent:4.88, volume:"892M", up:true },
    { symbol:"ANTM", name:"Aneka Tambang", price:1640, changePercent:2.18, volume:"33.4M", up:true },
  ];
  const list = stocks.length > 0 ? stocks : fallback;

  return (
    <section id="chart" className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left col — IHSG summary + table */}
          <div className="xl:col-span-1 space-y-4">
            {/* IHSG Card */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">IHSG · IDX Composite</p>
                  <p className="text-3xl font-black text-white">{ihsg.value?.toLocaleString("id-ID",{minimumFractionDigits:2})}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-green-400 px-2.5 py-1 rounded-lg"
                  style={{ background:"rgba(22,163,74,0.1)", border:"1px solid rgba(22,163,74,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"/>LIVE
                </span>
              </div>
              <div className={`flex items-center gap-2 text-sm font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>
                <span>{isUp ? "▲" : "▼"} {Math.abs(ihsg.change||0).toFixed(2)}</span>
                <span className="px-2 py-0.5 rounded text-xs"
                  style={{ background: isUp ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)" }}>
                  {isUp ? "+" : ""}{ihsg.changePercent?.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Stock table */}
            <div className="card overflow-hidden">
              <div className="px-4 py-3" style={{ borderBottom:"1px solid rgba(30,90,240,0.1)" }}>
                <p className="text-sm font-bold text-white">Top Saham</p>
              </div>
              {list.map((s:any, i:number) => {
                const pos = (s.changePercent||s.change||0) >= 0;
                const sym = (s.symbol||"").replace(".JK","");
                const pct = typeof s.changePercent==="number" ? s.changePercent.toFixed(2) : "0.00";
                return (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom:"1px solid rgba(30,90,240,0.05)" }}>
                    <div>
                      <p className="text-sm font-bold text-white">{sym}</p>
                      <p className="text-xs text-slate-600 truncate max-w-[120px]">{s.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-white">{typeof s.price==="number"?s.price.toLocaleString("id-ID"):s.price}</p>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${pos?"text-green-400":"text-red-400"}`}
                        style={{ background: pos?"rgba(22,163,74,0.1)":"rgba(220,38,38,0.1)" }}>
                        {pos?"+":""}{pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right col — TradingView Chart */}
          <div className="xl:col-span-2">
            <div className="card overflow-hidden" style={{ height:"520px" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(30,90,240,0.1)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Chart IHSG</span>
                  <span className="tag-blue">IDX:COMPOSITE</span>
                </div>
                <span className="text-xs text-slate-600">TradingView</span>
              </div>
              <iframe
                src="https://s.tradingview.com/widgetembed/?frameElementId=tv1&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1&primaryColor=1E5AF0&toolbarbg=04070F"
                style={{ width:"100%", height:"470px", border:"none", display:"block" }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── NEWS ───────── */
function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  useEffect(() => {
    fetch("/api/news").then(r=>r.json()).then(d=>{setNews(d.news||[]);setLoading(false);}).catch(()=>setLoading(false));
    const iv = setInterval(()=>fetch("/api/news").then(r=>r.json()).then(d=>setNews(d.news||[])).catch(()=>{}),60000);
    return ()=>clearInterval(iv);
  }, []);

  return (
    <section id="news" className="py-16 px-4 sm:px-6" style={{ background:"#04070F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-1.5">Market News</p>
            <h2 className="section-title">Berita Pasar</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"/>Live Feed
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className="rounded-2xl h-40 shimmer"/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item,i)=>(
              <div key={i} onClick={()=>setModal(item)}
                className="card p-4 cursor-pointer hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag-blue">{item.category}</span>
                  <span className="text-xs text-slate-600">{item.time}</span>
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-3 group-hover:text-blue-400 transition-colors line-clamp-3">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.source}</p>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)" }}
            onClick={()=>setModal(null)}>
            <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background:"#0A0F1E", border:"1px solid rgba(30,90,240,0.25)" }}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-4">
                <span className="tag-blue">{modal.category}</span>
                <span className="text-xs text-slate-500">{modal.source} · {modal.time}</span>
              </div>
              <h3 className="text-white font-black text-base mb-3 leading-snug">{modal.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{modal.summary}</p>
              <div className="flex gap-2">
                <a href={modal.url} target="_blank" className="btn-blue text-xs px-4 py-2 rounded-lg">Baca Selengkapnya ↗</a>
                <button onClick={()=>setModal(null)} className="text-xs px-4 py-2 rounded-lg text-slate-400 hover:text-white border border-white/10 transition-colors">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── SIGNALS ───────── */
function SignalsSection() {
  const [sigs, setSigs] = useState<any[]>([]);
  useEffect(()=>{fetch("/api/admin/signals").then(r=>r.json()).then(d=>setSigs(d.signals||[]));}, []);

  const mock = [
    { id:"1", kode:"BBCA", saham:"Bank Central Asia", action:"BUY", entry:"9.750–9.800", tp:"10.200 | 10.500", sl:"9.500", notes:"Breakout resistance, volume tinggi.", package:["gold","pro","platinum","elite"] },
    { id:"2", kode:"ANTM", saham:"Aneka Tambang", action:"ANTRI", entry:"1.580–1.620", tp:"1.750 | 1.850", sl:"1.520", notes:"Support emas global solid.", package:["silver","gold","pro"] },
    { id:"3", kode:"GOTO", saham:"GoTo Group", action:"BUY", entry:"80–85", tp:"100 | 115", sl:"72", notes:"First profitable quarter.", package:["pro","platinum","elite"] },
    { id:"4", kode:"TLKM", saham:"Telkom Indonesia", action:"HOLD", entry:"3.200–3.300", tp:"3.500 | 3.700", sl:"3.050", notes:"Dividen menarik, wait konfirmasi.", package:["gold","pro"] },
  ];
  const list = sigs.length > 0 ? sigs : mock;

  const acStyle:any = {
    BUY:   { color:"#4ADE80", bg:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.25)" },
    SELL:  { color:"#F87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.25)" },
    HOLD:  { color:"#FACC15", bg:"rgba(250,204,21,0.1)", border:"rgba(250,204,21,0.25)" },
    ANTRI: { color:"#60A5FA", bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.25)" },
  };

  return (
    <section id="signals" className="py-16 px-4 sm:px-6" style={{ background:"#06090F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-1.5">Premium Signals</p>
            <h2 className="section-title">Sinyal Saham</h2>
          </div>
          <Link href="/login" className="btn-outline text-xs px-4 py-2 rounded-lg">Login untuk akses penuh →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.slice(0,4).map((s:any)=>{
            const st = acStyle[s.action]||acStyle.HOLD;
            return (
              <div key={s.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">{s.kode}</p>
                    <p className="text-sm font-bold text-white leading-tight">{s.saham}</p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ color:st.color, background:st.bg, border:`1px solid ${st.border}` }}>
                    {s.action}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {[["Entry",s.entry,"text-slate-300"],["TP",s.tp,"text-green-400"],["SL",s.sl,"text-red-400"]].map(([l,v,c])=>(
                    <div key={l as string} className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">{l}</span>
                      <span className={`text-xs font-mono font-semibold ${c}`}>{v}</span>
                    </div>
                  ))}
                </div>
                {s.notes && <p className="text-xs text-slate-600 pt-2.5 leading-relaxed" style={{ borderTop:"1px solid rgba(30,90,240,0.08)" }}>{s.notes}</p>}
                <div className="flex flex-wrap gap-1 mt-3">
                  {(s.package||[]).map((p:string)=>(
                    <span key={p} className="tag-blue capitalize">{p}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl" style={{ background:"rgba(30,90,240,0.05)", border:"1px solid rgba(30,90,240,0.15)" }}>
          <span className="text-lg">🔒</span>
          <p className="text-sm text-slate-400 flex-1">Sinyal premium lengkap (entry, exit, analisis mendalam) tersedia untuk member VIP Gold ke atas.</p>
          <a href="https://wa.me/6282218723401" target="_blank" className="btn-blue text-xs px-4 py-2 rounded-lg flex-shrink-0">Daftar VIP</a>
        </div>
      </div>
    </section>
  );
}

/* ───────── PACKAGES ───────── */
function PackagesSection() {
  const basicPkg = packages[0];
  const topThree = packages.slice(0,3);

  const pkgColors: any = {
    basic:    { accent:"#3B82F6", border:"rgba(59,130,246,0.3)", glow:"rgba(59,130,246,0.08)" },
    silver:   { accent:"#22D3EE", border:"rgba(34,211,238,0.3)", glow:"rgba(34,211,238,0.06)" },
    gold:     { accent:"#FACC15", border:"rgba(250,204,21,0.4)", glow:"rgba(250,204,21,0.06)" },
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6" style={{ background:"#04070F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-1.5">Pricing</p>
          <h2 className="section-title mb-3">Pilihan Paket VIP</h2>
          <p className="section-sub">Mulai dari Rp 100.000/bulan — akses komunitas eksklusif saham Indonesia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {topThree.map((pkg)=>{
            const c = pkgColors[pkg.id] || pkgColors.basic;
            return (
              <div key={pkg.id} className={`rounded-2xl p-6 relative transition-all hover:scale-[1.01] ${pkg.popular?"ring-1":""}`}
                style={{
                  background:"#080D1A",
                  border:`1px solid ${c.border}`,
                  boxShadow: pkg.popular ? `0 0 40px ${c.glow}` : "none",
                  ringColor: c.accent,
                }}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full"
                    style={{ background:c.accent, color:"#04070F" }}>
                    ⭐ TERLARIS
                  </div>
                )}
                <div className="mb-4">
                  <p className="font-black text-base mb-0.5" style={{ color:c.accent }}>{pkg.name}</p>
                  <p className="text-3xl font-black text-white">{pkg.priceLabel}</p>
                  <p className="text-xs text-slate-500">{pkg.period}</p>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{pkg.description}</p>
                <ul className="space-y-2.5 mb-5">
                  {pkg.features.map((f,i)=>(
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-green-400 text-xs"
                        style={{ background:"rgba(74,222,128,0.1)" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`https://wa.me/6282218723401?text=Halo%20min%20order%20paket%20${pkg.name}%20${pkg.priceLabel}`}
                  target="_blank"
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background:`linear-gradient(135deg,${c.accent},${c.accent}cc)`, color: pkg.id==="gold" ? "#04070F" : "white" }}>
                  Order {pkg.name}
                </a>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl"
          style={{ background:"rgba(30,90,240,0.05)", border:"1px solid rgba(30,90,240,0.12)" }}>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Butuh fitur lebih canggih?</p>
            <p className="text-slate-500 text-xs">Pro · Platinum · Elite — termasuk AI Agent & konsultasi personal</p>
          </div>
          <Link href="/paket" className="btn-outline text-sm px-6 py-2.5 rounded-xl flex-shrink-0">Lihat Semua 6 Paket →</Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── AI SECTION ───────── */
function AISection() {
  return (
    <section className="py-16 px-4 sm:px-6" style={{ background:"#06090F" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="section-label mb-1.5">New Feature</p>
            <h2 className="section-title mb-4">AI Agent Eksklusif</h2>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Paket <strong className="text-blue-400">Pro, Platinum, dan Elite</strong> hadir dengan AI Agent canggih — analisis saham realtime, pantau portofolio otomatis, dan rekomendasi personal kapan saja.
            </p>
            <ul className="space-y-3 mb-7">
              {[
                ["🔍","Analisis fundamental & teknikal otomatis berbasis data terkini"],
                ["📊","Pantau dan evaluasi portofolio Anda secara real-time"],
                ["⚡","Alert sinyal entry/exit sesuai profil risiko Anda"],
                ["💬","Chat 24/7 dengan AI tentang kondisi pasar"],
              ].map(([icon,text])=>(
                <li key={text as string} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{icon}</span>
                  <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            <a href="https://wa.me/6282218723401?text=Halo,%20saya%20tertarik%20paket%20Pro%20dengan%20AI%20Agent!"
              target="_blank" className="btn-blue px-7 py-3 rounded-xl font-bold text-sm">
              🤖 Dapatkan AI Agent
            </a>
          </div>

          {/* Mock AI chat UI */}
          <div className="card-bordered rounded-2xl overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2.5" style={{ background:"#0A0F1E", borderBottom:"1px solid rgba(30,90,240,0.12)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>🤖</div>
              <div>
                <p className="text-white font-bold text-xs">AI Agent RC</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
            <div className="p-4 space-y-3" style={{ background:"#040711", minHeight:"280px" }}>
              {[
                { role:"user", text:"Analisis BBCA saat ini?" },
                { role:"ai", text:"BBCA dalam tren bullish. Support kuat di 9.600–9.700. Breakout 10.000 dengan volume → target 10.500. SL bawah 9.500." },
                { role:"user", text:"Prospek IHSG bulan ini?" },
                { role:"ai", text:"IHSG konsolidasi di range 7.100–7.400. Sentiment positif dari data inflasi. Watch level 7.500 untuk konfirmasi bullish continuation." },
              ].map((m,i)=>(
                <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                  {m.role==="ai" && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5"
                      style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>🤖</div>
                  )}
                  <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
                    style={{
                      background: m.role==="user" ? "#1E5AF0" : "#0D1526",
                      color: "white",
                      borderBottomRightRadius: m.role==="user" ? "4px" : "14px",
                      borderBottomLeftRadius: m.role==="ai" ? "4px" : "14px",
                    }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"0ms" }}/>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"150ms" }}/>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"300ms" }}/>
              </div>
            </div>
            <div className="px-3 py-2.5 flex gap-2" style={{ background:"#0A0F1E", borderTop:"1px solid rgba(30,90,240,0.1)" }}>
              <div className="flex-1 px-3 py-2 rounded-lg text-xs text-slate-600" style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.12)" }}>
                Tanya tentang saham...
              </div>
              <div className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background:"#1E5AF0" }}>Kirim</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── TESTIMONIALS ───────── */
function TestimonialsSection() {
  const [list, setList] = useState(staticTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", package:"Gold", rating:5, text:"" });
  const [done, setDone] = useState(false);

  useEffect(()=>{
    fetch("/api/testimonials").then(r=>r.json()).then(d=>{if(d.testimonials?.length>0)setList(d.testimonials);});
  },[]);

  const submit = async()=>{
    if(!form.name||!form.text) return;
    await fetch("/api/testimonials",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setDone(true);setShowForm(false);
  };

  const pkgAccent: any = { Basic:"#3B82F6",Silver:"#22D3EE",Gold:"#FACC15",Pro:"#C084FC",Platinum:"#94A3B8",Elite:"#FACC15" };

  return (
    <section id="testimonial" className="py-16 px-4 sm:px-6" style={{ background:"#04070F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-1.5">Social Proof</p>
            <h2 className="section-title">Kata Member Kami</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {list.map((t:any,i:number)=>{
            const accent = pkgAccent[t.package]||"#3B82F6";
            return (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${accent}44,${accent}22)`, border:`1px solid ${accent}44`, color:accent }}>
                    {t.name?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <span className="text-xs font-bold" style={{ color:accent }}>Paket {t.package}</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating||5)].map((_,j)=>(
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{t.text}"</p>
                <p className="text-xs text-slate-700 mt-3">{t.date}</p>
              </div>
            );
          })}
        </div>

        {done && <p className="text-center text-green-400 text-sm mb-5">✓ Testimoni terkirim, menunggu review.</p>}

        {!showForm ? (
          <div className="text-center">
            <button onClick={()=>setShowForm(true)} className="btn-outline px-6 py-2.5 rounded-xl text-sm font-bold">
              + Tambah Testimoni Anda
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto card-bordered p-6 rounded-2xl">
            <h3 className="text-white font-black mb-4">Bagikan Pengalaman</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder-slate-600"
                style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.2)" }}/>
              <select value={form.package} onChange={e=>setForm({...form,package:e.target.value})}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.2)" }}>
                {["Basic","Silver","Gold","Pro","Platinum","Elite"].map(p=>(
                  <option key={p} value={p} style={{ background:"#080D1A" }}>{p}</option>
                ))}
              </select>
              <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})}
                placeholder="Ceritakan pengalaman Anda..." rows={3}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-600"
                style={{ background:"#080D1A", border:"1px solid rgba(30,90,240,0.2)" }}/>
              <div className="flex gap-2">
                <button onClick={submit} className="btn-blue flex-1 py-3 rounded-xl text-sm font-bold">Kirim</button>
                <button onClick={()=>setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 transition-colors">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6" style={{ background:"#080D1A", borderTop:"1px solid rgba(30,90,240,0.1)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
                style={{ background:"linear-gradient(135deg,#1E5AF0,#3B82F6)" }}>RC</div>
              <div>
                <span className="text-white font-black text-sm">RITEL COMMUNITY</span>
                <span className="text-slate-500 font-bold text-sm">.ID</span>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">Platform investasi saham premium Indonesia. Sinyal realtime, edukasi, dan AI Agent.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[["#chart","Market Live"],["#news","Berita Pasar"],["#signals","Sinyal Saham"],["#pricing","Paket VIP"],["#testimonial","Testimoni"]].map(([h,l])=>(
                <li key={h}><a href={h} className="text-slate-500 hover:text-blue-400 transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Member</h4>
            <ul className="space-y-2.5">
              {[["/login","Login VIP"],["/paket","Semua Paket"],["https://wa.me/6282218723401","Order Paket"]].map(([h,l])=>(
                <li key={h}><a href={h} className="text-slate-500 hover:text-blue-400 transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Kontak</h4>
            <div className="space-y-2.5">
              <a href="https://wa.me/6282218723401" target="_blank" className="flex items-center gap-2 text-slate-500 hover:text-green-400 transition-colors text-sm">
                <span>📱</span> 082218723401
              </a>
              <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="flex items-center gap-2 text-slate-500 hover:text-pink-400 transition-colors text-sm">
                <span>📸</span> @elthoriqqqq_
              </a>
            </div>
            <p className="text-xs text-slate-700 mt-4">By <span className="text-blue-500">Thirafi Thariq Al Idris</span></p>
          </div>
        </div>
        <div className="text-center text-xs text-slate-700 pt-6" style={{ borderTop:"1px solid rgba(30,90,240,0.07)" }}>
          © 2025 RITEL COMMUNITY.ID — Investasi mengandung risiko. Past performance ≠ future results.
        </div>
      </div>
    </footer>
  );
}

/* ───────── FLOAT WA ───────── */
function FloatWA() {
  return (
    <a href="https://wa.me/6282218723401" target="_blank"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 flex items-center justify-center rounded-full transition-all hover:scale-110"
      style={{ background:"#16A34A", boxShadow:"0 4px 20px rgba(22,163,74,0.5)" }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

export default function Home() {
  return (
    <main style={{ background:"#04070F" }}>
      <Navbar />
      <Hero />
      <MarketTicker />
      <ChartSection />
      <NewsSection />
      <SignalsSection />
      <AISection />
      <PackagesSection />
      <TestimonialsSection />
      <Footer />
      <FloatWA />
    </main>
  );
}
