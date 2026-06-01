"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { packages, testimonials as staticTestimonials, vipModules } from "@/lib/data";

/* ─────────────── NAVBAR ─────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dotMenu, setDotMenu] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dotItems = [
    { label: "🔥 Paket Basic – Rp 100.000", href: "#pricing" },
    { label: "⭐ Paket Gold – Rp 500.000", href: "#pricing" },
    { label: "👑 Lihat Semua Paket", href: "/paket" },
    { label: "📰 Berita Pasar", href: "#news" },
    { label: "📈 Chart IHSG", href: "#chart" },
    { label: "⭐ Testimoni Member", href: "#testimonial" },
    { label: "📱 Chat WhatsApp", href: "https://wa.me/6282218723401" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(2,8,24,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(14,165,233,0.15)" : "none",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#22d3ee)" }}
          >
            RC
          </div>
          <div className="leading-tight">
            <span className="text-white font-black text-base tracking-tight">RITEL</span>
            <span className="gradient-text font-black text-base"> COMMUNITY</span>
            <span className="text-blue-400 font-black text-base">.ID</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {[["#news","Berita"],["#signals","Sinyal"],["#modules","Modul VIP"],["#pricing","Paket"],["#testimonial","Testimoni"]].map(([h,l]) => (
            <a key={h} href={h} className="text-sm text-slate-300 hover:text-white transition-colors font-medium">{l}</a>
          ))}
          <a
            href="https://wa.me/6282218723401"
            target="_blank"
            className="btn-gold text-sm px-5 py-2.5 rounded-xl"
          >
            Order Sekarang
          </a>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Dot menu */}
          <div className="relative">
            <button
              onClick={() => setDotMenu(!dotMenu)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
              style={{ background: dotMenu ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.05)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {dotMenu && (
              <div
                className="absolute right-0 top-12 w-60 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(5,15,44,0.98)",
                  border: "1px solid rgba(14,165,233,0.25)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {dotItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={() => setDotMenu(false)}
                    className="flex items-center px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors"
                    style={{ borderBottom: "1px solid rgba(14,165,233,0.08)" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mx-4 mb-4 rounded-2xl overflow-hidden"
          style={{ background: "rgba(5,15,44,0.98)", border: "1px solid rgba(14,165,233,0.2)" }}
        >
          {[["#news","📰 Berita Pasar"],["#signals","⚡ Sinyal Saham"],["#modules","📚 Modul VIP"],["#pricing","💎 Paket"],["#testimonial","⭐ Testimoni"]].map(([h,l]) => (
            <a
              key={h} href={h}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3.5 text-sm text-slate-300 hover:text-white font-medium"
              style={{ borderBottom: "1px solid rgba(14,165,233,0.1)" }}
            >
              {l}
            </a>
          ))}
          <a
            href="https://wa.me/6282218723401"
            target="_blank"
            className="block px-5 py-3.5 text-sm font-bold text-yellow-400"
          >
            📱 Order via WhatsApp →
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Layered background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#020818 0%,#050f2c 50%,#020818 100%)" }}/>
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%)" }}/>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 70%)" }}/>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)" }}/>
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.4) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-8 text-sm font-medium"
          style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)" }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"/>
          <span className="text-blue-300">Platform Investasi Saham #1 Indonesia</span>
        </div>

        {/* Main title */}
        <h1 className="font-black text-white mb-5 leading-tight" style={{ fontSize: "clamp(2.5rem,8vw,5rem)" }}>
          RITEL{" "}
          <span className="gradient-text">COMMUNITY</span>
          <span className="text-blue-400">.ID</span>
        </h1>

        <p className="text-slate-300 mb-3 leading-relaxed max-w-xl mx-auto" style={{ fontSize: "clamp(1rem,2.5vw,1.15rem)" }}>
          Komunitas saham premium dengan sinyal{" "}
          <strong className="text-blue-400">realtime</strong>, analisis mendalam, dan AI Agent eksklusif untuk portofolio Anda.
        </p>

        <p className="text-sm text-slate-500 mb-10">
          Dikembangkan oleh{" "}
          <span className="text-blue-400 font-semibold">Thirafi Thariq Al Idris</span>
          {" · "}
          <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="text-blue-400 hover:underline">@elthoriqqqq_</a>
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[["2,500+","Member Aktif","👥"],["95%","Akurasi Sinyal","🎯"],["6","Paket VIP","💎"],["24/7","Support","🛡️"]].map(([val,lbl,icon]) => (
            <div
              key={lbl}
              className="stat-card"
              style={{ minWidth: "110px" }}
            >
              <div className="text-xl mb-0.5">{icon}</div>
              <div className="text-2xl font-black text-white">{val}</div>
              <div className="text-xs text-slate-400 mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/6282218723401?text=Halo%20Ritel%20Community,%20saya%20ingin%20bergabung!"
            target="_blank"
            className="btn-gold text-base px-8 py-3.5 rounded-2xl font-black"
            style={{ fontSize: "1rem" }}
          >
            🚀 Mulai Sekarang
          </a>
          <a
            href="#pricing"
            className="btn-primary text-base px-8 py-3.5 rounded-2xl font-bold"
            style={{ fontSize: "1rem" }}
          >
            Lihat Paket →
          </a>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <svg className="w-6 h-6 text-blue-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}

/* ─────────────── IHSG CHART ─────────────── */
function IHSGChart() {
  const [ihsg, setIhsg] = useState({ value: 7285.4, change: 58.3, changePercent: 0.81 });
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      fetch("/api/stocks").then(r => r.json()).then(d => {
        if (d.ihsg) setIhsg(d.ihsg);
        if (d.stocks) setStocks(d.stocks.slice(0, 8));
      }).catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const isUp = ihsg.change >= 0;
  const mockStocks = [
    { symbol: "BBCA", name: "Bank Central Asia", price: 9875, change: 125, changePercent: 1.28, volume: "12.5M" },
    { symbol: "BBRI", name: "Bank Rakyat Indonesia", price: 4680, change: -30, changePercent: -0.64, volume: "45.2M" },
    { symbol: "TLKM", name: "Telkom Indonesia", price: 3290, change: 50, changePercent: 1.54, volume: "22.1M" },
    { symbol: "ASII", name: "Astra International", price: 5200, change: -75, changePercent: -1.42, volume: "18.7M" },
    { symbol: "GOTO", name: "GoTo Group", price: 86, change: 4, changePercent: 4.88, volume: "892M" },
    { symbol: "ANTM", name: "Aneka Tambang", price: 1640, change: 35, changePercent: 2.18, volume: "33.4M" },
  ];
  const displayStocks = stocks.length > 0 ? stocks : mockStocks;

  return (
    <section id="chart" className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Realtime Market</p>
          <h2 className="text-4xl font-black text-white mb-2">
            📈 IHSG <span className="gradient-text">Live</span>
          </h2>
          <p className="text-slate-400 text-sm">Data diperbarui otomatis setiap 30 detik</p>
        </div>

        {/* IHSG Summary card */}
        <div
          className="card-glass rounded-3xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="text-slate-400 text-sm mb-1">Indeks Harga Saham Gabungan (IHSG)</p>
            <p className="text-5xl font-black text-white">
              {ihsg.value?.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-xl font-bold mt-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(ihsg.change || 0).toFixed(2)}{" "}
              <span className="text-base">({isUp ? "+" : ""}{ihsg.changePercent?.toFixed(2)}%)</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-green-400 font-semibold text-sm">Live</span>
          </div>
        </div>

        {/* TradingView */}
        <div className="card-glass rounded-3xl overflow-hidden mb-6">
          <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(14,165,233,0.15)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-slate-400 text-sm">Chart IHSG — IDX:COMPOSITE · TradingView</span>
          </div>
          <div style={{ height: "500px" }}>
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tv1&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=020818&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1&hidevolume=0&primaryColor=0ea5e9"
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            />
          </div>
        </div>

        {/* Stock table */}
        <div className="card-glass rounded-3xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(14,165,233,0.12)" }}>
            <h3 className="text-white font-bold">Pergerakan Saham Hari Ini</h3>
            <span className="text-xs text-slate-500">Auto-refresh 30s</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(14,165,233,0.08)" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saham</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">%</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {displayStocks.map((s: any, i: number) => {
                  const pos = (s.changePercent || s.change) >= 0;
                  const sym = (s.symbol || "").replace(".JK", "");
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(14,165,233,0.05)" }}
                      className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{sym}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[160px]">{s.name}</div>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white text-sm">
                        {typeof s.price === "number" ? s.price.toLocaleString("id-ID") : s.price}
                      </td>
                      <td className={`px-5 py-4 text-right font-bold text-sm ${pos ? "text-green-400" : "text-red-400"}`}>
                        <span className="px-2 py-1 rounded-lg text-xs" style={{ background: pos ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                          {pos ? "+" : ""}{typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-400 text-sm hidden sm:table-cell">{s.volume}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── NEWS ─────────────── */
function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => {
      setNews(d.news || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    const iv = setInterval(() => {
      fetch("/api/news").then(r => r.json()).then(d => setNews(d.news || [])).catch(() => {});
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="news" className="py-20 px-5" style={{ background: "linear-gradient(180deg,#020818 0%,#050f2c 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Berita Terkini</p>
            <h2 className="text-4xl font-black text-white">
              📰 Pasar <span className="gradient-text">Saham</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-green-400 text-xs font-semibold">Live</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl h-44 shimmer" style={{ background: "rgba(10,26,62,0.4)" }}/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelected(item)}
                className="card-glass rounded-2xl p-5 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
              >
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{ background: "rgba(14,165,233,0.15)", color: "#38bdf8" }}
                >
                  {item.category}
                </span>
                <h3 className="text-white font-semibold text-sm leading-snug mb-3 group-hover:text-blue-300 transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid rgba(14,165,233,0.08)" }}>
                  <span className="text-xs text-slate-500">{item.source}</span>
                  <span className="text-xs text-slate-600">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl p-7 shadow-2xl"
              style={{ background: "rgba(5,15,44,0.99)", border: "1px solid rgba(14,165,233,0.3)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: "rgba(14,165,233,0.15)", color: "#38bdf8" }}>{selected.category}</span>
                <span className="text-xs text-slate-500">{selected.source} · {selected.time}</span>
              </div>
              <h3 className="text-white font-black text-lg mb-4 leading-snug">{selected.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{selected.summary}</p>
              <div className="flex gap-3">
                <a href={selected.url} target="_blank" className="btn-primary text-sm px-5 py-2.5 rounded-xl">Baca Selengkapnya ↗</a>
                <button onClick={() => setSelected(null)} className="text-sm px-4 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── SIGNALS ─────────────── */
function SignalsSection() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/signals").then(r => r.json()).then(d => setSignals(d.signals || []));
  }, []);

  const actionStyle: any = {
    BUY: { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
    SELL: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
    HOLD: { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.3)" },
    ANTRI: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.3)" },
  };

  return (
    <section id="signals" className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Premium Signals</p>
          <h2 className="text-4xl font-black text-white mb-3">
            ⚡ Sinyal <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-slate-400">Entry, antri, TP, SL — dari analis berpengalaman kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(signals.length > 0 ? signals : [
            { id:"1", saham:"Bank Central Asia", kode:"BBCA", action:"BUY", entry:"9750–9800", tp:"10.200 | 10.500", sl:"9.500", notes:"Breakout resistance kuat, volume tinggi.", package:["gold","pro","platinum","elite"] },
            { id:"2", saham:"Aneka Tambang", kode:"ANTM", action:"ANTRI", entry:"1580–1620", tp:"1750 | 1850", sl:"1520", notes:"Support emas global kuat.", package:["silver","gold","pro","platinum","elite"] },
            { id:"3", saham:"GoTo Group", kode:"GOTO", action:"BUY", entry:"80–85", tp:"100 | 115", sl:"72", notes:"First profitable quarter.", package:["pro","platinum","elite"] },
          ]).slice(0, 6).map((sig: any) => {
            const style = actionStyle[sig.action] || actionStyle.HOLD;
            return (
              <div key={sig.id} className="card-glass rounded-3xl p-5 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">{sig.kode}</p>
                    <p className="text-white font-bold">{sig.saham}</p>
                  </div>
                  <span
                    className="text-xs font-black px-3 py-1.5 rounded-xl"
                    style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
                  >
                    {sig.action}
                  </span>
                </div>

                <div className="space-y-2.5 mb-4">
                  {[["Entry", sig.entry, "text-white"], ["Target", sig.tp, "text-green-400"], ["Stop Loss", sig.sl, "text-red-400"]].map(([lbl, val, cls]) => (
                    <div key={lbl} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{lbl}</span>
                      <span className={`font-mono font-semibold text-sm ${cls}`}>{val}</span>
                    </div>
                  ))}
                </div>

                {sig.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-3" style={{ borderTop: "1px solid rgba(14,165,233,0.1)" }}>
                    {sig.notes}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(sig.package || []).map((p: string) => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "rgba(14,165,233,0.1)", color: "#7dd3fc", border: "1px solid rgba(14,165,233,0.2)" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <div
            className="inline-block rounded-2xl px-7 py-4 text-sm"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            <span className="text-yellow-300">🔒 Sinyal lengkap hanya untuk member VIP — </span>
            <a href="https://wa.me/6282218723401" target="_blank" className="text-yellow-400 font-bold underline">Bergabung sekarang →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── MODULES ─────────────── */
function ModulesSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="modules" className="py-20 px-5" style={{ background: "linear-gradient(180deg,#020818 0%,#050f2c 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Kurikulum Lengkap</p>
          <h2 className="text-4xl font-black text-white mb-3">
            📚 Modul <span className="gradient-text">VIP</span>
          </h2>
          <p className="text-slate-400">Dari dasar hingga advanced — kuasai investasi saham Indonesia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vipModules.map((mod) => (
            <div
              key={mod.id}
              className="card-glass rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setActive(active === mod.id ? null : mod.id)}
            >
              <div className="text-4xl mb-4">{mod.icon}</div>
              <h3 className="text-white font-black text-lg mb-2">{mod.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{mod.description}</p>

              {active === mod.id && (
                <div className="space-y-4 pt-4" style={{ borderTop: "1px solid rgba(14,165,233,0.15)" }}>
                  {mod.content.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5"
                        style={{ background: "rgba(14,165,233,0.15)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.3)" }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{c.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-blue-400 text-xs mt-4 font-semibold">
                {active === mod.id ? "▲ Sembunyikan" : "▼ Lihat konten"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── AI AGENT ─────────────── */
function AISection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(6,182,212,0.08) 0%,rgba(10,26,62,0.9) 50%,rgba(14,165,233,0.08) 100%)",
            border: "1px solid rgba(34,211,238,0.25)",
          }}
        >
          {/* glow */}
          <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(ellipse at center,rgba(14,165,233,0.05) 0%,transparent 70%)" }}/>
          <div className="relative z-10">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              AI Agent <span className="gradient-text">Eksklusif</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Paket <strong className="text-cyan-400">Pro, Platinum, dan Elite</strong> dilengkapi AI Agent canggih — analisis saham, pantau portofolio, dan rekomendasi real-time kapan saja.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[["🔍","Analisis Otomatis","Analisis saham real-time berbasis AI"],["📊","Portofolio Tracker","Pantau & evaluasi portofolio otomatis"],["⚡","Alert Sinyal","Notifikasi entry/exit personal"]].map(([icon,t,d]) => (
                <div
                  key={t}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.15)" }}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-white font-bold text-sm mb-1">{t}</div>
                  <div className="text-slate-400 text-xs">{d}</div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/6282218723401?text=Halo,%20saya%20tertarik%20paket%20dengan%20AI%20Agent!"
              target="_blank"
              className="btn-gold px-10 py-4 rounded-2xl font-black text-base"
            >
              🤖 Dapatkan AI Agent Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── PRICING ─────────────── */
function PricingSection() {
  const basicPkg = packages[0];

  return (
    <section id="pricing" className="py-20 px-5" style={{ background: "linear-gradient(180deg,#020818 0%,#050f2c 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Harga Terjangkau</p>
          <h2 className="text-4xl font-black text-white mb-3">
            💎 Paket <span className="gradient-text">VIP</span>
          </h2>
          <p className="text-slate-400">Mulai dari Rp 100.000/bulan — pilih sesuai kebutuhan Anda</p>
        </div>

        {/* Basic highlight */}
        <div className="max-w-md mx-auto mb-10">
          <div
            className="card-glass rounded-3xl p-7 relative"
            style={{ border: "2px solid rgba(14,165,233,0.45)", boxShadow: "0 0 50px rgba(14,165,233,0.12)" }}
          >
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-black px-5 py-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#0ea5e9,#22d3ee)" }}
            >
              MULAI DARI INI
            </div>

            <div className="text-center mb-5">
              <div className="text-5xl mb-3">🌊</div>
              <h3 className="text-2xl font-black text-white mb-1">{basicPkg.name}</h3>
              <div className="text-4xl font-black text-blue-400">{basicPkg.priceLabel}</div>
              <div className="text-slate-400 text-sm">{basicPkg.period}</div>
            </div>

            <p className="text-slate-300 text-sm text-center mb-5 leading-relaxed">{basicPkg.description}</p>

            <ul className="space-y-3 mb-5">
              {basicPkg.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                    ✓
                  </div>
                  <span className="text-slate-300">{f}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl p-3 mb-5 text-sm text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span className="text-green-300">💬 Grup WA Basic — komunitas aktif harian</span>
            </div>

            <a
              href={`https://wa.me/6282218723401?text=Halo%20min%20saya%20mau%20order%20paket%20Basic%20Rp100.000`}
              target="_blank"
              className="btn-primary w-full block text-center py-3.5 rounded-2xl font-black text-base"
            >
              🚀 Order Paket Basic
            </a>
          </div>
        </div>

        {/* See all CTA */}
        <div className="text-center">
          <div className="inline-block rounded-3xl p-7" style={{ background: "rgba(10,26,62,0.6)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <p className="text-slate-300 text-sm mb-2">Tersedia hingga Paket Elite Rp 1.000.000 dengan AI Agent eksklusif!</p>
            <p className="text-slate-500 text-xs mb-5">Silver · Gold · Pro · Platinum · Elite — masing-masing dengan Grup WA khusus</p>
            <Link href="/paket" className="btn-gold inline-block px-10 py-3.5 rounded-2xl font-black text-base">
              👑 Lihat Semua 6 Paket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── TESTIMONIALS ─────────────── */
function TestimonialsSection() {
  const [tList, setTList] = useState(staticTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", package: "Basic", rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials").then(r => r.json()).then(d => {
      if (d.testimonials?.length > 0) setTList(d.testimonials);
    }).catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.name || !form.text) return;
    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
    setShowForm(false);
  };

  const pkgColors: any = {
    Basic: { bg: "rgba(14,165,233,0.12)", color: "#38bdf8" },
    Silver: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
    Gold: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    Pro: { bg: "rgba(147,51,234,0.12)", color: "#c084fc" },
    Platinum: { bg: "rgba(148,163,184,0.12)", color: "#cbd5e1" },
    Elite: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  };

  return (
    <section id="testimonial" className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Member Berbicara</p>
          <h2 className="text-4xl font-black text-white mb-3">
            ⭐ Testimoni <span className="gradient-text">Member</span>
          </h2>
          <p className="text-slate-400">Apa kata member kami tentang RITEL COMMUNITY.ID</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {tList.map((t: any, i: number) => {
            const pc = pkgColors[t.package] || pkgColors.Basic;
            return (
              <div key={i} className="card-glass rounded-3xl p-6 hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#0ea5e9,#22d3ee)" }}
                  >
                    {t.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: pc.bg, color: pc.color }}>
                      Paket {t.package}
                    </span>
                  </div>
                </div>
                <p className="text-yellow-400 text-sm mb-3">{"★".repeat(t.rating || 5)}</p>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                <p className="text-xs text-slate-600 mt-3">{t.date}</p>
              </div>
            );
          })}
        </div>

        {submitted && (
          <div className="text-center mb-5 text-green-400 text-sm">✓ Testimoni terkirim — sedang dalam review tim kami.</div>
        )}

        {!showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary px-7 py-3 rounded-2xl font-bold text-sm"
            >
              + Bagikan Pengalaman Anda
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto card-glass rounded-3xl p-7">
            <h3 className="text-white font-black text-lg mb-5">Bagikan Pengalaman Anda</h3>
            <div className="space-y-3">
              <input
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-400"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)" }}
              />
              <select
                value={form.package} onChange={e => setForm({ ...form, package: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)" }}
              >
                {["Basic","Silver","Gold","Pro","Platinum","Elite"].map(p => (
                  <option key={p} value={p} style={{ background: "#0a1a3e" }}>{p}</option>
                ))}
              </select>
              <textarea
                value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
                placeholder="Ceritakan pengalaman Anda bersama Ritel Community..."
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none resize-none"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)" }}
              />
              <div className="flex gap-3">
                <button onClick={submit} className="btn-gold flex-1 py-3 rounded-xl font-black text-sm">Kirim</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm text-slate-400 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  return (
    <footer className="py-14 px-5" style={{ background: "#020818", borderTop: "1px solid rgba(14,165,233,0.1)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg,#0ea5e9,#22d3ee)" }}>RC</div>
              <div className="leading-tight">
                <span className="text-white font-black text-base">RITEL COMMUNITY</span>
                <span className="text-blue-400 font-black text-base">.ID</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Platform investasi saham premium Indonesia dengan sinyal realtime, modul edukasi lengkap, dan komunitas aktif 24/7.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {[["#news","Berita Pasar"],["#signals","Sinyal Saham"],["#modules","Modul VIP"],["#pricing","Paket"],["#testimonial","Testimoni"],["/paket","Semua Paket"]].map(([h,l]) => (
                <li key={h}><a href={h} className="text-slate-500 hover:text-blue-400 transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Kontak</h4>
            <div className="space-y-3">
              <a href="https://wa.me/6282218723401" target="_blank" className="flex items-center gap-3 text-slate-500 hover:text-green-400 transition-colors text-sm">
                <span className="text-xl">📱</span> 082218723401 (WhatsApp)
              </a>
              <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="flex items-center gap-3 text-slate-500 hover:text-pink-400 transition-colors text-sm">
                <span className="text-xl">📸</span> @elthoriqqqq_
              </a>
            </div>
            <div className="mt-5 text-xs text-slate-600">
              Development by<br/>
              <span className="text-blue-400 font-bold">Thirafi Thariq Al Idris</span>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-slate-600 pt-6" style={{ borderTop: "1px solid rgba(14,165,233,0.08)" }}>
          © 2025 RITEL COMMUNITY.ID · All rights reserved<br/>
          <span className="opacity-60">Investasi mengandung risiko. Past performance tidak menjamin hasil di masa depan.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── LIVE CHAT ─────────────── */
function LiveChat() {
  return (
    <a
      href="https://wa.me/6282218723401?text=Halo%20Ritel%20Community!"
      target="_blank"
      title="Live Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        width: "58px", height: "58px",
        background: "linear-gradient(135deg,#22c55e,#16a34a)",
        borderRadius: "50%",
        boxShadow: "0 4px 30px rgba(34,197,94,0.5)",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

/* ─────────────── MAIN ─────────────── */
export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#020818" }}>
      <Navbar />
      <Hero />
      <IHSGChart />
      <NewsSection />
      <SignalsSection />
      <ModulesSection />
      <AISection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
      <LiveChat />
    </main>
  );
}
