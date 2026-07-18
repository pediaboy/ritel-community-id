"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MoreMenu from "../components/MoreMenu";

type NewsItem = { title:string; url:string; source:string; published:string; image?:string; category?:string };

const SOURCES = [
  { name:"IDX Live",     key:"idx" },
  { name:"Market Feed",  key:"market" },
  { name:"Bisnis News",  key:"bisnis" },
  { name:"Emiten Update",key:"emiten" },
];

async function fetchNews(src: string): Promise<NewsItem[]> {
  const endpoints: Record<string,string> = {
    idx:    "/api/news?source=idx&limit=20",
    market: "/api/news?source=market&limit=20",
    bisnis: "/api/news?source=bisnis&limit=20",
    emiten: "/api/news?source=emiten&limit=20",
  };
  try {
    const r = await fetch(endpoints[src] || "/api/news?limit=20");
    const d = await r.json();
    return d.news || [];
  } catch { return []; }
}

function NewsCard({ item }: { item: NewsItem }) {
  const age = (() => {
    try {
      const d = new Date(item.published);
      const diff = Math.floor((Date.now()-d.getTime())/60000);
      if (diff<60) return diff+"m lalu";
      if (diff<1440) return Math.floor(diff/60)+"j lalu";
      return d.toLocaleDateString("id-ID",{day:"2-digit",month:"short"});
    } catch { return item.published||""; }
  })();

  return (
    <a href={item.url||"#"} target="_blank" rel="noopener noreferrer" className="block no-underline">
      <div className="glass-card p-3 mb-3 flex gap-3 items-center hover:border-emerald-500/40 transition-all">
        {item.image && (
          <div className="poster-frame w-16 h-16 flex-shrink-0 relative overflow-hidden">
            <img 
              src={item.image} 
              alt="" 
              className="w-full h-full object-cover" 
              onError={(e)=>{(e.target as any).style.display="none"}}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-xs leading-snug mb-1.5 line-clamp-2 hover:text-emerald-400 transition-colors">
            {item.title}
          </p>
          <div className="flex items-center gap-2">
            <span className="tag-chip py-0.5 px-2 text-[9px]">
              {item.source}
            </span>
            <span className="text-neutral-500 text-[10px]">·</span>
            <span className="text-neutral-400 text-[10px]">{age}</span>
          </div>
        </div>
        <svg className="w-4 h-4 text-neutral-500 hover:text-emerald-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </div>
    </a>
  );
}

export default function InfoPage() {
  const [activeSource, setActiveSource] = useState("idx");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date|null>(null);

  const load = async (src: string) => {
    setLoading(true);
    const items = await fetchNews(src);
    setNews(items);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { load(activeSource); }, [activeSource]);
  
  useEffect(() => {
    const iv = setInterval(() => load(activeSource), 5*60*1000);
    return () => clearInterval(iv);
  }, [activeSource]);

  const activeSourceName = SOURCES.find(s => s.key === activeSource)?.name || activeSource;

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEEF0] max-w-[480px] mx-auto font-sans relative">
      <div className="galaxy-stars"/>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0A0B0D]/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-neutral-400 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </Link>
            <div>
              <h1 className="headline text-base font-black">
                INFO & <span className="accent">BERITA PASAR</span>
              </h1>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                {lastUpdated ? `Diperbarui ${lastUpdated.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})} WIB` : "Memuat..."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => load(activeSource)} 
            className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            Refresh
          </button>
        </div>

        {/* Source tabs replaced by MoreMenu as a beautiful filter block */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Sumber:</span>
            <span className="tag-chip solid text-[10px] py-1">{activeSourceName}</span>
          </div>
          <MoreMenu
            items={SOURCES.map(s => ({
              id: s.key,
              label: s.name,
              onSelect: () => setActiveSource(s.key),
              active: activeSource === s.key
            }))}
          />
        </div>
      </div>

      <div className="p-4 pb-20 relative z-10">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-400 text-xs uppercase tracking-wider font-bold">Mengambil Berita...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 glass-card p-6">
            <p className="text-neutral-400 text-xs uppercase tracking-wider font-bold mb-4">Belum Ada Berita Tersedia</p>
            <button 
              onClick={() => load(activeSource)} 
              className="btn-primary text-xs py-2 px-6 font-bold uppercase tracking-wider"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {news.map((item, i) => (
              <NewsCard key={i} item={item}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
