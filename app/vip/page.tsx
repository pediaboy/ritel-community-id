"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ===== MOTIVASI TICKER VIP =====
function MotivasiTickerVIP() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    try {
      const syncData = JSON.parse(localStorage.getItem("rc_sync") || "{}");
      if (syncData.motivasi && syncData.motivasi.length > 0) {
        setList(syncData.motivasi.map((m: any) => m.text));
      } else {
        setList([
          "Jangan takut untuk belajar — satu langkah kecil hari ini adalah investasi terbesar untuk masa depanmu.",
          "Pasar tidak menghukum yang berani belajar. Pasar menghukum yang tidak mau bersiap.",
          "Cari mentor yang tepat — pengalaman mereka bisa memotong kurva belajarmu bertahun-tahun.",
        ]);
      }
    } catch {}
  }, []);
  if (list.length === 0) return null;
  const doubled = [...list, ...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.04)", borderTop:"1px solid rgba(234,179,8,0.1)", borderBottom:"1px solid rgba(234,179,8,0.1)", padding:"7px 0", overflow:"hidden" }}>
      <div style={{ display:"flex" }}>
        <div style={{ display:"flex", animation:"motivasiMove 55s linear infinite", whiteSpace:"nowrap", alignItems:"center" }}>
          {doubled.map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 text-xs" style={{ color:"rgba(234,179,8,0.7)" }}>
              <span style={{ color:"rgba(234,179,8,0.4)" }}>✦</span>
              {text}
              <span style={{ color:"rgba(234,179,8,0.25)", marginLeft:16 }}>|</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes motivasiMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}


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
        const active = li?.isActive ?? li?.is_active;
        if(li && active && li.message?.trim()) setInfo({message:li.message,isActive:true});
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
const MODULE_CONTENT: any = {
  b1: {
    image: null,
    lessons: [
      { title:"Apa Itu Saham?", body:"Saham adalah bukti kepemilikan sebagian dari sebuah perusahaan. Saat kamu beli saham BBCA, kamu jadi salah satu pemilik Bank BCA. Keuntungan dari dua sumber: kenaikan harga (capital gain) dan pembagian laba perusahaan (dividen)." },
      { title:"Cara Kerja Bursa Efek", body:"BEI adalah tempat jual beli saham terorganisir. Sesi I: 09:00–12:00, Sesi II: 13:30–15:49 WIB. Harga ditentukan mekanisme supply & demand — siapa yang mau beli dan siapa yang mau jual di harga berapa." },
      { title:"Membuka Rekening Saham", body:"Pilih broker terdaftar OJK: BCA Sekuritas, Mirae Asset, Mandiri Sekuritas, Stockbit. Siapkan KTP, NPWP, foto selfie, rekening bank. Proses 1-3 hari kerja. Setelah aktif, transfer ke RDN dan mulai beli saham." },
      { title:"Lot & Fraksi Harga", body:"1 lot = 100 lembar saham. Harga saham Rp 1.000 → 1 lot = Rp 100.000. Fraksi harga: saham < Rp 200 bergerak Rp 1/tick, > Rp 5.000 bergerak Rp 25/tick. Auto rejection mencegah harga naik/turun lebih dari 35% sehari." },
      { title:"Transaksi Pertamamu", body:"Cari saham di aplikasi → masukkan kode (misal: BBCA) → pilih jumlah lot → klik Beli. Pastikan saldo RDN cukup. Order dieksekusi saat ada penjual di harga yang sama. Cek portofoliomu di menu Portofolio." },
    ]
  },
  b2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/38303af8a_generated_image.png",
    lessons: [
      { title:"Jenis Chart Saham", body:"3 jenis chart utama: Line chart (hanya harga penutupan), Bar chart (OHLC), dan Candlestick chart (paling populer). Trader profesional pakai candlestick karena paling informatif dan mudah dibaca secara visual." },
      { title:"Anatomy Candlestick (OHLC)", body:"Setiap candle: Open (buka), High (tertinggi), Low (terendah), Close (tutup). Body = jarak open ke close. Shadow/ekor = jarak ke high/low. Candle hijau = close > open (bullish). Candle merah = close < open (bearish)." },
      { title:"Pola Candle Penting", body:"Hammer: body kecil, ekor panjang bawah → sinyal reversal naik. Shooting Star: ekor panjang atas → sinyal reversal turun. Bullish Engulfing: candle hijau besar 'menelan' candle merah → sinyal kuat naik. Doji: open ≈ close → ketidakpastian pasar." },
      { title:"Membaca Timeframe", body:"Daily chart = 1 candle = 1 hari (paling umum untuk swing trading). Weekly = trend menengah. Monthly = jangka panjang. Semakin besar timeframe, semakin kuat sinyalnya. Selalu cek daily, konfirmasi di weekly." },
      { title:"Tools Chart Gratis", body:"TradingView (tradingview.com) — terbaik, bisa set alert harga gratis. RTI Business — data saham IDX lengkap. Stockbit — cocok untuk trader Indonesia. Semua gratis, tinggal daftar dan cari kode saham BEI." },
    ]
  },
  b3: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/837ca8cd8_generated_image.png",
    lessons: [
      { title:"Modal Ideal untuk Mulai", body:"Tidak ada minimal modal di BEI — bahkan Rp 100.000 sudah bisa beli 1 lot. Idealnya mulai Rp 1–5 juta agar bisa diversifikasi 3-5 saham. Yang terpenting: jangan pakai uang yang dibutuhkan dalam 3-6 bulan ke depan." },
      { title:"Aturan 1-2% Risk Per Trade", body:"Jika portofoliomu Rp 10 juta, maksimal risiko per transaksi = Rp 100.000–200.000 (1-2%). Artinya jika stop loss kena, kamu kehilangan maksimal 2% dari total modal — bukan hancur total. Ini aturan paling fundamental dalam manajemen modal." },
      { title:"Diversifikasi Portofolio", body:"Jangan taruh semua telur dalam satu keranjang. Idealnya 3-7 saham dari sektor berbeda. Contoh: 1 perbankan (BBCA), 1 energi (PGAS), 1 konsumer (UNVR), 1 infrastruktur (JSMR). Korelasi rendah antar saham = risiko lebih terkontrol." },
      { title:"3 Layer Portofolio", body:"Core (50%): Blue chip stabil — BBCA, TLKM, BMRI. Tahan lama, dividen bagus. Growth (30%): Mid-cap dengan potensi tumbuh — sektor teknologi, kesehatan. Speculative (20%): Small cap berpotensi tinggi, risiko besar — batasi ketat dan selalu pasang stop loss." },
      { title:"Menghitung Profit & Loss", body:"Profit = (Harga Jual - Harga Beli) × Jumlah Lembar - Biaya Broker. Biaya broker 0.1-0.3% per transaksi. Contoh: Beli BBCA 1 lot @ Rp 9.000, jual @ Rp 9.500 → Profit ≈ Rp 48.000 setelah biaya. Selalu hitung net profit setelah biaya." },
    ]
  },
  b4: {
    image: null,
    lessons: [
      { title:"Sumber Berita Terpercaya", body:"CNBC Indonesia — berita pasar saham & makro terkini. Kontan.co.id — analisis saham & laporan keuangan. IDX.co.id — keterbukaan informasi resmi emiten. Investing.com — data ekonomi global & kalender ekonomi. Bloomberg/Reuters — sentimen global utama." },
      { title:"Pengaruh BI Rate", body:"BI naikkan suku bunga → saham cenderung turun (investor lebih suka deposito/obligasi). BI turunkan suku bunga → saham cenderung naik (biaya modal murah, ekspansi bisnis lebih mudah). Sektor perbankan paling sensitif terhadap perubahan BI Rate." },
      { title:"Dampak Data Makro", body:"Inflasi tinggi → BI naikkan rate → tekanan saham. GDP tumbuh → ekonomi sehat → saham naik. PMI manufaktur > 50 → ekspansi → positif. Data tenaga kerja AS (NFP) tiap Jumat pertama bulan → penggerak pasar global termasuk IHSG." },
      { title:"Membaca Keterbukaan Informasi", body:"Buka idx.co.id → Perusahaan Tercatat → Keterbukaan Informasi. Cari: laporan keuangan kuartalan, laporan tahunan, corporate action (dividen, rights issue, buyback), keterbukaan material (akuisisi, pergantian direksi). Semua emiten BEI wajib lapor ke IDX." },
      { title:"Tidak Panik Saat Market Turun", body:"Koreksi pasar adalah normal dan terjadi tiap tahun. IHSG pernah turun 50%+ saat krisis, tapi selalu recovery. Kunci: jangan investasi dengan uang pinjaman, jangan lihat portofolio tiap menit, fokus pada kualitas perusahaan bukan fluktuasi harga jangka pendek." },
    ]
  },
  s1: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/92bd00609_generated_image.png",
    lessons: [
      { title:"Laporan Laba Rugi", body:"Komponen utama: Revenue (total pendapatan), Gross Profit (Revenue - HPP), EBITDA (laba sebelum bunga, pajak, depresiasi), Net Profit (laba bersih). Cari perusahaan dengan net profit margin konsisten naik tiap tahun — itu tanda bisnis makin efisien." },
      { title:"Neraca Keuangan (Balance Sheet)", body:"Snapshot kondisi keuangan pada tanggal tertentu. Aset = Liabilitas + Ekuitas. Cek: Current Ratio (aset lancar / utang lancar) > 1.5 = bagus. DER (debt/equity) < 1 = lebih aman. Ekuitas terus naik dari tahun ke tahun = perusahaan tumbuh sehat." },
      { title:"Laporan Arus Kas", body:"Paling susah dipalsukan. Operating Cash Flow positif dan tumbuh = bisnis sehat. Jika net profit positif tapi OCF negatif → waspada, bisa window dressing. Investing Cash Flow negatif bisa bagus (ekspansi). Free Cash Flow = OCF - Capex — ini yang paling dicermati investor institusi." },
      { title:"Red Flags Perusahaan Bermasalah", body:"🚨 Piutang tumbuh jauh lebih cepat dari revenue, utang membengkak tiap tahun, gross margin terus menurun, pergantian auditor mendadak, direksi menjual saham besar-besaran, laporan keuangan sering direvisi, dan OCF terus negatif meski laba positif." },
      { title:"Download & Baca Laporan Keuangan", body:"Buka idx.co.id → Perusahaan Tercatat → Laporan Keuangan. Atau di website IR perusahaan. Bandingkan minimal 4 kuartal (QoQ) dan 3 tahun (YoY) untuk lihat tren. Gunakan Stockbit atau RTI untuk ringkasan cepat tanpa baca PDF panjang." },
    ]
  },
  s2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/92bd00609_generated_image.png",
    lessons: [
      { title:"Price to Earnings Ratio (PER)", body:"PER = Harga Saham / EPS. Contoh: harga Rp 1.000, EPS Rp 100 → PER 10x = kamu bayar 10 tahun laba. PER rendah belum tentu murah — bandingkan dengan rata-rata sektornya. Bank besar biasanya PER 8-15x, sektor tech bisa 30-50x." },
      { title:"Price to Book Value (PBV)", body:"PBV = Harga Saham / Nilai Buku per Saham. PBV < 1 = harga di bawah nilai aset bersih (potensi undervalue, tapi cek fundamentalnya). Untuk saham bank, PBV 1-2.5x wajar. PBV > 5x = mahal, kecuali growth sangat tinggi dan ROE konsisten." },
      { title:"ROE & ROA", body:"ROE (Return on Equity) = Net Profit / Ekuitas. ROE > 15% bagus, > 20% sangat bagus — menunjukkan efisiensi penggunaan modal. ROA (Return on Assets) = Net Profit / Total Aset — untuk bank biasanya cek ROA > 1.5%. Konsistensi ROE selama 5 tahun lebih penting dari angka satu tahun." },
      { title:"Debt to Equity Ratio (DER)", body:"DER = Total Utang / Ekuitas. DER < 1 = lebih banyak modal sendiri = lebih aman. DER 1-2 = masih bisa diterima di beberapa industri. DER > 3 = sangat berisiko, kecuali perbankan dan leasing yang memang model bisnisnya leverage tinggi." },
      { title:"Cara Hitung Valuasi Sederhana", body:"Bandingkan PER saham dengan rata-rata industri. Jika PER di bawah rata-rata tapi ROE lebih tinggi = UNDERVALUED! Contoh: BBRI PER 8x, rata-rata bank besar 12x, tapi ROE 18% → potensi undervalue = entry point bagus. Kombinasikan dengan analisis teknikal untuk timing masuk terbaik." },
    ]
  },
  s3: {
    image: null,
    lessons: [
      { title:"Kriteria Saham Multi-Bagger", body:"Multi-bagger = saham naik 2x, 5x, 10x lipat. Ciri-cirinya: Revenue tumbuh 20%+ per tahun, net profit margin meningkat, market cap masih kecil (<Rp 5T), management berpengalaman & punya saham sendiri, berada di industri growth cycle." },
      { title:"Cara Screening Saham", body:"Gunakan Stockbit Screener atau RTI: Filter → Market Cap < 5T + Revenue Growth YoY > 20% + ROE > 15% + DER < 1. Hasilnya 10-20 saham — analisis lebih lanjut satu per satu. Bandingkan dengan kompetitor di sektor yang sama untuk lihat keunggulan relatifnya." },
      { title:"Competitive Moat (Keunggulan Kompetitif)", body:"Cari perusahaan dengan 'parit pertahanan' yang susah ditembus: Brand kuat (UNVR, MYOR), Network effect (GOTO), Biaya switching tinggi (software enterprise), Regulasi melindungi (TLKM, BBCA), atau skala ekonomi (INDF, ICBP). Moat = saham tahan banting jangka panjang." },
      { title:"Low Float & Insider Ownership", body:"Float = jumlah saham beredar bebas. Float rendah + volume naik = harga bisa bergerak cepat. Insider ownership tinggi (direksi/komisaris pegang banyak saham sendiri) = manajemen percaya pada bisnisnya. Cek di laporan tahunan bagian Kepemilikan Saham." },
      { title:"Sektor dalam Growth Cycle", body:"2024-2026 di BEI yang menarik: Digital banking & fintech, Data center & cloud (DCII), EV & baterai nikel (MBAP, ADRO), Healthcare post-COVID, CPO & transisi energi. Masuk di awal siklus pertumbuhan sektor = return terbesar sebelum mainstream." },
    ]
  },
  s4: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/837ca8cd8_generated_image.png",
    lessons: [
      { title:"Position Sizing yang Benar", body:"Rumus: Modal per saham = Total Modal × % Risiko / % Stop Loss. Contoh: Modal Rp 10 juta, risiko 2% = Rp 200.000, stop loss 10% bawah entry → beli maksimal Rp 2 juta di saham itu. Konsisten dengan ukuran posisi adalah kunci long-term survival di pasar." },
      { title:"Cut Loss: Kapan & Bagaimana", body:"Cut loss bukan kalah — cut loss adalah menyelamatkan modal untuk trade berikutnya. Tentukan stop loss SEBELUM beli. Aturan umum: -7% sampai -10% dari harga beli = exit. Jangan pernah hold saham turun karena 'nanti naik' tanpa alasan fundamental yang jelas dan terukur." },
      { title:"Averaging Down yang Benar", body:"HANYA boleh dilakukan jika: (1) Fundamental perusahaan masih kuat, (2) Alasan awal beli masih valid, (3) Masih punya cash cadangan. JANGAN averaging down saham yang fundamentalnya memburuk. Averaging down saham buruk = memperbesar kerugian, bukan memperbaikinya." },
      { title:"Trading Journal & Evaluasi", body:"Catat setiap transaksi: tanggal, kode saham, alasan beli, entry, TP, SL, hasil, dan pelajaran. Review bulanan: win rate berapa? risk/reward ratio berapa? Trader yang konsisten profit SEMUA punya trading journal — ini cermin terjujur dari kualitas keputusanmu." },
      { title:"Target Return Realistis", body:"Benchmark IHSG jangka panjang ~15%/tahun. Target realistis investor aktif: 20-30%/tahun sudah sangat baik. Siapapun yang janji 100%+ per bulan hampir pasti scam. Warren Buffett rata-rata 20%/tahun dan itu dianggap luar biasa di seluruh dunia selama 50+ tahun." },
    ]
  },
  g1: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/050d585f7_generated_image.png",
    lessons: [
      { title:"Support & Resistance", body:"Support = level harga di mana banyak pembeli masuk → harga memantul ke atas. Resistance = level di mana banyak penjual masuk → harga tertolak ke bawah. Cara menentukan: tarik garis horizontal di titik harga yang sudah beberapa kali memantul. Makin sering diuji = makin kuat levelnya." },
      { title:"Trend Analysis", body:"Uptrend = Higher High (HH) + Higher Low (HL) → beli di setiap Higher Low. Downtrend = Lower High (LH) + Lower Low (LL) → jangan beli, tunggu konfirmasi reversal. Sideways = harga bergerak horizontal → beli di support, jual di resistance. Rule utama: Don't fight the trend!" },
      { title:"Pattern Reversal: Head & Shoulders", body:"Pola 3 puncak: bahu kiri, kepala (tertinggi), bahu kanan. Saat harga tembus neckline ke bawah = sinyal jual kuat! Target price = jarak kepala ke neckline, diproyeksikan ke bawah. Double Top: 2 puncak setara = bearish. Double Bottom: 2 lembah setara = bullish kuat." },
      { title:"Pattern Continuation: Flag & Pennant", body:"Bull Flag: candle naik kuat (tiang) + konsolidasi miring turun (bendera) → entry saat breakout atas. Pennant: konsolidasi segitiga simetris setelah gerakan kuat → arah breakout = konfirmasi lanjutan trend. Ascending Triangle: resistance horizontal + support naik = biasanya breakout ke atas." },
      { title:"Moving Average sebagai Support/Resistance Dinamis", body:"MA 20 = support/resistance jangka pendek. MA 50 = menengah. MA 200 = jangka panjang (di atas MA200 = bull market). Harga bouncing dari MA = entry point bagus dengan stop loss di bawah MA. Golden Cross (MA50 silang ke atas MA200) = sinyal bullish jangka panjang yang kuat." },
    ]
  },
  g2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/32f51ddfa_generated_image.png",
    lessons: [
      { title:"RSI (Relative Strength Index)", body:"Skala 0-100. RSI > 70 = overbought (potensi koreksi). RSI < 30 = oversold (potensi rebound). RSI Divergence: harga buat Higher High tapi RSI buat Lower High = bearish divergence → sinyal reversal turun sangat kuat! Ini salah satu sinyal paling reliabel di teknikal analisis." },
      { title:"MACD", body:"MACD Line = EMA 12 - EMA 26. Signal Line = EMA 9 dari MACD. Sinyal beli: MACD crossover ke atas Signal Line (terutama di area negatif). Sinyal jual: MACD crossover ke bawah Signal Line (di area positif). Histogram makin mengecil = momentum melemah, siap-siap reversal." },
      { title:"Bollinger Bands", body:"3 garis: Middle Band (SMA 20), Upper Band (+2 SD), Lower Band (-2 SD). Squeeze (pita menyempit) = volatilitas rendah, siap breakout besar — perhatikan arah breakout-nya! Harga menyentuh lower band di uptrend yang masih valid = entry peluang bagus. Upper band = area take profit." },
      { title:"Volume Analysis", body:"Harga naik + volume naik = naik kuat (valid). Harga naik + volume turun = lemah, hati-hati. Harga turun + volume naik = distribusi, waspada. Volume spike 3-5x rata-rata = ada aksi big player atau news penting. SELALU cek volume sebelum entry — volume adalah konfirmasi terpenting." },
      { title:"Kombinasi Indikator Efektif", body:"Pakai maksimal 3 indikator: (1) Trend: MA 20 + MA 50, (2) Momentum: RSI atau MACD, (3) Volatilitas: Bollinger Bands. Tunggu minimal 2 dari 3 memberikan sinyal searah sebelum entry — ini disebut konfluensi. Probabilitas sukses jauh lebih tinggi dari satu sinyal saja." },
    ]
  },
  g3: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/d1eca2064_generated_image.png",
    lessons: [
      { title:"Siapa Itu Bandar?", body:"Bandar adalah pelaku pasar bermodal besar — institusi, sekuritas besar, atau konglomerat — yang punya kemampuan menggerakkan harga saham tertentu. Di saham small-mid cap BEI, bandar sangat aktif. Pola mereka: akumulasi di harga rendah → pump → distribusi di harga tinggi." },
      { title:"Deteksi Fase Akumulasi", body:"Ciri saham diakumulasi: Volume naik tapi harga sideways (bandar serap tekanan jual), candle-candle kecil dengan ekor panjang di bawah, broker tertentu konsisten net buy, bid jauh lebih tebal dari offer di market depth. Ini adalah fase terbaik untuk ikut masuk!" },
      { title:"Deteksi Fase Distribusi", body:"Setelah harga sudah naik tinggi: Volume tidak konsisten, candle panjang tapi sering berbalik, asing mulai net sell, berita positif bermunculan justru saat bandar sedang jual ke retailer yang FOMO. Sinyal: segera profit taking atau exit sebelum dump terjadi." },
      { title:"Tape Reading & Market Depth", body:"Market depth: antrian bid (pembeli) vs offer (penjual). Bid tebal di support = bandar ada di bawah → aman. Offer tebal di resistance = banyak penjual → hati-hati breakout palsu. Tape reading = amati kecepatan dan ukuran transaksi real-time untuk deteksi big player bergerak." },
      { title:"Hindari Jebakan Pump & Dump", body:"Ciri pump & dump: Kenaikan cepat >20% dalam beberapa hari, volume ekstrem, berita terlalu positif mendadak, banyak grup WA/Telegram rekomendasikan bersamaan. Solusi: jangan chase harga yang sudah naik banyak. Masuk hanya di fase akumulasi, BUKAN saat sudah pump." },
    ]
  },
  g4: {
    image: null,
    lessons: [
      { title:"Fear & Greed", body:"Fear (takut) membuat investor jual di harga terendah. Greed (serakah) membuat investor beli di harga tertinggi. Keduanya musuh utama investor. Solusi: punya sistem trading dengan aturan entry & exit yang objektif dan terukur — sehingga emosi tidak ikut campur dalam keputusan." },
      { title:"FOMO & Panic Selling", body:"FOMO: Saham sudah naik 30%, kamu beli karena takut ketinggalan → biasanya itulah puncaknya. Panic Selling: Saham turun 10%, kamu jual panik → biasanya itulah bottomnya. Solusi: Selalu tentukan rencana sebelum masuk. Jika sudah melewati entry zone-mu, skip dan cari peluang berikutnya." },
      { title:"Trading Journal", body:"Catat setiap trade: Tanggal, Saham, Alasan beli (setup apa), Entry, TP, SL, Hasil, dan Evaluasi (apa yang benar/salah). Review setiap bulan. Trader yang konsisten profit SEMUA punya trading journal. Ini adalah cermin terjujur dari kualitas setiap keputusan tradingmu." },
      { title:"Bias Kognitif yang Merusak", body:"• Confirmation bias: cari info yang hanya mendukung keputusanmu\n• Anchoring: terpaku pada harga beli, susah cut loss\n• Sunk cost fallacy: 'sayang dijual rugi' padahal fundamental sudah rusak\n• Overconfidence: merasa ahli setelah beberapa kali profit\nSolusi: selalu cari second opinion dan respek pada stop loss." },
      { title:"Membangun Sistem Trading", body:"Sistem yang baik punya: (1) Kriteria entry yang jelas dan terukur, (2) Target profit (TP) realistis, (3) Stop loss yang ketat dan WAJIB diikuti, (4) Position sizing yang konsisten, (5) Maximum drawdown — jika portofolio turun 20%, berhenti trading 2 minggu untuk evaluasi & reset mindset." },
    ]
  },
};

