// ===== PACKAGES DATA =====
export const packages = [
  {
    id: "basic",
    name: "Basic",
    price: 100000,
    priceLabel: "Rp 100.000",
    period: "/bulan",
    color: "blue",
    gradient: "from-blue-600 to-blue-800",
    borderColor: "border-blue-500/40",
    glowColor: "rgba(14,165,233,0.3)",
    waGroup: "https://chat.whatsapp.com/basic-group",
    features: [
      "Sinyal saham harian",
      "Berita pasar realtime",
      "Chart IHSG live (TradingView)",
      "Modul dasar investasi saham",
      "Grup WA Basic",
    ],
    description: "Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.",
  },
  {
    id: "silver",
    name: "Silver",
    price: 250000,
    priceLabel: "Rp 250.000",
    period: "/bulan",
    color: "emerald",
    gradient: "from-emerald-600 to-blue-700",
    borderColor: "border-emerald-500/40",
    glowColor: "rgba(52,211,153,0.3)",
    waGroup: "https://chat.whatsapp.com/silver-group",
    features: [
      "Semua fitur Basic",
      "Analisis fundamental saham mendalam",
      "Screening saham bagger potensial",
      "Risk & money management",
      "Modul laporan keuangan emiten",
      "Grup WA Silver",
    ],
    description: "Untuk investor yang ingin memahami fundamental dan mulai screening saham potensial secara mandiri.",
  },
  {
    id: "gold",
    name: "Gold",
    price: 500000,
    priceLabel: "Rp 500.000",
    period: "/bulan",
    color: "gold",
    gradient: "from-yellow-500 to-orange-600",
    borderColor: "border-yellow-500/40",
    glowColor: "rgba(245,158,11,0.3)",
    popular: true,
    waGroup: "https://chat.whatsapp.com/gold-group",
    features: [
      "Semua fitur Silver",
      "Sinyal entry, antri, TP, SL premium",
      "Analisis teknikal & bandarmologi",
      "Modul psikologi & emosi trading",
      "Potensi saham multi-bagger pilihan",
      "Laporan mingguan eksklusif",
      "Grup WA Gold Eksklusif",
    ],
    description: "Paket terlaris! Lengkap dengan sinyal premium, analisis teknikal mendalam, dan panduan psikologi trading.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 750000,
    priceLabel: "Rp 750.000",
    period: "/bulan",
    color: "purple",
    gradient: "from-purple-600 to-indigo-700",
    borderColor: "border-purple-500/40",
    glowColor: "rgba(147,51,234,0.3)",
    waGroup: "https://chat.whatsapp.com/pro-group",
    features: [
      "Semua fitur Gold",
      "AI Agent trading assistant 24/7",
      "Watchlist saham personal",
      "Laporan mingguan eksklusif Pro",
      "Priority support langsung",
      "Tape reading & bandarmologi lanjutan",
      "Grup WA Pro VIP",
    ],
    description: "Dilengkapi AI Agent personal untuk bantu analisis, watchlist, dan keputusan trading kapan saja.",
    hasAI: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 900000,
    priceLabel: "Rp 900.000",
    period: "/bulan",
    color: "platinum",
    gradient: "from-slate-400 to-slate-600",
    borderColor: "border-slate-400/40",
    glowColor: "rgba(148,163,184,0.3)",
    waGroup: "https://chat.whatsapp.com/platinum-group",
    features: [
      "Semua fitur Pro",
      "AI Agent canggih + analisis portofolio",
      "Konsultasi 1-on-1 dengan analis senior",
      "Akses penuh semua modul VIP",
      "Sinyal real-time 24/7 tanpa delay",
      "Review portofolio bulanan",
      "Grup WA Platinum Elite",
    ],
    description: "Pengalaman investasi terdepan dengan AI Agent canggih, konsultasi personal, dan sinyal 24/7.",
    hasAI: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 1000000,
    priceLabel: "Rp 1.000.000",
    period: "/bulan",
    color: "elite",
    gradient: "from-yellow-400 via-yellow-500 to-orange-500",
    borderColor: "border-yellow-400/60",
    glowColor: "rgba(251,191,36,0.5)",
    waGroup: "https://chat.whatsapp.com/elite-group",
    features: [
      "Semua fitur Platinum",
      "AI Agent Elite — paling canggih",
      "Portofolio management personal",
      "Akses mentor langsung (1-on-1 intensif)",
      "Event & webinar eksklusif Elite",
      "Laporan harian personal dari analis",
      "Grup WA Elite Master",
      "Akses lifetime konten premium",
    ],
    description: "Paket paling eksklusif. Mentoring langsung, AI Agent Elite, portofolio management, dan akses penuh semua fitur.",
    hasAI: true,
    isElite: true,
  },
];

