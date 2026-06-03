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


const TESTIMONI_DATA = [
  { name:"Budi Santoso", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#1d4ed8", date:"2 hari lalu", text:"Sinyal dari RC beneran akurat banget! Dalam 2 bulan portofolio naik 34%. Portfolio gua dari 15jt jadi 22jt. Rekomen banget!" },
  { name:"Siti Rahmawati", pkg:"Pro", pkgColor:"#8b5cf6", rating:5, verified:true, color:"#7c3aed", date:"3 hari lalu", text:"AI Agent-nya keren banget, bisa analisis chart langsung. Modul edukasinya juga detail dari dasar sampai advanced. Worth it!" },
  { name:"Andi Wijaya", pkg:"Silver", pkgColor:"#06b6d4", rating:4, verified:false, color:"#0891b2", date:"5 hari lalu", text:"Komunitas aktif, admin responsif. Sinyal silver udah worth it buat pemula kayak gua. Lanjut upgrade Gold!" },
  { name:"Dewi Kusuma", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#059669", date:"1 minggu lalu", text:"Konsultasi 1-on-1 dengan analis senior ngebantu banget. Return gua konsisten setiap bulan. Best investment platform!" },
  { name:"Rizki Pratama", pkg:"Elite", pkgColor:"#fde68a", rating:5, verified:true, color:"#d97706", date:"1 minggu lalu", text:"Dari modal 10jt sekarang udah 47jt dalam 8 bulan. RC adalah keputusan terbaik gua di dunia investasi!" },
  { name:"Fauzan Hidayat", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#dc2626", date:"10 hari lalu", text:"Sinyal TP1 selalu kena, sering nyentuh TP2 dan TP3 juga. Analisis bandarnya tajam banget!" },
  { name:"Maya Sari", pkg:"Pro", pkgColor:"#8b5cf6", rating:5, verified:false, color:"#7c3aed", date:"2 minggu lalu", text:"Groupnya aktif 24 jam, selalu ada yang jawab pertanyaan. Admin ramah dan profesional." },
  { name:"Dika Firmansyah", pkg:"Basic", pkgColor:"#3b82f6", rating:4, verified:false, color:"#1d4ed8", date:"2 minggu lalu", text:"Cocok untuk pemula. Modul dasarnya mudah dipahami, sinyal juga selalu disertai analisis." },
  { name:"Rini Hastuti", pkg:"Silver", pkgColor:"#06b6d4", rating:5, verified:true, color:"#0891b2", date:"3 minggu lalu", text:"Screening saham baggernya jitu banget! Udah dapat 3 bagger dalam 6 bulan ikut RC." },
  { name:"Tommy Susanto", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#d97706", date:"3 minggu lalu", text:"Sebelum ikut RC sering panic selling. Sekarang lebih tenang dan disiplin thanks to psikologi trading module." },
  { name:"Linda Cahyani", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#7c3aed", date:"1 bulan lalu", text:"Live session 1-on-1 dengan analis senior worth banget! Portfolio gua naik konsisten." },
  { name:"Hendra Gunawan", pkg:"Pro", pkgColor:"#8b5cf6", rating:5, verified:false, color:"#059669", date:"1 bulan lalu", text:"Bandarmologi module bikin gua bisa deteksi akumulasi bandar sebelum saham naik besar. Epic!" },
  { name:"Nisa Permata", pkg:"Gold", pkgColor:"#f59e0b", rating:4, verified:true, color:"#dc2626", date:"1 bulan lalu", text:"Sinyal masih sangat baik. Admin cepat response kalau ada pertanyaan. Highly recommended!" },
  { name:"Arif Rahman", pkg:"Elite", pkgColor:"#fde68a", rating:5, verified:true, color:"#d97706", date:"6 minggu lalu", text:"Mentoring langsung dengan mentor senior. Portofolio gua dimanage dengan baik. ROI 89% dalam setahun!" },
  { name:"Putri Wulandari", pkg:"Silver", pkgColor:"#06b6d4", rating:5, verified:false, color:"#0891b2", date:"6 minggu lalu", text:"Baru 3 bulan join udah balik modal 2x lipat. Sinyal silvernya konsisten dan akurat." },
  { name:"Bagus Setiawan", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#1d4ed8", date:"2 bulan lalu", text:"Bagger picks-nya luarbiasa. Dapat saham naik 300% dalam 4 bulan. RC changed my life!" },
  { name:"Sri Mulyani", pkg:"Pro", pkgColor:"#8b5cf6", rating:4, verified:true, color:"#7c3aed", date:"2 bulan lalu", text:"AI agent-nya cepat dan akurat analisisnya. Bisa tanya kapanpun dan selalu ada jawaban lengkap." },
  { name:"Agus Pranoto", pkg:"Basic", pkgColor:"#3b82f6", rating:5, verified:false, color:"#059669", date:"2 bulan lalu", text:"Cocok banget buat pemula. Penjelasannya simple tapi mudah dipahami. Mau upgrade Gold!" },
  { name:"Yuni Astuti", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#dc2626", date:"2 bulan lalu", text:"Sinyal real-time 24/7 dan akses semua modul. Worth every rupiah yang gua bayar!" },
  { name:"Wahyu Nugroho", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#d97706", date:"3 bulan lalu", text:"Tape reading intraday-nya akurat. Bisa profit harian sekarang berkat panduan dari RC." },
  { name:"Fitriani Dewi", pkg:"Silver", pkgColor:"#06b6d4", rating:4, verified:false, color:"#0891b2", date:"3 bulan lalu", text:"Sebelumnya gak tau apa-apa soal saham. Sekarang udah bisa baca chart dan analisis sendiri!" },
  { name:"Rendra Saputra", pkg:"Elite", pkgColor:"#fde68a", rating:5, verified:true, color:"#7c3aed", date:"3 bulan lalu", text:"Return 120% dalam 10 bulan dengan bimbingan dari RC. Best decision I've ever made!" },
  { name:"Amalia Rahman", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#1d4ed8", date:"4 bulan lalu", text:"Signal BUY BBCA kemarin TP1 kena dalam 3 hari! Akurasi RC emang top level." },
  { name:"Yoga Pratama", pkg:"Pro", pkgColor:"#8b5cf6", rating:4, verified:false, color:"#059669", date:"4 bulan lalu", text:"Modul fundamental sangat detail dan aplikatif. Sekarang bisa valuasi saham sendiri dengan DCF." },
  { name:"Nurul Hasanah", pkg:"Basic", pkgColor:"#3b82f6", rating:5, verified:true, color:"#dc2626", date:"4 bulan lalu", text:"Komunitas RC solid banget. Member saling support dan share analisis. Bikin makin semangat investasi!" },
  { name:"Dodi Permana", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#d97706", date:"5 bulan lalu", text:"Bagger picks RC konsisten. Dapat 5 bagger dalam setahun ikut RC. Return total 340%!" },
  { name:"Kartika Sari", pkg:"Silver", pkgColor:"#06b6d4", rating:4, verified:false, color:"#0891b2", date:"5 bulan lalu", text:"Manajemen risiko yang diajarkan RC bikin gua lebih tenang. Tidak panik lagi saat market turun." },
  { name:"Bayu Kurniawan", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#1d4ed8", date:"5 bulan lalu", text:"Admin selalu update sinyal dan analisis. Grup aktif diskusi setiap hari. Mantap!" },
  { name:"Tri Wahyuni", pkg:"Pro", pkgColor:"#8b5cf6", rating:5, verified:true, color:"#7c3aed", date:"6 bulan lalu", text:"AI Agent RC 24/7 ready. Kalau ada pertanyaan teknikal dijawab detail dengan chart analysis langsung!" },
  { name:"Maulana Ibrahim", pkg:"Elite", pkgColor:"#fde68a", rating:5, verified:true, color:"#d97706", date:"6 bulan lalu", text:"Dari newbie total sekarang udah bisa trading mandiri. Terima kasih RC atas ilmu dan bimbingannya!" },
  { name:"Anggraini Putri", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:false, color:"#059669", date:"7 bulan lalu", text:"Sinyal bandar RC tepat banget. Beli di harga akumulasi, jual saat distribusi. Profit konsisten!" },
  { name:"Farhan Aziz", pkg:"Silver", pkgColor:"#06b6d4", rating:4, verified:true, color:"#dc2626", date:"7 bulan lalu", text:"Worth banget! Modal 5jt dalam 4 bulan jadi 9jt. RC beneran ngebantu trader pemula." },
  { name:"Widi Santoso", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#d97706", date:"8 bulan lalu", text:"Level konsultasi dan layanan RC unmatched. Analis seniornya expert dan sabar menjelaskan." },
  { name:"Indah Lestari", pkg:"Basic", pkgColor:"#3b82f6", rating:5, verified:false, color:"#0891b2", date:"8 bulan lalu", text:"Modul pemula RC sangat komprehensif. Belajar dari nol sampai bisa analisis sendiri dalam 2 bulan!" },
  { name:"Prasetyo Adi", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#1d4ed8", date:"9 bulan lalu", text:"Sinyal TP3 kena berkali-kali. RC emang level tersendiri untuk komunitas saham Indonesia." },
  { name:"Shinta Melati", pkg:"Pro", pkgColor:"#8b5cf6", rating:4, verified:true, color:"#7c3aed", date:"9 bulan lalu", text:"Watchlist RC selalu update. Saham-saham yang masuk watchlist selalu ada yang naik signifikan." },
  { name:"Reza Firmansyah", pkg:"Elite", pkgColor:"#fde68a", rating:5, verified:true, color:"#d97706", date:"10 bulan lalu", text:"Portofolio management personal dari RC top banget. ROI 156% dalam setahun. Luar biasa!" },
  { name:"Oktavia Sari", pkg:"Silver", pkgColor:"#06b6d4", rating:5, verified:false, color:"#059669", date:"10 bulan lalu", text:"Analisis fundamental yang diajarkan RC buka pikiran gua soal value investing. Thanks RC!" },
  { name:"Bambang Susilo", pkg:"Gold", pkgColor:"#f59e0b", rating:5, verified:true, color:"#dc2626", date:"11 bulan lalu", text:"Ikut RC dari awal. Kualitas sinyal dan edukasi selalu konsisten tinggi. Highly recommended!" },
  { name:"Fitria Handayani", pkg:"Platinum", pkgColor:"#e2e8f0", rating:5, verified:true, color:"#d97706", date:"1 tahun lalu", text:"1 tahun bersama RC, portofolio naik 267%. Investasi terbaik adalah investasi ke RC!" },
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
          <div style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#0a1628,#1e5af0)",boxShadow:"0 0 20px rgba(30,90,240,0.4)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="2,18 8,12 12,15 17,7 22,5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="18,5 22,5 22,9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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


        {/* ===== TESTIMONI 40+ ===== */}
        <div style={{ padding:"0 16px",marginBottom:24 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div>
              <h3 style={{ fontWeight:900,fontSize:18,marginBottom:4 }}>⭐ Testimoni Member</h3>
              <p style={{ color:"rgba(255,255,255,0.4)",fontSize:12 }}>Bergabung dengan 1.000+ investor aktif</p>
            </div>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontWeight:900,fontSize:22,color:"#facc15" }}>4.9</p>
              <div style={{ display:"flex",gap:1,justifyContent:"center" }}>
                {[1,2,3,4,5].map(i=><span key={i} style={{ color:"#facc15",fontSize:12 }}>★</span>)}
              </div>
              <p style={{ color:"rgba(255,255,255,0.3)",fontSize:10 }}>40+ ulasan</p>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {TESTIMONI_DATA.map((t,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",flexShrink:0 }}>{t.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <span style={{ fontWeight:800,fontSize:13,color:"#fff" }}>{t.name}</span>
                      {t.verified && <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <span style={{ fontSize:10,color:`${t.pkgColor}`,background:`${t.pkgColor}15`,padding:"1px 6px",borderRadius:4,fontWeight:700 }}>{t.pkg}</span>
                      <span style={{ color:"rgba(255,255,255,0.25)",fontSize:10 }}>· {t.date}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:1 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=t.rating?"#facc15":"rgba(255,255,255,0.1)",fontSize:12 }}>★</span>)}</div>
                </div>
                <p style={{ color:"rgba(255,255,255,0.7)",fontSize:12,lineHeight:1.7,fontStyle:"italic" }}>"{t.text}"</p>
              </div>
            ))}
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
