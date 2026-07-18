"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MoreMenu from "../components/MoreMenu";

/* ============================================================
   SVG ICONS (Lucide-style, no emoji, stroke=currentColor)
   ============================================================ */
const Icon = {
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

const ARTICLES = [
  {
    slug: "cara-membaca-chart-candlestick-untuk-pemula",
    title: "Cara Membaca Chart Candlestick untuk Pemula",
    excerpt: "Panduan lengkap langkah-demi-langkah memahami pola candlestick paling populer dalam trading saham harian agar Anda tidak salah mengambil keputusan masuk posisi.",
    tag: "Edukasi",
    date: "18 Juli 2026",
    readingTime: "5 Menit Baca",
    content: "Membaca candlestick adalah salah satu keahlian dasar paling krusial bagi seorang trader. Setiap candle menceritakan pertarungan kekuatan antara pembeli (bulls) dan penjual (bears) dalam rentang waktu tertentu. Pelajari struktur pembentuknya seperti open, high, low, dan close (OHLC) serta kenali pola-pola pembalikan arah (reversal) maupun kelanjutan tren (continuation) yang paling sering menghasilkan profit konsisten di bursa saham IDX.",
  },
  {
    slug: "manajemen-risiko-kunci-bertahan-di-pasar-saham",
    title: "Manajemen Risiko: Kunci Bertahan di Pasar Saham",
    excerpt: "Bagaimana mengatur modal, menentukan ukuran posisi (position sizing), dan konsisten menerapkan stop loss untuk menyelamatkan portofolio Anda dari kehancuran.",
    tag: "Tips Trading",
    date: "16 Juli 2026",
    readingTime: "6 Menit Baca",
    content: "Di pasar saham, mengendalikan risiko jauh lebih penting daripada sekadar berburu profit melimpah. Aturan baku yang wajib Anda terapkan adalah membatasi kerugian maksimal hanya 1% hingga 2% dari total modal per transaksi. Dengan manajemen risiko yang disiplin dan penentuan target risk-to-reward ratio minimal 1:2, portofolio Anda akan tetap tumbuh stabil dalam jangka panjang meski beberapa kali mengalami kerugian beruntun.",
  },
  {
    slug: "5-kesalahan-umum-investor-pemula",
    title: "5 Kesalahan Umum Investor Pemula",
    excerpt: "Hindari jebakan psikologis dan kesalahan taktis berikut agar modal berharga Anda tidak tergerus habis di awal perjalanan investasi Anda.",
    tag: "Edukasi",
    date: "12 Juli 2026",
    readingTime: "4 Menit Baca",
    content: "Banyak investor pemula terjebak dalam FOMO (Fear of Missing Out), membeli saham di harga puncak tanpa analisis matang, mengabaikan pentingnya diversifikasi, atau terlalu cepat merealisasikan keuntungan kecil namun membiarkan kerugian membengkak tanpa batas. Mengetahui kesalahan-kesalahan fatal ini sejak awal adalah langkah terbaik untuk melindungi modal investasi Anda dari kerugian yang tidak perlu.",
  },
  {
    slug: "memahami-fundamental-vs-analisis-teknikal",
    title: "Memahami Fundamental vs Analisis Teknikal",
    excerpt: "Ketahui perbedaan mendasar, kelebihan masing-masing metode, serta cara mengombinasikannya untuk strategi investasi dan trading yang tangguh.",
    tag: "Analisis Pasar",
    date: "08 Juli 2026",
    readingTime: "7 Menit Baca",
    content: "Analisis fundamental berfokus pada nilai intrinsik perusahaan melalui laporan keuangan, manajemen, dan prospek industri untuk menjawab pertanyaan saham apa yang layak dibeli. Sebaliknya, analisis teknikal menggunakan grafik harga historis dan volume transaksi untuk menjawab kapan waktu terbaik untuk membeli dan menjual. Menggabungkan keduanya akan memberi Anda keunggulan luar biasa di pasar modal.",
  },
  {
    slug: "kapan-waktu-terbaik-membeli-saham",
    title: "Kapan Waktu Terbaik Membeli Saham?",
    excerpt: "Panduan taktis memanfaatkan momentum pasar, membaca siklus sektoral, dan mengenali area support kuat untuk entry beli dengan risiko minimal.",
    tag: "Tips Trading",
    date: "05 Juli 2026",
    readingTime: "5 Menit Baca",
    content: "Membeli saham di saat yang tepat sangat menentukan tingkat keberhasilan Anda. Waktu terbaik adalah ketika harga saham berada di area support kuat setelah fase konsolidasi panjang, atau saat terjadi breakout dari pola chart bullish yang disertai dengan peningkatan volume transaksi yang signifikan. Hindari melakukan pembelian saat harga sudah terlalu jauh meninggalkan batas support aman demi meminimalkan potensi drawdown.",
  },
  {
    slug: "psikologi-trading-mengendalikan-emosi-saat-market-bergejolak",
    title: "Psikologi Trading: Mengendalikan Emosi Saat Market Bergejolak",
    excerpt: "Mengatasi ketakutan dan ketamakan adalah tantangan terbesar bagi setiap trader. Pelajari cara melatih kedisiplinan mental Anda.",
    tag: "Tips Trading",
    date: "01 Juli 2026",
    readingTime: "6 Menit Baca",
    content: "Faktor psikologis memegang peranan hingga 60% dalam kesuksesan trading Anda. Ketika pasar bergejolak hebat, emosi takut rugi (fear) atau nafsu ingin cepat kaya (greed) sering kali memaksa kita keluar dari rencana awal (trading plan). Melatih ketenangan mental, membatasi paparan berita berlebihan saat jam perdagangan berlangsung, dan mempercayai sistem trading yang teruji adalah pilar utama untuk menjadi trader profesional.",
  },
];

export default function BlogPage() {
  const router = useRouter();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#030712] text-[#EDEEF0] relative overflow-hidden flex flex-col pb-20">
      {/* Background Glow */}
      <div className="galaxy-stars" />

      {/* HEADER NAVBAR PATTERN */}
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

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-blue-400 transition-colors mb-6">
          <Icon.ChevronLeft />
          Kembali ke Beranda
        </Link>

        {/* HERO SECTION */}
        <section className="text-center mb-12">
          <div className="tag-chip mb-4 inline-flex items-center gap-2">
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#2563EB",display:"inline-block" }}/>
            Blog & Edukasi
          </div>
          <h1 className="headline text-3xl sm:text-4xl mb-4">
            Edukasi <span className="accent">Saham</span> Terpercaya
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm leading-relaxed">
            Perdalam pemahaman Anda tentang strategi trading, analisis fundamental, analisis teknikal, serta psikologi psikologi pasar langsung dari praktisi profesional.
          </p>
        </section>

        {/* ARTICLES LIST OR EXPANDED VIEW */}
        {expandedSlug ? (
          (() => {
            const article = ARTICLES.find(a => a.slug === expandedSlug);
            if (!article) return null;
            return (
              <div className="glass-card p-6 sm:p-8">
                <button
                  onClick={() => setExpandedSlug(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-blue-400 transition-colors mb-6"
                >
                  <Icon.ChevronLeft />
                  Kembali ke Daftar Artikel
                </button>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="tag-chip text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 text-blue-400 bg-blue-600/10 border border-blue-600/20">
                    {article.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Icon.Calendar />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Icon.Clock />
                    <span>{article.readingTime}</span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white leading-tight">
                  {article.title}
                </h2>
                <div className="h-px bg-[#132238] w-full my-6" />
                <p className="text-neutral-300 text-sm leading-relaxed mb-6 whitespace-pre-line font-medium">
                  {article.excerpt}
                </p>
                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                  {article.content}
                </p>
              </div>
            );
          })()
        ) : (
          <div className="space-y-4">
            {ARTICLES.map((article) => (
              <div key={article.slug} className="glass-card p-6 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="tag-chip text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 text-blue-400 bg-blue-600/10 border border-blue-600/20">
                    {article.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Icon.Calendar />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Icon.Clock />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white">
                  {article.title}
                </h3>

                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                <button
                  onClick={() => setExpandedSlug(article.slug)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  Baca Selengkapnya
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