// ===== MODULES DATA (VIP page — comprehensive descriptions by role) =====
export const vipModules = [
  // ===== BASIC =====
  {
    id: "basic-intro",
    title: "Dasar Investasi Saham",
    icon: "01",
    level: 0,
    pkgLabel: "Basic",
    description: "Modul pengantar lengkap untuk investor pemula. Kamu akan belajar dari nol: apa itu saham, bagaimana Bursa Efek Indonesia bekerja, cara membuka rekening saham, memahami lot, fraksi harga, auto rejection, jam perdagangan, dan cara melakukan transaksi pertamamu. Modul ini dirancang agar siapapun — tanpa latar belakang keuangan — bisa langsung paham dan siap mulai berinvestasi dengan percaya diri.",
    topics: ["Definisi saham & instrumen pasar modal","Mekanisme kerja BEI & JATS","Cara buka rekening & pilih broker","Lot, fraksi harga, auto rejection","Jam perdagangan & sesi bursa","Cara beli saham pertamamu"]
  },
  {
    id: "basic-chart",
    title: "Membaca Chart untuk Pemula",
    icon: "02",
    level: 0,
    pkgLabel: "Basic",
    description: "Belajar membaca grafik harga saham dari dasar. Modul ini mengajarkan perbedaan jenis chart (line, bar, candlestick), cara membaca pergerakan harga harian, dan memahami arti warna merah-hijau pada candlestick. Setelah menyelesaikan modul ini, kamu bisa melihat chart saham dengan lebih percaya diri dan mulai mengidentifikasi tren sederhana tanpa perlu software mahal.",
    topics: ["Jenis chart: line, bar, candlestick","Anatomy candle: OHLC","Bullish vs bearish candle","Timeframe: daily, weekly, monthly","Cara baca volume pada chart","Tools gratis: TradingView, RTI Business"]
  },
  {
    id: "basic-risk",
    title: "Manajemen Modal Pemula",
    icon: "03",
    level: 0,
    pkgLabel: "Basic",
    description: "Salah satu skill terpenting sebelum mulai trading adalah tahu cara mengatur modal. Modul ini membahas berapa modal ideal untuk mulai berinvestasi, cara membagi portofolio agar tidak all-in di satu saham, pentingnya tidak menggunakan uang yang dibutuhkan sehari-hari, dan cara memahami toleransi risiko diri sendiri. Investor yang bertahan adalah investor yang bisa mengelola modalnya dengan baik.",
    topics: ["Modal ideal untuk pemula","Aturan 1%-2% risk per trade","Diversifikasi portofolio sederhana","Jangan pakai uang darurat","Menghitung potensi profit & loss","Mindset jangka panjang vs short term"]
  },
  {
    id: "basic-news",
    title: "Membaca Berita & Sentimen Pasar",
    icon: "04",
    level: 0,
    pkgLabel: "Basic",
    description: "Pasar saham sangat dipengaruhi berita dan sentimen. Modul ini mengajarkan cara membaca berita ekonomi secara efektif, memfilter mana yang relevan dan mana yang hanya rumor, serta bagaimana berita makro seperti inflasi, suku bunga BI, kebijakan pemerintah, dan sentimen global (The Fed, DXY, harga komoditas) berdampak langsung pada pergerakan IHSG dan saham-saham tertentu di BEI.",
    topics: ["Sumber berita terpercaya untuk investor","Pengaruh BI Rate terhadap saham","Dampak data inflasi & GDP","Membaca keterbukaan informasi emiten","Pengaruh sentimen global (Fed, DXY)","Cara tidak panik saat market turun"]
  },

  // ===== SILVER =====
  {
    id: "silver-fundamental",
    title: "Analisis Fundamental: Laporan Keuangan",
    icon: "05",
    level: 1,
    pkgLabel: "Silver",
    description: "Fundamental analysis adalah kunci menemukan saham bagus dengan harga wajar. Kamu akan belajar membaca tiga laporan keuangan utama emiten: neraca keuangan (balance sheet), laporan laba rugi (income statement), dan laporan arus kas (cash flow statement). Kamu akan memahami apa arti setiap angka, bagaimana mengidentifikasi perusahaan yang sehat secara keuangan, dan mana yang harus dihindari. Skill ini dipakai semua investor sukses jangka panjang.",
    topics: ["Laporan laba rugi: revenue, EBITDA, net profit","Neraca: aset, liabilitas, ekuitas","Laporan arus kas: operating, investing, financing","Tanda perusahaan sehat vs bermasalah","Download laporan keuangan di IDX.co.id","Perbandingan antar kuartal (QoQ, YoY)"]
  },
  {
    id: "silver-valuation",
    title: "Rasio Keuangan & Valuasi Saham",
    icon: "06",
    level: 1,
    pkgLabel: "Silver",
    description: "Setelah bisa membaca laporan keuangan, langkah selanjutnya adalah menilai apakah harga saham sudah murah atau mahal dibanding nilainya yang sebenarnya. Modul ini membahas rasio-rasio keuangan penting seperti PER, PBV, ROE, DER, dividend yield, dan cara menggunakannya untuk membandingkan saham sejenis dalam satu industri. Kamu akan punya alat yang tepat untuk menyaring saham undervalued dari ratusan emiten di BEI.",
    topics: ["Price to Earnings Ratio (PER)","Price to Book Value (PBV)","Return on Equity (ROE) & ROA","Debt to Equity Ratio (DER)","Dividend Yield & Payout Ratio","Cara hitung intrinsic value sederhana"]
  },
  {
    id: "silver-screening",
    title: "Screening Saham Berpotensi Bagger",
    icon: "07",
    level: 1,
    pkgLabel: "Silver",
    description: "Bagger saham adalah saham yang harganya naik berkali-kali lipat dalam jangka menengah hingga panjang. Modul ini mengajarkan metode screening sistematis untuk menemukan saham dengan potensi pertumbuhan tinggi sebelum harganya meledak. Kamu akan belajar menggunakan kriteria fundamental yang terbukti — revenue growth, margin expansion, competitive moat, dan positioning industri — untuk menyaring ratusan emiten menjadi shortlist kandidat terbaik.",
    topics: ["Kriteria saham multi-bagger: growth + value","Screening dengan RTI, Stockbit, TradingView","Revenue growth & margin expansion","Emiten dengan competitive moat","Low float, high insider ownership","Sektor yang sedang dalam growth cycle"]
  },
  {
    id: "silver-money",
    title: "Money Management Profesional",
    icon: "08",
    level: 1,
    pkgLabel: "Silver",
    description: "Money management yang baik adalah fondasi dari setiap investor sukses. Modul ini membahas secara mendalam cara mengalokasikan modal secara optimal, teknik Dollar Cost Averaging (DCA) untuk mengurangi risiko timing, cara mengelola profit agar terus berkembang, serta pentingnya menjaga dana darurat terpisah dari modal investasi. Investor yang bisa mengelola uangnya dengan disiplin akan selalu unggul dalam jangka panjang.",
    topics: ["Strategi alokasi modal per saham & sektor","Dollar Cost Averaging (DCA) efektif","Kapan reinvestasi vs ambil profit","Sizing posisi berdasarkan risiko","Menjaga dana darurat sebelum investasi","Compounding: kekuatan bunga berbunga"]
  },

  // ===== GOLD =====
  {
    id: "gold-technical",
    title: "Analisis Teknikal Mendalam",
    icon: "09",
    level: 2,
    pkgLabel: "Gold",
    description: "Analisis teknikal adalah seni membaca pergerakan harga dan volume untuk memprediksi arah saham selanjutnya. Modul ini mengajarkan berbagai metode teknikal dari yang dasar hingga lanjutan: support & resistance, trendline, moving average, RSI, MACD, Bollinger Bands, hingga pola candlestick yang paling reliable. Dengan menguasai teknikal, kamu bisa menentukan entry dan exit yang optimal untuk memaksimalkan profit.",
    topics: ["Support, resistance & trendline","Moving Average: SMA, EMA, WMA","RSI, MACD, Bollinger Bands","Pola candlestick: hammer, engulfing, doji","Volume analysis & divergence","Chart pattern: head & shoulders, cup & handle"]
  },
  {
    id: "gold-bandarmologi",
    title: "Bandarmologi & Tape Reading",
    icon: "10",
    level: 2,
    pkgLabel: "Gold",
    description: "Bandarmologi adalah ilmu membaca jejak big player (bandar) di pasar saham Indonesia — bagaimana mereka mengakumulasi, mendistribusikan, dan menggerakkan harga. Modul ini mengajarkan cara mendeteksi aksi bandar melalui analisis volume, bid-offer, dan pergerakan harga abnormal. Tape reading akan mengajarkan kamu membaca order flow secara real-time untuk ikut arus smart money, bukan melawannya.",
    topics: ["Definisi & cara kerja bandar di BEI","Deteksi akumulasi & distribusi via volume","Analisis bid-offer & market depth","Tape reading: baca order flow real-time","Pola pump before dump & accumulation phase","Saham gorengan vs saham fundamentis"]
  },
  {
    id: "gold-psychology",
    title: "Psikologi & Emosi Trading",
    icon: "11",
    level: 2,
    pkgLabel: "Gold",
    description: "Psikologi adalah faktor terbesar yang membedakan trader sukses dan yang gagal — bahkan lebih penting dari kemampuan analisis. Modul ini membahas secara mendalam bagaimana mengelola fear dan greed, menghindari FOMO dan panic selling, membangun kebiasaan journaling untuk evaluasi berkelanjutan, dan mengembangkan mindset investor jangka panjang yang tidak terguncang oleh volatilitas pasar sehari-hari.",
    topics: ["Fear & greed: kenali dan kelola","FOMO & panic selling: cara menghindari","Trading journal: catat, evaluasi, improve","Bias kognitif yang sering merugikan investor","Membangun sistem trading yang disiplin","Mindset jangka panjang: Buffett vs trader harian"]
  },
  {
    id: "gold-risk",
    title: "Risk Management Advanced",
    icon: "12",
    level: 2,
    pkgLabel: "Gold",
    description: "Risk management tingkat lanjut yang digunakan oleh trader dan investor profesional. Modul ini membahas cara menetapkan stop loss yang strategis (bukan sembarangan), teknik hedging sederhana, cara mengatur ukuran posisi berdasarkan volatilitas saham, dan bagaimana membangun portofolio yang tahan terhadap berbagai kondisi pasar — bull, bear, maupun sideways. Tujuan utamanya adalah memproteksi modal sambil tetap optimal dalam mengambil peluang.",
    topics: ["Stop loss strategis vs stop loss asal","Position sizing berdasarkan ATR & volatilitas","Hedging sederhana untuk proteksi portofolio","Diversifikasi sektor & korelasi aset","Manajemen drawdown: kapan cut loss","Portofolio tahan banting: bull, bear, sideways"]
  },

  // ===== PRO (AI Agent) =====
  {
    id: "pro-ai",
    title: "AI Agent Trading Assistant",
    icon: "13",
    level: 3,
    pkgLabel: "Pro",
    description: "AI Agent eksklusif Ritel Community yang bisa kamu ajak bicara kapan saja, 24 jam sehari, 7 hari seminggu. Tanyakan apapun tentang saham: analisis fundamental emiten, baca laporan keuangan terbaru, cek sentimen berita, identifikasi potensi entry berdasarkan data teknikal, hingga review portofoliomu. AI Agent dilatih dengan data pasar Indonesia sehingga memahami konteks BEI, IDX, dan dinamika saham lokal dengan lebih baik dari chatbot biasa.",
    topics: ["Tanya analisis saham kapan saja","Review fundamental emiten real-time","Interpretasi laporan keuangan otomatis","Rekomendasi entry berdasarkan teknikal","Sentiment analysis berita saham","Bantu susun watchlist personal"]
  },
  {
    id: "pro-watchlist",
    title: "Watchlist & Screening Personal",
    icon: "14",
    level: 3,
    pkgLabel: "Pro",
    description: "Sistem watchlist personal yang dikurasi khusus sesuai profil risiko dan strategi investasimu. Setiap minggu analis kami memperbarui daftar saham-saham yang sedang dalam radar dengan penjelasan mengapa saham tersebut layak dipantau — mulai dari alasan teknikal, fundamental, hingga sentimen sektoral. Kamu tidak perlu lagi bingung memilih dari ratusan emiten, cukup fokus pada shortlist yang sudah terseleksi.",
    topics: ["Watchlist mingguan dikurasi analis","Kriteria masuk & keluar watchlist","Saham di fase akumulasi yang perlu dipantau","Screening berdasarkan sector rotation","Update trigger: kapan waktu beli","Notifikasi perubahan signifikan"]
  },
  {
    id: "pro-report",
    title: "Laporan Eksklusif Pro",
    icon: "15",
    level: 3,
    pkgLabel: "Pro",
    description: "Laporan mingguan eksklusif khusus member Pro yang membahas secara mendalam kondisi pasar, analisis IHSG jangka pendek dan menengah, sektor yang sedang outperform, saham pilihan minggu ini dengan analisis lengkap, dan rangkuman sentimen global yang mempengaruhi BEI. Laporan ini disusun oleh tim analis berpengalaman dan dikirim langsung ke grup WA Pro VIP setiap awal pekan.",
    topics: ["Analisis IHSG mingguan mendalam","Sektor yang sedang outperform","Top picks minggu ini & alasannya","Rangkuman sentimen global","Kalender ekonomi & event penting","Strategi portofolio jangka menengah"]
  },

  // ===== PLATINUM =====
  {
    id: "platinum-consultation",
    title: "Konsultasi 1-on-1 dengan Analis",
    icon: "16",
    level: 4,
    pkgLabel: "Platinum",
    description: "Akses konsultasi langsung dengan analis senior Ritel Community secara personal. Kamu bisa mendiskusikan portofoliomu, meminta second opinion atas keputusan investasi, atau bertanya tentang saham spesifik yang sedang kamu pertimbangkan. Konsultasi dilakukan via chat WhatsApp atau voice call sesuai jadwal yang disepakati. Ini adalah layanan yang biasanya hanya tersedia bagi nasabah high-net-worth di private banking.",
    topics: ["Review portofolio personal bersama analis","Second opinion keputusan investasi besar","Tanya saham spesifik: layak atau tidak?","Strategi rebalancing portofolio","Diskusi sektor & timing masuk","Rencana investasi jangka panjang personal"]
  },
  {
    id: "platinum-advanced-ai",
    title: "AI Agent + Analisis Portofolio",
    icon: "17",
    level: 4,
    pkgLabel: "Platinum",
    description: "Versi lanjutan AI Agent khusus Platinum yang dilengkapi kemampuan analisis portofolio komprehensif. Masukkan daftar saham yang kamu pegang, dan AI akan menganalisis diversifikasi, korelasi antar aset, exposure sektoral, estimasi risiko, dan memberikan saran rebalancing yang konkret. AI Platinum juga memiliki akses ke lebih banyak data historis dan dapat menghasilkan analisis yang lebih mendalam dibanding AI Agent standar.",
    topics: ["Analisis portofolio komprehensif oleh AI","Cek diversifikasi & korelasi aset","Exposure sektoral & risiko konsentrasi","Saran rebalancing berbasis data","Estimasi return berdasarkan historis","Simulasi skenario market crash & bull run"]
  },
  {
    id: "platinum-realtime",
    title: "Sinyal Real-time 24/7",
    icon: "18",
    level: 4,
    pkgLabel: "Platinum",
    description: "Sinyal trading tanpa delay, langsung dari meja analis ke grup WA Platinum Elite dalam hitungan detik. Berbeda dengan paket lain yang memiliki delay hingga beberapa jam, member Platinum mendapatkan sinyal entry, antri, TP, dan SL secara real-time tanpa penundaan. Ini krusial untuk saham dengan volatilitas tinggi di mana keterlambatan beberapa menit saja bisa membuat entry jauh dari harga ideal.",
    topics: ["Sinyal masuk tanpa delay ke WhatsApp","Update TP & SL real-time","Alert pergerakan abnormal saham pilihan","Intraday signal untuk trader aktif","Pre-market & post-market update","Weekend watchlist & strategi mingguan"]
  },

  // ===== ELITE =====
  {
    id: "elite-mentoring",
    title: "Mentoring Langsung (Intensif)",
    icon: "19",
    level: 5,
    pkgLabel: "Elite",
    description: "Program mentoring one-on-one paling intensif yang kami tawarkan. Kamu akan dipasangkan dengan mentor senior yang berpengalaman lebih dari 10 tahun di pasar modal Indonesia. Sesi mentoring dilakukan secara reguler via video call, mencakup review portofolio mendalam, coaching strategi personal, simulasi pengambilan keputusan investasi, hingga pengembangan sistem trading yang benar-benar sesuai dengan gaya dan tujuan finansialmu.",
    topics: ["Sesi video call regular dengan mentor senior","Review & coaching portofolio intensif","Pengembangan sistem trading personal","Simulasi pengambilan keputusan nyata","Koreksi kesalahan pola investasi","Roadmap menuju financial freedom"]
  },
  {
    id: "elite-portfolio",
    title: "Portfolio Management Personal",
    icon: "20",
    level: 5,
    pkgLabel: "Elite",
    description: "Layanan manajemen portofolio personal eksklusif Elite — analis kami membantu merencanakan, memonitor, dan mengoptimalkan portofoliomu secara aktif. Setiap bulan kamu mendapatkan laporan portofolio personal yang mencakup performance review, analisis alokasi, identifikasi peluang optimasi, dan rencana aksi konkret untuk bulan berikutnya. Layanan ini setara dengan layanan wealth management di bank private.",
    topics: ["Perencanaan alokasi portofolio awal","Monitoring & rebalancing aktif bulanan","Laporan performance personal bulanan","Identifikasi drag performance & solusinya","Strategi exit & profit taking terencana","Target return & timeline finansial personal"]
  },
  {
    id: "elite-event",
    title: "Webinar & Event Eksklusif Elite",
    icon: "21",
    level: 5,
    pkgLabel: "Elite",
    description: "Akses eksklusif ke semua event, webinar, dan workshop yang diselenggarakan Ritel Community — termasuk sesi tertutup yang tidak tersedia untuk paket lain. Event rutin mencakup: market outlook bulanan dengan tamu ahli, workshop teknikal intensif, sesi tanya jawab langsung dengan analis top, hingga gathering offline tahunan member Elite. Networking dengan sesama investor Elite juga menjadi nilai tambah yang tidak ternilai.",
    topics: ["Webinar market outlook bulanan","Workshop teknikal intensif (live)","Sesi Q&A langsung dengan analis top","Akses rekaman semua event sebelumnya","Gathering offline tahunan member Elite","Networking eksklusif sesama investor Elite"]
  },
];

