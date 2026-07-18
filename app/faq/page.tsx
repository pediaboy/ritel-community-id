"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MoreMenu from "../components/MoreMenu";

/* ============================================================
   SVG ICONS (Lucide-style, no emoji)
   ============================================================ */
const Icon = {
  ChevronDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

export default function FAQPage() {
  const router = useRouter();

  // Keep track of which accordion items are open
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({
    0: true, // open first item by default for better visual onboarding
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    {
      q: "Apa itu RITEL COMMUNITY.ID?",
      a: "RITEL COMMUNITY.ID adalah platform market intelligence dan komunitas trading/investasi saham independen di Indonesia yang menyediakan sinyal premium, analisis teknikal, serta bimbingan bursa secara objektif untuk investor ritel."
    },
    {
      q: "Bagaimana cara mendapatkan sinyal saham?",
      a: "Setelah mengaktifkan paket VIP, Anda dapat langsung melihat daftar sinyal terbaru secara real-time pada menu 'Sinyal' di dalam platform kami, lengkap dengan area beli, target profit (TP), batasan stop loss (SL), serta argumen analisis pendukung."
    },
    {
      q: "Apa perbedaan paket VIP dan Free?",
      a: "Paket Free mendapatkan sinyal dengan jeda waktu (delayed) serta ulasan analisis yang terbatas. Sedangkan Paket VIP mendapatkan sinyal real-time instan, pemberitahuan lewat saluran komunikasi privat, bimbingan admin, kalkulator money management eksklusif, serta akses penuh diskusi komunitas."
    },
    {
      q: "Apakah sinyal saham dijamin pasti profit?",
      a: "Tidak ada jaminan profit mutlak di pasar modal. Sinyal kami adalah alat bantu keputusan yang dirancang berdasarkan analisis teknikal, bandarmologi, dan rasio risiko-profit (risk-reward ratio) yang logis. Trading saham selalu mengandung risiko kerugian, oleh karena itu kami menekankan pentingnya manajemen modal."
    },
    {
      q: "Bagaimana cara upgrade akun ke layanan VIP?",
      a: "Silakan pilih paket langganan yang Anda inginkan di halaman '/paket', ikuti langkah pembayaran transfer bank, unggah bukti pembayaran pada kolom yang disediakan, dan tunggu admin mengaktifkan akun VIP kamu. Login cukup pakai email + kode OTP di halaman '/login', tidak perlu kode/token apapun."
    },
    {
      q: "Berapa lama proses aktivasi VIP setelah konfirmasi?",
      a: "Sistem dan admin kami memproses aktivasi akun Anda rata-rata dalam waktu 5 hingga 15 menit setelah bukti transfer pembayaran diunggah pada jam operasional kerja."
    },
    {
      q: "Bagaimana cara menghubungi admin jika ada kendala teknis?",
      a: "Anda dapat menghubungi layanan bantuan admin Ritel Community melalui WhatsApp di nomor 0822-1872-3401 atau klik link wa.me/6282218723401 pada jam kerja."
    },
    {
      q: "Apakah ada kebijakan pengembalian dana (refund)?",
      a: "Karena produk kami menyajikan akses data pasar serta analisis digital yang bersifat instan dan langsung dikonsumsi, kami tidak melayani pengembalian dana (refund) setelah transaksi diproses. Kami menyarankan Anda berkonsultasi terlebih dahulu dengan admin sebelum mendaftar."
    },
    {
      q: "Apakah bimbingan di komunitas ini cocok untuk investor pemula?",
      a: "Sangat cocok. Selain menyediakan sinyal siap pakai, kami melengkapi setiap rekomendasi dengan edukasi money management. Kami mendidik investor pemula agar memahami alasan logis di balik setiap transaksi sehingga bisa berkembang menjadi mandiri."
    },
    {
      q: "Metode analisis apa yang digunakan untuk merilis sinyal?",
      a: "Tim analis kami memadukan analisis teknikal modern (volume spread analysis, price action, trend following) dengan pemantauan arus modal bandar (bandarmologi), serta memfilter berita emiten penting dari Bursa Efek Indonesia."
    },
    {
      q: "Apakah sinyal saham dirilis setiap hari bursa?",
      a: "Sinyal trading dikirim secara berkala dari Senin sampai Jumat pada jam perdagangan bursa aktif. Kami berkomitmen mengedepankan kualitas sinyal dengan rasio probabilitas tinggi daripada memaksa merilis sinyal di saat kondisi market kurang mendukung."
    },
    {
      q: "Dapatkah saya mengakses platform ini lewat ponsel pintar (HP)?",
      a: "Tentu saja. Situs web RITEL COMMUNITY.ID dikonseptualisasikan secara mobile-first, sangat ringan, hemat kuota internet, serta responsif sempurna di layar smartphone iOS maupun Android Anda tanpa memerlukan unduhan aplikasi tambahan."
    }
  ];

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
            FAQ
          </div>

          <h1 className="headline" style={{ fontSize:28, fontWeight:900, lineHeight:1.15, marginBottom:12, letterSpacing:"-0.6px" }}>
            Pertanyaan Umum <br />
            <span className="accent">JAWABAN INSTAN</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, lineHeight:1.6, maxWidth:340, margin:"0 auto 24px" }}>
            Temukan klarifikasi instan mengenai layanan, proses berlangganan, pembagian sinyal trading, serta bimbingan investasi kami.
          </p>
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section style={{ padding:"0 16px 28px", display:"flex", flexDirection:"column", gap:10 }}>
          {faqItems.map((item, i) => {
            const isOpen = !!openItems[i];
            return (
              <div 
                key={i} 
                className="glass-card" 
                style={{ 
                  padding:"14px 16px", 
                  cursor:"pointer",
                  userSelect:"none"
                }}
                onClick={() => toggleItem(i)}
              >
                {/* Accordion Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:13, fontWeight:800, color: isOpen ? "#3B82F6" : "#ffffff", transition:"color 0.25s ease", textAlign:"left", lineHeight:1.4 }}>
                    {item.q}
                  </span>
                  <span style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: isOpen ? "#3B82F6" : "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Icon.ChevronDown />
                  </span>
                </div>

                {/* Accordion Body */}
                <div 
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.25s ease"
                  }}
                >
                  <div style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 10 }}>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.65, textAlign:"left" }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* HELP FOOTER BANNER */}
        <section style={{ padding:"0 16px 20px" }}>
          <div className="glass-card" style={{ background:"rgba(255,255,255,0.01)", padding:20, borderRadius:16, textAlign:"center", border:"1px dashed #132238" }}>
            <h3 style={{ fontSize:14, fontWeight:900, marginBottom:6, color:"#fff" }}>Belum Menemukan Jawaban Anda?</h3>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6, marginBottom:16 }}>Hubungi helpdesk kami secara langsung. Admin kami selalu siap sedia membantu memandu langkah trading Anda.</p>
            <a href="https://wa.me/6282218723401?text=Halo%20Admin!%20Saya%20memiliki%20pertanyaan%20mengenai%20Ritel%20Community." target="_blank" rel="noopener noreferrer" className="btn-green" style={{ display:"inline-block", fontSize:12, padding:"10px 24px", borderRadius:12 }}>
              Tanya Admin via WhatsApp
            </a>
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
