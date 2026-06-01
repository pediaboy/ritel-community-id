"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { vipModules } from "@/lib/data";

const pkgConfig: any = {
  basic:    { label:"Basic",    color:"#38bdf8", bg:"rgba(14,165,233,0.12)", icon:"🌊", modules:["fundamental"] },
  silver:   { label:"Silver",   color:"#22d3ee", bg:"rgba(34,211,238,0.12)", icon:"⚡", modules:["fundamental","bagger","potensi"] },
  gold:     { label:"Gold",     color:"#fbbf24", bg:"rgba(245,158,11,0.15)", icon:"🥇", modules:["fundamental","bagger","potensi","risk","money"] },
  pro:      { label:"Pro",      color:"#c084fc", bg:"rgba(147,51,234,0.12)", icon:"🤖", modules:["fundamental","bagger","potensi","risk","money","emosi"] },
  platinum: { label:"Platinum", color:"#cbd5e1", bg:"rgba(148,163,184,0.12)",icon:"💎", modules:["fundamental","bagger","potensi","risk","money","emosi"] },
  elite:    { label:"Elite",    color:"#fbbf24", bg:"rgba(251,191,36,0.15)", icon:"👑", modules:["fundamental","bagger","potensi","risk","money","emosi"] },
};

const signalPackages = ["gold","pro","platinum","elite"];
const aiPackages = ["pro","platinum","elite"];

