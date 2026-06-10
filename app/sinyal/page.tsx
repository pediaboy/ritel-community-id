"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ── ICONS ── */
const ArrowLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const LockIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ZapIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const PinIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.4 6.5L21 9l-5.2 4.7 1.5 7.3L12 17.3l-5.3 3.7 1.5-7.3L3 9l6.6-.5z"/></svg>;
const ChevRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;

/* ── CONSTANTS ── */
const PKG_RANK: Record<string,number> = { free:0, basic:1, silver:2, gold:3, pro:4, platinum:5, elite:6, admin:99 };
const ACTION_META: Record<string,any> = {
  BUY:   { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.3)",  text:"#22c55e",  glow:"rgba(34,197,94,0.15)",  eq:"green"  },
  SELL:  { bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.3)",  text:"#ef4444",  glow:"rgba(239,68,68,0.15)",  eq:"red"    },
  HOLD:  { bg:"rgba(234,179,8,0.1)",  border:"rgba(234,179,8,0.3)",  text:"#eab308",  glow:"rgba(234,179,8,0.12)",  eq:"amber"  },
  WATCH: { bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.3)", text:"#60a5fa",  glow:"rgba(96,165,250,0.1)",  eq:""       },
  ANTRI: { bg:"rgba(167,139,250,0.1)",border:"rgba(167,139,250,0.3)",text:"#a78bfa",  glow:"rgba(167,139,250,0.1)", eq:"purple" },
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
  const color = up ? "#22c55e" : "#ef4444";
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
    <div className="glass-card" style={{ overflow:"hidden", marginBottom:10, transition:"all .3s ease" }}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow=`0 0 0 1px ${am.border}, 0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${am.glow}`}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow=""}}>

      {/* TOP ROW */}
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"flex-start", gap:12, position:"relative" }}>
        {/* Ticker badge */}
        <div style={{ width:50,height:50,borderRadius:14,background:am.bg,border:`1px solid ${am.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:am.text,flexShrink:0,flexDirection:"column",gap:2 }}>
          <span>{(s.kode||"--").slice(0,4).toUpperCase()}</span>
          <EqBars color={am.eq}/>
        </div>
        {/* Meta */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
            <span style={{ color:"#fff",fontWeight:900,fontSize:16,letterSpacing:"-.2px" }}>{s.kode}</span>
            {/* Premium action badge */}
            <span style={{ display:"inline-flex",alignItems:"center",gap:4,background:am.bg,color:am.text,border:`1px solid ${am.border}`,fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:8,letterSpacing:".5px",position:"relative",overflow:"hidden" }}>
              <span style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 60%)",pointerEvents:"none"}}/>
              {s.action==="BUY"?<ZapIcon/>:s.action==="SELL"?<span style={{fontSize:9}}>▼</span>:null}
              {s.action}
            </span>
            {s.is_pinned && <span style={{ display:"inline-flex",alignItems:"center",gap:3,background:"rgba(6,182,212,0.1)",color:"#06b6d4",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:6 }}><PinIcon/>Pin</span>}
          </div>
          <p style={{ color:"rgba(255,255,255,0.35)",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.saham}</p>
        </div>
        {/* Potential + sparkline */}
        <div style={{ textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
          <span style={{ color:pct>=0?"#22c55e":"#ef4444",fontWeight:900,fontSize:14 }}>{pct>=0?"+":""}{pct.toFixed(1)}%</span>
          <Sparkline up={isUp}/>
          <p style={{ color:"rgba(255,255,255,0.25)",fontSize:9 }}>potensi</p>
        </div>
      </div>

      {/* DETAILS or LOCK */}
      {canView ? (
        <>
          {/* Price levels */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"0 14px",gap:6,marginBottom:s.notes?0:12 }}>
            {[{l:"Entry",v:s.entry,c:"rgba(255,255,255,0.85)"},{l:"Stop Loss",v:s.sl,c:"#ef4444"},{l:"Target",v:s.tp,c:"#22c55e"}].map(({l,v,c})=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.035)",borderRadius:10,padding:"8px 10px",backdropFilter:"blur(8px)" }}>
                <p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px" }}>{l}</p>
                <p style={{ color:c,fontWeight:800,fontSize:14 }}>{v||"-"}</p>
              </div>
            ))}
            {s.tp2 && <div style={{ background:"rgba(34,197,94,0.04)",borderRadius:10,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3 }}>Target 2</p><p style={{ color:"#22c55e",fontWeight:800,fontSize:13 }}>{s.tp2}</p></div>}
            {s.tp3 && <div style={{ background:"rgba(34,197,94,0.04)",borderRadius:10,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:3 }}>Target 3</p><p style={{ color:"#22c55e",fontWeight:800,fontSize:13 }}>{s.tp3}</p></div>}
          </div>
          {/* Risk meter */}
          <div style={{ padding:"8px 14px",marginBottom:4 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
              <span style={{ fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:".5px" }}>RISK METER</span>
              <span style={{ fontSize:9,color:pct>10?"#22c55e":pct>5?"#eab308":"#ef4444",fontWeight:700 }}>{pct>10?"Rendah":pct>5?"Sedang":"Tinggi"}</span>
            </div>
            <div className="risk-meter-track">
              <div className="risk-meter-fill" style={{ width:`${Math.min(Math.abs(pct)*6,100)}%`,background:pct>10?"linear-gradient(90deg,#16a34a,#22c55e)":pct>5?"linear-gradient(90deg,#d97706,#eab308)":"linear-gradient(90deg,#dc2626,#ef4444)" }}/>
            </div>
          </div>
          {s.notes && <div style={{ margin:"0 14px 12px",background:"rgba(255,255,255,0.025)",borderRadius:10,padding:"8px 10px",borderLeft:`2px solid ${am.text}` }}><p style={{ color:"rgba(255,255,255,0.5)",fontSize:11,lineHeight:1.6 }}>{s.notes}</p></div>}
        </>
      ) : (
        <div style={{ padding:"10px 14px 12px",display:"flex",alignItems:"center",gap:10,background:"rgba(234,179,8,0.03)",borderTop:"1px solid rgba(234,179,8,0.08)" }}>
          <div style={{ width:32,height:32,borderRadius:8,background:"rgba(234,179,8,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#eab308",flexShrink:0 }}><LockIcon/></div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700,fontSize:12,color:"#eab308" }}>Upgrade ke {minPkg.charAt(0).toUpperCase()+minPkg.slice(1)}</p>
            <p style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>untuk lihat detail sinyal ini</p>
          </div>
          <a href="/paket" style={{ background:"linear-gradient(135deg,#d97706,#f59e0b)",color:"#000",fontWeight:800,fontSize:11,padding:"6px 14px",borderRadius:10,textDecoration:"none",flexShrink:0 }}>Upgrade</a>
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
  const FILTER_COLORS:any = {BUY:"#22c55e",SELL:"#ef4444",HOLD:"#eab308",WATCH:"#60a5fa",ANTRI:"#a78bfa"};

  return (
    <div style={{ minHeight:"100vh",background:"#030508",color:"#fff",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {/* galaxy bg */}
      <div className="galaxy-stars"/>

      {/* HEADER */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(3,5,8,0.88)",backdropFilter:"blur(28px) saturate(200%)",WebkitBackdropFilter:"blur(28px) saturate(200%)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",padding:"6px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)" }}>
            <ArrowLeft/>
          </Link>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <h1 style={{ fontWeight:900,fontSize:16,letterSpacing:"-.2px" }}>Sinyal Trading</h1>
              <div className="eq-bars green" style={{ height:16 }}>
                {[null,null,null,null].map((_,i)=><div key={i} className="eq-bar"/>)}
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,0.28)",fontSize:11 }}>{signals.length} sinyal aktif</p>
          </div>
        </div>
        {user ? (
          <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1e5af0,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff" }}>{(user.username||"U")[0].toUpperCase()}</div>
        ) : (
          <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:11,padding:"7px 16px",borderRadius:100,textDecoration:"none" }}>Login</Link>
        )}
      </div>

      <div style={{ padding:"14px 16px",paddingBottom:100,position:"relative",zIndex:1 }}>
        {/* FILTER CHIPS */}
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:2,marginBottom:16,scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
          {FILTERS.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ flexShrink:0,padding:"6px 18px",borderRadius:100,fontWeight:700,fontSize:11,border:"1px solid",cursor:"pointer",background:filter===f?(FILTER_COLORS[f]||"#1e5af0"):"transparent",color:filter===f?"#fff":"rgba(255,255,255,0.4)",borderColor:filter===f?(FILTER_COLORS[f]||"#1e5af0"):"rgba(255,255,255,0.1)",transition:"all .2s" }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center",padding:"70px 0" }}>
            <div style={{ width:36,height:36,border:"3px solid rgba(6,182,212,0.15)",borderTopColor:"#06b6d4",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px" }}/>
            <p style={{ color:"rgba(255,255,255,0.25)",fontSize:12 }}>Memuat sinyal...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* PINNED */}
            {pinned.length>0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#06b6d4",fontWeight:900,fontSize:12,letterSpacing:".5px",textTransform:"uppercase" }}>Disematkan</span>
                  <div style={{ flex:1,height:1,background:"linear-gradient(90deg,rgba(6,182,212,0.3),transparent)" }}/>
                </div>
                {pinned.map((s,i)=><SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
              </div>
            )}

            {/* BESOK */}
            {tomorrow.length>0 && filter==="Semua" && (
              <div className="glass-card" style={{ marginBottom:20,background:"rgba(234,179,8,0.04)",border:"1px solid rgba(234,179,8,0.12)",padding:"14px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#fbbf24",fontWeight:900,fontSize:12,textTransform:"uppercase",letterSpacing:".5px" }}>Sinyal Besok</span>
                  <span style={{ background:"rgba(251,191,36,0.1)",color:"rgba(251,191,36,0.7)",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100 }}>{tomorrow.length}</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                  {tomorrow.map((s,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:12 }}>
                      <div style={{ width:38,height:38,borderRadius:10,background:"rgba(234,179,8,0.07)",border:"1px solid rgba(234,179,8,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fbbf24",flexShrink:0 }}>{(s.kode||"--").slice(0,4)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",gap:7,alignItems:"center" }}>
                          <span style={{ color:"#fff",fontWeight:900,fontSize:13 }}>{s.kode}</span>
                          <span style={{ background:"rgba(234,179,8,0.12)",color:"#fbbf24",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:6 }}>{s.action}</span>
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
                  <div style={{ fontSize:40,marginBottom:12 }}>📡</div>
                  <p style={{ color:"rgba(255,255,255,0.3)",fontSize:14,marginBottom:16 }}>Belum ada sinyal {filter!=="Semua"?filter:"aktif"}.</p>
                  {!user && <Link href="/login" style={{ display:"inline-block",background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"12px 28px",borderRadius:12,textDecoration:"none" }}>Login untuk Akses Penuh</Link>}
                </div>
              ) : filtered.map((s,i)=><SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
            </div>

            {!user && (
              <div className="glass-card" style={{ marginTop:20,background:"rgba(30,90,240,0.05)",border:"1px solid rgba(30,90,240,0.15)",padding:"20px",textAlign:"center" }}>
                <p style={{ fontWeight:800,marginBottom:6,fontSize:14 }}>Login untuk akses sinyal lengkap</p>
                <p style={{ color:"rgba(255,255,255,0.35)",fontSize:12,marginBottom:16 }}>Member VIP mendapat akses penuh sinyal premium.</p>
                <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                  <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"10px 20px",borderRadius:12,textDecoration:"none" }}>Login</Link>
                  <Link href="/paket" style={{ background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.22)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"10px 20px",borderRadius:12,textDecoration:"none" }}>Lihat Paket</Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
