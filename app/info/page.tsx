"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type NewsItem = { title:string; url:string; source:string; published:string; image?:string; category?:string };

const SOURCES = [
  { name:"IDX Live",     color:"#1e5af0", key:"idx" },
  { name:"Market",       color:"#22c55e", key:"market" },
  { name:"Bisnis",       color:"#f59e0b", key:"bisnis" },
  { name:"Emiten",       color:"#8b5cf6", key:"emiten" },
];

async function fetchNews(src: string): Promise<NewsItem[]> {
  // Ambil dari API news kita, dengan fallback RSS scraping
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
    <a href={item.url||"#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none",display:"block" }}>
      <div style={{ display:"flex",gap:12,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"12px 14px",marginBottom:10,alignItems:"center" }}>
        {item.image && (
          <img src={item.image} alt="" style={{ width:64,height:64,borderRadius:10,objectFit:"cover",flexShrink:0 }} onError={(e)=>{(e.target as any).style.display="none"}}/>
        )}
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ color:"#fff",fontWeight:700,fontSize:13,lineHeight:1.45,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{item.title}</p>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ color:"#60a5fa",fontSize:10,fontWeight:700 }}>{item.source}</span>
            <span style={{ color:"rgba(255,255,255,0.2)",fontSize:10 }}>·</span>
            <span style={{ color:"rgba(255,255,255,0.3)",fontSize:10 }}>{age}</span>
          </div>
        </div>
        <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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
  // Auto-refresh tiap 5 menit
  useEffect(() => {
    const iv = setInterval(() => load(activeSource), 5*60*1000);
    return () => clearInterval(iv);
  }, [activeSource]);

  return (
    <div style={{ minHeight:"100vh",background:"#04060f",color:"#fff",maxWidth:480,margin:"0 auto",fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,'Helvetica Neue',sans-serif" }}>
      <style>{`.galaxy-stars{position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(30,58,138,0.12) 0%,transparent 60%);pointer-events:none;z-index:0;}`}</style>
      <div className="galaxy-stars"/>

      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(4,6,15,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div style={{ flex:1 }}>
            <h1 style={{ fontWeight:900,fontSize:17 }}>📰 Info & Berita Pasar</h1>
            <p style={{ color:"rgba(255,255,255,0.35)",fontSize:10,marginTop:1 }}>
              {lastUpdated ? `Diperbarui ${lastUpdated.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})} WIB` : "Memuat..."}
            </p>
          </div>
          <button onClick={()=>load(activeSource)} style={{ background:"rgba(30,90,240,0.1)",border:"1px solid rgba(30,90,240,0.2)",color:"#60a5fa",padding:"6px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer" }}>↺ Refresh</button>
        </div>
        {/* Source tabs */}
        <div style={{ display:"flex",gap:0,borderTop:"1px solid rgba(255,255,255,0.06)",overflowX:"auto" }}>
          {SOURCES.map(s=>(
            <button key={s.key} onClick={()=>setActiveSource(s.key)}
              style={{ flex:1,minWidth:80,padding:"10px 8px",fontWeight:700,fontSize:11,border:"none",background:"transparent",color:activeSource===s.key?s.color:"rgba(255,255,255,0.35)",borderBottom:activeSource===s.key?`2px solid ${s.color}`:"2px solid transparent",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap" }}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px",paddingBottom:80,position:"relative",zIndex:1 }}>
        {loading ? (
          <div style={{ textAlign:"center",padding:"60px 0" }}>
            <div style={{ width:32,height:32,border:"3px solid rgba(30,90,240,0.2)",borderTopColor:"#1e5af0",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px" }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13 }}>Mengambil berita terbaru...</p>
          </div>
        ) : news.length === 0 ? (
          <div style={{ textAlign:"center",padding:"60px 16px" }}>
            <p style={{ fontSize:40,marginBottom:12 }}>📰</p>
            <p style={{ color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:8 }}>Belum ada berita tersedia.</p>
            <button onClick={()=>load(activeSource)} style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"10px 24px",borderRadius:12,border:"none",cursor:"pointer" }}>Coba Lagi</button>
          </div>
        ) : (
          <div>{news.map((item,i)=><NewsCard key={i} item={item}/>)}</div>
        )}
      </div>
    </div>
  );
}