export default function VIPPage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [tab, setTab] = useState<"dashboard"|"modul"|"sinyal"|"ai">("dashboard");
  const [signals, setSignals] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<string|null>(null);
  const [aiChat, setAiChat] = useState<{role:"user"|"ai", text:string}[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vip_member");
    if (!stored) { router.push("/login"); return; }
    const m = JSON.parse(stored);
    setMember(m);
    // Load data
    fetch("/api/admin/signals").then(r=>r.json()).then(d => {
      const pkg = m.package;
      setSignals((d.signals||[]).filter((s:any) => (s.package||[]).includes(pkg)));
    });
    fetch("/api/news").then(r=>r.json()).then(d => setNews((d.news||[]).slice(0,6)));
  }, []);

  const logout = () => {
    localStorage.removeItem("vip_member");
    router.push("/");
  };

  if (!member) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#020818" }}>
      <div className="text-slate-400 text-sm">Memuat...</div>
    </div>
  );

  const cfg = pkgConfig[member.package] || pkgConfig.basic;
  const daysLeft = Math.max(0, Math.ceil((new Date(member.expiredAt).getTime() - Date.now()) / 86400000));
  const hasSignal = signalPackages.includes(member.package);
  const hasAI = aiPackages.includes(member.package);
  const accessModules = vipModules.filter(m => cfg.modules.includes(m.id));

  // AI mock responses
  const sendAI = () => {
    if (!aiInput.trim() || aiLoading) return;
    const q = aiInput.trim();
    setAiChat(prev => [...prev, { role:"user", text:q }]);
    setAiInput("");
    setAiLoading(true);
    setTimeout(() => {
      const responses: any = {
        default: "Sebagai AI Agent Ritel Community, saya sarankan untuk selalu analisis fundamental sebelum entry. Pastikan lihat volume dan konfirmasi teknikal terlebih dahulu.",
        bbca: "BBCA saat ini dalam tren bullish jangka menengah. Level support kuat di 9.600-9.700. Jika breakout 10.000 dengan volume tinggi, target selanjutnya 10.500. Risk management: SL di bawah 9.500.",
        antm: "ANTM berkorelasi dengan harga emas global. Saat harga emas di atas $2.300/oz, ANTM cenderung outperform. Watch level 1.600-1.650 sebagai entry area.",
        goto: "GOTO sudah profitabel untuk pertama kali. Katalis positif jangka menengah. Accumulate di area 80-90 dengan target 120 dalam 3-6 bulan.",
        ihsg: "IHSG saat ini dalam fase konsolidasi. Support kuat di 7.100-7.200. Jika tembus 7.500 dengan volume positif, momentum bullish berlanjut ke 7.800.",
      };
      const lower = q.toLowerCase();
      let reply = responses.default;
      if (lower.includes("bbca") || lower.includes("bca")) reply = responses.bbca;
      else if (lower.includes("antm") || lower.includes("antam")) reply = responses.antm;
      else if (lower.includes("goto") || lower.includes("gojek")) reply = responses.goto;
      else if (lower.includes("ihsg") || lower.includes("indeks")) reply = responses.ihsg;
      setAiChat(prev => [...prev, { role:"ai", text:reply }]);
      setAiLoading(false);
    }, 1200);
  };

  const actionStyle: any = {
    BUY:   { color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.3)" },
    SELL:  { color:"#f87171", bg:"rgba(248,113,113,0.1)",  border:"rgba(248,113,113,0.3)" },
    HOLD:  { color:"#facc15", bg:"rgba(250,204,21,0.1)",   border:"rgba(250,204,21,0.3)" },
    ANTRI: { color:"#38bdf8", bg:"rgba(56,189,248,0.1)",   border:"rgba(56,189,248,0.3)" },
  };

  return (
    <div className="min-h-screen" style={{ background:"#020818" }}>

      {/* ── TOPBAR ── */}
      <header style={{ background:"rgba(5,15,44,0.98)", borderBottom:"1px solid rgba(14,165,233,0.15)", backdropFilter:"blur(12px)" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ background:"linear-gradient(135deg,#0ea5e9,#22d3ee)" }}>RC</div>
              <span className="text-white font-black text-sm hidden sm:block">RITEL COMMUNITY<span className="text-blue-400">.ID</span></span>
            </Link>
            <div className="h-5 w-px hidden sm:block" style={{ background:"rgba(14,165,233,0.2)" }}/>
            <span className="text-xs font-bold hidden sm:block" style={{ color: cfg.color }}>Area VIP {cfg.label}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Member badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: cfg.bg, border:`1px solid ${cfg.color}30` }}>
              <span className="text-sm">{cfg.icon}</span>
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
            <div className="text-xs text-slate-400 hidden md:block">{member.name}</div>
            <button onClick={logout} className="text-xs px-3 py-1.5 rounded-xl transition-all text-slate-400 hover:text-white" style={{ border:"1px solid rgba(255,255,255,0.1)" }}>Keluar</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              {/* Member card */}
              <div className="rounded-2xl p-5 mb-4" style={{ background:"rgba(10,26,62,0.8)", border:`1px solid ${cfg.color}30` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto" style={{ background: cfg.bg }}>
                  {cfg.icon}
                </div>
                <p className="text-white font-bold text-sm text-center">{member.name}</p>
                <div className="text-xs text-center mt-1 font-bold" style={{ color: cfg.color }}>Paket {cfg.label}</div>
                <div className="mt-3 pt-3" style={{ borderTop:"1px solid rgba(14,165,233,0.1)" }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Aktif</span>
                    <span className={daysLeft <= 7 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{daysLeft} hari</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background:"rgba(255,255,255,0.1)" }}>
                    <div className="h-1.5 rounded-full" style={{ width:`${Math.min(100, (daysLeft/30)*100)}%`, background: daysLeft <= 7 ? "#ef4444" : "#22c55e" }}/>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="space-y-1">
                {[
                  { id:"dashboard", icon:"🏠", label:"Dashboard" },
                  { id:"modul",     icon:"📚", label:"Modul VIP" },
                  { id:"sinyal",    icon:"⚡", label:"Sinyal Premium", locked:!hasSignal },
                  { id:"ai",        icon:"🤖", label:"AI Agent",       locked:!hasAI },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => !item.locked && setTab(item.id as any)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
                    style={{
                      background: tab === item.id ? "rgba(14,165,233,0.15)" : "transparent",
                      color: tab === item.id ? "#38bdf8" : item.locked ? "#334155" : "#94a3b8",
                      border: tab === item.id ? "1px solid rgba(14,165,233,0.3)" : "1px solid transparent",
                      cursor: item.locked ? "not-allowed" : "pointer",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.locked && <span className="ml-auto text-xs">🔒</span>}
                  </button>
                ))}
              </div>

              <a href="https://wa.me/6282218723401" target="_blank" className="mt-4 block text-center text-xs py-2.5 rounded-xl font-bold transition-all" style={{ background:"rgba(34,197,94,0.1)", color:"#4ade80", border:"1px solid rgba(34,197,94,0.25)" }}>
                📱 Hubungi Admin
              </a>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">

            {/* Mobile tab bar */}
            <div className="lg:hidden flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
              {[["dashboard","🏠","Dashboard"],["modul","📚","Modul"],["sinyal","⚡","Sinyal"],["ai","🤖","AI"]].map(([id,icon,lbl]) => {
                const locked = (id==="sinyal"&&!hasSignal)||(id==="ai"&&!hasAI);
                return (
                  <button key={id} onClick={() => !locked && setTab(id as any)} disabled={locked}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: tab===id ? "rgba(14,165,233,0.2)" : "rgba(10,26,62,0.6)",
                      color: tab===id ? "#38bdf8" : locked ? "#334155" : "#64748b",
                      border: tab===id ? "1px solid rgba(14,165,233,0.4)" : "1px solid rgba(14,165,233,0.1)",
                    }}>
                    {icon} {lbl} {locked && "🔒"}
                  </button>
                );
              })}
            </div>

            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div className="space-y-5">
                {/* Welcome */}
                <div className="rounded-2xl p-6" style={{ background:`linear-gradient(135deg,rgba(14,165,233,0.08),rgba(34,211,238,0.05))`, border:"1px solid rgba(14,165,233,0.2)" }}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Selamat datang kembali 👋</p>
                      <h1 className="text-2xl font-black text-white">{member.name}</h1>
                      <p className="text-sm mt-1" style={{ color: cfg.color }}>Member {cfg.label} · {daysLeft} hari tersisa</p>
                    </div>
                    <div className="text-5xl">{cfg.icon}</div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["📊","Paket",cfg.label,cfg.color],
                    ["⚡","Sinyal",hasSignal?`${signals.length} aktif`:"Upgrade","#38bdf8"],
                    ["📚","Modul",`${accessModules.length} tersedia`,"#4ade80"],
                    ["🤖","AI Agent",hasAI?"Aktif":"Pro+","#c084fc"],
                  ].map(([icon,lbl,val,color]) => (
                    <div key={lbl} className="rounded-2xl p-4 text-center" style={{ background:"rgba(10,26,62,0.6)", border:"1px solid rgba(14,165,233,0.12)" }}>
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-xs text-slate-500 mb-0.5">{lbl}</div>
                      <div className="text-sm font-black" style={{ color: color as string }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* News */}
                <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(14,165,233,0.15)" }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ background:"rgba(10,26,62,0.8)", borderBottom:"1px solid rgba(14,165,233,0.1)" }}>
                    <h2 className="text-white font-black text-base">📰 Berita Terkini</h2>
                    <span className="text-xs text-green-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"/>Live</span>
                  </div>
                  <div className="divide-y" style={{ background:"rgba(5,15,44,0.5)", borderColor:"rgba(14,165,233,0.07)" }}>
                    {news.slice(0,5).map((n:any,i:number) => (
                      <a key={i} href={n.url} target="_blank" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors group">
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 font-bold" style={{ background:"rgba(14,165,233,0.1)", color:"#38bdf8" }}>{n.category}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">{n.title}</p>
                          <p className="text-slate-600 text-xs mt-1">{n.source} · {n.time}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Upgrade CTA if not elite */}
                {member.package !== "elite" && (
                  <div className="rounded-2xl p-5 text-center" style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)" }}>
                    <p className="text-yellow-300 font-semibold text-sm mb-2">👑 Upgrade ke paket lebih tinggi untuk akses fitur eksklusif!</p>
                    <a href="https://wa.me/6282218723401?text=Halo%20min%20saya%20mau%20upgrade%20paket" target="_blank" className="inline-block text-yellow-400 font-black text-sm hover:underline">Chat Admin untuk Upgrade →</a>
                  </div>
                )}
              </div>
            )}

            {/* ── MODUL ── */}
            {tab === "modul" && (
              <div>
                <h2 className="text-xl font-black text-white mb-5">📚 Modul VIP — Paket {cfg.label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accessModules.map(mod => (
                    <div key={mod.id} className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{ background:"rgba(10,26,62,0.7)", border: activeModule===mod.id ? "1px solid rgba(14,165,233,0.4)" : "1px solid rgba(14,165,233,0.15)" }}
                      onClick={() => setActiveModule(activeModule===mod.id?null:mod.id)}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{mod.icon}</span>
                        <div>
                          <h3 className="text-white font-black text-base">{mod.title}</h3>
                          <p className="text-slate-400 text-xs mt-0.5">{mod.content.length} topik</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{mod.description}</p>
                      {activeModule===mod.id && (
                        <div className="mt-4 space-y-3 pt-4" style={{ borderTop:"1px solid rgba(14,165,233,0.12)" }}>
                          {mod.content.map((c,i) => (
                            <div key={i} className="flex gap-3">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5" style={{ background:"rgba(14,165,233,0.15)", color:"#38bdf8" }}>{i+1}</div>
                              <div>
                                <p className="text-white font-semibold text-sm">{c.title}</p>
                                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{c.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs mt-3 font-semibold" style={{ color:"#38bdf8" }}>{activeModule===mod.id?"▲ Tutup":"▼ Buka konten"}</p>
                    </div>
                  ))}
                </div>

                {/* Locked modules */}
                {vipModules.filter(m => !cfg.modules.includes(m.id)).length > 0 && (
                  <div className="mt-5">
                    <p className="text-slate-600 text-xs mb-3 uppercase tracking-wider font-semibold">Terkunci — Upgrade untuk akses</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vipModules.filter(m => !cfg.modules.includes(m.id)).map(mod => (
                        <div key={mod.id} className="rounded-2xl p-5 opacity-40" style={{ background:"rgba(10,26,62,0.4)", border:"1px solid rgba(255,255,255,0.05)" }}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl grayscale">{mod.icon}</span>
                            <div>
                              <h3 className="text-slate-400 font-bold text-sm">🔒 {mod.title}</h3>
                              <p className="text-slate-600 text-xs">Upgrade paket untuk akses</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SINYAL ── */}
            {tab === "sinyal" && (
              <div>
                {!hasSignal ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-white font-black text-xl mb-2">Sinyal Premium</h2>
                    <p className="text-slate-400 text-sm mb-5">Fitur ini tersedia untuk paket Gold ke atas.</p>
                    <a href="https://wa.me/6282218723401" target="_blank" className="inline-block px-7 py-3 rounded-2xl font-bold text-sm" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#020818" }}>Upgrade Paket →</a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-black text-white">⚡ Sinyal Premium</h2>
                      <span className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.25)" }}>
                        {signals.length} sinyal aktif
                      </span>
                    </div>
                    {signals.length === 0 ? (
                      <div className="text-center py-16 text-slate-500 text-sm">Belum ada sinyal untuk paket Anda saat ini.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {signals.map((sig:any) => {
                          const st = actionStyle[sig.action]||actionStyle.HOLD;
                          return (
                            <div key={sig.id} className="rounded-2xl p-5" style={{ background:"rgba(10,26,62,0.7)", border:"1px solid rgba(14,165,233,0.15)" }}>
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <p className="text-slate-500 text-xs">{sig.kode}</p>
                                  <p className="text-white font-black">{sig.saham}</p>
                                </div>
                                <span className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ color:st.color, background:st.bg, border:`1px solid ${st.border}` }}>{sig.action}</span>
                              </div>
                              <div className="space-y-2.5 mb-4">
                                {[["Entry",sig.entry,"text-white"],["Target",sig.tp,"text-green-400"],["Stop Loss",sig.sl,"text-red-400"]].map(([l,v,c])=>(
                                  <div key={l as string} className="flex justify-between">
                                    <span className="text-slate-400 text-sm">{l}</span>
                                    <span className={`font-mono font-bold text-sm ${c}`}>{v}</span>
                                  </div>
                                ))}
                              </div>
                              {sig.notes && <p className="text-xs text-slate-400 italic pt-3" style={{ borderTop:"1px solid rgba(14,165,233,0.1)" }}>{sig.notes}</p>}
                              <p className="text-xs text-slate-600 mt-2">{new Date(sig.createdAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── AI AGENT ── */}
            {tab === "ai" && (
              <div>
                {!hasAI ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🤖</div>
                    <h2 className="text-white font-black text-xl mb-2">AI Agent</h2>
                    <p className="text-slate-400 text-sm mb-5">Tersedia untuk paket Pro, Platinum, dan Elite.</p>
                    <a href="https://wa.me/6282218723401" target="_blank" className="inline-block px-7 py-3 rounded-2xl font-bold text-sm" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#020818" }}>Upgrade ke Pro →</a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>🤖</div>
                      <div>
                        <h2 className="text-white font-black text-lg">AI Agent Ritel Community</h2>
                        <p className="text-slate-400 text-xs">Tanya analisis saham, strategi, atau apapun tentang investasi</p>
                      </div>
                    </div>

                    {/* Chat area */}
                    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ height:"480px", background:"rgba(5,15,44,0.9)", border:"1px solid rgba(14,165,233,0.2)" }}>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {aiChat.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-4">
                            <div className="text-5xl">🤖</div>
                            <p className="text-slate-400 text-sm">Halo! Saya AI Agent Ritel Community. Tanya apa saja tentang saham Indonesia!</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {["Analisis BBCA","Update IHSG hari ini","Strategi entry saham","ANTM prospek?"].map(q=>(
                                <button key={q} onClick={()=>{setAiInput(q);}} className="text-xs px-3 py-1.5 rounded-xl transition-all" style={{ background:"rgba(14,165,233,0.1)", color:"#38bdf8", border:"1px solid rgba(14,165,233,0.2)" }}>{q}</button>
                              ))}
                            </div>
                          </div>
                        )}
                        {aiChat.map((m,i)=>(
                          <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                            {m.role==="ai" && <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>🤖</div>}
                            <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                              style={{
                                background: m.role==="user" ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "rgba(30,50,90,0.8)",
                                color: "white",
                                borderBottomRightRadius: m.role==="user"?"4px":"16px",
                                borderBottomLeftRadius: m.role==="ai"?"4px":"16px",
                              }}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                        {aiLoading && (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>🤖</div>
                            <div className="px-4 py-3 rounded-2xl text-sm" style={{ background:"rgba(30,50,90,0.8)" }}>
                              <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"0ms" }}/>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"150ms" }}/>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay:"300ms" }}/>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input */}
                      <div className="p-3" style={{ borderTop:"1px solid rgba(14,165,233,0.12)" }}>
                        <div className="flex gap-2">
                          <input
                            value={aiInput}
                            onChange={e=>setAiInput(e.target.value)}
                            onKeyDown={e=>e.key==="Enter"&&sendAI()}
                            placeholder="Tanya tentang saham, strategi, IHSG..."
                            className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
                            style={{ background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.2)" }}
                          />
                          <button onClick={sendAI} disabled={aiLoading||!aiInput.trim()} className="px-4 py-3 rounded-xl font-bold text-sm transition-all" style={{ background:"linear-gradient(135deg,#0ea5e9,#0284c7)", color:"white", opacity: aiLoading||!aiInput.trim()?0.5:1 }}>
                            Kirim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
