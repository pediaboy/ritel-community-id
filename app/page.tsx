"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ===== TICKER =====
function StockTicker() {
  const [stocks, setStocks] = useState([
    { kode: "IHSG", price: "7.333", change: "+0.66%" },
    { kode: "BBCA", price: "9.875", change: "+1.28%" },
    { kode: "BBRI", price: "4.680", change: "-0.64%" },
    { kode: "TLKM", price: "3.290", change: "+1.54%" },
    { kode: "ASII", price: "5.200", change: "-1.42%" },
    { kode: "GOTO", price: "86", change: "+4.88%" },
    { kode: "ANTM", price: "1.640", change: "+2.18%" },
    { kode: "BMRI", price: "6.175", change: "+0.90%" },
    { kode: "ADRO", price: "3.580", change: "-0.55%" },
    { kode: "ICBP", price: "10.250", change: "-1.44%" },
  ]);

  useEffect(() => {
    fetch("/api/stocks").then(r => r.json()).then(d => {
      const list: any[] = [];
      if (d.ihsg) list.push({
        kode: "IHSG",
        price: d.ihsg.value?.toLocaleString("id-ID", { minimumFractionDigits: 0 }),
        change: (d.ihsg.changePercent >= 0 ? "+" : "") + d.ihsg.changePercent?.toFixed(2) + "%",
      });
      if (d.stocks) {
        d.stocks.slice(0, 9).forEach((s: any) => list.push({
          kode: s.symbol?.replace(".JK", "") || s.kode,
          price: s.price?.toLocaleString("id-ID"),
          change: (s.changePercent >= 0 ? "+" : "") + s.changePercent?.toFixed(2) + "%",
        }));
      }
      if (list.length > 0) setStocks(list);
    }).catch(() => {});
  }, []);

  const doubled = [...stocks, ...stocks];

  return (
    <div className="bg-black border-b border-white/10 overflow-hidden" style={{ height: "44px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ display: "flex", animation: "tickerMove 32s linear infinite", whiteSpace: "nowrap", alignItems: "center" }}>
          {doubled.map((s, i) => {
            const pos = s.change.startsWith("+");
            return (
              <span key={i} className="inline-flex items-center gap-2 px-5" style={{ height: "44px" }}>
                <span className={`text-xs font-black tracking-wide ${s.kode === "IHSG" ? "text-blue-400" : "text-white"}`}>{s.kode}</span>
                <span className="text-sm font-bold text-slate-300">{s.price}</span>
                <span className={`text-sm font-bold ${pos ? "text-green-400" : "text-red-400"}`}>{s.change}</span>
                <span className="text-white/10 ml-2 text-lg">|</span>
              </span>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes tickerMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

// ===== NAVBAR =====
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/5" : "bg-black/70 backdrop-blur-sm"}`}>
      {/* Ticker - show on all screens */}
      <div>
        <StockTicker />
      </div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">RC</div>
          <div>
            <span className="text-white font-black text-sm">RITEL</span>
            <span className="text-blue-400 font-black text-sm"> COMMUNITY</span>
            <span className="text-slate-500 font-bold text-sm">.ID</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#market" className="text-slate-400 hover:text-white transition-colors">Market</a>
          <a href="#news" className="text-slate-400 hover:text-white transition-colors">Berita</a>
          <a href="#signals" className="text-slate-400 hover:text-white transition-colors">Sinyal</a>
          <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Paket</a>
          <a href="#testimonial" className="text-slate-400 hover:text-white transition-colors">Testimoni</a>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-white border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all">
            🔑 Masuk
          </Link>
          <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20bergabung!" target="_blank" className="btn-green text-xs px-4 py-2 rounded-lg">
            💬 WA Admin
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-4 py-3 space-y-1">
          {[["#market","📈 Market"],["#news","📰 Berita"],["#signals","⚡ Sinyal"],["#pricing","💎 Paket"],["#testimonial","⭐ Testimoni"]].map(([h,l]) => (
            <a key={h} href={h} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">{l}</a>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-blue-400 hover:bg-white/5 rounded-lg">🔑 Login VIP</Link>
        </div>
      )}
    </nav>
  );
}

// ===== HERO =====
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: "80px" }}>
      {/* BG */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"/>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"/>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs text-slate-400">
          🔥 Platform Analisa Saham #1 Indonesia
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
          Investasi Cerdas,<br/>
          <span className="gradient-text">Profit Konsisten</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Bandarmologi, Fundamental, Arahan Entry, Tape Reading, Bagger Pick, dan AI Agent analisa saham eksklusif.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
          <div className="card-glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-0.5">👥</div>
            <div className="text-xl font-black text-white">12.400+</div>
            <div className="text-xs text-slate-500">Member Aktif</div>
          </div>
          <div className="card-glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-0.5">🎯</div>
            <div className="text-xl font-black text-blue-400">78%</div>
            <div className="text-xs text-slate-500">Win Rate Signal</div>
          </div>
          <div className="card-glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-0.5">🚀</div>
            <div className="text-xl font-black text-green-400">34 Stock</div>
            <div className="text-xs text-slate-500">Bagger Picks</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#pricing" className="btn-primary text-sm px-8 py-3 rounded-xl">Mulai Sekarang</a>
          <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" className="btn-green text-sm px-8 py-3 rounded-xl">💬 WA Admin</a>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}

// ===== IHSG MARKET =====
function MarketSection() {
  const [ihsg, setIhsg] = useState({ value: 7333.73, change: 48.31, changePercent: 0.66 });
  const [stocks, setStocks] = useState<any[]>([
    { symbol:"BBCA", name:"Bank Central Asia", price:9875, change:125, changePercent:1.28 },
    { symbol:"BBRI", name:"Bank Rakyat Indonesia", price:4680, change:-30, changePercent:-0.64 },
    { symbol:"TLKM", name:"Telkom Indonesia", price:3290, change:50, changePercent:1.54 },
    { symbol:"ASII", name:"Astra International", price:5200, change:-75, changePercent:-1.42 },
    { symbol:"GOTO", name:"GoTo Group", price:86, change:4, changePercent:4.88 },
    { symbol:"ANTM", name:"Aneka Tambang", price:1640, change:35, changePercent:2.18 },
  ]);

  useEffect(() => {
    const load = () => {
      fetch("/api/stocks").then(r => r.json()).then(d => {
        if (d.ihsg) setIhsg(d.ihsg);
        if (d.stocks) setStocks(d.stocks.slice(0, 6));
      }).catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="market" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">📈 IHSG <span className="gradient-text">Live</span></h2>
          <p className="text-slate-500 text-sm">Data diperbarui setiap 30 detik via Yahoo Finance</p>
        </div>

        {/* IHSG card */}
        <div className="card-glass rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-slate-500 text-xs mb-1">IDX Composite · Realtime</div>
            <div className="text-4xl font-black text-white">{ihsg.value?.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</div>
            <div className={`text-sm font-bold mt-1 ${ihsg.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {ihsg.change >= 0 ? "▲" : "▼"} {Math.abs(ihsg.change).toFixed(2)} ({ihsg.changePercent >= 0 ? "+" : ""}{ihsg.changePercent?.toFixed(2)}%)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            <span className="text-green-400 text-xs font-bold">LIVE</span>
          </div>
        </div>

        {/* IHSG Chart */}
        <div className="card-glass rounded-2xl p-4 mb-6 overflow-hidden">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_ihsg&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=0&toolbarbg=0D0D0D&studies=[]&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1&showpopupbutton=1"
            style={{ width: "100%", height: "320px", border: "none" }}
            title="IHSG Chart"
          />
        </div>

        {/* Top stocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stocks.map((s, i) => {
            const pos = (s.changePercent ?? s.change) >= 0;
            return (
              <div key={i} className="card rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-white text-sm">{s.symbol?.replace(".JK","")}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                    {pos ? "+" : ""}{s.changePercent?.toFixed(2)}%
                  </span>
                </div>
                <div className="text-lg font-black text-white">{s.price?.toLocaleString("id-ID")}</div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">{s.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== NEWS =====
function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => {
      setNews((d.news || []).slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const mock = [
    { title:"IHSG Menguat 0.66% Ditopang Sektor Perbankan", source:"CNBC Indonesia", time:"1 jam lalu", category:"IHSG", url:"#" },
    { title:"BBCA Cetak Laba Rp 14 Triliun Kuartal Pertama", source:"Bisnis.com", time:"2 jam lalu", category:"Saham", url:"#" },
    { title:"Asing Net Buy Rp 1.2 Triliun, IHSG Bullish", source:"Kontan", time:"3 jam lalu", category:"Asing", url:"#" },
    { title:"GOTO Profitabel Pertama Kali, Saham Melonjak 5%", source:"Tempo", time:"4 jam lalu", category:"Teknologi", url:"#" },
    { title:"BI Pertahankan Suku Bunga, Pasar Positif", source:"Detik Finance", time:"5 jam lalu", category:"Makro", url:"#" },
    { title:"Saham Tambang Menguat Ikuti Harga Nikel Global", source:"IDX Channel", time:"6 jam lalu", category:"Sektoral", url:"#" },
  ];

  const displayNews = news.length > 0 ? news : mock;

  return (
    <section id="news" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">📰 Berita Pasar <span className="gradient-text">IDX</span></h2>
          <p className="text-slate-500 text-sm">Berita saham Indonesia terkini, khusus IDX</p>
        </div>

        {loading ? (
          <div className="text-slate-500 text-center py-12">Memuat berita...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayNews.map((n, i) => (
              <a key={i} href={n.url || "#"} target="_blank" rel="noopener noreferrer" className="card rounded-xl p-5 block group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">{n.category || "Pasar"}</span>
                  <span className="text-xs text-slate-600">{n.time || n.source}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2">{n.title}</h3>
                {n.summary && <p className="text-xs text-slate-500 line-clamp-2">{n.summary}</p>}
                <div className="mt-3 text-xs text-slate-600">{n.source}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ===== SIGNALS =====
function SignalsSection() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/signals").then(r => r.json()).then(d => setSignals(d.signals || [])).catch(() => {});
  }, []);

  const mock = [
    { kode:"BBCA", saham:"Bank Central Asia", action:"BUY", entry:"9.750–9.800", tp:"10.200 | 10.500", sl:"9.500", notes:"Breakout resistance, volume tinggi.", package:["gold","pro","platinum","elite"] },
    { kode:"ANTM", saham:"Aneka Tambang", action:"ANTRI", entry:"1.580–1.620", tp:"1.750 | 1.850", sl:"1.520", notes:"Support emas global solid.", package:["silver","gold","pro"] },
    { kode:"GOTO", saham:"GoTo Group", action:"BUY", entry:"80–85", tp:"100 | 115", sl:"72", notes:"First profitable quarter.", package:["pro","platinum","elite"] },
  ];

  const display = signals.length > 0 ? signals : mock;
  const actionColor: any = { BUY:"text-green-400 bg-green-400/10", SELL:"text-red-400 bg-red-400/10", HOLD:"text-yellow-400 bg-yellow-400/10", ANTRI:"text-blue-400 bg-blue-400/10" };

  return (
    <section id="signals" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">⚡ Sinyal <span className="gradient-text">Premium</span></h2>
          <p className="text-slate-500 text-sm">Sinyal entry, TP, SL dari analis berpengalaman</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {display.map((s, i) => (
            <div key={i} className="card rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-black text-white text-lg">{s.kode}</div>
                  <div className="text-xs text-slate-500">{s.saham}</div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action] || "text-white bg-white/10"}`}>{s.action}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Entry</span>
                  <span className="text-white font-medium">{s.entry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target</span>
                  <span className="text-green-400 font-medium">{s.tp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stop Loss</span>
                  <span className="text-red-400 font-medium">{s.sl}</span>
                </div>
              </div>
              {s.notes && <p className="mt-3 text-xs text-slate-400 border-t border-white/5 pt-3">{s.notes}</p>}
              <div className="mt-3 flex flex-wrap gap-1">
                {(s.package || []).map((p: string) => (
                  <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500 capitalize">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card-glass rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-3">🔒 Sinyal premium lengkap (entry, exit, analisis mendalam) tersedia untuk member VIP Gold ke atas.</p>
          <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20daftar%20VIP!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Daftar VIP</a>
        </div>
      </div>
    </section>
  );
}

// ===== PRICING =====
function PricingSection() {
  const packages = [
    { name:"Basic", price:"100.000", color:"text-slate-300", features:["Sinyal saham harian","Berita pasar realtime","Chart IHSG","Modul dasar investasi","Grup WA Basic"] },
    { name:"Silver", price:"250.000", color:"text-slate-300", features:["Semua fitur Basic","Analisis fundamental","Screening saham bagger","Risk management","Grup WA Silver"] },
    { name:"Gold", price:"500.000", color:"text-yellow-400", features:["Semua fitur Silver","Sinyal entry, TP, SL premium","Analisis teknikal mendalam","Psikologi trading","Multi-bagger picks","Grup WA Gold Eksklusif"], popular:true },
    { name:"Pro", price:"750.000", color:"text-blue-400", features:["Semua fitur Gold","AI Agent eksklusif","Analisis realtime","Portfolio tracker","Alert otomatis","Konsultasi langsung"] },
    { name:"Platinum", price:"1.200.000", color:"text-purple-400", features:["Semua fitur Pro","Live trading session","Bandarmologi premium","Tape reading advanced","1-on-1 mentor","Priority support"] },
    { name:"Elite", price:"2.000.000", color:"text-orange-400", features:["Semua fitur Platinum","Akses seumur hidup","VIP room eksklusif","Direct line ke analis","Custom portofolio plan","Event offline"] },
  ];

  return (
    <section id="pricing" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-1">💎 Pilihan <span className="gradient-text">Paket VIP</span></h2>
          <p className="text-slate-500 text-sm">Mulai dari Rp 100.000/bulan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <div key={i} className={`card rounded-2xl p-6 relative ${pkg.popular ? "border-yellow-500/30 ring-1 ring-yellow-500/20" : ""}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full">⭐ TERLARIS</div>
              )}
              <div className={`text-lg font-black mb-1 ${pkg.color}`}>{pkg.name}</div>
              <div className="text-white text-2xl font-black mb-0.5">Rp {pkg.price}</div>
              <div className="text-slate-500 text-xs mb-5">/bulan</div>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((f, j) => (
                  <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/6282218723401?text=Halo%20min%20mau%20order%20paket%20${pkg.name}%20Rp${pkg.price}`} target="_blank" className={`w-full py-2.5 rounded-xl text-sm font-bold text-center block transition-all ${pkg.popular ? "btn-gold" : "btn-primary"}`}>
                Order {pkg.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== AI AGENT =====
function AIAgentSection() {
  const [msgs, setMsgs] = useState([
    { from:"user", text:"Analisis BBCA saat ini?" },
    { from:"ai", text:"BBCA dalam tren bullish. Support kuat di 9.600–9.700. Breakout 10.000 dengan volume → target 10.500. SL bawah 9.500." },
    { from:"user", text:"Prospek IHSG bulan ini?" },
    { from:"ai", text:"IHSG konsolidasi di range 7.100–7.400. Sentiment positif dari data inflasi. Watch level 7.500 untuk konfirmasi bullish continuation." },
  ]);
  const [input, setInput] = useState("");

  return (
    <section id="ai" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 mb-4">✨ New Feature</div>
          <h2 className="text-2xl font-black text-white mb-2">🤖 AI Agent <span className="gradient-text">Eksklusif</span></h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Paket Pro, Platinum, dan Elite hadir dengan AI Agent canggih — analisis saham realtime, pantau portofolio otomatis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3 text-sm">
            {[
              ["🔍","Analisis fundamental & teknikal otomatis berbasis data terkini"],
              ["📊","Pantau dan evaluasi portofolio Anda secara real-time"],
              ["⚡","Alert sinyal entry/exit sesuai profil risiko Anda"],
              ["💬","Chat 24/7 dengan AI tentang kondisi pasar"],
            ].map(([icon, text], i) => (
              <div key={i} className="flex items-start gap-3 card rounded-xl p-4">
                <span className="text-xl">{icon}</span>
                <span className="text-slate-300">{text}</span>
              </div>
            ))}
            <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20paket%20Pro%20dengan%20AI%20Agent!" target="_blank" className="btn-primary text-sm px-6 py-3 rounded-xl inline-block w-full text-center">🤖 Dapatkan AI Agent</a>
          </div>

          <div className="card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
              <span className="text-sm font-bold text-white">AI Agent RC</span>
              <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-xs text-green-400">Online</span>
            </div>
            <div className="space-y-3 h-52 overflow-y-auto mb-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.from === "user" ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300"}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Tanya tentang saham..." className="input-dark flex-1 text-xs py-2"/>
              <button onClick={() => { if(input.trim()){ setMsgs(p => [...p, {from:"user",text:input}, {from:"ai",text:"Fitur ini tersedia untuk member Pro ke atas. Bergabunglah sekarang!"}]); setInput(""); } }} className="btn-primary text-xs px-3 py-2 rounded-lg">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== TESTIMONIALS =====
function TestimoniSection() {
  const [testis, setTestis] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials").then(r => r.json()).then(d => {
      const approved = (d.testimonials || []).filter((t: any) => t.isApproved);
      if (approved.length > 0) setTestis(approved);
    }).catch(() => {});
  }, []);

  const mock = [
    { name:"Budi Santoso", package:"Gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%. Komunitas juga aktif dan supportif.", date:"Mei 2025" },
    { name:"Sari Dewi", package:"Platinum", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja. Mentor juga responsif dan helpful banget.", date:"April 2025" },
    { name:"Rizky Pratama", package:"Silver", rating:5, text:"Modul fundamental-nya komprehensif. Sekarang udah bisa analisis sendiri tanpa bingung.", date:"Maret 2025" },
    { name:"Diana Putri", package:"Elite", rating:5, text:"Worth every penny! Sinyal elite + mentor langsung bikin return gua konsisten tiap bulan.", date:"Februari 2025" },
  ];

  const display = testis.length > 0 ? testis : mock;

  return (
    <section id="testimonial" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-1">⭐ Kata <span className="gradient-text">Member Kami</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {display.slice(0,4).map((t, i) => (
            <div key={i} className="card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-sm">{t.name?.charAt(0)}</div>
                <div>
                  <div className="text-white text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-blue-400 capitalize">Paket {t.package}</div>
                </div>
              </div>
              <div className="text-yellow-400 text-xs mb-2">{"★".repeat(t.rating || 5)}</div>
              <p className="text-slate-400 text-xs leading-relaxed">"{t.text}"</p>
              <div className="text-slate-600 text-xs mt-3">{t.date}</div>
            </div>
          ))}
        </div>
        {/* Add testimoni */}
        <div className="text-center">
          <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20kirim%20testimoni!" target="_blank" className="text-xs text-slate-500 hover:text-blue-400 transition-colors border border-white/10 rounded-lg px-4 py-2 inline-block">+ Tambah Testimoni Anda</a>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
              <span className="text-white font-black text-sm">RITEL COMMUNITY.ID</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Platform investasi saham premium Indonesia. Sinyal realtime, edukasi, dan AI Agent.</p>
          </div>
          <div>
            <div className="text-white font-bold text-sm mb-3">Platform</div>
            <div className="space-y-2">
              {[["#market","Market Live"],["#news","Berita Pasar"],["#signals","Sinyal Saham"],["#pricing","Paket VIP"],["#testimonial","Testimoni"]].map(([h,l]) => (
                <a key={h} href={h} className="block text-xs text-slate-500 hover:text-blue-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-sm mb-3">Kontak</div>
            <div className="space-y-2">
              <a href="https://wa.me/6282218723401" target="_blank" className="block text-xs text-slate-500 hover:text-green-400 transition-colors">📱 082218723401</a>
              <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="block text-xs text-slate-500 hover:text-pink-400 transition-colors">📸 @elthoriqqqq_</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs text-slate-600">© 2025 RITEL COMMUNITY.ID — Investasi mengandung risiko. Past performance ≠ future results.</p>
          <p className="text-xs text-slate-600">By Thirafi Thariq Al Idris</p>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN PAGE =====
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MarketSection />
      <NewsSection />
      <SignalsSection />
      <AIAgentSection />
      <PricingSection />
      <TestimoniSection />
      <Footer />
    </main>
  );
}

