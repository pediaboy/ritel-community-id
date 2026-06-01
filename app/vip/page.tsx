"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ===== LIVE INFO BOX =====
function LiveInfoBox() {
  const [info, setInfo] = useState<{ message: string; isActive: boolean } | null>(null);

  useEffect(() => {
    const load = () => {
      fetch("/api/admin/liveinfo").then(r => r.json()).then(d => {
        if (d.liveInfo?.isActive && d.liveInfo?.message?.trim()) {
          setInfo(d.liveInfo);
        } else {
          setInfo(null);
        }
      }).catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  if (!info) return null;

  return (
    <div className="live-info-box mb-6">
      <div className="flex items-start gap-3">
        <span className="text-yellow-400 text-xl mt-0.5 flex-shrink-0">📢</span>
        <div>
          <div className="text-yellow-400 text-xs font-black mb-1.5 tracking-wide">INFO DARI ADMIN</div>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{info.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function VipPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [tab, setTab] = useState("signals");

  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    const userStr = localStorage.getItem("vip_user");
    if (!token) { router.push("/login"); return; }
    if (userStr) {
      const u = JSON.parse(userStr);
      // Check if expired
      if (new Date(u.expiredAt) < new Date()) {
        localStorage.removeItem("vip_token");
        localStorage.removeItem("vip_user");
        router.push("/login");
        return;
      }
      setUser(u);
    }
    // Re-verify with server
    fetch("/api/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ token }) })
      .then(r => r.json()).then(d => {
        if (!d.success) {
          localStorage.removeItem("vip_token");
          localStorage.removeItem("vip_user");
          router.push("/login");
        } else {
          setUser(d.user);
          localStorage.setItem("vip_user", JSON.stringify(d.user));
        }
      }).catch(() => {});

    fetch("/api/admin/signals").then(r => r.json()).then(d => setSignals(d.signals || []));
  }, []);

  const logout = () => {
    localStorage.removeItem("vip_token");
    localStorage.removeItem("vip_user");
    router.push("/login");
  };

  const pkgColor: any = {
    basic:"text-slate-400", silver:"text-slate-300", gold:"text-yellow-400",
    pro:"text-blue-400", platinum:"text-purple-400", elite:"text-orange-400"
  };
  const actionColor: any = { BUY:"text-green-400 bg-green-400/10", SELL:"text-red-400 bg-red-400/10", HOLD:"text-yellow-400 bg-yellow-400/10", ANTRI:"text-blue-400 bg-blue-400/10" };

  const mySignals = signals.filter(s => (s.package || []).includes(user?.package));

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;

  const tabs = [["signals","⚡ Sinyal"], ["market","📈 Market"], ["ai","🤖 AI Agent"], ["modul","📚 Modul"]];
  const pkgLevel = ["basic","silver","gold","pro","platinum","elite"].indexOf(user.package);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
          <span className="text-white font-black text-sm hidden sm:block">RITEL COMMUNITY.ID</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-white text-xs font-bold">{user.name}</div>
            <div className={`text-xs font-bold capitalize ${pkgColor[user.package] || "text-white"}`}>{user.package}</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${pkgColor[user.package] || "text-white"} border border-current/30`}>
            {user.name?.charAt(0) || "V"}
          </div>
          <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">Logout</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Live Info */}
        <LiveInfoBox />

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-white mb-0.5">Selamat datang, {user.name}! 👋</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold capitalize px-2.5 py-1 rounded-full border ${pkgColor[user.package]}/20 border-current/30 ${pkgColor[user.package]}`}>
              Paket {user.package}
            </span>
            <span className="text-xs text-slate-500">
              Aktif hingga {new Date(user.expiredAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/5 mb-6 overflow-x-auto">
          {tabs.map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${tab===t ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-white"}`}>{l}</button>
          ))}
        </div>

        {/* SIGNALS */}
        {tab === "signals" && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-white font-bold text-sm">⚡ Sinyal Paket {user.package}</h2>
                <p className="text-slate-500 text-xs mt-0.5">{mySignals.length} sinyal tersedia untuk paket kamu</p>
              </div>
            </div>
            {mySignals.length === 0 ? (
              <div className="card rounded-2xl p-10 text-center">
                <p className="text-slate-500 text-sm mb-4">Belum ada sinyal untuk paket {user.package} saat ini.</p>
                <p className="text-slate-600 text-xs">Sinyal baru akan muncul saat admin menambahkan. Stay tuned!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mySignals.map((s, i) => (
                  <div key={i} className="card rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-black text-white text-lg">{s.kode}</div>
                        <div className="text-xs text-slate-500">{s.saham}</div>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action] || "text-white bg-white/10"}`}>{s.action}</span>
                    </div>
                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Target Profit</span><span className="text-green-400 font-medium">{s.tp}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Stop Loss</span><span className="text-red-400 font-medium">{s.sl}</span></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-400 border-t border-white/5 pt-3 leading-relaxed">{s.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MARKET */}
        {tab === "market" && (
          <div>
            <h2 className="text-white font-bold text-sm mb-4">📈 IHSG Live</h2>
            <div className="card rounded-2xl overflow-hidden">
              <iframe
                src="https://s.tradingview.com/widgetembed/?frameElementId=tv_vip&symbol=IDX%3ACOMPOSITE&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=0&toolbarbg=0D0D0D&studies=[]&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1"
                style={{ width:"100%", height:"400px", border:"none" }}
                title="IHSG Chart VIP"
              />
            </div>
          </div>
        )}

        {/* AI AGENT */}
        {tab === "ai" && (
          <div>
            {pkgLevel >= 3 ? (
              <div className="card rounded-2xl p-5 max-w-lg">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
                  <span className="font-bold text-white text-sm">AI Agent RC</span>
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                  <span className="text-xs text-green-400">Online</span>
                </div>
                <div className="py-8 text-center text-slate-500 text-sm">
                  <p>🤖 AI Agent aktif untuk paket kamu.</p>
                  <p className="text-xs mt-2">Hubungi admin untuk link akses AI Agent eksklusif.</p>
                  <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20akses%20AI%20Agent!" target="_blank" className="btn-primary text-xs px-5 py-2.5 rounded-xl inline-block mt-4">💬 Minta Akses AI Agent</a>
                </div>
              </div>
            ) : (
              <div className="card rounded-2xl p-8 text-center max-w-lg">
                <p className="text-slate-500 text-sm mb-2">🤖 AI Agent tersedia untuk Paket Pro ke atas.</p>
                <p className="text-slate-600 text-xs mb-4">Upgrade sekarang untuk akses AI Agent eksklusif.</p>
                <a href="https://wa.me/6282218723401?text=Halo%20min%20mau%20upgrade%20ke%20Pro!" target="_blank" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">Upgrade ke Pro</a>
              </div>
            )}
          </div>
        )}

        {/* MODUL */}
        {tab === "modul" && (
          <div>
            <h2 className="text-white font-bold text-sm mb-4">📚 Modul Edukasi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title:"Dasar Investasi Saham", desc:"Mengenal pasar modal, cara beli saham, dan strategi dasar.", pkg:0 },
                { title:"Analisis Fundamental", desc:"Membaca laporan keuangan, valuasi, dan screening saham.", pkg:1 },
                { title:"Analisis Teknikal", desc:"Chart pattern, indikator, dan strategi entry/exit.", pkg:2 },
                { title:"Bandarmologi & Tape Reading", desc:"Membaca pergerakan bandar dan order flow.", pkg:4 },
                { title:"Psikologi Trading", desc:"Manajemen emosi, disiplin, dan mindset profit konsisten.", pkg:2 },
                { title:"Bagger Pick Strategy", desc:"Strategi menemukan saham multi-bagger potensial.", pkg:2 },
              ].map((m, i) => (
                <div key={i} className={`card rounded-xl p-4 ${pkgLevel >= m.pkg ? "" : "opacity-50"}`}>
                  <h3 className="text-white text-sm font-bold mb-1">{m.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">{m.desc}</p>
                  {pkgLevel >= m.pkg ? (
                    <a href="https://wa.me/6282218723401?text=Halo%20min%20minta%20link%20modul!" target="_blank" className="text-xs text-blue-400 hover:underline">Akses Modul →</a>
                  ) : (
                    <span className="text-xs text-slate-600">🔒 Upgrade paket untuk akses</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
