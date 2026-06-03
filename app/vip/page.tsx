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
   topics:["Perencanaan alokasi portofolio awal","Monitoring & rebalancing aktif bulanan","Laporan performance personal bulanan","Identifikasi drag performance & solusinya","Strategi exit & profit taking terencana","Target return & timeline finansial personal"]},,

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
      fetch("/api/admin/sync").then(r=>r.json()).then((data:any) => {
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
  const mySignals = signals.filter(s => {
    const pkg = s.package || [];
    return pkg.includes(user?.package) || pkg.includes("all");
  });
  const filteredSignals = (sigFilter==="Semua" ? mySignals : mySignals.filter((s:any)=>s.action===sigFilter)).filter((s:any)=>!s.is_tomorrow);
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

            {/* SINYAL BESOK */}
            {/* SINYAL DISEMATKAN */}
            {sigFilter==="Semua" && signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).length>0 && (
              <div style={{ background:"rgba(6,182,212,0.04)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:16,padding:"14px 16px",marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ color:"#06b6d4",fontWeight:900,fontSize:14 }}>📌 Sinyal Disematkan</span>
                  <span style={{ color:"rgba(6,182,212,0.5)",fontSize:11 }}>{signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).length} sinyal</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {signals.filter((s:any)=>s.is_pinned&&!s.is_tomorrow).map((s:any,i:number)=><SignalCard key={i} s={s}/>)}
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
                items.push(<SignalCard key={i} s={s}/>);
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

