"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div style={{ background:"rgba(234,179,8,0.04)", borderBottom:"1px solid rgba(234,179,8,0.08)", padding:"7px 0", overflow:"hidden", flexShrink:0 }}>
      <div style={{ display:"flex", animation:`motivasiMove ${speed}s linear infinite`, whiteSpace:"nowrap", alignItems:"center" }}>
        {doubled.map((text, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:12, fontWeight:500, margin:"0 32px", color:"rgba(234,179,8,0.65)" }}>
            <span style={{ color:"rgba(234,179,8,0.35)", fontSize:8 }}>●</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

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
        <div key={p.id} style={{ background:p.pinned?"rgba(30,90,240,0.07)":"rgba(255,255,255,0.03)", border:p.pinned?"1px solid rgba(30,90,240,0.25)":"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fff", flexShrink:0 }}>RC</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>Ritel Community.ID</span>
                {/* Instagram-style verified badge */}
                <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {p.tag && <span style={{ background:(tagColors[p.tag]||"#6b7280")+"22", color:tagColors[p.tag]||"#9ca3af", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:4, marginLeft:"auto" }}>{p.tag}</span>}
                {p.pinned && <span style={{ fontSize:9, color:"#fbbf24" }}>📌</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, lineHeight:1.6 }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

// 4 nav items - simetris 2x2 grid, semua same height
const NAV_ITEMS = [
  { href:"/sinyal",    label:"Sinyal",      icon:"📡", desc:"Sinyal saham terbaru",      color:"#22c55e", bg:"rgba(34,197,94,0.08)",   border:"rgba(34,197,94,0.2)" },
  { href:"/workspace", label:"Workspace",   icon:"💼", desc:"Chart IHSG & panduan",      color:"#1e5af0", bg:"rgba(30,90,240,0.08)",   border:"rgba(30,90,240,0.2)" },
  { href:"/info",      label:"Info & Berita",icon:"📰", desc:"Berita pasar IDX realtime", color:"#f59e0b", bg:"rgba(245,158,11,0.08)",  border:"rgba(245,158,11,0.2)" },
  { href:"https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS", label:"Komunitas", icon:"💬", desc:"Grup diskusi & channel WA", color:"#22c55e", bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.2)", external:true },
];

export default function HomePage() {
  const [syncData, setSyncData] = useState<any>({});

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>setSyncData(d)).catch(()=>{});
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:"#04060f", color:"#fff", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,'Helvetica Neue',sans-serif" }}>
      <style>{`
        @keyframes motivasiMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .galaxy-stars { position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(30,58,138,0.15) 0%,transparent 60%),radial-gradient(ellipse at bottom right,rgba(5,150,105,0.07) 0%,transparent 50%);pointer-events:none;z-index:0; }
        .nav-card { transition: transform 0.15s, box-shadow 0.15s; }
        .nav-card:active { transform: scale(0.97); }
      `}</style>
      <div className="galaxy-stars" />

      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(4,6,15,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#0f2e6e,#1e5af0)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <polyline points="2,16 7,10 10,13 14,6 18,4" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="15,4 18,4 18,7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:900,fontSize:14,letterSpacing:"-0.3px" }}>RITEL COMMUNITY<span style={{ color:"#60a5fa" }}>.ID</span></div>
            <div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"0.5px" }}>SINYAL SAHAM INDONESIA</div>
          </div>
        </div>
        <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:11,padding:"7px 16px",borderRadius:100,textDecoration:"none" }}>Login VIP</Link>
      </div>

      <MotivasiTicker />

      <div style={{ flex:1,overflowY:"auto",paddingBottom:80,position:"relative",zIndex:1 }}>
        {/* Hero */}
        <div style={{ padding:"24px 16px 20px",textAlign:"center" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(30,90,240,0.1)",border:"1px solid rgba(30,90,240,0.2)",borderRadius:100,padding:"4px 14px",marginBottom:16,fontSize:11,color:"#60a5fa",fontWeight:700 }}>
            🇮🇩 Platform Sinyal Saham Indonesia
          </div>
          <h1 style={{ fontSize:28,fontWeight:900,lineHeight:1.2,marginBottom:10,letterSpacing:"-0.5px" }}>
            Investasi Lebih <span style={{ background:"linear-gradient(135deg,#1e5af0,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Cerdas</span>
            <br/>Bersama Kami
          </h1>
          <p style={{ color:"rgba(255,255,255,0.45)",fontSize:13,lineHeight:1.7,maxWidth:280,margin:"0 auto 20px" }}>Sinyal trading premium, analisis mendalam, dan komunitas investor aktif Indonesia.</p>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            <Link href="/paket" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"11px 24px",borderRadius:12,textDecoration:"none" }}>Mulai Sekarang</Link>
            <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" style={{ background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.25)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"11px 24px",borderRadius:12,textDecoration:"none" }}>WA Admin</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,padding:"0 16px",marginBottom:20 }}>
          {[{v:(syncData.signals||[]).length||"50+",l:"Sinyal Aktif",c:"#22c55e"},{v:"1.000+",l:"Member VIP",c:"#1e5af0"},{v:"95%",l:"Akurasi",c:"#f59e0b"}].map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 10px",textAlign:"center" }}>
              <div style={{ fontSize:20,fontWeight:900,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <HomeFeed />

        {/* ===== NAV CARDS - Simetris 2x2 sama tinggi ===== */}
        <div style={{ padding:"0 16px",marginBottom:16 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {NAV_ITEMS.map(item => {
              const inner = (
                <div className="nav-card" style={{ background:item.bg,border:`1px solid ${item.border}`,borderRadius:16,padding:"18px 16px",height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:8 }}>
                  <div style={{ fontSize:26 }}>{item.icon}</div>
                  <div style={{ color:item.color,fontWeight:900,fontSize:14 }}>{item.label}</div>
                  <div style={{ color:"rgba(255,255,255,0.35)",fontSize:11,lineHeight:1.4,flex:1 }}>{item.desc}</div>
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
        <div style={{ padding:"0 16px",marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <span style={{ fontWeight:900,fontSize:15 }}>📡 Sinyal Terbaru</span>
            <Link href="/sinyal" style={{ color:"#60a5fa",fontSize:12,fontWeight:700,textDecoration:"none" }}>Lihat semua →</Link>
          </div>
          {(syncData.signals||[]).slice(0,3).map((s:any,i:number)=>{
            const ac: any = { BUY:"#22c55e",SELL:"#ef4444",HOLD:"#eab308",WATCH:"#60a5fa",ANTRI:"#a78bfa" };
            return (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:42,height:42,borderRadius:10,background:`${ac[s.action]||"#6b7280"}15`,border:`1px solid ${ac[s.action]||"#6b7280"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:ac[s.action]||"#fff",flexShrink:0 }}>
                  {(s.kode||"--").slice(0,4)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ color:"#fff",fontWeight:800,fontSize:14 }}>{s.kode}</span>
                    <span style={{ background:`${ac[s.action]||"#6b7280"}22`,color:ac[s.action]||"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:5 }}>{s.action}</span>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>Entry: {s.entry||"-"} · TP: {s.tp||"-"}</p>
                </div>
                <Link href="/sinyal" style={{ color:"#60a5fa",fontSize:12,textDecoration:"none" }}>→</Link>
              </div>
            );
          })}
          {!(syncData.signals||[]).length && (
            <div style={{ background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.08)",borderRadius:14,padding:"24px 16px",textAlign:"center" }}>
              <p style={{ color:"rgba(255,255,255,0.3)",fontSize:13 }}>Login untuk lihat sinyal premium</p>
              <Link href="/login" style={{ display:"inline-block",marginTop:10,background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:700,fontSize:12,padding:"8px 20px",borderRadius:10,textDecoration:"none" }}>Login VIP</Link>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ padding:"0 16px",marginBottom:20 }}>
          <div style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.12),rgba(6,182,212,0.08))",border:"1px solid rgba(30,90,240,0.2)",borderRadius:20,padding:"24px 20px",textAlign:"center" }}>
            <div style={{ fontSize:32,marginBottom:12 }}>🚀</div>
            <h3 style={{ fontWeight:900,fontSize:18,marginBottom:8 }}>Gabung 1.000+ Investor</h3>
            <p style={{ color:"rgba(255,255,255,0.45)",fontSize:13,lineHeight:1.6,marginBottom:20 }}>Sinyal premium, modul edukasi lengkap, dan komunitas aktif.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <Link href="/paket" style={{ display:"block",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:14,padding:"13px 28px",borderRadius:12,textDecoration:"none" }}>Lihat Paket VIP</Link>
              <a href="https://wa.me/6282218723401?text=Halo%20Admin%2C%20saya%20tertarik%20bergabung%20Ritel%20Community" target="_blank" rel="noopener" style={{ display:"block",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.25)",color:"#22c55e",fontWeight:800,fontSize:14,padding:"13px 28px",borderRadius:12,textDecoration:"none" }}>Chat Admin WA</a>
            </div>
          </div>
        </div>

        {/* Grup & Channel */}
        <div style={{ padding:"0 16px",marginBottom:24 }}>
          <h3 style={{ fontWeight:900,fontSize:14,marginBottom:12 }}>💬 Komunitas RC</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <a href="https://chat.whatsapp.com/JzF3gCFvZsbJrx3KuVtQeS" target="_blank" rel="noopener"
              style={{ background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:14,padding:"16px",textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:28 }}>👥</span>
              <span style={{ color:"#25d366",fontWeight:800,fontSize:13 }}>Grup Diskusi</span>
              <span style={{ color:"rgba(255,255,255,0.35)",fontSize:10 }}>Bergabung sekarang</span>
            </a>
            <a href="https://whatsapp.com/channel/0029VbCVhf91noz95vIGwo23" target="_blank" rel="noopener"
              style={{ background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:14,padding:"16px",textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:28 }}>📢</span>
              <span style={{ color:"#25d366",fontWeight:800,fontSize:13 }}>Channel WA</span>
              <span style={{ color:"rgba(255,255,255,0.35)",fontSize:10 }}>Follow channel</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
