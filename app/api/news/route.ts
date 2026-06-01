import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// IDX-specific keywords filter
const IDX_KEYWORDS = [
  "saham","ihsg","idx","bursa","emiten","tbk","pt ","dividen","ipo","right issue",
  "laporan keuangan","laba","rugi","revenue","pendapatan","bbca","bbri","tlkm",
  "asii","goto","antm","bmri","bsde","klbf","unvr","hmsp","pgas","adro","ptba",
  "indf","icbp","smgr","wika","pp ","jsmr","bumi","mncn","excl","isat","towr",
  "market","investasi","portofolio","analisis teknikal","fundamental","bullish",
  "bearish","support","resistance","volume","kapitalisasi","index","indeks",
  "net buy","net sell","foreign","asing","sektoral","perbankan","energi","tambang",
  "properti","konsumer","infrastruktur","teknologi","ojk","bei","ksei","kpei",
  "bi rate","suku bunga","inflasi","rupiah","idr","forex","komoditas","nikel","batu bara",
  "kelapa sawit","cpo","minyak","gas","emas"
];

function isIDXRelated(title: string, summary: string = ""): boolean {
  const text = (title + " " + summary).toLowerCase();
  return IDX_KEYWORDS.some(kw => text.includes(kw));
}

// Fetch from Yahoo Finance - IDX focused
async function fetchYahooIDX(): Promise<any[] | null> {
  const queries = [
    "IHSG IDX saham Indonesia",
    "bursa efek Indonesia emiten",
    "saham Indonesia BEI hari ini"
  ];
  const allNews: any[] = [];

  for (const q of queries) {
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&lang=id&region=ID&newsCount=10`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, next: { revalidate: 60 } }
      );
      const data = await res.json();
      const news = data?.news || [];
      for (const item of news) {
        if (!allNews.find(n => n.uuid === item.uuid)) {
          allNews.push(item);
        }
      }
    } catch { continue; }
  }

  if (allNews.length === 0) return null;

  const filtered = allNews.filter(item =>
    isIDXRelated(item.title || "", item.summary || "")
  );

  const result = (filtered.length > 0 ? filtered : allNews).slice(0, 12).map((item: any, i: number) => {
    const title = item.title || "";
    let category = "Pasar";
    if (/ihsg|indeks|composite/i.test(title)) category = "IHSG";
    else if (/saham|emiten|tbk/i.test(title)) category = "Saham";
    else if (/tambang|nikel|batu bara|emas|minerba/i.test(title)) category = "Tambang";
    else if (/bank|perbankan|fintech/i.test(title)) category = "Perbankan";
    else if (/rupiah|idr|forex/i.test(title)) category = "Forex";
    else if (/ipo|right issue|rights/i.test(title)) category = "Korporasi";
    else if (/dividen|dividend/i.test(title)) category = "Dividen";
    else if (/bi rate|suku bunga|inflasi|makro/i.test(title)) category = "Makro";
    else if (/cpo|sawit|komoditas|minyak/i.test(title)) category = "Komoditas";

    return {
      id: i + 1,
      uuid: item.uuid,
      title,
      summary: item.summary || "",
      url: item.link || "#",
      source: item.publisher || "Yahoo Finance",
      time: item.providerPublishTime
        ? new Date(item.providerPublishTime * 1000).toLocaleString("id-ID", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })
        : "Baru saja",
      category,
    };
  });

  return result;
}

// RSS from CNBC Indonesia market section
async function fetchCNBCRSS(): Promise<any[]> {
  try {
    const res = await fetch("https://www.cnbcindonesia.com/rss/market", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 120 }
    });
    const text = await res.text();
    const items: any[] = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    for (const item of itemMatches.slice(0, 15)) {
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1] || "";
      const link = (item.match(/<link>(.*?)<\/link>/))?.[1] || "#";
      const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1] || "";
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || "";
      
      if (!title || !isIDXRelated(title, desc)) continue;
      
      let category = "Pasar";
      if (/ihsg/i.test(title)) category = "IHSG";
      else if (/saham/i.test(title)) category = "Saham";
      else if (/rupiah/i.test(title)) category = "Forex";
      
      items.push({
        id: items.length + 1,
        title: title.trim(),
        summary: desc.replace(/<[^>]+>/g,"").trim().slice(0, 200),
        url: link.trim(),
        source: "CNBC Indonesia",
        time: pubDate ? new Date(pubDate).toLocaleString("id-ID", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "Baru saja",
        category,
      });
    }
    return items;
  } catch { return []; }
}

// Kontan RSS
async function fetchKontanRSS(): Promise<any[]> {
  try {
    const res = await fetch("https://www.kontan.co.id/rss/investasi.rss", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 120 }
    });
    const text = await res.text();
    const items: any[] = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    for (const item of itemMatches.slice(0, 10)) {
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1] || "";
      const link = (item.match(/<link>(.*?)<\/link>/))?.[1] || "#";
      const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1] || "";
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || "";
      
      if (!title || !isIDXRelated(title, desc)) continue;
      
      items.push({
        id: items.length + 100,
        title: title.trim(),
        summary: desc.replace(/<[^>]+>/g,"").trim().slice(0, 200),
        url: link.trim(),
        source: "Kontan",
        time: pubDate ? new Date(pubDate).toLocaleString("id-ID", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "Baru saja",
        category: "Investasi",
      });
    }
    return items;
  } catch { return []; }
}

// Fallback IDX-specific mock news
function getIDXMockNews() {
  return [
    { id:1, title:"IHSG Menguat Ditopang Sektor Perbankan dan Energi", summary:"Indeks Harga Saham Gabungan menguat dipimpin sektor perbankan dan energi di tengah sentimen positif data ekonomi.", source:"CNBC Indonesia", time:"1 jam lalu", category:"IHSG", url:"https://cnbcindonesia.com/market" },
    { id:2, title:"BBCA Cetak Laba Bersih Rp 14 Triliun, Analis Rekomendasi BUY", summary:"Bank Central Asia membukukan laba bersih yang melampaui ekspektasi analis, mendorong rekomendasi beli.", source:"Bisnis.com", time:"2 jam lalu", category:"Saham", url:"https://market.bisnis.com" },
    { id:3, title:"Asing Catat Net Buy Rp 1.2 Triliun di BEI, IHSG Bullish", summary:"Investor asing melakukan pembelian bersih yang signifikan di Bursa Efek Indonesia, memperkuat momentum bullish.", source:"Kontan", time:"3 jam lalu", category:"IHSG", url:"https://kontan.co.id" },
    { id:4, title:"GOTO Profitabel Pertama Kali, Saham Melonjak 5% di BEI", summary:"GoTo Group mencatat laba operasional pertama dalam sejarah perusahaan, memicu lonjakan harga saham.", source:"CNBC Indonesia", time:"4 jam lalu", category:"Saham", url:"https://cnbcindonesia.com" },
    { id:5, title:"BI Pertahankan Suku Bunga 6.25%, Saham Perbankan Menguat", summary:"Bank Indonesia mempertahankan BI Rate, memberikan kepastian bagi sektor perbankan dan pasar modal.", source:"Detik Finance", time:"5 jam lalu", category:"Makro", url:"https://finance.detik.com" },
    { id:6, title:"Saham Emiten Tambang Menguat Ikuti Harga Nikel Global", summary:"Emiten tambang nikel di BEI kompak menguat seiring kenaikan harga nikel di pasar internasional.", source:"IDX Channel", time:"6 jam lalu", category:"Tambang", url:"https://idxchannel.com" },
    { id:7, title:"ANTM Targetkan Produksi Nikel 60 Juta WMT Tahun Ini", summary:"Antam meningkatkan target produksi nikel untuk memenuhi permintaan global yang terus meningkat.", source:"Bisnis.com", time:"7 jam lalu", category:"Tambang", url:"https://bisnis.com" },
    { id:8, title:"Rupiah Menguat ke Rp 15.750, Indeks Saham IDR Positif", summary:"Penguatan rupiah terhadap dolar AS berdampak positif pada pasar saham Indonesia.", source:"Reuters", time:"8 jam lalu", category:"Forex", url:"https://reuters.com" },
    { id:9, title:"Saham CPO Menguat, AALI dan LSIP Cetak Kenaikan Signifikan", summary:"Emiten perkebunan sawit menguat didorong kenaikan harga CPO di pasar global.", source:"Kontan", time:"9 jam lalu", category:"Komoditas", url:"https://kontan.co.id" },
    { id:10, title:"OJK Dorong Lebih Banyak Emiten IPO di BEI Semester 2", summary:"Otoritas Jasa Keuangan mendorong peningkatan jumlah emiten yang melakukan penawaran umum perdana.", source:"CNBC Indonesia", time:"10 jam lalu", category:"Korporasi", url:"https://cnbcindonesia.com" },
    { id:11, title:"BMRI Bagikan Dividen Rp 640/Saham, Yield 10%", summary:"Bank Mandiri mengumumkan pembagian dividen tunai dengan yield yang menarik bagi investor.", source:"IDX Channel", time:"11 jam lalu", category:"Dividen", url:"https://idxchannel.com" },
    { id:12, title:"Sektor Properti BEI Bergairah, BSDE dan SMRA Menguat", summary:"Emiten properti di Bursa Efek Indonesia menguat seiring penurunan ekspektasi suku bunga.", source:"Bisnis.com", time:"12 jam lalu", category:"Sektoral", url:"https://bisnis.com" },
  ];
}

export async function GET() {
  // Try Yahoo Finance IDX-focused first
  let news = await fetchYahooIDX();
  
  // Try RSS sources in parallel
  if (!news || news.length < 5) {
    const [cnbc, kontan] = await Promise.all([fetchCNBCRSS(), fetchKontanRSS()]);
    const rssNews = [...cnbc, ...kontan];
    
    if (rssNews.length >= 3) {
      // Deduplicate by title similarity
      const unique: any[] = [];
      for (const item of rssNews) {
        if (!unique.find(u => u.title.slice(0,30) === item.title.slice(0,30))) {
          unique.push(item);
        }
      }
      news = unique.slice(0, 12);
    }
  }
  
  // Fallback to IDX-specific mock
  if (!news || news.length < 3) {
    news = getIDXMockNews();
  }

  return NextResponse.json({ news, source: "IDX-filtered", updatedAt: new Date().toISOString() });
}
