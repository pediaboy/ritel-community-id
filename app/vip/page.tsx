"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ===== TILT =====
function TiltCard({ children, className="" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-0.5; const y = (e.clientY-r.top)/r.height-0.5;
    el.style.transform = `perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform=""; };
  return <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>;
}

// ===== LIVE INFO BOX =====
function LiveInfoBox() {
  const [info, setInfo] = useState<{message:string;isActive:boolean}|null>(null);
  useEffect(() => {
    const load = () => {
      fetch("/api/admin/liveinfo").then(r=>r.json()).then(d=>{
        const li = d.liveInfo;
        if(li && li.isActive && li.message?.trim()) setInfo({message:li.message,isActive:true});
        else setInfo(null);
      }).catch(()=>{});
    };
    load(); const iv=setInterval(load,30000); return ()=>clearInterval(iv);
  },[]);
  if(!info) return null;
  return (
    <div className="live-info-box mb-6">
      <div className="flex items-start gap-3">
        <span className="text-yellow-400 text-xl mt-0.5 flex-shrink-0">📢</span>
        <div>
          <div className="text-yellow-400 text-xs font-black mb-1.5 tracking-wide">INFO DARI ADMIN</div>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{info.message}</p>
          {tab==="ai" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5 shadow-2xl shadow-cyan-500/30">
                <span className="text-white text-3xl font-black">AI</span>
              </div>
              <h2 className="text-white font-black text-xl mb-2">RC-AI Analyst</h2>
              <p className="text-slate-400 text-sm mb-2 max-w-sm leading-relaxed">AI analis saham eksklusif yang bisa analisis teknikal, fundamental, bandarmologi, dan baca screenshot chart secara real-time.</p>
              <p className="text-slate-500 text-xs mb-6">Powered by Gemini 1.5 Flash · Bisa kirim gambar chart</p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {["📊 Analisis teknikal","🔍 Baca chart Anda","🎯 Rekomen entry/TP/SL","💡 Bandarmologi","📈 Screening saham"].map((f,i)=>(
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 text-slate-400">{f}</span>
                ))}
              </div>
              <a href="/ai" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm inline-block">
                Buka RC-AI Analyst →
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const PKG_LEVELS = ["basic","silver","gold","pro","platinum","elite"];
const PKG_COLORS: any = {
  basic:"border-blue-500/40 text-blue-400",
  silver:"border-cyan-500/40 text-cyan-400",
  gold:"border-yellow-500/40 text-yellow-400",
  pro:"border-purple-500/40 text-purple-400",
  platinum:"border-slate-400/40 text-slate-300",
  elite:"border-yellow-400/60 text-yellow-300",
};

// ===== ALL MODULES (comprehensive, by level) =====
const ALL_MODULES = [
  // BASIC
  {id:"b1",level:0,pkgLabel:"Basic",icon:"📘",tag:"Pemula",title:"Dasar Investasi Saham",
   desc:"Modul pengantar lengkap untuk investor pemula. Kamu akan belajar dari nol: apa itu saham, bagaimana Bursa Efek Indonesia bekerja, cara membuka rekening saham, memahami lot, fraksi harga, auto rejection, jam perdagangan, dan cara melakukan transaksi pertamamu. Dirancang agar siapapun — tanpa latar belakang keuangan — bisa langsung paham dan siap mulai berinvestasi dengan percaya diri.",
   topics:["Definisi saham & instrumen pasar modal","Mekanisme kerja BEI & JATS","Cara buka rekening & pilih broker","Lot, fraksi harga, auto rejection","Jam perdagangan & sesi bursa","Cara beli saham pertamamu"]},
  {id:"b2",level:0,pkgLabel:"Basic",icon:"📊",tag:"Pemula",title:"Membaca Chart Saham",
   desc:"Belajar membaca grafik harga saham dari dasar. Modul ini mengajarkan perbedaan jenis chart (line, bar, candlestick), cara membaca pergerakan harga harian, dan memahami arti warna merah-hijau pada candlestick. Setelah menyelesaikan modul ini, kamu bisa melihat chart saham dengan lebih percaya diri dan mulai mengidentifikasi tren sederhana tanpa perlu software mahal.",
   topics:["Jenis chart: line, bar, candlestick","Anatomy candle: OHLC","Bullish vs bearish candle","Timeframe: daily, weekly, monthly","Cara baca volume pada chart","Tools gratis: TradingView, RTI Business"]},
  {id:"b3",level:0,pkgLabel:"Basic",icon:"💰",tag:"Pemula",title:"Manajemen Modal Pemula",
   desc:"Salah satu skill terpenting sebelum mulai trading adalah tahu cara mengatur modal. Modul ini membahas berapa modal ideal untuk mulai berinvestasi, cara membagi portofolio agar tidak all-in di satu saham, pentingnya tidak menggunakan uang yang dibutuhkan sehari-hari, dan cara memahami toleransi risiko diri sendiri. Investor yang bertahan adalah investor yang bisa mengelola modalnya dengan baik.",
   topics:["Modal ideal untuk pemula","Aturan 1%-2% risk per trade","Diversifikasi portofolio sederhana","Jangan pakai uang darurat","Menghitung potensi profit & loss","Mindset jangka panjang vs short term"]},
  {id:"b4",level:0,pkgLabel:"Basic",icon:"📰",tag:"Pemula",title:"Membaca Berita & Sentimen Pasar",
   desc:"Pasar saham sangat dipengaruhi berita dan sentimen. Modul ini mengajarkan cara membaca berita ekonomi secara efektif, memfilter mana yang relevan dan mana yang hanya rumor, serta bagaimana berita makro seperti inflasi, suku bunga BI, kebijakan pemerintah, dan sentimen global (The Fed, DXY, harga komoditas) berdampak langsung pada IHSG dan saham-saham di BEI.",
   topics:["Sumber berita terpercaya untuk investor","Pengaruh BI Rate terhadap saham","Dampak data inflasi & GDP","Membaca keterbukaan informasi emiten","Pengaruh sentimen global (Fed, DXY)","Cara tidak panik saat market turun"]},
  // SILVER
  {id:"s1",level:1,pkgLabel:"Silver",icon:"🔍",tag:"Fundamental",title:"Analisis Fundamental: Laporan Keuangan",
   desc:"Fundamental analysis adalah kunci menemukan saham bagus dengan harga wajar. Kamu akan belajar membaca tiga laporan keuangan utama: neraca keuangan, laporan laba rugi, dan laporan arus kas. Kamu akan memahami apa arti setiap angka, bagaimana mengidentifikasi perusahaan yang sehat secara keuangan, dan mana yang harus dihindari. Skill ini digunakan semua investor sukses jangka panjang.",
   topics:["Laporan laba rugi: revenue, EBITDA, net profit","Neraca: aset, liabilitas, ekuitas","Laporan arus kas: operating, investing, financing","Tanda perusahaan sehat vs bermasalah","Download laporan keuangan di IDX.co.id","Perbandingan antar kuartal (QoQ, YoY)"]},
  {id:"s2",level:1,pkgLabel:"Silver",icon:"📐",tag:"Fundamental",title:"Rasio Keuangan & Valuasi Saham",
   desc:"Setelah bisa membaca laporan keuangan, langkah selanjutnya adalah menilai apakah harga saham sudah murah atau mahal dibanding nilainya yang sebenarnya. Modul ini membahas rasio keuangan penting: PER, PBV, ROE, DER, dividend yield, dan cara menggunakannya untuk membandingkan saham sejenis dalam satu industri. Kamu akan punya alat yang tepat untuk menyaring saham undervalued.",
   topics:["Price to Earnings Ratio (PER)","Price to Book Value (PBV)","Return on Equity (ROE) & ROA","Debt to Equity Ratio (DER)","Dividend Yield & Payout Ratio","Cara hitung intrinsic value sederhana"]},
  {id:"s3",level:1,pkgLabel:"Silver",icon:"🔭",tag:"Fundamental",title:"Screening Saham Berpotensi Bagger",
   desc:"Bagger saham adalah saham yang harganya naik berkali-kali lipat dalam jangka menengah hingga panjang. Modul ini mengajarkan metode screening sistematis untuk menemukan saham dengan potensi pertumbuhan tinggi sebelum harganya meledak — menggunakan kriteria fundamental yang terbukti: revenue growth, margin expansion, competitive moat, dan positioning industri.",
   topics:["Kriteria saham multi-bagger: growth + value","Screening dengan RTI, Stockbit, TradingView","Revenue growth & margin expansion","Emiten dengan competitive moat","Low float, high insider ownership","Sektor yang sedang dalam growth cycle"]},
  {id:"s4",level:1,pkgLabel:"Silver",icon:"⚖️",tag:"Manajemen Risiko",title:"Risk & Money Management Lanjutan",
   desc:"Investor yang survive jangka panjang bukan yang paling pintar analisis, tapi yang paling disiplin menjaga modal. Modul ini membahas position sizing, cara menentukan maksimal kerugian per trade, strategi cut loss yang tepat, averaging down yang benar, dan bagaimana membangun portofolio yang terdiversifikasi secara optimal.",
   topics:["Position sizing: Kelly Criterion & fixed %","Cut loss: aturan dan psikologi di baliknya","Averaging down: kapan boleh, kapan bahaya","Portofolio 3 layer: core, growth, speculative","Rekap kinerja bulanan & evaluasi","Target return realistis per tahun"]},
  // GOLD
  {id:"g1",level:2,pkgLabel:"Gold",icon:"📈",tag:"Teknikal",title:"Analisis Teknikal Mendalam",
   desc:"Technical analysis adalah seni membaca pergerakan harga untuk memprediksi arah ke depan. Modul Gold ini membahas semua chart pattern penting yang digunakan trader profesional: dari pattern reversal, continuation, hingga pattern khusus yang sering muncul di saham-saham IDX. Dilengkapi contoh nyata dan cara entry-exit setiap pattern.",
   topics:["Support & resistance: cara menentukan level kuat","Trend: uptrend, downtrend, sideways","Pattern reversal: head & shoulders, double top","Pattern continuation: flag, pennant, triangle","Moving Average: SMA, EMA, WMA","Cara trade setiap pattern dengan entry & SL"]},
  {id:"g2",level:2,pkgLabel:"Gold",icon:"📡",tag:"Teknikal",title:"Indikator Teknikal & Oscillator",
   desc:"Indikator membantu konfirmasi sinyal dari price action. Modul ini membahas indikator yang paling efektif di pasar saham Indonesia, cara mengkombinasikannya tanpa overanalyzing, dan menghindari kesalahan umum yang dilakukan pemula. Prinsipnya: less is more — 2-3 indikator yang dikuasai lebih baik dari 10 indikator yang tidak dipahami.",
   topics:["RSI: overbought, oversold, divergence","MACD: signal line & histogram","Bollinger Bands: squeeze & expansion","Stochastic & CCI untuk timing entry","Volume: OBV, volume spread analysis","Cara kombinasi indikator tanpa konflik"]},
  {id:"g3",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Bandarmologi",title:"Bandarmologi & Tape Reading",
   desc:"Bandarmologi adalah ilmu membaca jejak big player (bandar) di pasar saham Indonesia — bagaimana mereka mengakumulasi, mendistribusikan, dan menggerakkan harga. Modul ini mengajarkan cara mendeteksi aksi bandar melalui analisis volume, bid-offer, dan pergerakan harga abnormal. Tape reading akan mengajarkan kamu membaca order flow secara real-time untuk ikut arus smart money.",
   topics:["Definisi & cara kerja bandar di BEI","Deteksi akumulasi & distribusi via volume","Analisis bid-offer & market depth","Tape reading: baca order flow real-time","Pola pump before dump & accumulation phase","Saham gorengan vs saham fundamentis"]},
  {id:"g4",level:2,pkgLabel:"Gold",icon:"🧠",tag:"Psikologi",title:"Psikologi & Emosi Trading",
   desc:"Psikologi adalah faktor terbesar yang membedakan trader sukses dan yang gagal — bahkan lebih penting dari kemampuan analisis. Modul ini membahas secara mendalam bagaimana mengelola fear dan greed, menghindari FOMO dan panic selling, membangun kebiasaan journaling untuk evaluasi berkelanjutan, dan mengembangkan mindset investor jangka panjang yang tidak terguncang oleh volatilitas pasar sehari-hari.",
   topics:["Fear & greed: kenali dan kelola","FOMO & panic selling: cara menghindari","Trading journal: catat, evaluasi, improve","Bias kognitif yang sering merugikan investor","Membangun sistem trading yang disiplin","Mindset jangka panjang: Buffett vs trader harian"]},
  // PRO
  {id:"p1",level:3,pkgLabel:"Pro",icon:"🤖",tag:"AI Agent",title:"AI Agent Trading Assistant 24/7",
   desc:"AI Agent eksklusif Ritel Community yang bisa kamu ajak bicara kapan saja, 24 jam sehari, 7 hari seminggu. Tanyakan apapun tentang saham: analisis fundamental emiten, baca laporan keuangan terbaru, cek sentimen berita, identifikasi potensi entry berdasarkan data teknikal, hingga review portofoliomu. AI Agent dilatih dengan data pasar Indonesia sehingga memahami konteks BEI dan dinamika saham lokal.",
   topics:["Tanya analisis saham kapan saja 24/7","Review fundamental emiten real-time","Interpretasi laporan keuangan otomatis","Rekomendasi entry berdasarkan teknikal","Sentiment analysis berita saham","Bantu susun watchlist personal"]},
  {id:"p2",level:3,pkgLabel:"Pro",icon:"👁️",tag:"Watchlist",title:"Watchlist & Screening Personal Pro",
   desc:"Sistem watchlist personal yang dikurasi khusus sesuai profil risiko dan strategi investasimu. Setiap minggu analis kami memperbarui daftar saham yang sedang dalam radar dengan penjelasan mengapa layak dipantau — mulai dari alasan teknikal, fundamental, hingga sentimen sektoral. Tidak perlu lagi bingung memilih dari ratusan emiten.",
   topics:["Watchlist mingguan dikurasi analis senior","Kriteria masuk & keluar watchlist","Saham di fase akumulasi yang perlu dipantau","Screening berdasarkan sector rotation","Update trigger: kapan waktu beli","Notifikasi perubahan signifikan saham pilihan"]},
  {id:"p3",level:3,pkgLabel:"Pro",icon:"📋",tag:"Laporan",title:"Laporan Mingguan Eksklusif Pro",
   desc:"Laporan mingguan eksklusif khusus member Pro yang membahas secara mendalam kondisi pasar, analisis IHSG jangka pendek dan menengah, sektor yang sedang outperform, saham pilihan minggu ini dengan analisis lengkap, dan rangkuman sentimen global yang mempengaruhi BEI. Disusun oleh tim analis berpengalaman dan dikirim setiap awal pekan.",
   topics:["Analisis IHSG mingguan mendalam","Sektor yang sedang outperform","Top picks minggu ini & alasannya","Rangkuman sentimen global","Kalender ekonomi & event penting","Strategi portofolio jangka menengah"]},
  // PLATINUM
  {id:"pl1",level:4,pkgLabel:"Platinum",icon:"💬",tag:"Konsultasi",title:"Konsultasi 1-on-1 dengan Analis Senior",
   desc:"Akses konsultasi langsung dengan analis senior Ritel Community secara personal. Kamu bisa mendiskusikan portofoliomu, meminta second opinion atas keputusan investasi, atau bertanya tentang saham spesifik yang sedang dipertimbangkan. Konsultasi dilakukan via chat WhatsApp atau voice call sesuai jadwal. Ini layanan yang biasanya hanya tersedia bagi nasabah high-net-worth di private banking.",
   topics:["Review portofolio personal bersama analis","Second opinion keputusan investasi besar","Tanya saham spesifik: layak atau tidak?","Strategi rebalancing portofolio","Diskusi sektor & timing masuk optimal","Rencana investasi jangka panjang personal"]},
  {id:"pl2",level:4,pkgLabel:"Platinum",icon:"🧬",tag:"AI Advanced",title:"AI Agent Advanced + Analisis Portofolio",
   desc:"Versi lanjutan AI Agent khusus Platinum yang dilengkapi kemampuan analisis portofolio komprehensif. Masukkan daftar saham yang kamu pegang, dan AI akan menganalisis diversifikasi, korelasi antar aset, exposure sektoral, estimasi risiko, dan memberikan saran rebalancing yang konkret. AI Platinum memiliki akses ke lebih banyak data historis dan menghasilkan analisis lebih mendalam.",
   topics:["Analisis portofolio komprehensif oleh AI","Cek diversifikasi & korelasi aset","Exposure sektoral & risiko konsentrasi","Saran rebalancing berbasis data historis","Estimasi return berdasarkan historis 10 tahun","Simulasi skenario market crash & bull run"]},
  {id:"pl3",level:4,pkgLabel:"Platinum",icon:"⚡",tag:"Sinyal",title:"Sinyal Real-time 24/7 Tanpa Delay",
   desc:"Sinyal trading tanpa delay, langsung dari meja analis ke grup WA Platinum Elite dalam hitungan detik. Berbeda dengan paket lain yang memiliki delay beberapa jam, member Platinum mendapatkan sinyal entry, antri, TP, dan SL secara real-time. Ini krusial untuk saham dengan volatilitas tinggi di mana keterlambatan beberapa menit saja bisa membuat entry jauh dari harga ideal.",
   topics:["Sinyal masuk tanpa delay ke WhatsApp","Update TP & SL secara real-time","Alert pergerakan abnormal saham pilihan","Intraday signal untuk trader aktif","Pre-market & post-market update harian","Weekend watchlist & strategi mingguan"]},
  // ELITE
  {id:"e1",level:5,pkgLabel:"Elite",icon:"👨‍🏫",tag:"Mentoring",title:"Mentoring Langsung (1-on-1 Intensif)",
   desc:"Program mentoring one-on-one paling intensif yang kami tawarkan. Kamu akan dipasangkan dengan mentor senior yang berpengalaman lebih dari 10 tahun di pasar modal Indonesia. Sesi mentoring dilakukan secara reguler via video call, mencakup review portofolio mendalam, coaching strategi personal, simulasi pengambilan keputusan, hingga pengembangan sistem trading yang benar-benar sesuai dengan gaya dan tujuan finansialmu.",
   topics:["Sesi video call regular dengan mentor senior","Review & coaching portofolio intensif","Pengembangan sistem trading personal","Simulasi pengambilan keputusan nyata","Koreksi kesalahan pola investasi","Roadmap menuju financial freedom"]},
  {id:"e2",level:5,pkgLabel:"Elite",icon:"💼",tag:"Portfolio",title:"Portfolio Management Personal Elite",
   desc:"Layanan manajemen portofolio personal eksklusif Elite — analis kami membantu merencanakan, memonitor, dan mengoptimalkan portofoliomu secara aktif. Setiap bulan kamu mendapatkan laporan portofolio personal yang mencakup performance review, analisis alokasi, identifikasi peluang optimasi, dan rencana aksi konkret untuk bulan berikutnya. Setara layanan wealth management di bank private.",
   topics:["Perencanaan alokasi portofolio awal","Monitoring & rebalancing aktif bulanan","Laporan performance personal bulanan","Identifikasi drag performance & solusinya","Strategi exit & profit taking terencana","Target return & timeline finansial personal"]},
  {id:"e3",level:5,pkgLabel:"Elite",icon:"🎓",tag:"Event",title:"Webinar & Event Eksklusif Elite",
   desc:"Akses eksklusif ke semua event, webinar, dan workshop yang diselenggarakan Ritel Community — termasuk sesi tertutup yang tidak tersedia untuk paket lain. Event rutin mencakup: market outlook bulanan dengan tamu ahli, workshop teknikal intensif, sesi tanya jawab langsung dengan analis top, hingga gathering offline tahunan member Elite.",
   topics:["Webinar market outlook bulanan","Workshop teknikal intensif live","Sesi Q&A langsung dengan analis top","Akses rekaman semua event sebelumnya","Gathering offline tahunan member Elite","Networking eksklusif sesama investor Elite"]},
];

const TAG_COLORS: any = {
  "Pemula":"bg-blue-500/10 text-blue-400","Fundamental":"bg-green-500/10 text-green-400",
  "Teknikal":"bg-purple-500/10 text-purple-400","Bandarmologi":"bg-orange-500/10 text-orange-400",
  "Psikologi":"bg-pink-500/10 text-pink-400","Manajemen Risiko":"bg-red-500/10 text-red-400",
  "AI Agent":"bg-cyan-500/10 text-cyan-400","Watchlist":"bg-indigo-500/10 text-indigo-400",
  "Laporan":"bg-yellow-500/10 text-yellow-400","Konsultasi":"bg-teal-500/10 text-teal-400",
  "AI Advanced":"bg-cyan-500/10 text-cyan-400","Sinyal":"bg-green-500/10 text-green-400",
  "Mentoring":"bg-rose-500/10 text-rose-400","Portfolio":"bg-amber-500/10 text-amber-400",
  "Event":"bg-violet-500/10 text-violet-400",
};

export default function VipPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [premiumSignals, setPremiumSignals] = useState<any[]>([]);
  const [ihsgNews, setIhsgNews] = useState<any[]>([]);
  const [tab, setTab] = useState("signals");
  const [expandedModul, setExpandedModul] = useState<string|null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    const userStr = localStorage.getItem("vip_user");
    if (!token) { router.push("/login"); return; }
    if (userStr) {
      const u = JSON.parse(userStr);
      if (new Date(u.expiredAt) < new Date()) {
        localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user");
        router.push("/login"); return;
      }
      setUser(u);
    }
    const storedSession = localStorage.getItem("vip_session");
    fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,sessionId:storedSession||undefined})})
      .then(r=>r.json()).then(d=>{
        if(!d.success){localStorage.removeItem("vip_token");localStorage.removeItem("vip_user");localStorage.removeItem("vip_session");router.push("/login?error="+encodeURIComponent(d.message||""));}
        else{
          setUser(d.user);
          localStorage.setItem("vip_user",JSON.stringify(d.user));
          if(d.sessionId) localStorage.setItem("vip_session",d.sessionId);
          if(d.tokenId) localStorage.setItem("vip_tokenid",d.tokenId);
        }
      }).catch(()=>{});
    // Fetch sinyal dari Supabase via API
    fetch("/api/admin/signals").then(r=>r.json()).then(d=>{
      if(d.signals) setSignals(d.signals);
    }).catch(()=>{});
    // Load IHSG news
    fetch("/api/news").then(r=>r.json()).then(d=>setIhsgNews((d.news||[]).slice(0,8))).catch(()=>{});
  }, []);

  const logout = () => {
    const tokenId = localStorage.getItem("vip_tokenid");
    if(tokenId) fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout",tokenId})}).catch(()=>{});
    localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user"); localStorage.removeItem("vip_session"); localStorage.removeItem("vip_tokenid"); router.push("/login");
  };
  const pkgLevel = PKG_LEVELS.indexOf(user?.package||"basic");
  const mySignals = signals.filter(s=>(s.package||[]).includes(user?.package));
  const myModules = ALL_MODULES.filter(m=>m.level<=pkgLevel);
  const lockedModules = ALL_MODULES.filter(m=>m.level>pkgLevel);
  const actionColor: any = { BUY:"bg-green-400/10 text-green-400", SELL:"bg-red-400/10 text-red-400", HOLD:"bg-yellow-400/10 text-yellow-400", ANTRI:"bg-cyan-400/10 text-cyan-400" };

  if (!user) return <div className="min-h-screen bg-[#04060f] flex items-center justify-center"><div className="galaxy-stars"/><div className="relative z-10 text-slate-500 text-sm">Memverifikasi akses...</div></div>;

  const tabs = [["signals","Sinyal"],["market","Market & Berita"],["premium","Sinyal Premium"],["modul","Modul"],["ai","🤖 AI Analyst"]];

  return (
    <div className="min-h-screen bg-[#04060f]">
      <div className="galaxy-stars"/>
      <div className="relative z-10">
        <header className="bg-black/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
            <span className="text-white font-black text-sm hidden sm:block">RITEL COMMUNITY.ID</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-white text-xs font-bold">{user.name}</div>
              <div className={`text-xs font-bold capitalize ${PKG_COLORS[user.package]?.split(" ")[0]||"text-white"}`}>Paket {user.package}</div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${PKG_COLORS[user.package]||""}`}>
              {user.name?.charAt(0)||"V"}
            </div>
            <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-white/5">Logout</button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <LiveInfoBox/>
          <div className="mb-6">
            <h1 className="text-xl font-black text-white mb-2">Selamat datang, {user.name}!</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold capitalize px-2.5 py-1 rounded-full border ${PKG_COLORS[user.package]||""}`}>Paket {user.package}</span>
              <span className="text-xs text-slate-500">Aktif hingga {new Date(user.expiredAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</span>
            </div>
          </div>

          <div className="flex gap-0 border-b border-white/5 mb-6 overflow-x-auto">
            {tabs.map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all relative ${tab===t?"tab-neon-active":"border-transparent text-slate-500 hover:text-white hover:border-white/20"}`}>{l}</button>
            ))}
          </div>

          {/* SIGNALS */}
          {tab==="signals" && (
            <div>
              <div className="mb-4">
                <h2 className="text-white font-bold text-sm">Sinyal untuk Paket <span className="capitalize text-cyan-400">{user.package}</span></h2>
                <p className="text-slate-500 text-xs mt-0.5">{mySignals.length} sinyal aktif</p>
              </div>
              {mySignals.length===0 ? (
                <div className="card rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-3">⏳</p>
                  <p className="text-slate-400 text-sm mb-1">Belum ada sinyal untuk paket {user.package}</p>
                  <p className="text-slate-600 text-xs">Sinyal baru akan muncul saat analis merilis. Stay tuned!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mySignals.map((s,i)=>(
                    <TiltCard key={i}>
                      <div className="card rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div><div className="font-black text-white text-lg">{s.kode}</div><div className="text-xs text-slate-500">{s.saham}</div></div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action]||"bg-white/10 text-white"}`}>{s.action}</span>
                        </div>
                        <div className="space-y-1.5 text-xs mb-3">
                          <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="text-green-400 font-medium">{s.tp}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">{s.sl}</span></div>
                        </div>
                        {s.notes&&<p className="text-xs text-slate-400 border-t border-white/5 pt-3 leading-relaxed">{s.notes}</p>}
                      </div>
                    </TiltCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MARKET + BERITA IHSG REALTIME */}
          {tab==="market" && (
            <div>
              <h2 className="text-white font-bold text-sm mb-4">IHSG Live Chart (TradingView)</h2>
              <TiltCard className="mb-6">
                <div className="card-glass rounded-2xl overflow-hidden">
                  <iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tv_vip&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1" style={{width:"100%",height:"400px",border:"none"}} title="IHSG VIP"/>
                </div>
              </TiltCard>
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Berita Pasar Saham IHSG Realtime</h3>
                {ihsgNews.length===0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {title:"IHSG Menguat Ditopang Sektor Perbankan",source:"CNBC Indonesia",time:"1 jam lalu",url:"#"},
                      {title:"Asing Net Buy Rp 1.2 T, Sentimen Positif",source:"Kontan",time:"2 jam lalu",url:"#"},
                      {title:"BBCA Cetak Rekor Laba Baru Q1 2025",source:"Bisnis.com",time:"3 jam lalu",url:"#"},
                      {title:"BI Pertahankan Suku Bunga 5.75%",source:"Detik Finance",time:"4 jam lalu",url:"#"},
                      {title:"Saham Nikel Menguat, ANTM Naik 3%",source:"IDX Channel",time:"5 jam lalu",url:"#"},
                      {title:"GOTO Profitabel Pertama Kali, Saham Melesat",source:"Tempo",time:"6 jam lalu",url:"#"},
                    ].map((n,i)=>(
                      <TiltCard key={i}>
                        <a href={n.url} target="_blank" className="card rounded-xl p-4 block group">
                          <div className="text-xs text-cyan-400 mb-2 font-medium">{n.source} · {n.time}</div>
                          <h4 className="text-white text-sm font-bold group-hover:text-cyan-400 transition-colors leading-snug">{n.title}</h4>
                        </a>
                      </TiltCard>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ihsgNews.map((n,i)=>(
                      <TiltCard key={i}>
                        <a href={n.url||"#"} target="_blank" className="card rounded-xl p-4 block group">
                          <div className="text-xs text-cyan-400 mb-2 font-medium">{n.source} · {n.time}</div>
                          <h4 className="text-white text-sm font-bold group-hover:text-cyan-400 transition-colors leading-snug">{n.title}</h4>
                          {n.summary&&<p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.summary}</p>}
                        </a>
                      </TiltCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SINYAL PREMIUM */}
          {tab==="premium" && (
            <div>
              <div className="mb-4">
                <h2 className="text-white font-bold text-sm">Sinyal & Konten Premium</h2>
                <p className="text-slate-500 text-xs mt-0.5">Konten eksklusif dari analis — diupdate berkala oleh admin</p>
              </div>
              {premiumSignals.length===0 ? (
                <div className="space-y-3">
                  {[
                    {title:"Bandarmologi Report Mingguan",content:"Analisis bandarmologi mendalam setiap minggu. Deteksi pola akumulasi dan distribusi big player di 10 saham paling aktif di IDX. Pantau pergerakan smart money sebelum harga bergerak signifikan."},
                    {title:"Tape Reading Live Update",content:"Laporan tape reading intraday dari meja trading analis kami. Baca pergerakan order flow dan deteksi anomali volume yang mengindikasikan aksi bandar secara real-time di jam perdagangan."},
                    {title:"Bagger Pick Bulanan",content:"1-3 saham kandidat bagger pilihan analis setiap bulan. Setiap pick disertai analisis fundamental lengkap, valuasi, target harga, dan estimasi timeline untuk mencapai target tersebut."},
                    {title:"Watchlist Premium Minggu Ini",content:"Daftar 5-10 saham yang sedang dalam radar analis minggu ini. Dilengkapi alasan teknikal dan fundamental, serta level entry yang direkomendasikan untuk setiap saham dalam daftar."},
                  ].map((s,i)=>(
                    <TiltCard key={i}>
                      <div className="card rounded-xl p-5">
                        <h3 className="font-bold text-white mb-3">{s.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{s.content}</p>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {premiumSignals.map((s,i)=>(
                    <TiltCard key={i}>
                      <div className="card rounded-xl p-5">
                        <h3 className="font-bold text-white mb-3">{s.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{s.content}</p>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODUL */}
          {tab==="modul" && (
            <div>
              <div className="mb-6">
                <h2 className="text-white font-bold text-sm mb-1">Modul Edukasi Trading Saham</h2>
                <p className="text-slate-500 text-xs">Kamu punya akses ke <span className="text-white font-bold">{myModules.length} modul</span> dari total {ALL_MODULES.length} modul. {lockedModules.length>0&&`Upgrade untuk unlock ${lockedModules.length} modul lagi.`}</p>
              </div>
              <div className="space-y-3 mb-8">
                {myModules.map(m=>(
                  <TiltCard key={m.id}>
                    <div className="card rounded-xl overflow-hidden">
                      <button onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)} className="w-full p-4 flex items-start gap-3 text-left">
                        <span className="text-2xl flex-shrink-0 mt-0.5">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[m.tag]||"bg-white/10 text-slate-400"}`}>{m.tag}</span>
                          </div>
                          <h3 className="text-white text-sm font-bold leading-snug">{m.title}</h3>
                          {expandedModul!==m.id&&<p className="text-slate-500 text-xs mt-1 line-clamp-2">{m.desc}</p>}
                        </div>
                        <svg className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-1 transition-transform ${expandedModul===m.id?"rotate-180":""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                      </button>
                      {expandedModul===m.id&&(
                        <div className="px-4 pb-5 border-t border-white/5">
                          <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{m.desc}</p>
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Yang akan kamu pelajari:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {m.topics.map((t,i)=>(
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                  <span className="text-cyan-400 flex-shrink-0">✓</span>{t}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TiltCard>
                ))}
              </div>
              {lockedModules.length>0&&(
                <div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">Modul Terkunci (Upgrade untuk Akses)</h3>
                  <div className="space-y-2">
                    {lockedModules.map(m=>(
                      <div key={m.id} className="card rounded-xl p-4 opacity-40 flex items-center gap-3">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                          <h3 className="text-white text-sm font-bold mt-1">{m.title}</h3>
                        </div>
                        <span className="ml-auto text-slate-500 text-lg">🔒</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20paket!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Upgrade Paket</a>
                  </div>
                </div>
              )}
            </div>
          )}
          {tab==="ai" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5 shadow-2xl shadow-cyan-500/30">
                <span className="text-white text-3xl font-black">AI</span>
              </div>
              <h2 className="text-white font-black text-xl mb-2">RC-AI Analyst</h2>
              <p className="text-slate-400 text-sm mb-2 max-w-sm leading-relaxed">AI analis saham eksklusif yang bisa analisis teknikal, fundamental, bandarmologi, dan baca screenshot chart secara real-time.</p>
              <p className="text-slate-500 text-xs mb-6">Powered by Gemini 1.5 Flash · Bisa kirim gambar chart</p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {["📊 Analisis teknikal","🔍 Baca chart Anda","🎯 Rekomen entry/TP/SL","💡 Bandarmologi","📈 Screening saham"].map((f,i)=>(
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 text-slate-400">{f}</span>
                ))}
              </div>
              <a href="/ai" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm inline-block">
                Buka RC-AI Analyst →
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

