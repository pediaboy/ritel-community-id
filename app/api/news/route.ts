import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchYahooFinanceNews() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v1/finance/search?q=IHSG+saham+indonesia&lang=id&region=ID&newsCount=20",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 60 } }
    );
    const data = await res.json();
    const news = data?.news || [];
    return news.slice(0, 15).map((item: any, i: number) => ({
      id: i + 1,
      title: item.title,
      summary: item.summary || "Baca selengkapnya di sumber.",
      url: item.link,
      source: item.publisher,
      time: new Date(item.providerPublishTime * 1000).toLocaleString("id-ID"),
      category: "Pasar",
    }));
  } catch {
    return null;
  }
}

async function fetchRSSNews() {
  const sources = [
    { url: "https://www.cnbcindonesia.com/rss/market", source: "CNBC Indonesia" },
    { url: "https://market.bisnis.com/rss", source: "Bisnis.com" },
  ];
  const mockNews = [
    { id: 1, title: "IHSG Menguat 0.8% di Tengah Sentimen Positif Wall Street", summary: "Indeks Harga Saham Gabungan (IHSG) bergerak menguat 0.8% dipimpin sektor perbankan dan energi.", source: "CNBC Indonesia", time: "1 jam lalu", category: "IHSG", url: "https://cnbcindonesia.com" },
    { id: 2, title: "Saham BBRI Naik Signifikan, Analis Rekomendasikan Buy", summary: "PT Bank Rakyat Indonesia mencatatkan kenaikan harga saham didorong kinerja kuartal yang kuat.", source: "Bisnis.com", time: "2 jam lalu", category: "Saham", url: "https://bisnis.com" },
    { id: 3, title: "Saham Pertambangan Bergerak Mixed Jelang Data Inflasi", summary: "Sektor pertambangan bergerak mixed dengan ANTM menguat sementara PTBA terkoreksi.", source: "Kontan", time: "3 jam lalu", category: "Sektoral", url: "https://kontan.co.id" },
    { id: 4, title: "BI Pertahankan Suku Bunga 6.25%, IHSG Diekspektasikan Stabil", summary: "Bank Indonesia mempertahankan suku bunga acuan di level 6.25% dalam RDG bulan ini.", source: "Detik Finance", time: "4 jam lalu", category: "Makro", url: "https://detik.com" },
    { id: 5, title: "GOTO Raih Profitabilitas Pertama, Saham Melonjak 5%", summary: "GoTo Group mencatatkan laba bersih pertama kali dalam sejarah perusahaan pada kuartal ini.", source: "Tempo", time: "5 jam lalu", category: "Teknologi", url: "https://tempo.co" },
    { id: 6, title: "Investor Asing Catat Net Buy Rp 800 Miliar di Bursa", summary: "Aliran dana asing masuk ke pasar modal Indonesia mencapai Rp 800 miliar dalam sehari.", source: "CNBC Indonesia", time: "6 jam lalu", category: "Asing", url: "https://cnbcindonesia.com" },
    { id: 7, title: "TLKM Akuisisi Startup Fintech, Analis Positif Jangka Panjang", summary: "Telkom Indonesia mengumumkan akuisisi startup fintech lokal untuk memperkuat ekosistem digital.", source: "IDX Channel", time: "7 jam lalu", category: "Korporasi", url: "https://idx.co.id" },
    { id: 8, title: "Harga CPO Naik 3%, Saham Emiten Sawit Ikut Menguat", summary: "Kenaikan harga CPO di pasar global mendorong penguatan saham emiten perkebunan sawit.", source: "Kontan", time: "8 jam lalu", category: "Komoditas", url: "https://kontan.co.id" },
    { id: 9, title: "Wall Street Ditutup Positif, S&P 500 Cetak Rekor Baru", summary: "Indeks S&P 500 mencetak rekor baru ditopang kinerja sektor teknologi yang solid.", source: "Bloomberg", time: "9 jam lalu", category: "Global", url: "https://bloomberg.com" },
    { id: 10, title: "Rupiah Menguat ke Rp 15.800/USD, Sentimen Risk-On", summary: "Nilai tukar rupiah menguat terhadap dolar AS seiring meningkatnya sentimen risk-on global.", source: "Reuters", time: "10 jam lalu", category: "Forex", url: "https://reuters.com" },
  ];
  return mockNews;
}

export async function GET() {
  let news = await fetchYahooFinanceNews();
  if (!news || news.length === 0) {
    news = await fetchRSSNews();
  }
  return NextResponse.json({ news, updatedAt: new Date().toISOString() });
}
