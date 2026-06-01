"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ===== GALAXY BACKGROUND + SCROLL NEON =====
function GalaxyBackground() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = barRef.current;
      if (!el) return;
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      el.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div ref={barRef} className="neon-scroll-bar" />
      <div className="galaxy-stars" />
    </>
  );
}

// ===== TILT EFFECT =====
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

// ===== TICKER =====
function StockTicker() {
  const [stocks, setStocks] = useState([
    { kode:"BBCA", price:"9.875", change:"+1.28%" },
    { kode:"BBRI", price:"4.680", change:"-0.64%" },
    { kode:"TLKM", price:"3.290", change:"+1.54%" },
    { kode:"ASII", price:"5.200", change:"-1.42%" },
    { kode:"GOTO", price:"86", change:"+4.88%" },
    { kode:"ANTM", price:"1.640", change:"+2.18%" },
    { kode:"BMRI", price:"6.175", change:"+0.90%" },
    { kode:"ADRO", price:"3.580", change:"-0.55%" },
    { kode:"ICBP", price:"10.250", change:"-1.44%" },
  ]);

  useEffect(() => {
    const load = () => {
      // Also load ticker customizations from localStorage (admin)
      try {
        const custom = localStorage.getItem("rc_admin_ticker_stocks");
        if (custom) { const parsed = JSON.parse(custom); if (parsed.length > 0) { setStocks(parsed); return; } }
      } catch {}
      fetch("/api/stocks").then(r => r.json()).then(d => {
        const list: any[] = [];
        if (d.stocks) {
          d.stocks.slice(0, 9).forEach((s: any) => list.push({
            kode: s.symbol?.replace(".JK", "") || s.kode,
            price: s.price?.toLocaleString("id-ID"),
            change: (s.changePercent >= 0 ? "+" : "") + s.changePercent?.toFixed(2) + "%",
          }));
        }
        if (list.length > 0) setStocks(list);
      }).catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const doubled = [...stocks, ...stocks];
  return (
    <div className="bg-black/80 border-b border-white/5 overflow-hidden" style={{ height: "44px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ display: "flex", animation: "tickerMove 32s linear infinite", whiteSpace: "nowrap", alignItems: "center" }}>
          {doubled.map((s, i) => {
            const pos = s.change.startsWith("+");
            return (
              <span key={i} className="inline-flex items-center gap-2 px-5" style={{ height: "44px" }}>
                <span className="text-xs font-black tracking-wide text-white">{s.kode}</span>
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

// ===== NAVBAR (no WA button) =====
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
      <div><StockTicker /></div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm">RC</div>
          <div>
            <span className="text-white font-black text-sm">RITEL</span>
            <span className="text-cyan-400 font-black text-sm"> COMMUNITY</span>
            <span className="text-slate-500 font-bold text-sm">.ID</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#market" className="text-slate-400 hover:text-cyan-400 transition-colors">Market</a>
          <a href="#news" className="text-slate-400 hover:text-cyan-400 transition-colors">Berita</a>
          <a href="#signals" className="text-slate-400 hover:text-cyan-400 transition-colors">Sinyal</a>
          <a href="#pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Paket</a>
          <a href="#testimonial" className="text-slate-400 hover:text-cyan-400 transition-colors">Testimoni</a>
          <a href="#faq" className="text-slate-400 hover:text-cyan-400 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-white border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all">
            Login VIP
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-4 py-3 space-y-1">
          {[["#market","Pasar"],["#news","Berita"],["#signals","Sinyal"],["#pricing","Paket"],["#testimonial","Testimoni"],["#faq","FAQ"]].map(([h,l]) => (
            <a key={h} href={h} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">{l}</a>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-cyan-400 hover:bg-white/5 rounded-lg">Login VIP</Link>
        </div>
      )}
    </nav>
  );
}

// ===== HERO =====
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: "44px" }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8 text-xs text-cyan-300">
          Platform Analisa Saham Indonesia
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
          Investasi Cerdas,<br/>
          <span className="gradient-text">Profit Konsisten</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Bandarmologi, Fundamental, Arahan Entry, Tape Reading, Bagger Pick, dan AI Agent analisa saham eksklusif untuk member VIP.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
          {[["12.400+","Member Aktif",""],["78%","Win Rate Signal","text-cyan-400"],["34 Stock","Bagger Picks","text-green-400"]].map(([val, label, cls], i) => (
            <TiltCard key={i}>
              <div className="card-glass rounded-2xl p-4 text-center">
                <div className={`text-xl font-black text-white ${cls}`}>{val}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#pricing" className="btn-primary text-sm px-8 py-3 rounded-xl">Mulai Sekarang</a>
          <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" className="btn-green text-sm px-8 py-3 rounded-xl">WA Admin</a>
        </div>
      </div>
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
      // Load custom stocks from admin if set
      try {
        const customStocks = localStorage.getItem("rc_admin_custom_stocks");
        const stockMode = localStorage.getItem("rc_admin_stock_mode");
        if (stockMode === '"custom"' && customStocks) {
          const parsed = JSON.parse(customStocks);
          if (parsed.length > 0) {
            setStocks(parsed.map((s: any) => ({
              symbol: s.kode || s.symbol,
              name: s.name || s.kode || s.symbol,
              price: s.price,
              change: s.change || 0,
              changePercent: s.changePercent || 0,
            })));
            return;
          }
        }
      } catch {}
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
    <section id="market" className="py-16 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Pasar <span className="gradient-text">Saham</span></h2>
          <p className="text-slate-500 text-sm">Data diperbarui setiap 30 detik</p>
        </div>
        <TiltCard>
          <div className="card-glass rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-slate-500 text-xs mb-1">IDX Composite · Realtime (TradingView)</div>
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
        </TiltCard>
        {/* TradingView IHSG Widget - accurate price */}
        <div className="card-glass rounded-2xl p-4 mb-6 overflow-hidden">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_ihsg&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=0&toolbarbg=04060f&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1"
            style={{ width:"100%", height:"320px", border:"none" }}
            title="IHSG TradingView"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stocks.map((s, i) => {
            const pos = (s.changePercent ?? 0) >= 0;
            return (
              <TiltCard key={i}>
                <div className="card rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-white text-sm">{s.symbol?.replace(".JK","")}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                      {pos ? "+" : ""}{s.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-white">{s.price?.toLocaleString("id-ID")}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{s.name}</div>
                </div>
              </TiltCard>
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
    fetch("/api/news").then(r => r.json()).then(d => { setNews((d.news || []).slice(0, 6)); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const mock = [
    { title:"IHSG Menguat 0.66% Ditopang Sektor Perbankan", source:"CNBC Indonesia", time:"1 jam lalu", category:"IHSG", url:"#" },
    { title:"BBCA Cetak Laba Rp 14 Triliun Q1 2025", source:"Bisnis.com", time:"2 jam lalu", category:"Saham", url:"#" },
    { title:"Asing Net Buy Rp 1.2 Triliun, IHSG Bullish", source:"Kontan", time:"3 jam lalu", category:"Asing", url:"#" },
    { title:"GOTO Profitabel Pertama Kali, Saham Melonjak 5%", source:"Tempo", time:"4 jam lalu", category:"Teknologi", url:"#" },
    { title:"BI Pertahankan Suku Bunga, Pasar Positif", source:"Detik Finance", time:"5 jam lalu", category:"Makro", url:"#" },
    { title:"Saham Tambang Menguat Ikuti Harga Nikel Global", source:"IDX Channel", time:"6 jam lalu", category:"Sektoral", url:"#" },
  ];
  const displayNews = news.length > 0 ? news : mock;
  return (
    <section id="news" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Berita Pasar <span className="gradient-text">IDX</span></h2>
          <p className="text-slate-500 text-sm">Berita saham Indonesia terkini</p>
        </div>
        {loading ? <div className="text-slate-500 text-center py-12">Memuat berita...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayNews.map((n, i) => (
              <TiltCard key={i}>
                <a href={n.url || "#"} target="_blank" rel="noopener noreferrer" className="card rounded-xl p-5 block group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{n.category || "Pasar"}</span>
                    <span className="text-xs text-slate-600">{n.time || n.source}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug mb-2">{n.title}</h3>
                  <div className="mt-3 text-xs text-slate-600">{n.source}</div>
                </a>
              </TiltCard>
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
  const actionColor: any = { BUY:"text-green-400 bg-green-400/10", SELL:"text-red-400 bg-red-400/10", HOLD:"text-yellow-400 bg-yellow-400/10", ANTRI:"text-cyan-400 bg-cyan-400/10" };
  return (
    <section id="signals" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Sinyal <span className="gradient-text">Premium</span></h2>
          <p className="text-slate-500 text-sm">Entry, TP, SL dari analis berpengalaman</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {display.map((s, i) => (
            <TiltCard key={i}>
              <div className="card rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-black text-white text-lg">{s.kode}</div>
                    <div className="text-xs text-slate-500">{s.saham}</div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action] || "text-white bg-white/10"}`}>{s.action}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="text-green-400 font-medium">{s.tp}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">{s.sl}</span></div>
                </div>
                {s.notes && <p className="mt-3 text-xs text-slate-400 border-t border-white/5 pt-3">{s.notes}</p>}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(s.package||[]).map((p:string)=><span key={p} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500 capitalize">{p}</span>)}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="card-glass rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-3">Sinyal lengkap dengan analisis mendalam tersedia untuk member VIP.</p>
          <a href="https://wa.me/6282218723401?text=Halo%20mau%20daftar%20VIP!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Daftar VIP</a>
        </div>
      </div>
    </section>
  );
}

// ===== AI AGENT SECTION =====
function AIAgentSection() {
  return (
    <section id="ai-agent" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4 text-xs text-purple-300">
            🤖 Eksklusif Member VIP
          </div>
          <h2 className="text-3xl font-black text-white mb-2">AI <span className="gradient-text">Agent</span> Analisa Saham</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Asisten kecerdasan buatan eksklusif yang siap membantu analisis saham, watchlist, dan signal kapan saja 24 jam penuh.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon:"🧠", title:"Analisis Fundamental", desc:"AI Agent menganalisis laporan keuangan, valuasi, dan prospek bisnis secara mendalam untuk setiap saham pilihanmu." },
            { icon:"📊", title:"Analisis Teknikal", desc:"Chart pattern recognition, support-resistance, indikator RSI, MACD, dan Bollinger Bands secara otomatis." },
            { icon:"⚡", title:"Real-time Watchlist", desc:"Monitor portofolio dan wishlist saham kamu secara real-time. Dapatkan notifikasi saat harga mencapai level target." },
            { icon:"🎯", title:"Signal Entry Cerdas", desc:"AI menghitung timing entry terbaik berdasarkan pola volume, bandarmologi, dan sentimen pasar terkini." },
            { icon:"📰", title:"Ringkasan Berita", desc:"AI Agent memfilter dan merangkum berita saham yang relevan, memisahkan noise dari informasi penting." },
            { icon:"💬", title:"Tanya Jawab 24/7", desc:"Tanya apa saja tentang saham, pasar, atau strategi investasi. AI siap menjawab kapan pun kamu butuh." },
          ].map((item, i) => (
            <TiltCard key={i}>
              <div className="card-glass rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-white text-sm mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="card-glass rounded-2xl p-6 border border-purple-500/20 max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-black text-white text-lg mb-2">Tersedia untuk Paket Pro, Platinum & Elite</h3>
          <p className="text-slate-400 text-sm mb-5">AI Agent kami terus belajar dan berkembang mengikuti dinamika pasar saham Indonesia. Dapatkan keunggulan kompetitif dengan teknologi AI terdepan.</p>
          <a href="#pricing" className="btn-primary text-sm px-8 py-3 rounded-xl inline-block">Upgrade ke Pro</a>
        </div>
      </div>
    </section>
  );
}

// ===== PRICING (only show 100k, link to /paket for others) =====
function PricingSection() {
  const [pricingData, setPricingData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rc_admin_pricing");
      if (stored) {
        const parsed = JSON.parse(stored);
        const basic = parsed.find((p:any) => p.id === "basic" || p.name?.toLowerCase() === "basic");
        if (basic) setPricingData(basic);
      }
    } catch {}
  }, []);

  const pkg = pricingData || {
    name: "Basic",
    priceLabel: "Rp 100.000",
    period: "/bulan",
    description: "Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.",
    features: ["Sinyal saham harian","Berita pasar realtime","Chart IHSG live","Modul dasar investasi","Grup WA Basic"],
  };

  const flashSale = pricingData?.flashSale;

  return (
    <section id="pricing" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">Paket <span className="gradient-text">VIP</span></h2>
          <p className="text-slate-500 text-sm">Mulai dari Rp 100.000/bulan — pilih level yang sesuai</p>
        </div>
        <div className="max-w-sm mx-auto">
          <TiltCard>
            <div className="card-glass rounded-2xl p-8 border-2 border-cyan-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-cyan-500 text-white text-xs font-black px-4 py-1 rounded-full">MULAI DARI SINI</span>
              </div>
              {flashSale && (
                <div className="flex justify-center mb-4">
                  <span className="flash-badge">FLASH SALE {flashSale.discount}</span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-2xl font-black text-white mb-1">{pkg.name}</div>
                {flashSale ? (
                  <div>
                    <span className="text-slate-500 line-through text-sm mr-2">{pkg.priceLabel}</span>
                    <span className="text-3xl font-black text-cyan-400">{flashSale.price}</span>
                    <span className="text-slate-400 text-sm">{pkg.period}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-black text-white">{pkg.priceLabel}</span>
                    <span className="text-slate-400 text-sm">{pkg.period}</span>
                  </div>
                )}
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{pkg.description}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {(pkg.features || []).map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/6282218723401?text=Halo%20min%20mau%20order%20paket%20${pkg.name}!`} target="_blank"
                className="btn-primary w-full block text-center py-3 rounded-xl font-bold text-sm">
                Order Paket {pkg.name}
              </a>
            </div>
          </TiltCard>
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm mb-3">Butuh fitur lebih? Tersedia 5 paket lainnya.</p>
            <Link href="/paket" className="text-cyan-400 hover:text-cyan-300 text-sm font-bold border border-cyan-500/30 px-6 py-2.5 rounded-xl hover:bg-cyan-500/5 transition-all inline-block">
              Lihat Semua Paket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== TESTIMONIALS (horizontal slider + touch drag) =====
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animPaused = useRef(false);

  const pauseAnim = () => {
    if (trackRef.current) { trackRef.current.style.animationPlayState = paused; animPaused.current = true; }
  };
  const resumeAnim = () => {
    if (trackRef.current) { trackRef.current.style.animationPlayState = running; animPaused.current = false; }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    pauseAnim();
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollLeft.current = trackRef.current?.getBoundingClientRect().x || 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const wrapper = trackRef.current.parentElement;
    if (wrapper) wrapper.scrollLeft -= dx;
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => { isDragging.current = false; setTimeout(resumeAnim, 2000); };

  const onMouseDown = (e: React.MouseEvent) => {
    pauseAnim();
    isDragging.current = true;
    startX.current = e.clientX;
    const wrapper = trackRef.current?.parentElement;
    scrollLeft.current = wrapper?.scrollLeft || 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const wrapper = trackRef.current?.parentElement;
    if (wrapper) { wrapper.scrollLeft = scrollLeft.current - (e.clientX - startX.current); }
  };
  const onMouseUp = () => { isDragging.current = false; setTimeout(resumeAnim, 2000); };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rc_admin_testimonials");
      if (stored) {
        const parsed = JSON.parse(stored);
        const approved = parsed.filter((t:any) => t.isApproved !== false);
        if (approved.length > 0) { setTestimonials(approved); return; }
      }
    } catch {}
    setTestimonials(defaultTestis);
  }, []);

  const defaultTestis = [
    { id:"t1", name:"Budi Santoso", package:"Gold", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%. Komunitas juga aktif dan supportif banget.", date:"Mei 2025" },
    { id:"t2", name:"Sari Dewi", package:"Platinum", rating:5, text:"AI Agent-nya luar biasa. Bisa analisis saham kapan aja 24 jam. Mentor juga responsif banget.", date:"April 2025" },
    { id:"t3", name:"Rizky Pratama", package:"Silver", rating:5, text:"Modul fundamental-nya komprehensif. Sekarang udah bisa analisis sendiri tanpa bingung lagi.", date:"Maret 2025" },
    { id:"t4", name:"Diana Putri", package:"Elite", rating:5, text:"Worth every penny! Return gua konsisten tiap bulan berkat sinyal dan mentoring langsung.", date:"Feb 2025" },
    { id:"t5", name:"Ahmad Fauzi", package:"Pro", rating:5, text:"AI Agent Pro bantu watchlist dan ingatkan sinyal. Mantap banget fiturnya nambah terus.", date:"Jan 2025" },
    { id:"t6", name:"Mira Susanti", package:"Gold", rating:5, text:"Tadinya nyoba Basic dulu, langsung upgrade ke Gold setelah lihat kualitas sinyalnya. Luar biasa!", date:"Des 2024" },
    { id:"t7", name:"Hendra Gunawan", package:"Platinum", rating:5, text:"Konsultasi 1-on-1 sama analisnya beneran bantu. Porto gua naik 60% dalam 3 bulan.", date:"Nov 2024" },
    { id:"t8", name:"Lia Rahayu", package:"Silver", rating:5, text:"Buat pemula kayak gue, modul-modulnya gampang banget dipahami. No jargon berlebihan.", date:"Okt 2024" },
    { id:"t9", name:"Doni Wibowo", package:"Elite", rating:5, text:"Fitur elite paling lengkap. Laporan harian personal bikin keputusan investasi jauh lebih tepat.", date:"Sep 2024" },
    { id:"t10", name:"Nani Kurniawati", package:"Pro", rating:5, text:"Grup WA-nya aktif banget. Diskusi sama sesama member juga nambah banyak insight baru.", date:"Agu 2024" },
  ];

  const display = testimonials.length > 0 ? testimonials : defaultTestis;
  const doubled = [...display, ...display];

  const pkgColor: any = {
    basic:"text-slate-400 bg-slate-400/10", silver:"text-cyan-300 bg-cyan-500/10",
    gold:"text-yellow-400 bg-yellow-500/10", pro:"text-purple-400 bg-purple-500/10",
    platinum:"text-slate-300 bg-slate-400/10", elite:"text-yellow-300 bg-yellow-400/10",
  };

  return (
    <section id="testimonial" className="py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-black text-white mb-1">Apa Kata <span className="gradient-text">Member</span></h2>
        <p className="text-slate-500 text-sm">Bergabung dengan ribuan investor yang sudah merasakan manfaatnya</p>
      </div>
      <div className="testi-wrapper" style={{overflowX:"auto",scrollbarWidth:"none"}}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} className="testi-track">
          {doubled.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-72 card rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                    {t.name?.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${pkgColor[t.package?.toLowerCase()] || pkgColor.basic}`}>{t.package}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array(t.rating || 5).fill(0).map((_,j)=><span key={j} className="text-yellow-400 text-xs">★</span>)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">{t.text}</p>
              <div className="text-xs text-slate-600 mt-3">{t.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FAQ =====
function FAQSection() {
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    { q:"Apa itu Ritel Community?", a:"Ritel Community adalah platform komunitas saham premium Indonesia yang menyediakan sinyal trading, analisis mendalam, modul edukasi, dan AI Agent untuk membantu investor ritel berinvestasi lebih cerdas dan menguntungkan." },
    { q:"Bagaimana cara bergabung?", a:"Pilih paket yang sesuai kebutuhan, klik tombol Order, dan hubungi admin via WhatsApp. Admin akan memandu proses pembayaran dan aktivasi token VIP Anda dalam waktu singkat." },
    { q:"Apakah sinyal selalu profit?", a:"Tidak ada sinyal yang bisa menjamin 100% profit. Namun win rate sinyal kami mencapai 78% berdasarkan track record historis. Selalu gunakan manajemen risiko dengan stop loss yang ketat." },
    { q:"Apakah ada jaminan uang kembali?", a:"Kami menyediakan garansi kepuasan 7 hari untuk paket Basic. Jika dalam 7 hari tidak puas, kami akan refund penuh. Paket lain dapat dikonsultasikan langsung dengan admin." },
    { q:"Bisa akses dari perangkat apa?", a:"Platform kami dapat diakses dari semua perangkat: smartphone, tablet, dan komputer melalui browser. Tidak perlu install aplikasi tambahan." },
    { q:"Berapa lama token VIP aktif?", a:"Sesuai paket yang dipilih, umumnya 1 bulan. Bisa diperpanjang kapan saja sebelum masa expired habis. Admin juga akan mengingatkan 3 hari sebelum expired." },
    { q:"Apakah ada grup WhatsApp?", a:"Ya! Setiap paket mendapatkan akses ke grup WhatsApp eksklusif sesuai level. Grup aktif dengan diskusi saham, analisis harian, dan update sinyal dari tim analis." },
    { q:"Apa perbedaan setiap paket?", a:"Perbedaan utama ada di fitur dan kedalaman akses. Basic untuk pemula, Silver tambah fundamental, Gold tambah sinyal premium, Pro tambah AI Agent, Platinum tambah konsultasi 1-on-1, Elite tambah mentoring langsung." },
  ];
  return (
    <section id="faq" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">Pertanyaan <span className="gradient-text">Umum</span></h2>
          <p className="text-slate-500 text-sm">Jawaban untuk pertanyaan yang sering ditanyakan</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <TiltCard key={i}>
              <div className="card rounded-xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-bold text-white text-sm pr-4">{f.q}</span>
                  <span className={`text-cyan-400 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-slate-400 text-sm leading-relaxed pt-4">{f.a}</p>
                  </div>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SNK + BENEFIT =====
function SNKSection() {
  return (
    <section className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h3 className="text-xl font-black text-white mb-6">Keunggulan <span className="gradient-text">Kami</span></h3>
            <div className="space-y-4">
              {[
                ["Sinyal Akurat & Terpercaya","Track record 78% win rate dengan analisis mendalam dari tim berpengalaman."],
                ["Komunitas Aktif","Ribuan member aktif siap berdiskusi dan berbagi insight setiap hari."],
                ["Edukasi Komprehensif","Modul dari pemula sampai expert tersedia untuk semua level investor."],
                ["Support Responsif","Tim admin dan analis siap membantu 7 hari seminggu via WhatsApp."],
                ["Update Real-time","Sinyal dan analisis diupdate setiap hari mengikuti pergerakan pasar."],
                ["Harga Terjangkau","Mulai dari Rp 100.000/bulan, terjangkau untuk semua kalangan."],
              ].map(([title, desc], i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
                  <div>
                    <div className="font-bold text-white text-sm">{title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* SNK */}
          <div>
            <h3 className="text-xl font-black text-white mb-6">Syarat &amp; <span className="gradient-text">Ketentuan</span></h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>1. Layanan ini hanya untuk tujuan edukasi dan informasi investasi, bukan merupakan rekomendasi investasi resmi.</p>
              <p>2. Semua sinyal dan analisis yang diberikan bukan jaminan keuntungan. Investasi saham memiliki risiko.</p>
              <p>3. Member bertanggung jawab penuh atas setiap keputusan investasi yang dibuat berdasarkan informasi dari platform ini.</p>
              <p>4. Token VIP bersifat personal dan tidak boleh dibagikan atau dipindahtangankan kepada pihak lain.</p>
              <p>5. Penyalahgunaan akun atau token dapat mengakibatkan penonaktifan tanpa pengembalian dana.</p>
              <p>6. Konten platform dilindungi hak cipta. Dilarang menyebarkan konten tanpa izin tertulis.</p>
              <p>7. Harga paket dapat berubah sewaktu-waktu. Harga berlaku saat pembayaran dikonfirmasi.</p>
              <p>8. Refund hanya berlaku untuk kondisi tertentu sesuai kebijakan yang berlaku.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== WA LINKS SECTION =====
function WALinksSection() {
  return (
    <section className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-black text-white mb-2">Bergabung <span className="gradient-text">Komunitas</span></h2>
        <p className="text-slate-500 text-sm mb-8">Ikuti komunitas WhatsApp kami dan dapatkan update pasar, diskusi saham, dan informasi terbaru setiap hari.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TiltCard>
            <a href="https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS?s=cl&p=i&mlu=3&amv=1"
              target="_blank" rel="noopener noreferrer"
              className="card-glass rounded-2xl p-6 flex flex-col items-center gap-3 border border-green-500/20 hover:border-green-500/50 transition-all block group">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-white text-base mb-1">Grup Publik</div>
                <div className="text-slate-400 text-xs">Diskusi bebas seputar saham & investasi bersama ribuan member aktif</div>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 bg-green-500/10 text-green-400 text-xs font-bold px-4 py-2 rounded-xl border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                Bergabung Sekarang →
              </span>
            </a>
          </TiltCard>
          <TiltCard>
            <a href="https://whatsapp.com/channel/0029VbCVhf91noz95vIGwo23"
              target="_blank" rel="noopener noreferrer"
              className="card-glass rounded-2xl p-6 flex flex-col items-center gap-3 border border-cyan-500/20 hover:border-cyan-500/50 transition-all block group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#06b6d4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-white text-base mb-1">Channel Resmi</div>
                <div className="text-slate-400 text-xs">Update sinyal, berita pasar, dan info promo eksklusif langsung dari tim kami</div>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold px-4 py-2 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                Follow Channel →
              </span>
            </a>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
            <span className="text-white font-black text-sm">RITEL COMMUNITY<span className="text-slate-500">.ID</span></span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
            <a href="https://wa.me/6282218723401" target="_blank" className="hover:text-cyan-400 transition-colors">Hubungi Kami</a>
            <Link href="/paket" className="hover:text-cyan-400 transition-colors">Semua Paket</Link>
          </div>
          <p className="text-xs text-slate-600">© 2025 Ritel Community.ID · Platform saham edukasi</p>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN =====
export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <GalaxyBackground />
      <div className="relative z-10">
        <Navbar />
        <div style={{ paddingTop: "88px" }}>
          <Hero />
          <MarketSection />
          <NewsSection />
          <SignalsSection />
          <AIAgentSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <WALinksSection />
          <SNKSection />
          <Footer />
        </div>
      </div>
      {/* WA Float button - only here in body, removed from navbar */}
      <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
