"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ============================================================
   SVG ICONS (Lucide-style, no emoji)
   ============================================================ */
const Icon = {
  Activity:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  LayoutDash:() => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  Newspaper: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>,
  Users:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Crown:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
  Home:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Signal:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="4"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="19.07" x2="16.24" y1="4.93" y2="7.76"/><line x1="7.76" x2="4.93" y1="16.24" y2="19.07"/></svg>,
  TrendUp:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  ArrowLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  Lock:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Zap:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Star:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  ChevRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Verified:  () => <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ============================================================
   TRADING EQUALIZER BARS
   ============================================================ */
function EqBars({ color = "" }: { color?: string }) {
  return (
    <div className={`eq-bars ${color}`}>
      {[10,16,8,18,12,6,14,10].map((_,i) => <div key={i} className="eq-bar" />)}
    </div>
  );
}

/* ============================================================
   3D GALAXY PARTICLE CANVAS
   ============================================================ */
function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Mouse parallax
    let mx = W/2, my = H/2;
    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMouse);

    const COLORS = ["rgba(255,255,255,","rgba(6,182,212,","rgba(139,92,246,","rgba(59,130,246,","rgba(52,211,153,"];
    type Star = { angle:number; orbit:number; z:number; r:number; color:string; speed:number; };
    const stars: Star[] = Array.from({length:340}, () => ({
      orbit:  60 + Math.random() * Math.max(W,H) * 0.65,
      angle:  Math.random() * Math.PI * 2,
      z:      0.2 + Math.random() * 0.8,
      r:      0.4 + Math.random() * 1.7,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      speed:  0.00012 + Math.random() * 0.00028,
    }));

    // Nebula particles
    type Nebula = { x:number; y:number; r:number; color:string; vx:number; vy:number; };
    const nebula: Nebula[] = Array.from({length:18}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 60 + Math.random() * 140,
      color: ["rgba(6,182,212,","rgba(139,92,246,","rgba(30,90,240,"][Math.floor(Math.random()*3)],
      vx: (Math.random()-.5)*0.12, vy: (Math.random()-.5)*0.12,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const cx = W/2 + (mx-W/2)*0.04;
      const cy = H*0.36 + (my-H/2)*0.03;

      // Nebula glow clouds
      nebula.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -n.r) n.x = W+n.r;
        if (n.x > W+n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = H+n.r;
        if (n.y > H+n.r) n.y = -n.r;
        const g = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
        g.addColorStop(0,  n.color+"0.045)");
        g.addColorStop(0.5,n.color+"0.02)");
        g.addColorStop(1,  "transparent");
        ctx.fillStyle = g; ctx.beginPath();
        ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
      });

      // Core galaxy center glow
      const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,W*0.45);
      cg.addColorStop(0,"rgba(6,182,212,0.06)");
      cg.addColorStop(0.35,"rgba(30,58,138,0.05)");
      cg.addColorStop(1,"transparent");
      ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);

      // Orbital stars
      stars.forEach(s => {
        s.angle += s.speed;
        const ex = cx + Math.cos(s.angle) * s.orbit;
        const ey = cy + Math.sin(s.angle) * s.orbit * 0.35; // 3D tilt
        const op = 0.25 + s.z * 0.75;
        const r  = s.r * (0.5 + s.z * 0.6);
        ctx.beginPath();
        ctx.arc(ex,ey,r,0,Math.PI*2);
        ctx.fillStyle = s.color+op+")"; ctx.fill();
        // Sparkle glow for bright stars
        if (s.z > 0.65 && s.r > 1.1) {
          const sg = ctx.createRadialGradient(ex,ey,0,ex,ey,r*4.5);
          sg.addColorStop(0, s.color+(op*.35)+")");
          sg.addColorStop(1,"transparent");
          ctx.beginPath(); ctx.arc(ex,ey,r*4.5,0,Math.PI*2);
          ctx.fillStyle=sg; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",onResize); window.removeEventListener("mousemove",onMouse); };
  }, []);
  return <canvas ref={canvasRef} id="galaxy-canvas" />;
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 3000); return () => clearTimeout(t); }, []);
  if (!visible) return null;
  return (
    <div className="loading-screen" style={{ flexDirection:"column", gap:20 }}>
      <div style={{ position:"relative", width:68, height:68 }}>
        <div className="loading-ring" />
        <div style={{ position:"absolute", inset:12, borderRadius:"50%", background:"linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.15))", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polyline points="2,18 8,12 12,15 17,7 22,5" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="18,5 22,5 22,9" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontWeight:900, fontSize:15, letterSpacing:1, color:"#fff" }}>RITEL COMMUNITY<span style={{color:"#06b6d4"}}>.ID</span></div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:4, letterSpacing:2 }}>MARKET INTELLIGENCE PLATFORM</div>
      </div>
      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:4, height:4, borderRadius:"50%", background:"rgba(6,182,212,0.5)", animation:`loadDot .9s ease-in-out ${i*0.2}s infinite alternate` }} />)}
      </div>
      <style>{`@keyframes loadDot{from{opacity:.2;transform:scale(.8)}to{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}

/* ============================================================
   MOTIVASI TICKER
   ============================================================ */
function MotivasiTicker() {
  const [list, setList] = useState([
    "Jangan takut untuk belajar — setiap langkah kecil adalah investasi untuk masa depanmu",
    "Disiplin mengalahkan emosi di pasar modal. Selalu punya rencana sebelum masuk.",
    "Risiko terbesar adalah tidak mengambil risiko sama sekali. Mulailah berinvestasi hari ini.",
  ]);
  const [speed, setSpeed] = useState(32);
  useEffect(() => {
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      if (d.motivasi?.length) setList(d.motivasi.map((m:any)=>m.text));
      if (d.ticker_speed) setSpeed(d.ticker_speed);
    }).catch(()=>{});
  },[]);
  const doubled = [...list,...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.035)", borderBottom:"1px solid rgba(234,179,8,0.07)", padding:"6px 0", overflow:"hidden", flexShrink:0, position:"relative", zIndex:2 }}>
      <div style={{ display:"flex", animation:`tickerMovePg ${speed}s linear infinite`, whiteSpace:"nowrap", alignItems:"center" }}>
        {doubled.map((text,i)=>(
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:500, margin:"0 28px", color:"rgba(234,179,8,0.55)" }}>
            <span style={{ color:"rgba(234,179,8,0.3)", fontSize:7 }}>◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HOME FEED
   ============================================================ */
function HomeFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(()=>{
    fetch("/api/admin/feed").then(r=>r.json()).then(d=>{
      if(d.success) setPosts(d.feed.filter((p:any)=>p.show_home!==false).slice(0,3));
    }).catch(()=>{});
  },[]);
  if (!posts.length) return null;
  const tagColors:any = {info:"#3b82f6",sinyal:"#22c55e",berita:"#f59e0b",analisis:"#8b5cf6",penting:"#ef4444"};
  return (
    <div style={{ padding:"0 16px", marginBottom:16 }}>
      {posts.map(p=>(
        <div key={p.id} className="glass-card fade-in-up-2" style={{ padding:"12px 14px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#1e5af0,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff",flexShrink:0 }}>RC</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                <span style={{ color:"#fff",fontWeight:800,fontSize:12 }}>Ritel Community.ID</span>
                <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}><Icon.Verified/></span>
                {p.tag && <span style={{ background:(tagColors[p.tag]||"#6b7280")+"22",color:tagColors[p.tag]||"#9ca3af",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:4,marginLeft:"auto" }}>{p.tag}</span>}
                {p.pinned && <span style={{ fontSize:10,color:"#fbbf24" }}>📌</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, lineHeight:1.65 }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   APPLE VISIONOS DOCK
   ============================================================ */
function Dock() {
  const pathname = usePathname();
  const items = [
    { href:"/",          label:"Home",     Icon:Icon.Home,     active:"/" },
    { href:"/sinyal",    label:"Sinyal",   Icon:Icon.Signal,   active:"/sinyal" },
    { href:"/workspace", label:"Chart",    Icon:Icon.TrendUp,  active:"/workspace" },
    { href:"/info",      label:"Berita",   Icon:Icon.Newspaper,active:"/info" },
    { href:"/vip",       label:"VIP",      Icon:Icon.Crown,    active:"/vip" },
  ];
  return (
    <nav className="dock-nav">
      {items.map(item => (
        <Link key={item.href} href={item.href} className={`dock-item ${pathname===item.active?"active":""}`}>
          <span className="dock-icon"><item.Icon /></span>
          <span className="dock-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/* ============================================================
   NAV ITEMS DATA
   ============================================================ */
const NAV_ITEMS = [
  { href:"/sinyal",    label:"Sinyal",       Icon:()=><Icon.Signal/>,    desc:"Sinyal saham terbaru",       color:"#22c55e", glow:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.22)",  eqColor:"green"  },
  { href:"/workspace", label:"Workspace",    Icon:()=><Icon.LayoutDash/>,desc:"Chart IHSG & panduan",       color:"#60a5fa", glow:"rgba(96,165,250,0.1)",   border:"rgba(96,165,250,0.2)",  eqColor:""       },
  { href:"/info",      label:"Info & Berita",Icon:()=><Icon.Newspaper/>, desc:"Berita pasar IDX realtime",  color:"#f59e0b", glow:"rgba(245,158,11,0.1)",   border:"rgba(245,158,11,0.2)",  eqColor:"amber"  },
  { href:"https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS", label:"Komunitas", Icon:()=><Icon.Users/>, desc:"Grup diskusi & channel WA", color:"#4ade80", glow:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.2)", eqColor:"green", external:true },
];

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function HomePage() {
  const [syncData, setSyncData] = useState<any>({});

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>setSyncData(d)).catch(()=>{});
  },[]);

  return (
    <>
      <LoadingScreen />
      <div style={{ minHeight:"100vh", background:"#030508", color:"#fff", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
        <style>{`
          @keyframes tickerMovePg{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          .nav-card-hover{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s}
          .nav-card-hover:hover{transform:translateY(-5px) scale(1.02);}
          .nav-card-hover:active{transform:scale(.97);}
        `}</style>

        {/* Galaxy BG */}
        <div className="galaxy-stars" />
        <GalaxyCanvas />

        {/* HEADER */}
        <header style={{ position:"sticky",top:0,zIndex:50,background:"rgba(3,5,8,0.82)",backdropFilter:"blur(28px) saturate(200%)",WebkitBackdropFilter:"blur(28px) saturate(200%)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div className="glow-pulse-cyan" style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#0a1628,#1e5af0)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polyline points="2,18 8,12 12,15 17,7 22,5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="18,5 22,5 22,9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:900,fontSize:14,letterSpacing:"-0.3px" }}>RITEL COMMUNITY<span style={{color:"#06b6d4"}}>.ID</span></div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.6px" }}>MARKET INTELLIGENCE PLATFORM</div>
            </div>
          </div>
          <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:11,padding:"7px 18px",borderRadius:100,textDecoration:"none",boxShadow:"0 0 18px rgba(14,165,233,0.3)" }}>Login VIP</Link>
        </header>

        <MotivasiTicker />

        <div style={{ flex:1,overflowY:"auto",paddingBottom:100,position:"relative",zIndex:1 }}>

          {/* ── HERO ── */}
          <section style={{ padding:"24px 16px 18px",textAlign:"center",position:"relative" }}>
            {/* Orbit rings */}
            <div style={{ position:"absolute",left:"50%",top:55,transform:"translateX(-50%)",width:230,height:80,borderRadius:"50%",border:"1px solid rgba(6,182,212,0.07)",pointerEvents:"none",animation:"orbitSpin 16s linear infinite" }} />
            <div style={{ position:"absolute",left:"50%",top:42,transform:"translateX(-50%)",width:300,height:105,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.05)",pointerEvents:"none",animation:"orbitSpinRev 22s linear infinite" }} />

            <div className="float-1 fade-in-up" style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(6,182,212,0.07)",border:"1px solid rgba(6,182,212,0.18)",borderRadius:100,padding:"5px 16px",marginBottom:20,fontSize:11,color:"#06b6d4",fontWeight:700,backdropFilter:"blur(8px)" }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#06b6d4",boxShadow:"0 0 8px #06b6d4",display:"inline-block" }}/>
              Platform Sinyal Saham Indonesia
            </div>

            <h1 className="fade-in-up-1" style={{ fontSize:32,fontWeight:900,lineHeight:1.16,marginBottom:12,letterSpacing:"-0.6px" }}>
              Investasi Lebih{" "}
              <span className="gradient-text">Cerdas</span>
              <br/>Bersama Kami
            </h1>
            <p className="fade-in-up-2" style={{ color:"rgba(255,255,255,0.38)",fontSize:13,lineHeight:1.75,maxWidth:280,margin:"0 auto 24px" }}>
              Sinyal trading premium, analisis mendalam, dan komunitas investor aktif Indonesia.
            </p>
            <div className="fade-in-up-3" style={{ display:"flex",gap:10,justifyContent:"center",maxWidth:320,margin:"0 auto" }}>
              <Link href="/paket" style={{ flex:1,display:"block",textAlign:"center",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"13px 0",borderRadius:14,textDecoration:"none",boxShadow:"0 0 28px rgba(14,165,233,0.28)" }}>Mulai Sekarang</Link>
              <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" style={{ flex:1,display:"block",textAlign:"center",background:"rgba(34,197,94,0.09)",border:"1px solid rgba(34,197,94,0.22)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"13px 0",borderRadius:14,textDecoration:"none" }}>WA Admin</a>
            </div>
          </section>

          {/* ── STATS ── */}
          <section style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"0 16px",marginBottom:18 }}>
            {[
              {v:(syncData.signals||[]).length||"50+",l:"Sinyal Aktif",c:"#22c55e",glow:"rgba(34,197,94,0.1)",  Icon:Icon.Signal,   delay:"0s"},
              {v:"1.000+",l:"Member Aktif",           c:"#60a5fa",glow:"rgba(96,165,250,0.08)",Icon:Icon.Users,    delay:"0.1s"},
              {v:"95%",   l:"Win Rate",               c:"#f59e0b",glow:"rgba(245,158,11,0.1)", Icon:Icon.TrendUp,  delay:"0.2s"},
            ].map((s,i)=>(
              <div key={i} className="glass-card float-2" style={{ background:`linear-gradient(145deg,${s.glow},rgba(0,0,0,0))`,padding:"14px 8px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:86,animationDelay:s.delay }}>
                <span style={{ color:s.c, marginBottom:4, display:"block" }}><s.Icon/></span>
                <div style={{ fontSize:20,fontWeight:900,color:s.c,lineHeight:1.1 }}>{s.v}</div>
                <div style={{ fontSize:9,color:"rgba(255,255,255,0.28)",marginTop:3,fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </section>

          <HomeFeed />

          {/* ── NAV CARDS ── */}
          <section style={{ padding:"0 16px",marginBottom:18 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {NAV_ITEMS.map(item => {
                const inner = (
                  <div className="nav-card-hover glass-card" style={{ background:`linear-gradient(145deg,${item.glow},rgba(255,255,255,0.01))`,borderColor:item.border,padding:"18px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:8 }}>
                    <div style={{ width:38,height:38,borderRadius:12,background:`${item.glow}`,border:`1px solid ${item.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:item.color }}>
                      <item.Icon/>
                    </div>
                    <div style={{ color:item.color,fontWeight:900,fontSize:14 }}>{item.label}</div>
                    <div style={{ color:"rgba(255,255,255,0.28)",fontSize:11,lineHeight:1.4,flex:1 }}>{item.desc}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <EqBars color={item.eqColor}/>
                      <span style={{ color:item.color,fontSize:14 }}><Icon.ChevRight/></span>
                    </div>
                  </div>
                );
                if ((item as any).external) return <a key={item.href} href={item.href} target="_blank" rel="noopener" style={{ textDecoration:"none",display:"block" }}>{inner}</a>;
                return <Link key={item.href} href={item.href} style={{ textDecoration:"none",display:"block" }}>{inner}</Link>;
              })}
            </div>
          </section>

          {/* ── SINYAL PREVIEW ── */}
          <section style={{ padding:"0 16px",marginBottom:18 }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontWeight:900,fontSize:15 }}>Sinyal Terbaru</span>
                <EqBars color="green"/>
              </div>
              <Link href="/sinyal" style={{ color:"#06b6d4",fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:4 }}>Semua <Icon.ChevRight/></Link>
            </div>
            {(syncData.signals||[]).slice(0,3).map((s:any,i:number)=>{
              const ac:any={BUY:"#22c55e",SELL:"#ef4444",HOLD:"#eab308",WATCH:"#60a5fa",ANTRI:"#a78bfa"};
              const eqC:any={BUY:"green",SELL:"red",HOLD:"amber",WATCH:"",ANTRI:"purple"};
              const c=ac[s.action]||"#6b7280";
              return (
                <div key={i} className="glass-card" style={{ padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:46,height:46,borderRadius:12,background:`${c}12`,border:`1px solid ${c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:c,flexShrink:0 }}>
                    {(s.kode||"--").slice(0,4)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                      <span style={{ color:"#fff",fontWeight:900,fontSize:14 }}>{s.kode}</span>
                      <span className="signal-badge" style={{ background:`${c}18`,color:c,border:`1px solid ${c}35` }}>{s.action}</span>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>Entry: {s.entry||"-"} · TP: {s.tp||"-"}</p>
                  </div>
                  <EqBars color={eqC[s.action]||""}/>
                </div>
              );
            })}
            {!(syncData.signals||[]).length && (
              <div className="glass-card" style={{ padding:"28px 16px",textAlign:"center",borderStyle:"dashed" }}>
                <div style={{ color:"rgba(255,255,255,0.2)",marginBottom:4 }}><Icon.Lock/></div>
                <p style={{ color:"rgba(255,255,255,0.25)",fontSize:13,marginBottom:12 }}>Login untuk lihat sinyal premium</p>
                <Link href="/login" className="btn-primary" style={{ fontSize:12,padding:"8px 20px" }}>Login VIP</Link>
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section style={{ padding:"0 16px",marginBottom:18 }}>
            <div className="glass-card animated-border float-3" style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.09),rgba(6,182,212,0.05))",border:"1px solid rgba(6,182,212,0.18)",padding:"26px 20px",textAlign:"center" }}>
              <div style={{ width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.1))",border:"1px solid rgba(6,182,212,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontWeight:900,fontSize:18,marginBottom:8 }}>Gabung 1.000+ Investor</h3>
              <p style={{ color:"rgba(255,255,255,0.38)",fontSize:13,lineHeight:1.65,marginBottom:22 }}>Sinyal premium, modul edukasi lengkap, dan komunitas aktif.</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <Link href="/paket" className="btn-primary" style={{ display:"block",fontSize:14,padding:"14px 28px" }}>Lihat Paket VIP</Link>
                <a href="https://wa.me/6282218723401?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20Ritel%20Community" target="_blank" rel="noopener" className="btn-green" style={{ display:"block",fontSize:14,padding:"14px 28px" }}>Chat Admin WA</a>
              </div>
            </div>
          </section>

          {/* ── TESTIMONI ── */}
          <section style={{ padding:"0 16px",marginBottom:16 }}>
            <a href="/testimoni" className="glass-card" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(250,204,21,0.04)",border:"1px solid rgba(250,204,21,0.13)",borderRadius:16,padding:"16px",textDecoration:"none" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:42,height:42,borderRadius:12,background:"rgba(250,204,21,0.08)",border:"1px solid rgba(250,204,21,0.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"#facc15" }}><Icon.Star/></div>
                <div>
                  <div style={{ fontWeight:800,fontSize:14,color:"#facc15" }}>Testimoni Member</div>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:2 }}>40+ ulasan · Rating 4.9/5.0</div>
                </div>
              </div>
              <span style={{ color:"rgba(255,255,255,0.22)" }}><Icon.ChevRight/></span>
            </a>
          </section>

          {/* ── KOMUNITAS ── */}
          <section style={{ padding:"0 16px",marginBottom:28 }}>
            <h3 style={{ fontWeight:900,fontSize:14,marginBottom:12,color:"rgba(255,255,255,0.7)" }}>Komunitas RC</h3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {[
                {href:"https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS",label:"Grup Diskusi",sub:"Bergabung sekarang"},
                {href:"https://whatsapp.com/channel/0029VbCVhf91noz95vIGwo23",label:"Channel WA",sub:"Follow channel"},
              ].map(c=>(
                <a key={c.href} href={c.href} target="_blank" rel="noopener"
                  className="glass-card nav-card-hover"
                  style={{ background:"rgba(37,211,102,0.04)",border:"1px solid rgba(37,211,102,0.15)",borderRadius:14,padding:"16px",textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:"rgba(37,211,102,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#25d366" }}><Icon.Users/></div>
                  <span style={{ color:"#25d366",fontWeight:800,fontSize:13 }}>{c.label}</span>
                  <span style={{ color:"rgba(255,255,255,0.28)",fontSize:10 }}>{c.sub}</span>
                </a>
              ))}
            </div>
          </section>

          <div style={{ textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.08)",paddingBottom:16 }}>
            Developed by THIRAFI THARIQ AL IDRIS
          </div>
        </div>

        {/* VISIONOS DOCK */}
        <Dock />
      </div>
    </>
  );
}
