"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ───────────── TICKER ───────────── */
function Ticker() {
  const [items, setItems] = useState([
    { kode:"IHSG", price:"7.284,6", change:"+0.82%", up:true },
    { kode:"BBCA", price:"9.475", change:"+1.45%", up:true },
    { kode:"BBRI", price:"5.225", change:"+1.26%", up:true },
    { kode:"TLKM", price:"3.870", change:"-0.51%", up:false },
    { kode:"ASII", price:"5.625", change:"+0.90%", up:true },
    { kode:"GOTO", price:"78", change:"-2.50%", up:false },
    { kode:"PTBA", price:"3.420", change:"+3.20%", up:true },
    { kode:"ADMR", price:"1.210", change:"+4.10%", up:true },
    { kode:"SIDO", price:"640", change:"+2.80%", up:true },
    { kode:"NCKL", price:"1.085", change:"-1.20%", up:false },
  ]);

  useEffect(() => {
    fetch("/api/admin/liveinfo").then(r=>r.json()).then(d => {
      if (d.stocks?.length) {
        setItems(d.stocks.map((s:any) => ({
          kode: s.kode, price: s.price, change: s.change,
          up: !String(s.change).startsWith("-"),
        })));
      }
    }).catch(()=>{});
  }, []);

  const doubled = [...items, ...items];
  return (
    <div style={{ background:"rgba(0,0,0,0.5)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"7px 0", overflow:"hidden" }}>
      <div style={{ display:"flex", animation:"tickerMove 35s linear infinite", whiteSpace:"nowrap" }}>
        {doubled.map((s, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"0 24px", fontSize:12 }}>
            <span style={{ color:"#fff", fontWeight:700 }}>{s.kode}</span>
            <span style={{ color:"rgba(255,255,255,0.5)" }}>{s.price}</span>
            <span style={{ color: s.up ? "#22c55e" : "#ef4444", fontWeight:600 }}>{s.change}</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes tickerMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ───────────── ADMIN FEED BANNER ───────────── */
function AdminFeedBanner() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/feed").then(r=>r.json()).then(d => {
      if (d.success) {
        setPosts(d.feed.filter((p:any) => p.show_home !== false).slice(0, 5));
      }
    }).catch(()=>{});
    const iv = setInterval(() => {
      fetch("/api/admin/feed").then(r=>r.json()).then(d => {
        if (d.success) setPosts(d.feed.filter((p:any) => p.show_home !== false).slice(0, 5));
      }).catch(()=>{});
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  if (posts.length === 0) return null;
  const tagColors: Record<string,string> = {
    info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444",
  };

  return (
    <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:10, maxWidth:900, margin:"0 auto" }}>
      {posts.map(p => (
        <div key={p.id} style={{
          background: p.pinned ? "rgba(30,90,240,0.08)" : "rgba(255,255,255,0.03)",
          border: p.pinned ? "1px solid rgba(30,90,240,0.3)" : "1px solid rgba(255,255,255,0.06)",
          borderRadius:12, padding:"14px 16px",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", flexShrink:0 }}>RC</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>Admin RITEL COMMUNITY.ID</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E5AF0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
                {p.pinned && <span style={{ fontSize:10, color:"#f59e0b" }}>📌 Disematkan</span>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>
                  {new Date(p.created_at).toLocaleString("id-ID", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </span>
                {p.tag && <span style={{ fontSize:10, background:`${tagColors[p.tag]||"#6b7280"}22`, color:tagColors[p.tag]||"#9ca3af", padding:"1px 6px", borderRadius:4, fontWeight:600 }}>{p.tag}</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

/* ───────────── LOADING ───────────── */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => onDone(), 2400);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"radial-gradient(ellipse at center, #040d1a 0%, #020610 60%, #000204 100%)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ opacity:phase>=1?1:0, transform:phase>=1?"scale(1)":"scale(0.5)", transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)", display:"flex", justifyContent:"center", marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#1e5af0,#00c8ff)", boxShadow:"0 0 40px rgba(30,90,240,0.6),0 0 80px rgba(30,90,240,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:"#fff" }}>RC</div>
        </div>
        <div style={{ opacity:phase>=2?1:0, transform:phase>=2?"translateY(0)":"translateY(20px)", transition:"all 0.5s ease" }}>
          <p style={{ color:"#fff", fontWeight:900, fontSize:22, letterSpacing:"0.15em" }}>RITEL COMMUNITY.ID</p>
          <p style={{ color:"#1e5af0", fontSize:12, marginTop:4, letterSpacing:"0.1em" }}>Platform Edukasi Saham #1 Indonesia</p>
        </div>
        <div style={{ opacity:phase>=3?1:0, transition:"all 0.4s ease 0.2s", marginTop:24 }}>
          <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
            {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#1e5af0", animation:`bounce 0.8s ease-in-out ${i*0.15}s infinite` }}/>)}
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

/* ───────────── TILT CARD ───────────── */
function TiltCard({ children, style={} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.02)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div ref={ref} style={{ transition:"transform 0.15s ease", ...style }} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>;
}

/* ───────────── STATS ───────────── */
const STATS = [
  { val:"12.400+", label:"Member Aktif", icon:"👥" },
  { val:"78%", label:"Win Rate Signal", icon:"🎯" },
  { val:"34 Stock", label:"Bagger Picks", icon:"🚀" },
];

/* ───────────── PAKET DATA ───────────── */
const PAKET = [
  { id:"basic", name:"VIP STARTER", price:"Rp 100.000", color:"#3b82f6", glow:"rgba(59,130,246,0.3)", badge:"⭐",
    features:["Semua Fitur Gratis","Analisa Teknikal Lengkap","Fundamental Emiten","Stock Screening Harian","4 fitur lainnya..."] },
  { id:"pro", name:"VIP PRO", price:"Rp 300.000", color:"#8b5cf6", glow:"rgba(139,92,246,0.3)", badge:"💜", popular:false,
    features:["Semua Fitur Starter","Bandarmologi Real-time","Tape Reading Intraday","Bagger Watchlist","4 fitur lainnya..."] },
  { id:"elite", name:"VIP ELITE", price:"Rp 500.000", color:"#f59e0b", glow:"rgba(245,158,11,0.35)", badge:"🏆", popular:true,
    features:["Semua Fitur Pro","Multibagger Research Lengkap","Konsultasi Portofolio","AI Agent Full Akses","4 fitur lainnya..."] },
  { id:"platinum", name:"VIP PLATINUM", price:"Rp 1.000.000", color:"#e2e8f0", glow:"rgba(226,232,240,0.2)", badge:"💎",
    features:["Semua Fitur Elite","AI Agent Premium + GPT-4","Live Session 1on1","Mentoring Private Bulanan","4 fitur lainnya..."] },
];

/* ───────────── BERITA ───────────── */
const BERITA = [
  { icon:"📈", title:"IHSG Naik 0.82% Tembus 7.300 Didorong Sektor Energi", source:"Bisnis.com", time:"2 jam lalu" },
  { icon:"🏦", title:"BI Tahan Suku Bunga 6.25% — Positif untuk Saham Perbankan", source:"Kompas", time:"4 jam lalu" },
  { icon:"⛏️", title:"Hilirisasi Nikel Dorong Emiten Tambang Rebound Kuat", source:"CNBC ID", time:"5 jam lalu" },
  { icon:"💡", title:"Saham EV & Energi Hijau Jadi Incaran Dana Asing Q2", source:"Kontan", time:"7 jam lalu" },
  { icon:"🚀", title:"ADMR Breakout Level Kuat, Volume 5x Normal", source:"IDX Channel", time:"8 jam lalu" },
  { icon:"📊", title:"Laporan Keuangan BBCA Q1 2026 Lampaui Ekspektasi Analis", source:"Detik Finance", time:"10 jam lalu" },
];

/* ───────────── TESTIMONI ───────────── */
const TESTIMONI = [
  { inisial:"AS", nama:"Andi S.", kota:"Jakarta · VIP Pro", profit:"+28%", teks:"Bandarmologi di sini beneran akurat. Gue masuk PTBA waktu ada sinyal akumulasi, 3 minggu kemudian naik 28%. Recommended banget!" },
  { inisial:"RP", nama:"Rina P.", kota:"Surabaya · VIP Starter", profit:"+15%", teks:"Sebelum gabung sering nyangkut, sekarang udah bisa filter saham yang bener. Arahan entry-nya jelas banget ada SL dan TP-nya." },
  { inisial:"BH", nama:"Budi H.", kota:"Bandung · VIP Platinum", profit:"+55%", teks:"Bagger picks-nya luar biasa. ADMR masuk di 900 keluar di 1400. AI Agent-nya juga helpful banget buat analisa cepat!" },
  { inisial:"SW", nama:"Sari W.", kota:"Medan · Member Gratis", profit:"+9%", teks:"Mulai dari yang gratis dulu, materinya udah bagus. Analisa teknikalnya detail dan mudah dipahami meski pemula." },
  { inisial:"DR", nama:"Dika R.", kota:"Yogyakarta · VIP Elite", profit:"+37%", teks:"Komunitas-nya solid, sering ada diskusi live dan update real-time. Worth banget upgrade ke VIP Elite." },
  { inisial:"ML", nama:"Mega L.", kota:"Bali · VIP Pro", profit:"+22%", teks:"Fundamental screening-nya membantu banget buat long term. Sudah 6 bulan gabung dan portofolio meningkat konsisten." },
];

/* ───────────── MAIN ───────────── */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginToken, setLoginToken] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rc_user");
    if (saved) { try { setUser(JSON.parse(saved)); setLoggedIn(true); } catch {} }
  }, []);

  const handleLogin = async () => {
    if (!loginToken.trim()) return;
    setLoginLoading(true); setLoginErr("");
    try {
      const r = await fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ token: loginToken.trim(), isNewLogin: true }) });
      const d = await r.json();
      if (d.success) {
        localStorage.setItem("rc_user", JSON.stringify(d.user));
        setUser(d.user); setLoggedIn(true); setShowLogin(false);
      } else { setLoginErr(d.message || "Token tidak valid."); }
    } catch { setLoginErr("Koneksi error."); }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("rc_user"); setUser(null); setLoggedIn(false);
  };

  if (!loaded) return <LoadingScreen onDone={() => setLoaded(true)} />;

  const S: React.CSSProperties = { fontFamily:"'Inter','Helvetica Neue',sans-serif" };

  return (
    <div style={{ ...S, background:"#04070F", color:"#fff", minHeight:"100vh" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(4,7,15,0.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 16px" }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff" }}>RC</div>
            <div>
              <div style={{ fontWeight:900, fontSize:14, letterSpacing:"0.05em" }}>RITEL COMMUNITY.ID</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>by Thirafi Thariq Al Idris</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {loggedIn ? (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Link href="/vip" style={{ background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", padding:"8px 18px", borderRadius:10, fontWeight:700, fontSize:13, textDecoration:"none" }}>Area VIP</Link>
                <button onClick={handleLogout} style={{ color:"rgba(255,255,255,0.4)", fontSize:12, background:"none", border:"none", cursor:"pointer" }}>Keluar</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(!showLogin)} style={{ background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", padding:"8px 20px", borderRadius:10, fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>
                🔑 Masuk
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={e => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div style={{ background:"#0a1628", border:"1px solid rgba(30,90,240,0.3)", borderRadius:20, padding:28, width:"100%", maxWidth:380 }}>
            <h3 style={{ color:"#fff", fontWeight:900, marginBottom:6 }}>Masuk ke Area VIP</h3>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:20 }}>Masukkan token VIP yang kamu miliki</p>
            <input value={loginToken} onChange={e => setLoginToken(e.target.value)} placeholder="Token VIP kamu..."
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:12 }}/>
            {loginErr && <p style={{ color:"#ef4444", fontSize:12, marginBottom:10 }}>{loginErr}</p>}
            <button onClick={handleLogin} disabled={loginLoading} style={{ width:"100%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", border:"none", borderRadius:12, padding:"13px", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              {loginLoading ? "Memverifikasi..." : "Masuk"}
            </button>
          </div>
        </div>
      )}

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── ADMIN FEED (jika ada) ── */}
      <AdminFeedBanner />

      {/* ── HERO ── */}
      <section style={{ padding:"72px 16px 56px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* glow bg */}
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(30,90,240,0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(30,90,240,0.1)", border:"1px solid rgba(30,90,240,0.3)", borderRadius:100, padding:"6px 16px", marginBottom:20, fontSize:12, color:"#60a5fa" }}>
            🔥 Platform Analisa Saham #1 Indonesia
          </div>
          <h1 style={{ fontSize:"clamp(32px,6vw,60px)", fontWeight:900, lineHeight:1.1, marginBottom:20 }}>
            Investasi Cerdas,{" "}
            <span style={{ background:"linear-gradient(135deg,#1e5af0,#00c8ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Profit Konsisten</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"clamp(14px,2vw,18px)", lineHeight:1.6, marginBottom:36, maxWidth:560, margin:"0 auto 36px" }}>
            Bandarmologi, Fundamental, Arahan Entry, Tape Reading, Bagger Pick, dan AI Agent analisa saham eksklusif.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/paket" style={{ background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", padding:"14px 32px", borderRadius:14, fontWeight:800, fontSize:15, textDecoration:"none", boxShadow:"0 0 30px rgba(30,90,240,0.4)" }}>
              Mulai Sekarang
            </Link>
            <a href="https://wa.me/6282218723401" target="_blank" rel="noreferrer" style={{ background:"rgba(255,255,255,0.06)", color:"#fff", padding:"14px 32px", borderRadius:14, fontWeight:700, fontSize:15, textDecoration:"none", border:"1px solid rgba(255,255,255,0.1)" }}>
              💬 WA Admin
            </a>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:44, flexWrap:"wrap" }}>
            {STATS.map(s => (
              <div key={s.val} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 24px", minWidth:120 }}>
                <div style={{ fontSize:22 }}>{s.icon}</div>
                <div style={{ color:"#fff", fontWeight:900, fontSize:20, marginTop:4 }}>{s.val}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRADINGVIEW ── */}
      <section style={{ padding:"0 16px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:8, height:8, background:"#22c55e", borderRadius:"50%", animation:"pulseDot 1.5s ease-in-out infinite" }}/>
            <span style={{ fontWeight:700, fontSize:14 }}>IHSG</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>LIVE</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>IDX Composite · Real-time via TradingView</span>
          </div>
          <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", height:400 }}>
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tv_widget&symbol=IDX%3ACOMPOSITE&interval=D&theme=dark&style=1&locale=id&toolbar_bg=%230d1117&enable_publishing=false&hide_top_toolbar=false&hide_legend=false&save_image=false&calendar=false&hide_volume=false&widgetbar_width=0&details=false&hotlist=false&backgroundColor=rgba(4%2C7%2C15%2C1)"
              style={{ width:"100%", height:"100%", border:"none" }}
              allowTransparency
            />
          </div>
        </div>
        <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </section>

      {/* ── PAKET (preview 4 cards) ── */}
      <section style={{ padding:"0 16px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:900, marginBottom:6 }}>💎 Pilih Paket Member</h2>
            </div>
            <Link href="/paket" style={{ color:"#60a5fa", fontSize:13, fontWeight:600, textDecoration:"none" }}>Lihat Semua →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {PAKET.map(p => (
              <TiltCard key={p.id} style={{ position:"relative" }}>
                {p.popular && (
                  <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:p.color, color:"#000", fontSize:10, fontWeight:900, padding:"3px 12px", borderRadius:100, whiteSpace:"nowrap", zIndex:2 }}>TERPOPULER</div>
                )}
                <div style={{ background:`rgba(4,7,15,0.9)`, border:`1px solid ${p.color}50`, borderRadius:20, padding:"24px 20px", height:"100%", boxShadow: p.popular ? `0 0 32px ${p.glow}` : "none" }}>
                  <div style={{ fontSize:24, marginBottom:10 }}>{p.badge}</div>
                  <div style={{ fontSize:11, color:p.color, fontWeight:800, letterSpacing:"0.1em", marginBottom:6 }}>{p.name}</div>
                  <div style={{ fontSize:22, fontWeight:900, marginBottom:16 }}>{p.price}<span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>/bulan</span></div>
                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 20px", display:"flex", flexDirection:"column", gap:8 }}>
                    {p.features.map((f, i) => (
                      <li key={i} style={{ fontSize:12, color:"rgba(255,255,255,0.7)", display:"flex", alignItems:"flex-start", gap:8 }}>
                        <span style={{ color:p.color, flexShrink:0, marginTop:1 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20saya%20mau%20order%20paket%20${p.name}`} target="_blank" rel="noreferrer"
                    style={{ display:"block", width:"100%", padding:"11px", borderRadius:12, textAlign:"center", background: p.popular ? `linear-gradient(135deg,${p.color},#1e5af0)` : `${p.color}22`, color: p.popular ? "#000" : p.color, fontWeight:700, fontSize:13, textDecoration:"none", border:`1px solid ${p.color}50`, boxSizing:"border-box" }}>
                    💬 Order WA
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── BERITA ── */}
      <section style={{ padding:"0 16px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, marginBottom:20 }}>📰 Berita Pasar</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {BERITA.map((b, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{b.icon}</span>
                <div>
                  <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:600, lineHeight:1.4, marginBottom:6 }}>{b.title}</p>
                  <div style={{ display:"flex", gap:12 }}>
                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>{b.source}</span>
                    <span style={{ color:"rgba(255,255,255,0.25)", fontSize:11 }}>·</span>
                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>{b.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI AGENT ── */}
      <section style={{ padding:"0 16px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.12),rgba(0,200,255,0.06))", border:"1px solid rgba(30,90,240,0.25)", borderRadius:24, padding:"36px 32px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
            <h2 style={{ fontWeight:900, fontSize:22, marginBottom:8 }}>AI Agent Analisa Saham</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginBottom:20 }}>Eksklusif paket VIP Pro ke atas</p>
            <a href="https://wa.me/6282218723401?text=Halo%20admin%2C%20saya%20mau%20coba%20AI%20Agent" target="_blank" rel="noreferrer"
              style={{ display:"inline-block", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", padding:"13px 32px", borderRadius:12, fontWeight:800, fontSize:14, textDecoration:"none" }}>
              🤖 Tanya AI Agent via WA
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section style={{ padding:"0 16px 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
            <div>
              <h2 style={{ fontWeight:900, fontSize:"clamp(20px,3vw,28px)", marginBottom:4 }}>⭐ Testimoni Member</h2>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", gap:2 }}>{"★★★★★".split("").map((s,i) => <span key={i} style={{ color:"#f59e0b", fontSize:16 }}>{s}</span>)}</div>
                <span style={{ fontWeight:700, fontSize:16 }}>4.9</span>
                <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>1.847 ulasan</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
            {TESTIMONI.map((t, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff", flexShrink:0 }}>{t.inisial}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{t.nama}</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{t.kota}</div>
                  </div>
                  <div style={{ marginLeft:"auto", background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"4px 10px", color:"#22c55e", fontWeight:800, fontSize:13 }}>{t.profit}</div>
                </div>
                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, lineHeight:1.6 }}>"{t.teks}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"28px 16px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:"#fff" }}>RC</div>
          <div style={{ fontWeight:900, fontSize:14 }}>RITEL COMMUNITY.ID</div>
        </div>
        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12, marginBottom:6 }}>by Thirafi Thariq Al Idris</p>
        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12, marginBottom:12 }}>Admin WA: 082218723401</p>
        <p style={{ color:"rgba(255,255,255,0.2)", fontSize:11, marginBottom:16 }}>⚠️ Platform edukasi investasi. Bukan lembaga keuangan resmi.</p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/admin" style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textDecoration:"none" }}>🔐 Admin Panel</Link>
          <Link href="/paket" style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textDecoration:"none" }}>📋 Semua Paket</Link>
          <Link href="/vip" style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textDecoration:"none" }}>💎 Area VIP</Link>
        </div>
      </footer>
    </div>
  );
}
