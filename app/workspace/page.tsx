"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ============================================================
   ICONS
   ============================================================ */
const Icon = {
  Back:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Seed:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 7-9 4 1 7 5 7 9a7 7 0 0 1-7 7z"/></svg>,
  Book:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Radar:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6l.01.01"/><path d="M2.05 11a10 10 0 0 0 2.02 8.93"/><path d="M12 2v4"/><path d="M12 12l6.24 3.12"/><circle cx="12" cy="12" r="10"/></svg>,
  Shield:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.5 8.5-4-1-7.5-3.5-7.5-8.5V6l7.5-3 7.5 3v7Z"/></svg>,
  Brain:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.5H7a2.5 2.5 0 0 1-2.5-2.5v-.5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2v-1a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2v-.5A2.5 2.5 0 0 1 7 3h.54A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.5H17a2.5 2.5 0 0 0 2.5-2.5v-.5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2v-1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2v-.5A2.5 2.5 0 0 0 17 3h-.54A2.5 2.5 0 0 0 14.5 2z"/></svg>,
  Trophy:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M17 5V3H7v2M17 5a5 5 0 0 1-5 5 5 5 0 0 1-5-5M17 5h3a2 2 0 0 1-2 4M7 5H4a2 2 0 0 0 2 4"/></svg>,
  Check:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lock:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  TrendUp:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Globe:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>,
};

type Track = "saham" | "forex";

/* ============================================================
   JOURNEY DATA — Saham track
   ============================================================ */
const sahamStages = [
  { id: "s1", title: "Dasar Pasar Modal", icon: <Icon.Seed />, desc: "Memahami cara kerja bursa, lot, fraksi harga, dan mekanisme jual-beli saham." },
  { id: "s2", title: "Membaca Laporan Fundamental", icon: <Icon.Book />, desc: "Belajar membaca laporan keuangan, rasio valuasi, dan kesehatan emiten." },
  { id: "s3", title: "Screening & Watchlist", icon: <Icon.Radar />, desc: "Menyaring saham potensial dari ribuan emiten menjadi watchlist personal." },
  { id: "s4", title: "Analisis Teknikal", icon: <Icon.TrendUp />, desc: "Membaca pola candlestick, support-resistance, dan indikator momentum." },
  { id: "s5", title: "Manajemen Risiko & Modal", icon: <Icon.Shield />, desc: "Menentukan ukuran posisi, stop-loss, dan rasio risk-reward setiap transaksi." },
  { id: "s6", title: "Psikologi & Konsistensi", icon: <Icon.Brain />, desc: "Mengendalikan emosi, disiplin mengikuti rencana, dan bertahan jangka panjang." },
];

/* ============================================================
   JOURNEY DATA — Forex track
   ============================================================ */
const forexStages = [
  { id: "f1", title: "Mengenal Pasar Forex", icon: <Icon.Globe />, desc: "Memahami pair mata uang, pip, lot, leverage, dan jam sesi perdagangan dunia." },
  { id: "f2", title: "Analisis Fundamental Makro", icon: <Icon.Book />, desc: "Membaca dampak suku bunga, inflasi, dan berita ekonomi terhadap nilai tukar." },
  { id: "f3", title: "Price Action & Chart Pattern", icon: <Icon.Radar />, desc: "Mengidentifikasi struktur harga, order block, dan pola pembalikan tren." },
  { id: "f4", title: "Strategi Entry & Exit", icon: <Icon.TrendUp />, desc: "Menyusun rencana entry, target profit, dan stop-loss berbasis data." },
  { id: "f5", title: "Manajemen Risiko & Leverage", icon: <Icon.Shield />, desc: "Mengatur ukuran lot dan leverage agar akun bertahan dari volatilitas pasar." },
  { id: "f6", title: "Disiplin Trading Plan", icon: <Icon.Brain />, desc: "Menjalankan trading plan secara konsisten tanpa terpengaruh emosi pasar." },
];

const STORAGE_KEY = "trading_journey_progress_v1";

