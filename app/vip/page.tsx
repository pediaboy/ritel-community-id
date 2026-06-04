"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── JAKARTA REALTIME CLOCK ──────────────────────────────────────
function JakartaClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone:"Asia/Jakarta" }));
      const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
      const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      setDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
      setTime(now.toTimeString().slice(0,8));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return ()=>clearInterval(iv);
  },[]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"5px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", background:"rgba(255,255,255,0.02)" }}>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>🕐</span>
      <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", fontVariantNumeric:"tabular-nums", letterSpacing:"0.05em" }}>{time}</span>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>WIB</span>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.15)" }}>•</span>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{date}</span>
    </div>
  );
}

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

// ── FEED TAB VIP (Twitter/X style) ──────────────────────────────
function FeedTabVIP() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/admin/feed");
        const d = await r.json();
        if (d.success) setPosts(d.feed.filter((p:any)=>p.show_vip!==false));
      } catch {}
      setLoading(false);
    };
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  const tagColors: Record<string,string> = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const diff = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diff < 60) return "Baru saja";
      if (diff < 3600) return Math.floor(diff/60) + " menit lalu";
      if (diff < 86400) return Math.floor(diff/3600) + " jam lalu";
      return d.toLocaleDateString("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"short",year:"numeric"});
    } catch { return ""; }
  };

  if (loading) return (
    <div style={{ textAlign:"center",padding:"60px 0" }}>
      <div style={{ width:28,height:28,border:"3px solid rgba(30,90,240,0.2)",borderTopColor:"#1e5af0",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto" }}/>
    </div>
  );

  if (!posts.length) return (
    <div style={{ textAlign:"center",padding:"60px 16px" }}>
      <p style={{ fontSize:36,marginBottom:12 }}>📭</p>
      <p style={{ color:"rgba(255,255,255,0.4)",fontSize:14 }}>Belum ada post dari admin.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:12,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontWeight:900,fontSize:18,flex:1 }}>Feed</h2>
        <span style={{ fontSize:11,color:"rgba(255,255,255,0.3)" }}>{posts.length} post</span>
      </div>
      <div style={{ display:"flex",flexDirection:"column" }}>
        {posts.map((p,i) => {
          const isRC = p.author !== "elthoriqqqq_";
          const avatarBg = isRC ? "linear-gradient(135deg,#1e5af0,#00c8ff)" : "linear-gradient(135deg,#7c3aed,#a855f7)";
          const avatarInitials = isRC ? "RC" : "EL";
          const tagColor = tagColors[p.tag||"info"] || "#3b82f6";
          return (
            <div key={p.id} style={{ padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:12 }}>
              {/* Avatar */}
              <div style={{ flexShrink:0 }}>
                <div style={{ width:44,height:44,borderRadius:"50%",background:avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#fff" }}>{avatarInitials}</div>
              </div>
              {/* Content */}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap" }}>
                  <span style={{ fontWeight:800,fontSize:14,color:"#fff" }}>{p.author}</span>
                  {/* Instagram/Twitter verified badge */}
                  <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>·</span>
                  <span style={{ color:"rgba(255,255,255,0.3)",fontSize:11 }}>{formatTime(p.created_at)}</span>
                  {p.tag && <span style={{ fontSize:9,background:`${tagColor}20`,color:tagColor,padding:"1px 7px",borderRadius:4,fontWeight:700 }}>{p.tag}</span>}
                  {p.pinned && <span style={{ fontSize:10,color:"#f59e0b" }}>📌</span>}
                </div>
                <p style={{ color:"rgba(255,255,255,0.85)",fontSize:14,lineHeight:1.65,whiteSpace:"pre-wrap",wordBreak:"break-word" }}>{p.content}</p>
                {/* Twitter-style action buttons */}
                <div style={{ display:"flex",gap:20,marginTop:12 }}>
                  {[
                    { icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, label:"0" },
                    { icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, label:"" },
                    { icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>, label:"" },
                  ].map((btn,j) => (
                    <div key={j} style={{ display:"flex",alignItems:"center",gap:5,color:"rgba(255,255,255,0.3)",cursor:"pointer" }}>
                      {btn.icon}
                      {btn.label && <span style={{ fontSize:11 }}>{btn.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  // Amplitude sesuai persentase: 1% = kecil, 10%+ = dramatis
  const rawAmp = Math.abs(changePercent);
  const amplitude = rawAmp < 1 ? 4 : rawAmp < 3 ? 7 : rawAmp < 6 ? 11 : rawAmp < 10 ? 15 : rawAmp < 20 ? 20 : 26;
  const speed = rawAmp < 2 ? 50 : rawAmp < 8 ? 38 : 28; // lebih tinggi %= lebih cepat

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const mid = H / 2;
    let t = 0;

    if (dataRef.current.length === 0) {
      dataRef.current = Array(W).fill(mid);
    }

    const draw = () => {
      t++;
      const cycle = t % speed;
      let newY = mid;
      // Pola EKG: P-QRS-T wave
      const pct3 = Math.floor(speed * 0.3);
      const pct35 = Math.floor(speed * 0.35);
      const pct42 = Math.floor(speed * 0.42);
      const pct48 = Math.floor(speed * 0.48);
      const pct55 = Math.floor(speed * 0.55);
      const pct6 = Math.floor(speed * 0.6);
      if (cycle === pct3) newY = mid - amplitude * 0.3;
      else if (cycle === pct35) newY = mid + amplitude * 0.2;
      else if (cycle === pct42) newY = mid - amplitude * (isPositive ? 2.5 : 1.2);
      else if (cycle === pct48) newY = mid + amplitude * (isPositive ? 0.8 : 2.0);
      else if (cycle === pct55) newY = mid - amplitude * 0.4;
      else if (cycle === pct6) newY = mid + amplitude * 0.15;
      else newY = mid + (Math.random() - 0.5) * 0.8;

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
function SignalCard({ s, isDone }: { s: any; isDone?: boolean }) {
  const ac = ACTION_COLORS[s.action] || ACTION_COLORS.HOLD;
  const isSignalDone = isDone === true || s.is_done === true;
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
        {[{label:"Entry",val:s.entry,cls:"rgba(255,255,255,0.85)"},{label:"Stop Loss",val:s.sl,cls:"#ef4444"},{label:"TP1",val:s.tp,cls:"#22c55e"}].map(({label,val,cls})=>(
          <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 10px" }}>
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:9, marginBottom:3 }}>{label}</p>
            <p style={{ color:cls, fontWeight:800, fontSize:14 }}>{val||"-"}</p>
          </div>
        ))}
      </div>
      {/* Multi TP */}
      {(s.tp2||s.tp3) && (
        <div style={{ display:"flex", gap:8, padding:"0 16px 10px" }}>
          {s.tp2 && <div style={{ flex:1, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:10, padding:"6px 10px" }}>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:9, marginBottom:2 }}>TP2</p>
            <p style={{ color:"#4ade80", fontWeight:800, fontSize:13 }}>{s.tp2}</p>
          </div>}
          {s.tp3 && <div style={{ flex:1, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:10, padding:"6px 10px" }}>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:9, marginBottom:2 }}>TP3</p>
            <p style={{ color:"#86efac", fontWeight:800, fontSize:13 }}>{s.tp3}</p>
          </div>}
        </div>
      )}
      {/* Centang TP individual jika ada is_done tracking */}
      {isSignalDone && (
        <div style={{ margin:"0 16px 10px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:10, padding:"6px 12px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#22c55e", fontSize:16 }}>✅</span>
          <span style={{ color:"#22c55e", fontSize:11, fontWeight:700 }}>TARGET TERCAPAI</span>
        </div>
      )}
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
// ===== ALL MODULES (comprehensive, by level) =====
const MODULE_CONTENT: any = {
  b1: {
    image: null,
    lessons: [
      { title:"Apa Itu Saham?", body:"Saham adalah bukti kepemilikan sebagian dari sebuah perusahaan. Saat kamu beli saham BBCA, kamu jadi salah satu pemilik Bank BCA. Keuntungan dari dua sumber: kenaikan harga (capital gain) dan pembagian laba perusahaan (dividen)." },
      { title:"Cara Kerja Bursa Efek", body:"BEI adalah tempat jual beli saham terorganisir. Sesi I: 09:00–12:00, Sesi II: 13:30–15:49 WIB. Harga ditentukan mekanisme supply & demand — siapa yang mau beli dan siapa yang mau jual di harga berapa." },
      { title:"Membuka Rekening Saham", body:"Pilih broker terdaftar OJK: BCA Sekuritas, Mirae Asset, Mandiri Sekuritas, Stockbit. Siapkan KTP, NPWP, foto selfie, rekening bank. Proses 1-3 hari kerja. Setelah aktif, transfer ke RDN dan mulai beli saham." },
      { title:"Lot & Fraksi Harga", body:"1 lot = 100 lembar saham. Harga saham Rp 1.000 → 1 lot = Rp 100.000. Fraksi harga: saham < Rp 200 bergerak Rp 1/tick, > Rp 5.000 bergerak Rp 25/tick. Auto rejection mencegah harga naik/turun lebih dari 35% sehari." },
      { title:"Transaksi Pertamamu", body:"Cari saham di aplikasi → masukkan kode (misal: BBCA) → pilih jumlah lot → klik Beli. Pastikan saldo RDN cukup. Order dieksekusi saat ada penjual di harga yang sama. Cek portofoliomu di menu Portofolio." },
    ]
  },
  b2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/38303af8a_generated_image.png",
    lessons: [
      { title:"Jenis Chart Saham", body:"3 jenis chart utama: Line chart (hanya harga penutupan), Bar chart (OHLC), dan Candlestick chart (paling populer). Trader profesional pakai candlestick karena paling informatif dan mudah dibaca secara visual." },
      { title:"Anatomy Candlestick (OHLC)", body:"Setiap candle: Open (buka), High (tertinggi), Low (terendah), Close (tutup). Body = jarak open ke close. Shadow/ekor = jarak ke high/low. Candle hijau = close > open (bullish). Candle merah = close < open (bearish)." },
      { title:"Pola Candle Penting", body:"Hammer: body kecil, ekor panjang bawah → sinyal reversal naik. Shooting Star: ekor panjang atas → sinyal reversal turun. Bullish Engulfing: candle hijau besar 'menelan' candle merah → sinyal kuat naik. Doji: open ≈ close → ketidakpastian pasar." },
      { title:"Membaca Timeframe", body:"Daily chart = 1 candle = 1 hari (paling umum untuk swing trading). Weekly = trend menengah. Monthly = jangka panjang. Semakin besar timeframe, semakin kuat sinyalnya. Selalu cek daily, konfirmasi di weekly." },
      { title:"Tools Chart Gratis", body:"TradingView (tradingview.com) — terbaik, bisa set alert harga gratis. RTI Business — data saham IDX lengkap. Stockbit — cocok untuk trader Indonesia. Semua gratis, tinggal daftar dan cari kode saham BEI." },
    ]
  },
  b3: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/837ca8cd8_generated_image.png",
    lessons: [
      { title:"Modal Ideal untuk Mulai", body:"Tidak ada minimal modal di BEI — bahkan Rp 100.000 sudah bisa beli 1 lot. Idealnya mulai Rp 1–5 juta agar bisa diversifikasi 3-5 saham. Yang terpenting: jangan pakai uang yang dibutuhkan dalam 3-6 bulan ke depan." },
      { title:"Aturan 1-2% Risk Per Trade", body:"Jika portofoliomu Rp 10 juta, maksimal risiko per transaksi = Rp 100.000–200.000 (1-2%). Artinya jika stop loss kena, kamu kehilangan maksimal 2% dari total modal — bukan hancur total. Ini aturan paling fundamental dalam manajemen modal." },
      { title:"Diversifikasi Portofolio", body:"Jangan taruh semua telur dalam satu keranjang. Idealnya 3-7 saham dari sektor berbeda. Contoh: 1 perbankan (BBCA), 1 energi (PGAS), 1 konsumer (UNVR), 1 infrastruktur (JSMR). Korelasi rendah antar saham = risiko lebih terkontrol." },
      { title:"3 Layer Portofolio", body:"Core (50%): Blue chip stabil — BBCA, TLKM, BMRI. Tahan lama, dividen bagus. Growth (30%): Mid-cap dengan potensi tumbuh — sektor teknologi, kesehatan. Speculative (20%): Small cap berpotensi tinggi, risiko besar — batasi ketat dan selalu pasang stop loss." },
      { title:"Menghitung Profit & Loss", body:"Profit = (Harga Jual - Harga Beli) × Jumlah Lembar - Biaya Broker. Biaya broker 0.1-0.3% per transaksi. Contoh: Beli BBCA 1 lot @ Rp 9.000, jual @ Rp 9.500 → Profit ≈ Rp 48.000 setelah biaya. Selalu hitung net profit setelah biaya." },
    ]
  },
  b4: {
    image: null,
    lessons: [
      { title:"Sumber Berita Terpercaya", body:"CNBC Indonesia — berita pasar saham & makro terkini. Kontan.co.id — analisis saham & laporan keuangan. IDX.co.id — keterbukaan informasi resmi emiten. Investing.com — data ekonomi global & kalender ekonomi. Bloomberg/Reuters — sentimen global utama." },
      { title:"Pengaruh BI Rate", body:"BI naikkan suku bunga → saham cenderung turun (investor lebih suka deposito/obligasi). BI turunkan suku bunga → saham cenderung naik (biaya modal murah, ekspansi bisnis lebih mudah). Sektor perbankan paling sensitif terhadap perubahan BI Rate." },
      { title:"Dampak Data Makro", body:"Inflasi tinggi → BI naikkan rate → tekanan saham. GDP tumbuh → ekonomi sehat → saham naik. PMI manufaktur > 50 → ekspansi → positif. Data tenaga kerja AS (NFP) tiap Jumat pertama bulan → penggerak pasar global termasuk IHSG." },
      { title:"Membaca Keterbukaan Informasi", body:"Buka idx.co.id → Perusahaan Tercatat → Keterbukaan Informasi. Cari: laporan keuangan kuartalan, laporan tahunan, corporate action (dividen, rights issue, buyback), keterbukaan material (akuisisi, pergantian direksi). Semua emiten BEI wajib lapor ke IDX." },
      { title:"Tidak Panik Saat Market Turun", body:"Koreksi pasar adalah normal dan terjadi tiap tahun. IHSG pernah turun 50%+ saat krisis, tapi selalu recovery. Kunci: jangan investasi dengan uang pinjaman, jangan lihat portofolio tiap menit, fokus pada kualitas perusahaan bukan fluktuasi harga jangka pendek." },
    ]
  },
  s1: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/92bd00609_generated_image.png",
    lessons: [
      { title:"Laporan Laba Rugi", body:"Komponen utama: Revenue (total pendapatan), Gross Profit (Revenue - HPP), EBITDA (laba sebelum bunga, pajak, depresiasi), Net Profit (laba bersih). Cari perusahaan dengan net profit margin konsisten naik tiap tahun — itu tanda bisnis makin efisien." },
      { title:"Neraca Keuangan (Balance Sheet)", body:"Snapshot kondisi keuangan pada tanggal tertentu. Aset = Liabilitas + Ekuitas. Cek: Current Ratio (aset lancar / utang lancar) > 1.5 = bagus. DER (debt/equity) < 1 = lebih aman. Ekuitas terus naik dari tahun ke tahun = perusahaan tumbuh sehat." },
      { title:"Laporan Arus Kas", body:"Paling susah dipalsukan. Operating Cash Flow positif dan tumbuh = bisnis sehat. Jika net profit positif tapi OCF negatif → waspada, bisa window dressing. Investing Cash Flow negatif bisa bagus (ekspansi). Free Cash Flow = OCF - Capex — ini yang paling dicermati investor institusi." },
      { title:"Red Flags Perusahaan Bermasalah", body:"🚨 Piutang tumbuh jauh lebih cepat dari revenue, utang membengkak tiap tahun, gross margin terus menurun, pergantian auditor mendadak, direksi menjual saham besar-besaran, laporan keuangan sering direvisi, dan OCF terus negatif meski laba positif." },
      { title:"Download & Baca Laporan Keuangan", body:"Buka idx.co.id → Perusahaan Tercatat → Laporan Keuangan. Atau di website IR perusahaan. Bandingkan minimal 4 kuartal (QoQ) dan 3 tahun (YoY) untuk lihat tren. Gunakan Stockbit atau RTI untuk ringkasan cepat tanpa baca PDF panjang." },
    ]
  },
  s2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/92bd00609_generated_image.png",
    lessons: [
      { title:"Price to Earnings Ratio (PER)", body:"PER = Harga Saham / EPS. Contoh: harga Rp 1.000, EPS Rp 100 → PER 10x = kamu bayar 10 tahun laba. PER rendah belum tentu murah — bandingkan dengan rata-rata sektornya. Bank besar biasanya PER 8-15x, sektor tech bisa 30-50x." },
      { title:"Price to Book Value (PBV)", body:"PBV = Harga Saham / Nilai Buku per Saham. PBV < 1 = harga di bawah nilai aset bersih (potensi undervalue, tapi cek fundamentalnya). Untuk saham bank, PBV 1-2.5x wajar. PBV > 5x = mahal, kecuali growth sangat tinggi dan ROE konsisten." },
      { title:"ROE & ROA", body:"ROE (Return on Equity) = Net Profit / Ekuitas. ROE > 15% bagus, > 20% sangat bagus — menunjukkan efisiensi penggunaan modal. ROA (Return on Assets) = Net Profit / Total Aset — untuk bank biasanya cek ROA > 1.5%. Konsistensi ROE selama 5 tahun lebih penting dari angka satu tahun." },
      { title:"Debt to Equity Ratio (DER)", body:"DER = Total Utang / Ekuitas. DER < 1 = lebih banyak modal sendiri = lebih aman. DER 1-2 = masih bisa diterima di beberapa industri. DER > 3 = sangat berisiko, kecuali perbankan dan leasing yang memang model bisnisnya leverage tinggi." },
      { title:"Cara Hitung Valuasi Sederhana", body:"Bandingkan PER saham dengan rata-rata industri. Jika PER di bawah rata-rata tapi ROE lebih tinggi = UNDERVALUED! Contoh: BBRI PER 8x, rata-rata bank besar 12x, tapi ROE 18% → potensi undervalue = entry point bagus. Kombinasikan dengan analisis teknikal untuk timing masuk terbaik." },
    ]
  },
  s3: {
    image: null,
    lessons: [
      { title:"Kriteria Saham Multi-Bagger", body:"Multi-bagger = saham naik 2x, 5x, 10x lipat. Ciri-cirinya: Revenue tumbuh 20%+ per tahun, net profit margin meningkat, market cap masih kecil (<Rp 5T), management berpengalaman & punya saham sendiri, berada di industri growth cycle." },
      { title:"Cara Screening Saham", body:"Gunakan Stockbit Screener atau RTI: Filter → Market Cap < 5T + Revenue Growth YoY > 20% + ROE > 15% + DER < 1. Hasilnya 10-20 saham — analisis lebih lanjut satu per satu. Bandingkan dengan kompetitor di sektor yang sama untuk lihat keunggulan relatifnya." },
      { title:"Competitive Moat (Keunggulan Kompetitif)", body:"Cari perusahaan dengan 'parit pertahanan' yang susah ditembus: Brand kuat (UNVR, MYOR), Network effect (GOTO), Biaya switching tinggi (software enterprise), Regulasi melindungi (TLKM, BBCA), atau skala ekonomi (INDF, ICBP). Moat = saham tahan banting jangka panjang." },
      { title:"Low Float & Insider Ownership", body:"Float = jumlah saham beredar bebas. Float rendah + volume naik = harga bisa bergerak cepat. Insider ownership tinggi (direksi/komisaris pegang banyak saham sendiri) = manajemen percaya pada bisnisnya. Cek di laporan tahunan bagian Kepemilikan Saham." },
      { title:"Sektor dalam Growth Cycle", body:"2024-2026 di BEI yang menarik: Digital banking & fintech, Data center & cloud (DCII), EV & baterai nikel (MBAP, ADRO), Healthcare post-COVID, CPO & transisi energi. Masuk di awal siklus pertumbuhan sektor = return terbesar sebelum mainstream." },
    ]
  },
  s4: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/837ca8cd8_generated_image.png",
    lessons: [
      { title:"Position Sizing yang Benar", body:"Rumus: Modal per saham = Total Modal × % Risiko / % Stop Loss. Contoh: Modal Rp 10 juta, risiko 2% = Rp 200.000, stop loss 10% bawah entry → beli maksimal Rp 2 juta di saham itu. Konsisten dengan ukuran posisi adalah kunci long-term survival di pasar." },
      { title:"Cut Loss: Kapan & Bagaimana", body:"Cut loss bukan kalah — cut loss adalah menyelamatkan modal untuk trade berikutnya. Tentukan stop loss SEBELUM beli. Aturan umum: -7% sampai -10% dari harga beli = exit. Jangan pernah hold saham turun karena 'nanti naik' tanpa alasan fundamental yang jelas dan terukur." },
      { title:"Averaging Down yang Benar", body:"HANYA boleh dilakukan jika: (1) Fundamental perusahaan masih kuat, (2) Alasan awal beli masih valid, (3) Masih punya cash cadangan. JANGAN averaging down saham yang fundamentalnya memburuk. Averaging down saham buruk = memperbesar kerugian, bukan memperbaikinya." },
      { title:"Trading Journal & Evaluasi", body:"Catat setiap transaksi: tanggal, kode saham, alasan beli, entry, TP, SL, hasil, dan pelajaran. Review bulanan: win rate berapa? risk/reward ratio berapa? Trader yang konsisten profit SEMUA punya trading journal — ini cermin terjujur dari kualitas keputusanmu." },
      { title:"Target Return Realistis", body:"Benchmark IHSG jangka panjang ~15%/tahun. Target realistis investor aktif: 20-30%/tahun sudah sangat baik. Siapapun yang janji 100%+ per bulan hampir pasti scam. Warren Buffett rata-rata 20%/tahun dan itu dianggap luar biasa di seluruh dunia selama 50+ tahun." },
    ]
  },
  g1: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/050d585f7_generated_image.png",
    lessons: [
      { title:"Support & Resistance", body:"Support = level harga di mana banyak pembeli masuk → harga memantul ke atas. Resistance = level di mana banyak penjual masuk → harga tertolak ke bawah. Cara menentukan: tarik garis horizontal di titik harga yang sudah beberapa kali memantul. Makin sering diuji = makin kuat levelnya." },
      { title:"Trend Analysis", body:"Uptrend = Higher High (HH) + Higher Low (HL) → beli di setiap Higher Low. Downtrend = Lower High (LH) + Lower Low (LL) → jangan beli, tunggu konfirmasi reversal. Sideways = harga bergerak horizontal → beli di support, jual di resistance. Rule utama: Don't fight the trend!" },
      { title:"Pattern Reversal: Head & Shoulders", body:"Pola 3 puncak: bahu kiri, kepala (tertinggi), bahu kanan. Saat harga tembus neckline ke bawah = sinyal jual kuat! Target price = jarak kepala ke neckline, diproyeksikan ke bawah. Double Top: 2 puncak setara = bearish. Double Bottom: 2 lembah setara = bullish kuat." },
      { title:"Pattern Continuation: Flag & Pennant", body:"Bull Flag: candle naik kuat (tiang) + konsolidasi miring turun (bendera) → entry saat breakout atas. Pennant: konsolidasi segitiga simetris setelah gerakan kuat → arah breakout = konfirmasi lanjutan trend. Ascending Triangle: resistance horizontal + support naik = biasanya breakout ke atas." },
      { title:"Moving Average sebagai Support/Resistance Dinamis", body:"MA 20 = support/resistance jangka pendek. MA 50 = menengah. MA 200 = jangka panjang (di atas MA200 = bull market). Harga bouncing dari MA = entry point bagus dengan stop loss di bawah MA. Golden Cross (MA50 silang ke atas MA200) = sinyal bullish jangka panjang yang kuat." },
    ]
  },
  g2: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/32f51ddfa_generated_image.png",
    lessons: [
      { title:"RSI (Relative Strength Index)", body:"Skala 0-100. RSI > 70 = overbought (potensi koreksi). RSI < 30 = oversold (potensi rebound). RSI Divergence: harga buat Higher High tapi RSI buat Lower High = bearish divergence → sinyal reversal turun sangat kuat! Ini salah satu sinyal paling reliabel di teknikal analisis." },
      { title:"MACD", body:"MACD Line = EMA 12 - EMA 26. Signal Line = EMA 9 dari MACD. Sinyal beli: MACD crossover ke atas Signal Line (terutama di area negatif). Sinyal jual: MACD crossover ke bawah Signal Line (di area positif). Histogram makin mengecil = momentum melemah, siap-siap reversal." },
      { title:"Bollinger Bands", body:"3 garis: Middle Band (SMA 20), Upper Band (+2 SD), Lower Band (-2 SD). Squeeze (pita menyempit) = volatilitas rendah, siap breakout besar — perhatikan arah breakout-nya! Harga menyentuh lower band di uptrend yang masih valid = entry peluang bagus. Upper band = area take profit." },
      { title:"Volume Analysis", body:"Harga naik + volume naik = naik kuat (valid). Harga naik + volume turun = lemah, hati-hati. Harga turun + volume naik = distribusi, waspada. Volume spike 3-5x rata-rata = ada aksi big player atau news penting. SELALU cek volume sebelum entry — volume adalah konfirmasi terpenting." },
      { title:"Kombinasi Indikator Efektif", body:"Pakai maksimal 3 indikator: (1) Trend: MA 20 + MA 50, (2) Momentum: RSI atau MACD, (3) Volatilitas: Bollinger Bands. Tunggu minimal 2 dari 3 memberikan sinyal searah sebelum entry — ini disebut konfluensi. Probabilitas sukses jauh lebih tinggi dari satu sinyal saja." },
    ]
  },
  g3: {
    image: "https://media.base44.com/images/public/6a1dca69a67dba3797387df2/d1eca2064_generated_image.png",
    lessons: [
      { title:"Siapa Itu Bandar?", body:"Bandar adalah pelaku pasar bermodal besar — institusi, sekuritas besar, atau konglomerat — yang punya kemampuan menggerakkan harga saham tertentu. Di saham small-mid cap BEI, bandar sangat aktif. Pola mereka: akumulasi di harga rendah → pump → distribusi di harga tinggi." },
      { title:"Deteksi Fase Akumulasi", body:"Ciri saham diakumulasi: Volume naik tapi harga sideways (bandar serap tekanan jual), candle-candle kecil dengan ekor panjang di bawah, broker tertentu konsisten net buy, bid jauh lebih tebal dari offer di market depth. Ini adalah fase terbaik untuk ikut masuk!" },
      { title:"Deteksi Fase Distribusi", body:"Setelah harga sudah naik tinggi: Volume tidak konsisten, candle panjang tapi sering berbalik, asing mulai net sell, berita positif bermunculan justru saat bandar sedang jual ke retailer yang FOMO. Sinyal: segera profit taking atau exit sebelum dump terjadi." },
      { title:"Tape Reading & Market Depth", body:"Market depth: antrian bid (pembeli) vs offer (penjual). Bid tebal di support = bandar ada di bawah → aman. Offer tebal di resistance = banyak penjual → hati-hati breakout palsu. Tape reading = amati kecepatan dan ukuran transaksi real-time untuk deteksi big player bergerak." },
      { title:"Hindari Jebakan Pump & Dump", body:"Ciri pump & dump: Kenaikan cepat >20% dalam beberapa hari, volume ekstrem, berita terlalu positif mendadak, banyak grup WA/Telegram rekomendasikan bersamaan. Solusi: jangan chase harga yang sudah naik banyak. Masuk hanya di fase akumulasi, BUKAN saat sudah pump." },
    ]
  },
  g4: {
    image: null,
    lessons: [
      { title:"Fear & Greed", body:"Fear (takut) membuat investor jual di harga terendah. Greed (serakah) membuat investor beli di harga tertinggi. Keduanya musuh utama investor. Solusi: punya sistem trading dengan aturan entry & exit yang objektif dan terukur — sehingga emosi tidak ikut campur dalam keputusan." },
      { title:"FOMO & Panic Selling", body:"FOMO: Saham sudah naik 30%, kamu beli karena takut ketinggalan → biasanya itulah puncaknya. Panic Selling: Saham turun 10%, kamu jual panik → biasanya itulah bottomnya. Solusi: Selalu tentukan rencana sebelum masuk. Jika sudah melewati entry zone-mu, skip dan cari peluang berikutnya." },
      { title:"Trading Journal", body:"Catat setiap trade: Tanggal, Saham, Alasan beli (setup apa), Entry, TP, SL, Hasil, dan Evaluasi (apa yang benar/salah). Review setiap bulan. Trader yang konsisten profit SEMUA punya trading journal. Ini adalah cermin terjujur dari kualitas setiap keputusan tradingmu." },
      { title:"Bias Kognitif yang Merusak", body:"• Confirmation bias: cari info yang hanya mendukung keputusanmu\n• Anchoring: terpaku pada harga beli, susah cut loss\n• Sunk cost fallacy: 'sayang dijual rugi' padahal fundamental sudah rusak\n• Overconfidence: merasa ahli setelah beberapa kali profit\nSolusi: selalu cari second opinion dan respek pada stop loss." },
      { title:"Membangun Sistem Trading", body:"Sistem yang baik punya: (1) Kriteria entry yang jelas dan terukur, (2) Target profit (TP) realistis, (3) Stop loss yang ketat dan WAJIB diikuti, (4) Position sizing yang konsisten, (5) Maximum drawdown — jika portofolio turun 20%, berhenti trading 2 minggu untuk evaluasi & reset mindset." },
    ]
  },
  p1: {
    image: null,
    lessons: [
      { title:"Cara Optimal Gunakan AI Agent RC", body:"AI Agent RC tersedia 24/7 untuk bantu analisis saham BEI. Cara terbaik: tanyakan dengan spesifik, contoh 'Analisis teknikal BBCA D1' atau 'Fundamental TLKM Q1 2024'. Sertakan konteks seperti timeframe dan tujuan (swing/positional/long-term). AI dapat bantu identifikasi support/resistance, rangkuman laporan keuangan, dan sentiment berita terkini." },
      { title:"Review Fundamental dengan AI Agent", body:"Minta AI Agent untuk rangkum laporan keuangan terbaru emiten — cukup ketik 'review fundamental BBRI terbaru'. AI akan jelaskan revenue growth, net profit margin, DER, ROE, dan red flags jika ada. Bandingkan juga dengan competitor — 'bandingkan BBCA vs BBRI dari sisi fundamental'. Gunakan insight ini sebagai second opinion sebelum keputusan besar." },
      { title:"Interpretasi laporan keuangan otomatis", body:"Penjelasan lengkap Interpretasi laporan keuangan otomatis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rekomendasi entry berdasarkan teknikal", body:"Penjelasan lengkap Rekomendasi entry berdasarkan teknikal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sentiment analysis berita saham", body:"Penjelasan lengkap Sentiment analysis berita saham: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Bantu susun watchlist personal", body:"Penjelasan lengkap Bantu susun watchlist personal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p2: {
    image: null,
    lessons: [
      { title:"Watchlist mingguan dikurasi analis senior", body:"Penjelasan lengkap Watchlist mingguan dikurasi analis senior: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kriteria masuk & keluar watchlist", body:"Penjelasan lengkap Kriteria masuk & keluar watchlist: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saham di fase akumulasi yang perlu dipantau", body:"Penjelasan lengkap Saham di fase akumulasi yang perlu dipantau: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Screening berdasarkan sector rotation", body:"Penjelasan lengkap Screening berdasarkan sector rotation: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Update trigger: kapan waktu beli", body:"Penjelasan lengkap Update trigger: kapan waktu beli: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Notifikasi perubahan signifikan saham pilihan", body:"Penjelasan lengkap Notifikasi perubahan signifikan saham pilihan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p3: {
    image: null,
    lessons: [
      { title:"Analisis IHSG mingguan mendalam", body:"Penjelasan lengkap Analisis IHSG mingguan mendalam: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor yang sedang outperform", body:"Penjelasan lengkap Sektor yang sedang outperform: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Top picks minggu ini & alasannya", body:"Penjelasan lengkap Top picks minggu ini & alasannya: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rangkuman sentimen global", body:"Penjelasan lengkap Rangkuman sentimen global: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kalender ekonomi & event penting", body:"Penjelasan lengkap Kalender ekonomi & event penting: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi portofolio jangka menengah", body:"Penjelasan lengkap Strategi portofolio jangka menengah: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl1: {
    image: null,
    lessons: [
      { title:"Review portofolio personal bersama analis", body:"Penjelasan lengkap Review portofolio personal bersama analis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Second opinion keputusan investasi besar", body:"Penjelasan lengkap Second opinion keputusan investasi besar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Tanya saham spesifik: layak atau tidak?", body:"Penjelasan lengkap Tanya saham spesifik: layak atau tidak?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi rebalancing portofolio", body:"Penjelasan lengkap Strategi rebalancing portofolio: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Diskusi sektor & timing masuk optimal", body:"Penjelasan lengkap Diskusi sektor & timing masuk optimal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rencana investasi jangka panjang personal", body:"Penjelasan lengkap Rencana investasi jangka panjang personal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl2: {
    image: null,
    lessons: [
      { title:"Analisis portofolio komprehensif oleh AI", body:"Penjelasan lengkap Analisis portofolio komprehensif oleh AI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cek diversifikasi & korelasi aset", body:"Penjelasan lengkap Cek diversifikasi & korelasi aset: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Exposure sektoral & risiko konsentrasi", body:"Penjelasan lengkap Exposure sektoral & risiko konsentrasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saran rebalancing berbasis data historis", body:"Penjelasan lengkap Saran rebalancing berbasis data historis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Estimasi return berdasarkan historis 10 tahun", body:"Penjelasan lengkap Estimasi return berdasarkan historis 10 tahun: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Simulasi skenario market crash & bull run", body:"Penjelasan lengkap Simulasi skenario market crash & bull run: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e1: {
    image: null,
    lessons: [
      { title:"Sesi video call regular dengan mentor senior", body:"Penjelasan lengkap Sesi video call regular dengan mentor senior: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Review & coaching portofolio intensif", body:"Penjelasan lengkap Review & coaching portofolio intensif: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pengembangan sistem trading personal", body:"Penjelasan lengkap Pengembangan sistem trading personal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Simulasi pengambilan keputusan nyata", body:"Penjelasan lengkap Simulasi pengambilan keputusan nyata: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Koreksi kesalahan pola investasi", body:"Penjelasan lengkap Koreksi kesalahan pola investasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Roadmap menuju financial freedom", body:"Penjelasan lengkap Roadmap menuju financial freedom: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e2: {
    image: null,
    lessons: [
      { title:"Perencanaan alokasi portofolio awal", body:"Penjelasan lengkap Perencanaan alokasi portofolio awal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Monitoring & rebalancing aktif bulanan", body:"Penjelasan lengkap Monitoring & rebalancing aktif bulanan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Laporan performance personal bulanan", body:"Penjelasan lengkap Laporan performance personal bulanan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Identifikasi drag performance & solusinya", body:"Penjelasan lengkap Identifikasi drag performance & solusinya: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi exit & profit taking terencana", body:"Penjelasan lengkap Strategi exit & profit taking terencana: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Target return & timeline finansial personal", body:"Penjelasan lengkap Target return & timeline finansial personal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  b5: {
    image: null,
    lessons: [
      { title:"Strategi per Sesi Trading", body:"Sesi I berlangsung 09:00–12:00 WIB dan Sesi II 13:30–15:49 WIB. Sesi I biasanya lebih volatile dan volume lebih tinggi — cocok untuk trader aktif. Sesi II cenderung lebih tenang di awal tapi bisa ramai menjelang penutupan (pre-close). Strategi: pantau momentum pagi Sesi I untuk entry, dan gunakan Sesi II untuk evaluasi posisi atau exit." },
      { title:"Pre-Opening & Closing Auction", body:"Pre-opening 08:45–08:59 WIB: investor memasukkan order tapi tidak langsung execute — harga pembukaan ditentukan dari order yang terkumpul (call auction). Closing auction 15:49–16:00 WIB: sama, menentukan harga penutupan final. Tip: pantau order besar di pre-opening untuk menebak arah pasar hari itu." },
      { title:"Cara Baca Kalender Dividen", body:"Cum date = hari terakhir kamu harus hold saham untuk dapat dividen. Ex date = H+1 setelah cum date, biasanya harga turun sejumlah nilai dividen. Payment date = kapan dividen masuk ke rekening. Cek kalender dividen di RTI Business atau IDX.co.id. Strategi: beli sebelum cum date untuk dapat dividen, tapi waspadai penurunan harga di ex date." },
      { title:"Dampak RUPST pada Harga Saham", body:"RUPST (Rapat Umum Pemegang Saham Tahunan) digelar tiap tahun oleh emiten. Di RUPST diputuskan dividen, pergantian direksi, dan aksi korporasi besar. Harga saham bisa naik atau turun tergantung keputusan. Pantau agenda RUPST di keterbukaan informasi IDX. Jika ada rencana rights issue besar di RUPST, biasanya harga tertekan karena potensi dilusi." },
      { title:"Rights Issue vs Buyback vs Stock Split", body:"Rights issue = emiten terbitkan saham baru — potensi dilusi, harga biasanya tertekan. Buyback = emiten beli kembali sahamnya — bullish signal, harga cenderung naik. Stock split = 1 saham dipecah jadi beberapa — harga per lembar turun tapi jumlah lot naik, biasanya momentum positif. Selalu baca keterbukaan informasi untuk detail dan timeline." },
      { title:"Strategi Hadapi Libur Bursa", body:"Libur panjang (lebaran, nataru) sering dimanfaatkan bandar untuk distribusi sebelumnya. Beberapa hari sebelum libur panjang, pasar bisa volatile. Saran: kurangi posisi spekulatif menjelang libur panjang. Setelah libur, amati reaksi bursa regional (Nikkei, KOSPI, STI) sebagai petunjuk arah IHSG di hari pertama buka." }
    ]
  },
  b6: {
    image: null,
    lessons: [
      { title:"Saham vs Obligasi: Mana yang Cocok?", body:"Saham = bukti kepemilikan, potensi return tinggi tapi risiko tinggi. Obligasi = bukti hutang, return terbatas (kupon) tapi lebih stabil. Untuk investor muda dengan horizon panjang: saham lebih optimal untuk growth. Untuk investor konservatif atau mendekati pensiun: obligasi lebih aman. Campuran keduanya membentuk portofolio balanced." },
      { title:"Reksa dana saham vs reksa dana campuran", body:"Penjelasan lengkap Reksa dana saham vs reksa dana campuran: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"ETF IDX30 & EIDO: cara beli", body:"Penjelasan lengkap ETF IDX30 & EIDO: cara beli: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Waran: leverage instrument berisiko tinggi", body:"Penjelasan lengkap Waran: leverage instrument berisiko tinggi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rights issue: dilusi & peluang", body:"Penjelasan lengkap Rights issue: dilusi & peluang: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pilih instrumen sesuai profil risiko", body:"Penjelasan lengkap Pilih instrumen sesuai profil risiko: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  b7: {
    image: null,
    lessons: [
      { title:"Klasifikasi Saham Berdasarkan Market Cap", body:"Big cap (>10T): BBCA, BBRI, TLKM — stabil, likuid, cocok untuk hold panjang. Mid cap (1-10T): volatilitas lebih tinggi, potensi growth lebih besar. Small cap (<1T): risiko tinggi, spread besar, likuiditas rendah tapi bisa naik ratusan persen. Pemula sebaiknya mulai dari big cap untuk belajar, baru naik ke mid/small cap setelah paham risk management." },
      { title:"11 sektor saham di BEI", body:"Penjelasan lengkap 11 sektor saham di BEI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor defensif vs siklus", body:"Penjelasan lengkap Sektor defensif vs siklus: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saham LQ45 & IDX30: kriteria", body:"Penjelasan lengkap Saham LQ45 & IDX30: kriteria: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor rotation: kapan masuk & keluar", body:"Penjelasan lengkap Sektor rotation: kapan masuk & keluar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pengaruh sektor terhadap diversifikasi", body:"Penjelasan lengkap Pengaruh sektor terhadap diversifikasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  b8: {
    image: null,
    lessons: [
      { title:"Korelasi IHSG dengan bursa global", body:"Penjelasan lengkap Korelasi IHSG dengan bursa global: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Dampak Fed rate terhadap IHSG", body:"Penjelasan lengkap Dampak Fed rate terhadap IHSG: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"DXY Index: pengaruh ke pasar emerging", body:"Penjelasan lengkap DXY Index: pengaruh ke pasar emerging: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Harga komoditas: CPO, nikel, batu bara", body:"Penjelasan lengkap Harga komoditas: CPO, nikel, batu bara: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rupiah vs dolar: dampak ke emiten", body:"Penjelasan lengkap Rupiah vs dolar: dampak ke emiten: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara gunakan sentimen global untuk entry", body:"Penjelasan lengkap Cara gunakan sentimen global untuk entry: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  s5: {
    image: null,
    lessons: [
      { title:"Volume Adalah Kunci Konfirmasi", body:"Rule nomor 1: harga naik dengan volume tinggi = sinyal KUAT. Harga naik dengan volume rendah = sinyal LEMAH, waspadai reversal. Volume adalah bahan bakar pergerakan harga — tanpa volume, breakout sering gagal. Selalu cek volume sebelum entry. Bandingkan volume hari ini dengan rata-rata 20 hari (MA20 volume) untuk konteks yang tepat." },
      { title:"Cara Membedakan Volume Spike Real vs Fake", body:"Volume spike = volume hari itu > 3x rata-rata normal. Jika disertai candle bullish besar dan closing di atas resistance = sinyal akumulasi bandar. Jika volume spike tapi harga malah turun (shooting star/bearish engulfing) = distribusi — hati-hati! Fake-out: volume spike 1 hari lalu langsung turun lagi = pump and dump, hindari masuk." },
      { title:"Cara Pakai OBV untuk Deteksi Akumulasi", body:"OBV = kumulatif volume berdasarkan arah harga. Jika harga sideways tapi OBV naik terus = ada akumulasi diam-diam oleh smart money. Ini sinyal bullish tersembunyi sebelum harga meledak. Cara: tambahkan OBV di TradingView, amati divergence antara OBV dan harga. OBV baru all-time high sementara harga masih di bawah ATH = setup sangat bullish." },
      { title:"Volume Divergence: Early Warning System", body:"Bullish divergence: harga baru low tapi volume semakin kecil = jual sudah exhausted, potensi reversal naik. Bearish divergence: harga baru high tapi volume mengecil = beli melemah, potensi reversal turun. Ini adalah sinyal paling early sebelum reversal terjadi — sangat berguna untuk timing exit dari posisi yang sudah profit." },
      { title:"High volume di support = accumulation", body:"Penjelasan lengkap High volume di support = accumulation: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Low volume di resistance = weakness", body:"Penjelasan lengkap Low volume di resistance = weakness: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  s6: {
    image: null,
    lessons: [
      { title:"Cara hitung dividend yield", body:"Penjelasan lengkap Cara hitung dividend yield: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Payout ratio & sustainability dividen", body:"Penjelasan lengkap Payout ratio & sustainability dividen: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Jadwal: cum date, ex date, payment date", body:"Penjelasan lengkap Jadwal: cum date, ex date, payment date: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saham dividen konsisten: BBCA, TLKM, UNVR", body:"Penjelasan lengkap Saham dividen konsisten: BBCA, TLKM, UNVR: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Dividend trap: yield tinggi tapi fundamental buruk", body:"Penjelasan lengkap Dividend trap: yield tinggi tapi fundamental buruk: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Reinvestment dividen untuk compounding", body:"Penjelasan lengkap Reinvestment dividen untuk compounding: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  s7: {
    image: null,
    lessons: [
      { title:"Peer comparison dalam satu sektor", body:"Penjelasan lengkap Peer comparison dalam satu sektor: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Market share & competitive position", body:"Penjelasan lengkap Market share & competitive position: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Gross margin comparison antar emiten", body:"Penjelasan lengkap Gross margin comparison antar emiten: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Identifikasi pemimpin sektor (market leader)", body:"Penjelasan lengkap Identifikasi pemimpin sektor (market leader): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saham second liner yang mengejar", body:"Penjelasan lengkap Saham second liner yang mengejar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kapan second liner outperform leader?", body:"Penjelasan lengkap Kapan second liner outperform leader?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  s8: {
    image: null,
    lessons: [
      { title:"Apa itu drawdown dan max drawdown", body:"Penjelasan lengkap Apa itu drawdown dan max drawdown: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara hitung drawdown portofolio", body:"Penjelasan lengkap Cara hitung drawdown portofolio: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Drawdown vs volatilitas: perbedaan penting", body:"Penjelasan lengkap Drawdown vs volatilitas: perbedaan penting: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi recovery yang terstruktur", body:"Penjelasan lengkap Strategi recovery yang terstruktur: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kapan harus stop trading (circuit breaker)", body:"Penjelasan lengkap Kapan harus stop trading (circuit breaker): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Evaluasi penyebab drawdown sistematis", body:"Penjelasan lengkap Evaluasi penyebab drawdown sistematis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g5: {
    image: null,
    lessons: [
      { title:"Three White Soldiers & Three Black Crows", body:"Penjelasan lengkap Three White Soldiers & Three Black Crows: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Morning Star & Evening Star", body:"Penjelasan lengkap Morning Star & Evening Star: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Three Inside Up/Down", body:"Penjelasan lengkap Three Inside Up/Down: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Harami & Harami Cross", body:"Penjelasan lengkap Harami & Harami Cross: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Abandoned Baby: reversal ekstrem", body:"Penjelasan lengkap Abandoned Baby: reversal ekstrem: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Validasi semua pattern dengan volume spike", body:"Penjelasan lengkap Validasi semua pattern dengan volume spike: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g6: {
    image: null,
    lessons: [
      { title:"Fibonacci retracement: cara gambar", body:"Penjelasan lengkap Fibonacci retracement: cara gambar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Level kunci: 38.2%, 50%, 61.8%", body:"Penjelasan lengkap Level kunci: 38.2%, 50%, 61.8%: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Golden zone: area entry terbaik", body:"Penjelasan lengkap Golden zone: area entry terbaik: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Fibonacci extension: proyeksi target", body:"Penjelasan lengkap Fibonacci extension: proyeksi target: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kombinasi Fibo dengan support/resistance", body:"Penjelasan lengkap Kombinasi Fibo dengan support/resistance: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Contoh penerapan di BBCA, TLKM, MDKA", body:"Penjelasan lengkap Contoh penerapan di BBCA, TLKM, MDKA: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g7: {
    image: null,
    lessons: [
      { title:"5 wave impulse: motive wave", body:"Penjelasan lengkap 5 wave impulse: motive wave: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"3 wave corrective: A-B-C", body:"Penjelasan lengkap 3 wave corrective: A-B-C: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Aturan dasar Elliot Wave (tidak boleh dilanggar)", body:"Penjelasan lengkap Aturan dasar Elliot Wave (tidak boleh dilanggar): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara identifikasi wave di chart riil", body:"Penjelasan lengkap Cara identifikasi wave di chart riil: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Wave 3: terpanjang dan terkuat", body:"Penjelasan lengkap Wave 3: terpanjang dan terkuat: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Gunakan Elliot Wave untuk proyeksi target", body:"Penjelasan lengkap Gunakan Elliot Wave untuk proyeksi target: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g8: {
    image: null,
    lessons: [
      { title:"Identifikasi fase konsolidasi (base)", body:"Penjelasan lengkap Identifikasi fase konsolidasi (base): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Valid breakout: kriteria volume & closing", body:"Penjelasan lengkap Valid breakout: kriteria volume & closing: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"False breakout: tanda & cara hindari", body:"Penjelasan lengkap False breakout: tanda & cara hindari: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Entry teknik: buy on breakout vs buy on retest", body:"Penjelasan lengkap Entry teknik: buy on breakout vs buy on retest: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Stop loss optimal untuk strategi breakout", body:"Penjelasan lengkap Stop loss optimal untuk strategi breakout: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Breakout dari all-time high: target harga", body:"Penjelasan lengkap Breakout dari all-time high: target harga: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g9: {
    image: null,
    lessons: [
      { title:"5 komponen Ichimoku: fungsi masing-masing", body:"Penjelasan lengkap 5 komponen Ichimoku: fungsi masing-masing: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kumo Cloud: support & resistance dinamis", body:"Penjelasan lengkap Kumo Cloud: support & resistance dinamis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sinyal beli: TK cross di atas cloud", body:"Penjelasan lengkap Sinyal beli: TK cross di atas cloud: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sinyal jual: TK cross di bawah cloud", body:"Penjelasan lengkap Sinyal jual: TK cross di bawah cloud: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Chikou Span sebagai konfirmator", body:"Penjelasan lengkap Chikou Span sebagai konfirmator: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Twist sinyal dan setup terbaik untuk swing", body:"Penjelasan lengkap Twist sinyal dan setup terbaik untuk swing: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g10: {
    image: null,
    lessons: [
      { title:"Order book: cara baca bid & ask", body:"Penjelasan lengkap Order book: cara baca bid & ask: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Tape reading: deteksi order besar", body:"Penjelasan lengkap Tape reading: deteksi order besar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Big buyer vs big seller di market depth", body:"Penjelasan lengkap Big buyer vs big seller di market depth: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi scalping 1-2% per hari", body:"Penjelasan lengkap Strategi scalping 1-2% per hari: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Entry time optimal: awal sesi & pre-close", body:"Penjelasan lengkap Entry time optimal: awal sesi & pre-close: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cut loss disiplin untuk intraday trader", body:"Penjelasan lengkap Cut loss disiplin untuk intraday trader: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  g11: {
    image: null,
    lessons: [
      { title:"Siklus ekonomi & sector rotation model", body:"Penjelasan lengkap Siklus ekonomi & sector rotation model: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor defensif: konsumer, kesehatan, utilitas", body:"Penjelasan lengkap Sektor defensif: konsumer, kesehatan, utilitas: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor siklus: teknologi, properti, komoditas", body:"Penjelasan lengkap Sektor siklus: teknologi, properti, komoditas: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Early cycle vs late cycle indicators", body:"Penjelasan lengkap Early cycle vs late cycle indicators: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Flow asing sebagai petunjuk sector rotation", body:"Penjelasan lengkap Flow asing sebagai petunjuk sector rotation: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara screening saham di sektor yang mulai naik", body:"Penjelasan lengkap Cara screening saham di sektor yang mulai naik: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p4: {
    image: null,
    lessons: [
      { title:"Cara baca broker summary BEI", body:"Penjelasan lengkap Cara baca broker summary BEI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Net foreign buy/sell: cara interpretasi", body:"Penjelasan lengkap Net foreign buy/sell: cara interpretasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Distribusi kepemilikan: laporan bulanan IDX", body:"Penjelasan lengkap Distribusi kepemilikan: laporan bulanan IDX: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Unusual volume off-market hours", body:"Penjelasan lengkap Unusual volume off-market hours: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Crossing saham: sinyal accumulation bandar", body:"Penjelasan lengkap Crossing saham: sinyal accumulation bandar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pre-IPO accumulation pattern", body:"Penjelasan lengkap Pre-IPO accumulation pattern: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p5: {
    image: null,
    lessons: [
      { title:"Fase Wyckoff: Accumulation, Markup, Distribution, Markdown", body:"Penjelasan lengkap Fase Wyckoff: Accumulation, Markup, Distribution, Markdown: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Spring & upthrust: sinyal reversal Wyckoff", body:"Penjelasan lengkap Spring & upthrust: sinyal reversal Wyckoff: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Last Point of Support (LPS) sebagai entry ideal", body:"Penjelasan lengkap Last Point of Support (LPS) sebagai entry ideal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sign of Strength (SOS) konfirmasi breakout", body:"Penjelasan lengkap Sign of Strength (SOS) konfirmasi breakout: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sign of Weakness (SOW) untuk exit", body:"Penjelasan lengkap Sign of Weakness (SOW) untuk exit: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Menerapkan Wyckoff di saham BEI", body:"Penjelasan lengkap Menerapkan Wyckoff di saham BEI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p6: {
    image: null,
    lessons: [
      { title:"Confirmation bias: musuh terbesarmu", body:"Penjelasan lengkap Confirmation bias: musuh terbesarmu: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Anchoring bias: perangkap harga beli lama", body:"Penjelasan lengkap Anchoring bias: perangkap harga beli lama: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Disposition effect: hold loser, sell winner", body:"Penjelasan lengkap Disposition effect: hold loser, sell winner: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Overconfidence setelah winning streak", body:"Penjelasan lengkap Overconfidence setelah winning streak: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sistem keputusan berbasis aturan (rule-based)", body:"Penjelasan lengkap Sistem keputusan berbasis aturan (rule-based): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pre-trade checklist untuk keputusan objektif", body:"Penjelasan lengkap Pre-trade checklist untuk keputusan objektif: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p7: {
    image: null,
    lessons: [
      { title:"Bagian terpenting annual report", body:"Penjelasan lengkap Bagian terpenting annual report: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Management Discussion & Analysis (MD&A)", body:"Penjelasan lengkap Management Discussion & Analysis (MD&A): konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Strategi ekspansi & capex plan", body:"Penjelasan lengkap Strategi ekspansi & capex plan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Segmen bisnis: mana yang paling profitable", body:"Penjelasan lengkap Segmen bisnis: mana yang paling profitable: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Related party transaction: waspada conflict of interest", body:"Penjelasan lengkap Related party transaction: waspada conflict of interest: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Letter to shareholders: baca antara baris", body:"Penjelasan lengkap Letter to shareholders: baca antara baris: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  p8: {
    image: null,
    lessons: [
      { title:"Siklus kredit & pengaruh ke saham", body:"Penjelasan lengkap Siklus kredit & pengaruh ke saham: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Yield curve inversion: sinyal resesi", body:"Penjelasan lengkap Yield curve inversion: sinyal resesi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"PMI manufaktur sebagai leading indicator", body:"Penjelasan lengkap PMI manufaktur sebagai leading indicator: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"CPI & PPI: pengaruh ke margin emiten", body:"Penjelasan lengkap CPI & PPI: pengaruh ke margin emiten: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Current account & neraca perdagangan", body:"Penjelasan lengkap Current account & neraca perdagangan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara buat macro playbook personal", body:"Penjelasan lengkap Cara buat macro playbook personal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl3: {
    image: null,
    lessons: [
      { title:"Saham vs obligasi: inverse relationship", body:"Penjelasan lengkap Saham vs obligasi: inverse relationship: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"DXY vs saham emerging market", body:"Penjelasan lengkap DXY vs saham emerging market: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Oil price vs saham energi & transportasi", body:"Penjelasan lengkap Oil price vs saham energi & transportasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Emas sebagai risk-off barometer", body:"Penjelasan lengkap Emas sebagai risk-off barometer: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"CRB Index & saham komoditas IDX", body:"Penjelasan lengkap CRB Index & saham komoditas IDX: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Intermarket matrix untuk timing masuk", body:"Penjelasan lengkap Intermarket matrix untuk timing masuk: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl4: {
    image: null,
    lessons: [
      { title:"Free Cash Flow (FCF): cara hitung", body:"Penjelasan lengkap Free Cash Flow (FCF): cara hitung: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Proyeksi FCF 5 tahun ke depan", body:"Penjelasan lengkap Proyeksi FCF 5 tahun ke depan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"WACC: cost of capital", body:"Penjelasan lengkap WACC: cost of capital: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Terminal value: metode Gordon Growth", body:"Penjelasan lengkap Terminal value: metode Gordon Growth: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sensitivity analysis DCF", body:"Penjelasan lengkap Sensitivity analysis DCF: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Contoh DCF: BBCA, ASII, TLKM", body:"Penjelasan lengkap Contoh DCF: BBCA, ASII, TLKM: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl5: {
    image: null,
    lessons: [
      { title:"IPO analysis: cara nilai sebelum listing", body:"Penjelasan lengkap IPO analysis: cara nilai sebelum listing: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Rights issue: dilusi atau peluang?", body:"Penjelasan lengkap Rights issue: dilusi atau peluang?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Akuisisi target: ciri-ciri dan cara deteksi", body:"Penjelasan lengkap Akuisisi target: ciri-ciri dan cara deteksi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Buyback: sinyal manajemen percaya diri", body:"Penjelasan lengkap Buyback: sinyal manajemen percaya diri: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"MTO & delisting: strategi exit", body:"Penjelasan lengkap MTO & delisting: strategi exit: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Privatisasi BUMN: sejarah & pola", body:"Penjelasan lengkap Privatisasi BUMN: sejarah & pola: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  pl6: {
    image: null,
    lessons: [
      { title:"Dampak perang & konflik terhadap IHSG", body:"Penjelasan lengkap Dampak perang & konflik terhadap IHSG: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kebijakan Fed tapering & rate hike", body:"Penjelasan lengkap Kebijakan Fed tapering & rate hike: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Trade war: dampak ke emiten ekspor", body:"Penjelasan lengkap Trade war: dampak ke emiten ekspor: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Supply chain disruption: sektor paling terdampak", body:"Penjelasan lengkap Supply chain disruption: sektor paling terdampak: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Flight to quality: kapan terjadi & cara antisipasi", body:"Penjelasan lengkap Flight to quality: kapan terjadi & cara antisipasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Hedging sederhana di portofolio retail", body:"Penjelasan lengkap Hedging sederhana di portofolio retail: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e3: {
    image: null,
    lessons: [
      { title:"Definisi edge statistik dalam trading", body:"Penjelasan lengkap Definisi edge statistik dalam trading: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Parameter entry: konkret dan terukur", body:"Penjelasan lengkap Parameter entry: konkret dan terukur: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Filter trend: avoid trading counter-trend", body:"Penjelasan lengkap Filter trend: avoid trading counter-trend: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Posisi sizing adaptif berdasarkan volatilitas", body:"Penjelasan lengkap Posisi sizing adaptif berdasarkan volatilitas: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Backtest manual dengan historical data", body:"Penjelasan lengkap Backtest manual dengan historical data: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Evaluasi sistem: win rate, RR ratio, expectancy", body:"Penjelasan lengkap Evaluasi sistem: win rate, RR ratio, expectancy: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e4: {
    image: null,
    lessons: [
      { title:"Circle of competence: investasi apa yang kamu mengerti", body:"Penjelasan lengkap Circle of competence: investasi apa yang kamu mengerti: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Economic moat: 5 tipe keunggulan kompetitif", body:"Penjelasan lengkap Economic moat: 5 tipe keunggulan kompetitif: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Intrinsic value: cara sederhana menghitung", body:"Penjelasan lengkap Intrinsic value: cara sederhana menghitung: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Margin of safety: beli di bawah nilai wajar", body:"Penjelasan lengkap Margin of safety: beli di bawah nilai wajar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Konsentrasi vs diversifikasi: Buffett approach", body:"Penjelasan lengkap Konsentrasi vs diversifikasi: Buffett approach: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Saham BEI dengan karakter Buffettian", body:"Penjelasan lengkap Saham BEI dengan karakter Buffettian: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e5: {
    image: null,
    lessons: [
      { title:"Fragile vs robust vs anti-fragile", body:"Penjelasan lengkap Fragile vs robust vs anti-fragile: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Black Swan: skenario ekstrem yang mungkin", body:"Penjelasan lengkap Black Swan: skenario ekstrem yang mungkin: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Barbell strategy: safe + speculative", body:"Penjelasan lengkap Barbell strategy: safe + speculative: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Optionality: beli peluang, bukan kepastian", body:"Penjelasan lengkap Optionality: beli peluang, bukan kepastian: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Positioning saat IHSG koreksi 30-40%", body:"Penjelasan lengkap Positioning saat IHSG koreksi 30-40%: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Recovery playbook setelah market crash", body:"Penjelasan lengkap Recovery playbook setelah market crash: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  e6: {
    image: null,
    lessons: [
      { title:"Karakteristik unik BUMN vs swasta", body:"Penjelasan lengkap Karakteristik unik BUMN vs swasta: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kebijakan pemerintah sebagai driver harga", body:"Penjelasan lengkap Kebijakan pemerintah sebagai driver harga: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Dividen spesial BUMN: angka & timing", body:"Penjelasan lengkap Dividen spesial BUMN: angka & timing: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Privatisasi & IPO BUMN baru", body:"Penjelasan lengkap Privatisasi & IPO BUMN baru: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"BUMN holding: MIND ID, Aviasi, Pangan", body:"Penjelasan lengkap BUMN holding: MIND ID, Aviasi, Pangan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara bedakan BUMN value vs value trap", body:"Penjelasan lengkap Cara bedakan BUMN value vs value trap: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  ban1: {
    image: null,
    lessons: [
      { title:"Siapa sebenarnya 'bandar' di BEI?", body:"Penjelasan lengkap Siapa sebenarnya 'bandar' di BEI?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Institusi besar: reksa dana, asing, asuransi", body:"Penjelasan lengkap Institusi besar: reksa dana, asing, asuransi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara bandar akumulasi tanpa ketahuan", body:"Penjelasan lengkap Cara bandar akumulasi tanpa ketahuan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Gunakan crossing & negotiated deal", body:"Penjelasan lengkap Gunakan crossing & negotiated deal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Manipulasi volume: wash trading patterns", body:"Penjelasan lengkap Manipulasi volume: wash trading patterns: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara retail ikut pergerakan smart money", body:"Penjelasan lengkap Cara retail ikut pergerakan smart money: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  ban2: {
    image: null,
    lessons: [
      { title:"Cara akses broker summary di RTI/Stockbit", body:"Penjelasan lengkap Cara akses broker summary di RTI/Stockbit: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Interpretasi top 5 broker beli vs jual", body:"Penjelasan lengkap Interpretasi top 5 broker beli vs jual: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Konsistensi akumulasi broker spesifik", body:"Penjelasan lengkap Konsistensi akumulasi broker spesifik: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Net broker: deteksi arah pergerakan besar", body:"Penjelasan lengkap Net broker: deteksi arah pergerakan besar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Contoh kasus: deteksi akumulasi MDKA sebelum +300%", body:"Penjelasan lengkap Contoh kasus: deteksi akumulasi MDKA sebelum +300%: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"False signal broker summary: cara menghindari", body:"Penjelasan lengkap False signal broker summary: cara menghindari: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  ban3: {
    image: null,
    lessons: [
      { title:"Level 2 data: bid, ask, size", body:"Penjelasan lengkap Level 2 data: bid, ask, size: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Fake wall: dinding semu untuk arahkan retail", body:"Penjelasan lengkap Fake wall: dinding semu untuk arahkan retail: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Iceberg order: order tersembunyi", body:"Penjelasan lengkap Iceberg order: order tersembunyi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Spoofing: memasang & tarik order cepat", body:"Penjelasan lengkap Spoofing: memasang & tarik order cepat: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara bedakan genuine buy wall vs manipulasi", body:"Penjelasan lengkap Cara bedakan genuine buy wall vs manipulasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Live tape reading practice dengan data riil", body:"Penjelasan lengkap Live tape reading practice dengan data riil: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  ban4: {
    image: null,
    lessons: [
      { title:"Quiet accumulation: saham 'tidur' lama di base", body:"Penjelasan lengkap Quiet accumulation: saham 'tidur' lama di base: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Mini breakout: konfirmasi bandar selesai akumulasi", body:"Penjelasan lengkap Mini breakout: konfirmasi bandar selesai akumulasi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Entry teknik: buy on first pullback setelah breakout", body:"Penjelasan lengkap Entry teknik: buy on first pullback setelah breakout: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Posisi sizing saat conviction tinggi", body:"Penjelasan lengkap Posisi sizing saat conviction tinggi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Hold vs take profit sebagian: cara buat keputusan", body:"Penjelasan lengkap Hold vs take profit sebagian: cara buat keputusan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Exit saat distribusi mulai terdeteksi", body:"Penjelasan lengkap Exit saat distribusi mulai terdeteksi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  bag1: {
    image: null,
    lessons: [
      { title:"Definisi multi-bagger & historical examples BEI", body:"Penjelasan lengkap Definisi multi-bagger & historical examples BEI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"5 kriteria utama multi-bagger", body:"Penjelasan lengkap 5 kriteria utama multi-bagger: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"TAM (Total Addressable Market) analysis", body:"Penjelasan lengkap TAM (Total Addressable Market) analysis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Founder-led company advantage", body:"Penjelasan lengkap Founder-led company advantage: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Kapan masuk: early stage vs momentum", body:"Penjelasan lengkap Kapan masuk: early stage vs momentum: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Hold melalui drawdown 30-50%: cara psikologis", body:"Penjelasan lengkap Hold melalui drawdown 30-50%: cara psikologis: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  bag2: {
    image: null,
    lessons: [
      { title:"Industry lifecycle: introduction, growth, maturity", body:"Penjelasan lengkap Industry lifecycle: introduction, growth, maturity: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Penetrasi pasar: TAM vs SAM vs SOM", body:"Penjelasan lengkap Penetrasi pasar: TAM vs SAM vs SOM: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Tailwind makro jangka panjang", body:"Penjelasan lengkap Tailwind makro jangka panjang: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor yang menghasilkan bagger BEI 2018-2024", body:"Penjelasan lengkap Sektor yang menghasilkan bagger BEI 2018-2024: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sektor potensial bagger 2025-2030", body:"Penjelasan lengkap Sektor potensial bagger 2025-2030: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Early mover advantage: masuk sebelum ramai", body:"Penjelasan lengkap Early mover advantage: masuk sebelum ramai: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  bag3: {
    image: null,
    lessons: [
      { title:"Competitive landscape mapping", body:"Penjelasan lengkap Competitive landscape mapping: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Analisis Google Trends untuk demand proxy", body:"Penjelasan lengkap Analisis Google Trends untuk demand proxy: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Review di e-commerce & app store sebagai data point", body:"Penjelasan lengkap Review di e-commerce & app store sebagai data point: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Channel check: distributor, customer interview", body:"Penjelasan lengkap Channel check: distributor, customer interview: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Inside ownership: direksi beli sahamnya sendiri?", body:"Penjelasan lengkap Inside ownership: direksi beli sahamnya sendiri?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Validasi tesis investasi dengan multiple data points", body:"Penjelasan lengkap Validasi tesis investasi dengan multiple data points: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  bag4: {
    image: null,
    lessons: [
      { title:"Alokasi sizing untuk high-conviction bagger pick", body:"Penjelasan lengkap Alokasi sizing untuk high-conviction bagger pick: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Concentration: berapa persen maksimal satu saham?", body:"Penjelasan lengkap Concentration: berapa persen maksimal satu saham?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara average up saat bagger terus naik", body:"Penjelasan lengkap Cara average up saat bagger terus naik: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Partial profit taking: sell 20-50% di target awal", body:"Penjelasan lengkap Partial profit taking: sell 20-50% di target awal: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Bagger yang sudah run: hold atau switch?", body:"Penjelasan lengkap Bagger yang sudah run: hold atau switch?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Tax consideration saat harvest bagger", body:"Penjelasan lengkap Tax consideration saat harvest bagger: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  mv1: {
    image: null,
    lessons: [
      { title:"Supply & demand: dasar pergerakan harga", body:"Penjelasan lengkap Supply & demand: dasar pergerakan harga: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Siapa yang menggerakkan harga?", body:"Penjelasan lengkap Siapa yang menggerakkan harga?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Harga vs nilai: perbedaan krusial", body:"Penjelasan lengkap Harga vs nilai: perbedaan krusial: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Volatilitas: teman atau musuh trader?", body:"Penjelasan lengkap Volatilitas: teman atau musuh trader?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Mean reversion & momentum: dua kekuatan", body:"Penjelasan lengkap Mean reversion & momentum: dua kekuatan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara baca pergerakan harga dengan tenang", body:"Penjelasan lengkap Cara baca pergerakan harga dengan tenang: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  mv2: {
    image: null,
    lessons: [
      { title:"HH & HL: struktur uptrend", body:"Penjelasan lengkap HH & HL: struktur uptrend: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"LH & LL: struktur downtrend", body:"Penjelasan lengkap LH & LL: struktur downtrend: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pullback sehat: 38-50% Fibo", body:"Penjelasan lengkap Pullback sehat: 38-50% Fibo: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Koreksi vs reversal: cara bedakan", body:"Penjelasan lengkap Koreksi vs reversal: cara bedakan: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Trend change confirmation: dua kriteria wajib", body:"Penjelasan lengkap Trend change confirmation: dua kriteria wajib: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Trading dengan trend vs counter-trend: mana lebih profitable?", body:"Penjelasan lengkap Trading dengan trend vs counter-trend: mana lebih profitable?: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  mv3: {
    image: null,
    lessons: [
      { title:"Identifikasi range-bound market", body:"Penjelasan lengkap Identifikasi range-bound market: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Range trading: buy support, sell resistance", body:"Penjelasan lengkap Range trading: buy support, sell resistance: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"False breakout di pasar sideways", body:"Penjelasan lengkap False breakout di pasar sideways: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Bollinger Bands squeeze: breakout imminent", body:"Penjelasan lengkap Bollinger Bands squeeze: breakout imminent: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Persiapan untuk breakout: watchlist criteria", body:"Penjelasan lengkap Persiapan untuk breakout: watchlist criteria: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Sejarah konsolidasi panjang sebelum big move di BEI", body:"Penjelasan lengkap Sejarah konsolidasi panjang sebelum big move di BEI: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  mv4: {
    image: null,
    lessons: [
      { title:"Price action trading: filosofi dasar", body:"Penjelasan lengkap Price action trading: filosofi dasar: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Pin bar: penolakan harga yang powerful", body:"Penjelasan lengkap Pin bar: penolakan harga yang powerful: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Inside bar: konsolidasi sebelum breakout", body:"Penjelasan lengkap Inside bar: konsolidasi sebelum breakout: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Outside bar: engulfing yang kuat", body:"Penjelasan lengkap Outside bar: engulfing yang kuat: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara baca sinyal strength & weakness", body:"Penjelasan lengkap Cara baca sinyal strength & weakness: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Entry & SL berbasis price action murni", body:"Penjelasan lengkap Entry & SL berbasis price action murni: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  },
  mv5: {
    image: null,
    lessons: [
      { title:"Liquidity pools: di mana stop loss retail terkumpul", body:"Penjelasan lengkap Liquidity pools: di mana stop loss retail terkumpul: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Stop hunt: cara kerja & pola umum", body:"Penjelasan lengkap Stop hunt: cara kerja & pola umum: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara baca stop hunt candle di chart", body:"Penjelasan lengkap Cara baca stop hunt candle di chart: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Entry after stop hunt: teknik presisi tinggi", body:"Penjelasan lengkap Entry after stop hunt: teknik presisi tinggi: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Avoid placing SL di level obvious", body:"Penjelasan lengkap Avoid placing SL di level obvious: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." },
      { title:"Cara bangun sistem anti stop-hunt", body:"Penjelasan lengkap Cara bangun sistem anti stop-hunt: konsep ini adalah salah satu fondasi penting dalam trading dan investasi saham BEI. Pelajari, pahami, lalu praktikkan langsung di pasar. Dokumentasikan setiap trade di jurnal untuk evaluasi berkala." }
    ]
  }
};

const ALL_MODULES = [
  {id:"b1",level:0,pkgLabel:"Basic",icon:"📘",tag:"Pemula",title:"Dasar Investasi Saham",
   desc:"Modul pengantar lengkap dari nol: apa itu saham, cara kerja BEI, membuka rekening, lot & fraksi harga, dan cara melakukan transaksi pertamamu.",
   topics:["Definisi saham & instrumen pasar modal","Mekanisme kerja BEI & JATS","Cara buka rekening & pilih broker","Lot, fraksi harga, auto rejection","Jam perdagangan & sesi bursa","Cara beli saham pertamamu"]},
  {id:"b2",level:0,pkgLabel:"Basic",icon:"📊",tag:"Pemula",title:"Membaca Chart Saham",
   desc:"Belajar membaca grafik harga dari dasar: jenis chart, anatomy candlestick, pola candle penting, timeframe, dan tools gratis yang bisa langsung dipakai.",
   topics:["Jenis chart: line, bar, candlestick","Anatomy candle: OHLC","Bullish vs bearish candle","Pola candle: hammer, engulfing, doji","Timeframe: daily, weekly, monthly","Tools gratis: TradingView, RTI Business"]},
  {id:"b3",level:0,pkgLabel:"Basic",icon:"💰",tag:"Pemula",title:"Manajemen Modal Pemula",
   desc:"Cara mengatur modal agar tidak habis sebelum belajar: aturan 1-2%, diversifikasi, 3 layer portofolio, dan cara hitung profit/loss secara akurat.",
   topics:["Modal ideal untuk pemula","Aturan 1%-2% risk per trade","Diversifikasi portofolio sederhana","3 layer: core, growth, speculative","Jangan pakai uang darurat","Menghitung profit & loss net setelah biaya"]},
  {id:"b4",level:0,pkgLabel:"Basic",icon:"📰",tag:"Pemula",title:"Membaca Berita & Sentimen Pasar",
   desc:"Cara membaca berita ekonomi efektif, sumber terpercaya, pengaruh BI Rate & data makro, membaca keterbukaan informasi IDX, dan cara tidak panik saat koreksi.",
   topics:["Sumber berita terpercaya untuk investor","Pengaruh BI Rate terhadap saham","Dampak data inflasi & GDP","Membaca keterbukaan informasi IDX","Pengaruh sentimen global (Fed, DXY)","Cara tidak panik saat market turun"]},
  {id:"s1",level:1,pkgLabel:"Silver",icon:"🔍",tag:"Fundamental",title:"Analisis Fundamental: Laporan Keuangan",
   desc:"Cara membaca 3 laporan keuangan utama: laba rugi, neraca, arus kas. Identifikasi perusahaan sehat vs bermasalah dari angka-angka kuncinya.",
   topics:["Laporan laba rugi: revenue, EBITDA, net profit","Neraca: aset, liabilitas, ekuitas","Laporan arus kas: operating, investing, financing","Red flags perusahaan bermasalah","Download & baca laporan keuangan IDX","Perbandingan antar kuartal (QoQ, YoY)"]},
  {id:"s2",level:1,pkgLabel:"Silver",icon:"📐",tag:"Fundamental",title:"Rasio Keuangan & Valuasi Saham",
   desc:"Cara menilai saham murah atau mahal dengan PER, PBV, ROE, DER, dividend yield — lengkap dengan cara hitung valuasi sederhana yang bisa langsung dipraktikkan.",
   topics:["Price to Earnings Ratio (PER)","Price to Book Value (PBV)","Return on Equity (ROE) & ROA","Debt to Equity Ratio (DER)","Cara hitung valuasi sederhana","Perbandingan antar emiten sejenis"]},
  {id:"s3",level:1,pkgLabel:"Silver",icon:"🔭",tag:"Fundamental",title:"Screening Saham Berpotensi Bagger",
   desc:"Metode sistematis menemukan saham multi-bagger: kriteria growth + value, cara screening di Stockbit/RTI, competitive moat, low float, dan sektor growth cycle terkini.",
   topics:["Kriteria saham multi-bagger","Cara screening Stockbit & RTI","Revenue growth & margin expansion","Competitive moat emiten BEI","Low float & insider ownership","Sektor dalam growth cycle 2024-2026"]},
  {id:"s4",level:1,pkgLabel:"Silver",icon:"⚖️",tag:"Manajemen Risiko",title:"Risk & Money Management Lanjutan",
   desc:"Position sizing, cut loss yang tepat, averaging down yang benar, trading journal untuk evaluasi, dan target return realistis yang bisa dijadikan benchmark.",
   topics:["Position sizing yang benar","Cut loss: aturan dan cara eksekusi","Averaging down: kapan boleh, kapan bahaya","Trading journal untuk evaluasi","Rekap kinerja bulanan","Target return realistis per tahun"]},
  {id:"g1",level:2,pkgLabel:"Gold",icon:"📈",tag:"Teknikal",title:"Analisis Teknikal Mendalam",
   desc:"Support & resistance, trend analysis, chart pattern reversal (H&S, double top/bottom), continuation pattern (flag, pennant), dan moving average sebagai support dinamis.",
   topics:["Support & resistance: cara menentukan level","Trend: uptrend, downtrend, sideways","Pattern reversal: H&S, double top/bottom","Pattern continuation: flag, pennant, triangle","Moving Average: SMA, EMA golden cross","Entry & SL untuk setiap pattern"]},
  {id:"g2",level:2,pkgLabel:"Gold",icon:"📡",tag:"Teknikal",title:"Indikator Teknikal & Oscillator",
   desc:"RSI divergence, MACD crossover, Bollinger Bands squeeze, volume analysis, dan cara kombinasi 3 indikator efektif tanpa overanalyzing.",
   topics:["RSI: overbought, oversold, divergence","MACD: signal line & histogram","Bollinger Bands: squeeze & expansion","Volume analysis: OBV & volume spike","Konfluensi 3 indikator untuk entry","Cara hindari overanalyzing"]},
  {id:"g3",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Bandarmologi",title:"Bandarmologi & Tape Reading",
   desc:"Cara deteksi aksi bandar: fase akumulasi, fase distribusi, tape reading market depth real-time, dan cara hindari jebakan pump & dump.",
   topics:["Cara kerja bandar di BEI","Deteksi fase akumulasi via volume","Deteksi fase distribusi","Market depth & tape reading","Pola pump before dump","Cara masuk di fase akumulasi bukan pump"]},
  {id:"g4",level:2,pkgLabel:"Gold",icon:"🧠",tag:"Psikologi",title:"Psikologi & Emosi Trading",
   desc:"Cara kelola fear & greed, hindari FOMO & panic selling, bias kognitif yang merusak, trading journal, dan cara membangun sistem trading yang disiplin.",
   topics:["Fear & greed: kenali dan kelola","FOMO & panic selling: cara menghindari","Trading journal: catat, evaluasi, improve","Bias kognitif yang sering merugikan","Membangun sistem trading disiplin","Mindset long-term vs short-term trader"]},
  {id:"p1",level:3,pkgLabel:"Pro",icon:"🤖",tag:"AI Agent",title:"AI Agent Trading Assistant 24/7",
   desc:"AI Agent eksklusif Ritel Community — analisis saham, baca laporan keuangan, cek sentimen berita, rekomendasi entry/TP/SL, dan review portofolio kapan saja.",
   topics:["Tanya analisis saham kapan saja 24/7","Review fundamental emiten real-time","Interpretasi laporan keuangan otomatis","Rekomendasi entry berdasarkan teknikal","Sentiment analysis berita saham","Bantu susun watchlist personal"]},
  {id:"p2",level:3,pkgLabel:"Pro",icon:"👁️",tag:"Watchlist",title:"Watchlist & Screening Personal Pro",
   desc:"Watchlist mingguan dikurasi analis senior sesuai profil risikomu — saham dalam radar dengan alasan teknikal, fundamental, dan sentimen sektoral.",
   topics:["Watchlist mingguan dikurasi analis senior","Kriteria masuk & keluar watchlist","Saham di fase akumulasi yang perlu dipantau","Screening berdasarkan sector rotation","Update trigger: kapan waktu beli","Notifikasi perubahan signifikan saham pilihan"]},
  {id:"p3",level:3,pkgLabel:"Pro",icon:"📋",tag:"Laporan",title:"Laporan Mingguan Eksklusif Pro",
   desc:"Analisis IHSG mingguan mendalam, sektor outperform, top picks dan alasannya, rangkuman sentimen global, dan strategi portofolio jangka menengah.",
   topics:["Analisis IHSG mingguan mendalam","Sektor yang sedang outperform","Top picks minggu ini & alasannya","Rangkuman sentimen global","Kalender ekonomi & event penting","Strategi portofolio jangka menengah"]},
  {id:"pl1",level:4,pkgLabel:"Platinum",icon:"🎓",tag:"Konsultasi",title:"Konsultasi 1-on-1 dengan Analis Senior",
   desc:"Sesi tanya jawab langsung dengan analis berpengalaman: review portofoliomu, second opinion keputusan besar, diskusi saham spesifik, dan rencana investasi personal.",
   topics:["Review portofolio personal bersama analis","Second opinion keputusan investasi besar","Tanya saham spesifik: layak atau tidak?","Strategi rebalancing portofolio","Diskusi sektor & timing masuk optimal","Rencana investasi jangka panjang personal"]},
  {id:"pl2",level:4,pkgLabel:"Platinum",icon:"🤖",tag:"AI+",title:"AI Agent + Analisis Portofolio",
   desc:"AI Agent Pro dikombinasikan dengan analisis portofolio komprehensif: diversifikasi, exposure sektoral, estimasi return historis, dan simulasi skenario market.",
   topics:["Analisis portofolio komprehensif oleh AI","Cek diversifikasi & korelasi aset","Exposure sektoral & risiko konsentrasi","Saran rebalancing berbasis data historis","Estimasi return berdasarkan historis 10 tahun","Simulasi skenario market crash & bull run"]},
  {id:"e1",level:5,pkgLabel:"Elite",icon:"🏆",tag:"Mentoring",title:"Mentoring Langsung Intensif",
   desc:"Sesi mentoring intensif dengan mentor senior: coaching portofolio, pengembangan sistem trading personal, simulasi keputusan nyata, dan roadmap menuju financial freedom.",
   topics:["Sesi video call regular dengan mentor senior","Review & coaching portofolio intensif","Pengembangan sistem trading personal","Simulasi pengambilan keputusan nyata","Koreksi kesalahan pola investasi","Roadmap menuju financial freedom"]},
  {id:"e2",level:5,pkgLabel:"Elite",icon:"💼",tag:"Portofolio",title:"Portfolio Management Personal",
   desc:"Manajemen portofolio komprehensif: perencanaan alokasi, monitoring aktif bulanan, laporan performance personal, identifikasi drag, dan strategi exit terencana.",
   topics:["Perencanaan alokasi portofolio awal","Monitoring & rebalancing aktif bulanan","Laporan performance personal bulanan","Identifikasi drag performance & solusinya","Strategi exit & profit taking terencana","Target return & timeline finansial personal"]},

  // ===== TAMBAHAN MODUL LEVEL 0 (BASIC) =====
  {id:"b5",level:0,pkgLabel:"Basic",icon:"🕒",tag:"Pemula",title:"Jam Perdagangan & Kalender Market",
   desc:"Kapan harus pantau market, kalender ex-dividend, RUPST, dan event korporasi yang menggerakkan harga saham.",
   topics:["Sesi I & II BEI: jam & strategi","Pre-opening & closing auction","Kalender ex-dividend emiten","RUPST & pengaruhnya terhadap harga","Event korporasi: rights issue, buyback, stock split","Libur bursa & pengaruh ke portofolio"]},
  {id:"b6",level:0,pkgLabel:"Basic",icon:"🏦",tag:"Pemula",title:"Jenis Instrumen Investasi di BEI",
   desc:"Perbedaan saham, obligasi, reksa dana, ETF, dan waran — karakteristik, risiko, dan imbal hasil masing-masing instrumen.",
   topics:["Saham vs obligasi: perbedaan fundamental","Reksa dana saham vs reksa dana campuran","ETF IDX30 & EIDO: cara beli","Waran: leverage instrument berisiko tinggi","Rights issue: dilusi & peluang","Pilih instrumen sesuai profil risiko"]},
  {id:"b7",level:0,pkgLabel:"Basic",icon:"📑",tag:"Pemula",title:"Memahami Market Cap & Sektor Saham",
   desc:"Klasifikasi saham berdasarkan market cap (big cap, mid cap, small cap) dan 11 sektor IDX — karakteristik, volatilitas, dan strategi per sektor.",
   topics:["Big cap, mid cap, small cap: definisi","11 sektor saham di BEI","Sektor defensif vs siklus","Saham LQ45 & IDX30: kriteria","Sektor rotation: kapan masuk & keluar","Pengaruh sektor terhadap diversifikasi"]},
  {id:"b8",level:0,pkgLabel:"Basic",icon:"🌍",tag:"Pemula",title:"Pengaruh Global terhadap IHSG",
   desc:"Hubungan IHSG dengan S&P 500, Dow Jones, Hang Seng, harga komoditas, dan pergerakan rupiah/dolar — serta cara manfaatkan informasi ini.",
   topics:["Korelasi IHSG dengan bursa global","Dampak Fed rate terhadap IHSG","DXY Index: pengaruh ke pasar emerging","Harga komoditas: CPO, nikel, batu bara","Rupiah vs dolar: dampak ke emiten","Cara gunakan sentimen global untuk entry"]},
  // ===== TAMBAHAN MODUL LEVEL 1 (SILVER) =====
  {id:"s5",level:1,pkgLabel:"Silver",icon:"📊",tag:"Teknikal",title:"Volume Analysis & Confirmation",
   desc:"Volume adalah konfirmasi terkuat dari pergerakan harga. Pelajari cara baca volume spike, OBV, volume divergence, dan pola volume di titik reversal kunci.",
   topics:["Volume sebagai konfirmasi trend","Volume spike: sinyal kuat atau fake-out?","On Balance Volume (OBV) indicator","Volume divergence: waspada reversal","High volume di support = accumulation","Low volume di resistance = weakness"]},
  {id:"s6",level:1,pkgLabel:"Silver",icon:"🧮",tag:"Fundamental",title:"Analisis Dividen & Dividend Yield",
   desc:"Strategi dividend investing: cara hitung dividend yield, payout ratio, jadwal ex-date, saham dividen konsisten BEI, dan dividend trap yang harus dihindari.",
   topics:["Cara hitung dividend yield","Payout ratio & sustainability dividen","Jadwal: cum date, ex date, payment date","Saham dividen konsisten: BBCA, TLKM, UNVR","Dividend trap: yield tinggi tapi fundamental buruk","Reinvestment dividen untuk compounding"]},
  {id:"s7",level:1,pkgLabel:"Silver",icon:"🏭",tag:"Fundamental",title:"Analisis Sektoral & Industry Comparison",
   desc:"Cara membandingkan emiten dalam satu sektor: peer comparison, competitive positioning, market share, dan identifikasi pemimpin sektor.",
   topics:["Peer comparison dalam satu sektor","Market share & competitive position","Gross margin comparison antar emiten","Identifikasi pemimpin sektor (market leader)","Saham second liner yang mengejar","Kapan second liner outperform leader?"]},
  {id:"s8",level:1,pkgLabel:"Silver",icon:"📉",tag:"Manajemen Risiko",title:"Memahami Drawdown & Recovery",
   desc:"Apa itu drawdown, cara hitung max drawdown portofolio, strategi recovery, dan kapan harus stop trading untuk evaluasi ulang.",
   topics:["Apa itu drawdown dan max drawdown","Cara hitung drawdown portofolio","Drawdown vs volatilitas: perbedaan penting","Strategi recovery yang terstruktur","Kapan harus stop trading (circuit breaker)","Evaluasi penyebab drawdown sistematis"]},
  // ===== TAMBAHAN MODUL LEVEL 2 (GOLD) =====
  {id:"g5",level:2,pkgLabel:"Gold",icon:"🕯️",tag:"Teknikal",title:"Candlestick Pattern Lanjutan",
   desc:"Pattern multi-candle paling powerful: Three White Soldiers, Three Black Crows, Morning/Evening Star, Three Inside Up/Down, Harami, dan cara validasi dengan volume.",
   topics:["Three White Soldiers & Three Black Crows","Morning Star & Evening Star","Three Inside Up/Down","Harami & Harami Cross","Abandoned Baby: reversal ekstrem","Validasi semua pattern dengan volume spike"]},
  {id:"g6",level:2,pkgLabel:"Gold",icon:"📐",tag:"Teknikal",title:"Fibonacci & Level Retracement",
   desc:"Fibonacci retracement dan extension — cara menentukan level 38.2%, 50%, 61.8% sebagai target entry, TP, dan SL dengan contoh nyata saham BEI.",
   topics:["Fibonacci retracement: cara gambar","Level kunci: 38.2%, 50%, 61.8%","Golden zone: area entry terbaik","Fibonacci extension: proyeksi target","Kombinasi Fibo dengan support/resistance","Contoh penerapan di BBCA, TLKM, MDKA"]},
  {id:"g7",level:2,pkgLabel:"Gold",icon:"〰️",tag:"Teknikal",title:"Elliot Wave Theory Dasar",
   desc:"Prinsip dasar Elliot Wave: 5 wave impulse + 3 wave corrective, cara identifikasi posisi wave saat ini, dan cara pakai untuk menentukan target harga.",
   topics:["5 wave impulse: motive wave","3 wave corrective: A-B-C","Aturan dasar Elliot Wave (tidak boleh dilanggar)","Cara identifikasi wave di chart riil","Wave 3: terpanjang dan terkuat","Gunakan Elliot Wave untuk proyeksi target"]},
  {id:"g8",level:2,pkgLabel:"Gold",icon:"⚡",tag:"Teknikal",title:"Strategi Breakout & Breakdown",
   desc:"Cara trading breakout yang benar: identifikasi konsolidasi, false breakout vs valid breakout, teknik entry, SL optimal, dan cara menghindari jebakan breakout palsu.",
   topics:["Identifikasi fase konsolidasi (base)","Valid breakout: kriteria volume & closing","False breakout: tanda & cara hindari","Entry teknik: buy on breakout vs buy on retest","Stop loss optimal untuk strategi breakout","Breakout dari all-time high: target harga"]},
  {id:"g9",level:2,pkgLabel:"Gold",icon:"🌊",tag:"Teknikal",title:"Ichimoku Cloud untuk Swing Trading",
   desc:"Ichimoku Kinko Hyo — sistem lengkap dalam satu indikator: Tenkan, Kijun, Chikou Span, Kumo Cloud, dan cara baca sinyal beli/jual yang kuat.",
   topics:["5 komponen Ichimoku: fungsi masing-masing","Kumo Cloud: support & resistance dinamis","Sinyal beli: TK cross di atas cloud","Sinyal jual: TK cross di bawah cloud","Chikou Span sebagai konfirmator","Twist sinyal dan setup terbaik untuk swing"]},
  {id:"g10",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Teknikal",title:"Intraday Trading & Tape Reading",
   desc:"Dasar-dasar trading intraday BEI: cara baca order book (bid/ask), identifikasi bandar di tape reading, strategi scalping yang aman, dan manajemen posisi intraday.",
   topics:["Order book: cara baca bid & ask","Tape reading: deteksi order besar","Big buyer vs big seller di market depth","Strategi scalping 1-2% per hari","Entry time optimal: awal sesi & pre-close","Cut loss disiplin untuk intraday trader"]},
  {id:"g11",level:2,pkgLabel:"Gold",icon:"🔄",tag:"Teknikal",title:"Sector Rotation Strategy",
   desc:"Strategi perpindahan dana antar sektor mengikuti siklus ekonomi — identifikasi sektor yang akan outperform berikutnya dan cara masuk sebelum institusi besar.",
   topics:["Siklus ekonomi & sector rotation model","Sektor defensif: konsumer, kesehatan, utilitas","Sektor siklus: teknologi, properti, komoditas","Early cycle vs late cycle indicators","Flow asing sebagai petunjuk sector rotation","Cara screening saham di sektor yang mulai naik"]},
  // ===== TAMBAHAN MODUL LEVEL 3 (PRO) =====
  {id:"p4",level:3,pkgLabel:"Pro",icon:"🔭",tag:"Bandarmologi",title:"Bandarmologi Lanjutan: Smart Money Flow",
   desc:"Teknik canggih deteksi smart money: analisis broker summary, distribusi kepemilikan, unusual volume di off-market, dan pola pre-market accumulation.",
   topics:["Cara baca broker summary BEI","Net foreign buy/sell: cara interpretasi","Distribusi kepemilikan: laporan bulanan IDX","Unusual volume off-market hours","Crossing saham: sinyal accumulation bandar","Pre-IPO accumulation pattern"]},
  {id:"p5",level:3,pkgLabel:"Pro",icon:"📊",tag:"Teknikal",title:"Advanced Chart Pattern: Wyckoff Method",
   desc:"Metode Wyckoff untuk identifikasi siklus lengkap akumulasi dan distribusi — spring, last point of support (LPS), sign of strength, dan cara timing entry yang presisi.",
   topics:["Fase Wyckoff: Accumulation, Markup, Distribution, Markdown","Spring & upthrust: sinyal reversal Wyckoff","Last Point of Support (LPS) sebagai entry ideal","Sign of Strength (SOS) konfirmasi breakout","Sign of Weakness (SOW) untuk exit","Menerapkan Wyckoff di saham BEI"]},
  {id:"p6",level:3,pkgLabel:"Pro",icon:"🧠",tag:"Psikologi",title:"Trading Psychology Advanced",
   desc:"Psikologi trading tingkat lanjut: bias konfirmasi, anchoring bias, disposition effect, overconfidence trap, dan cara membangun sistem keputusan berbasis aturan.",
   topics:["Confirmation bias: musuh terbesarmu","Anchoring bias: perangkap harga beli lama","Disposition effect: hold loser, sell winner","Overconfidence setelah winning streak","Sistem keputusan berbasis aturan (rule-based)","Pre-trade checklist untuk keputusan objektif"]},
  {id:"p7",level:3,pkgLabel:"Pro",icon:"📈",tag:"Laporan",title:"Analisis Laporan Tahunan (Annual Report)",
   desc:"Cara ekstrak insight berharga dari annual report: management discussion, strategi ekspansi, segmen bisnis, related party transaction, dan sinyal perubahan arah bisnis.",
   topics:["Bagian terpenting annual report","Management Discussion & Analysis (MD&A)","Strategi ekspansi & capex plan","Segmen bisnis: mana yang paling profitable","Related party transaction: waspada conflict of interest","Letter to shareholders: baca antara baris"]},
  {id:"p8",level:3,pkgLabel:"Pro",icon:"🌐",tag:"Makro",title:"Analisis Makroekonomi untuk Investor",
   desc:"Cara mengintegrasikan data makro ke keputusan investasi: siklus kredit, yield curve, PMI, CPI, dan leading indicator yang mendahului pergerakan IHSG.",
   topics:["Siklus kredit & pengaruh ke saham","Yield curve inversion: sinyal resesi","PMI manufaktur sebagai leading indicator","CPI & PPI: pengaruh ke margin emiten","Current account & neraca perdagangan","Cara buat macro playbook personal"]},
  // ===== TAMBAHAN MODUL LEVEL 4 (PLATINUM) =====
  {id:"pl3",level:4,pkgLabel:"Platinum",icon:"💡",tag:"Teknikal",title:"Intermarket Analysis",
   desc:"Hubungan antar pasar: obligasi vs saham, dolar vs komoditas, oil vs saham energi, emas vs risk-off sentiment, dan cara manfaatkan korelasi ini untuk timing.",
   topics:["Saham vs obligasi: inverse relationship","DXY vs saham emerging market","Oil price vs saham energi & transportasi","Emas sebagai risk-off barometer","CRB Index & saham komoditas IDX","Intermarket matrix untuk timing masuk"]},
  {id:"pl4",level:4,pkgLabel:"Platinum",icon:"⚙️",tag:"Fundamental",title:"Analisis Arus Kas Lanjutan & DCF",
   desc:"Discounted Cash Flow (DCF) valuation dari nol: cara proyeksi FCF, WACC, terminal value, dan cara pakai DCF untuk cari saham undervalue di BEI.",
   topics:["Free Cash Flow (FCF): cara hitung","Proyeksi FCF 5 tahun ke depan","WACC: cost of capital","Terminal value: metode Gordon Growth","Sensitivity analysis DCF","Contoh DCF: BBCA, ASII, TLKM"]},
  {id:"pl5",level:4,pkgLabel:"Platinum",icon:"🏗️",tag:"Fundamental",title:"Special Situations: IPO, Rights Issue & Akuisisi",
   desc:"Cara analisis dan trading special situations: IPO hunting, rights issue arbitrage, akuisisi target, buyback play, dan mandatory tender offer (MTO).",
   topics:["IPO analysis: cara nilai sebelum listing","Rights issue: dilusi atau peluang?","Akuisisi target: ciri-ciri dan cara deteksi","Buyback: sinyal manajemen percaya diri","MTO & delisting: strategi exit","Privatisasi BUMN: sejarah & pola"]},
  {id:"pl6",level:4,pkgLabel:"Platinum",icon:"🌏",tag:"Makro",title:"Global Macro & Geopolitical Risk",
   desc:"Dampak konflik geopolitik, kebijakan Fed dan ECB, trade war, dan sanksi ekonomi terhadap pasar saham Indonesia — serta cara positioning portofolio di tengah ketidakpastian global.",
   topics:["Dampak perang & konflik terhadap IHSG","Kebijakan Fed tapering & rate hike","Trade war: dampak ke emiten ekspor","Supply chain disruption: sektor paling terdampak","Flight to quality: kapan terjadi & cara antisipasi","Hedging sederhana di portofolio retail"]},
  // ===== TAMBAHAN MODUL LEVEL 5 (ELITE) =====
  {id:"e3",level:5,pkgLabel:"Elite",icon:"🚀",tag:"Strategi",title:"Membangun Sistem Trading Mechanical",
   desc:"Desain sistem trading yang objektif, backtest-able, dan konsisten: parameter entry/exit, filter trend, manajemen posisi adaptif, dan cara evaluasi edge statistik.",
   topics:["Definisi edge statistik dalam trading","Parameter entry: konkret dan terukur","Filter trend: avoid trading counter-trend","Posisi sizing adaptif berdasarkan volatilitas","Backtest manual dengan historical data","Evaluasi sistem: win rate, RR ratio, expectancy"]},
  {id:"e4",level:5,pkgLabel:"Elite",icon:"📚",tag:"Strategi",title:"Value Investing ala Warren Buffett",
   desc:"Prinsip value investing: circle of competence, moat analysis, intrinsic value, margin of safety, dan cara cari saham 'Buffett-style' di pasar modal Indonesia.",
   topics:["Circle of competence: investasi apa yang kamu mengerti","Economic moat: 5 tipe keunggulan kompetitif","Intrinsic value: cara sederhana menghitung","Margin of safety: beli di bawah nilai wajar","Konsentrasi vs diversifikasi: Buffett approach","Saham BEI dengan karakter Buffettian"]},
  {id:"e5",level:5,pkgLabel:"Elite",icon:"🎭",tag:"Psikologi",title:"Anti-Fragility dalam Investing",
   desc:"Prinsip Anti-Fragility ala Nassim Taleb untuk investor: cara bangun portofolio yang tumbuh lebih kuat di tengah volatilitas, black swan preparation, dan barbell strategy.",
   topics:["Fragile vs robust vs anti-fragile","Black Swan: skenario ekstrem yang mungkin","Barbell strategy: safe + speculative","Optionality: beli peluang, bukan kepastian","Positioning saat IHSG koreksi 30-40%","Recovery playbook setelah market crash"]},
  {id:"e6",level:5,pkgLabel:"Elite",icon:"🏛️",tag:"Fundamental",title:"Analisis BUMN & Emiten Pemerintah",
   desc:"Nuansa khusus analisis emiten BUMN: pengaruh kebijakan pemerintah, dividen spesial atas permintaan negara, privatisasi, dan cara bedakan BUMN yang sehat vs yang hanya dieksploitasi.",
   topics:["Karakteristik unik BUMN vs swasta","Kebijakan pemerintah sebagai driver harga","Dividen spesial BUMN: angka & timing","Privatisasi & IPO BUMN baru","BUMN holding: MIND ID, Aviasi, Pangan","Cara bedakan BUMN value vs value trap"]},
  // ===== MODUL EXTRA DETAIL BANDARMOLOGI =====
  {id:"ban1",level:2,pkgLabel:"Gold",icon:"🕵️",tag:"Bandarmologi",title:"Panduan Lengkap: Cara Kerja Bandar",
   desc:"Penjelasan menyeluruh tentang siapa bandar sebenarnya, bagaimana mereka beroperasi di BEI, alat yang mereka gunakan, dan cara retail investor mengikuti jejak mereka.",
   topics:["Siapa sebenarnya 'bandar' di BEI?","Institusi besar: reksa dana, asing, asuransi","Cara bandar akumulasi tanpa ketahuan","Gunakan crossing & negotiated deal","Manipulasi volume: wash trading patterns","Cara retail ikut pergerakan smart money"]},
  {id:"ban2",level:2,pkgLabel:"Gold",icon:"🔬",tag:"Bandarmologi",title:"Deteksi Akumulasi Bandar via Broker Summary",
   desc:"Cara membaca broker summary BEI untuk deteksi siapa yang accumulate dan siapa yang distribute — dilengkapi contoh saham real yang berhasil dideteksi sebelum naik.",
   topics:["Cara akses broker summary di RTI/Stockbit","Interpretasi top 5 broker beli vs jual","Konsistensi akumulasi broker spesifik","Net broker: deteksi arah pergerakan besar","Contoh kasus: deteksi akumulasi MDKA sebelum +300%","False signal broker summary: cara menghindari"]},
  {id:"ban3",level:2,pkgLabel:"Gold",icon:"📡",tag:"Bandarmologi",title:"Market Depth & Level 2 Data",
   desc:"Cara membaca order book level 2, identifikasi dinding beli/jual buatan bandar, cara baca unusual bid/ask, dan perbedaan genuine order vs order manipulation.",
   topics:["Level 2 data: bid, ask, size","Fake wall: dinding semu untuk arahkan retail","Iceberg order: order tersembunyi","Spoofing: memasang & tarik order cepat","Cara bedakan genuine buy wall vs manipulasi","Live tape reading practice dengan data riil"]},
  {id:"ban4",level:3,pkgLabel:"Pro",icon:"🎯",tag:"Bandarmologi",title:"Timing Entry Mengikuti Bandar",
   desc:"Teknik presisi entry mengikuti jejak bandar: identifikasi quiet accumulation period, entry pada retrace pertama setelah mini breakout, dan cara kelola posisi hingga target.",
   topics:["Quiet accumulation: saham 'tidur' lama di base","Mini breakout: konfirmasi bandar selesai akumulasi","Entry teknik: buy on first pullback setelah breakout","Posisi sizing saat conviction tinggi","Hold vs take profit sebagian: cara buat keputusan","Exit saat distribusi mulai terdeteksi"]},
  // ===== MODUL EXTRA DETAIL MULTI-BAGGER =====
  {id:"bag1",level:1,pkgLabel:"Silver",icon:"💎",tag:"Fundamental",title:"Panduan Detail: Menemukan Multi-Bagger",
   desc:"Framework sistematis untuk menemukan saham 5x-10x lipat: dari kriteria awal, due diligence mendalam, timing masuk, hingga cara hold melalui volatilitas.",
   topics:["Definisi multi-bagger & historical examples BEI","5 kriteria utama multi-bagger","TAM (Total Addressable Market) analysis","Founder-led company advantage","Kapan masuk: early stage vs momentum","Hold melalui drawdown 30-50%: cara psikologis"]},
  {id:"bag2",level:1,pkgLabel:"Silver",icon:"🌱",tag:"Fundamental",title:"Identifikasi Sektor Multi-Bagger Berikutnya",
   desc:"Cara identifikasi sektor yang akan menghasilkan multi-bagger berikutnya berdasarkan analisis siklus industri, penetrasi pasar, dan tailwind makroekonomi.",
   topics:["Industry lifecycle: introduction, growth, maturity","Penetrasi pasar: TAM vs SAM vs SOM","Tailwind makro jangka panjang","Sektor yang menghasilkan bagger BEI 2018-2024","Sektor potensial bagger 2025-2030","Early mover advantage: masuk sebelum ramai"]},
  {id:"bag3",level:2,pkgLabel:"Gold",icon:"🔍",tag:"Fundamental",title:"Due Diligence Mendalam Saham Bagger",
   desc:"Cara melakukan due diligence 360°: analisis kompetitor, kunjungan virtual toko/pabrik, analisis Google Trends, scraping data alternatif, dan validasi tesis investasi.",
   topics:["Competitive landscape mapping","Analisis Google Trends untuk demand proxy","Review di e-commerce & app store sebagai data point","Channel check: distributor, customer interview","Inside ownership: direksi beli sahamnya sendiri?","Validasi tesis investasi dengan multiple data points"]},
  {id:"bag4",level:3,pkgLabel:"Pro",icon:"📈",tag:"Fundamental",title:"Portfolio Construction untuk Multi-Bagger Hunting",
   desc:"Cara membangun portofolio yang terstruktur untuk hunting bagger: alokasi sizing, concentration vs diversification, cara handle bagger yang sudah run, dan kapan harvest.",
   topics:["Alokasi sizing untuk high-conviction bagger pick","Concentration: berapa persen maksimal satu saham?","Cara average up saat bagger terus naik","Partial profit taking: sell 20-50% di target awal","Bagger yang sudah run: hold atau switch?","Tax consideration saat harvest bagger"]},
  // ===== MODUL PERGERAKAN HARGA =====
  {id:"mv1",level:0,pkgLabel:"Basic",icon:"📊",tag:"Pemula",title:"Memahami Pergerakan Harga Saham",
   desc:"Mengapa harga saham bergerak — dari supply & demand dasar hingga faktor penggerak fundamental dan teknikal, serta cara memanfaatkan pola pergerakan.",
   topics:["Supply & demand: dasar pergerakan harga","Siapa yang menggerakkan harga?","Harga vs nilai: perbedaan krusial","Volatilitas: teman atau musuh trader?","Mean reversion & momentum: dua kekuatan","Cara baca pergerakan harga dengan tenang"]},
  {id:"mv2",level:1,pkgLabel:"Silver",icon:"📉",tag:"Teknikal",title:"Pola Pergerakan dalam Trend",
   desc:"Bagaimana harga bergerak dalam trend: higher high/higher low, pullback yang sehat, koreksi vs reversal, dan cara bedakan temporary weakness dari perubahan trend sesungguhnya.",
   topics:["HH & HL: struktur uptrend","LH & LL: struktur downtrend","Pullback sehat: 38-50% Fibo","Koreksi vs reversal: cara bedakan","Trend change confirmation: dua kriteria wajib","Trading dengan trend vs counter-trend: mana lebih profitable?"]},
  {id:"mv3",level:2,pkgLabel:"Gold",icon:"🌀",tag:"Teknikal",title:"Pergerakan Harga dalam Sideways Market",
   desc:"Cara profit di pasar sideways: identifikasi range-bound market, strategi range trading, Bollinger Bands squeeze, dan cara antisipasi breakout dari konsolidasi panjang.",
   topics:["Identifikasi range-bound market","Range trading: buy support, sell resistance","False breakout di pasar sideways","Bollinger Bands squeeze: breakout imminent","Persiapan untuk breakout: watchlist criteria","Sejarah konsolidasi panjang sebelum big move di BEI"]},
  {id:"mv4",level:2,pkgLabel:"Gold",icon:"💥",tag:"Teknikal",title:"Volume Price Action: Membaca Niat Harga",
   desc:"Price action murni tanpa indikator: cara baca bar/candle secara standalone, pin bar, inside bar, outside bar, dan cara dapatkan sinyal entry berkualitas tinggi.",
   topics:["Price action trading: filosofi dasar","Pin bar: penolakan harga yang powerful","Inside bar: konsolidasi sebelum breakout","Outside bar: engulfing yang kuat","Cara baca sinyal strength & weakness","Entry & SL berbasis price action murni"]},
  {id:"mv5",level:3,pkgLabel:"Pro",icon:"🌊",tag:"Teknikal",title:"Liquidity Hunting & Stop Hunt Analysis",
   desc:"Cara market maker dan bandar 'memburu' stop loss retail sebelum bergerak ke arah sesungguhnya — dan cara repositioning entry setelah stop hunt selesai.",
   topics:["Liquidity pools: di mana stop loss retail terkumpul","Stop hunt: cara kerja & pola umum","Cara baca stop hunt candle di chart","Entry after stop hunt: teknik presisi tinggi","Avoid placing SL di level obvious","Cara bangun sistem anti stop-hunt"]},


  // ===== ORDERBOOK & TAPE READING =====
  {id:"ob1",level:0,pkgLabel:"Basic",icon:"📋",tag:"Orderbook",title:"Mengenal Orderbook Saham",
   desc:"Apa itu orderbook, cara membacanya, bid-ask spread, dan bagaimana orderbook mempengaruhi harga saham. Panduan lengkap pemula dengan contoh nyata saham BEI.",
   topics:["Definisi orderbook & market depth","Bid price vs ask price","Bid-ask spread: arti & pengaruhnya","Cara baca antrian bid & offer","Auto matching & mekanisme eksekusi","Contoh nyata: baca orderbook BBCA"]},
  {id:"ob2",level:1,pkgLabel:"Silver",icon:"📊",tag:"Orderbook",title:"Membaca Orderbook Intermediate",
   desc:"Interpretasi pola orderbook lanjutan: bid/offer tebal vs tipis, deteksi support/resistance dari orderbook, dan membaca tekanan jual vs beli secara real-time.",
   topics:["Bid tebal vs offer tebal: apa artinya","Support dari orderbook: cara identifikasi","Deteksi tekanan jual via offer besar","Hidden order & iceberg order","Perubahan orderbook real-time","Gunakan orderbook untuk entry lebih presisi"]},
  {id:"ob3",level:2,pkgLabel:"Gold",icon:"🔬",tag:"Orderbook",title:"Tape Reading Dasar: Baca Aliran Transaksi",
   desc:"Tape reading adalah seni membaca aliran transaksi real-time. Cara baca time & sales, deteksi big buyer/seller, dan pola transaksi yang mengindikasikan arah harga berikutnya.",
   topics:["Time & sales: cara baca aliran transaksi","Big lot trade: sinyal smart money","Pola transaksi: sweep vs passive","Deteksi buyer agresif vs seller agresif","Volume clustering di level harga tertentu","Praktik: tape reading BBRI & TLKM live"]},
  {id:"ob4",level:2,pkgLabel:"Gold",icon:"🎯",tag:"Orderbook",title:"Tape Reading Advanced & Market Microstructure",
   desc:"Market microstructure: how price discovery works, order flow imbalance, footprint chart, dan cara profesional gunakan tape reading untuk timing entry/exit presisi.",
   topics:["Order flow imbalance: ketidakseimbangan beli vs jual","Footprint chart: volume per level harga","Spoofing & layering: manipulasi orderbook","Cara deteksi spoofing di BEI","Delta volume: net buying vs selling pressure","Footprint chart sebagai konfirmasi entry"]},
  {id:"ob5",level:3,pkgLabel:"Pro",icon:"⚡",tag:"Orderbook",title:"Order Flow Trading Strategy",
   desc:"Strategi trading murni berbasis order flow — tanpa indikator lagging. Entry mengikuti aliran order institusional dan timing eksekusi presisi menggunakan data real-time BEI.",
   topics:["Order flow trading tanpa indikator lagging","Identifikasi institutional order flow","Entry timing via order imbalance","Build order flow dashboard manual","Strategi berbasis order flow di BEI","Risk management khusus order flow trader"]},

  // ===== ANALISIS TEKNIKAL LANJUTAN =====
  {id:"ta1",level:1,pkgLabel:"Silver",icon:"📐",tag:"Teknikal",title:"Fibonacci: Retracement & Extension",
   desc:"Fibonacci retracement & extension adalah alat wajib trader profesional. Cara menarik level yang benar, level 38.2%/50%/61.8%, dan cara gunakan untuk entry, TP, SL.",
   topics:["Apa itu Fibonacci & golden ratio","Cara tarik Fibonacci retracement yang benar","Level kunci: 38.2%, 50%, 61.8%","Fibonacci extension untuk target TP","Konfluensi Fibonacci dengan S/R","Contoh: Fibonacci di saham BMRI & ASII"]},
  {id:"ta2",level:1,pkgLabel:"Silver",icon:"🌊",tag:"Teknikal",title:"Elliott Wave Theory Dasar",
   desc:"5 impulsive waves dan 3 corrective waves. Cara identifikasi wave di chart saham BEI dan menggunakannya untuk prediksi target harga dan timing entry terbaik.",
   topics:["Struktur 5 wave impulse & 3 wave corrective","Aturan dasar Elliott Wave","Cara count wave di chart daily","Wave 3: gelombang terkuat untuk entry","Corrective wave: ABC pattern","Penerapan Elliott Wave di IHSG & big cap BEI"]},
  {id:"ta3",level:2,pkgLabel:"Gold",icon:"🕯️",tag:"Teknikal",title:"Advanced Candlestick Pattern",
   desc:"Pola candlestick kompleks yang sering luput: Three White Soldiers, Evening Star, Dark Cloud Cover, dan kombinasi pola dengan konfirmasi volume untuk sinyal akurat.",
   topics:["Three White Soldiers & Three Black Crows","Morning Star & Evening Star","Dark Cloud Cover & Piercing Pattern","Marubozu: sinyal kuat tanpa shadow","Harami & Harami Cross","Konfirmasi pola candle dengan volume"]},
  {id:"ta4",level:2,pkgLabel:"Gold",icon:"📏",tag:"Teknikal",title:"Ichimoku Cloud System Lengkap",
   desc:"Sistem Ichimoku Cloud: 5 komponen (Tenkan, Kijun, Senkou A & B, Chikou), cara baca sinyal buy/sell, dan penggunaan cloud sebagai filter trend di saham BEI.",
   topics:["5 komponen Ichimoku: fungsi masing-masing","Sinyal bullish: TK cross di atas cloud","Sinyal bearish: TK cross di bawah cloud","Kumo sebagai support/resistance dinamis","Chikou Span sebagai konfirmator","Strategi Ichimoku untuk swing trading BEI"]},
  {id:"ta5",level:2,pkgLabel:"Gold",icon:"🔄",tag:"Teknikal",title:"Divergence Mastery: RSI, MACD, OBV",
   desc:"Divergence adalah sinyal paling akurat dalam analisis teknikal. Regular divergence, hidden divergence, dan cara trade divergence dengan risk management yang tepat.",
   topics:["Regular bullish divergence: sinyal beli","Regular bearish divergence: sinyal jual","Hidden bullish divergence: lanjut naik","Hidden bearish divergence: lanjut turun","Divergence OBV: deteksi smart money diam-diam","Trade divergence dengan RRR minimal 1:2"]},
  {id:"ta6",level:3,pkgLabel:"Pro",icon:"🌐",tag:"Teknikal",title:"Multi-Timeframe Analysis (MTFA)",
   desc:"Cara menganalisis saham di multiple timeframe: monthly untuk bias besar, weekly untuk trend, daily untuk setup, H4 untuk entry. Metode top-down analysis profesional.",
   topics:["Konsep MTFA: dari besar ke kecil","Monthly & weekly: tentukan bias utama","Daily: cari setup yang valid","H4 & H1: timing entry presisi","Cara hindari konflik timeframe","Template MTFA untuk swing trading BEI"]},
  {id:"ta7",level:3,pkgLabel:"Pro",icon:"💹",tag:"Teknikal",title:"Price Action Murni tanpa Indikator",
   desc:"Trading price action murni: struktur pasar HH/LL, supply & demand zone, order blocks, dan fair value gap. Cara profesional baca pasar tanpa noise indikator.",
   topics:["Struktur pasar: HH, HL, LH, LL","Supply & demand zone yang valid","Order block: jejak institusi di chart","Fair value gap (FVG) sebagai magnet harga","Entry di supply/demand tanpa indikator","Break of structure (BOS) sebagai konfirmasi"]},
  {id:"ta8",level:3,pkgLabel:"Pro",icon:"🎯",tag:"Teknikal",title:"Smart Money Concept (SMC)",
   desc:"SMC fokus pada bagaimana institusi besar menggerakkan harga. Liquidity grab, inducement, change of character, dan cara ikuti jejak smart money di saham BEI.",
   topics:["Apa itu Smart Money Concept (SMC)","Liquidity pools: di mana retail taruh SL","Inducement: jebakan sebelum arah sebenarnya","Change of Character (CHOCH)","Penerapan SMC di chart saham BEI nyata","Build sistem trading berbasis SMC"]},
  {id:"ta9",level:4,pkgLabel:"Platinum",icon:"🏔️",tag:"Teknikal",title:"Wyckoff Method di Pasar BEI",
   desc:"4 fase Wyckoff (accumulation, markup, distribution, markdown) dan cara identifikasi di chart saham Indonesia. Metode klasik yang masih sangat relevan hingga hari ini.",
   topics:["4 fase Wyckoff lengkap","Schematic Wyckoff accumulation","Schematic Wyckoff distribution","Spring & UTAD: kejutan sebelum breakout","Last Point of Support (LPS)","Penerapan Wyckoff di big cap BEI"]},
  {id:"ta10",level:4,pkgLabel:"Platinum",icon:"📡",tag:"Teknikal",title:"Volume Profile & Market Profile",
   desc:"Volume Profile: di mana volume terbanyak terjadi — level tersebut menjadi magnet harga. Point of Control, Value Area, dan cara gunakan untuk entry presisi.",
   topics:["Volume Profile vs chart biasa","Point of Control (POC): magnet harga","Value Area High & Low (VAH & VAL)","High Volume Node vs Low Volume Node","Volume Profile untuk target TP","Market Profile: time-based vs volume-based"]},
  {id:"ta11",level:2,pkgLabel:"Gold",icon:"📉",tag:"Teknikal",title:"Support & Resistance: Level Kunci yang Benar",
   desc:"Cara menentukan S/R yang benar bukan hanya tarik garis. Dynamic S/R, static S/R, zona vs garis, role reversal, dan cara prioritaskan level S/R yang paling signifikan.",
   topics:["Perbedaan S/R statis vs dinamis","Zona S/R vs garis tipis: mana lebih akurat","Role reversal: support jadi resistance","Cara prioritaskan level S/R terkuat","Confluence S/R: level yang ditunjukkan banyak metode","Contoh S/R di saham BBCA, TLKM, ASII"]},
  {id:"ta12",level:2,pkgLabel:"Gold",icon:"🔺",tag:"Teknikal",title:"Triangle & Wedge Pattern",
   desc:"Ascending triangle, descending triangle, symmetrical triangle, rising wedge, falling wedge — cara identifikasi, entry, SL, dan target TP untuk setiap pola.",
   topics:["Ascending triangle: bias naik","Descending triangle: bias turun","Symmetrical triangle: arah ditentukan breakout","Rising wedge: sering jadi sinyal bearish","Falling wedge: setup bullish kuat","Target TP setelah breakout triangle/wedge"]},
  {id:"ta13",level:1,pkgLabel:"Silver",icon:"📈",tag:"Teknikal",title:"Trend Analysis & Trend Following",
   desc:"Cara identifikasi trend yang benar, cara konfirmasi trend, cara masuk di pullback dalam uptrend, dan cara tahu kapan trend berakhir sebelum reversal terjadi.",
   topics:["Definisi trend: HH/HL untuk uptrend","Cara konfirmasi trend dengan MA","Entry di pullback: 3 teknik terbaik","Trendline: cara buat yang valid","Cara tahu kapan trend berakhir","Trend following vs counter-trend: pilih mana?"]},

  // ===== FUNDAMENTAL LANJUTAN =====
  {id:"fa1",level:1,pkgLabel:"Silver",icon:"🏭",tag:"Fundamental",title:"Analisis Sektoral: Perbankan & Finansial",
   desc:"Cara analisis saham perbankan: NIM, NPL, BOPO, CAR, LDR. Perbedaan bank besar vs bank digital. Valuasi bank menggunakan PBV dan PER khusus sektor finansial.",
   topics:["Metrik khusus bank: NIM, NPL, BOPO","CAR & LDR: arti dan standar sehat","Perbandingan BBCA vs BBRI vs BMRI","Bank digital BEI: cara valuasi berbeda","Pengaruh BI Rate terhadap NIM bank","Kapan beli saham bank: siklus yang tepat"]},
  {id:"fa2",level:1,pkgLabel:"Silver",icon:"⛏️",tag:"Fundamental",title:"Analisis Sektoral: Tambang & Energi",
   desc:"Cara analisis emiten tambang ADRO, PTBA, INCO, ANTM. Pengaruh harga komoditas global terhadap laba. Proyeksi earning berdasarkan harga nikel, batu bara, emas.",
   topics:["Struktur bisnis emiten tambang BEI","Pengaruh harga komoditas ke revenue","Proyeksi laba berbasis harga global","Cash cost vs AISC","Siklus komoditas: bull & bear","Valuasi emiten tambang: EV/EBITDA"]},
  {id:"fa3",level:1,pkgLabel:"Silver",icon:"🏗️",tag:"Fundamental",title:"Analisis Sektoral: Properti & Konstruksi",
   desc:"Cara analisis emiten properti CTRA, BSDE, SMRA, PWON. Marketing sales, landbank, gearing ratio, dan timing entry di siklus properti yang tepat.",
   topics:["Marketing sales sebagai leading indicator","Landbank: nilai & lokasi strategis","Gearing ratio emiten properti","Pengaruh KPR rate terhadap demand","Siklus properti: cara memanfaatkan","Valuasi properti: NAV & PBV"]},
  {id:"fa4",level:2,pkgLabel:"Gold",icon:"💊",tag:"Fundamental",title:"Analisis Sektoral: Healthcare & Consumer",
   desc:"Cara analisis emiten healthcare (KLBF, MIKA, HEAL) dan consumer goods (UNVR, ICBP, INDF). Revenue defensif, margin ekspansi, dan valuasi perusahaan consumer.",
   topics:["Healthcare: revenue model & margin","KLBF vs MIKA: perbandingan mendalam","Consumer goods: moat & brand value","UNVR & ICBP: fundamental mendalam","Revenue defensif di masa resesi","DCF untuk consumer growth company"]},
  {id:"fa5",level:2,pkgLabel:"Gold",icon:"💻",tag:"Fundamental",title:"Analisis Sektoral: Teknologi & Digital",
   desc:"Cara analisis GOTO, BUKA, EMTK. GMV, take rate, burn rate, path to profitability. Valuasi startup yang belum profitable menggunakan EV/Revenue.",
   topics:["GMV, take rate, unit economics","Burn rate & runway","Path to profitability: milestone kunci","GOTO: analisis mendalam bisnis & valuasi","EV/Revenue untuk tech pre-profit","Risiko dilusi di emiten teknologi BEI"]},
  {id:"fa6",level:2,pkgLabel:"Gold",icon:"🔬",tag:"Fundamental",title:"Analisis Arus Kas (Cash Flow) Mendalam",
   desc:"Cash is king. Cara menganalisis laporan arus kas: perbedaan laba akuntansi vs kas nyata, Free Cash Flow, capex intensity, dan mendeteksi perusahaan yang manipulasi laba.",
   topics:["Operating cash flow vs net profit","Free Cash Flow (FCF) = operating CF - capex","FCF yield sebagai alternatif valuasi","Capex-heavy vs asset-light business","Deteksi manipulasi laba via cash flow","Emiten BEI dengan FCF konsisten tinggi"]},
  {id:"fa7",level:3,pkgLabel:"Pro",icon:"🧮",tag:"Fundamental",title:"Discounted Cash Flow (DCF) Valuation",
   desc:"DCF adalah metode valuasi paling powerful: nilai intrinsik saham berdasarkan projected cash flow. Asumsi, WACC, terminal value, dan sensitivity analysis.",
   topics:["Konsep time value of money","Proyeksi free cash flow 5-10 tahun","WACC: weighted average cost of capital","Terminal value: pertumbuhan jangka panjang","Margin of safety dalam DCF","Sensitivity analysis: simulasi bull/bear"]},
  {id:"fa8",level:3,pkgLabel:"Pro",icon:"🏆",tag:"Fundamental",title:"Competitive Moat Analysis",
   desc:"5 jenis economic moat Warren Buffett: network effect, switching cost, cost advantage, intangible asset, efficient scale. Cara scoring moat untuk emiten BEI.",
   topics:["5 jenis economic moat Buffett","Network effect: GOTO — seberapa kuat?","Switching cost: bank, telco","Cost advantage: skala efisien BBRI","Intangible asset: brand, lisensi, paten","Scoring moat untuk emiten BEI"]},
  {id:"fa9",level:3,pkgLabel:"Pro",icon:"📑",tag:"Fundamental",title:"Membaca Annual Report Secara Profesional",
   desc:"Annual report adalah goldmine. Cara baca MD&A, corporate governance, catatan laporan keuangan, related party transaction, dan red flags tersembunyi.",
   topics:["Struktur annual report & bagian penting","MD&A: sinyal dari manajemen","Related party transaction: konflik kepentingan","Catatan kaki laporan keuangan: hidden info","Corporate governance: GCG scoring","Red flags yang sering tersembunyi"]},
  {id:"fa10",level:4,pkgLabel:"Platinum",icon:"🌐",tag:"Fundamental",title:"Analisis Kompetitor & Industry Benchmarking",
   desc:"Cara membandingkan emiten dengan kompetitor global dan domestik. Porter's Five Forces untuk analisis struktur industri yang komprehensif.",
   topics:["Porter's Five Forces di industri BEI","Benchmarking vs kompetitor regional","Cara set watchlist sektor untuk perbandingan","Market share & revenue growth benchmarking","Competitive positioning matrix","Identifikasi pemimpin industri yang undervalued"]},
  {id:"fa11",level:2,pkgLabel:"Gold",icon:"📊",tag:"Fundamental",title:"Membandingkan ROE, ROA & ROCE",
   desc:"Return on Equity, Return on Assets, Return on Capital Employed — cara hitung, interpretasi, dan perbandingan antar emiten. Mana yang paling relevan per sektor.",
   topics:["ROE: kekuatan menghasilkan laba dari ekuitas","ROA: efisiensi penggunaan total aset","ROCE: efisiensi modal yang dipakai","DuPont analysis: breakdown ROE","Perbandingan ROE antar sektor: konteks penting","Emiten BEI dengan ROE konsisten di atas 20%"]},
  {id:"fa12",level:1,pkgLabel:"Silver",icon:"💹",tag:"Fundamental",title:"Memahami Laporan Keuangan Kuartalan",
   desc:"Cara baca laporan keuangan kuartalan (Q1-Q4) secara efektif: perbandingan QoQ dan YoY, seasonality bisnis, dan cara antisipasi earnings surprise.",
   topics:["QoQ vs YoY: mana lebih relevan","Seasonality: bisnis yang dipengaruhi musim","Cara antisipasi earnings surprise","Guidance manajemen: cara interpretasi","Revisi target analis pasca earnings","Strategi trading di sekitar earnings release"]},

  // ===== MANAJEMEN RISIKO =====
  {id:"rm1",level:0,pkgLabel:"Basic",icon:"🛡️",tag:"Manajemen Risiko",title:"Prinsip Dasar Manajemen Risiko",
   desc:"Sebelum profit, pahami risiko. Panduan dasar: jangan pakai uang darurat, aturan 1-2% per trade, diversifikasi sederhana, dan psikologi saat rugi.",
   topics:["Risiko utama investasi saham","Jangan pakai uang darurat","Aturan 1-2% risk per trade","Diversifikasi: jangan taruh semua di satu saham","Cara hitung potensi kerugian sebelum beli","Psikologi saat portofolio merah"]},
  {id:"rm2",level:1,pkgLabel:"Silver",icon:"⚖️",tag:"Manajemen Risiko",title:"Position Sizing yang Benar",
   desc:"Cara menentukan berapa lot harus dibeli berdasarkan modal, risk per trade, dan jarak stop loss. Fixed fractional, fixed ratio, dan Kelly Criterion.",
   topics:["Fixed fractional method: 1-2% risk","Cara hitung lot berdasarkan SL distance","Fixed ratio: scaling up saat profit","Kelly Criterion: teori & praktik","Position sizing untuk berbeda timeframe","Cara resize position saat modal bertambah"]},
  {id:"rm3",level:1,pkgLabel:"Silver",icon:"📉",tag:"Manajemen Risiko",title:"Stop Loss Strategy yang Tepat",
   desc:"Stop loss adalah asuransi. Cara menentukan SL berbasis struktur, ATR, dan persentase. Cara eksekusi cut loss tanpa emosi dan tanpa ragu.",
   topics:["Stop loss berbasis struktur (swing low/high)","Stop loss berbasis ATR","Stop loss berbasis persentase","Trailing stop loss: pertahankan profit","Hard stop vs mental stop","Cara eksekusi cut loss tanpa emosi"]},
  {id:"rm4",level:2,pkgLabel:"Gold",icon:"📊",tag:"Manajemen Risiko",title:"Risk-Reward Ratio & Expectancy System",
   desc:"Cara menghitung dan menggunakan RRR secara benar. Win rate vs RRR tradeoff, expectancy system, dan cara backtest apakah sistem trading kamu profitable jangka panjang.",
   topics:["Risk-Reward Ratio (RRR): konsep dasar","Win rate vs RRR: tradeoff nyata","Expectancy = (win rate × avg win) - (loss rate × avg loss)","Cara backtest sistem trading manual","Monte Carlo simulation untuk equity curve","RRR minimum agar sistem tetap profitable"]},
  {id:"rm5",level:2,pkgLabel:"Gold",icon:"🔄",tag:"Manajemen Risiko",title:"Hedging & Portofolio Protection",
   desc:"Cara melindungi portofolio saat market bearish: strategi hedging, penggunaan ETF, diversifikasi ke cash/obligasi, dan rebalancing untuk meminimalkan drawdown.",
   topics:["Konsep hedging dalam investasi saham","ETF & reksa dana sebagai hedge","Diversifikasi ke obligasi & pasar uang","Tingkatkan cash position saat bear market","Beta portofolio: cara hitung & kelola","Rebalancing otomatis 3-6 bulan"]},
  {id:"rm6",level:3,pkgLabel:"Pro",icon:"📈",tag:"Manajemen Risiko",title:"Drawdown Management & Recovery",
   desc:"Cara menghadapi dan recover dari drawdown besar. Psikologi saat loss streak, aturan maximum drawdown, cara reset mindset, dan strategi scaling back.",
   topics:["Maximum drawdown: kapan harus berhenti","Equity curve: cara baca & analisis","Loss streak: berapa kerugian normal secara statistik","Cara reset setelah drawdown besar","Scaling back: mulai kecil setelah loss","Kapan istirahat dari market"]},

  // ===== PSIKOLOGI TRADING =====
  {id:"psy1",level:0,pkgLabel:"Basic",icon:"🧘",tag:"Psikologi",title:"Mindset Investor Pemula yang Benar",
   desc:"Fondasi psikologi yang benar sebelum mulai investasi: ekspektasi realistis, cara tidak panik saat koreksi, long-term thinking, dan cara memulai dengan tenang.",
   topics:["Ekspektasi realistis: berapa return wajar","Koreksi adalah normal: data historis","Long-term thinking vs short-term noise","Cara tidak ikut panic selling","Jangan bandingkan return dengan orang lain","Investasi sebagai proses, bukan event"]},
  {id:"psy2",level:1,pkgLabel:"Silver",icon:"⚠️",tag:"Psikologi",title:"Bias Kognitif yang Merusak Keputusan",
   desc:"12 bias kognitif yang sering merusak hasil investasi: confirmation bias, loss aversion, recency bias, anchoring, overconfidence — dan cara mengatasinya.",
   topics:["Confirmation bias: hanya cari info yang setuju","Loss aversion: takut rugi vs takut ketinggalan","Recency bias: terlalu fokus kejadian terakhir","Anchoring bias: terpaku pada harga beli","Overconfidence: merasa selalu benar","Counter bias: checklist sebelum keputusan"]},
  {id:"psy3",level:2,pkgLabel:"Gold",icon:"🔥",tag:"Psikologi",title:"FOMO, Greed & Panic: Kendalikan Emosi",
   desc:"FOMO dan greed adalah pembunuh akun trading. Cara mengenali gejala FOMO, kapan greed mengambil alih, cara tidak panic sell, dan sistem menjaga disiplin saat pasar ekstrem.",
   topics:["FOMO: cara kenali dan kelola","Greed: kapan saatnya profit taking","Panic selling: tanda dan cara hindari","Rules 'if-then' sebelum market bergejolak","Journal emosi trading: catat mood saat trading","Review jurnal: pattern emosi yang merusak"]},
  {id:"psy4",level:2,pkgLabel:"Gold",icon:"📓",tag:"Psikologi",title:"Trading Journal: Sistem Evaluasi Mandiri",
   desc:"Trading journal adalah alat paling powerful untuk improve. Setup journal yang efektif, apa yang harus dicatat, analisis pola kesalahan, dan schedule review mingguan.",
   topics:["Setup trading journal: format efektif","Yang wajib dicatat: entry, SL, TP, alasan, hasil","Catat juga: emosi saat entry & exit","Review mingguan: pattern kesalahan","Statistik personal: win rate, avg RRR","Improve berdasarkan data journal sendiri"]},
  {id:"psy5",level:3,pkgLabel:"Pro",icon:"🏋️",tag:"Psikologi",title:"Disiplin Sistem & Mental Toughness",
   desc:"Yang memisahkan trader profitable dari yang tidak adalah disiplin eksekusi. Membangun sistem yang bisa dieksekusi konsisten, mental toughness, dan recovery dari losing streak.",
   topics:["Sistem trading yang bisa dieksekusi konsisten","Cara membangun kebiasaan disiplin trading","Mental toughness: objektif saat emosi tinggi","Recovery mindset setelah losing streak","Process goals vs outcome goals","Peak performance: pola harian trader top"]},
  {id:"psy6",level:4,pkgLabel:"Platinum",icon:"🎭",tag:"Psikologi",title:"Peak Performance & Flow State Trading",
   desc:"Cara mencapai flow state saat trading: kondisi optimal antara skill dan tantangan. Rutinitas pra-trading, manajemen energi, mindfulness, dan performa konsisten jangka panjang.",
   topics:["Flow state: kondisi optimal trading","Rutinitas pra-trading profesional","Manajemen energi: tidur, olahraga, nutrisi","Mindfulness untuk trader: teknik singkat","Journaling reflektif untuk peak performance","Long-term sustainability: trading sebagai karir"]},

  // ===== STRATEGI TRADING =====
  {id:"st1",level:0,pkgLabel:"Basic",icon:"🎲",tag:"Strategi",title:"Strategi Buy & Hold Jangka Panjang",
   desc:"Buy and hold adalah strategi paling sederhana tapi powerful jangka panjang. Cara pilih saham, kapan beli, cara tidak panik saat turun, dan data historis returnnya.",
   topics:["Konsep buy and hold: return historis BEI","Cara pilih saham untuk hold panjang","Kapan waktu ideal beli saham hold","Cara tidak panik saat saham turun 30%","Dollar Cost Averaging (DCA) di BEI","Target holding period dan cara exit"]},
  {id:"st2",level:1,pkgLabel:"Silver",icon:"📅",tag:"Strategi",title:"Swing Trading: Setup & Eksekusi",
   desc:"Swing trading: hold 2-14 hari untuk tangkap satu ayunan harga. Setup entry yang baik, cara pilih saham yang tepat, timing entry-exit, dan manajemen posisi.",
   topics:["Definisi swing trading & profil trader cocok","Timeframe untuk swing: daily & H4","Setup entry: konfluensi support + indikator","Cara pilih saham untuk swing trading","Entry timing: tidak mengejar, tidak terlambat","Exit: partial TP & trail SL"]},
  {id:"st3",level:1,pkgLabel:"Silver",icon:"💼",tag:"Strategi",title:"Positional Trading & Investasi Jangka Menengah",
   desc:"Positional trading: hold minggu-bulan untuk tangkap trend besar. Kombinasi fundamental kuat + teknikal setup bagus sebagai kandidat positional trade.",
   topics:["Positional trading vs buy & hold","Timeframe: weekly & monthly chart","Kombinasi fundamental kuat + teknikal setup","Kelola posisi besar dalam jangka panjang","Kapan menambah posisi (pyramiding)","Exit strategi positional trade"]},
  {id:"st4",level:2,pkgLabel:"Gold",icon:"⚡",tag:"Strategi",title:"Momentum Trading Strategy",
   desc:"Momentum trading: masuk saham yang sedang trending kuat dan keluar sebelum momentum berhenti. Identifikasi momentum saham BEI via volume, RSI, dan price action.",
   topics:["Definisi momentum & cara mengukurnya","Scan saham momentum di BEI","Volume sebagai konfirmasi momentum","RSI > 60 dalam uptrend: sinyal kuat","Entry saham momentum yang sudah naik","Exit saat momentum melemah: tanda-tanda"]},
  {id:"st5",level:2,pkgLabel:"Gold",icon:"🔁",tag:"Strategi",title:"Contrarian Investing & Mean Reversion",
   desc:"Strategi contrarian: beli saat orang takut, jual saat orang serakah. Identifikasi saham yang oversold secara fundamental dan timing entry contrarian yang tepat.",
   topics:["Prinsip contrarian: fear & greed","Identifikasi saham oversold fundamental","RSI ekstrem sebagai contrarian indicator","Mean reversion: harga kembali ke rata-rata","Risiko contrarian: value trap & falling knife","Bedakan contrarian opportunity vs value trap"]},
  {id:"st6",level:2,pkgLabel:"Gold",icon:"🌀",tag:"Strategi",title:"Breakout Trading & Filter False Breakout",
   desc:"Breakout dari resistance/pola chart adalah salah satu setup paling profitable. Identifikasi breakout valid, filter false breakout, dan entry aman dengan konfirmasi volume.",
   topics:["Breakout dari resistance & pola chart","Volume sebagai syarat breakout valid","Bedakan genuine breakout vs false breakout","Retest setelah breakout: entry lebih aman","SL & TP dalam breakout trade","Breakout dari konsolidasi panjang: setup terbaik"]},
  {id:"st7",level:3,pkgLabel:"Pro",icon:"🎪",tag:"Strategi",title:"Event-Driven Strategy: Earnings & Corporate Action",
   desc:"Cara trading di sekitar event korporasi: earnings report, RUPST, rights issue, stock split, buyback. Cara antisipasi, cara trade, dan cara hindari risiko event.",
   topics:["Earnings play: sebelum & sesudah laporan","RUPST & dividend play: timing optimal","Rights issue: peluang atau dilusi?","Stock split: pengaruh ke harga & likuiditas","Buyback announcement: kenapa harga sering naik","Filter: event mana yang layak di-trade"]},
  {id:"st8",level:3,pkgLabel:"Pro",icon:"🔮",tag:"Strategi",title:"Systematic Trading: Build Rules-Based System",
   desc:"Cara membangun sistem trading yang terdefinisi penuh: rules-based, backtestable, dan bisa dieksekusi konsisten tanpa keputusan subjektif. Template sistem yang benar.",
   topics:["Komponen sistem trading yang lengkap","Universe selection: saham mana yang ditrade","Entry rules yang spesifik & terukur","Exit rules: SL, TP, time-based exit","Position sizing rules dalam sistem","Backtesting & forward testing"]},
  {id:"st9",level:4,pkgLabel:"Platinum",icon:"🌐",tag:"Strategi",title:"Global Macro Trading untuk Saham Indonesia",
   desc:"Cara gunakan analisis makro global untuk timing investasi: siklus Fed, DXY, harga komoditas, capital flow, dan positioning portofolio berdasarkan kondisi makro.",
   topics:["Siklus Fed dan dampaknya ke IHSG","DXY Index: pengaruh ke emerging market","Capital flow asing: sinyal masuk/keluar","Harga komoditas → saham tambang BEI","Positioning portofolio di era makro tertentu","Indikator makro leading untuk IHSG"]},

  // ===== BANDARMOLOGI LANJUTAN =====
  {id:"bnd1",level:1,pkgLabel:"Silver",icon:"🕵️",tag:"Bandarmologi",title:"Broker Summary: Tracking Big Player",
   desc:"Cara membaca broker summary harian dan mingguan untuk track big player. Broker mana yang biasa beli/jual saham tertentu, dan cara filter data yang relevan.",
   topics:["Sumber data broker summary: RTI, Stockbit","Cara baca broker ranking harian","Foreign flow: asing beli/jual apa?","Broker langganan saham tertentu: pola akumulasi","Net foreign vs domestic: sinyal arah","Filter data broker: noise vs sinyal valid"]},
  {id:"bnd2",level:2,pkgLabel:"Gold",icon:"🔎",tag:"Bandarmologi",title:"Deteksi Akumulasi Diam-diam",
   desc:"Mendeteksi fase akumulasi sebelum harga bergerak: karakteristik volume, pola candle di bawah resistance, OBV divergence, dan contoh kasus saham BEI nyata.",
   topics:["Karakteristik harga saat fase akumulasi","Volume naik tapi harga sideways: sinyal kuat","Pola candle akumulasi di support","OBV naik sementara harga flat: hidden accumulation","Broker summary saat akumulasi: pola konsisten","Contoh: akumulasi BMRI sebelum naik 40%"]},
  {id:"bnd3",level:2,pkgLabel:"Gold",icon:"📡",tag:"Bandarmologi",title:"Net Foreign Flow & Tracking Asing",
   desc:"Tracking arus modal asing di BEI. Pengaruh net foreign buy/sell terhadap IHSG dan saham individual. Gunakan data asing sebagai sinyal konfirmasi entry.",
   topics:["Net foreign buy/sell: arti & pengaruh","Data asing harian: cara baca di IDX","Saham yang sering digerakkan asing","Sektor favorit asing di BEI","Divergence: harga naik tapi asing net sell = waspada","Strategi: ikuti atau counter asing?"]},
  {id:"bnd4",level:3,pkgLabel:"Pro",icon:"🎯",tag:"Bandarmologi",title:"Timing Entry Setelah Deteksi Bandar",
   desc:"Setelah deteksi bandar sedang akumulasi, kapan dan bagaimana cara masuk yang optimal. Setup entry berbasis bandarmologi: konfirmasi teknikal + broker summary + volume.",
   topics:["3 konfirmasi sebelum entry: teknikal + broker + volume","Cara tidak masuk terlalu cepat (prematur)","Mini breakout = konfirmasi akumulasi selesai","SL placement untuk bandarmologi trade","Cara sizing position untuk high-conviction trade","Exit: ikut bandar atau ambil profit lebih awal?"]},
  {id:"bnd5",level:3,pkgLabel:"Pro",icon:"💣",tag:"Bandarmologi",title:"Deteksi Distribusi & Exit Sebelum Dump",
   desc:"Lebih penting dari beli adalah tahu kapan jual. Cara deteksi fase distribusi: volume tidak konsisten, candle panjang berbalik, berita positif di harga tertinggi.",
   topics:["Karakteristik fase distribusi","Volume tidak konsisten: tanda bandar mulai jual","Candle panjang berbalik di atas resistance","Berita positif di harga tertinggi = jebakan FOMO","Broker summary saat distribusi: pola keluar","Exit sebelum dump: take profit berjenjang"]},
  {id:"bnd6",level:4,pkgLabel:"Platinum",icon:"🏛️",tag:"Bandarmologi",title:"Analisis Kepemilikan & Insider Transaction",
   desc:"Cara melacak perubahan kepemilikan saham dari laporan IDX: insider buying, transaksi afiliasi, perubahan porsi institusi besar, dan interpretasi sinyal kepemilikan.",
   topics:["Laporan kepemilikan saham di IDX","Insider buying: sinyal bullish terkuat","Insider selling: tidak selalu bearish","Perubahan kepemilikan institusional","Saham dengan insider ownership tinggi","Red flag: direksi jual besar-besaran saat harga tinggi"]},

  // ===== SEKTOR ROTATION & MAKRO =====
  {id:"sr1",level:1,pkgLabel:"Silver",icon:"🔄",tag:"Makro",title:"Sector Rotation: Siklus Ekonomi & Saham",
   desc:"Setiap fase siklus ekonomi (expansion, peak, contraction, trough) menguntungkan sektor berbeda. Identifikasi fase siklus saat ini dan sektor yang outperform.",
   topics:["4 fase siklus ekonomi","Sektor unggulan per fase: expansion → teknologi","Peaking → defensif/healthcare","Contraction → utilities/obligasi","Recovery → finansial/industri","Identifikasi fase siklus saat ini di Indonesia"]},
  {id:"sr2",level:1,pkgLabel:"Silver",icon:"🌍",tag:"Makro",title:"Pengaruh Kebijakan BI & OJK terhadap Saham",
   desc:"Cara membaca dan mengantisipasi kebijakan Bank Indonesia dan OJK. Pengaruh BI Rate, GWM, kebijakan makroprudensial, dan regulasi OJK terhadap saham BEI.",
   topics:["BI Rate decision: kapan dan pengaruhnya","GWM dan efeknya ke bank","Kebijakan makroprudensial: LTV, DSCR","Regulasi OJK yang mempengaruhi saham","Cara baca rilis kebijakan BI","JIBOR & SBN yield: pengaruh ke portofolio"]},
  {id:"sr3",level:2,pkgLabel:"Gold",icon:"🌏",tag:"Makro",title:"Intermarket Analysis: IHSG & Pasar Global",
   desc:"IHSG dipengaruhi S&P 500, Hang Seng, Nikkei, harga komoditas, dan dollar index. Cara membaca intermarket relationship dan gunakan untuk prediksi IHSG.",
   topics:["Korelasi IHSG vs S&P500 & Hang Seng","DXY naik → rupiah melemah → IHSG tertekan","Harga minyak → sektor energi & transportasi","Nikel & batu bara → emiten tambang BEI","VIX index: fear gauge global","Intermarket analysis untuk timing masuk"]},
  {id:"sr4",level:2,pkgLabel:"Gold",icon:"💱",tag:"Makro",title:"Pengaruh Kurs Rupiah terhadap Emiten",
   desc:"Kurs rupiah berdampak berbeda ke emiten: eksportir untung saat rupiah melemah, importir rugi. Identifikasi emiten eksportir vs importir dan strategi portofolio.",
   topics:["Mekanisme pengaruh kurs ke laporan keuangan","Emiten eksportir: untung saat rupiah lemah","Emiten importir: rugi saat rupiah lemah","Cara hitung foreign currency exposure","Saham hedge kurs di BEI","Strategi portofolio di era rupiah volatile"]},
  {id:"sr5",level:3,pkgLabel:"Pro",icon:"📰",tag:"Makro",title:"Kalender Ekonomi & Event Trading",
   desc:"Cara menggunakan kalender ekonomi global (Fed, NFP, CPI, GDP) dan lokal (BI Rate, inflasi, trade balance) untuk merencanakan dan menghindari risiko event.",
   topics:["Kalender ekonomi global: event paling market-moving","Fed FOMC: kapan & apa yang diperhatikan","NFP dan dampaknya ke emerging market","CPI & inflasi: pengaruh ke BI Rate","BI Board Meeting: cara antisipasi","Strategi: stay out atau posisi sebelum event?"]},

  // ===== PORTOFOLIO MANAGEMENT =====
  {id:"pm1",level:0,pkgLabel:"Basic",icon:"🗂️",tag:"Portofolio",title:"Membangun Portofolio Pertama",
   desc:"Cara membangun portofolio saham pertama: berapa banyak saham, cara pilih, persentase per saham, dan cara monitor. Template portofolio pemula yang sudah terbukti.",
   topics:["Berapa saham ideal untuk pemula: 3-5","Cara pilih saham untuk portofolio awal","Persentase alokasi per saham","Template 3 layer: core, growth, speculative","Cara monitor performa portofolio","Kapan review dan adjust portofolio"]},
  {id:"pm2",level:1,pkgLabel:"Silver",icon:"🎯",tag:"Portofolio",title:"Asset Allocation & Diversifikasi Benar",
   desc:"Prinsip asset allocation: berapa persen saham, obligasi, cash, reksa dana. Cara diversifikasi yang benar dan korelasi antar aset.",
   topics:["Asset allocation berdasarkan profil risiko","Saham vs obligasi vs cash: alokasi optimal","Diversifikasi antar sektor & kapitalisasi","Korelasi antar aset: manfaatkan low correlation","Reksa dana sebagai diversifier","Rebalancing berkala: kapan dan bagaimana"]},
  {id:"pm3",level:2,pkgLabel:"Gold",icon:"📊",tag:"Portofolio",title:"Monitoring & Evaluasi Performa Portofolio",
   desc:"Cara mengukur performa portofolio secara profesional: time-weighted return, Sharpe ratio, alpha vs benchmark IHSG, dan identifikasi saham yang drag performance.",
   topics:["Time-weighted return (TWR): cara hitung","Sharpe ratio: return per unit risiko","Alpha: outperform vs underperform IHSG","Identifikasi drag: saham yang merusak performa","Dashboard monitoring portofolio gratis","Review bulanan: apa yang harus dievaluasi"]},
  {id:"pm4",level:3,pkgLabel:"Pro",icon:"🔄",tag:"Portofolio",title:"Rebalancing & Profit Taking Terstruktur",
   desc:"Kapan dan bagaimana rebalancing portofolio. Systematic rebalancing vs threshold-based. Profit taking terstruktur dan cara deploy ulang profit ke peluang baru.",
   topics:["Kapan rebalancing: waktu atau threshold?","Calendar rebalancing: triwulan atau semester","Threshold rebalancing: saat alokasi bergeser >5%","Profit taking terstruktur: 1/3 bertahap","Cara deploy profit ke peluang baru","Tax consideration dalam rebalancing"]},
  {id:"pm5",level:3,pkgLabel:"Pro",icon:"🌊",tag:"Portofolio",title:"Portofolio dalam Kondisi Bear Market",
   desc:"Cara mengelola portofolio saat IHSG dalam tren turun: kapan cut loss semua, kapan justru tambah, defensif rotation, dan positioning untuk recovery.",
   topics:["Identifikasi bear market sejati","Defensif rotation: ke sektor apa?","Kapan cut loss dan keluar ke cash","Kapan justru akumulasi di bear market","DCA saat bear: pros & cons","Positioning untuk recovery: sektor mana duluan"]},

  // ===== TOOLS & PLATFORM =====
  {id:"tl1",level:0,pkgLabel:"Basic",icon:"🛠️",tag:"Tools",title:"Platform & Tools Wajib Investor BEI",
   desc:"Review lengkap tools gratis dan berbayar untuk investor saham Indonesia: TradingView, RTI Business, IDX, Stockbit, IPOT, dan cara memanfaatkan secara optimal.",
   topics:["TradingView: setup & cara pakai gratis","RTI Business: data broker & fundamental","IDX.co.id: laporan keuangan & keterbukaan","Stockbit: screening & komunitas","IPOT: platform trading terintegrasi","Setup alert harga di TradingView gratis"]},
  {id:"tl2",level:1,pkgLabel:"Silver",icon:"🔍",tag:"Tools",title:"Stock Screener: Menemukan Saham Potensial",
   desc:"Cara menggunakan stock screener untuk menemukan saham dengan kriteria tertentu: filter fundamental, teknikal, volume, dan setup watchlist otomatis.",
   topics:["Konsep stock screener & cara kerja","Filter fundamental: PER, PBV, ROE, net profit growth","Filter teknikal: MA, RSI, volume","Screener gratis: Stockbit, RTI, TradingView","Buat watchlist dari hasil screening","Screening rutin: jadwal mingguan efektif"]},
  {id:"tl3",level:2,pkgLabel:"Gold",icon:"⚙️",tag:"Tools",title:"TradingView Advanced: Setup Profesional",
   desc:"Setup TradingView seperti trader profesional: layout multi-chart, indikator custom, Pine Script dasar, alert multi-kondisi, dan cara share & export analisis.",
   topics:["Layout multi-chart: 4 chart sekaligus","Chart settings: candlestick optimal","Indikator custom: import & install","Pine Script dasar: buat indikator sendiri","Alert multi-kondisi: lebih dari sekedar harga","Export dan share analisis chart"]},
  {id:"tl4",level:1,pkgLabel:"Silver",icon:"📊",tag:"Tools",title:"Excel & Google Sheets untuk Portofolio",
   desc:"Cara membangun sistem tracking portofolio di spreadsheet: otomatisasi data saham, dashboard performa, jurnal trading terintegrasi, dan template siap pakai.",
   topics:["Setup spreadsheet portofolio dari nol","GOOGLEFINANCE formula: data saham otomatis","Dashboard: total return, allocation chart","Jurnal trading terintegrasi di spreadsheet","Track dividen & corporate action","Template portofolio BEI siap pakai"]},

  // ===== SPECIAL TOPICS =====
  {id:"sp1",level:1,pkgLabel:"Silver",icon:"🎉",tag:"Special",title:"IPO: Cara Analisis & Strategi",
   desc:"Cara menganalisis saham IPO sebelum listing: baca prospektus, valuasi pre-IPO, track record manajemen, penggunaan dana IPO, dan strategi beli/jual saat IPO.",
   topics:["Cara baca prospektus IPO","Valuasi pre-IPO: wajar atau kemahalan?","Track record manajemen & pemegang saham","Penggunaan dana IPO: ekspansi atau bayar utang?","IPO flipping vs hold: strategi mana lebih baik","Cara daftar IPO online di BEI"]},
  {id:"sp2",level:1,pkgLabel:"Silver",icon:"💰",tag:"Special",title:"Dividen Investing: Strategi Income Pasif",
   desc:"Strategi dividend investing untuk income pasif: cara cari saham dividen tinggi dengan fundamental kuat, dividend yield trap, ex-dividend play, dan build portofolio dividen.",
   topics:["Dividend yield vs dividend growth","Cara cari saham dividen di BEI","Dividend yield trap: yield tinggi tapi berbahaya","Ex-dividend date: jangan salah timing","Payout ratio: berapa persen idealnya","Build portofolio dividen: target Rp 1 juta/bulan"]},
  {id:"sp3",level:2,pkgLabel:"Gold",icon:"📦",tag:"Special",title:"Rights Issue & Corporate Action",
   desc:"Cara menganalisis rights issue, HMETD, stock split, reverse split, dan akuisisi. Kapan menjadi peluang dan kapan menjadi jebakan untuk retail investor.",
   topics:["Mekanisme rights issue: HMETD & waran","Harga teoritis setelah rights issue","Stock split: pengaruh ke harga & likuiditas","Reverse split: sering tanda masalah","Merger & akuisisi: siapa yang untung?","Strategi: ikut rights issue atau jual saja?"]},
  {id:"sp4",level:2,pkgLabel:"Gold",icon:"🏛️",tag:"Special",title:"Saham BUMN: Karakteristik & Cara Analisis",
   desc:"BUMN memiliki karakteristik unik: pengaruh kebijakan pemerintah, privatisasi, dividen khusus, PMN, dan cara menganalisis dengan framework yang tepat.",
   topics:["Karakteristik unik saham BUMN","Pengaruh kebijakan pemerintah terhadap BUMN","PMN: peluang atau beban?","Dividen BUMN: yield tinggi tapi konsistensi?","Privatisasi BUMN: katalis besar","BBRI, TLKM, ADHI: analisis mendalam"]},
  {id:"sp5",level:3,pkgLabel:"Pro",icon:"🌱",tag:"Special",title:"ESG Investing di BEI",
   desc:"ESG investing semakin relevan. Cara membaca ESG score emiten BEI, pengaruh ESG terhadap valuasi jangka panjang, dan fund internasional yang memilih ESG.",
   topics:["Konsep ESG: apa dan mengapa penting","ESG score di BEI: di mana cek?","Green bond & sustainable finance","Dana global yang mengikuti ESG","ESG vs return: apakah mengorbankan profit?","Saham BEI dengan ESG terbaik"]},
  {id:"sp6",level:4,pkgLabel:"Platinum",icon:"🏆",tag:"Special",title:"Portfolio Management Seperti Fund Manager",
   desc:"Cara mengelola portofolio dengan sistem seperti fund manager profesional: investment thesis, position management, portfolio review berkala, dan decision-making framework.",
   topics:["Investment thesis: wajib tulis sebelum beli","Position management: buka, tambah, kurangi, tutup","Portfolio review: agenda dan frekuensi","Decision making framework: checklist beli/jual","Pemisahan portofolio: core vs satellite","Laporan performa personal: cara buat & baca"]},
  {id:"sp7",level:4,pkgLabel:"Platinum",icon:"💡",tag:"Special",title:"Memahami & Analisis Saham Gorengan",
   desc:"Saham gorengan hadir di setiap pasar. Identifikasi, mekanisme pump & dump, kapan ikut dan kapan hindari, dan cara melindungi diri dari jebakan.",
   topics:["Definisi saham gorengan di BEI","Karakteristik: volume ekstrem, float kecil","Pola pump & dump: fase demi fase","Kapan boleh ikut: rules yang ketat","Cara exit sebelum dump terjadi","Regulasi OJK & konsekuensi manipulasi pasar"]},
  {id:"sp8",level:5,pkgLabel:"Elite",icon:"🎓",tag:"Special",title:"Membangun Karir di Dunia Keuangan",
   desc:"Untuk yang ingin jadikan investasi sebagai karir: jalur fund manager, analis saham, wealth manager. Sertifikasi (CFA, CFP, WMI), networking, dan cara mulai.",
   topics:["Jalur karir di industri keuangan Indonesia","Sertifikasi: CFA, CFP, WMI — mana yang perlu?","Cara memulai sebagai analis independen","Personal brand sebagai investor publik","Networking di komunitas investasi","Cara monetize keahlian analisis saham"]},
  {id:"sp9",level:5,pkgLabel:"Elite",icon:"🚀",tag:"Special",title:"Financial Freedom Melalui Investasi Saham",
   desc:"Roadmap menuju financial freedom: berapa yang dibutuhkan, berapa lama, strategi tepat. Cara hitung 'number', passive income dari dividen, dan transisi dari kerja ke bebas finansial.",
   topics:["Definisi financial freedom yang realistis","Hitung 'your number': berapa yang cukup","Rule of 4%: withdrawal rate aman","Passive income dari dividen: berapa lama build?","Strategi portofolio menjelang financial freedom","Transisi: dari gaji ke income pasif"]},
];

const TAG_COLORS: any = {
  "Pemula":"bg-blue-500/10 text-blue-400","Fundamental":"bg-green-500/10 text-green-400",
  "Teknikal":"bg-purple-500/10 text-purple-400","Bandarmologi":"bg-orange-500/10 text-orange-400",
  "Psikologi":"bg-pink-500/10 text-pink-400","Manajemen Risiko":"bg-red-500/10 text-red-400",
  "AI Agent":"bg-cyan-500/10 text-cyan-400","Watchlist":"bg-indigo-500/10 text-indigo-400",
  "Laporan":"bg-yellow-500/10 text-yellow-400","Konsultasi":"bg-teal-500/10 text-teal-400",
  "AI Advanced":"bg-cyan-500/10 text-cyan-400","Sinyal":"bg-green-500/10 text-green-400",
  "Mentoring":"bg-rose-500/10 text-rose-400","Portfolio":"bg-amber-500/10 text-amber-400",
  "Event":"bg-violet-500/10 text-violet-400",
};


// ── PAKET DATA ───────────────────────────────────────────────────
const PAKET_VIP = [
  { id:"basic", name:"VIP STARTER", price:"Rp 100.000", color:"#3b82f6", badge:"⭐", features:["Analisa Teknikal Lengkap","Fundamental Emiten","Stock Screening Harian","Sinyal Saham Harian"] },
  { id:"silver", name:"VIP SILVER", price:"Rp 250.000", color:"#06b6d4", badge:"🥈", features:["Semua fitur Starter","Bandarmologi Dasar","Screening Bagger","Risk Management"] },
  { id:"gold", name:"VIP GOLD", price:"Rp 500.000", color:"#f59e0b", badge:"🥇", popular:true, features:["Semua fitur Silver","Sinyal Premium Entry/TP/SL","Tape Reading Intraday","Bagger Watchlist"] },
  { id:"pro", name:"VIP PRO", price:"Rp 750.000", color:"#8b5cf6", badge:"💜", features:["Semua fitur Gold","AI Agent 24/7","Konsultasi Portofolio","Priority Support"] },
  { id:"platinum", name:"VIP PLATINUM", price:"Rp 900.000", color:"#e2e8f0", badge:"💎", features:["Semua fitur Pro","Live Session 1on1","Sinyal Real-time 24/7","Akses Semua Modul"] },
  { id:"elite", name:"VIP ELITE", price:"Rp 1.000.000", color:"#fde68a", badge:"🏆", features:["Semua fitur Platinum","Mentoring Private","AI Elite + GPT-4","Laporan Harian Personal"] },
];

// ── GREETING BANNER ──────────────────────────────────────────────
function GreetingBanner({ greetingPagi, greetingMalam }: { greetingPagi:string; greetingMalam:string }) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    const jakartaHour = new Date(new Date().toLocaleString("en",{timeZone:"Asia/Jakarta"})).getHours();
    const g = jakartaHour >= 5 && jakartaHour < 10 ? (greetingPagi||"Selamat pagi! Semangat trading hari ini 💪")
            : jakartaHour >= 21 ? (greetingMalam||"Selamat malam! Review portofolio hari ini 📊") : "";
    if (g) { setText(g); setShow(true); const t=setTimeout(()=>setShow(false),5000); return()=>clearTimeout(t); }
  }, [greetingPagi, greetingMalam]);
  if (!show) return null;
  return (
    <div onClick={()=>setShow(false)} style={{ background:"linear-gradient(90deg,rgba(30,90,240,0.12),rgba(6,182,212,0.08))", border:"1px solid rgba(30,90,240,0.2)", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12, cursor:"pointer", animation:"fadeInDown 0.4s ease" }}>
      <span style={{ fontSize:22 }}>{text.includes("pagi")?"🌤":"🌙"}</span>
      <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, fontWeight:600, flex:1 }}>{text}</p>
      <span style={{ color:"rgba(255,255,255,0.3)", fontSize:18 }}>×</span>
    </div>
  );
}

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
  const [doneSignalIds, setDoneSignalIds] = useState<string[]>([]);
  const [greetingPagi, setGreetingPagi] = useState("");
  const [greetingMalam, setGreetingMalam] = useState("");
  const [owners, setOwners] = useState<any[]>([
    { name:"Thirafi Thariq Al Idris", role:"Founder & CEO", badge:"👑", tag:"Owner" },
  ]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    // Support new username/password login
    const rcUser = localStorage.getItem("rc_user");
    let tokenAuth = localStorage.getItem("vip_token");
    
    const loadData = (userData: any) => {
      setUser(userData);
      setLoading(false);
      // Load dari sync: signals, bagger, bandar, done_ids, owners, dll
      const loadSync = () => fetch("/api/admin/sync").then(r=>r.json()).then((data:any) => {
        if (data.signals) setSignals(data.signals.filter((s:any) => !s.is_bagger && !s.is_bandar));
        if (data.bagger_signals) setBaggerSignals(data.bagger_signals);
        if (data.bandar_signals) setBandarSignals(data.bandar_signals);
        if (data.done_signal_ids) setDoneSignalIds(data.done_signal_ids || []);
        if (data.premiumSignals) setPremiumContent(data.premiumSignals);
        if (data.greeting_pagi) setGreetingPagi(data.greeting_pagi);
        if (data.greeting_malam) setGreetingMalam(data.greeting_malam);
        if (data.owners) setOwners(data.owners);
        if (data.partners) setPartners(data.partners);
      }).catch(()=>{});
      loadSync();
      // Auto refresh signals setiap 30 detik
      const interval = setInterval(loadSync, 30000);
      return () => clearInterval(interval);
      fetch("/api/news").then(r=>r.json()).then(d=>setIhsgNews((d.news||[]).slice(0,8))).catch(()=>{});
    };

    if (rcUser) {
      try {
        const u = JSON.parse(rcUser);
        if (u && u.auth_token) {
          const mapped = { name: u.username, package: u.role||"free", expiredAt: u.vip_expired_at, username: u.username, is_verified: u.is_verified, role: u.role, auth_token: u.auth_token };
          loadData(mapped);
          return;
        }
      } catch {}
    }
    if (!tokenAuth) { router.push("/login"); return; }
    fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({token:tokenAuth}) })
      .then(r=>r.json())
      .then(d => {
        if (!d.success) {
          localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user");
          router.push("/login?error=" + encodeURIComponent(d.message||"Token tidak valid"));
        } else {
          localStorage.setItem("vip_user", JSON.stringify(d.user));
          loadData(d.user);
        }
      })
      .catch(()=>setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("vip_token"); localStorage.removeItem("vip_user");
    localStorage.removeItem("rc_user");
    router.push("/login");
  };

  const pkgLevel = PKG_LEVELS.indexOf(user?.package||"basic");
  const userPkg = (user?.package || "basic").toLowerCase();
  const mySignals = signals.filter(s => {
    const pkg = (s.package || []).map((p:string)=>p.toLowerCase());
    return pkg.includes(userPkg) || pkg.includes("all") || pkg.length === 0;
  });
  const filteredSignals = (sigFilter==="Semua" ? mySignals : mySignals.filter((s:any)=>s.action===sigFilter)).filter((s:any)=>!s.is_tomorrow);
  const myModules = ALL_MODULES.filter(m=>m.level<=pkgLevel).sort((a,b)=>a.level-b.level);
  const lockedModules = ALL_MODULES.filter(m=>m.level>pkgLevel).sort((a,b)=>a.level-b.level);

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
        <JakartaClock />
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
            <GreetingBanner greetingPagi={greetingPagi} greetingMalam={greetingMalam} />
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
                  {mySignals.slice(0,2).map((s,i) => <SignalCard key={i} s={s} isDone={doneSignalIds.includes(s.id)}/>)}
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

            {/* SINYAL BESOK */}
            {/* SINYAL DISEMATKAN */}
            {sigFilter==="Semua" && signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).length>0 && (
              <div style={{ background:"rgba(6,182,212,0.04)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:16,padding:"14px 16px",marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#06b6d4",fontWeight:900,fontSize:14 }}>📌 Sinyal Disematkan</span>
                  <span style={{ color:"rgba(6,182,212,0.5)",fontSize:11 }}>{signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).length} sinyal</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).map((s:any,i:number)=><SignalCard key={i} s={s} isDone={doneSignalIds.includes(s.id)}/>)}
                </div>
              </div>
            )}
            {sigFilter==="Semua" && signals.filter((s:any)=>s.is_tomorrow).length>0 && (
              <div style={{ background:"rgba(234,179,8,0.04)", border:"1px solid rgba(234,179,8,0.15)", borderRadius:16, padding:"14px 16px", marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ color:"#fbbf24", fontWeight:900, fontSize:14 }}>🌙 Sinyal Besok</span>
                  <span style={{ color:"rgba(251,191,36,0.5)", fontSize:11 }}>{signals.filter((s:any)=>s.is_tomorrow).length} sinyal</span>
                </div>
                {signals.filter((s:any)=>s.is_tomorrow).map((s:any)=>(
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10, marginBottom:6 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:"rgba(234,179,8,0.08)", border:"1px solid rgba(234,179,8,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fbbf24", flexShrink:0 }}>{(s.kode||"--").slice(0,4)}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>{s.kode}</span>
                        <span style={{ background:"rgba(234,179,8,0.15)", color:"#fbbf24", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:6 }}>{s.action}</span>
                      </div>
                      <span style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>Entry: {s.entry} · TP: {s.tp}{s.tp2?` · TP2: ${s.tp2}`:""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredSignals.filter((s:any)=>!s.is_tomorrow).length===0 && sigFilter==="Semua" ? (
              <div style={{ textAlign:"center", padding:"48px 16px" }}>
                <p style={{ fontSize:36, marginBottom:12 }}>📡</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Belum ada sinyal aktif.</p>
              </div>
            ) : filteredSignals.length===0 ? (
              <div style={{ textAlign:"center", padding:"48px 16px" }}>
                <p style={{ fontSize:36, marginBottom:12 }}>📡</p>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Belum ada sinyal {sigFilter !== "Semua" ? sigFilter : ""}.</p>
              </div>
            ) : (() => {
              // Group by date with dividers
              const todayStr = new Date().toLocaleDateString("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"long",year:"numeric"});
              const yestStr = new Date(Date.now()-86400000).toLocaleDateString("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"long",year:"numeric"});
              let lastDate = "";
              const items: React.ReactNode[] = [];
              filteredSignals.forEach((s, i) => {
                const d = new Date(s.created_at||Date.now());
                const dStr = d.toLocaleDateString("id-ID",{timeZone:"Asia/Jakarta",day:"2-digit",month:"long",year:"numeric"});
                const label = dStr === todayStr ? "Hari Ini" : dStr === yestStr ? "Kemarin" : dStr;
                if (dStr !== lastDate) {
                  lastDate = dStr;
                  items.push(
                    <div key={"div_"+i} style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0 4px" }}>
                      <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
                      <span style={{ fontSize:11, fontWeight:700, color:dStr===todayStr?"#60a5fa":"rgba(255,255,255,0.35)", background:dStr===todayStr?"rgba(30,90,240,0.12)":"rgba(255,255,255,0.04)", padding:"3px 10px", borderRadius:100, border:dStr===todayStr?"1px solid rgba(30,90,240,0.3)":"1px solid rgba(255,255,255,0.08)" }}>
                        {label}
                      </span>
                      <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
                    </div>
                  );
                }
                items.push(<SignalCard key={i} s={s} isDone={doneSignalIds.includes(s.id)}/>);
              });
              return <div style={{ display:"flex", flexDirection:"column", gap:12 }}>{items}</div>;
            })()}
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
                {bandarSignals.map((s,i)=><SignalCard key={i} s={s} isDone={doneSignalIds.includes(s.id)}/>)}
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
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {m.topics.map((t:string,i:number)=>(
                          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", background:"rgba(34,197,94,0.04)", borderRadius:10, padding:"10px 12px", border:"1px solid rgba(34,197,94,0.1)" }}>
                            <span style={{ color:"#22c55e", flexShrink:0, fontSize:15, marginTop:1 }}>✓</span>
                            <div>
                              <p style={{ color:"rgba(255,255,255,0.88)", fontSize:12, fontWeight:700, lineHeight:1.5 }}>{t.includes(":") ? t.split(":")[0] : t}</p>
                              {t.includes(":") && <p style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2, lineHeight:1.6 }}>{t.split(":").slice(1).join(":").trim()}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                      {MODULE_CONTENT[m.id]?.lessons && (
                        <div style={{ marginTop:14, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14 }}>
                          <p style={{ fontWeight:800, fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                            <span>📖</span> Materi Lengkap ({MODULE_CONTENT[m.id].lessons.length} pelajaran)
                          </p>
                          {MODULE_CONTENT[m.id].lessons.map((lesson:any, li:number) => (
                            <div key={li} style={{ marginBottom:10, background:"rgba(255,255,255,0.02)", borderRadius:10, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.05)" }}>
                              <p style={{ fontWeight:800, fontSize:12, color:"#fff", marginBottom:6 }}>{li+1}. {lesson.title}</p>
                              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:11, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{lesson.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
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
        {tab==="feed" && (
          <div style={{ padding:"16px" }}>
            <FeedTabVIP />
          </div>
        )}
        {tab==="modul" && (
          <div style={{ padding:"16px" }}>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ color:"#fff", fontWeight:900, fontSize:18, marginBottom:4 }}>Modul Edukasi Trading Saham</h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Kamu punya akses ke <span style={{ color:"#fff", fontWeight:700 }}>{myModules.length} modul</span> dari total {ALL_MODULES.length} modul. {lockedModules.length>0&&`Upgrade untuk unlock ${lockedModules.length} modul lagi.`}</p>
            </div>
            <div className="space-y-3 mb-8">
              {myModules.map((m:any)=>(
                <TiltCard key={m.id}>
                  <div className="card rounded-xl overflow-hidden">
                    <button onClick={()=>setExpandedModul(expandedModul===m.id?null:m.id)} className="w-full p-4 flex items-start gap-3 text-left">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[m.tag]||"bg-white/10 text-slate-400"}`}>{m.tag}</span>
                        </div>
                        <h3 className="text-white text-sm font-bold leading-snug">{m.title}</h3>
                        {expandedModul!==m.id&&<p className="text-slate-500 text-xs mt-1 line-clamp-2">{m.desc}</p>}
                      </div>
                      <svg className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-1 transition-transform ${expandedModul===m.id?"rotate-180":""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {expandedModul===m.id&&(
                      <div className="px-4 pb-6 border-t border-white/5">
                        <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{m.desc}</p>
                        <div className="mb-5">
                          <p className="text-xs text-cyan-400 font-bold mb-2 uppercase tracking-wider">✦ Yang akan kamu pelajari:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {m.topics.map((t:string,i:number)=>(
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                                <span className="text-green-400 flex-shrink-0 font-bold">✓</span>{t}
                              </div>
                            ))}
                          </div>
                        </div>
                        {MODULE_CONTENT[m.id]?.image && (
                          <div className="mb-5">
                            <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Contoh Chart & Diagram:</p>
                            <div className="rounded-xl overflow-hidden border border-cyan-500/20">
                              <img src={MODULE_CONTENT[m.id].image} alt={m.title} className="w-full object-cover" style={{maxHeight:320}} />
                            </div>
                          </div>
                        )}
                        {MODULE_CONTENT[m.id]?.lessons && (
                          <div className="space-y-3">
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Panduan Detail:</p>
                            {MODULE_CONTENT[m.id].lessons.map((lesson:any, li:number)=>(
                              <div key={li} className="bg-white/3 border border-white/8 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-black flex items-center justify-center flex-shrink-0">{li+1}</span>
                                  <span className="text-white text-xs font-bold">{lesson.title}</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed pl-7 whitespace-pre-line">{lesson.body}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
            {lockedModules.length>0&&(
              <div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">Modul Terkunci (Upgrade untuk Akses)</h3>
                <div className="space-y-2">
                  {lockedModules.map((m:any)=>(
                    <div key={m.id} className="card rounded-xl p-4 opacity-40 flex items-center gap-3">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PKG_COLORS[m.pkgLabel.toLowerCase()]||""}`}>{m.pkgLabel}</span>
                        <h3 className="text-white text-sm font-bold mt-1">{m.title}</h3>
                      </div>
                      <span className="ml-auto text-slate-500 text-lg">🔒</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20paket!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Upgrade Paket</a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI ANALYST TAB ── */}
        {tab==="ai" && (
          <div style={{ padding:"0 16px 100px" }}>
            {pkgLevel < 2 ? (
              <div style={{ textAlign:"center", padding:"48px 24px", marginTop:16 }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
                <h2 style={{ fontWeight:900, fontSize:20, marginBottom:8 }}>Fitur Eksklusif Gold+</h2>
                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:1.7, marginBottom:24 }}>
                  RC-AI Analyst hanya tersedia untuk paket <strong style={{ color:"#f59e0b" }}>Gold, Pro, Platinum</strong>, dan <strong style={{ color:"#a855f7" }}>Elite</strong>.
                </p>
                <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:16, padding:"16px", marginBottom:20, textAlign:"left" }}>
                  {["Analisis saham BEI 24/7 oleh RC-AI","Upload screenshot chart untuk analisis visual","Rekomendasi entry, TP, SL otomatis","Analisis fundamental laporan keuangan","Deteksi akumulasi bandarmologi via AI","Sentiment analysis berita real-time"].map((f,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                      <span style={{ color:"#f59e0b", fontSize:12, flexShrink:0 }}>✦</span>
                      <span style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20ke%20Gold%20untuk%20akses%20RC-AI!" target="_blank" style={{ display:"block", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#000", fontWeight:900, fontSize:14, padding:"14px", borderRadius:14, textDecoration:"none" }}>
                  Upgrade ke Gold Sekarang
                </a>
              </div>
            ) : (
              <>
                <div style={{ background:"linear-gradient(135deg,rgba(30,90,240,0.1),rgba(6,182,212,0.08))",border:"1px solid rgba(6,182,212,0.2)",borderRadius:20,padding:"20px",textAlign:"center",marginBottom:16,marginTop:8 }}>
                  <div style={{ fontSize:36,marginBottom:8 }}>🤖</div>
                  <h2 style={{ fontWeight:900,fontSize:18,marginBottom:6 }}>RC-AI Analyst</h2>
                  <p style={{ color:"rgba(255,255,255,0.45)",fontSize:13,lineHeight:1.6,marginBottom:16 }}>Analisis saham BEI dengan AI — teknikal, fundamental, bandarmologi. Kirim chart untuk analisis visual!</p>
                  <a href="/ai" style={{ display:"block",background:"linear-gradient(135deg,#06b6d4,#1e5af0)",color:"#fff",fontWeight:800,fontSize:14,padding:"13px",borderRadius:14,textDecoration:"none" }}>
                    🚀 Buka RC-AI Chat
                  </a>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16 }}>
                  {[
                    {icon:"📊",t:"Analisis Teknikal",d:"Support, resistance, pola chart"},
                    {icon:"🔍",t:"Analisis Fundamental",d:"Laporan keuangan & valuasi"},
                    {icon:"🎯",t:"Rekomendasi TP/SL",d:"Entry, target, stop loss optimal"},
                    {icon:"🖼️",t:"Analisis Chart",d:"Upload screenshot chart kamu"},
                    {icon:"🏦",t:"Bandarmologi",d:"Deteksi akumulasi smart money"},
                    {icon:"🧠",t:"Psikologi Trading",d:"Kelola emosi & bias kognitif"},
                  ].map((f,i)=>(
                    <a key={i} href="/ai" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 12px",textDecoration:"none",display:"block" }}>
                      <div style={{ fontSize:22,marginBottom:6 }}>{f.icon}</div>
                      <div style={{ color:"#fff",fontWeight:800,fontSize:12,marginBottom:3 }}>{f.t}</div>
                      <div style={{ color:"rgba(255,255,255,0.35)",fontSize:10,lineHeight:1.4 }}>{f.d}</div>
                    </a>
                  ))}
                </div>
              </>
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
                        <span title="Verified" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:"#1D9BF0",flexShrink:0 }}><svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
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
            {/* Contact Admin */}
            <div style={{ marginTop:12 }}>
              <h3 style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>📞 Kontak Admin</h3>
              <a href="https://wa.me/6282218723401?text=Halo%20Admin%20RITEL%20COMMUNITY.ID" target="_blank" rel="noreferrer"
                style={{ display:"flex",alignItems:"center",gap:12,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:14,padding:"14px 16px",textDecoration:"none" }}>
                <div style={{ width:40,height:40,borderRadius:"50%",background:"rgba(37,211,102,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📱</div>
                <div>
                  <p style={{ fontWeight:800,fontSize:14,color:"#25d366" }}>WhatsApp Admin</p>
                  <p style={{ color:"rgba(255,255,255,0.4)",fontSize:11 }}>082218723401 · Chat sekarang</p>
                </div>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(4,6,15,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"6px 0 20px", display:"flex", alignItems:"center", justifyContent:"space-around", overflowX:"auto" }}>
        {[
          { id:"home", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label:"Beranda" },
          { id:"feed", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label:"Feed" },
          { id:"sinyal", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label:"Sinyal" },
          { id:"bandar", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, label:"Bandar" },
          { id:"bagger", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, label:"Bagger" },
          { id:"modul", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label:"Modul" },
          { id:"ai", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>, label:"RC-AI" },
          { id:"profile", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:"Profil" },
        ].map(item => (
          <button key={item.id} onClick={()=>setTab(item.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 12px", position:"relative", transition:"all 0.2s" }}>
            {tab===item.id && <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", width:36, height:3, background:"linear-gradient(90deg,transparent,#06b6d4,transparent)", borderRadius:3, boxShadow:"0 0 8px rgba(6,182,212,0.9), 0 0 16px rgba(6,182,212,0.5)" }}/>}
            {tab===item.id && <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)", borderRadius:10, pointerEvents:"none" }}/>}
            <span style={{ color: tab===item.id ? "#06b6d4" : "rgba(255,255,255,0.35)", transition:"all 0.2s", filter: tab===item.id ? "drop-shadow(0 0 4px rgba(6,182,212,0.8))" : "none" }}>{item.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, color: tab===item.id ? "#06b6d4" : "rgba(255,255,255,0.3)", transition:"all 0.2s", textShadow: tab===item.id ? "0 0 8px rgba(6,182,212,0.8)" : "none" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


