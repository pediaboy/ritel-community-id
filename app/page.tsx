"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ===== TRADING BARS (mengganti heartbeat pulse) ===== */
function TradingBars({ color = "cyan" }: { color?: "cyan"|"green"|"red"|"amber" }) {
  return (
    <div className={`trading-bars ${color === "cyan" ? "" : color}`}>
      {[10,16,8,18,12,6,14,10].map((h,i) => (
        <div key={i} className="trading-bar" style={{ height: h }} />
      ))}
    </div>
  );
}

/* ===== 3D GALAXY CANVAS ===== */
function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    interface Star { x:number; y:number; z:number; r:number; color:string; speed:number; angle:number; orbit:number; }
    const COLORS = ["rgba(255,255,255,", "rgba(6,182,212,", "rgba(139,92,246,", "rgba(59,130,246,"];
    const stars: Star[] = Array.from({ length: 320 }, () => {
      const orbit = 80 + Math.random() * Math.max(W,H) * 0.6;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: 0, y: 0, z: Math.random(),
        r: 0.4 + Math.random() * 1.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.00015 + Math.random() * 0.0003,
        angle, orbit,
      };
    });

    let frame = 0;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Radial galaxy glow center
      const grd = ctx.createRadialGradient(W/2, H*0.35, 0, W/2, H*0.35, W*0.55);
      grd.addColorStop(0, "rgba(6,182,212,0.05)");
      grd.addColorStop(0.4, "rgba(30,58,138,0.06)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H * 0.38;
      stars.forEach(s => {
        s.angle += s.speed;
        // Elliptical orbit (3D tilt effect)
        const ex = cx + Math.cos(s.angle) * s.orbit;
        const ey = cy + Math.sin(s.angle) * s.orbit * 0.38; // flatten Y = 3D perspective
        const opacity = 0.3 + s.z * 0.7;
        const r = s.r * (0.6 + s.z * 0.6);
        ctx.beginPath();
        ctx.arc(ex, ey, r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + opacity + ")";
        ctx.fill();
        // Tiny glow for bright stars
        if (s.z > 0.7 && s.r > 1.2) {
          const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 4);
          glow.addColorStop(0, s.color + (opacity * 0.4) + ")");
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(ex, ey, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} id="galaxy-canvas" />;
}

/* ===== MOTIVASI TICKER ===== */
function MotivasiTicker() {
  const [list, setList] = useState([
    "Jangan takut untuk belajar — setiap langkah kecil adalah investasi untuk masa depanmu",
    "Disiplin mengalahkan emosi di pasar modal. Selalu punya rencana sebelum masuk.",
    "Risiko terbesar adalah tidak mengambil risiko sama sekali. Mulailah berinvestasi hari ini.",
  ]);
  const [speed, setSpeed] = useState(32);
  useEffect(() => {
    fetch("/api/admin/sync").then(r=>r.json()).then(d => {
      if (d.motivasi?.length) setList(d.motivasi.map((m: any) => m.text));
      if (d.ticker_speed) setSpeed(d.ticker_speed);
    }).catch(()=>{});
  }, []);
  const doubled = [...list, ...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.04)", borderBottom:"1px solid rgba(234,179,8,0.07)", padding:"6px 0", overflow:"hidden", flexShrink:0 }}>
      <div style={{ display:"flex", animation:`motivasiMove ${speed}s linear infinite`, whiteSpace:"nowrap", alignItems:"center" }}>
        {doubled.map((text, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:500, margin:"0 28px", color:"rgba(234,179,8,0.6)" }}>
            <span style={{ color:"rgba(234,179,8,0.3)", fontSize:7 }}>◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===== HOME FEED ===== */
function HomeFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/feed").then(r=>r.json()).then(d=>{
      if (d.success) setPosts(d.feed.filter((p:any)=>p.show_home!==false).slice(0,3));
    }).catch(()=>{});
  },[]);
  if (!posts.length) return null;
  const tagColors: any = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };
  return (
    <div style={{ padding:"0 16px", marginBottom:16 }}>
      {posts.map(p=>(
        <div key={p.id} className="glass-card" style={{ padding:"12px 14px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fff", flexShrink:0 }}>RC</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>Ritel Community.ID</span>
                <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {p.tag && <span style={{ background:(tagColors[p.tag]||"#6b7280")+"22", color:tagColors[p.tag]||"#9ca3af", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:4, marginLeft:"auto" }}>{p.tag}</span>}
                {p.pinned && <span style={{ fontSize:9, color:"#fbbf24" }}>📌</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, lineHeight:1.6 }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

const NAV_ITEMS = [
  { href:"/sinyal",    label:"Sinyal",       icon:"📡", desc:"Sinyal saham terbaru",      color:"#22c55e", glow:"rgba(34,197,94,0.15)",   border:"rgba(34,197,94,0.25)" },
  { href:"/workspace", label:"Workspace",    icon:"💼", desc:"Chart IHSG & panduan",      color:"#60a5fa", glow:"rgba(96,165,250,0.12)",   border:"rgba(96,165,250,0.25)" },
  { href:"/info",      label:"Info & Berita",icon:"📰", desc:"Berita pasar IDX realtime", color:"#f59e0b", glow:"rgba(245,158,11,0.12)",   border:"rgba(245,158,11,0.25)" },
  { href:"https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS", label:"Komunitas", icon:"💬", desc:"Grup diskusi & channel WA", color:"#4ade80", glow:"rgba(74,222,128,0.12)", border:"rgba(74,222,128,0.25)", external:true },
];

export default function HomePage() {
  const [syncData, setSyncData] = useState<any>({});

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>setSyncData(d)).catch(()=>{});
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:"#04060f", color:"#fff", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"'Inter',sans-serif" }}>
      <style>{`
        @keyframes motivasiMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .nav-card { transition: transform 0.2s, box-shadow 0.2s; }
        .nav-card:active { transform: scale(0.96); }
        .nav-card:hover  { transform: translateY(-4px); }
      `}</style>

      {/* 3D Galaxy Canvas */}
      <GalaxyCanvas />

      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(4,6,15,0.88)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div className="glow-cyan" style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#0a1628,#1e5af0)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="2,18 8,12 12,15 17,7 22,5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="18,5 22,5 22,9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:900,fontSize:14,letterSpacing:"-0.3px" }}>RITEL COMMUNITY<span style={{ color:"#06b6d4" }}>.ID</span></div>
            <div style={{ fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.5px" }}>SINYAL SAHAM INDONESIA</div>
          </div>
        </div>
        <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:11,padding:"7px 16px",borderRadius:100,textDecoration:"none",boxShadow:"0 0 16px rgba(14,165,233,0.3)" }}>Login VIP</Link>
      </div>

      <MotivasiTicker />

      <div style={{ flex:1,overflowY:"auto",paddingBottom:88,position:"relative",zIndex:1 }}>

        {/* Hero */}
        <div style={{ padding:"20px 16px 16px",textAlign:"center",position:"relative" }}>
          {/* Orbit deco rings */}
          <div style={{ position:"absolute",left:"50%",top:60,transform:"translateX(-50%)",width:220,height:80,borderRadius:"50%",border:"1px solid rgba(6,182,212,0.08)",pointerEvents:"none",animation:"orbitSpin 14s linear infinite" }} />
          <div style={{ position:"absolute",left:"50%",top:50,transform:"translateX(-50%)",width:290,height:100,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.06)",pointerEvents:"none",animation:"orbitSpin 20s linear infinite reverse" }} />

          <div className="float-anim" style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:100,padding:"4px 14px",marginBottom:18,fontSize:11,color:"#06b6d4",fontWeight:700,backdropFilter:"blur(8px)" }}>
            🇮🇩 Platform Sinyal Saham Indonesia
          </div>
          <h1 style={{ fontSize:30,fontWeight:900,lineHeight:1.18,marginBottom:10,letterSpacing:"-0.5px" }}>
            Investasi Lebih{" "}
            <span className="gradient-text">Cerdas</span>
            <br/>Bersama Kami
          </h1>
          <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.7,maxWidth:280,margin:"0 auto 22px" }}>Sinyal trading premium, analisis mendalam, dan komunitas investor aktif Indonesia.</p>
          <div style={{ display:"flex",gap:10,justifyContent:"center",maxWidth:320,margin:"0 auto" }}>
            <Link href="/paket" style={{ flex:1,display:"block",textAlign:"center",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"13px 0",borderRadius:14,textDecoration:"none",boxShadow:"0 0 24px rgba(14,165,233,0.3)" }}>Mulai Sekarang</Link>
            <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" style={{ flex:1,display:"block",textAlign:"center",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"13px 0",borderRadius:14,textDecoration:"none" }}>WA Admin</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"0 16px",marginBottom:16 }}>
          {[
            {v:(syncData.signals||[]).length||"50+",l:"Sinyal Aktif",c:"#22c55e",icon:"📡",glow:"rgba(34,197,94,0.12)"},
            {v:"1.000+",l:"Member Aktif",c:"#60a5fa",icon:"👥",glow:"rgba(96,165,250,0.1)"},
            {v:"95%",l:"Win Rate",c:"#f59e0b",icon:"🎯",glow:"rgba(245,158,11,0.1)"}
          ].map(s=>(
            <div key={s.l} className="float-anim-slow glass-card" style={{ background:`linear-gradient(135deg,${s.glow},rgba(0,0,0,0))`,padding:"14px 8px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:84 }}>
              <div style={{ fontSize:18,marginBottom:3 }}>{s.icon}</div>
              <div style={{ fontSize:19,fontWeight:900,color:s.c,lineHeight:1.1 }}>{s.v}</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:3,fontWeight:600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <HomeFeed />

        {/* NAV CARDS */}
        <div style={{ padding:"0 16px",marginBottom:18 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {NAV_ITEMS.map(item => {
              const inner = (
                <div className="nav-card glass-card" style={{ background:`linear-gradient(145deg,${item.glow},rgba(255,255,255,0.01))`,borderColor:item.border,padding:"18px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:8 }}>
                  <div style={{ fontSize:26 }}>{item.icon}</div>
                  <div style={{ color:item.color,fontWeight:900,fontSize:14 }}>{item.label}</div>
                  <div style={{ color:"rgba(255,255,255,0.3)",fontSize:11,lineHeight:1.4,flex:1 }}>{item.desc}</div>
                  <div style={{ display:"flex",justifyContent:"flex-end" }}>
                    <TradingBars color={item.label==="Sinyal"?"green":item.label==="Info & Berita"?"amber":"cyan"} />
                  </div>
                </div>
              );
              if ((item as any).external) {
                return <a key={item.href} href={item.href} target="_blank" rel="noopener" style={{ textDecoration:"none",display:"block" }}>{inner}</a>;
              }
              return <Link key={item.href} href={item.href} style={{ textDecoration:"none",display:"block" }}>{inner}</Link>;
            })}
          </div>
        </div>

        {/* Sinyal preview */}
        <div style={{ padding:"0 16px",marginBottom:18 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontWeight:900,fontSize:15 }}>📡 Sinyal Terbaru</span>
              {/* Trading bars indicator — mengganti heartbeat */}
              <TradingBars color="green" />
            </div>
            <Link href="/sinyal" style={{ color:"#06b6d4",fontSize:12,fontWeight:700,textDecoration:"none" }}>Lihat semua →</Link>
          </div>
          {(syncData.signals||[]).slice(0,3).map((s:any,i:number)=>{
            const ac: any = { BUY:"#22c55e",SELL:"#ef4444",HOLD:"#eab308",WATCH:"#60a5fa",ANTRI:"#a78bfa" };
            const barColor: "green"|"red"|"amber"|"cyan" =
              s.action==="BUY"?"green": s.action==="SELL"?"red": s.action==="HOLD"||s.action==="WATCH"?"amber":"cyan";
            return (
              <div key={i} className="glass-card" style={{ padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:`${ac[s.action]||"#6b7280"}14`,border:`1px solid ${ac[s.action]||"#6b7280"}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:ac[s.action]||"#fff",flexShrink:0,flexDirection:"column",gap:2 }}>
                  <span>{(s.kode||"--").slice(0,4)}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                    <span style={{ color:"#fff",fontWeight:800,fontSize:14 }}>{s.kode}</span>
                    <span style={{ background:`${ac[s.action]||"#6b7280"}20`,color:ac[s.action]||"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:5 }}>{s.action}</span>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>Entry: {s.entry||"-"} · TP: {s.tp||"-"}</p>
                </div>
                {/* Trading bars instead of pulse dot */}
                <TradingBars color={barColor} />
                <Link href="/sinyal" style={{ color:"rgba(255,255,255,0.2)",fontSize:14,textDecoration:"none",marginLeft:2 }}>→</Link>
              </div>
            );
          })}
          {!(syncData.signals||[]).length && (
            <div className="glass-card" style={{ padding:"24px 16px",textAlign:"center",borderStyle:"dashed" }}>
              <p style={{ color:"rgba(255,255,255,0.25)",fontSize:13 }}>Login untuk lihat sinyal premium</p>
              <Link href="/login" style={{ display:"inline-block",marginTop:10,background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:700,fontSize:12,padding:"8px 20px",borderRadius:10,textDecoration:"none" }}>Login VIP</Link>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div style={{ padding:"0 16px",marginBottom:18 }}>
          <div className="glass-card neon-border float-anim" style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.1),rgba(6,182,212,0.06))",border:"1px solid rgba(6,182,212,0.2)",padding:"24px 20px",textAlign:"center" }}>
            <div style={{ fontSize:34,marginBottom:10 }}>🚀</div>
            <h3 style={{ fontWeight:900,fontSize:18,marginBottom:8 }}>Gabung 1.000+ Investor</h3>
            <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.6,marginBottom:20 }}>Sinyal premium, modul edukasi lengkap, dan komunitas aktif.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <Link href="/paket" style={{ display:"block",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:14,padding:"13px 28px",borderRadius:12,textDecoration:"none",boxShadow:"0 0 20px rgba(14,165,233,0.25)" }}>Lihat Paket VIP</Link>
              <a href="https://wa.me/6282218723401?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20Ritel%20Community" target="_blank" rel="noopener" style={{ display:"block",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.22)",color:"#22c55e",fontWeight:800,fontSize:14,padding:"13px 28px",borderRadius:12,textDecoration:"none" }}>Chat Admin WA</a>
            </div>
          </div>
        </div>

        {/* Testimoni */}
        <div style={{ padding:"0 16px",marginBottom:16 }}>
          <a href="/testimoni" className="glass-card" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(250,204,21,0.05)",border:"1px solid rgba(250,204,21,0.15)",borderRadius:16,padding:"16px",textDecoration:"none" }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ fontSize:28 }}>⭐</span>
              <div>
                <div style={{ fontWeight:800,fontSize:14,color:"#facc15" }}>Testimoni Member</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2 }}>40+ ulasan · Rating 4.9/5.0</div>
              </div>
            </div>
            <span style={{ color:"rgba(255,255,255,0.25)",fontSize:18 }}>→</span>
          </a>
        </div>

        {/* Komunitas */}
        <div style={{ padding:"0 16px",marginBottom:28 }}>
          <h3 style={{ fontWeight:900,fontSize:14,marginBottom:12 }}>💬 Komunitas RC</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <a href="https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS" target="_blank" rel="noopener"
              className="glass-card nav-card"
              style={{ background:"rgba(37,211,102,0.06)",border:"1px solid rgba(37,211,102,0.18)",borderRadius:14,padding:"16px",textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:28 }}>👥</span>
              <span style={{ color:"#25d366",fontWeight:800,fontSize:13 }}>Grup Diskusi</span>
              <span style={{ color:"rgba(255,255,255,0.3)",fontSize:10 }}>Bergabung sekarang</span>
            </a>
            <a href="https://whatsapp.com/channel/0029VbCVhf91noz95vIGwo23" target="_blank" rel="noopener"
              className="glass-card nav-card"
              style={{ background:"rgba(37,211,102,0.06)",border:"1px solid rgba(37,211,102,0.18)",borderRadius:14,padding:"16px",textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:28 }}>📢</span>
              <span style={{ color:"#25d366",fontWeight:800,fontSize:13 }}>Channel WA</span>
              <span style={{ color:"rgba(255,255,255,0.3)",fontSize:10 }}>Follow channel</span>
            </a>
          </div>
        </div>

        <div style={{ textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.1)",paddingBottom:16 }}>
          Developed by THIRAFI THARIQ AL IDRIS
        </div>
      </div>
    </div>
  );
}