// ===== TESTIMONIALS =====
export const testimonials = [
  { id:1, name:"Budi Santoso", package:"Gold", avatar:"BS", rating:5, text:"Sinyalnya akurat banget! Dalam 2 bulan porto gua naik 35%. Komunitas juga aktif dan supportif banget setiap hari.", date:"Mei 2025" },
  { id:2, name:"Sari Dewi", package:"Platinum", avatar:"SD", rating:5, text:"AI Agent-nya luar biasa, bisa analisis saham kapan aja 24 jam. Mentor juga responsif dan helpful banget.", date:"April 2025" },
  { id:3, name:"Rizky Pratama", package:"Silver", avatar:"RP", rating:5, text:"Modul fundamental-nya komprehensif banget. Sekarang udah bisa analisis laporan keuangan sendiri tanpa bingung.", date:"Maret 2025" },
  { id:4, name:"Diana Putri", package:"Elite", avatar:"DP", rating:5, text:"Worth every penny! Sinyal elite + mentor langsung bikin return gua konsisten tiap bulan. Ga nyesel upgrade.", date:"Februari 2025" },
  { id:5, name:"Ahmad Fauzi", package:"Pro", avatar:"AF", rating:5, text:"AI Agent Pro bisa bantu watchlist dan ingatkan sinyal. Fiturnya nambah terus, makin canggih!", date:"Januari 2025" },
  { id:6, name:"Mira Susanti", package:"Gold", avatar:"MS", rating:5, text:"Tadinya mau nyoba Basic dulu, tapi langsung upgrade ke Gold setelah lihat kualitas sinyal dan analisanya.", date:"Desember 2024" },
  { id:7, name:"Hendra Gunawan", package:"Platinum", avatar:"HG", rating:5, text:"Konsultasi 1-on-1 sama analisnya beneran bantu banget. Porto gua naik 60% dalam 3 bulan bergabung.", date:"November 2024" },
  { id:8, name:"Lia Rahayu", package:"Silver", avatar:"LR", rating:5, text:"Buat pemula kayak gue, modul-modulnya gampang banget dipahami. Nggak ada jargon yang bikin pusing.", date:"Oktober 2024" },
  { id:9, name:"Doni Wibowo", package:"Elite", avatar:"DW", rating:5, text:"Fitur elite paling lengkap. Laporan harian personal bikin keputusan investasi gue jauh lebih tepat sasaran.", date:"September 2024" },
  { id:10, name:"Nani Kurniawati", package:"Pro", avatar:"NK", rating:5, text:"Grup WA-nya aktif banget. Diskusi sama sesama member juga nambah banyak insight baru yang nggak ada di buku.", date:"Agustus 2024" },
  { id:11, name:"Farid Rahman", package:"Gold", avatar:"FR", rating:5, text:"Signal win rate-nya emang tinggi. Bulan ini udah hit 4 TP dari 5 sinyal. Konsisten banget timnya.", date:"Juli 2024" },
  { id:12, name:"Yuli Andari", package:"Basic", avatar:"YA", rating:5, text:"Mulai dari Basic dulu untuk belajar. Materinya lengkap dan mudah dicerna. Udah siap upgrade ke Silver!", date:"Juni 2024" },
];
