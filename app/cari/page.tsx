"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MoreMenu from "../components/MoreMenu";

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id:"beranda", label:"BERANDA", href:"/" },
    { id:"cari", label:"CARI", href:"/cari" },
    { id:"alat", label:"ALAT", href:"/alat" },
    { id:"vip", label:"VIP", href:"/vip" },
    { id:"profil", label:"PROFIL", href:"/profil" },
  ];
  const icons: Record<string, any> = {
    beranda: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    cari: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>,
    vip: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    profil: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };

  return (
    <nav className="dock-nav w-[90%] max-w-[440px]">
      {tabs.map(t => (
        <Link key={t.id} href={t.href} className={`dock-item flex-1 ${active === t.id ? "active" : ""}`}>
          <div className="dock-icon">{icons[t.id]}</div>
          <span className="dock-label">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}

const quickNav = [
  { label: "Sinyal AI", href: "/vip" },
  { label: "Live Alert", href: "/vip" },
  { label: "Berita Feed", href: "/info" },
  { label: "Alat Analisis", href: "/alat" },
  { label: "Paket VIP", href: "/paket" },
];

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
        s.kode.toLowerCase().includes(q) || (s.nama && s.nama.toLowerCase().includes(q))
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
    <div className="min-h-screen bg-[#030712] text-[#EDEEF0] max-w-[480px] mx-auto font-sans relative pb-24">
      <div className="galaxy-stars" />

      {/* Header + Search Input */}
      <header className="sticky top-0 z-40 bg-[#030712]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="relative mb-3">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            autoFocus
            placeholder="CARI SAHAM / KODE EMITEN..."
            className="input-dark pl-10"
          />
        </div>

        {/* Filter bar replaced with MoreMenu */}
        <div className="flex items-center justify-between py-1 px-3 glass-card no-mark">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Sektor:</span>
            <span className="tag-chip solid text-[10px] py-1">{activeFilter}</span>
          </div>
          <MoreMenu
            items={filters.map(f => ({
              id: f,
              label: f.toUpperCase(),
              onSelect: () => setActiveFilter(f),
              active: activeFilter === f
            }))}
          />
        </div>
      </header>

      <main className="p-4 relative z-10">
        {/* Editorial Title */}
        <div className="mb-4">
          <h1 className="headline text-lg font-black">
            EKSPLORASI <span className="accent">PASAR</span>
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Analisis teknikal & fundamental real-time
          </p>
        </div>

        {/* Quick Nav */}
        {!query && (
          <div className="mb-6">
            <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-2">Navigasi Cepat</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {quickNav.map(n => (
                <Link 
                  key={n.label} 
                  href={n.href}
                  className="glass-card no-mark px-4 py-2 flex items-center justify-center hover:border-emerald-500/40 transition-colors flex-shrink-0"
                >
                  <span className="text-neutral-200 text-xs font-bold uppercase tracking-wider">{n.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
            {results.length} Saham Ditemukan
          </p>
          <p className="text-neutral-600 text-[9px] uppercase font-bold tracking-wider">*Data simulasi</p>
        </div>

        {/* Stock List with glass-cards */}
        <div className="space-y-3">
          {results.map(s => (
            <div 
              key={s.kode} 
              className="glass-card p-3 flex items-center justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="index-badge">
                  {s.kode.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-black text-sm">{s.kode}</p>
                    <span className="tag-chip text-[8px] py-0.5 px-1.5">{s.sector || "Umum"}</span>
                  </div>
                  <p className="text-neutral-400 text-[10px] truncate max-w-[180px] mt-0.5">{s.nama || "Perusahaan Tbk"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">Rp {fmt(s.price)}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`text-[10px] font-bold ${s.change > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {s.change > 0 ? "+" : ""}{s.change}%
                  </span>
                  <span className="text-[10px]">
                    {s.change > 0 ? (
                      <svg className="w-3 h-3 text-emerald-500 fill-current" viewBox="0 0 24 24">
                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"/>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"/>
                      </svg>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-12 glass-card p-6">
              <p className="text-neutral-400 text-xs uppercase tracking-wider font-bold">Tidak Ada Saham Cocok</p>
              <p className="text-neutral-500 text-[10px] mt-1">Coba kata kunci atau filter lain.</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="cari" />
    </div>
  );
}
