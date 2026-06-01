"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ===== LIVE INFO BOX (reads from localStorage set by admin) =====
function LiveInfoBox() {
  const [info, setInfo] = useState<{message:string;isActive:boolean}|null>(null);
  useEffect(() => {
    const load = () => {
      try {
        const msg = localStorage.getItem("rc_admin_liveinfo_msg") || "";
        const active = localStorage.getItem("rc_admin_liveinfo_active") === "true";
        if (active && msg.trim()) setInfo({ message: msg, isActive: true });
        else setInfo(null);
      } catch {}
    };
    load();
    const iv = setInterval(load, 10000);
    return () => clearInterval(iv);
  }, []);
  if (!info) return null;
  return (
    <div className="live-info-box mb-6">
      <div className="flex items-start gap-3">
        <span className="text-yellow-400 text-xl mt-0.5 flex-shrink-0">📢</span>
        <div>
          <div className="text-yellow-400 text-xs font-black mb-1.5 tracking-wide">INFO DARI ADMIN</div>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{info.message}</p>
        </div>
      </div>
    </div>
  );
}

// ===== ALL MODULES DATA =====
const ALL_MODULES = [
  // ===== BASIC (pkg level 0) =====
  {
    id:"b1", level:0, pkgLabel:"Basic", icon:"📘", tag:"Pemula",
    title:"Apa Itu Saham & Pasar Modal?",
    desc:"Pelajari dasar-dasar investasi saham dari nol. Kamu akan memahami apa itu saham, bagaimana mekanisme Bursa Efek Indonesia (BEI) bekerja, siapa saja pemain di pasar modal, dan bagaimana proses jual beli saham berlangsung setiap harinya. Cocok untuk kamu yang baru pertama kali mengenal dunia investasi.",
    topics:["Definisi saham & instrumen pasar modal","Mekanisme kerja BEI & JATS","Mengenal broker & rekening saham","Lot, fraksi harga, auto rejection","Jam perdagangan & sesi bursa","Cara beli saham pertamamu"]
  },
  {
    id:"b2", level:0, pkgLabel:"Basic", icon:"📊", tag:"Pemula",
    title:"Membaca Chart Saham untuk Pemula",
    desc:"Belajar cara membaca grafik harga saham secara sederhana. Modul ini mengajarkan perbedaan jenis chart (line, bar, candlestick), cara membaca pergerakan harga, dan memahami arti warna merah-hijau pada candlestick. Kamu akan bisa melihat chart dengan lebih percaya diri setelah menyelesaikan modul ini.",
    topics:["Jenis-jenis chart: line, bar, candlestick","Anatomy candle: open, high, low, close","Bullish vs bearish candle","Timeframe: daily, weekly, monthly","Cara baca volume pada chart","Tools gratis: TradingView, RTI Business"]
  },
  {
    id:"b3", level:0, pkgLabel:"Basic", icon:"💰", tag:"Pemula",
    title:"Manajemen Modal & Risiko Dasar",
    desc:"Salah satu skill terpenting sebelum mulai trading: tahu cara mengatur modal. Modul ini membahas berapa modal ideal untuk mulai, cara membagi portofolio agar tidak all-in satu saham, pentingnya tidak pakai uang panas, dan memahami toleransi risiko diri sendiri sebagai investor pemula.",
    topics:["Berapa modal ideal untuk mulai?","Aturan 1% dan 2% risk per trade","Diversifikasi portofolio sederhana","Jangan pakai uang darurat/panas","Menghitung potensi keuntungan & kerugian","Mindset jangka panjang vs short term"]
  },
  {
    id:"b4", level:0, pkgLabel:"Basic", icon:"📰", tag:"Pemula",
    title:"Membaca Berita Pasar & Sentimen",
    desc:"Pasar saham sangat dipengaruhi berita dan sentimen. Modul ini mengajarkan cara membaca berita ekonomi, memfilter mana berita yang relevan, dan bagaimana berita makro (inflasi, suku bunga, kebijakan pemerintah) berdampak pada pergerakan IHSG dan saham-saham tertentu.",
    topics:["Sumber berita terpercaya untuk investor","Pengaruh BI Rate terhadap saham","Dampak data inflasi & GDP","Membaca pengumuman emiten (keterbukaan)","Pengaruh sentimen global (Fed, DXY)","Cara tidak ikut panik saat market turun"]
  },

  // ===== SILVER (pkg level 1) =====
  {
    id:"s1", level:1, pkgLabel:"Silver", icon:"🔍", tag:"Fundamental",
    title:"Analisis Fundamental: Membaca Laporan Keuangan",
    desc:"Fundamental analysis adalah kunci untuk menemukan saham bagus dengan harga murah. Kamu akan belajar membaca laporan keuangan emiten: neraca, laba rugi, arus kas — dan memahami apa arti angka-angka tersebut bagi kesehatan bisnis perusahaan. Ini adalah skill yang dipakai semua investor sukses jangka panjang.",
    topics:["Laporan laba rugi: revenue, EBITDA, net profit","Neraca keuangan: aset, liabilitas, ekuitas","Laporan arus kas: operating, investing, financing","Tanda-tanda perusahaan sehat vs merugi","Cara download laporan keuangan di IDX.co.id","Membandingkan laporan antar kuartal (QoQ, YoY)"]
  },
  {
    id:"s2", level:1, pkgLabel:"Silver", icon:"📐", tag:"Fundamental",
    title:"Rasio Keuangan & Valuasi Saham",
    desc:"Setelah bisa membaca laporan keuangan, langkah selanjutnya adalah menilai apakah harga saham sudah murah atau mahal. Modul ini membahas rasio-rasio penting seperti PER, PBV, ROE, DER, dan cara menggunakannya untuk membandingkan saham sejenis. Kamu akan punya tools untuk screening saham undervalued.",
    topics:["Price to Earnings Ratio (PER)","Price to Book Value (PBV)","Return on Equity (ROE) & ROA","Debt to Equity Ratio (DER)","Dividend Yield & Payout Ratio","Cara hitung intrinsic value sederhana"]
  },
  {
    id:"s3", level:1, pkgLabel:"Silver", icon:"🔭", tag:"Fundamental",
    title:"Screening Saham Berpotensi Bagger",
    desc:"Bagger saham adalah saham yang harganya naik berkali-kali lipat. Modul ini mengajarkan metode screening untuk menemukan saham-saham dengan potensi pertumbuhan tinggi sebelum harganya meledak. Kamu akan belajar menggunakan kriteria fundamental untuk menyaring ratusan emiten menjadi shortlist terbaik.",
    topics:["Kriteria saham multi-bagger: growth + value","Screening dengan RTI, Stockbit, TradingView","Revenue growth & margin expansion","Emiten dengan competitive moat","Low float, high insider ownership","Sektor yang sedang growth cycle"]
  },
  {
    id:"s4", level:1, pkgLabel:"Silver", icon:"⚖️", tag:"Fundamental",
    title:"Risk & Money Management Lanjutan",
    desc:"Investor yang survive jangka panjang bukan yang paling pintar analisis, tapi yang paling disiplin menjaga modal. Modul ini membahas position sizing, cara menentukan maksimal kerugian per trade, strategi cut loss yang tepat, dan bagaimana membangun portofolio yang terdiversifikasi dengan benar.",
    topics:["Position sizing: Kelly Criterion & fixed %","Cut loss: aturan dan psikologi di baliknya","Averaging down: kapan boleh, kapan bahaya","Portofolio 3 layer: core, growth, speculative","Rekap kinerja bulanan & evaluasi","Target return realistis per tahun"]
  },

  // ===== GOLD (pkg level 2) =====
  {
    id:"g1", level:2, pkgLabel:"Gold", icon:"📈", tag:"Teknikal",
    title:"Analisis Teknikal: Chart Pattern Lengkap",
    desc:"Technical analysis adalah seni membaca pergerakan harga untuk memprediksi arah ke depan. Modul Gold ini membahas semua chart pattern penting yang digunakan trader profesional: dari pattern reversal, continuation, hingga pattern khusus IDX. Dilengkapi contoh real dari saham-saham IDX.",
    topics:["Support & resistance: cara menentukan level kuat","Trend: uptrend, downtrend, sideways","Pattern reversal: head & shoulders, double top/bottom","Pattern continuation: flag, pennant, triangle","Wedge, cup & handle, rounding bottom","Cara trade setiap pattern dengan entry & SL"]
  },
  {
    id:"g2", level:2, pkgLabel:"Gold", icon:"📡", tag:"Teknikal",
    title:"Indikator Teknikal & Oscillator",
    desc:"Indikator membantu konfirmasi sinyal dari price action. Modul ini membahas indikator-indikator yang paling efektif digunakan di pasar saham Indonesia, cara mengkombinasikannya, dan menghindari kesalahan umum overanalyzing. Less is more — kamu hanya perlu 2-3 indikator yang benar-benar dikuasai.",
    topics:["Moving Average: SMA, EMA, golden/death cross","MACD: histogram, sinyal divergence","RSI: overbought, oversold, hidden divergence","Bollinger Bands: squeeze & breakout","Stochastic & Volume Oscillator","Kombinasi indikator terbaik untuk IDX"]
  },
  {
    id:"g3", level:2, pkgLabel:"Gold", icon:"🎯", tag:"Strategi",
    title:"Strategi Entry, TP & Stop Loss",
    desc:"Punya sinyal bagus saja tidak cukup. Yang membedakan trader profit dan rugi adalah eksekusi entry yang tepat, target profit yang realistis, dan stop loss yang disiplin. Modul ini mengajarkan cara menentukan entry ideal, menghitung risk-reward ratio, dan strategi trailing stop untuk memaksimalkan profit.",
    topics:["Teknik entry: breakout, pullback, reversal","Risk-reward ratio: minimal 1:2, idealnya 1:3","Cara hitung TP berdasarkan chart target","Stop loss: hard stop vs mental stop","Trailing stop: teknik dan tools","Averaging up (bukan averaging down)"]
  },
  {
    id:"g4", level:2, pkgLabel:"Gold", icon:"🧠", tag:"Psikologi",
    title:"Psikologi Trading & Emosi Pasar",
    desc:"80% keberhasilan trading ditentukan oleh psikologi, bukan teknik. Modul ini membahas bias-bias kognitif yang merusak keputusan trader, siklus emosi pasar (fear & greed), cara membangun trading plan yang kuat, dan disiplin mengikuti sistem tanpa terpengaruh noise. Ini adalah modul yang paling diabaikan tapi paling krusial.",
    topics:["Fear & Greed Index: cara bacanya","Bias FOMO, confirmation bias, loss aversion","Siklus psikologi pasar: euforia → panik","Cara membuat trading journal yang efektif","Ritual sebelum & sesudah market hours","Tanda-tanda kamu terlalu emosional saat trading"]
  },
  {
    id:"g5", level:2, pkgLabel:"Gold", icon:"💎", tag:"Strategi",
    title:"Strategi Saham Multi-Bagger IDX",
    desc:"Menemukan saham yang naik 200-1000% dalam 1-3 tahun adalah impian setiap investor. Modul ini mengungkap framework yang digunakan untuk mengidentifikasi calon saham multi-bagger di IDX sebelum institusi besar masuk. Dilengkapi case study saham-saham IDX yang sudah terbukti multi-bagger.",
    topics:["Karakteristik saham pra-bagger: volume, chart, fundamental","Siklus industri & thematic investing","Emerging sector di Indonesia (EV, digital, nikel)","Insider buying & block transaction","Kapan akumulasi, kapan distribusi","Case study: GOTO, BREN, AMRT, dan lainnya"]
  },

  // ===== PRO (pkg level 3) =====
  {
    id:"p1", level:3, pkgLabel:"Pro", icon:"🕵️", tag:"Bandarmologi",
    title:"Bandarmologi: Membaca Jejak Bandar",
    desc:"Bandarmologi adalah teknik membaca pergerakan bandar (market maker & institusi besar) yang mengendalikan arah saham. Dengan memahami bagaimana bandar bekerja — fasa akumulasi, mark-up, distribusi, dan markdown — kamu bisa ikut bandar dan bukan menjadi korbannya. Ini ilmu eksklusif yang membedakan trader ritel yang profit dari yang selalu nyangkut.",
    topics:["Siapa itu bandar? Institusi, foreign, sekuritas besar","4 fase Wyckoff: accumulation, markup, distribution, markdown","Cara baca broker summary & net buy/sell","Identifikasi akumulasi dari volume & price action","Pola distribusi: bandar jualan saat publik beli","Saham 'milik bandar' vs saham retail"]
  },
  {
    id:"p2", level:3, pkgLabel:"Pro", icon:"📟", tag:"Tape Reading",
    title:"Tape Reading & Order Flow",
    desc:"Tape reading adalah skill membaca aliran order secara real-time untuk mengetahui siapa yang mendominasi pasar saat itu — pembeli atau penjual. Modul ini mengajarkan cara membaca bid-ask, antrian order (orderbook), dan interpretasi setiap transaksi besar yang masuk ke pasar. Skill ini sangat berguna untuk timing entry yang presisi.",
    topics:["Cara baca orderbook: bid, ask, volume","Interpretasi big lot & block trade","Pola accumulate di bid vs offer","Fake breakout vs breakout asli dari order flow","Tools tape reading di KSEI & sekuritas","Teknik mendeteksi smart money entry"]
  },
  {
    id:"p3", level:3, pkgLabel:"Pro", icon:"🤖", tag:"AI & Tools",
    title:"Menggunakan AI untuk Analisis Saham",
    desc:"AI Agent eksklusif Ritel Community bisa membantu kamu menganalisis saham secara mendalam dalam hitungan detik. Modul ini mengajarkan cara optimal menggunakan AI Agent untuk analisis fundamental & teknikal, membuat watchlist otomatis, set alert harga, dan mendapatkan rekomendasi yang personalized sesuai risk profile kamu.",
    topics:["Cara menggunakan RC AI Agent secara efektif","Prompt terbaik untuk analisis fundamental","AI untuk screening saham multi-bagger","Setup alert & monitoring portofolio dengan AI","Integrasi AI dengan TradingView & RTI","Limitasi AI: kenapa human judgment tetap penting"]
  },
  {
    id:"p4", level:3, pkgLabel:"Pro", icon:"⚡", tag:"Strategi",
    title:"Scalping & Short-Term Trading IDX",
    desc:"Scalping dan trading jangka pendek membutuhkan kecepatan, disiplin, dan sistem yang terstruktur. Modul ini membahas strategi khusus untuk trading intraday dan swing trade 1-5 hari di pasar IDX, termasuk saham-saham yang cocok untuk scalping, timing terbaik dalam sesi bursa, dan cara mengelola multiple posisi secara bersamaan.",
    topics:["Karakter saham scalp-able di IDX","Sesi terbaik untuk scalping: pagi vs siang","Strategi opening range breakout (ORB)","Teknik gap fill & gap and go","Manajemen multiple posisi bersamaan","Ketentuan T+2 & short selling di IDX"]
  },
  {
    id:"p5", level:3, pkgLabel:"Pro", icon:"📊", tag:"Portofolio",
    title:"Membangun & Memonitor Portofolio Pro",
    desc:"Investor profesional tidak hanya tahu cara membeli saham — mereka tahu cara membangun portofolio yang optimal, merebalance secara berkala, dan mengukur performa dengan metrik yang tepat. Modul ini membahas framework portofolio dari level Pro: dari alokasi aset, hedging sederhana, hingga evaluasi performa bulanan.",
    topics:["Framework 3-bucket: value, growth, speculative","Rebalancing portofolio: kapan dan bagaimana","Mengukur alpha vs benchmark IHSG","Hedging sederhana dengan ETF & reksa dana","Tracking portofolio dengan Stockbit/Ajaib","Laporan kinerja bulanan untuk diri sendiri"]
  },

  // ===== PLATINUM (pkg level 4) =====
  {
    id:"pl1", level:4, pkgLabel:"Platinum", icon:"🔬", tag:"Advanced",
    title:"Bandarmologi Lanjutan: Siklus Distribusi",
    desc:"Level lanjutan dari Bandarmologi: memahami siklus distribusi bandar secara mendalam. Kamu akan belajar mendeteksi tanda-tanda ketika bandar mulai keluar dari posisi, pola distribusi yang tersembunyi dalam chart, dan cara memproteksi diri dari jebakan 'pump and dump'. Ini adalah skill yang memisahkan trader amatir dari yang benar-benar profesional.",
    topics:["Distribusi tersembunyi: upthrust & UTAD","Cara baca composite man Wyckoff lanjutan","Cross-referencing: bandarmologi + tape reading","Pola shakeout: bandar membersihkan weak hands","Identifikasi secondary test & spring","Studi kasus distribusi saham-saham IDX terkini"]
  },
  {
    id:"pl2", level:4, pkgLabel:"Platinum", icon:"🌍", tag:"Makro",
    title:"Analisis Makroekonomi & Global Market",
    desc:"Pasar saham Indonesia tidak berdiri sendiri — ia sangat dipengaruhi oleh kondisi ekonomi global. Modul Platinum ini mengajarkan cara membaca indikator makroekonomi global (Fed policy, DXY, yield obligasi AS), hubungannya dengan IHSG, dan bagaimana positioning portofolio menghadapi siklus ekonomi yang berbeda.",
    topics:["Fed Rate & dampaknya ke emerging market","DXY Index: kenapa dollar kuat = IHSG tertekan","Yield curve & resesi: signal apa?","Commodity cycle: nikel, CPO, batubara vs IDX","Foreign flow: korelasi asing dengan IHSG","Posisi Indonesia dalam siklus ekonomi global"]
  },
  {
    id:"pl3", level:4, pkgLabel:"Platinum", icon:"📋", tag:"Korporasi",
    title:"Analisis Korporasi & Aksi Korporat",
    desc:"Aksi korporat seperti rights issue, stock split, merger, akuisisi, dan IPO bisa menjadi katalis besar bagi pergerakan saham. Modul ini mengajarkan cara membaca dan menginterpretasikan setiap jenis aksi korporat, menilai dampaknya terhadap valuasi, dan menentukan apakah aksi tersebut menguntungkan atau merugikan pemegang saham.",
    topics:["Rights issue: dilutif atau akumulasi?","Stock split & reverse split: implikasinya","Merger & akuisisi: siapa yang diuntungkan?","IPO analysis: cara screening saham baru","Buyback saham: sinyal bullish dari manajemen","Dividen spesial vs dividen reguler"]
  },
  {
    id:"pl4", level:4, pkgLabel:"Platinum", icon:"🏆", tag:"Advanced",
    title:"Live Trading Session & Review",
    desc:"Teori tanpa praktek tidak akan membuat kamu menjadi trader yang baik. Modul Platinum ini memberikan akses ke sesi live trading bersama mentor senior, di mana kamu bisa melihat langsung bagaimana analisis diterapkan di pasar real-time, mengajukan pertanyaan, dan mendapatkan feedback langsung atas trade yang sedang kamu pertimbangkan.",
    topics:["Sesi live market setiap hari Selasa & Kamis","Watchlist saham mingguan dari mentor","Review trade: yang profit & yang loss","Q&A langsung dengan analis senior","Rekaman sesi (dapat diakses ulang)","Diskusi tesis investasi bersama komunitas"]
  },

  // ===== ELITE (pkg level 5) =====
  {
    id:"e1", level:5, pkgLabel:"Elite", icon:"👑", tag:"Elite",
    title:"Sistem Trading Profesional End-to-End",
    desc:"Modul Elite tertinggi yang membahas bagaimana membangun sistem trading lengkap yang bisa kamu jalankan secara konsisten selama bertahun-tahun. Dari riset awal hingga eksekusi dan evaluasi — kamu akan memiliki framework trading sendiri yang teruji, bukan sekadar ikut-ikutan sinyal. Ini adalah fondasi menjadi trader full-time yang profesional.",
    topics:["Building a trading system: dari nol sampai teruji","Backtesting strategi dengan data historis IDX","Forward testing & paper trading","Sistem screening harian yang efisien","Automasi watchlist & alert (tools)","Ketika sistem fail: bagaimana beradaptasi"]
  },
  {
    id:"e2", level:5, pkgLabel:"Elite", icon:"🏦", tag:"Elite",
    title:"Institusional Thinking: Cara Berpikir seperti Big Player",
    desc:"Untuk konsisten menang di pasar, kamu harus tahu cara berpikir seperti institusi — fund manager, hedge fund, dan bank investasi. Modul ini membuka cara pandang institusional dalam memilih saham, membangun posisi besar, dan exit strategy yang tidak merusak harga. Ini adalah perspektif yang hampir tidak pernah diajarkan di tempat lain.",
    topics:["Bagaimana fund manager memilih saham","Quarterly rebalancing institusi & dampaknya","Window dressing: manfaatkan untuk profit","Cara institusi membangun posisi besar (akumulasi diam)","Perbedaan retail flow vs institutional flow","Membaca 13F filing & broker research"]
  },
  {
    id:"e3", level:5, pkgLabel:"Elite", icon:"🔐", tag:"Elite",
    title:"Konsultasi Portofolio Personal 1-on-1",
    desc:"Sebagai member Elite, kamu mendapatkan akses konsultasi langsung dengan analis senior untuk review portofolio personal kamu. Sesi 1-on-1 ini membahas komposisi portofolio, saham yang perlu di-cut, saham yang layak diakumulasi, dan strategi jangka panjang yang disesuaikan dengan profil risiko dan tujuan finansial kamu.",
    topics:["Review portofolio personal bulanan","Rekomendasi cut/hold/add per saham","Strategi menghadapi kondisi market saat ini","Target portfolio allocation yang optimal","Perencanaan finansial & target return tahunan","Priority WhatsApp line ke analis senior"]
  },
  {
    id:"e4", level:5, pkgLabel:"Elite", icon:"🌟", tag:"Elite",
    title:"Akses Seumur Hidup & Private Community",
    desc:"Member Elite mendapatkan akses seumur hidup ke semua konten Ritel Community yang terus diperbarui, termasuk modul-modul baru yang akan dirilis ke depan. Selain itu, kamu masuk ke grup private Elite yang sangat eksklusif — tempat di mana ide-ide investasi paling alpha dibagikan, diskusi paling serius terjadi, dan jejaring sesama investor profesional terbentuk.",
    topics:["Akses lifetime ke semua modul (update included)","Grup WhatsApp Elite eksklusif","Monthly market outlook dari kepala analis","Akses rekaman semua live session","Undangan event offline & networking","Early access sinyal & riset terbaru"]
  },
];

