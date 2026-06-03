"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── MOTIVASI TICKER ──────────────────────────────────────────────
function MotivasiTickerVIP() {
  const [list, setList] = useState<string[]>([
    "Jangan takut untuk belajar — satu langkah kecil hari ini adalah investasi terbesar untuk masa depanmu.",
    "Pasar tidak menghukum yang berani belajar. Pasar menghukum yang tidak mau bersiap.",
    "Cari mentor yang tepat — pengalaman mereka bisa memotong kurva belajarmu bertahun-tahun.",
  ]);
  useEffect(() => {
    try {
      fetch("/api/admin/sync").then(r=>r.json()).then(d => {
        if (d.motivasi?.length) setList(d.motivasi.map((m: any) => m.text));
      }).catch(()=>{});
    } catch {}
  }, []);
  const doubled = [...list, ...list];
  return (
    <div style={{ background:"rgba(234,179,8,0.04)", borderBottom:"1px solid rgba(234,179,8,0.08)", padding:"7px 0", overflow:"hidden", flexShrink:0 }}>
      <div style={{ display:"flex", animation:"motivasiMove 55s linear infinite", whiteSpace:"nowrap", alignItems:"center" }}>
        {doubled.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-8 text-xs" style={{ color:"rgba(234,179,8,0.7)" }}>
            <span style={{ color:"rgba(234,179,8,0.4)" }}>✦</span>{text}
            <span style={{ color:"rgba(234,179,8,0.2)", marginLeft:16 }}>|</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes motivasiMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ── LIVE INFO BOX ───────────────────────────────────────────────
function LiveInfoBox() {
  const [info, setInfo] = useState<{message:string}|null>(null);
  useEffect(() => {
    const load = () => fetch("/api/admin/liveinfo").then(r=>r.json()).then(d=>{
      const li = d.liveInfo;
      if (li && (li.isActive||li.is_active) && li.message?.trim()) setInfo({message:li.message});
      else setInfo(null);
    }).catch(()=>{});
    load();
    const iv = setInterval(load, 30000);
    return ()=>clearInterval(iv);
  }, []);
  if (!info) return null;
  return (
    <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:18, flexShrink:0 }}>📢</span>
        <div>
          <p style={{ color:"#fbbf24", fontSize:11, fontWeight:800, marginBottom:4, letterSpacing:"0.05em" }}>INFO DARI ADMIN</p>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{info.message}</p>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN FEED ──────────────────────────────────────────────────
function AdminFeedVIP() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    const load = () => fetch("/api/admin/feed").then(r=>r.json()).then(d=>{
      if (d.success) setPosts(d.feed.filter((p:any)=>p.show_vip!==false).slice(0,5));
    }).catch(()=>{});
    load();
    const iv = setInterval(load, 30000);
    return ()=>clearInterval(iv);
  }, []);
  if (posts.length === 0) return null;
  const tagColors: Record<string,string> = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };
  return (
    <div style={{ marginBottom:20 }}>
      {posts.map(p => (
        <div key={p.id} style={{ background: p.pinned ? "rgba(30,90,240,0.08)" : "rgba(255,255,255,0.03)", border: p.pinned ? "1px solid rgba(30,90,240,0.25)" : "1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#00c8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:"#fff", flexShrink:0 }}>RC</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#fff", fontWeight:700, fontSize:12 }}>Admin RITEL COMMUNITY.ID</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#1E5AF0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
                {p.pinned && <span style={{ fontSize:9, color:"#f59e0b" }}>📌</span>}
              </div>
              <div style={{ display:"flex", gap:6, marginTop:2 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{new Date(p.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                {p.tag && <span style={{ fontSize:9, background:`${tagColors[p.tag]||"#6b7280"}20`, color:tagColors[p.tag]||"#9ca3af", padding:"1px 6px", borderRadius:4, fontWeight:700 }}>{p.tag}</span>}
              </div>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{p.content}</p>
        </div>
      ))}
    </div>
  );
}

// ── HEARTBEAT CHART ─────────────────────────────────────────────
function HeartbeatChart({ changePercent }: { changePercent: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const dataRef = useRef<number[]>([]);
  const isPositive = changePercent >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";
  const amplitude = Math.min(Math.abs(changePercent) * 3, 18) + 4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const mid = H / 2;
    let t = 0;

    // Init flat data
    if (dataRef.current.length === 0) {
      dataRef.current = Array(W).fill(mid);
    }

    const draw = () => {
      t++;
      // Heartbeat pattern: spike every 40 frames
      const cycle = t % 40;
      let newY = mid;
      if (cycle === 10) newY = mid - amplitude * 0.5;
      else if (cycle === 12) newY = mid + amplitude * 1.8;
      else if (cycle === 14) newY = mid - amplitude * (isPositive ? 2.2 : 1.0);
      else if (cycle === 16) newY = mid + amplitude * (isPositive ? 0.4 : 1.2);
      else if (cycle === 18) newY = mid + amplitude * 0.2;
      else newY = mid + (Math.random() - 0.5) * 1.2;

      dataRef.current.push(newY);
      if (dataRef.current.length > W) dataRef.current.shift();

      ctx.clearRect(0, 0, W, H);

      // Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;

      // Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      dataRef.current.forEach((y, x) => {
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Fill gradient
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, color + "20");
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      dataRef.current.forEach((y, x) => {
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [changePercent]);

  return <canvas ref={canvasRef} width={200} height={40} style={{ width:"100%", height:40, display:"block" }} />;
}

// ── TILT CARD ────────────────────────────────────────────────────
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

// ── CONSTANTS ────────────────────────────────────────────────────
const PKG_LEVELS = ["basic","silver","gold","pro","platinum","elite"];
const PKG_COLORS: any = {
  basic:"border-blue-500/40 text-blue-400",
  silver:"border-cyan-500/40 text-cyan-400",
  gold:"border-yellow-500/40 text-yellow-400",
  pro:"border-purple-500/40 text-purple-400",
  platinum:"border-slate-400/40 text-slate-300",
  elite:"border-yellow-400/60 text-yellow-300",
};
const ACTION_COLORS: any = {
  BUY:{ bg:"#22c55e22", text:"#22c55e", border:"rgba(34,197,94,0.3)" },
  SELL:{ bg:"#ef444422", text:"#ef4444", border:"rgba(239,68,68,0.3)" },
  HOLD:{ bg:"#f59e0b22", text:"#f59e0b", border:"rgba(245,158,11,0.3)" },
  ANTRI:{ bg:"#06b6d422", text:"#06b6d4", border:"rgba(6,182,212,0.3)" },
  WATCH:{ bg:"#8b5cf622", text:"#8b5cf6", border:"rgba(139,92,246,0.3)" },
};

// ── SIGNAL CARD ──────────────────────────────────────────────────
function SignalCard({ s }: { s: any }) {
  const ac = ACTION_COLORS[s.action] || ACTION_COLORS.HOLD;
  const entryNum = parseFloat(String(s.entry).replace(/\./g,"").replace(",",".")) || 0;
  const tpNum = parseFloat(String(s.tp).replace(/\./g,"").replace(",",".")) || 0;
  const pct = entryNum > 0 ? ((tpNum - entryNum) / entryNum * 100) : 0;
  const initials = (s.kode||"--").slice(0,4).toUpperCase();
  const bgColor = s.action==="BUY"?"#052d1a":s.action==="SELL"?"#2d0505":s.action==="ANTRI"?"#01151d":"#1a1a2e";

  return (
    <div style={{ background:"#0d1117", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:16, overflow:"hidden", marginBottom:0 }}>
      {/* Top row */}
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:bgColor, border:`1px solid ${ac.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:ac.text, flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:16 }}>{s.kode}</span>
            <span style={{ background:ac.bg, color:ac.text, border:`1px solid ${ac.border}`, fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:6 }}>{s.action}</span>
          </div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{s.saham}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <span style={{ color: pct>=0?"#22c55e":"#ef4444", fontWeight:800, fontSize:13 }}>{pct>=0?"+":""}{pct.toFixed(1)}%</span>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:9 }}>potential</p>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"0 16px 10px", gap:8 }}>
        {[{label:"Entry",val:s.entry,cls:"rgba(255,255,255,0.85)"},{label:"Target",val:s.tp,cls:"#22c55e"},{label:"Stop Loss",val:s.sl,cls:"#ef4444"}].map(({label,val,cls})=>(
          <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 10px" }}>
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:9, marginBottom:3 }}>{label}</p>
            <p style={{ color:cls, fontWeight:800, fontSize:14 }}>{val||"-"}</p>
          </div>
        ))}
      </div>
      {/* Heartbeat chart */}
      <div style={{ padding:"0 16px 10px" }}>
        <HeartbeatChart changePercent={pct} />
      </div>
      {s.notes && <div style={{ padding:"8px 16px 14px", borderTop:"1px solid rgba(255,255,255,0.05)" }}><p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, lineHeight:1.6 }}>{s.notes}</p></div>}
    </div>
  );
}

// ── BAGGER CARD ──────────────────────────────────────────────────
function BaggerCard({ s }: { s: any }) {
  const entryNum = parseFloat(String(s.entry||s.entryPrice||0).replace(/\./g,"").replace(",",".")) || 0;
  const tpNum = parseFloat(String(s.tp||s.target||0).replace(/\./g,"").replace(",",".")) || 0;
  const pct = entryNum > 0 ? ((tpNum - entryNum) / entryNum * 100) : 0;
  const initials = (s.kode||s.saham||"BG").slice(0,4).toUpperCase();

  return (
    <div style={{ background:"#0d1117", border:"1px solid rgba(245,158,11,0.15)", borderRadius:16, overflow:"hidden" }}>
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:"#f59e0b", flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:16 }}>{s.kode||s.saham}</span>
            <span style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.3)", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:6 }}>BAGGER</span>
          </div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{s.saham||s.name||""}</p>
        </div>
        {pct > 0 && <div style={{ textAlign:"right" }}><span style={{ color:"#22c55e", fontWeight:800, fontSize:13 }}>+{pct.toFixed(0)}%</span><p style={{ color:"rgba(255,255,255,0.3)", fontSize:9 }}>target</p></div>}
      </div>
      {(s.entry||s.entryPrice) && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"0 16px 10px", gap:8 }}>
          {[{label:"Entry",val:s.entry||s.entryPrice,cls:"rgba(255,255,255,0.85)"},{label:"Target",val:s.tp||s.target,cls:"#22c55e"}].map(({label,val,cls})=>(
            <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 10px" }}>
              <p style={{ color:"rgba(255,255,255,0.35)", fontSize:9, marginBottom:3 }}>{label}</p>
              <p style={{ color:cls, fontWeight:800, fontSize:14 }}>{val||"-"}</p>
            </div>
          ))}
        </div>
      )}
      <div style={{ padding:"0 16px 10px" }}>
        <HeartbeatChart changePercent={pct > 0 ? pct : 15} />
      </div>
      {s.notes && <div style={{ padding:"8px 16px 14px", borderTop:"1px solid rgba(255,255,255,0.05)" }}><p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, lineHeight:1.6 }}>{s.notes}</p></div>}
    </div>
  );
}

// ── MODULE CONTENT (shortened) ─────────────────────────────────
const ALL_MODULES: any[] = [
  {id:"b1",level:0,pkgLabel:"Basic",icon:"📘",tag:"Dasar",title:"Memulai Investasi Saham",
   desc:"Fondasi investasi saham dari nol: apa itu saham, cara buka rekening, lot, fraksi harga, dan transaksi pertamamu.",
   topics:["Apa itu saham & kepemilikan","Cara kerja bursa efek BEI","Membuka rekening saham","Lot & fraksi harga","Transaksi pertamamu","Reksa dana vs saham"]},
  {id:"b2",level:0,pkgLabel:"Basic",icon:"📊",tag:"Teknikal",title:"Membaca Chart Saham",
   desc:"Belajar membaca grafik harga dari dasar: jenis chart, anatomy candlestick, pola candle penting, timeframe.",
   topics:["Jenis chart: line, bar, candlestick","Anatomy candle: OHLC","Bullish vs bearish candle","Pola candle: hammer, engulfing, doji","Timeframe: daily, weekly, monthly","Tools gratis: TradingView, RTI Business"]},
  {id:"b3",level:0,pkgLabel:"Basic",icon:"🧠",tag:"Psikologi",title:"Psikologi Trading Dasar",
   desc:"Kendalikan emosi saat market fluktuatif. FOMO, panic selling, dan mindset investasi jangka panjang.",
   topics:["FOMO & Panic Selling","Mindset investor vs trader","Risk tolerance","Journaling trading","Detach dari porto harian","Long term thinking"]},
  {id:"s1",level:1,pkgLabel:"Silver",icon:"🔍",tag:"Fundamental",title:"Analisis Fundamental Saham",
   desc:"Cara membaca laporan keuangan, rasio P/E, ROE, dan menilai apakah saham murah atau mahal.",
   topics:["Laporan keuangan: laba rugi, neraca","Rasio P/E, P/B, ROE, DER","Valuasi: DCF & PER","Dividen & dividend yield","Membandingkan perusahaan sejenis","Saham blue chip vs growth"]},
  {id:"s2",level:1,pkgLabel:"Silver",icon:"📈",tag:"Teknikal",title:"Support, Resistance & Chart Pattern",
   desc:"Support & resistance, trend analysis, chart pattern reversal dan continuation, moving average.",
   topics:["Support & resistance","Trend: uptrend, downtrend, sideways","Pattern reversal: H&S, double top/bottom","Pattern continuation: flag, pennant","Moving Average: SMA, EMA","Entry & SL untuk setiap pattern"]},
  {id:"g1",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Bandarmologi",title:"Bandarmologi & Tape Reading",
   desc:"Deteksi pola bandar, baca pergerakan asing, analisis broker summary untuk timing entry terbaik.",
   topics:["Siapa itu bandar?","Fase akumulasi & distribusi","Baca broker summary","Net buy/sell asing","Volume analysis","Tape reading dasar"]},
  {id:"g2",level:2,pkgLabel:"Gold",icon:"📋",tag:"Laporan",title:"Analisis IHSG Mingguan",
   desc:"Analisis IHSG mendalam, sektor outperform, top picks dan strategi portofolio jangka menengah.",
   topics:["Analisis IHSG mingguan","Sektor outperform","Top picks & alasannya","Sentimen global","Kalender ekonomi","Strategi portofolio"]},
  {id:"p1",level:3,pkgLabel:"Pro",icon:"🤖",tag:"AI",title:"AI Agent Saham",
   desc:"Gunakan AI Agent untuk analisa teknikal, fundamental, dan bandarmologi kapan saja.",
   topics:["Cara pakai AI Agent","Prompt analisa teknikal","Prompt bandarmologi","Analisa screenshot chart","Screening dengan AI","Buat watchlist otomatis"]},
  {id:"e1",level:5,pkgLabel:"Elite",icon:"💎",tag:"Elite",title:"Mentoring 1-on-1 Private",
   desc:"Sesi mentoring langsung dengan analis senior. Portofolio review, strategi personal.",
   topics:["Portofolio review personal","Strategi entry & exit custom","Risk management advanced","Q&A langsung dengan analis","Live session eksklusif","Laporan harian personal"]},
];

// ── PAKET DATA ───────────────────────────────────────────────────
const PAKET_VIP = [
  { id:"basic", name:"VIP STARTER", price:"Rp 100.000", color:"#3b82f6", badge:"⭐", features:["Analisa Teknikal Lengkap","Fundamental Emiten","Stock Screening Harian","Sinyal Saham Harian"] },
  { id:"silver", name:"VIP SILVER", price:"Rp 250.000", color:"#06b6d4", badge:"🥈", features:["Semua fitur Starter","Bandarmologi Dasar","Screening Bagger","Risk Management"] },
  { id:"gold", name:"VIP GOLD", price:"Rp 500.000", color:"#f59e0b", badge:"🥇", popular:true, features:["Semua fitur Silver","Sinyal Premium Entry/TP/SL","Tape Reading Intraday","Bagger Watchlist"] },
  { id:"pro", name:"VIP PRO", price:"Rp 750.000", color:"#8b5cf6", badge:"💜", features:["Semua fitur Gold","AI Agent 24/7","Konsultasi Portofolio","Priority Support"] },
  { id:"platinum", name:"VIP PLATINUM", price:"Rp 900.000", color:"#e2e8f0", badge:"💎", features:["Semua fitur Pro","Live Session 1on1","Sinyal Real-time 24/7","Akses Semua Modul"] },
  { id:"elite", name:"VIP ELITE", price:"Rp 1.000.000", color:"#fde68a", badge:"🏆", features:["Semua fitur Platinum","Mentoring Private","AI Elite + GPT-4","Laporan Harian Personal"] },
];

// ── MAIN ──────────────────────────────────────────────────────────
export default function VipPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [baggerSignals, setBaggerSignals] = useState<any[]>([]);
  const [bandarSignals, setBandarSignals] = useState<any[]>([]);
  const [premiumContent, setPremiumContent] = useState<any[]>([]);
  const [ihsgNews, setIhsgNews] = useState<any[]>([]);
  const [tab, setTab] = useState("home");
  const [sigFilter, setSigFilter] = useState("Semua");
  const [expandedModul, setExpandedModul] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<any[]>([
    { name:"Thirafi Thariq Al Idris", role:"Founder & CEO", badge:"👑", tag:"Owner" },
  ]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    if (!token) { router.push("/login"); return; }
    fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({token}) })
      .then(r=>r.json())
      .then(d => {
        if (!d.success) {
          localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user");
          router.push("/login?error=" + encodeURIComponent(d.message||"Token tidak valid"));
        } else {
          setUser(d.user);
          localStorage.setItem("vip_user", JSON.stringify(d.user));
          setLoading(false);

          // Load signals
          fetch("/api/admin/sync").then(r=>r.json()).then(data => {
            if (data.signals) {
              const all = data.signals;
              setSignals(all.filter((s:any) => !s.isBagger && !s.isBandar));
              setBaggerSignals(all.filter((s:any) => s.isBagger || s.action==="BAGGER"));
              setBandarSignals(all.filter((s:any) => s.isBandar || s.action==="BANDAR"));
            }
            if (data.premiumSignals) setPremiumContent(data.premiumSignals);
            if (data.owners) setOwners(data.owners);
            if (data.partners) setPartners(data.partners);
          }).catch(()=>{});

          fetch("/api/news").then(r=>r.json()).then(d=>setIhsgNews((d.news||[]).slice(0,8))).catch(()=>{});
        }
      })
      .catch(()=>setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user");
    router.push("/login");
  };

  const pkgLevel = PKG_LEVELS.indexOf(user?.package||"basic");
  const mySignals = signals.filter(s => {
    const pkg = s.package || [];
    return pkg.includes(user?.package) || pkg.includes("all");
  });
  const filteredSignals = sigFilter==="Semua" ? mySignals : mySignals.filter(s=>s.action===sigFilter);
  const myModules = ALL_MODULES.filter(m=>m.level<=pkgLevel);
  const lockedModules = ALL_MODULES.filter(m=>m.level>pkgLevel);

  const defaultNews = [
    {title:"IHSG Menguat Ditopang Sektor Perbankan dan Energi", source:"CNBC Indonesia", url:"#"},
    {title:"BBCA Cetak Laba Bersih Rp 14 Triliun, Analis Rekomendasi BUY", source:"Bisnis.com", url:"#"},
    {title:"Asing Catat Net Buy Rp 1.2 Triliun di BEI, IHSG Bullish", source:"Kontan", url:"#"},
    {title:"GOTO Profitabel Pertama Kali, Saham Melonjak 5% di BEI", source:"CNBC Indonesia", url:"#"},
    {title:"BI Pertahankan Suku Bunga 6.25%, Saham Perbankan Menguat", source:"Detik Finance", url:"#"},
    {title:"Saham Emiten Tambang Menguat Ikuti Harga Nikel Global", source:"IDX Channel", url:"#"},
  ];
  const newsList = ihsgNews.length > 0 ? ihsgNews : defaultNews;

  if (!user) return (
    <div className="min-h-screen bg-[#04060f] flex items-center justify-center">
      <div className="galaxy-stars"/>
      <div className="relative z-10 text-center">
        <img src="/logo.png" alt="RC" style={{ width:48, height:48, borderRadius:14, objectFit:"cover", display:"block", margin:"0 auto 16px" }} />
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Memverifikasi akses...</p>
      </div>
    </div>
  );

  // ── RENDER ──────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'Inter','Helvetica Neue',sans-serif", background:"#04060f", color:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div className="galaxy-stars"/>

      {/* STICKY HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(4,6,15,0.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <MotivasiTickerVIP />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px" }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
            <img src="/logo.png" alt="RC" style={{ width:34, height:34, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:13 }}>RITEL COMMUNITY.ID</div>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:10 }}>Area VIP Member</div>
            </div>
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:"#fff" }}>
              {user.name?.charAt(0)||"V"}
            </div>
            <button onClick={logout} style={{ color:"rgba(255,255,255,0.3)", fontSize:11, background:"none", border:"none", cursor:"pointer" }}>Keluar</button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA — scrollable, padding bottom for bottom nav */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>

        {/* ── HOME TAB ── */}
        {tab==="home" && (
          <div style={{ padding:"16px" }}>
            <LiveInfoBox />
            <AdminFeedVIP />

            {/* Welcome */}
            <div style={{ marginBottom:20 }}>
              <h1 style={{ fontSize:18, fontWeight:900, marginBottom:6 }}>Selamat datang, {user.name}! 👋</h1>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, border:`1px solid`, ...Object.fromEntries(Object.entries({borderColor:(PKG_COLORS[user.package]||"border-white/20").replace("border-","").split(" ")[0], color:(PKG_COLORS[user.package]||"").split(" ").find((c:string)=>c.startsWith("text-"))?.replace("text-","") || "#fff"}).map(([k,v])=>[k,v||"#fff"])) }}>
                  Paket {user.package?.toUpperCase()}
                </span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Aktif hingga {new Date(user.expiredAt||user.expired_at||Date.now()).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
              {[{label:"Sinyal Aktif",val:mySignals.length,color:"#22c55e"},{label:"Bagger Pick",val:baggerSignals.length,color:"#f59e0b"},{label:"Bandar Signal",val:bandarSignals.length,color:"#8b5cf6"}].map(s=>(
                <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent signals preview */}
            {mySignals.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <h2 style={{ fontWeight:800, fontSize:14 }}>📡 Sinyal Terbaru</h2>
                  <button onClick={()=>setTab("sinyal")} style={{ color:"#60a5fa", fontSize:12, background:"none", border:"none", cursor:"pointer" }}>Lihat semua →</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {mySignals.slice(0,2).map((s,i) => <SignalCard key={i} s={s}/>)}
                </div>
              </div>
            )}

            {/* News preview */}
            <div>
              <h2 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>📰 Berita Pasar</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {newsList.slice(0,4).map((n:any,i:number)=>(
                  <a key={i} href={n.url||"#"} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"12px 14px", textDecoration:"none" }}>
                    <div>
                      <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, fontWeight:600, lineHeight:1.4, marginBottom:4 }}>{n.title}</p>
                      <p style={{ color:"#06b6d4", fontSize:11 }}>{n.source}</p>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.2)", flexShrink:0, marginTop:2 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SINYAL TAB ── */}
        {tab==="sinyal" && (
          <div style={{ padding:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontWeight:900, fontSize:18 }}>Sinyal Trading</h2>
              <span style={{ background:"rgba(30,90,240,0.15)", color:"#60a5fa", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:8 }}>+Tambah</span>
            </div>
            {/* Filter chips */}
            <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
              {["Semua","BUY","SELL","HOLD","WATCH","ANTRI"].map(f=>(
                <button key={f} onClick={()=>setSigFilter(f)} style={{ flexShrink:0, padding:"6px 16px", borderRadius:100, fontWeight:700, fontSize:12, border:"1px solid", cursor:"pointer", background:sigFilter===f?"#1e5af0":"transparent", color:sigFilter===f?"#fff":"rgba(255,255,255,0.5)", borderColor:sigFilter===f?"#1e5af0":"rgba(255,255,255,0.1)" }}>{f}</button>
              ))}
            </div>

            {filteredSignals.length===0 ? (
              <div style={{ textAlign:"center", padding:"48px 16px" }}>
                <p style={{ fontSize:36, marginBottom:12 }}>📡</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Belum ada sinyal {sigFilter !== "Semua" ? sigFilter : ""}.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {filteredSignals.map((s,i)=><SignalCard key={i} s={s}/>)}
              </div>
            )}
          </div>
        )}

        {/* ── BANDAR TAB ── */}
        {tab==="bandar" && (
          <div style={{ padding:"16px" }}>
            <h2 style={{ fontWeight:900, fontSize:18, marginBottom:4 }}>🔍 Bandarmologi</h2>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:16 }}>Deteksi pola bandar & pergerakan smart money</p>
            {pkgLevel < 2 ? (
              <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:16, padding:"32px 20px", textAlign:"center" }}>
                <p style={{ fontSize:32, marginBottom:12 }}>🔒</p>
                <p style={{ fontWeight:800, marginBottom:8 }}>Fitur Eksklusif VIP Gold ke atas</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:20 }}>Upgrade untuk akses analisis bandarmologi real-time</p>
                <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20mau%20upgrade%20ke%20Gold`} target="_blank" rel="noreferrer" style={{ display:"inline-block", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#000", fontWeight:900, fontSize:13, padding:"12px 28px", borderRadius:12, textDecoration:"none" }}>Upgrade Sekarang</a>
              </div>
            ) : bandarSignals.length === 0 ? (
              <div style={{ textAlign:"center", padding:"48px 16px" }}>
                <p style={{ fontSize:36, marginBottom:12 }}>🔍</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Belum ada sinyal bandar. Stay tuned!</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {bandarSignals.map((s,i)=><SignalCard key={i} s={s}/>)}
              </div>
            )}

            {/* Modul bandarmologi */}
            <div style={{ marginTop:24 }}>
              <h3 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>📚 Modul Bandarmologi</h3>
              {ALL_MODULES.filter(m=>m.tag==="Bandarmologi").map(m=>(
                <div key={m.id} onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{m.title}</p>
                      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{m.desc.slice(0,60)}...</p>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>{expandedModul===m.id?"▲":"▼"}</span>
                  </div>
                  {expandedModul===m.id && (
                    <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <ul style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        {m.topics.map((t:string,i:number)=>(
                          <li key={i} style={{ display:"flex", gap:8, fontSize:12, color:"rgba(255,255,255,0.65)" }}>
                            <span style={{ color:"#22c55e", flexShrink:0 }}>✓</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BAGGER TAB ── */}
        {tab==="bagger" && (
          <div style={{ padding:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <h2 style={{ fontWeight:900, fontSize:18 }}>🚀 Bagger Picks</h2>
              <span style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b", fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:8 }}>Paket {user.package?.toUpperCase()}</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:16 }}>Saham berpotensi naik 2x–10x lipat</p>

            {/* Role gate: Gold+ only */}
            {pkgLevel < 2 ? (
              <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:16, padding:"36px 20px", textAlign:"center", marginBottom:16 }}>
                <p style={{ fontSize:40, marginBottom:12 }}>🔒</p>
                <p style={{ fontWeight:900, fontSize:16, marginBottom:6 }}>Bagger Picks — VIP Gold ke atas</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:20, lineHeight:1.6 }}>
                  Akses daftar saham multi-bagger pilihan analis.<br/>Potensi naik 2x–10x dengan analisis mendalam.
                </p>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20saya%20${encodeURIComponent(user.name||"")}%20mau%20upgrade%20ke%20Gold`} target="_blank" rel="noreferrer"
                    style={{ display:"inline-block", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#000", fontWeight:900, fontSize:13, padding:"12px 28px", borderRadius:12, textDecoration:"none" }}>
                    Upgrade ke Gold
                  </a>
                  <button onClick={()=>setTab("sinyal")} style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.6)", fontWeight:700, fontSize:13, padding:"12px 20px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>Lihat Sinyal</button>
                </div>
                {/* Preview locked cards */}
                <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:10, filter:"blur(4px)", opacity:0.4, pointerEvents:"none" }}>
                  {[{kode:"CUAN",saham:"Petrindo Jaya Kreasi Tbk.",entry:"680",tp:"900",sl:"650",action:"BUY"},{kode:"DSSA",saham:"Dian Swastatika Sentosa Tbk.",entry:"580",tp:"800",sl:"550",action:"BUY"}].map((s,i)=>(
                    <BaggerCard key={i} s={s}/>
                  ))}
                </div>
              </div>
            ) : baggerSignals.length===0 ? (
              <div style={{ textAlign:"center", padding:"48px 16px" }}>
                <p style={{ fontSize:36, marginBottom:12 }}>🚀</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Bagger picks terbaru segera hadir! Stay tuned.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {baggerSignals.map((s,i)=><BaggerCard key={i} s={s}/>)}
              </div>
            )}

            {/* Modul bagger (untuk semua, tapi konten locked jika < gold) */}
            {pkgLevel >= 1 && (
              <div style={{ marginTop:24 }}>
                <h3 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>📚 Modul Multi-Bagger</h3>
                {ALL_MODULES.filter(m=>m.tag==="Fundamental"||m.title.toLowerCase().includes("bagger")).map(m=>(
                  <div key={m.id} onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)} style={{ background:expandedModul===m.id?"rgba(245,158,11,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${expandedModul===m.id?"rgba(245,158,11,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer", transition:"all 0.2s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>{m.icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{m.title}</p>
                        <div style={{ display:"flex", gap:6 }}>
                          <span style={{ fontSize:10, background:"rgba(245,158,11,0.12)", color:"#f59e0b", padding:"1px 7px", borderRadius:4 }}>{m.pkgLabel}</span>
                          <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{m.topics.length} topik</span>
                        </div>
                      </div>
                      <span style={{ color:"rgba(255,255,255,0.3)", fontSize:14, flexShrink:0 }}>{expandedModul===m.id?"▲":"▼"}</span>
                    </div>
                    {expandedModul===m.id && (
                      <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.6, marginBottom:10 }}>{m.desc}</p>
                        <ul style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          {m.topics.map((t:string,i:number)=>(
                            <li key={i} style={{ display:"flex", gap:8, fontSize:12, color:"rgba(255,255,255,0.65)" }}>
                              <span style={{ color:"#22c55e", flexShrink:0 }}>✓</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MODUL TAB ── */}
        {tab==="modul" && (
          <div style={{ padding:"16px" }}>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontWeight:900, fontSize:18, marginBottom:4 }}>📚 Modul Edukasi</h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>Materi eksklusif sesuai paket kamu</p>
            </div>

            {/* Unlocked Modules */}
            {myModules.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }}/>
                  <span style={{ color:"#22c55e", fontWeight:700, fontSize:12 }}>Modul Aktif ({myModules.length})</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {myModules.map(m=>(
                    <div key={m.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
                      {/* Header - always visible, click to expand */}
                      <button onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(30,90,240,0.12)", border:"1px solid rgba(30,90,240,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{m.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                            <span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>{m.title}</span>
                          </div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            <span style={{ fontSize:10, background:`${m.tag==="Fundamental"?"rgba(59,130,246,0.15)":m.tag==="Teknikal"?"rgba(139,92,246,0.15)":m.tag==="Psikologi"?"rgba(236,72,153,0.15)":m.tag==="Bandarmologi"?"rgba(245,158,11,0.15)":"rgba(34,197,94,0.15)"}`, color:`${m.tag==="Fundamental"?"#60a5fa":m.tag==="Teknikal"?"#a78bfa":m.tag==="Psikologi"?"#f472b6":m.tag==="Bandarmologi"?"#fbbf24":"#4ade80"}`, padding:"2px 8px", borderRadius:4, fontWeight:700 }}>{m.tag}</span>
                            <span style={{ fontSize:10, background:"rgba(30,90,240,0.1)", color:"#60a5fa", padding:"2px 8px", borderRadius:4, fontWeight:600 }}>{m.pkgLabel}</span>
                            <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{m.topics.length} topik</span>
                          </div>
                        </div>
                        <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                          <div style={{ width:28, height:28, borderRadius:8, background: expandedModul===m.id ? "rgba(30,90,240,0.3)" : "rgba(255,255,255,0.05)", border: expandedModul===m.id ? "1px solid rgba(30,90,240,0.4)" : "1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color: expandedModul===m.id ? "#60a5fa" : "rgba(255,255,255,0.4)", fontSize:14, transition:"all 0.2s" }}>
                            {expandedModul===m.id ? "▲" : "▼"}
                          </div>
                        </div>
                      </button>
                      {/* Expanded content */}
                      {expandedModul===m.id && (
                        <div style={{ padding:"0 16px 16px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.7, marginBottom:12, marginTop:12 }}>{m.desc}</p>
                          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                            {m.topics.map((t:string,i:number)=>(
                              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.1)", borderRadius:10, padding:"10px 12px" }}>
                                <span style={{ color:"#22c55e", flexShrink:0, marginTop:1, fontWeight:900 }}>✓</span>
                                <span style={{ color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.5 }}>{t}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(30,90,240,0.06)", border:"1px solid rgba(30,90,240,0.15)", borderRadius:10 }}>
                            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>📖 Materi tersedia di grup WhatsApp eksklusif paket {m.pkgLabel} kamu</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Modules */}
            {lockedModules.length > 0 && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,0.2)" }}/>
                  <span style={{ color:"rgba(255,255,255,0.3)", fontWeight:700, fontSize:12 }}>Terkunci ({lockedModules.length})</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {lockedModules.map(m=>(
                    <div key={m.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, overflow:"hidden", opacity:0.6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, filter:"grayscale(1)" }}>{m.icon}</div>
                        <div style={{ flex:1 }}>
                          <span style={{ color:"rgba(255,255,255,0.5)", fontWeight:700, fontSize:13 }}>{m.title}</span>
                          <div style={{ display:"flex", gap:6, marginTop:4 }}>
                            <span style={{ fontSize:10, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.3)", padding:"2px 8px", borderRadius:4, fontWeight:600 }}>{m.pkgLabel}</span>
                            <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>{m.topics.length} topik</span>
                          </div>
                        </div>
                        <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🔒</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, textAlign:"center" }}>
                  <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20saya%20${encodeURIComponent(user.name||"")}%20mau%20upgrade%20paket`} target="_blank" rel="noreferrer"
                    style={{ display:"inline-block", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", color:"#fff", fontWeight:800, fontSize:13, padding:"12px 28px", borderRadius:12, textDecoration:"none" }}>
                    Upgrade untuk Akses Semua Modul
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

                {/* ── PROFILE TAB ── */}
        {tab==="profile" && (
          <div style={{ padding:"16px" }}>
            {/* User card */}
            <div style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.12),rgba(0,200,255,0.06))", border:"1px solid rgba(30,90,240,0.25)", borderRadius:20, padding:"24px 20px", marginBottom:20, textAlign:"center" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:24, color:"#fff", margin:"0 auto 12px" }}>
                {user.name?.charAt(0)||"V"}
              </div>
              <h2 style={{ fontWeight:900, fontSize:18, marginBottom:4 }}>{user.name}</h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:12 }}>{user.email||""}</p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(30,90,240,0.15)", border:"1px solid rgba(30,90,240,0.3)", borderRadius:100, padding:"5px 14px" }}>
                <span style={{ color:"#60a5fa", fontWeight:800, fontSize:12 }}>Paket {user.package?.toUpperCase()}</span>
              </div>
              <p style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:10 }}>Aktif hingga {new Date(user.expiredAt||user.expired_at||Date.now()).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
            </div>

            {/* Owner & Partner section */}
            <div style={{ marginBottom:20 }}>
              <h3 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>👑 Owner & Partner</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {owners.map((o,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(30,90,240,0.06)", border:"1px solid rgba(30,90,240,0.2)", borderRadius:14, padding:"14px 16px" }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#1e5af0,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{o.badge||"👤"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontWeight:800, fontSize:14 }}>{o.name}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E5AF0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
                      </div>
                      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{o.role}</p>
                    </div>
                    <span style={{ background:"rgba(30,90,240,0.15)", color:"#60a5fa", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>{o.tag}</span>
                  </div>
                ))}
                {partners.map((p,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:14, padding:"14px 16px" }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#8b5cf6,#6d28d9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{p.badge||"🤝"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontWeight:800, fontSize:14 }}>{p.name}</span>
                      </div>
                      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{p.role}</p>
                    </div>
                    <span style={{ background:"rgba(139,92,246,0.15)", color:"#a78bfa", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>Partner</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Paket upgrade */}
            <div style={{ marginBottom:20 }}>
              <h3 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>💎 Paket VIP</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {PAKET_VIP.map(p=>(
                  <div key={p.id} style={{ background: p.id===user.package ? `${p.color}10` : "rgba(255,255,255,0.02)", border:`1px solid ${p.id===user.package ? p.color+"40" : "rgba(255,255,255,0.06)"}`, borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:20 }}>{p.badge}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:800, fontSize:13, color: p.id===user.package ? p.color : "#fff" }}>{p.name}</p>
                      <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>{p.price}/bulan</p>
                    </div>
                    {p.id===user.package ? (
                      <span style={{ background:`${p.color}20`, color:p.color, fontSize:10, fontWeight:800, padding:"4px 10px", borderRadius:8 }}>Aktif ✓</span>
                    ) : (
                      <a href={`https://wa.me/6282218723401?text=Halo%20admin%2C%20mau%20upgrade%20ke%20${p.name}`} target="_blank" rel="noreferrer" style={{ background:p.color, color:"#000", fontSize:10, fontWeight:800, padding:"5px 12px", borderRadius:8, textDecoration:"none" }}>Upgrade</a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button onClick={logout} style={{ width:"100%", padding:"14px", borderRadius:14, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontWeight:700, fontSize:14, cursor:"pointer" }}>Keluar dari Akun</button>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(4,6,15,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"6px 0 20px", display:"flex", alignItems:"center", justifyContent:"space-around", overflowX:"auto" }}>
        {[
          { id:"home", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label:"Beranda" },
          { id:"sinyal", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label:"Sinyal" },
          { id:"bandar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, label:"Bandar" },
          { id:"bagger", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, label:"Bagger" },
          { id:"modul", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label:"Modul" },
          { id:"profile", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:"Profil" },
        ].map(item => (
          <button key={item.id} onClick={()=>setTab(item.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 12px", position:"relative" }}>
            {tab===item.id && <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", width:32, height:3, background:"#1e5af0", borderRadius:3 }}/>}
            <span style={{ color: tab===item.id ? "#1e5af0" : "rgba(255,255,255,0.35)", transition:"color 0.2s" }}>{item.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, color: tab===item.id ? "#1e5af0" : "rgba(255,255,255,0.3)", transition:"color 0.2s" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
