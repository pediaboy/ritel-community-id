"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

const PKG_FILTER = ["Semua","Basic","Silver","Gold","Pro","Platinum","Elite"];
const PKG_COLORS: any = { Basic:"#3b82f6", Silver:"#06b6d4", Gold:"#f59e0b", Pro:"#8b5cf6", Platinum:"#e2e8f0", Elite:"#fde68a" };

export default function TestimoniPage() {
  const [filter, setFilter] = useState("Semua");
  const [dynamicTestis, setDynamicTestis] = useState<any[]>([]);

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      if (d.testimonials_data?.length) setDynamicTestis(d.testimonials_data);
    }).catch(()=>{});
  },[]);

  const allTestis = dynamicTestis.length > 0 ? dynamicTestis : TESTIMONI_DATA;
  const displayed = filter === "Semua" ? allTestis : allTestis.filter((t:any)=>t.pkg===filter);
  const avgRating = (allTestis.reduce((a:number,t:any)=>a+(t.rating||5),0)/allTestis.length).toFixed(1);

  return (
    <div style={{ minHeight:"100vh", background:"#04060f", color:"#fff", maxWidth:480, margin:"0 auto", fontFamily:"-apple-system,'SF Pro Display',sans-serif" }}>
      <style>{`
        @keyframes twinkle { 0%{opacity:0.55} 50%{opacity:0.85} 100%{opacity:1} }
      `}</style>
      <div className="galaxy-stars" />

      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(4,6,15,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
        <Link href="/" style={{ color:"rgba(255,255,255,0.5)",fontSize:22,textDecoration:"none",lineHeight:1 }}>←</Link>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:900,fontSize:15 }}>⭐ Testimoni Member</div>
          <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)" }}>{allTestis.length}+ ulasan · Rating {avgRating}/5.0</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:20,fontWeight:900,color:"#facc15" }}>{avgRating}</div>
          <div style={{ display:"flex",gap:1 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ color:"#facc15",fontSize:10 }}>★</span>)}</div>
        </div>
      </div>

      <div style={{ position:"relative",zIndex:1,padding:"16px" }}>
        {/* Stats bar */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16 }}>
          {[{v:allTestis.length+"+",l:"Total Ulasan",c:"#facc15"},{v:avgRating+"/5",l:"Avg Rating",c:"#22c55e"},{v:"98%",l:"Rekomendasikan",c:"#60a5fa"}].map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 8px",textAlign:"center" }}>
              <div style={{ fontSize:18,fontWeight:900,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:16 }}>
          {PKG_FILTER.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ flexShrink:0,padding:"6px 14px",borderRadius:100,fontWeight:700,fontSize:11,border:"1px solid",cursor:"pointer",background:filter===f?(PKG_COLORS[f]||"#1e5af0")+"22":"transparent",color:filter===f?(PKG_COLORS[f]||"#60a5fa"):"rgba(255,255,255,0.4)",borderColor:filter===f?(PKG_COLORS[f]||"#1e5af0")+"66":"rgba(255,255,255,0.1)" }}>{f}</button>
          ))}
        </div>

        {/* Testimoni list */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {displayed.map((t:any,i:number)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${t.color||"#1e5af0"},${(t.color||"#1e5af0")}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",flexShrink:0 }}>{(t.name||"A")[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <span style={{ fontWeight:800,fontSize:13,color:"#fff" }}>{t.name}</span>
                    {t.verified && <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <span style={{ fontSize:10,color:t.pkgColor||"#f59e0b",background:(t.pkgColor||"#f59e0b")+"15",padding:"1px 6px",borderRadius:4,fontWeight:700 }}>{t.pkg}</span>
                    <span style={{ color:"rgba(255,255,255,0.25)",fontSize:10 }}>· {t.date}</span>
                  </div>
                </div>
                <div style={{ display:"flex",gap:1 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=(t.rating||5)?"#facc15":"rgba(255,255,255,0.1)",fontSize:12 }}>★</span>)}</div>
              </div>
              <p style={{ color:"rgba(255,255,255,0.7)",fontSize:12,lineHeight:1.7,fontStyle:"italic" }}>"{t.text}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop:24,marginBottom:20,background:"linear-gradient(135deg,rgba(30,90,240,0.12),rgba(6,182,212,0.08))",border:"1px solid rgba(30,90,240,0.2)",borderRadius:20,padding:"20px",textAlign:"center" }}>
          <div style={{ fontSize:28,marginBottom:8 }}>🚀</div>
          <h3 style={{ fontWeight:900,fontSize:16,marginBottom:6 }}>Mau Bergabung?</h3>
          <p style={{ color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:16 }}>Bergabung dengan 1.000+ investor aktif RITEL COMMUNITY.ID</p>
          <div style={{ display:"flex",gap:10,maxWidth:280,margin:"0 auto" }}>
            <Link href="/paket" style={{ flex:1,display:"block",textAlign:"center",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"11px 0",borderRadius:12,textDecoration:"none" }}>Lihat Paket</Link>
            <a href="https://wa.me/6282218723401" target="_blank" style={{ flex:1,display:"block",textAlign:"center",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.25)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"11px 0",borderRadius:12,textDecoration:"none" }}>WA Admin</a>
          </div>
        </div>

        <div style={{ textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.15)",paddingBottom:24 }}>
          Developed by THIRAFI THARIQ AL IDRIS
        </div>
      </div>
    </div>
  );
}
