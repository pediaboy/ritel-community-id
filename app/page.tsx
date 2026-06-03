"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Motivasi ticker
function MotivasiTicker() {
  const [list, setList] = useState([
    "Jangan takut untuk belajar — setiap langkah kecil adalah investasi untuk masa depanmu",
    "Disiplin mengalahkan emosi di pasar modal. Selalu punya rencana sebelum masuk.",
    "Risiko terbesar adalah tidak mengambil risiko sama sekali. Mulailah berinvestasi hari ini.",
  ]);
  const [speed, setSpeed] = useState(32);
  useEffect(() => {
    try {
      fetch("/api/admin/sync").then(r=>r.json()).then(d => {
        if (d.motivasi?.length) setList(d.motivasi.map((m: any) => m.text));
        if (d.ticker_speed) setSpeed(d.ticker_speed);
      }).catch(()=>{});
    } catch {}
  }, []);
  const doubled = [...list, ...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.04)", borderBottom:"1px solid rgba(234,179,8,0.08)", padding:"7px 0", overflow:"hidden", flexShrink:0 }}>
      <div style={{ display:"flex", animation:`motivasiMove ${speed}s linear infinite`, whiteSpace:"nowrap", alignItems:"center" }}>
        {doubled.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-medium mx-8" style={{ color:"rgba(234,179,8,0.65)" }}>
            <span style={{ color:"rgba(234,179,8,0.35)", fontSize:8 }}>●</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Admin Feed sekilas di homepage
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
        <div key={p.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fff", flexShrink:0 }}>RC</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>Ritel Community.ID</span>
                <span style={{ background:"rgba(59,130,246,0.15)", color:"#3b82f6", fontSize:8, fontWeight:800, padding:"1px 5px", borderRadius:4 }}>✔ verified</span>
                <span style={{ background:tagColors[p.tag]+"20", color:tagColors[p.tag], fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:4, marginLeft:"auto" }}>{p.tag}</span>
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, lineHeight:1.6 }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

// Nav items
const NAV_ITEMS = [
  { href:"/sinyal", label:"Sinyal", icon:"📡", desc:"Lihat sinyal saham terbaru", color:"#22c55e", bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.15)" },
  { href:"/workspace", label:"Workspace", icon:"💼", desc:"Paket & layanan VIP", color:"#1e5af0", bg:"rgba(30,90,240,0.08)", border:"rgba(30,90,240,0.15)" },
  { href:"/info", label:"Info & Berita", icon:"📰", desc:"Berita pasar & analisis terbaru", color:"#f59e0b", bg:"rgba(245,158,11,0.08)", border:"rgba(245,158,11,0.15)" },
  { href:"/komunitas", label:"Komunitas", icon:"👥", desc:"Forum diskusi saham", color:"#8b5cf6", bg:"rgba(139,92,246,0.08)", border:"rgba(139,92,246,0.15)" },
];

export default function HomePage() {
  const [syncData, setSyncData] = useState<any>({});
  const [tab, setTab] = useState("beranda");

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>setSyncData(d)).catch(()=>{});
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:"#04060f", color:"#fff", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <style>{`
        @keyframes motivasiMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .galaxy-stars { position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(30,58,138,0.15) 0%,transparent 60%),radial-gradient(ellipse at bottom right,rgba(5,150,105,0.07) 0%,transparent 50%);pointer-events:none;z-index:0; }
      `}</style>
      <div className="galaxy-stars" />

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(4,6,15,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:11 }}>RC</div>
          <div>
            <div style={{ fontWeight:900, fontSize:14, letterSpacing:"-0.3px" }}>RITEL COMMUNITY</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.5px" }}>SINYAL SAHAM INDONESIA</div>
          </div>
        </div>
        <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)", color:"#fff", fontWeight:800, fontSize:11, padding:"7px 16px", borderRadius:100, textDecoration:"none" }}>Login VIP</Link>
      </div>

      <MotivasiTicker />

      <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
        {/* Hero */}
        <div style={{ padding:"24px 16px 20px", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(30,90,240,0.1)", border:"1px solid rgba(30,90,240,0.2)", borderRadius:100, padding:"4px 14px", marginBottom:16, fontSize:11, color:"#60a5fa", fontWeight:700 }}>
            🇮🇩 Platform Sinyal Saham Indonesia
          </div>
          <h1 style={{ fontSize:28, fontWeight:900, lineHeight:1.2, marginBottom:10, letterSpacing:"-0.5px" }}>
            Investasi Lebih <span style={{ background:"linear-gradient(135deg,#1e5af0,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Cerdas</span>
            <br/>Bersama Kami
          </h1>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:1.7, maxWidth:280, margin:"0 auto 20px" }}>Sinyal trading premium, analisis mendalam, dan komunitas investor aktif Indonesia.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <Link href="/workspace" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)", color:"#fff", fontWeight:800, fontSize:13, padding:"11px 24px", borderRadius:12, textDecoration:"none" }}>Mulai Sekarang</Link>
            <a href="https://wa.me/6282218723401?text=Halo%20Admin!" target="_blank" style={{ background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", fontWeight:800, fontSize:13, padding:"11px 24px", borderRadius:12, textDecoration:"none" }}>WA Admin</a>
          </div>
        </div>

        {/* Stats quick */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, padding:"0 16px", marginBottom:20 }}>
          {[{v:(syncData.signals||[]).length||"50+",l:"Sinyal Aktif",c:"#22c55e"},{v:"1.000+",l:"Member VIP",c:"#1e5af0"},{v:"95%",l:"Akurasi",c:"#f59e0b"}].map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Admin feed */}
        <HomeFeed />

        {/* Navigation cards */}
        <div style={{ padding:"0 16px", marginBottom:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {NAV_ITEMS.map(item=>(
              <Link key={item.href} href={item.href} style={{ textDecoration:"none", display:"block" }}>
                <div style={{ background:item.bg, border:`1px solid ${item.border}`, borderRadius:16, padding:"18px 16px", transition:"all 0.2s" }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ color:item.color, fontWeight:900, fontSize:14, marginBottom:3 }}>{item.label}</div>
                  <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, lineHeight:1.4 }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sinyal preview - 3 teratas */}
        <div style={{ padding:"0 16px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontWeight:900, fontSize:15 }}>📡 Sinyal Terbaru</span>
            <Link href="/sinyal" style={{ color:"#60a5fa", fontSize:12, fontWeight:700, textDecoration:"none" }}>Lihat semua →</Link>
          </div>
          {(syncData.signals||[]).slice(0,3).map((s:any)=>(
            <div key={s.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:s.action==="BUY"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", border:`1px solid ${s.action==="BUY"?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:s.action==="BUY"?"#22c55e":"#ef4444", flexShrink:0 }}>{(s.kode||"--").slice(0,4)}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>{s.kode}</span>
                  <span style={{ background:s.action==="BUY"?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", color:s.action==="BUY"?"#22c55e":"#ef4444", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:5 }}>{s.action}</span>
                </div>
                <span style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>Entry: {s.entry} · TP: {s.tp}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"rgba(255,255,255,0.15)", fontSize:10 }}>🔒 VIP</div>
              </div>
            </div>
          ))}
          {!(syncData.signals||[]).length && (
            <div style={{ textAlign:"center", padding:"20px", color:"rgba(255,255,255,0.25)", fontSize:13 }}>Memuat sinyal...</div>
          )}
        </div>

        {/* CTA */}
        <div style={{ margin:"0 16px 16px", background:"linear-gradient(135deg,rgba(30,90,240,0.12),rgba(6,182,212,0.06))", border:"1px solid rgba(30,90,240,0.2)", borderRadius:20, padding:"24px 20px", textAlign:"center" }}>
          <p style={{ fontWeight:900, fontSize:17, marginBottom:6 }}>Siap Investasi Lebih Cerdas?</p>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginBottom:16, lineHeight:1.6 }}>Bergabung dengan ribuan investor yang sudah mempercayai sinyal kami.</p>
          <Link href="/workspace" style={{ display:"inline-block", background:"linear-gradient(135deg,#1e5af0,#0ea5e9)", color:"#fff", fontWeight:800, fontSize:13, padding:"12px 32px", borderRadius:12, textDecoration:"none" }}>Lihat Paket VIP</Link>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:50, background:"rgba(4,6,15,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"8px 0 env(safe-area-inset-bottom,16px)", display:"flex", alignItems:"center", justifyContent:"space-around" }}>
        {[
          { href:"/", label:"Beranda", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, active:true },
          { href:"/sinyal", label:"Sinyal", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { href:"/workspace", label:"Workspace", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
          { href:"/info", label:"Info", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
          { href:"/login", label:"Login", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, green:true },
        ].map(item=>(
          <Link key={item.href} href={item.href} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, textDecoration:"none", padding:"4px 10px", position:"relative" }}>
            {item.active && <div style={{ position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)", width:28, height:3, background:"#1e5af0", borderRadius:3 }}/>}
            <span style={{ color:item.active?"#1e5af0":item.green?"#22c55e":"rgba(255,255,255,0.3)" }}>{item.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, color:item.active?"#1e5af0":item.green?"#22c55e":"rgba(255,255,255,0.3)" }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
