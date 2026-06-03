"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PKG_RANK: Record<string,number> = { free:0, basic:1, silver:2, gold:3, pro:4, platinum:5, elite:6, admin:99 };
const ACTION_COLORS: Record<string,any> = {
  BUY:   { bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.35)",  text:"#22c55e" },
  SELL:  { bg:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.35)",  text:"#ef4444" },
  HOLD:  { bg:"rgba(234,179,8,0.12)",  border:"rgba(234,179,8,0.35)",  text:"#eab308" },
  WATCH: { bg:"rgba(96,165,250,0.12)", border:"rgba(96,165,250,0.35)", text:"#60a5fa" },
  ANTRI: { bg:"rgba(167,139,250,0.12)",border:"rgba(167,139,250,0.35)",text:"#a78bfa" },
};

function SignalCard({ s, canView, userRank }: { s:any; canView:boolean; userRank:number }) {
  const ac = ACTION_COLORS[s.action] || ACTION_COLORS.HOLD;
  const entryNum = parseFloat(String(s.entry||"0").replace(/\./g,"").replace(",",".")) || 0;
  const tpNum   = parseFloat(String(s.tp||"0").replace(/\./g,"").replace(",",".")) || 0;
  const pct     = entryNum > 0 ? ((tpNum - entryNum) / entryNum * 100) : 0;
  const pkgs: string[] = s.package || [];
  const minPkg  = pkgs.length ? pkgs.reduce((mn,p) => PKG_RANK[p]<PKG_RANK[mn]?p:mn, pkgs[0]) : "free";

  return (
    <div style={{ background:"#0d1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden" }}>
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
        {s.is_pinned && (
          <div style={{ position:"absolute", top:10, right:14, fontSize:12, color:"#06b6d4" }}>📌</div>
        )}
        <div style={{ width:48,height:48,borderRadius:12,background:ac.bg,border:`1px solid ${ac.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:ac.text,flexShrink:0 }}>
          {(s.kode||"--").slice(0,4).toUpperCase()}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
            <span style={{ color:"#fff",fontWeight:900,fontSize:16 }}>{s.kode}</span>
            <span style={{ background:ac.bg,color:ac.text,border:`1px solid ${ac.border}`,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:6 }}>{s.action}</span>
            {s.is_pinned && <span style={{ background:"rgba(6,182,212,0.12)",color:"#06b6d4",fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:5 }}>📌 Disematkan</span>}
          </div>
          <p style={{ color:"rgba(255,255,255,0.4)",fontSize:11 }}>{s.saham}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <span style={{ color:pct>=0?"#22c55e":"#ef4444",fontWeight:800,fontSize:13 }}>{pct>=0?"+":""}{pct.toFixed(1)}%</span>
          <p style={{ color:"rgba(255,255,255,0.3)",fontSize:9 }}>potensi</p>
        </div>
      </div>
      {canView ? (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"0 16px 12px",gap:8 }}>
          {[{l:"Entry",v:s.entry,c:"rgba(255,255,255,0.85)"},{l:"Stop Loss",v:s.sl,c:"#ef4444"},{l:"Target",v:s.tp,c:"#22c55e"}].map(({l,v,c})=>(
            <div key={l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 10px" }}>
              <p style={{ color:"rgba(255,255,255,0.35)",fontSize:9,marginBottom:3 }}>{l}</p>
              <p style={{ color:c,fontWeight:800,fontSize:14 }}>{v||"-"}</p>
            </div>
          ))}
          {s.tp2 && <div style={{ background:"rgba(34,197,94,0.05)",borderRadius:10,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.35)",fontSize:9,marginBottom:3 }}>Target 2</p><p style={{ color:"#22c55e",fontWeight:800,fontSize:14 }}>{s.tp2}</p></div>}
          {s.tp3 && <div style={{ background:"rgba(34,197,94,0.05)",borderRadius:10,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.35)",fontSize:9,marginBottom:3 }}>Target 3</p><p style={{ color:"#22c55e",fontWeight:800,fontSize:14 }}>{s.tp3}</p></div>}
          {s.notes && <div style={{ gridColumn:"1/-1",background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"8px 10px" }}><p style={{ color:"rgba(255,255,255,0.5)",fontSize:11,lineHeight:1.6 }}>💬 {s.notes}</p></div>}
        </div>
      ) : (
        <div style={{ padding:"12px 16px", display:"flex",alignItems:"center",gap:12,background:"rgba(234,179,8,0.04)",borderTop:"1px solid rgba(234,179,8,0.1)" }}>
          <span style={{ fontSize:18 }}>🔒</span>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700,fontSize:12,color:"#eab308" }}>Upgrade ke {minPkg.charAt(0).toUpperCase()+minPkg.slice(1)}</p>
            <p style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>untuk lihat detail sinyal ini</p>
          </div>
          <a href="/paket" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#000",fontWeight:800,fontSize:11,padding:"6px 14px",borderRadius:10,textDecoration:"none" }}>Upgrade</a>
        </div>
      )}
    </div>
  );
}

export default function SinyalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    try { const u = localStorage.getItem("rc_user"); if (u) setUser(JSON.parse(u)); } catch {}
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{ if(d.signals) setSignals(d.signals); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const userRank = PKG_RANK[user?.role||"free"] ?? 0;
  const isAdmin  = user?.role === "admin";

  const canView = (s: any) => {
    if (isAdmin) return true;
    const pkgs: string[] = s.package || [];
    if (!pkgs.length || pkgs.includes("free") || pkgs.includes("basic")) return userRank >= 0;
    const minPkg = pkgs.reduce((mn,p) => PKG_RANK[p]<PKG_RANK[mn]?p:mn, pkgs[0]);
    return userRank >= PKG_RANK[minPkg];
  };

  const pinned   = signals.filter(s => s.is_pinned && !s.is_tomorrow);
  const tomorrow = signals.filter(s => s.is_tomorrow);
  const today    = signals.filter(s => !s.is_pinned && !s.is_tomorrow);
  const filtered = filter === "Semua" ? today : today.filter(s => s.action === filter);

  return (
    <div style={{ minHeight:"100vh", background:"#04060f", color:"#fff", maxWidth:480, margin:"0 auto", fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,'Helvetica Neue',sans-serif" }}>
      <style>{`.galaxy-stars{position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(30,58,138,0.12) 0%,transparent 60%);pointer-events:none;z-index:0;}`}</style>
      <div className="galaxy-stars"/>
      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(4,6,15,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div>
            <h1 style={{ fontWeight:900,fontSize:17 }}>📡 Sinyal Trading</h1>
            <p style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>{signals.length} sinyal aktif</p>
          </div>
        </div>
        {user ? (
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1e5af0,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff" }}>{(user.username||"U")[0].toUpperCase()}</div>
          </div>
        ) : (
          <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:11,padding:"7px 16px",borderRadius:100,textDecoration:"none" }}>Login</Link>
        )}
      </div>

      <div style={{ padding:"16px",paddingBottom:80,position:"relative",zIndex:1 }}>
        {/* Filter chips */}
        <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:16,scrollbarWidth:"none" }}>
          {["Semua","BUY","SELL","HOLD","WATCH","ANTRI"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ flexShrink:0,padding:"6px 16px",borderRadius:100,fontWeight:700,fontSize:12,border:"1px solid",cursor:"pointer",background:filter===f?"#1e5af0":"transparent",color:filter===f?"#fff":"rgba(255,255,255,0.5)",borderColor:filter===f?"#1e5af0":"rgba(255,255,255,0.12)" }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center",padding:"60px 0" }}>
            <div style={{ width:32,height:32,border:"3px solid rgba(30,90,240,0.2)",borderTopColor:"#1e5af0",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto" }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* PINNED */}
            {pinned.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#06b6d4",fontWeight:900,fontSize:13 }}>📌 Sinyal Disematkan</span>
                  <span style={{ flex:1,height:1,background:"rgba(6,182,212,0.2)" }}/>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {pinned.map((s,i) => <SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
                </div>
              </div>
            )}

            {/* BESOK */}
            {tomorrow.length > 0 && filter === "Semua" && (
              <div style={{ background:"rgba(234,179,8,0.04)",border:"1px solid rgba(234,179,8,0.15)",borderRadius:16,padding:"14px",marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#fbbf24",fontWeight:900,fontSize:13 }}>🌙 Sinyal Besok</span>
                  <span style={{ color:"rgba(251,191,36,0.4)",fontSize:11 }}>{tomorrow.length} sinyal</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {tomorrow.map((s,i) => (
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:10 }}>
                      <div style={{ width:36,height:36,borderRadius:8,background:"rgba(234,179,8,0.08)",border:"1px solid rgba(234,179,8,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fbbf24",flexShrink:0 }}>{(s.kode||"--").slice(0,4)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                          <span style={{ color:"#fff",fontWeight:900,fontSize:14 }}>{s.kode}</span>
                          <span style={{ background:"rgba(234,179,8,0.15)",color:"#fbbf24",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6 }}>{s.action}</span>
                        </div>
                        {canView(s) && <span style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>Entry: {s.entry} · TP: {s.tp}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN LIST */}
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center",padding:"60px 16px" }}>
                  <p style={{ fontSize:40,marginBottom:12 }}>📡</p>
                  <p style={{ color:"rgba(255,255,255,0.4)",fontSize:14 }}>Belum ada sinyal {filter!=="Semua"?filter:"aktif"}.</p>
                  {!user && <Link href="/login" style={{ display:"inline-block",marginTop:16,background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"12px 28px",borderRadius:12,textDecoration:"none" }}>Login untuk Akses Penuh</Link>}
                </div>
              ) : filtered.map((s,i) => <SignalCard key={i} s={s} canView={canView(s)} userRank={userRank}/>)}
            </div>

            {!user && (
              <div style={{ marginTop:24,background:"rgba(30,90,240,0.06)",border:"1px solid rgba(30,90,240,0.2)",borderRadius:16,padding:"20px",textAlign:"center" }}>
                <p style={{ fontWeight:800,marginBottom:6 }}>🔐 Login untuk akses sinyal lengkap</p>
                <p style={{ color:"rgba(255,255,255,0.4)",fontSize:12,marginBottom:16 }}>Member VIP mendapat akses penuh sinyal premium.</p>
                <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                  <Link href="/login" style={{ background:"linear-gradient(135deg,#1e5af0,#0ea5e9)",color:"#fff",fontWeight:800,fontSize:13,padding:"10px 20px",borderRadius:10,textDecoration:"none" }}>Login</Link>
                  <Link href="/paket" style={{ background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.25)",color:"#22c55e",fontWeight:800,fontSize:13,padding:"10px 20px",borderRadius:10,textDecoration:"none" }}>Lihat Paket</Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