function Header() {
  return (
    <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors">
        <Icon.Back /> Beranda
      </Link>
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Workspace</span>
    </div>
  );
}

export default function WorkspacePage() {
  const [track, setTrack] = useState<Track>("saham");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleStage = (id: string) => {
    const updated = { ...done, [id]: !done[id] };
    setDone(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  const stages = track === "saham" ? sahamStages : forexStages;
  const completedCount = stages.filter(s => done[s.id]).length;
  const progressPct = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="min-h-screen bg-[#030712] pt-8 pb-24 px-4">
      <div className="galaxy-stars" />
      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="index-badge w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-blue-600/40 text-blue-400">
            <Icon.TrendUp />
          </div>
          <h1 className="headline text-2xl md:text-3xl tracking-wider mb-3">
            PERJALANAN <span className="accent">TRADING</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
            Peta jalan belajar terstruktur — dari dasar pasar modal sampai konsistensi psikologi trading,
            untuk Saham dan Forex.
          </p>
        </div>

        {/* Track switch */}
        <div className="max-w-4xl mx-auto mb-8 flex justify-center">
          <div className="flex rounded-lg overflow-hidden border border-neutral-800">
            <button
              onClick={() => setTrack("saham")}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${track === "saham" ? "bg-blue-600 text-white" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
            >
              Saham
            </button>
            <button
              onClick={() => setTrack("forex")}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${track === "forex" ? "bg-blue-600 text-white" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
            >
              Forex
            </button>
          </div>
        </div>

        {/* Progress summary */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="glass-card p-5 flex items-center gap-5 flex-wrap">
            <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Icon.Trophy />
            </div>
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-300 text-xs font-bold uppercase tracking-wider">Progres {track === "saham" ? "Saham" : "Forex"}</span>
                <span className="text-blue-400 text-xs font-black">{completedCount}/{stages.length} Tahap</span>
              </div>
              <div className="risk-meter-track">
                <div className="risk-meter-fill" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#2563EB,#3B82F6)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Journey timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8">
            <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent" />
            {stages.map((stage, i) => {
              const isDone = !!done[stage.id];
              const isNext = !isDone && stages.slice(0, i).every(s => done[s.id]);
              const isLocked = !isDone && !isNext;
              return (
                <div key={stage.id} className="relative mb-5 last:mb-0">
                  <div
                    className={`absolute -left-8 top-5 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10
                      ${isDone ? "bg-blue-600 border-blue-600 text-white" : isNext ? "bg-[#08111F] border-blue-500 text-blue-400" : "bg-[#08111F] border-neutral-800 text-neutral-700"}`}
                  >
                    {isDone ? <Icon.Check /> : isLocked ? <Icon.Lock /> : <span className="text-[10px] font-black">{i + 1}</span>}
                  </div>

                  <div
                    className={`glass-card p-5 transition-opacity ${isLocked ? "opacity-50" : "opacity-100"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                        {stage.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h3 className="text-neutral-100 font-bold text-sm">{stage.title}</h3>
                          <button
                            onClick={() => toggleStage(stage.id)}
                            disabled={isLocked}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors
                              ${isDone ? "bg-blue-600/10 border border-blue-600/40 text-blue-400" : "bg-white/5 border border-neutral-800 text-neutral-400 hover:text-neutral-200"}
                              ${isLocked ? "cursor-not-allowed opacity-50" : ""}`}
                          >
                            {isDone ? <><Icon.Check /> Selesai</> : "Tandai Selesai"}
                          </button>
                        </div>
                        <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="glass-card p-6 text-center">
            <p className="text-neutral-400 text-xs mb-4 leading-relaxed">
              Ingin dampingan langsung, sinyal harian, dan modul lengkap di setiap tahap perjalananmu?
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/paket" className="btn-primary px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider">
                Lihat Paket VIP
              </Link>
              <a
                href="https://wa.me/6289663874700"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider border border-neutral-800 text-neutral-300 hover:border-blue-600/40 hover:text-blue-400 transition-colors"
              >
                WhatsApp Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
