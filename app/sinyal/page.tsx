"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MoreMenu from "../components/MoreMenu";

/* ── ICONS ── */
const ArrowLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const LockIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ZapIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const PinIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.4 6.5L21 9l-5.2 4.7 1.5 7.3L12 17.3l-5.3 3.7 1.5-7.3L3 9l6.6-.5z"/></svg>;
const ChevRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;

/* ── CONSTANTS ── */
const PKG_RANK: Record<string,number> = { free:0, basic:1, silver:2, gold:3, pro:4, platinum:5, elite:6, admin:99 };
const ACTION_META: Record<string,any> = {
  BUY:   { bg:"rgba(37,99,235,0.06)", border:"rgba(37,99,235,0.35)", text:"#2563EB", glow:"rgba(37,99,235,0.15)",  eq:"green"  },
  SELL:  { bg:"rgba(239,68,68,0.06)",  border:"rgba(239,68,68,0.3)",   text:"#ef4444", glow:"rgba(239,68,68,0.15)",   eq:"red"    },
  HOLD:  { bg:"rgba(245,158,11,0.06)",  border:"rgba(245,158,11,0.3)",  text:"#f59e0b", glow:"rgba(245,158,11,0.12)",  eq:"amber"  },
  WATCH: { bg:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.15)",text:"#EDEEF0", glow:"rgba(255,255,255,0.05)",  eq:""       },
  ANTRI: { bg:"rgba(37,99,235,0.06)", border:"rgba(37,99,235,0.2)",  text:"#2563EB", glow:"rgba(37,99,235,0.08)",  eq:"green"  },
};

/* ── TRADING EQ BARS ── */
function EqBars({ color="" }: { color?:string }) {
  return (
    <div className={`eq-bars ${color}`}>
      {[null,null,null,null,null,null,null,null].map((_,i)=><div key={i} className="eq-bar"/>)}
    </div>
  );
}

/* ── SPARKLINE SVG (trend indicator) ── */
function Sparkline({ up=true }: { up?:boolean }) {
  const color = up ? "#2563EB" : "#ef4444";
  const d = up
    ? "M0,18 C4,16 7,14 10,11 C13,8 15,10 18,7 C21,4 24,6 28,3"
    : "M0,4  C4,6  7,8  10,11 C13,14 15,12 18,15 C21,18 24,16 28,19";
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d={up?"M28,3 L28,22 L0,22":"M28,19 L28,22 L0,22"} fill={color} opacity="0.08"/>
    </svg>
  );
}

