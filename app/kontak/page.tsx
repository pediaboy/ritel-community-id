"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MoreMenu from "../components/MoreMenu";

/* ============================================================
   SVG ICONS (Lucide-style, no emoji)
   ============================================================ */
const Icon = {
  Phone:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Mail:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Clock:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Instagram: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Telegram:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Map:       () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>,
};

export default function KontakPage() {
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
            Hubungi Kami
          </div>

          <h1 className="headline" style={{ fontSize:28, fontWeight:900, lineHeight:1.15, marginBottom:12, letterSpacing:"-0.6px" }}>
            Layanan Bantuan <br />
            <span className="accent">ADMIN RESMI</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, lineHeight:1.6, maxWidth:340, margin:"0 auto 24px" }}>
            Butuh bantuan teknis atau informasi keanggotaan VIP? Tim admin helpdesk kami siap melayani pertanyaan Anda.
          </p>
        </section>

        {/* CONTACT INFO LIST */}
        <section style={{ padding:"0 16px 28px", display:"flex", flexDirection:"column", gap:12 }}>
          
          {/* WhatsApp Row */}
          <div className="glass-card" style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:10, padding:10, color:"#22c55e", display:"flex", alignItems:"center", justifyValue:"center", flexShrink:0 }}>
              <Icon.Phone />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, letterSpacing:"0.5px" }}>WHATSAPP HELPDESK</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginTop:2 }}>0822-1872-3401</div>
            </div>
            <a 
              href="https://wa.me/6282218723401?text=Halo%20Admin!%20Saya%20membutuhkan%20informasi%20mengenai%20Ritel%20Community." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-green" 
              style={{ fontSize:11, padding:"7px 14px", borderRadius:8, fontWeight:700, textDecoration:"none" }}
            >
              Hubungi
            </a>
          </div>

          {/* Email Row */}
          <div className="glass-card" style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.2)", borderRadius:10, padding:10, color:"#2563EB", display:"flex", alignItems:"center", justifyValue:"center", flexShrink:0 }}>
              <Icon.Mail />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, letterSpacing:"0.5px" }}>ALAMAT EMAIL</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginTop:2 }}>info@ritelcommunity.id</div>
            </div>
            <a 
              href="mailto:info@ritelcommunity.id" 
              style={{ background:"#2563EB", color:"#FFFFFF", fontSize:11, padding:"7px 14px", borderRadius:8, fontWeight:800, textDecoration:"none" }}
            >
              Email
            </a>
          </div>

          {/* Jam Operasional Row */}
          <div className="glass-card" style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:10, color:"#f59e0b", display:"flex", alignItems:"center", justifyValue:"center", flexShrink:0 }}>
              <Icon.Clock />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, letterSpacing:"0.5px" }}>JAM OPERASIONAL</div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginTop:2 }}>Senin - Jumat | 09:00 - 17:00 WIB</div>
            </div>
          </div>

        </section>

        {/* SOCIAL LINKS ROW */}
        <section style={{ padding:"0 16px 28px", textAlign:"center" }}>
          <h3 style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:12 }}>IKUTI MEDIA SOSIAL KAMI</h3>
          <div style={{ display:"flex", justifyContent:"center", gap:10 }}>
            {[
              { label:"Instagram", href:"#", Icon:Icon.Instagram, bg:"rgba(225,48,108,0.08)", border:"rgba(225,48,108,0.2)", color:"#E1306C" },
              { label:"Telegram", href:"#", Icon:Icon.Telegram, bg:"rgba(0,136,204,0.08)", border:"rgba(0,136,204,0.2)", color:"#0088CC" }
            ].map((s,i)=>(
              <a 
                key={i} 
                href={s.href} 
                className="glass-card" 
                style={{ 
                  background: s.bg, 
                  borderColor: s.border, 
                  color: s.color, 
                  padding: "10px 18px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8, 
                  borderRadius: 12, 
                  textDecoration: "none", 
                  fontSize: 12, 
                  fontWeight: 700 
                }}
              >
                <s.Icon />
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* MAP PLACEHOLDER */}
        <section style={{ padding:"0 16px 20px" }}>
          <div className="glass-card" style={{ padding:20, borderRadius:16, border:"1px solid #132238" }}>
            <div style={{ background:"rgba(255,255,255,0.01)", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:12, padding:"24px 16px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
              <Icon.Map />
              <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.5px", color:"rgba(255,255,255,0.6)" }}>RITEL COMMUNITY HEADQUARTERS</span>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", lineHeight:1.5 }}>
                Sudirman Central Business District (SCBD)<br />
                Kebayoran Baru, Jakarta Selatan, Indonesia
              </span>
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