const PKG_LEVELS = ["basic","silver","gold","pro","platinum","elite"];
const PKG_COLORS: any = {
  basic:"text-slate-400 border-slate-400/20 bg-slate-400/5",
  silver:"text-slate-200 border-slate-300/30 bg-slate-300/5",
  gold:"text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
  pro:"text-blue-400 border-blue-400/20 bg-blue-400/5",
  platinum:"text-purple-400 border-purple-400/20 bg-purple-400/5",
  elite:"text-orange-400 border-orange-400/20 bg-orange-400/5",
};
const TAG_COLORS: any = {
  Pemula:"bg-slate-500/20 text-slate-400",
  Fundamental:"bg-green-500/15 text-green-400",
  Teknikal:"bg-blue-500/15 text-blue-400",
  Strategi:"bg-indigo-500/15 text-indigo-400",
  Psikologi:"bg-pink-500/15 text-pink-400",
  Bandarmologi:"bg-red-500/15 text-red-400",
  "Tape Reading":"bg-orange-500/15 text-orange-400",
  "AI & Tools":"bg-cyan-500/15 text-cyan-400",
  Portofolio:"bg-teal-500/15 text-teal-400",
  Advanced:"bg-purple-500/15 text-purple-400",
  Makro:"bg-yellow-500/15 text-yellow-400",
  Korporasi:"bg-emerald-500/15 text-emerald-400",
  Elite:"bg-orange-500/20 text-orange-400",
};

