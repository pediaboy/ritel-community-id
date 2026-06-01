"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { packages, testimonials as staticTestimonials, vipModules } from "@/lib/data";

// ===== NAVBAR =====
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dotMenu, setDotMenu] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const dotItems = [
    { label: "Paket Basic - Rp 100.000", href: "#pricing" },
    { label: "Paket Silver - Rp 250.000", href: "#pricing" },
    { label: "Paket Gold - Rp 500.000", href: "#pricing" },
    { label: "Lihat Semua Paket", href: "/paket" },
    { label: "Berita Pasar", href: "#news" },
    { label: "IHSG Realtime", href: "#chart" },
    { label: "Testimonial", href: "#testimonial" },
    { label: "Hubungi Kami", href: "https://wa.me/6282218723401" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#020818]/95 backdrop-blur-md shadow-lg shadow-blue-900/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">RC</div>
            <div>
              <div className="text-white font-bold text-sm leading-none">RITEL COMMUNITY</div>
              <div className="text-blue-400 text-xs">.ID</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#news" className="text-slate-300 hover:text-blue-400 transition-colors">Berita</a>
            <a href="#signals" className="text-slate-300 hover:text-blue-400 transition-colors">Sinyal</a>
            <a href="#modules" className="text-slate-300 hover:text-blue-400 transition-colors">Modul VIP</a>
            <a href="#pricing" className="text-slate-300 hover:text-blue-400 transition-colors">Paket</a>
            <a href="#testimonial" className="text-slate-300 hover:text-blue-400 transition-colors">Testimoni</a>
            <a href="https://wa.me/6282218723401" target="_blank" className="btn-gold text-xs px-4 py-2 rounded-lg">Order Sekarang</a>
          </div>

          {/* Right: dots + hamburger */}
          <div className="flex items-center gap-3">
            {/* 3 dots */}
            <div className="relative">
              <button onClick={() => setDotMenu(!dotMenu)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
              {dotMenu && (
                <div className="absolute right-0 top-10 w-56 bg-[#0a1a3e] border border-blue-500/30 rounded-xl shadow-xl overflow-hidden z-50">
                  {dotItems.map((item, i) => (
                    <a key={i} href={item.href} onClick={() => setDotMenu(false)}
                      className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-blue-500/20 transition-colors border-b border-blue-500/10 last:border-0">
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400 hover:text-white p-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0a1a3e] border border-blue-500/20 rounded-xl mb-4 overflow-hidden">
            {[["#news","Berita Pasar"],["#signals","Sinyal Saham"],["#modules","Modul VIP"],["#pricing","Paket"],["#testimonial","Testimoni"]].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-5 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 border-b border-blue-500/10 text-sm">{label}</a>
            ))}
            <a href="https://wa.me/6282218723401" target="_blank" className="block px-5 py-3 text-yellow-400 font-semibold text-sm">📱 Order via WhatsApp</a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ===== HERO =====
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020818] via-[#050f2c] to-[#020818]"/>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl"/>
        {/* Grid */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.3) 1px,transparent 1px)",backgroundSize:"50px 50px"}}/>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8 text-sm text-blue-300">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
          <span>Platform Investasi Saham #1 Indonesia</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          RITEL{" "}
          <span className="gradient-text">COMMUNITY</span>
          <span className="text-blue-400">.ID</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
          Komunitas saham premium dengan sinyal <strong className="text-blue-400">realtime</strong>, analisis mendalam, dan AI Agent eksklusif untuk portofolio Anda.
        </p>

        <p className="text-sm text-slate-400 mb-10">
          Dikembangkan oleh <span className="text-blue-400 font-semibold">Thirafi Thariq Al Idris</span> · Instagram{" "}
          <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="text-blue-400 hover:underline">@elthoriqqqq_</a>
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {[["2,500+","Member Aktif"],["95%","Akurasi Sinyal"],["6","Paket VIP"],["24/7","Support"]].map(([val,lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-2xl font-black text-blue-400">{val}</div>
              <div className="text-xs text-slate-400">{lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/6282218723401?text=Halo%20Ritel%20Community,%20saya%20ingin%20bergabung!" target="_blank" className="btn-gold text-sm px-8 py-3 rounded-xl inline-block">
            🚀 Mulai Sekarang
          </a>
          <a href="#pricing" className="btn-primary text-sm px-8 py-3 rounded-xl inline-block">
            Lihat Paket
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}

// ===== IHSG CHART =====
function IHSGChart() {
  const [ihsg, setIhsg] = useState({ value: 7285.4, change: 58.3, changePercent: 0.81 });
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stocks").then(r => r.json()).then(d => {
      if(d.ihsg) setIhsg(d.ihsg);
      if(d.stocks) setStocks(d.stocks.slice(0,8));
    }).catch(()=>{});
    const iv = setInterval(() => {
      fetch("/api/stocks").then(r=>r.json()).then(d=>{
        if(d.ihsg) setIhsg(d.ihsg);
        if(d.stocks) setStocks(d.stocks.slice(0,8));
      }).catch(()=>{});
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const isPositive = ihsg.change >= 0;

  return (
    <section id="chart" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">📈 IHSG <span className="gradient-text">Realtime</span></h2>
          <p className="text-slate-400 text-sm">Data diperbarui setiap 30 detik</p>
        </div>

        {/* IHSG Summary */}
        <div className="card-glass rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-slate-400 text-sm mb-1">Indeks Harga Saham Gabungan</div>
            <div className="text-4xl font-black text-white">{ihsg.value?.toLocaleString("id-ID", {minimumFractionDigits:2})}</div>
            <div className={`text-lg font-bold mt-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{ihsg.change?.toFixed(2)} ({isPositive ? "+" : ""}{ihsg.changePercent?.toFixed(2)}%)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* TradingView Widget */}
        <div className="card-glass rounded-2xl overflow-hidden mb-8" style={{height:"480px"}}>
          <div className="p-4 border-b border-blue-500/20">
            <span className="text-sm text-slate-400">Chart IHSG (IDX) — TradingView</span>
          </div>
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=020818&studies=[]&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1&hidevolume=0&scalemode=Normal&chartstyle=1&colorscheme=dark&primaryColor=0ea5e9&secondaryColor=22d3ee&gridColor=0a1a3e"
            style={{width:"100%",height:"420px",border:"none"}}
            allowTransparency
            allowFullScreen
          />
        </div>

        {/* Stock Table */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-blue-500/20 flex items-center justify-between">
            <h3 className="text-white font-bold">Pergerakan Saham Hari Ini</h3>
            <span className="text-xs text-slate-400">Auto-refresh 30s</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-blue-500/10">
                  <th className="text-left px-4 py-3">Saham</th>
                  <th className="text-right px-4 py-3">Harga</th>
                  <th className="text-right px-4 py-3">Perubahan</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {(stocks.length > 0 ? stocks : [
                  {symbol:"BBCA.JK",name:"Bank Central Asia",price:9875,change:125,changePercent:1.28,volume:"12.5M"},
                  {symbol:"BBRI.JK",name:"Bank Rakyat Indonesia",price:4680,change:-30,changePercent:-0.64,volume:"45.2M"},
                  {symbol:"TLKM.JK",name:"Telkom Indonesia",price:3290,change:50,changePercent:1.54,volume:"22.1M"},
                  {symbol:"ASII.JK",name:"Astra International",price:5200,change:-75,changePercent:-1.42,volume:"18.7M"},
                  {symbol:"GOTO.JK",name:"GoTo Group",price:86,change:4,changePercent:4.88,volume:"892M"},
                  {symbol:"ANTM.JK",name:"Aneka Tambang",price:1640,change:35,changePercent:2.18,volume:"33.4M"},
                ]).map((s:any) => {
                  const pos = s.change >= 0;
                  return (
                    <tr key={s.symbol} className="border-b border-blue-500/5 hover:bg-blue-500/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white text-sm">{s.symbol?.replace(".JK","")}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">{s.name}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-white font-mono font-semibold text-sm">
                        {typeof s.price === "number" ? s.price.toLocaleString("id-ID") : s.price}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold text-sm ${pos ? "text-green-400" : "text-red-400"}`}>
                        {pos ? "+" : ""}{typeof s.changePercent === "number" ? s.changePercent.toFixed(2) : s.changePercent}%
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 text-sm hidden sm:table-cell">{s.volume}</td>
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

// ===== NEWS =====
function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/news").then(r=>r.json()).then(d => {
      setNews(d.news || []);
      setLoading(false);
    }).catch(()=>setLoading(false));
    const iv = setInterval(() => {
      fetch("/api/news").then(r=>r.json()).then(d=>setNews(d.news||[])).catch(()=>{});
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  const catColor: any = { IHSG:"blue", Saham:"cyan", Sektoral:"purple", Makro:"orange", Teknologi:"indigo", Asing:"green", Korporasi:"pink", Komoditas:"yellow", Global:"red", Forex:"teal", Pasar:"blue" };

  return (
    <section id="news" className="py-16 px-4 bg-gradient-to-b from-[#020818] to-[#050f2c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-1">📰 Berita <span className="gradient-text">Pasar</span></h2>
            <p className="text-slate-400 text-sm">Update berita pasar modal terkini — realtime</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="card-glass rounded-xl p-4 h-40 shimmer"/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item, i) => (
              <div key={i} onClick={() => setSelected(item)}
                className="card-glass rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 group">
                <div className={`inline-block text-xs px-2 py-0.5 rounded-full mb-3 font-medium bg-blue-500/20 text-blue-300`}>
                  {item.category}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500">{item.source}</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <div className="bg-[#0a1a3e] border border-blue-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-xs text-blue-300 mb-3">{selected.category} · {selected.source} · {selected.time}</div>
              <h3 className="text-white font-bold text-lg mb-4 leading-snug">{selected.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{selected.summary}</p>
              <div className="flex gap-3">
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-5 py-2 rounded-lg inline-block">
                  Baca Selengkapnya ↗
                </a>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 transition-colors">
                  Tutup
                </button>
              </div>
            </div>
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
    fetch("/api/admin/signals").then(r=>r.json()).then(d=>setSignals(d.signals||[]));
  }, []);

  const actionColor: any = { BUY:"text-green-400 bg-green-400/10 border-green-400/30", SELL:"text-red-400 bg-red-400/10 border-red-400/30", HOLD:"text-yellow-400 bg-yellow-400/10 border-yellow-400/30", ANTRI:"text-blue-400 bg-blue-400/10 border-blue-400/30" };

  return (
    <section id="signals" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">⚡ Sinyal <span className="gradient-text">Premium</span></h2>
          <p className="text-slate-400 text-sm">Sinyal entry, antri, TP, SL dari tim analis kami — khusus member VIP</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signals.slice(0,6).map((sig,i) => (
            <div key={i} className="card-glass rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">{sig.kode}</div>
                  <div className="text-white font-bold">{sig.saham}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${actionColor[sig.action]}`}>{sig.action}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Entry</span><span className="text-white font-mono">{sig.entry}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Target</span><span className="text-green-400 font-mono">{sig.tp}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Stop Loss</span><span className="text-red-400 font-mono">{sig.sl}</span></div>
              </div>
              {sig.notes && <p className="text-xs text-slate-400 mt-3 border-t border-blue-500/10 pt-3 leading-relaxed">{sig.notes}</p>}
              <div className="mt-3 flex flex-wrap gap-1">
                {(sig.package||[]).map((p:string) => (
                  <span key={p} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 capitalize">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-4 text-sm text-yellow-300">
            🔒 Sinyal lengkap hanya untuk member VIP. <a href="https://wa.me/6282218723401" target="_blank" className="underline font-semibold">Bergabung sekarang →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== MODULES =====
function ModulesSection() {
  const [active, setActive] = useState<string|null>(null);

  return (
    <section id="modules" className="py-16 px-4 bg-gradient-to-b from-[#020818] to-[#050f2c]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">📚 Modul <span className="gradient-text">VIP</span></h2>
          <p className="text-slate-400 text-sm">Kurikulum lengkap investasi saham dari dasar hingga advanced</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vipModules.map((mod) => (
            <div key={mod.id} className="card-glass rounded-2xl p-5 cursor-pointer hover:scale-[1.01] transition-all duration-200" onClick={() => setActive(active===mod.id?null:mod.id)}>
              <div className="text-3xl mb-3">{mod.icon}</div>
              <h3 className="text-white font-bold mb-2">{mod.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{mod.description}</p>
              {active === mod.id && (
                <div className="space-y-3 border-t border-blue-500/20 pt-4">
                  {mod.content.map((c,i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 text-xs text-blue-400 font-bold mt-0.5">{i+1}</div>
                      <div>
                        <div className="text-white text-sm font-semibold">{c.title}</div>
                        <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-blue-400 mt-3 flex items-center gap-1">
                {active===mod.id ? "▲ Sembunyikan" : "▼ Lihat konten"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== PRICING (only Basic + CTA) =====
function PricingSection() {
  const basicPkg = packages[0];
  const featured = packages.slice(0,3); // basic, silver, gold

  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">💎 Paket <span className="gradient-text">VIP</span></h2>
          <p className="text-slate-400 text-sm">Mulai dari Rp 100.000/bulan — pilih paket sesuai kebutuhan Anda</p>
        </div>

        {/* Basic Package Highlight */}
        <div className="max-w-md mx-auto mb-8">
          <div className="card-glass rounded-2xl p-6 border-2 border-blue-500/40 glow-blue relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">MULAI DARI INI</span>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌊</div>
              <h3 className="text-xl font-black text-white mb-1">{basicPkg.name}</h3>
              <div className="text-3xl font-black text-blue-400 mb-1">{basicPkg.priceLabel}</div>
              <div className="text-slate-400 text-sm mb-4">{basicPkg.period}</div>
              <p className="text-slate-300 text-sm mb-5">{basicPkg.description}</p>
              <ul className="text-left space-y-2 mb-6">
                {basicPkg.features.map((f,i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-5 text-sm text-green-300">
                <strong>Grup WA Basic</strong> — diskusi harian bersama komunitas
              </div>
              <a href={`https://wa.me/6282218723401?text=Halo%20min%20saya%20mau%20order%20paket%20Basic%20Rp100.000`} target="_blank"
                className="btn-primary w-full block text-center py-3 rounded-xl font-bold">
                🚀 Order Paket Basic
              </a>
            </div>
          </div>
        </div>

        {/* See All */}
        <div className="text-center">
          <div className="inline-block bg-[#0a1a3e] border border-blue-500/30 rounded-2xl p-6 max-w-lg">
            <p className="text-slate-300 text-sm mb-4">Butuh fitur lebih? Tersedia paket Silver, Gold, Pro, Platinum, hingga Elite dengan AI Agent eksklusif!</p>
            <Link href="/paket" className="btn-gold inline-block px-8 py-3 rounded-xl font-bold text-sm">
              👑 Lihat Semua Paket (6 Pilihan)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== AI AGENT PROMO =====
function AIAgentPromo() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#050f2c] via-[#0a1a3e] to-[#050f2c]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card-glass rounded-3xl p-8 border-2 border-cyan-500/30 glow-cyan">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            AI Agent <span className="gradient-text">Eksklusif</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-xl mx-auto leading-relaxed">
            Paket <strong className="text-cyan-400">Pro, Platinum, dan Elite</strong> dilengkapi dengan AI Agent canggih yang bisa bantu analisis saham, cek portofolio, dan rekomendasikan langkah terbaik — kapan saja, real-time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[["🔍","Analisis Otomatis","Analisis saham real-time berbasis AI secara instan"],["📊","Portofolio Tracker","Pantau dan evaluasi portofolio Anda secara otomatis"],["⚡","Alert Sinyal","Notifikasi sinyal entry/exit sesuai preferensi Anda"]].map(([icon,t,d]) => (
              <div key={t} className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{t}</div>
                <div className="text-slate-400 text-xs">{d}</div>
              </div>
            ))}
          </div>
          <a href="https://wa.me/6282218723401?text=Halo,%20saya%20tertarik%20dengan%20paket%20Pro/Platinum/Elite%20dengan%20AI%20Agent!" target="_blank" className="btn-gold inline-block px-8 py-3 rounded-xl font-bold">
            🤖 Dapatkan AI Agent Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== TESTIMONIALS =====
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", package:"Basic", rating:5, text:"" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials").then(r=>r.json()).then(d => {
      if(d.testimonials?.length > 0) setTestimonials(d.testimonials);
    }).catch(()=>{});
  }, []);

  const submit = async () => {
    if(!form.name || !form.text) return;
    await fetch("/api/testimonials", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setSubmitted(true);
    setShowForm(false);
  };

  const pkgColor: any = { Basic:"bg-blue-500/20 text-blue-300", Silver:"bg-cyan-500/20 text-cyan-300", Gold:"bg-yellow-500/20 text-yellow-300", Pro:"bg-purple-500/20 text-purple-300", Platinum:"bg-slate-400/20 text-slate-300", Elite:"bg-yellow-400/20 text-yellow-400" };

  return (
    <section id="testimonial" className="py-16 px-4 bg-gradient-to-b from-[#050f2c] to-[#020818]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">⭐ Testimonial <span className="gradient-text">Member</span></h2>
          <p className="text-slate-400 text-sm">Apa kata member kami tentang RITEL COMMUNITY.ID</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {testimonials.map((t:any, i) => (
            <div key={i} className="card-glass rounded-2xl p-5 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name?.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkgColor[t.package] || "bg-blue-500/20 text-blue-300"}`}>
                    Paket {t.package}
                  </span>
                </div>
              </div>
              <div className="text-yellow-400 text-sm mb-3">{"★".repeat(t.rating || 5)}</div>
              <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
              <div className="text-xs text-slate-500 mt-3">{t.date}</div>
            </div>
          ))}
        </div>

        {submitted && <div className="text-center text-green-400 text-sm mb-4">✓ Terima kasih! Testimoni Anda sedang dalam review.</div>}

        {!showForm ? (
          <div className="text-center">
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-6 py-2 rounded-xl">
              + Tambah Testimoni Anda
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto card-glass rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Bagikan Pengalaman Anda</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama Anda" className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400"/>
              <select value={form.package} onChange={e=>setForm({...form,package:e.target.value})} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-blue-400">
                {["Basic","Silver","Gold","Pro","Platinum","Elite"].map(p => <option key={p} value={p} className="bg-[#0a1a3e]">{p}</option>)}
              </select>
              <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="Ceritakan pengalaman Anda..." rows={3} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-400 resize-none"/>
              <div className="flex gap-3">
                <button onClick={submit} className="btn-gold flex-1 py-2 rounded-lg text-sm font-bold">Kirim</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400 border border-slate-600 hover:border-slate-400 transition-colors">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#020818] border-t border-blue-500/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">RC</div>
              <div>
                <div className="text-white font-bold text-sm">RITEL COMMUNITY.ID</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">Platform investasi saham premium Indonesia dengan sinyal realtime, modul edukasi, dan komunitas aktif.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Menu</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {[["#news","Berita Pasar"],["#signals","Sinyal Saham"],["#modules","Modul VIP"],["#pricing","Paket"],["#testimonial","Testimoni"]].map(([h,l]) => (
                <li key={h}><a href={h} className="hover:text-blue-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Kontak & Sosial</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <a href="https://wa.me/6282218723401" target="_blank" className="flex items-center gap-2 hover:text-green-400 transition-colors">📱 082218723401 (WA)</a>
              <a href="https://instagram.com/elthoriqqqq_" target="_blank" className="flex items-center gap-2 hover:text-pink-400 transition-colors">📸 @elthoriqqqq_</a>
            </div>
            <div className="mt-4 text-xs text-slate-500">Development by<br/><span className="text-blue-400 font-semibold">Thirafi Thariq Al Idris</span></div>
          </div>
        </div>
        <div className="border-t border-blue-500/10 pt-6 text-center text-xs text-slate-500">
          © 2025 RITEL COMMUNITY.ID · All rights reserved · Investment is not risk-free, past performance does not guarantee future results.
        </div>
      </div>
    </footer>
  );
}

// ===== LIVE CHAT =====
function LiveChat() {
  return (
    <a href="https://wa.me/6282218723401?text=Halo%20Ritel%20Community,%20saya%20butuh%20bantuan!" target="_blank"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200 glow-cyan"
      title="Live Chat WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

// ===== MAIN =====
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <IHSGChart />
      <NewsSection />
      <SignalsSection />
      <ModulesSection />
      <AIAgentPromo />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
      <LiveChat />
    </main>
  );
}