const ALL_MODULES = [
  {id:"b1",level:0,pkgLabel:"Basic",icon:"📘",tag:"Pemula",title:"Dasar Investasi Saham",
   desc:"Modul pengantar lengkap dari nol: apa itu saham, cara kerja BEI, membuka rekening, lot & fraksi harga, dan cara melakukan transaksi pertamamu.",
   topics:["Definisi saham & instrumen pasar modal","Mekanisme kerja BEI & JATS","Cara buka rekening & pilih broker","Lot, fraksi harga, auto rejection","Jam perdagangan & sesi bursa","Cara beli saham pertamamu"]},
  {id:"b2",level:0,pkgLabel:"Basic",icon:"📊",tag:"Pemula",title:"Membaca Chart Saham",
   desc:"Belajar membaca grafik harga dari dasar: jenis chart, anatomy candlestick, pola candle penting, timeframe, dan tools gratis yang bisa langsung dipakai.",
   topics:["Jenis chart: line, bar, candlestick","Anatomy candle: OHLC","Bullish vs bearish candle","Pola candle: hammer, engulfing, doji","Timeframe: daily, weekly, monthly","Tools gratis: TradingView, RTI Business"]},
  {id:"b3",level:0,pkgLabel:"Basic",icon:"💰",tag:"Pemula",title:"Manajemen Modal Pemula",
   desc:"Cara mengatur modal agar tidak habis sebelum belajar: aturan 1-2%, diversifikasi, 3 layer portofolio, dan cara hitung profit/loss secara akurat.",
   topics:["Modal ideal untuk pemula","Aturan 1%-2% risk per trade","Diversifikasi portofolio sederhana","3 layer: core, growth, speculative","Jangan pakai uang darurat","Menghitung profit & loss net setelah biaya"]},
  {id:"b4",level:0,pkgLabel:"Basic",icon:"📰",tag:"Pemula",title:"Membaca Berita & Sentimen Pasar",
   desc:"Cara membaca berita ekonomi efektif, sumber terpercaya, pengaruh BI Rate & data makro, membaca keterbukaan informasi IDX, dan cara tidak panik saat koreksi.",
   topics:["Sumber berita terpercaya untuk investor","Pengaruh BI Rate terhadap saham","Dampak data inflasi & GDP","Membaca keterbukaan informasi IDX","Pengaruh sentimen global (Fed, DXY)","Cara tidak panik saat market turun"]},
  {id:"s1",level:1,pkgLabel:"Silver",icon:"🔍",tag:"Fundamental",title:"Analisis Fundamental: Laporan Keuangan",
   desc:"Cara membaca 3 laporan keuangan utama: laba rugi, neraca, arus kas. Identifikasi perusahaan sehat vs bermasalah dari angka-angka kuncinya.",
   topics:["Laporan laba rugi: revenue, EBITDA, net profit","Neraca: aset, liabilitas, ekuitas","Laporan arus kas: operating, investing, financing","Red flags perusahaan bermasalah","Download & baca laporan keuangan IDX","Perbandingan antar kuartal (QoQ, YoY)"]},
  {id:"s2",level:1,pkgLabel:"Silver",icon:"📐",tag:"Fundamental",title:"Rasio Keuangan & Valuasi Saham",
   desc:"Cara menilai saham murah atau mahal dengan PER, PBV, ROE, DER, dividend yield — lengkap dengan cara hitung valuasi sederhana yang bisa langsung dipraktikkan.",
   topics:["Price to Earnings Ratio (PER)","Price to Book Value (PBV)","Return on Equity (ROE) & ROA","Debt to Equity Ratio (DER)","Cara hitung valuasi sederhana","Perbandingan antar emiten sejenis"]},
  {id:"s3",level:1,pkgLabel:"Silver",icon:"🔭",tag:"Fundamental",title:"Screening Saham Berpotensi Bagger",
   desc:"Metode sistematis menemukan saham multi-bagger: kriteria growth + value, cara screening di Stockbit/RTI, competitive moat, low float, dan sektor growth cycle terkini.",
   topics:["Kriteria saham multi-bagger","Cara screening Stockbit & RTI","Revenue growth & margin expansion","Competitive moat emiten BEI","Low float & insider ownership","Sektor dalam growth cycle 2024-2026"]},
  {id:"s4",level:1,pkgLabel:"Silver",icon:"⚖️",tag:"Manajemen Risiko",title:"Risk & Money Management Lanjutan",
   desc:"Position sizing, cut loss yang tepat, averaging down yang benar, trading journal untuk evaluasi, dan target return realistis yang bisa dijadikan benchmark.",
   topics:["Position sizing yang benar","Cut loss: aturan dan cara eksekusi","Averaging down: kapan boleh, kapan bahaya","Trading journal untuk evaluasi","Rekap kinerja bulanan","Target return realistis per tahun"]},
  {id:"g1",level:2,pkgLabel:"Gold",icon:"📈",tag:"Teknikal",title:"Analisis Teknikal Mendalam",
   desc:"Support & resistance, trend analysis, chart pattern reversal (H&S, double top/bottom), continuation pattern (flag, pennant), dan moving average sebagai support dinamis.",
   topics:["Support & resistance: cara menentukan level","Trend: uptrend, downtrend, sideways","Pattern reversal: H&S, double top/bottom","Pattern continuation: flag, pennant, triangle","Moving Average: SMA, EMA golden cross","Entry & SL untuk setiap pattern"]},
  {id:"g2",level:2,pkgLabel:"Gold",icon:"📡",tag:"Teknikal",title:"Indikator Teknikal & Oscillator",
   desc:"RSI divergence, MACD crossover, Bollinger Bands squeeze, volume analysis, dan cara kombinasi 3 indikator efektif tanpa overanalyzing.",
   topics:["RSI: overbought, oversold, divergence","MACD: signal line & histogram","Bollinger Bands: squeeze & expansion","Volume analysis: OBV & volume spike","Konfluensi 3 indikator untuk entry","Cara hindari overanalyzing"]},
  {id:"g3",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Bandarmologi",title:"Bandarmologi & Tape Reading",
   desc:"Cara deteksi aksi bandar: fase akumulasi, fase distribusi, tape reading market depth real-time, dan cara hindari jebakan pump & dump.",
   topics:["Cara kerja bandar di BEI","Deteksi fase akumulasi via volume","Deteksi fase distribusi","Market depth & tape reading","Pola pump before dump","Cara masuk di fase akumulasi bukan pump"]},
  {id:"g4",level:2,pkgLabel:"Gold",icon:"🧠",tag:"Psikologi",title:"Psikologi & Emosi Trading",
   desc:"Cara kelola fear & greed, hindari FOMO & panic selling, bias kognitif yang merusak, trading journal, dan cara membangun sistem trading yang disiplin.",
   topics:["Fear & greed: kenali dan kelola","FOMO & panic selling: cara menghindari","Trading journal: catat, evaluasi, improve","Bias kognitif yang sering merugikan","Membangun sistem trading disiplin","Mindset long-term vs short-term trader"]},
  {id:"p1",level:3,pkgLabel:"Pro",icon:"🤖",tag:"AI Agent",title:"AI Agent Trading Assistant 24/7",
   desc:"AI Agent eksklusif Ritel Community — analisis saham, baca laporan keuangan, cek sentimen berita, rekomendasi entry/TP/SL, dan review portofolio kapan saja.",
   topics:["Tanya analisis saham kapan saja 24/7","Review fundamental emiten real-time","Interpretasi laporan keuangan otomatis","Rekomendasi entry berdasarkan teknikal","Sentiment analysis berita saham","Bantu susun watchlist personal"]},
  {id:"p2",level:3,pkgLabel:"Pro",icon:"👁️",tag:"Watchlist",title:"Watchlist & Screening Personal Pro",
   desc:"Watchlist mingguan dikurasi analis senior sesuai profil risikomu — saham dalam radar dengan alasan teknikal, fundamental, dan sentimen sektoral.",
   topics:["Watchlist mingguan dikurasi analis senior","Kriteria masuk & keluar watchlist","Saham di fase akumulasi yang perlu dipantau","Screening berdasarkan sector rotation","Update trigger: kapan waktu beli","Notifikasi perubahan signifikan saham pilihan"]},
  {id:"p3",level:3,pkgLabel:"Pro",icon:"📋",tag:"Laporan",title:"Laporan Mingguan Eksklusif Pro",
   desc:"Analisis IHSG mingguan mendalam, sektor outperform, top picks dan alasannya, rangkuman sentimen global, dan strategi portofolio jangka menengah.",
   topics:["Analisis IHSG mingguan mendalam","Sektor yang sedang outperform","Top picks minggu ini & alasannya","Rangkuman sentimen global","Kalender ekonomi & event penting","Strategi portofolio jangka menengah"]},
  {id:"pl1",level:4,pkgLabel:"Platinum",icon:"🎓",tag:"Konsultasi",title:"Konsultasi 1-on-1 dengan Analis Senior",
   desc:"Sesi tanya jawab langsung dengan analis berpengalaman: review portofoliomu, second opinion keputusan besar, diskusi saham spesifik, dan rencana investasi personal.",
   topics:["Review portofolio personal bersama analis","Second opinion keputusan investasi besar","Tanya saham spesifik: layak atau tidak?","Strategi rebalancing portofolio","Diskusi sektor & timing masuk optimal","Rencana investasi jangka panjang personal"]},
  {id:"pl2",level:4,pkgLabel:"Platinum",icon:"🤖",tag:"AI+",title:"AI Agent + Analisis Portofolio",
   desc:"AI Agent Pro dikombinasikan dengan analisis portofolio komprehensif: diversifikasi, exposure sektoral, estimasi return historis, dan simulasi skenario market.",
   topics:["Analisis portofolio komprehensif oleh AI","Cek diversifikasi & korelasi aset","Exposure sektoral & risiko konsentrasi","Saran rebalancing berbasis data historis","Estimasi return berdasarkan historis 10 tahun","Simulasi skenario market crash & bull run"]},
  {id:"e1",level:5,pkgLabel:"Elite",icon:"🏆",tag:"Mentoring",title:"Mentoring Langsung Intensif",
   desc:"Sesi mentoring intensif dengan mentor senior: coaching portofolio, pengembangan sistem trading personal, simulasi keputusan nyata, dan roadmap menuju financial freedom.",
   topics:["Sesi video call regular dengan mentor senior","Review & coaching portofolio intensif","Pengembangan sistem trading personal","Simulasi pengambilan keputusan nyata","Koreksi kesalahan pola investasi","Roadmap menuju financial freedom"]},
  {id:"e2",level:5,pkgLabel:"Elite",icon:"💼",tag:"Portofolio",title:"Portfolio Management Personal",
   desc:"Manajemen portofolio komprehensif: perencanaan alokasi, monitoring aktif bulanan, laporan performance personal, identifikasi drag, dan strategi exit terencana.",
   topics:["Perencanaan alokasi portofolio awal","Monitoring & rebalancing aktif bulanan","Laporan performance personal bulanan","Identifikasi drag performance & solusinya","Strategi exit & profit taking terencana","Target return & timeline finansial personal"]},
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


// ===== ADMIN FEED VIP =====
function AdminFeedVIP({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null;
  const tagColors: Record<string,string> = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };
  return (
    <div className="space-y-3 mb-6">
      {posts.map(p => (
        <div key={p.id} style={{ background: p.pinned ? "rgba(30,90,240,0.08)" : "rgba(255,255,255,0.03)", border: p.pinned ? "1px solid rgba(30,90,240,0.3)" : "1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", flexShrink:0 }}>RC</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>Admin RITEL COMMUNITY.ID</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E5AF0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
                {p.pinned && <span style={{ fontSize:10, color:"#f59e0b" }}>📌</span>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{new Date(p.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                {p.tag && <span style={{ fontSize:10, background:`${tagColors[p.tag]||"#6b7280"}22`, color:tagColors[p.tag]||"#9ca3af", padding:"1px 6px", borderRadius:4, fontWeight:600 }}>{p.tag}</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

export default function VipPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [premiumSignals, setPremiumSignals] = useState<any[]>([]);
  const [ihsgNews, setIhsgNews] = useState<any[]>([]);
  const [adminFeed, setAdminFeed] = useState<any[]>([]);
  const [tab, setTab] = useState("signals");
  const [expandedModul, setExpandedModul] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    if (!token) { router.push("/login"); return; }

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (!d.success) {
          localStorage.removeItem("vip_token");
          localStorage.removeItem("vip_user");
          router.push("/login?error=" + encodeURIComponent(d.message || "Token tidak valid"));
        } else {
          setUser(d.user);
          localStorage.setItem("vip_user", JSON.stringify(d.user));
          setLoading(false);
          fetch("/api/admin/signals").then(r=>r.json()).then(d=>{ if(d.signals) setSignals(d.signals); }).catch(()=>{});
          fetch("/api/admin/feed").then(r=>r.json()).then(d=>{ if(d.success) setAdminFeed(d.feed.filter((p:any)=>p.show_vip!==false).slice(0,5)); }).catch(()=>{});
          fetch("/api/news").then(r=>r.json()).then(d=>setIhsgNews((d.news||[]).slice(0,8))).catch(()=>{});
        }
      })
      .catch(() => { setLoading(false); });
  }, []);

  const logout = () => {
    localStorage.removeItem("vip_token");
    localStorage.removeItem("vip_user");
    router.push("/login");
  };
  const pkgLevel = PKG_LEVELS.indexOf(user?.package||"basic");
  const mySignals = signals.filter(s=>(s.package||[]).includes(user?.package));
  const myModules = ALL_MODULES.filter(m=>m.level<=pkgLevel);
  const lockedModules = ALL_MODULES.filter(m=>m.level>pkgLevel);
  const actionColor: any = { BUY:"bg-green-400/10 text-green-400", SELL:"bg-red-400/10 text-red-400", HOLD:"bg-yellow-400/10 text-yellow-400", ANTRI:"bg-cyan-400/10 text-cyan-400" };

  if (!user) return <div className="min-h-screen bg-[#04060f] flex items-center justify-center"><div className="galaxy-stars"/><div className="relative z-10 text-slate-500 text-sm">Memverifikasi akses...</div></div>;

  const tabs = [["signals","Sinyal"],["paket","Paket & Harga"],["premium","Sinyal Premium"],["modul","Modul"],["ai","🤖 AI Analyst"]];

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
          <AdminFeedVIP posts={adminFeed} />
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

          {/* PAKET & HARGA */}
          {/* PAKET & HARGA */}
          {tab==="paket" && (
            <div>
              <h2 className="text-white font-bold text-sm mb-2">Upgrade Paket VIP</h2>
              <p className="text-slate-500 text-xs mb-5">Pilih paket sesuai kebutuhan trading kamu</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { id:"basic", name:"VIP STARTER", price:"Rp 100.000", color:"#3b82f6", badge:"⭐", features:["Analisa Teknikal Lengkap","Fundamental Emiten","Stock Screening Harian","Sinyal Saham Harian"] },
                  { id:"pro", name:"VIP PRO", price:"Rp 300.000", color:"#8b5cf6", badge:"💜", features:["Bandarmologi Real-time","Tape Reading Intraday","Bagger Watchlist","Semua fitur Starter"] },
                  { id:"elite", name:"VIP ELITE", price:"Rp 500.000", color:"#f59e0b", badge:"🏆", popular:true, features:["Multibagger Research","Konsultasi Portofolio","AI Agent Full Akses","Semua fitur Pro"] },
                  { id:"platinum", name:"VIP PLATINUM", price:"Rp 1.000.000", color:"#e2e8f0", badge:"💎", features:["AI Agent Premium + GPT-4","Live Session 1on1","Mentoring Private Bulanan","Semua fitur Elite"] },
                ].map(p => (
                  <div key={p.id} style={{ background:"rgba(4,7,15,0.9)", border:`1px solid ${p.color}40`, borderRadius:16, padding:"20px", position:"relative", boxShadow: (p as any).popular ? `0 0 24px ${p.color}30` : "none" }}>
                    {(p as any).popular && <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:p.color, color:"#000", fontSize:9, fontWeight:900, padding:"3px 12px", borderRadius:100 }}>TERPOPULER</div>}
                    <div className="text-2xl mb-2">{p.badge}</div>
                    <div style={{ fontSize:11, color:p.color, fontWeight:800, letterSpacing:"0.1em", marginBottom:4 }}>{p.name}</div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:12 }}>{p.price}<span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>/bulan</span></div>
                    <ul className="space-y-2 mb-4">
                      {p.features.map((f:string,i:number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span style={{ color:p.color }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20saya%20mau%20upgrade%20ke%20${p.name}`} target="_blank" rel="noreferrer"
                      style={{ display:"block", padding:"10px", borderRadius:10, textAlign:"center", background:`${p.color}20`, color:p.color, fontWeight:700, fontSize:12, textDecoration:"none", border:`1px solid ${p.color}40` }}>
                      💬 Order via WA
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <a href="/paket" className="text-blue-400 text-sm font-semibold hover:underline">Lihat detail semua paket →</a>
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
                        <div className="px-4 pb-6 border-t border-white/5">
                          <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{m.desc}</p>
                          {/* Checklist topik */}
                          <div className="mb-5">
                            <p className="text-xs text-cyan-400 font-bold mb-2 uppercase tracking-wider">✦ Yang akan kamu pelajari:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {m.topics.map((t:string,i:number)=>(
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                                  <span className="text-green-400 flex-shrink-0 font-bold">✓</span>{t}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Chart image if available */}
                          {MODULE_CONTENT[m.id]?.image && (
                            <div className="mb-5">
                              <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Contoh Chart & Diagram:</p>
                              <div className="rounded-xl overflow-hidden border border-cyan-500/20">
                                <img src={MODULE_CONTENT[m.id].image} alt={m.title} className="w-full object-cover" style={{maxHeight:320}} />
                              </div>
                            </div>
                          )}
                          {/* Detail lessons */}
                          {MODULE_CONTENT[m.id]?.lessons && (
                            <div className="space-y-3">
                              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Panduan Detail:</p>
                              {MODULE_CONTENT[m.id].lessons.map((lesson:any, li:number)=>(
                                <div key={li} className="bg-white/3 border border-white/8 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-black flex items-center justify-center flex-shrink-0">{li+1}</span>
                                    <span className="text-white text-xs font-bold">{lesson.title}</span>
                                  </div>
                                  <p className="text-slate-400 text-xs leading-relaxed pl-7 whitespace-pre-line">{lesson.body}</p>
                                </div>
                              ))}
                            </div>
                          )}
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
                <span className="text-white text-3xl font-black">{pkgLevel>=2?"AI":"🔒"}</span>
              </div>
              <h2 className="text-white font-black text-xl mb-2">RC-AI Analyst</h2>
              <p className="text-slate-400 text-sm mb-2 max-w-sm leading-relaxed">AI analis saham eksklusif — analisis teknikal, fundamental, bandarmologi, dan baca screenshot chart secara real-time.</p>
              {pkgLevel>=2 ? (
                <>
                  <p className="text-green-400 text-xs mb-5">✅ Akses tersedia · Paket {user?.package}</p>
                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {["📊 Analisis teknikal","🔍 Baca chart","🎯 Entry/TP/SL","💡 Bandarmologi","📈 Screening"].map((f,i)=>(
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 text-slate-400">{f}</span>
                    ))}
                  </div>
                  <a href="/ai" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm inline-block">
                    Buka RC-AI Analyst →
                  </a>
                </>
              ) : (
                <>
                  <p className="text-slate-500 text-xs mb-4">Tersedia untuk paket <span className="text-purple-400 font-bold">Pro, Platinum, Elite</span></p>
                  <p className="text-slate-600 text-xs mb-6">Paket kamu: <span className="text-white capitalize">{user?.package}</span></p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {["📊 Analisis teknikal","🔍 Baca chart","🎯 Entry/TP/SL","💡 Bandarmologi","📈 Screening"].map((f,i)=>(
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-white/5 text-slate-600 line-through">{f}</span>
                    ))}
                  </div>
                  <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20ke%20Pro!" target="_blank" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm inline-block">
                    ⚡ Upgrade ke Pro →
                  </a>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