export default function VipPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [tab, setTab] = useState("signals");
  const [expandedModul, setExpandedModul] = useState<string|null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    const userStr = localStorage.getItem("vip_user");
    if (!token) { router.push("/login"); return; }

    if (userStr) {
      const u = JSON.parse(userStr);
      if (new Date(u.expiredAt) < new Date()) {
        localStorage.removeItem("vip_token");
        localStorage.removeItem("vip_user");
        router.push("/login");
        return;
      }
      setUser(u);
    }

    // Re-verify token
    fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ token }) })
      .then(r=>r.json()).then(d=>{
        if (!d.success) { localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user"); router.push("/login"); }
        else { setUser(d.user); localStorage.setItem("vip_user", JSON.stringify(d.user)); }
      }).catch(()=>{});

    // Load signals from localStorage (set by admin)
    try {
      const sigs = localStorage.getItem("rc_admin_signals");
      if (sigs) setSignals(JSON.parse(sigs));
    } catch {}
  }, []);

  const logout = () => { localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user"); router.push("/login"); };

  const pkgLevel = PKG_LEVELS.indexOf(user?.package || "basic");
  const mySignals = signals.filter(s=>(s.package||[]).includes(user?.package));
  const myModules = ALL_MODULES.filter(m => m.level <= pkgLevel);
  const lockedModules = ALL_MODULES.filter(m => m.level > pkgLevel);

  const actionColor: any = { BUY:"bg-green-400/10 text-green-400", SELL:"bg-red-400/10 text-red-400", HOLD:"bg-yellow-400/10 text-yellow-400", ANTRI:"bg-blue-400/10 text-blue-400" };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-slate-500 text-sm">Memverifikasi akses...</div></div>;

  const tabs = [["signals","⚡ Sinyal"],["market","📈 Market"],["modul","📚 Modul"],["ai","🤖 AI Agent"]];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
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
        <LiveInfoBox />

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-white mb-2">Selamat datang, {user.name}! 👋</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold capitalize px-2.5 py-1 rounded-full border ${PKG_COLORS[user.package]||""}`}>
              Paket {user.package}
            </span>
            <span className="text-xs text-slate-500">
              Aktif hingga {new Date(user.expiredAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/5 mb-6 overflow-x-auto">
          {tabs.map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${tab===t?"border-blue-500 text-blue-400":"border-transparent text-slate-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>

        {/* ===== SIGNALS ===== */}
        {tab==="signals" && (
          <div>
            <div className="mb-4">
              <h2 className="text-white font-bold text-sm">⚡ Sinyal untuk Paket <span className="capitalize text-blue-400">{user.package}</span></h2>
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
                  <div key={i} className="card rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-black text-white text-lg">{s.kode}</div>
                        <div className="text-xs text-slate-500">{s.saham}</div>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action]||"bg-white/10 text-white"}`}>{s.action}</span>
                    </div>
                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Target Profit</span><span className="text-green-400 font-medium">{s.tp}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">{s.sl}</span></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-400 border-t border-white/5 pt-3 leading-relaxed">{s.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MARKET ===== */}
        {tab==="market" && (
          <div>
            <h2 className="text-white font-bold text-sm mb-4">📈 IHSG Live Chart</h2>
            <div className="card rounded-2xl overflow-hidden">
              <iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tv_vip&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1" style={{width:"100%",height:"420px",border:"none"}} title="IHSG VIP"/>
            </div>
          </div>
        )}

        {/* ===== MODUL ===== */}
        {tab==="modul" && (
          <div>
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-1">📚 Modul Edukasi Trading Saham</h2>
              <p className="text-slate-500 text-xs">Kamu punya akses ke <span className="text-white font-bold">{myModules.length} modul</span> dari total {ALL_MODULES.length} modul. {lockedModules.length > 0 && `Upgrade untuk unlock ${lockedModules.length} modul lagi.`}</p>
            </div>

            {/* Unlocked modules */}
            <div className="space-y-3 mb-8">
              {myModules.map(m=>(
                <div key={m.id} className="card rounded-xl overflow-hidden hover:border-white/15 transition-all">
                  <button onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)} className="w-full p-4 flex items-start gap-3 text-left">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[m.tag]||"bg-white/10 text-slate-400"}`}>{m.tag}</span>
                      </div>
                      <h3 className="text-white text-sm font-bold leading-snug">{m.title}</h3>
                      {expandedModul!==m.id && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{m.desc}</p>}
                    </div>
                    <svg className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-1 transition-transform ${expandedModul===m.id?"rotate-180":""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                  </button>

                  {expandedModul===m.id && (
                    <div className="px-4 pb-5 border-t border-white/5">
                      <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{m.desc}</p>
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Yang akan kamu pelajari:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {m.topics.map((t,i)=>(
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                              <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>{t}
                            </div>
                          ))}
                        </div>
                      </div>
                      <a href={`https://wa.me/6282218723401?text=Halo%20min%20mau%20akses%20modul%20${encodeURIComponent(m.title)}!`} target="_blank" className="btn-primary text-xs px-5 py-2 rounded-lg inline-block">
                        📩 Minta Akses Modul
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Locked modules */}
            {lockedModules.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/5"/>
                  <span className="text-xs text-slate-600 font-medium">🔒 {lockedModules.length} MODUL TERKUNCI</span>
                  <div className="h-px flex-1 bg-white/5"/>
                </div>
                <div className="space-y-2">
                  {lockedModules.map(m=>(
                    <div key={m.id} className="rounded-xl p-4 flex items-center gap-3 opacity-40" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
                      <span className="text-xl flex-shrink-0">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                        </div>
                        <p className="text-white text-xs font-bold">{m.title}</p>
                      </div>
                      <span className="text-slate-600 text-xs">🔒</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20upgrade%20paket!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">
                    🚀 Upgrade Paket untuk Unlock Semua
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== AI AGENT ===== */}
        {tab==="ai" && (
          <div>
            {pkgLevel>=3 ? (
              <div className="card rounded-2xl p-6 max-w-lg">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
                  <span className="font-bold text-white text-sm">AI Agent RC</span>
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                  <span className="text-xs text-green-400">Online</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">AI Agent aktif untuk paket <span className="text-blue-400 font-bold capitalize">{user.package}</span> kamu.</p>
                <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20akses%20AI%20Agent!" target="_blank" className="btn-primary text-sm px-5 py-2.5 rounded-xl inline-block">💬 Minta Link Akses AI Agent</a>
              </div>
            ) : (
              <div className="card rounded-2xl p-10 text-center max-w-sm mx-auto">
                <p className="text-4xl mb-3">🤖</p>
                <p className="text-white font-bold mb-1">AI Agent tersedia mulai Paket Pro</p>
                <p className="text-slate-500 text-xs mb-5">Upgrade ke Pro untuk akses AI Agent analisis saham realtime, portfolio tracker, dan alert otomatis.</p>
                <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20upgrade%20ke%20Pro!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Upgrade ke Pro</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
