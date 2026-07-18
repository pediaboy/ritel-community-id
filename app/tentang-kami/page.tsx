"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MoreMenu from "../components/MoreMenu";

/* ============================================================
   SVG ICONS (Lucide-style, no emoji)
   ============================================================ */
const Icon = {
  Signal:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="4"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="19.07" x2="16.24" y1="4.93" y2="7.76"/><line x1="7.76" x2="4.93" y1="16.24" y2="19.07"/></svg>,
  Users:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  TrendUp:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Eye:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Book:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Clock:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Chat:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
};

export default function TentangKamiPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight:"100vh", background:"#030712", color:"#fff", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      
      {/* Galaxy BG */}
      <div className="galaxy-stars" />

      {/* HEADER */}
      <header style={{ position:"sticky",top:0,zIndex:50,background:"rgba(3,5,8,0.82)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="2,18 8,12 12,15 17,7 22,5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="18,5 22,5 22,9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:900,fontSize:14,letterSpacing:"-0.3px" }}>RITEL COMMUNITY<span style={{color:"#2563EB"}}>.ID</span></div>
            <div style={{ fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.6px" }}>MARKET INTELLIGENCE PLATFORM</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Link href="/paket" style={{ color:"#3B82F6",fontWeight:800,fontSize:11,padding:"7px 12px",borderRadius:10,textDecoration:"none",border:"1px solid #132238" }}>Daftar</Link>
          <MoreMenu
            items={[
              { id:"paket",    label:"Paket VIP",     onSelect:()=>router.push("/paket") },
              { id:"alat",     label:"Alat & Kalkulator", onSelect:()=>router.push("/alat") },
              { id:"ai",       label:"AI Assistant",  onSelect:()=>router.push("/ai") },
              { id:"cari",     label:"Cari Saham",    onSelect:()=>router.push("/cari") },
              { id:"testimoni",label:"Testimoni",     onSelect:()=>router.push("/testimoni") },
              { id:"order",    label:"Riwayat Order", onSelect:()=>router.push("/order") },
            ]}
          />
          <Link href="/login" style={{ background:"#2563EB",color:"#FFFFFF",fontWeight:800,fontSize:11,padding:"7px 18px",borderRadius:10,textDecoration:"none" }}>Login VIP</Link>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:40, position:"relative", zIndex:1 }}>
        
        {/* HERO SECTION */}
        <section style={{ padding:"28px 16px 20px", textAlign:"center", position:"relative" }}>
          <div className="tag-chip" style={{ marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#2563EB", display:"inline-block" }} />
            Tentang Kami
          </div>

          <h1 className="headline" style={{ fontSize:28, fontWeight:900, lineHeight:1.15, marginBottom:12, letterSpacing:"-0.6px" }}>
            Komunitas Investor Saham <br />
            <span className="accent">TERPERCAYA</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, lineHeight:1.6, maxWidth:340, margin:"0 auto 24px" }}>
            Membangun masa depan investasi ritel Indonesia yang mandiri, objektif, dan berorientasi pada kesuksesan finansial jangka panjang.
          </p>
        </section>

        {/* FOUNDING STORY */}
        <section style={{ padding:"0 16px 28px" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16, color:"rgba(255,255,255,0.65)", fontSize:13, lineHeight:1.7, textAlign:"left" }}>
            <p>
              RITEL COMMUNITY.ID didirikan untuk membantu investor ritel Indonesia mengakses sinyal saham premium dan edukasi pasar modal. Kami memahami kesulitan para trader mandiri dalam memilah informasi di tengah dinamika pasar keuangan yang kompleks dan serba cepat.
            </p>
            <p>
              Melalui kombinasi analisis teknikal, pemantauan bandarmologi secara real-time, serta edukasi berkelanjutan, kami berdedikasi tinggi untuk memberikan panduan trading saham yang andal. Kami meminimalisasi tebakan emosional dengan menyodorkan skenario yang berbasis data kuantitatif dan objektif.
            </p>
          </div>
        </section>

        {/* STATS ROW */}
        <section style={{ padding:"0 16px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { v:"50+", l:"Sinyal Aktif", c:"#2563EB", glow:"rgba(37,99,235,0.08)", Icon:Icon.Signal },
              { v:"1.000+", l:"Member Aktif", c:"#2563EB", glow:"rgba(37,99,235,0.08)", Icon:Icon.Users },
              { v:"95%", l:"Win Rate", c:"#2563EB", glow:"rgba(37,99,235,0.08)", Icon:Icon.TrendUp },
            ].map((s,i)=>(
              <div key={i} className="glass-card" style={{ background:`linear-gradient(145deg,${s.glow},rgba(0,0,0,0))`, padding:"14px 8px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:86 }}>
                <span style={{ color:s.c, marginBottom:4, display:"block" }}><s.Icon/></span>
                <div style={{ fontSize:20, fontWeight:900, color:s.c, lineHeight:1.1 }}>{s.v}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.28)", marginTop:3, fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* NILAI KAMI */}
        <section style={{ padding:"0 16px 28px" }}>
          <h2 style={{ fontSize:14, fontWeight:900, textTransform:"uppercase", color:"#fff", letterSpacing:"0.5px", marginBottom:14, paddingLeft:4 }}>NILAI UTAMA KAMI</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { title: "Transparan", desc: "Setiap sinyal yang dirilis dicatat riwayatnya dalam jurnal VIP. Hasil keuntungan maupun kerugian disajikan secara jujur apa adanya.", Icon: Icon.Eye },
              { title: "Edukasi Berkelanjutan", desc: "Kami tidak sekadar memberi rekomendasi beli/jual, melainkan juga menyertakan alasan rasional, skenario trading, dan tata kelola risiko.", Icon: Icon.Book },
              { title: "Data Real-time", desc: "Dipantau langsung oleh analis profesional didukung sistem pemantauan aliran dana dan pergerakan bandar pasar modal Indonesia.", Icon: Icon.Clock },
              { title: "Komunitas Aktif", desc: "Grup diskusi interaktif yang saling bertukar analisis dengan sehat, fokus pada pembelajaran mandiri dan pencapaian profit bersama.", Icon: Icon.Chat }
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding:16, display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{ background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.2)", borderRadius:10, padding:10, color:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <item.Icon />
                </div>
                <div>
                  <h3 style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:4 }}>{item.title}</h3>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CLOSING CTA GLASS-CARD */}
        <section style={{ padding:"0 16px 20px" }}>
          <div className="glass-card" style={{ background:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(0,0,0,0.4))", padding:20, borderRadius:16, textAlign:"center" }}>
            <h3 style={{ fontSize:16, fontWeight:900, marginBottom:8, textTransform:"uppercase", color:"#fff" }}>Mulai Investasi Cerdas Sekarang</h3>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6, marginBottom:16 }}>Dapatkan sinyal harian eksklusif, analisis teknikal mendalam, dan akses penuh ke grup VIP Ritel Community.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Link href="/paket" style={{ flex:1, display:"block", textAlign:"center", background:"#2563EB", color:"#FFFFFF", fontWeight:800, fontSize:12, padding:"12px 0", borderRadius:10, textDecoration:"none" }}>Daftar Paket</Link>
              <a href="https://wa.me/6282218723401?text=Halo%20Admin!%20Saya%20tertarik%20bergabung%20dengan%20Ritel%20Community." target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"block", textAlign:"center", background:"rgba(34,197,94,0.09)", border:"1px solid rgba(34,197,94,0.22)", color:"#22c55e", fontWeight:800, fontSize:12, padding:"12px 0", borderRadius:14, textDecoration:"none" }}>Hubungi Admin</a>
            </div>
          </div>
        </section>

        {/* BACK TO HOME */}
        <div style={{ textAlign:"center", marginTop:16 }}>
          <Link href="/" style={{ fontSize:12, color:"rgba(255,255,255,0.35)", textDecoration:"none", fontWeight:600 }}>Kembali ke Beranda</Link>
        </div>

      </div>
    </div>
  );
}