/* ── SIGNAL CARD (premium redesign, logic intact) ── */
function SignalCard({ s, canView, userRank }: { s:any; canView:boolean; userRank:number }) {
  const am = ACTION_META[s.action] || ACTION_META.HOLD;
  const entryNum = parseFloat(String(s.entry||"0").replace(/\./g,"").replace(",",".")) || 0;
  const tpNum    = parseFloat(String(s.tp   ||"0").replace(/\./g,"").replace(",",".")) || 0;
  const pct      = entryNum > 0 ? ((tpNum-entryNum)/entryNum*100) : 0;
  const pkgs:string[] = s.package||[];
  const minPkg = pkgs.length ? pkgs.reduce((mn,p)=>PKG_RANK[p]<PKG_RANK[mn]?p:mn, pkgs[0]) : "free";
  const isUp = s.action === "BUY" || pct >= 0;

  return (
    <div className="glass-card mark-lg no-mark mb-4" style={{ overflow:"hidden", transition:"all .3s ease" }}>
      {/* TOP ROW */}
      <div style={{ padding:"16px", display:"flex", alignItems:"flex-start", gap:12, position:"relative" }}>
        {/* Ticker badge */}
        <div style={{ width:50,height:50,borderRadius:10,background:am.bg,border:`1px solid ${am.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:am.text,flexShrink:0,flexDirection:"column",gap:2 }}>
          <span>{(s.kode||"--").slice(0,4).toUpperCase()}</span>
          <EqBars color={am.eq}/>
        </div>
        {/* Meta */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
            <span style={{ color:"#fff",fontWeight:900,fontSize:16,letterSpacing:"-.2px" }}>{s.kode}</span>
            {/* Premium action badge */}
            <span className="tag-chip">
              {s.action==="BUY"?<ZapIcon/>:s.action==="SELL"?<span style={{fontSize:9}}>▼</span>:null}
              {s.action}
            </span>
            {s.is_pinned && <span className="tag-chip" style={{ borderColor:"rgba(37,99,235,0.5)" }}><PinIcon/>Pin</span>}
          </div>
          <p style={{ color:"rgba(255,255,255,0.35)",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.saham}</p>
        </div>
        {/* Potential + sparkline */}
        <div style={{ textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
          <span style={{ color:pct>=0?"#2563EB":"#ef4444",fontWeight:900,fontSize:14 }}>{pct>=0?"+":""}{pct.toFixed(1)}%</span>
          <Sparkline up={isUp}/>
          <p style={{ color:"rgba(255,255,255,0.25)",fontSize:9 }}>potensi</p>
        </div>
      </div>

      {/* DETAILS or LOCK */}
      {canView ? (
        <>
          {/* Price levels */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"0 14px",gap:6,marginBottom:s.notes?0:12 }}>
            {[{l:"Entry",v:s.entry,c:"rgba(255,255,255,0.85)"},{l:"Stop Loss",v:s.sl,c:"#ef4444"},{l:"Target",v:s.tp,c:"#2563EB"}].map(({l,v,c})=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.035)",borderRadius:8,padding:"8px 10px",backdropFilter:"blur(8px)" }}>
                <p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px" }}>{l}</p>
                <p style={{ color:c,fontWeight:800,fontSize:14 }}>{v||"-"}</p>
              </div>
            ))}
            {s.tp2 && <div style={{ background:"rgba(37,99,235,0.04)",borderRadius:8,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3 }}>Target 2</p><p style={{ color:"#2563EB",fontWeight:800,fontSize:13 }}>{s.tp2}</p></div>}
            {s.tp3 && <div style={{ background:"rgba(37,99,235,0.04)",borderRadius:8,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3 }}>Target 3</p><p style={{ color:"#2563EB",fontWeight:800,fontSize:13 }}>{s.tp3}</p></div>}
          </div>
          {/* Risk meter */}
          <div style={{ padding:"8px 14px",marginBottom:4 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
              <span style={{ fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:".5px" }}>RISK METER</span>
              <span style={{ fontSize:9,color:pct>10?"#2563EB":pct>5?"#f59e0b":"#ef4444",fontWeight:700 }}>{pct>10?"Rendah":pct>5?"Sedang":"Tinggi"}</span>
            </div>
            <div className="risk-meter-track">
              <div className="risk-meter-fill" style={{ width:`${Math.min(Math.abs(pct)*6,100)}%`,background:pct>10?"linear-gradient(90deg,#2563EB,#2563EB)":pct>5?"linear-gradient(90deg,#f59e0b,#f59e0b)":"linear-gradient(90deg,#dc2626,#ef4444)" }}/>
            </div>
          </div>
          {s.notes && <div style={{ margin:"0 14px 12px",background:"rgba(255,255,255,0.025)",borderRadius:8,padding:"8px 10px",borderLeft:`2px solid ${am.text}` }}><p style={{ color:"rgba(255,255,255,0.5)",fontSize:11,lineHeight:1.6 }}>{s.notes}</p></div>}
        </>
      ) : (
        <div style={{ padding:"10px 14px 12px",display:"flex",alignItems:"center",gap:10,background:"rgba(245,158,11,0.03)",borderTop:"1px solid rgba(245,158,11,0.08)" }}>
          <div style={{ width:32,height:32,borderRadius:8,background:"rgba(245,158,11,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#f59e0b",flexShrink:0 }}><LockIcon/></div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700,fontSize:12,color:"#f59e0b" }}>Upgrade ke {minPkg.charAt(0).toUpperCase()+minPkg.slice(1)}</p>
            <p style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>untuk lihat detail sinyal ini</p>
          </div>
          <a href="/paket" className="btn-primary" style={{ padding:"6px 14px",fontSize:11,borderRadius:8 }}>Upgrade</a>
        </div>
      )}
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function SinyalPage() {
  const [user, setUser]       = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("Semua");

  useEffect(()=>{
    try { const u=localStorage.getItem("rc_user"); if(u) setUser(JSON.parse(u)); } catch{}
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{ if(d.signals) setSignals(d.signals); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  const userRank = PKG_RANK[user?.role||"free"] ?? 0;
  const isAdmin  = user?.role==="admin";
  const canView  = (s:any) => {
    if (isAdmin) return true;
    const pkgs:string[] = s.package||[];
    if (!pkgs.length||pkgs.includes("free")||pkgs.includes("basic")) return userRank>=0;
    const minPkg=pkgs.reduce((mn,p)=>PKG_RANK[p]<PKG_RANK[mn]?p:mn, pkgs[0]);
    return userRank>=PKG_RANK[minPkg];
  };

  const pinned   = signals.filter(s=>s.is_pinned&&!s.is_tomorrow);
  const tomorrow = signals.filter(s=>s.is_tomorrow);
  const today    = signals.filter(s=>!s.is_pinned&&!s.is_tomorrow);
  const filtered = filter==="Semua" ? today : today.filter(s=>s.action===filter);

  const FILTERS = ["Semua","BUY","SELL","HOLD","WATCH","ANTRI"];

  // Replace manual filters with MoreMenu if list has more than ~5 items (we have 6 items here, perfect fit to use MoreMenu)
  const menuItems = FILTERS.map(f => ({
    id: f,
    label: f.toUpperCase(),
    onSelect: () => setFilter(f),
    active: filter === f
  }));

  return (
    <div style={{ minHeight:"100vh",background:"#030712",color:"#EDEEF0",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {/* galaxy bg */}
      <div className="galaxy-stars"/>

      {/* HEADER */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(10,11,13,0.88)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",padding:"6px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)" }}>
            <ArrowLeft/>
          </Link>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <h1 className="headline" style={{ fontSize:16 }}>SINYAL <span className="accent">TRADING</span></h1>
              <div className="eq-bars green" style={{ height:16 }}>
                {[null,null,null,null].map((_,i)=><div key={i} className="eq-bar"/>)}
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,0.28)",fontSize:11 }}>{signals.length} sinyal aktif</p>
          </div>
        </div>
        {user ? (
          <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#047857)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#FFFFFF" }}>{(user.username||"U")[0].toUpperCase()}</div>
        ) : (
          <Link href="/login" className="btn-primary" style={{ padding:"6px 14px",fontSize:11,borderRadius:8 }}>Login</Link>
        )}
      </div>

      <div style={{ padding:"14px 16px",paddingBottom:100,position:"relative",zIndex:1 }}>
        {/* FILTER BAR WITH TITIK 3 / MORE MENU */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,padding:"8px 12px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div className="index-badge">F</div>
            <div>
              <p style={{ fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:700,textTransform:"uppercase" }}>Filter Sinyal</p>
              <p style={{ fontSize:13,fontWeight:900,color:"#2563EB" }}>{filter.toUpperCase()}</p>
            </div>
          </div>
          <MoreMenu items={menuItems} />
        </div>

        {loading ? (
          <div style={{ textAlign:"center",padding:"70px 0" }}>
            <div style={{ width:36,height:36,border:"3px solid rgba(37,99,235,0.15)",borderTopColor:"#2563EB",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px" }}/>
            <p style={{ color:"rgba(255,255,255,0.25)",fontSize:12 }}>Memuat sinyal...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* PINNED */}
            {pinned.length>0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span className="tag-chip solid">Disematkan</span>
                  <div style={{ flex:1,height:1,background:"linear-gradient(90deg,rgba(37,99,235,0.3),transparent)" }}/>
                  <div className="plus-divider" />
                </div>
                {pinned.map((s,i)=><SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
              </div>
            )}

            {/* BESOK */}
            {tomorrow.length>0 && filter==="Semua" && (
              <div className="glass-card mb-5" style={{ background:"rgba(245,158,11,0.02)",borderColor:"rgba(245,158,11,0.15)",padding:"14px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span className="tag-chip" style={{ color:"#f59e0b",borderColor:"rgba(245,158,11,0.3)" }}>Sinyal Besok</span>
                  <span className="tag-chip solid" style={{ background:"rgba(245,158,11,0.2)",color:"#f59e0b" }}>{tomorrow.length}</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                  {tomorrow.map((s,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:8 }}>
                      <div style={{ width:38,height:38,borderRadius:6,background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#f59e0b",flexShrink:0 }}>{(s.kode||"--").slice(0,4)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",gap:7,alignItems:"center" }}>
                          <span style={{ color:"#fff",fontWeight:900,fontSize:13 }}>{s.kode}</span>
                          <span className="tag-chip" style={{ color:"#f59e0b",borderColor:"rgba(245,158,11,0.3)",fontSize:9,padding:"1px 6px" }}>{s.action}</span>
                        </div>
                        {canView(s) && <span style={{ color:"rgba(255,255,255,0.28)",fontSize:10 }}>Entry: {s.entry} · TP: {s.tp}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN FEED */}
            <div>
              {filtered.length===0 ? (
                <div style={{ textAlign:"center",padding:"60px 16px" }}>
                  <p style={{ color:"rgba(255,255,255,0.3)",fontSize:14,marginBottom:16 }}>Belum ada sinyal {filter!=="Semua"?filter:"aktif"}.</p>
                  {!user && <Link href="/login" className="btn-primary">Login untuk Akses Penuh</Link>}
                </div>
              ) : filtered.map((s,i)=><SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
            </div>

            {!user && (
              <div className="glass-card" style={{ marginTop:20,background:"rgba(37,99,235,0.02)",border:"1px solid rgba(37,99,235,0.15)",padding:"20px",textAlign:"center" }}>
                <p style={{ fontWeight:800,marginBottom:6,fontSize:14 }}>Login untuk akses sinyal lengkap</p>
                <p style={{ color:"rgba(255,255,255,0.35)",fontSize:12,marginBottom:16 }}>Member VIP mendapat akses penuh sinyal premium.</p>
                <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                  <Link href="/login" className="btn-primary" style={{ padding:"8px 16px",fontSize:12,borderRadius:8 }}>Login</Link>
                  <Link href="/paket" className="btn-primary" style={{ background:"rgba(37,99,235,0.1)",border:"1px solid rgba(37,99,235,0.22)",color:"#2563EB",padding:"8px 16px",fontSize:12,borderRadius:8 }}>Lihat Paket</Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
