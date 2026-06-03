"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ===== LOADING SCREEN =====
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2400);
    const t5 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #040d1a 0%, #020610 40%, #000204 100%)" }}>
      {/* Stars */}
      <div style={{ position:"absolute", inset:0 }}>
        {Array.from({length:120}).map((_,i) => (
          <div key={i} style={{
            position:"absolute",
            left: Math.random()*100+"%",
            top: Math.random()*100+"%",
            width: Math.random()*2.5+0.5+"px",
            height: Math.random()*2.5+0.5+"px",
            background: "#fff",
            borderRadius:"50%",
            opacity: Math.random()*0.7+0.2,
            animation: `twinkle ${Math.random()*3+2}s ease-in-out infinite`,
            animationDelay: Math.random()*4+"s",
          }}/>
        ))}
      </div>
      {/* Nebula glows */}
      <div style={{position:"absolute",top:"20%",left:"15%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(30,90,240,0.12) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",bottom:"25%",right:"15%",width:"250px",height:"250px",background:"radial-gradient(circle,rgba(0,200,255,0.08) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"400px",height:"400px",background:"radial-gradient(circle,rgba(10,40,120,0.15) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(60px)"}}/>

      {/* Center content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div style={{ opacity: phase>=1?1:0, transform: phase>=1?"scale(1)":"scale(0.5)", transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
          className="flex justify-center mb-6">
          <div style={{
            width:72, height:72, borderRadius:20,
            background:"linear-gradient(135deg,#1e5af0,#00c8ff)",
            boxShadow:"0 0 40px rgba(30,90,240,0.6), 0 0 80px rgba(30,90,240,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, fontWeight:900, color:"#fff",
          }}>RC</div>
        </div>

        {/* Title letters */}
        <div style={{ opacity: phase>=2?1:0, transform: phase>=2?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease" }}>
          <div style={{ fontSize:"clamp(22px,5vw,36px)", fontWeight:900, letterSpacing:"0.15em", color:"#fff", marginBottom:4 }}>
            {"RITEL COMMUNITY".split("").map((ch, i) => (
              <span key={i} style={{
                display:"inline-block",
                animation: phase>=2 ? `letterDrop 0.5s ease forwards` : "none",
                animationDelay: `${i*0.04}s`,
                opacity:0,
                color: ch === " " ? "transparent" : undefined,
              }}>{ch === " " ? " " : ch}</span>
            ))}
          </div>
          <div style={{
            fontSize:"clamp(14px,3vw,20px)", fontWeight:900, letterSpacing:"0.3em",
            background:"linear-gradient(90deg,#1e5af0,#00c8ff,#1e5af0)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundSize:"200% auto", animation:"shimmerText 2s linear infinite",
          }}>.ID</div>
        </div>

        {/* Tagline */}
        <div style={{ opacity: phase>=3?1:0, transform: phase>=3?"translateY(0)":"translateY(10px)", transition:"all 0.5s ease 0.2s", marginTop:16 }}>
          <p style={{ color:"rgba(148,163,184,0.8)", fontSize:"clamp(10px,2vw,13px)", letterSpacing:"0.2em" }}>
            PLATFORM ANALISA SAHAM INDONESIA
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:32, opacity: phase>=2?1:0, transition:"opacity 0.5s ease" }}>
          <div style={{ width:200, height:2, background:"rgba(255,255,255,0.08)", borderRadius:4, margin:"0 auto", overflow:"hidden" }}>
            <div style={{
              height:"100%",
              background:"linear-gradient(90deg,#1e5af0,#00c8ff)",
              borderRadius:4,
              width: phase>=4?"100%":phase>=3?"70%":phase>=2?"35%":"5%",
              transition:"width 0.6s ease",
              boxShadow:"0 0 8px rgba(0,200,255,0.8)",
            }}/>
          </div>
          <p style={{ color:"rgba(100,116,139,0.7)", fontSize:10, marginTop:8, letterSpacing:"0.1em" }}>
            {phase<=2?"INITIALIZING...":phase===3?"LOADING MARKET DATA...":"READY"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes letterDrop { 0%{opacity:0;transform:translateY(-20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes shimmerText { 0%{background-position:0% center} 100%{background-position:200% center} }
      `}</style>
    </div>
  );
}

// ===== MOTIVASI TICKER =====
function MotivasiTicker() {
  const [list, setList] = useState<string[]>([
    "Jangan takut untuk belajar — satu langkah kecil hari ini adalah investasi terbesar untuk masa depanmu.",
    "Pasar tidak menghukum yang berani belajar. Pasar menghukum yang tidak mau bersiap.",
    "Setiap investor sukses pernah menjadi pemula. Yang membedakan mereka adalah konsistensi belajar.",
    "Cari mentor yang tepat — pengalaman mereka bisa memotong kurva belajarmu bertahun-tahun.",
    "Profit bukan keberuntungan, itu adalah hasil dari disiplin, ilmu, dan manajemen risiko yang benar.",
    "Investasi terbaik yang bisa kamu lakukan adalah investasi pada dirimu sendiri.",
    "Bukan tentang timing the market, tapi time in the market dan terus belajar.",
  ]);

  useEffect(() => {
    try {
      const syncData = JSON.parse(localStorage.getItem("rc_sync") || "{}");
      if (syncData.motivasi && syncData.motivasi.length > 0) {
        setList(syncData.motivasi.map((m: any) => m.text));
      }
    } catch {}
  }, []);

  if (list.length === 0) return null;
  const doubled = [...list, ...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.04)", borderTop:"1px solid rgba(234,179,8,0.1)", borderBottom:"1px solid rgba(234,179,8,0.1)", padding:"8px 0", overflow:"hidden" }}>
      <div style={{ display:"flex" }}>
        <div style={{ display:"flex", animation:"motivasiMove 60s linear infinite", whiteSpace:"nowrap", alignItems:"center" }}>
          {doubled.map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 text-xs" style={{ color:"rgba(234,179,8,0.75)" }}>
              <span style={{ color:"rgba(234,179,8,0.5)" }}>✦</span>
              {text}
              <span style={{ color:"rgba(234,179,8,0.3)", marginLeft:16 }}>|</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes motivasiMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}


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

// ===== RC LOGO =====
function RCLogo({ size = 36 }: { size?: number }) {
  return (
    <img 
      src="/logo.png" 
      alt="RITEL COMMUNITY" 
      width={size} 
      height={size} 
      style={{ borderRadius: size * 0.27, objectFit: "cover", display: "block" }} 
    />
  );
}

// ===== SVG ICONS =====
const Icons = {
  Brain: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  ChartBar: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Target: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Newspaper: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>
    </svg>
  ),
  MessageCircle: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Rocket: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Award: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Megaphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  WinRate: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Gem: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 18 3 22 9 12 22 2 9"/><polyline points="2 9 12 9 18 3"/>
      <line x1="12" y1="9" x2="12" y2="22"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Star: ({ filled = true }: { filled?: boolean }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Candlestick: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="5" y="10" width="4" height="8" rx="1"/><line x1="7" y1="7" x2="7" y2="10"/><line x1="7" y1="18" x2="7" y2="21"/>
      <rect x="10" y="6" width="4" height="6" rx="1" fill="currentColor" fillOpacity="0.3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="12" x2="12" y2="15"/>
      <rect x="15" y="9" width="4" height="7" rx="1"/><line x1="17" y1="6" x2="17" y2="9"/><line x1="17" y1="16" x2="17" y2="19"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
    </svg>
  ),
  Menu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ===== TICKER =====
function StockTicker() {
  const [tickerSpeedVal, setTickerSpeedVal] = useState(32);
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
    const load = async () => {
      try {
        const spd = localStorage.getItem("rc_admin_ticker_speed");
        if (spd) setTickerSpeedVal(parseInt(spd));
      } catch {}
      try {
        const syncData = await fetch("/api/admin/sync").then(r => r.json());
        if (syncData.ticker_speed) setTickerSpeedVal(syncData.ticker_speed);
        if (syncData.ticker && syncData.ticker.length > 0) {
          setStocks(syncData.ticker.map((s: any) => ({ kode: s.kode, price: s.price, change: s.change })));
          return;
        }
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
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  const doubled = [...stocks, ...stocks];
  return (
    <div className="bg-black/80 border-b border-white/5 overflow-hidden" style={{ height: "44px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ display: "flex", animation: `tickerMove ${tickerSpeedVal}s linear infinite`, whiteSpace: "nowrap", alignItems: "center" }}>
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
      <div><StockTicker /></div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <RCLogo size={36} />
          <div>
            <span className="text-white font-black text-sm">RITEL</span>
            <span className="text-cyan-400 font-black text-sm"> COMMUNITY</span>
            <span className="text-slate-500 font-bold text-sm">.ID</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="/paket" className="text-slate-400 hover:text-cyan-400 transition-colors">Paket</a>
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
            {menuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-4 py-3 space-y-1">
          {[["/paket","Paket"],["#news","Berita"],["#signals","Sinyal"],["#pricing","Harga"],["#testimonial","Testimoni"],["#faq","FAQ"]].map(([h,l]) => (
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: "0px" }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5 text-xs text-cyan-300">
          Platform Analisa Saham Indonesia
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-3 leading-tight tracking-tight">
          Investasi Cerdas,<br/>
          <span className="gradient-text">Profit Konsisten</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-7 max-w-2xl mx-auto leading-relaxed">
          Bandarmologi, Fundamental, Arahan Entry, Tape Reading, Bagger Pick, dan AI Agent analisa saham eksklusif untuk member VIP.
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-7">
          {[
            { val:"12.400+", label:"Member Aktif", icon:<Icons.Users />, cls:"text-white" },
            { val:"78%", label:"Win Rate", icon:<Icons.WinRate />, cls:"text-cyan-400" },
            { val:"34 Stock", label:"Bagger Picks", icon:<Icons.Gem />, cls:"text-green-400" },
          ].map((item, i) => (
            <TiltCard key={i} className="flex">
              <div className="card-glass rounded-xl p-3 text-center flex flex-col items-center justify-center w-full" style={{minHeight:"88px"}}>
                <div className={`flex justify-center mb-1 ${item.cls}`}>{item.icon}</div>
                <div className={`text-lg font-black ${item.cls}`}>{item.val}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-tight">{item.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <a href="#pricing" className="btn-primary font-bold rounded-xl" style={{fontSize:"14px",padding:"12px 0",width:"148px",textAlign:"center",display:"block"}}>Mulai Sekarang</a>
          <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" className="btn-green font-bold rounded-xl" style={{fontSize:"14px",padding:"12px 0",width:"148px",textAlign:"center",display:"block"}}>WA Admin</a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
        <Icons.ChevronDown />
      </div>
    </section>
  );
}

// ===== REDIRECT: market section → halaman paket =====
function MarketSection() {
  return (
    <section id="market" className="py-16 px-4 relative z-10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-black text-white mb-3">💎 Pilih <span className="gradient-text">Paket VIP</span></h2>
        <p className="text-slate-500 text-sm mb-8">Akses sinyal saham, analisa eksklusif, AI Agent, dan komunitas trader premium</p>
        <a href="/paket" style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:"linear-gradient(135deg,#06b6d4,#1e5af0)",
          color:"#fff", padding:"16px 40px", borderRadius:14,
          fontWeight:900, fontSize:16, textDecoration:"none",
          boxShadow:"0 0 32px rgba(30,90,240,0.35)"
        }}>
          Lihat Semua Paket →
        </a>
        <p className="text-slate-600 text-xs mt-4">Mulai dari Rp 100.000/bulan</p>
      </div>
    </section>
  );
}

// ===== NEWS — hanya saham Indonesia =====
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
    { title:"GOTO Profitabel Pertama Kali, Saham Melonjak 5%", source:"CNBC Indonesia", time:"4 jam lalu", category:"Saham", url:"#" },
    { title:"BI Pertahankan Suku Bunga, Pasar Saham Positif", source:"Detik Finance", time:"5 jam lalu", category:"Makro", url:"#" },
    { title:"Saham Tambang BEI Menguat Ikuti Harga Nikel Global", source:"IDX Channel", time:"6 jam lalu", category:"Tambang", url:"#" },
  ];
  const displayNews = news.length > 0 ? news : mock;

  const catColor: any = {
    IHSG:"bg-blue-500/10 text-blue-400", Saham:"bg-cyan-500/10 text-cyan-400",
    Tambang:"bg-yellow-500/10 text-yellow-400", Perbankan:"bg-green-500/10 text-green-400",
    Forex:"bg-purple-500/10 text-purple-400", Korporasi:"bg-orange-500/10 text-orange-400",
    Dividen:"bg-pink-500/10 text-pink-400", Makro:"bg-slate-500/10 text-slate-300",
    Komoditas:"bg-amber-500/10 text-amber-400", Investasi:"bg-teal-500/10 text-teal-400",
    Pasar:"bg-cyan-500/10 text-cyan-400", Asing:"bg-indigo-500/10 text-indigo-400",
    Sektoral:"bg-violet-500/10 text-violet-400",
  };

  return (
    <section id="news" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Berita Pasar <span className="gradient-text">Saham Indo</span></h2>
            <p className="text-slate-500 text-sm">Berita saham Indonesia terkini dari BEI & IHSG</p>
          </div>
          <button onClick={()=>{ setLoading(true); fetch("/api/news").then(r=>r.json()).then(d=>{ setNews((d.news||[]).slice(0,6)); setLoading(false); }).catch(()=>setLoading(false)); }} className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
        <div className="card-glass rounded-2xl p-4" style={{maxHeight:"520px",overflowY:"auto"}}>
          {loading ? <div className="text-slate-500 text-center py-12">Memuat berita...</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayNews.map((n, i) => (
                <TiltCard key={i}>
                  <a href={n.url || "#"} target="_blank" rel="noopener noreferrer" className="card rounded-xl p-5 block group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[n.category] || "bg-cyan-500/10 text-cyan-400"}`}>{n.category || "Pasar"}</span>
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
      </div>
    </section>
  );
}

// ===== SIGNALS — real-time dari Supabase, langsung tampil sesuai role =====
function SignalsSection() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Package order - basic is public, silver+ is locked
  const PKG_LEVEL: Record<string,number> = { basic:1, silver:2, gold:3, pro:4, platinum:5, elite:6 };

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/admin/signals");
        const d = await r.json();
        setSignals(d.signals || []);
      } catch {}
      setLoading(false);
    };
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  const actionColor: any = {
    BUY:"text-green-400 bg-green-400/10 border-green-400/20",
    SELL:"text-red-400 bg-red-400/10 border-red-400/20",
    HOLD:"text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    ANTRI:"text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  };

  const pkgLevelColor: any = {
    basic:"bg-slate-400/10 text-slate-400", silver:"bg-cyan-400/10 text-cyan-300",
    gold:"bg-yellow-400/10 text-yellow-400", pro:"bg-purple-400/10 text-purple-400",
    platinum:"bg-slate-300/10 text-slate-300", elite:"bg-yellow-300/10 text-yellow-300",
  };

  // Determine if signal is basic-only (visible to public)
  // A signal is "public" if its package includes ONLY "basic"
  // Or if its minimum package is "basic" (first in package array)
  const isBasicSignal = (s: any) => {
    const pkgs: string[] = s.package || [];
    if (pkgs.length === 0) return false;
    // If package array contains only basic, it's public
    if (pkgs.length === 1 && pkgs[0] === "basic") return true;
    // If basic is included AND no higher tier, show it
    const minLevel = Math.min(...pkgs.map((p: string) => PKG_LEVEL[p] || 99));
    return minLevel === 1; // basic=1
  };

  const publicSignals = signals.filter(isBasicSignal);
  const lockedSignals = signals.filter(s => !isBasicSignal(s));

  // Show max 3 locked cards as blurred preview
  const previewLocked = lockedSignals.slice(0, 3);

  return (
    <section id="signals" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Sinyal <span className="gradient-text">Premium</span></h2>
            <p className="text-slate-500 text-sm">Entry, TP, SL dari analis berpengalaman · Update realtime</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            <span className="text-green-400 text-xs font-bold">LIVE</span>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 text-center py-12">Memuat sinyal...</div>
        ) : signals.length === 0 ? (
          <div className="card-glass rounded-xl p-10 text-center">
            <div className="flex justify-center mb-3 text-slate-600"><Icons.Candlestick /></div>
            <p className="text-slate-500 text-sm">Belum ada sinyal aktif saat ini.</p>
            <p className="text-slate-600 text-xs mt-1">Sinyal baru akan muncul otomatis di sini.</p>
          </div>
        ) : (
          <>
            {/* PUBLIC signals - basic only */}
            {publicSignals.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {publicSignals.map((s, i) => (
                  <TiltCard key={s.id || i}>
                    <div className="card rounded-xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-black text-white text-lg">{s.kode}</div>
                          <div className="text-xs text-slate-500">{s.saham}</div>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${actionColor[s.action] || "text-white bg-white/10 border-white/10"}`}>
                          {s.action}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="text-green-400 font-medium">{s.tp}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">{s.sl}</span></div>
                      </div>
                      {s.notes && <p className="mt-3 text-xs text-slate-400 border-t border-white/5 pt-3">{s.notes}</p>}
                      <div className="mt-3 flex flex-wrap gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-400/10 text-slate-400">basic</span>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            )}

            {/* LOCKED signals - silver and above, shown blurred */}
            {previewLocked.length > 0 && (
              <div className="relative mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {previewLocked.map((s, i) => (
                    <div key={s.id || i} className="relative">
                      {/* Blurred card */}
                      <div className="card rounded-xl p-5 blur-sm select-none pointer-events-none">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-black text-white text-lg">XXXX</div>
                            <div className="text-xs text-slate-500">••••••••••</div>
                          </div>
                          <span className="text-xs font-black px-2.5 py-1 rounded-lg border text-green-400 bg-green-400/10 border-green-400/20">BUY</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">•••</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="text-green-400 font-medium">•••</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">•••</span></div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {(s.package||[]).map((p:string)=>(
                            <span key={p} className={`text-xs px-2 py-0.5 rounded-full capitalize ${pkgLevelColor[p]||"bg-white/5 text-slate-500"}`}>{p}</span>
                          ))}
                        </div>
                      </div>
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl backdrop-blur-[2px]">
                        <div className="text-2xl mb-2">🔒</div>
                        <p className="text-white text-xs font-bold text-center px-4">Khusus Member VIP</p>
                        <p className="text-slate-400 text-[11px] text-center mt-1 px-4">
                          {(s.package||[]).join(", ")} ke atas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {lockedSignals.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent rounded-b-xl pointer-events-none"/>
                )}
              </div>
            )}
          </>
        )}

        <div className="card-glass rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm mb-1">
            {lockedSignals.length > 0 
              ? `${lockedSignals.length} sinyal VIP tersembunyi · Upgrade untuk akses penuh`
              : "Sinyal lengkap dengan analisis mendalam tersedia untuk member VIP."}
          </p>
          <p className="text-slate-600 text-xs mb-3">Silver, Gold, Pro, Platinum & Elite dapat akses semua sinyal</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/login" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">🔑 Login VIP</a>
            <a href="https://wa.me/6282218723401?text=Halo%20mau%20daftar%20VIP!" target="_blank" className="btn-green text-sm px-6 py-2.5 rounded-xl inline-block">Daftar VIP</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== AI AGENT SECTION =====
function AIAgentSection() {
  const aiFeatures = [
    { Icon: Icons.Brain, title:"Analisis Fundamental", desc:"AI Agent menganalisis laporan keuangan, valuasi, dan prospek bisnis secara mendalam untuk setiap saham pilihanmu." },
    { Icon: Icons.ChartBar, title:"Analisis Teknikal", desc:"Chart pattern recognition, support-resistance, indikator RSI, MACD, dan Bollinger Bands secara otomatis." },
    { Icon: Icons.Zap, title:"Real-time Watchlist", desc:"Monitor portofolio dan wishlist saham kamu secara real-time. Dapatkan notifikasi saat harga mencapai level target." },
    { Icon: Icons.Target, title:"Signal Entry Cerdas", desc:"AI menghitung timing entry terbaik berdasarkan pola volume, bandarmologi, dan sentimen pasar terkini." },
    { Icon: Icons.Newspaper, title:"Ringkasan Berita", desc:"AI Agent memfilter dan merangkum berita saham yang relevan, memisahkan noise dari informasi penting." },
    { Icon: Icons.MessageCircle, title:"Tanya Jawab 24/7", desc:"Tanya apa saja tentang saham, pasar, atau strategi investasi. AI siap menjawab kapan pun kamu butuh." },
  ];
  return (
    <section id="ai-agent" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4 text-xs text-purple-300">
            <Icons.Brain /> Eksklusif Member VIP
          </div>
          <h2 className="text-3xl font-black text-white mb-2">AI <span className="gradient-text">Agent</span> Analisa Saham</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Asisten kecerdasan buatan eksklusif yang siap membantu analisis saham, watchlist, dan signal kapan saja 24 jam penuh.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {aiFeatures.map(({ Icon, title, desc }, i) => (
            <TiltCard key={i}>
              <div className="card-glass rounded-2xl p-6">
                <div className="text-cyan-400 mb-3"><Icon /></div>
                <h3 className="font-black text-white text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="card-glass rounded-2xl p-6 border border-purple-500/20 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-3 text-purple-400"><Icons.Rocket /></div>
          <h3 className="font-black text-white text-lg mb-2">Tersedia untuk Paket Pro, Platinum & Elite</h3>
          <p className="text-slate-400 text-sm mb-5">AI Agent kami terus belajar dan berkembang mengikuti dinamika pasar saham Indonesia. Dapatkan keunggulan kompetitif dengan teknologi AI terdepan.</p>
          <a href="#pricing" className="btn-primary text-sm px-8 py-3 rounded-xl inline-block">Upgrade ke Pro</a>
        </div>
      </div>
    </section>
  );
}

// ===== PRICING =====

// ===== PRICING SECTION (Midtrans-style order flow, flash sale timer, kalkulator %) =====
// Custom Checkbox Dialog Component
function CustomCheckDialog({ open, onConfirm, onClose, title, message }: {
  open: boolean; onConfirm: () => void; onClose: () => void;
  title: string; message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#0d1117] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3 className="text-white font-black text-center text-lg mb-2">{title}</h3>
          <p className="text-slate-400 text-sm text-center leading-relaxed mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all">
              Batal
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all">
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Flash sale timer
function useFlashSaleTimer(endTime: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endTime) { setTimeLeft(null); setExpired(false); return; }
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); setTimeLeft(null); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [endTime]);

  return { timeLeft, expired };
}

// Order Modal (Midtrans-style)
function OrderModal({ pkg, flashSale, onClose }: { pkg: any; flashSale: any; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "invoice" | "done">("form");
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [metode, setMetode] = useState("dana");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const PAYMENT_METHODS = [
    { id:"dana",    label:"DANA",    number:"082218723401", an:"THIRAFI THARIQ AL IDRIS", icon:"💚", color:"from-green-600 to-emerald-500" },
    { id:"gopay",   label:"GoPay",   number:"082218723401", an:"THIRAFI THARIQ AL IDRIS", icon:"💙", color:"from-blue-600 to-sky-500" },
    { id:"seabank", label:"SeaBank", number:"901555691160", an:"THIRAFI THARIQ AL IDRIS", icon:"🏦", color:"from-indigo-600 to-purple-600" },
  ];
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === metode) || PAYMENT_METHODS[0];

  const displayPrice = flashSale?.price || pkg.priceLabel;
  const rawPrice = flashSale?.rawPrice || pkg.price;

  function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" });
  }
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(""), 2000); });
  }

  const colorMap: any = {
    blue:"from-blue-600 to-blue-800", cyan:"from-cyan-600 to-blue-700",
    gold:"from-yellow-500 to-orange-600", purple:"from-purple-600 to-indigo-700",
    platinum:"from-slate-400 to-slate-600", elite:"from-yellow-400 to-orange-500",
  };
  const pkgBg = colorMap[pkg.color] || "from-cyan-600 to-blue-700";

  async function handleSubmit() {
    setErr("");
    if (!nama.trim()) { setErr("Nama tidak boleh kosong"); return; }
    if (!hp.trim() || hp.trim().length < 9) { setErr("No HP tidak valid"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action:"create", nama:nama.trim(), hp:hp.trim(), paket:pkg.name, harga:rawPrice, metode:selectedMethod.label }),
      });
      const data = await res.json();
      if (data.success) { setOrder(data.order); setStep("invoice"); }
      else { setErr(data.message || "Gagal membuat order"); }
    } catch { setErr("Terjadi kesalahan, coba lagi"); }
    setLoading(false);
  }

  function goWhatsApp() {
    if (!order) return;
    const invoiceText =
`🧾 *INVOICE PEMBELIAN - RITEL COMMUNITY*
━━━━━━━━━━━━━━━━━━━━━━━━
📋 No. Invoice : ${order.id}
📅 Tanggal     : ${formatDate(order.created_at)}
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nama        : ${order.nama}
📱 No. HP      : ${order.hp}
📦 Paket       : ${order.paket}
💰 Total       : ${displayPrice}/bulan
━━━━━━━━━━━━━━━━━━━━━━━━
💳 Metode      : ${selectedMethod.label}
🏷  No. Akun   : ${selectedMethod.number}
👤 a.n         : ${selectedMethod.an}
━━━━━━━━━━━━━━━━━━━━━━━━
_Mohon lampirkan bukti transfer._
_Token VIP aktif setelah konfirmasi admin._`;
    window.open(`https://wa.me/6282218723401?text=${encodeURIComponent(invoiceText)}`, "_blank");
    setShowConfirmDialog(true);
  }

  return (
    <>
      <CustomCheckDialog
        open={showConfirmDialog}
        title="Pembayaran Terkirim?"
        message="Pastikan bukti transfer sudah dikirim via WhatsApp. Admin akan memproses aktivasi token VIP kamu."
        onConfirm={() => { setShowConfirmDialog(false); setStep("done"); }}
        onClose={() => setShowConfirmDialog(false)}
      />

      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full sm:max-w-md bg-[#0a0e1a] sm:rounded-2xl rounded-t-2xl border border-white/10 overflow-hidden max-h-[92vh] overflow-y-auto">

          {/* Header strip */}
          <div className={`bg-gradient-to-r ${pkgBg} p-4 text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-70">
                  {step === "form" ? "Order Paket" : step === "invoice" ? "Invoice" : "Selesai"}
                </p>
                <p className="font-black text-lg">Paket {pkg.name}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Steps indicator */}
            <div className="flex items-center gap-1 mt-3">
              {["Isi Data", "Invoice", "Konfirmasi"].map((s, i) => {
                const stepIdx = step === "form" ? 0 : step === "invoice" ? 1 : 2;
                return (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= stepIdx ? "bg-white text-[#0a0e1a]" : "bg-white/20 text-white/50"}`}>
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs ${i <= stepIdx ? "text-white" : "text-white/50"}`}>{s}</span>
                    {i < 2 && <div className={`flex-1 h-px w-6 ${i < stepIdx ? "bg-white" : "bg-white/20"}`}/>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5">
            {/* FORM */}
            {step === "form" && (
              <div className="space-y-4">
                {/* Price display */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/8">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Total Pembayaran</span>
                    <div className="text-right">
                      {flashSale && <div className="text-slate-500 line-through text-xs">{pkg.priceLabel}</div>}
                      <span className="text-white font-black text-xl">{displayPrice}</span>
                      <span className="text-slate-400 text-xs">/bulan</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nama Lengkap *</label>
                  <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Masukkan nama lengkap" className="input-dark"/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">No. WhatsApp / HP *</label>
                  <input value={hp} onChange={e=>setHp(e.target.value)} placeholder="08xxxxxxxxxx" type="tel" className="input-dark"/>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map(m => (
                      <button key={m.id} onClick={()=>setMetode(m.id)}
                        className={`p-3 rounded-xl border text-center transition-all
                          ${metode===m.id ? "border-cyan-500 bg-cyan-500/15 text-cyan-300" : "border-white/10 bg-white/3 text-slate-400 hover:border-white/20"}`}>
                        <div className="text-xl mb-1">{m.icon}</div>
                        <div className="text-xs font-bold">{m.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/8 text-sm">
                    <p className="text-xs text-slate-500 mb-1">Transfer ke:</p>
                    <p className="font-bold text-white">{selectedMethod.label}: <span className="text-cyan-400 font-mono">{selectedMethod.number}</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">a.n {selectedMethod.an}</p>
                  </div>
                </div>

                {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity disabled:opacity-60">
                  {loading ? "Memproses..." : "Buat Invoice →"}
                </button>
              </div>
            )}

            {/* INVOICE */}
            {step === "invoice" && order && (
              <div className="space-y-4">
                {/* Invoice header */}
                <div className="bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-white/8">
                    <div>
                      <p className="text-slate-400 text-xs">No. Invoice</p>
                      <p className="text-white font-mono font-bold text-sm">{order.id}</p>
                    </div>
                    <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black px-3 py-1 rounded-full">PENDING</span>
                  </div>
                  <div className="px-4 py-3 space-y-2.5 text-sm">
                    {[
                      ["Nama", order.nama],
                      ["No. HP", order.hp],
                      ["Paket", order.paket],
                      ["Tanggal", formatDate(order.created_at)],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                        <span className="text-slate-400">{l}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-t border-cyan-500/20 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Total Bayar</span>
                    <span className="text-white font-black text-xl">{displayPrice}</span>
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-[#0d1117] rounded-xl border border-white/10 p-4">
                  <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">Transfer Pembayaran ke:</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedMethod.color} flex items-center justify-center text-lg`}>
                      {selectedMethod.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold">{selectedMethod.label}</p>
                      <p className="text-slate-400 text-xs">a.n {selectedMethod.an}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/8">
                    <span className="text-white font-mono font-bold text-base tracking-wider">{selectedMethod.number}</span>
                    <button onClick={()=>copy(selectedMethod.number,"no")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${copied==="no" ? "bg-green-500/20 text-green-400" : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"}`}>
                      {copied==="no" ? "Disalin!" : "Salin"}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-400/8 border border-yellow-400/20 rounded-xl p-4 text-xs text-yellow-300 flex gap-2">
                  <span className="flex-shrink-0 text-base">⚠️</span>
                  <span>Transfer tepat sesuai jumlah. Kirim bukti via WhatsApp agar token cepat diaktifkan.</span>
                </div>

                <button onClick={goWhatsApp}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Kirim Bukti via WhatsApp
                </button>
                <button onClick={()=>setStep("form")} className="w-full py-2.5 text-slate-500 text-xs hover:text-slate-300 transition-colors">Kembali ke Form</button>
              </div>
            )}

            {/* DONE */}
            {step === "done" && (
              <div className="text-center py-6">
                {/* Custom success icon */}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="text-white font-black text-xl mb-2">Bukti Terkirim!</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Admin akan memverifikasi pembayaran dan mengaktifkan token VIP kamu secepatnya.
                </p>
                <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">No. Invoice</span><span className="text-white font-mono">{order?.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Paket</span><span className="text-white">{order?.paket}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total</span><span className="text-white font-bold">{displayPrice}</span></div>
                </div>
                <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm">Selesai</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PricingSection() {
  const [pricingData, setPricingData] = useState<any>(null);
  const [showOrder, setShowOrder] = useState(false);
  const [flashExpired, setFlashExpired] = useState(false);

  useEffect(() => {
    const load = () => {
      fetch("/api/admin/sync").then(r => r.json()).then(d => {
        if (d.pricing && d.pricing.length > 0) {
          const basic = d.pricing.find((p:any) => p.id === "basic" || p.name?.toLowerCase() === "basic");
          if (basic) setPricingData(basic);
        }
      }).catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const pkg = pricingData || {
    id:"basic", name:"Basic", price:100000, priceLabel:"Rp 100.000", period:"/bulan", color:"blue",
    description:"Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.",
    features:["Sinyal saham harian","Berita pasar realtime","Chart IHSG live","Modul dasar investasi","Grup WA Basic"],
  };

  const rawFlash = pricingData?.flashSale;
  const flashSale = (rawFlash && !flashExpired) ? rawFlash : null;

  const { timeLeft, expired: timerExpired } = useFlashSaleTimer(flashSale?.endTime || null);

  useEffect(() => {
    if (timerExpired) setFlashExpired(true);
  }, [timerExpired]);

  // Color map for card
  const colorMap: any = {
    blue:  { border:"border-blue-500/40", accent:"text-blue-400", badge:"bg-blue-500", bg:"from-blue-600 to-blue-800" },
    cyan:  { border:"border-cyan-500/40", accent:"text-cyan-400", badge:"bg-cyan-500", bg:"from-cyan-600 to-blue-700" },
    gold:  { border:"border-yellow-500/40", accent:"text-yellow-400", badge:"bg-yellow-500", bg:"from-yellow-500 to-orange-600" },
    purple:{ border:"border-purple-500/40", accent:"text-purple-400", badge:"bg-purple-500", bg:"from-purple-600 to-indigo-700" },
    platinum:{ border:"border-slate-400/40", accent:"text-slate-300", badge:"bg-slate-400", bg:"from-slate-400 to-slate-600" },
    elite: { border:"border-yellow-400/60", accent:"text-yellow-400", badge:"bg-yellow-400", bg:"from-yellow-400 to-orange-500" },
  };
  const c = colorMap[pkg.color] || colorMap.blue;

  return (
    <>
      {showOrder && <OrderModal pkg={pkg} flashSale={flashSale} onClose={() => setShowOrder(false)} />}
      <section id="pricing" className="py-16 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">Paket <span className="gradient-text">VIP</span></h2>
            <p className="text-slate-500 text-sm">Mulai dari Rp 100.000/bulan — pilih level yang sesuai</p>
          </div>

          <div className="max-w-sm mx-auto">
            <TiltCard>
              <div className={`relative card-glass rounded-2xl p-6 border-2 ${c.border} hover:shadow-xl transition-all duration-300`}>
                {/* Popular badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`${c.badge} text-white text-xs font-black px-4 py-1 rounded-full`}>MULAI DARI SINI</span>
                </div>

                {/* Flash sale banner */}
                {flashSale && (
                  <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-3 mb-4 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flash-badge">FLASH SALE {flashSale.discount}</span>
                      {timeLeft && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-400">Berakhir:</span>
                          {[
                            { v: timeLeft.h, l: "J" },
                            { v: timeLeft.m, l: "M" },
                            { v: timeLeft.s, l: "D" },
                          ].map(({v, l}) => (
                            <div key={l} className="bg-red-500/20 border border-red-500/30 rounded px-1.5 py-0.5 text-center min-w-[28px]">
                              <div className="text-red-300 font-black font-mono text-sm leading-none">{String(v).padStart(2,"0")}</div>
                              <div className="text-red-400/60 text-[9px] leading-none mt-0.5">{l}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Package name */}
                <div className={`text-xl font-black ${c.accent} mb-2 mt-1`}>{pkg.name}</div>

                {/* Price */}
                {flashSale ? (
                  <div className="mb-4">
                    <div className="text-slate-500 line-through text-sm">{pkg.priceLabel}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{flashSale.price}</span>
                      <span className="text-slate-400 text-sm">{pkg.period}</span>
                    </div>
                    <div className="text-xs text-green-400 font-bold mt-0.5">Hemat {flashSale.discount}!</div>
                  </div>
                ) : (
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{pkg.priceLabel}</span>
                    <span className="text-slate-400 text-sm">{pkg.period}</span>
                  </div>
                )}

                <p className="text-slate-400 text-sm mb-5 leading-relaxed">{pkg.description}</p>

                {/* WA Group highlight */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 mb-4 text-xs text-green-300 flex items-center gap-2">
                  <span>Grup WA <strong>{pkg.name}</strong> — komunitas eksklusif</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {(pkg.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className={`${c.accent} flex-shrink-0 font-bold`}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Order button */}
                <button onClick={() => setShowOrder(true)}
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${c.bg} hover:opacity-90 transition-all hover:scale-[1.02]`}>
                  Order Paket {pkg.name} →
                </button>
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
    </>
  );
}

// ===== TESTIMONIALS =====
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animPaused = useRef(false);

  const pauseAnim = () => { if (trackRef.current) { trackRef.current.style.animationPlayState = "paused"; animPaused.current = true; } };
  const resumeAnim = () => { if (trackRef.current) { trackRef.current.style.animationPlayState = "running"; animPaused.current = false; } };

  const onTouchStart = (e: React.TouchEvent) => { pauseAnim(); isDragging.current = true; startX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const wrapper = trackRef.current.parentElement;
    if (wrapper) wrapper.scrollLeft -= dx;
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => { isDragging.current = false; setTimeout(resumeAnim, 2000); };
  const onMouseDown = (e: React.MouseEvent) => { pauseAnim(); isDragging.current = true; startX.current = e.clientX; const w = trackRef.current?.parentElement; scrollLeft.current = w?.scrollLeft || 0; };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging.current) return; const w = trackRef.current?.parentElement; if (w) w.scrollLeft = scrollLeft.current - (e.clientX - startX.current); };
  const onMouseUp = () => { isDragging.current = false; setTimeout(resumeAnim, 2000); };

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

  useEffect(() => {
    fetch("/api/testimonials").then(r => r.json()).then(d => {
      const approved = (d.testimonials || []).filter((t:any) => t.isApproved !== false);
      if (approved.length > 0) setTestimonials(approved);
      else setTestimonials(defaultTestis);
    }).catch(() => setTestimonials(defaultTestis));
  }, []);

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
                {Array(t.rating || 5).fill(0).map((_,j) => <span key={j} className="text-yellow-400 text-xs"><Icons.Star /></span>)}
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
    { q:"Apa bedanya setiap paket?", a:"Setiap paket memiliki akses sinyal, modul edukasi, dan fitur yang berbeda. Paket yang lebih tinggi mendapatkan lebih banyak sinyal, akses AI Agent, konsultasi personal, dan laporan analisis mendalam. Lihat detail di halaman Paket." },
  ];
  return (
    <section id="faq" className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Pertanyaan <span className="gradient-text">Umum</span></h2>
          <p className="text-slate-500 text-sm">Hal-hal yang sering ditanyakan</p>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="card rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 flex justify-between items-center text-left">
                <span className="font-bold text-white text-sm">{f.q}</span>
                <span className={`text-slate-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}><Icons.ChevronDown /></span>
              </button>
              {open === i && <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== WA LINKS =====
function WALinksSection() {
  return (
    <section className="py-16 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Komunitas <span className="gradient-text">Resmi</span></h2>
          <p className="text-slate-500 text-sm">Gabung grup & channel resmi Ritel Community</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <TiltCard>
            <a href="https://wa.me/6282218723401" target="_blank" className="card rounded-xl p-5 flex items-start gap-4 group block">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-white text-base mb-1">Grup WA Member</div>
                <div className="text-slate-400 text-xs">Diskusi, tanya jawab, dan update sinyal bersama member aktif lainnya</div>
              </div>
            </a>
          </TiltCard>
          <TiltCard>
            <a href="https://t.me/ritelcommunity" target="_blank" className="card rounded-xl p-5 flex items-start gap-4 group block">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#06b6d4">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-white text-base mb-1">Channel Resmi</div>
                <div className="text-slate-400 text-xs">Update sinyal, berita pasar, dan info promo eksklusif langsung dari tim kami</div>
              </div>
            </a>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

// ===== SNK =====
function SNKSection() {
  return (
    <section className="py-8 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="card-glass rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-yellow-400 flex-shrink-0 mt-0.5"><Icons.Shield /></div>
            <div>
              <div className="text-yellow-400 text-xs font-black mb-1.5 tracking-wide">DISCLAIMER</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Seluruh konten, sinyal, dan analisis yang tersedia di platform ini bersifat edukatif dan bukan merupakan saran investasi. Keputusan investasi sepenuhnya menjadi tanggung jawab masing-masing investor. Investasi saham mengandung risiko kehilangan modal. Pastikan Anda memahami risiko sebelum berinvestasi.
              </p>
            </div>
          </div>
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
            <RCLogo size={32} />
            <span className="text-white font-black text-sm">RITEL COMMUNITY<span className="text-slate-500">.ID</span></span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
            <a href="https://wa.me/6282218723401" target="_blank" className="hover:text-cyan-400 transition-colors">Hubungi Kami</a>
            <Link href="/paket" className="hover:text-cyan-400 transition-colors">Semua Paket</Link>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">© 2026 Ritel Community.ID · Platform saham edukasi</p>
            <p className="text-xs text-slate-700 mt-1">Developed by <span className="text-slate-500 font-medium">THIRAFI THARIQ AL IDRIS</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN =====
export default function HomePage() {
  const [showLoading, setShowLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    const seen = sessionStorage.getItem("rc_loading_shown");
    return !seen;
  });
  if (showLoading) return <LoadingScreen onDone={() => {
    sessionStorage.setItem("rc_loading_shown", "1");
    setShowLoading(false);
  }} />;
  return (
    <div className="min-h-screen relative">
      <GalaxyBackground />
      <MotivasiTicker />
      <div className="relative z-10">
        <Navbar />
        <div style={{ paddingTop: "80px" }}>
          <Hero />
          <MarketSection />
          <SignalsSection />
          <NewsSection />
          <AIAgentSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <WALinksSection />
          <SNKSection />
          <Footer />
        </div>
      </div>
      {/* WA Float button */}
      <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

