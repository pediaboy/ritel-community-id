"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id:"beranda", label:"Beranda", href:"/" },
    { id:"cari", label:"Cari", href:"/cari" },
    { id:"alat", label:"Alat", href:"/alat" },
    { id:"vip", label:"VIP", href:"/vip" },
    { id:"profil", label:"Profil", href:"/profil" },
  ];
  const icons: Record<string,any> = {
    beranda:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    cari:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>,
    vip:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    profil:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5" style={{background:"rgba(4,7,15,0.97)",backdropFilter:"blur(20px)"}}>
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map(t=>(
          <Link key={t.id} href={t.href} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active===t.id?"text-blue-400":"text-gray-600 hover:text-gray-400"}`}>
            <div className={active===t.id?"drop-shadow-[0_0_6px_rgba(30,90,240,0.8)]":""}>{icons[t.id]}</div>
            <span className="text-[10px] font-medium">{t.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// Quick search categories (navigasi ke halaman VIP)
const quickNav = [
  { label: "Sinyal AI", href: "/vip", icon: "" },
  { label: "Live Alert", href: "/vip", icon: "" },
  { label: "Berita", href: "/vip", icon: "" },
  { label: "Alat", href: "/alat", icon: "" },
  { label: "Paket", href: "/paket", icon: "" },
  { label: "Komunitas", href: "/", icon: "" },
];

// Sample stocks list (bisa di-populate dari API nanti)
const sampleStocks = [
  { kode: "BBCA", nama: "Bank Central Asia Tbk", price: 9800, change: 1.2, sector: "Perbankan" },
  { kode: "BBRI", nama: "Bank Rakyat Indonesia Tbk", price: 4950, change: 0.8, sector: "Perbankan" },
  { kode: "TLKM", nama: "Telkom Indonesia Tbk", price: 3200, change: -0.5, sector: "Telekomunikasi" },
  { kode: "ASII", nama: "Astra International Tbk", price: 4550, change: 2.1, sector: "Otomotif" },
  { kode: "GOTO", nama: "GoTo Gojek Tokopedia Tbk", price: 64, change: -1.5, sector: "Teknologi" },
  { kode: "BMRI", nama: "Bank Mandiri Tbk", price: 6025, change: 1.8, sector: "Perbankan" },
  { kode: "UNVR", nama: "Unilever Indonesia Tbk", price: 2160, change: -0.9, sector: "Consumer" },
  { kode: "ICBP", nama: "Indofood CBP Sukses Makmur", price: 10900, change: 0.4, sector: "Consumer" },
  { kode: "KLBF", nama: "Kalbe Farma Tbk", price: 1565, change: 1.1, sector: "Farmasi" },
  { kode: "ANTM", nama: "Aneka Tambang Tbk", price: 1620, change: 3.5, sector: "Pertambangan" },
  { kode: "PTBA", nama: "Bukit Asam Tbk", price: 3980, change: -0.3, sector: "Batubara" },
  { kode: "INCO", nama: "Vale Indonesia Tbk", price: 3340, change: 2.8, sector: "Pertambangan" },
  { kode: "BUMI", nama: "Bumi Resources Tbk", price: 84, change: -2.1, sector: "Batubara" },
  { kode: "SMGR", nama: "Semen Indonesia Tbk", price: 5200, change: 0.6, sector: "Infrastruktur" },
  { kode: "CPIN", nama: "Charoen Pokphand Indonesia", price: 4680, change: 1.3, sector: "Consumer" },
];

export default function CariPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(sampleStocks);
  const [activeFilter, setActiveFilter] = useState("semua");

  const filters = ["semua", "naik", "turun", "perbankan", "teknologi", "consumer"];

  const search = useCallback(() => {
    let filtered = sampleStocks;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s =>
        s.kode.toLowerCase().includes(q) || s.nama.toLowerCase().includes(q)
      );
    }
    if (activeFilter === "naik") filtered = filtered.filter(s => s.change > 0);
    if (activeFilter === "turun") filtered = filtered.filter(s => s.change < 0);
    if (activeFilter === "perbankan") filtered = filtered.filter(s => s.sector === "Perbankan");
    if (activeFilter === "teknologi") filtered = filtered.filter(s => s.sector === "Teknologi");
    if (activeFilter === "consumer") filtered = filtered.filter(s => s.sector === "Consumer");
    setResults(filtered);
  }, [query, activeFilter]);

  useEffect(() => { search(); }, [search]);

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="min-h-screen pb-24" style={{ background: "#04070F", color: "white" }}>
      {/* Header + Search */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(4,7,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} autoFocus
              placeholder="Cari saham, kode emiten..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
        {/* Filter */}
        <div className="max-w-lg mx-auto px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter===f ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-3">
        {/* Quick Nav */}
        {!query && (
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2 font-medium">Navigasi Cepat</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickNav.map(n => (
                <Link key={n.label} href={n.href}
                  className="flex-shrink-0 bg-[#0A1628] border border-white/5 rounded-xl px-3 py-2 flex items-center gap-1.5 hover:border-blue-500/30 transition-colors">
                  <span className="text-sm">{n.icon}</span>
                  <span className="text-gray-300 text-xs font-medium whitespace-nowrap">{n.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs">{results.length} saham ditemukan</p>
          <p className="text-gray-600 text-[10px]">*Data simulasi</p>
        </div>

        {/* Stock List */}
        <div className="space-y-2">
          {results.map(s => (
            <div key={s.kode} className="bg-[#0A1628] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#1e2a4a,#0d1628)" }}>
                  {s.kode.slice(0,2)}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{s.kode}</p>
                  <p className="text-gray-500 text-xs truncate max-w-[160px]">{s.nama}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">Rp {fmt(s.price)}</p>
                <p className={`text-xs font-semibold ${s.change > 0 ? "text-green-400" : "text-red-400"}`}>
                  {s.change > 0 ? "+" : ""}{s.change}%
                </p>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <div className="text-4xl mb-3"></div>
              <p className="text-sm">Tidak ada saham yang cocok dengan "{query}"</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="cari" />
    </div>
  );
}
