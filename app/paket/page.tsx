"use client";
import { useState } from "react";
import Link from "next/link";
import { packages, vipModules } from "@/lib/data";

const colorMap: any = {
  blue: { border:"border-blue-500/40", glow:"shadow-blue-500/20", badge:"bg-blue-500", accent:"text-blue-400", bg:"from-blue-600 to-blue-800" },
  cyan: { border:"border-cyan-500/40", glow:"shadow-cyan-500/20", badge:"bg-cyan-500", accent:"text-cyan-400", bg:"from-cyan-600 to-blue-700" },
  gold: { border:"border-yellow-500/40", glow:"shadow-yellow-500/20", badge:"bg-yellow-500", accent:"text-yellow-400", bg:"from-yellow-500 to-orange-600" },
  purple: { border:"border-purple-500/40", glow:"shadow-purple-500/20", badge:"bg-purple-500", accent:"text-purple-400", bg:"from-purple-600 to-indigo-700" },
  platinum: { border:"border-slate-400/40", glow:"shadow-slate-400/20", badge:"bg-slate-400", accent:"text-slate-300", bg:"from-slate-400 to-slate-600" },
  elite: { border:"border-yellow-400/60", glow:"shadow-yellow-400/30", badge:"bg-yellow-400", accent:"text-yellow-400", bg:"from-yellow-400 via-yellow-500 to-orange-500" },
};

export default function PaketPage() {
  const [selected, setSelected] = useState<string|null>(null);

  return (
    <div className="min-h-screen bg-[#020818] pt-6 pb-20 px-4">
      {/* Back */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
          ← Kembali ke Beranda
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6 text-sm text-blue-300">
            👑 Semua Paket VIP
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Pilih Paket <span className="gradient-text">Terbaik</span> Anda
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">6 pilihan paket dari Rp 100.000 hingga Rp 1.000.000 — sesuai kebutuhan dan level investasi Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const c = colorMap[pkg.color] || colorMap.blue;
            return (
              <div key={pkg.id} className={`relative card-glass rounded-2xl p-6 border-2 ${c.border} hover:shadow-xl ${c.glow} transition-all duration-300 hover:scale-[1.02] ${pkg.popular ? "ring-2 ring-yellow-500/50" : ""} ${pkg.isElite ? "ring-2 ring-yellow-400/70" : ""}`}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-yellow-500 text-[#020818] text-xs font-black px-4 py-1 rounded-full">⭐ TERLARIS</span></div>}
                {pkg.isElite && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-yellow-400 text-[#020818] text-xs font-black px-4 py-1 rounded-full">👑 ELITE</span></div>}
                {pkg.hasAI && <div className="absolute top-4 right-4"><span className="text-xs bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-1 rounded-full">🤖 AI</span></div>}

                <div className={`text-2xl font-black ${c.accent} mb-1`}>{pkg.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-white">{pkg.priceLabel}</span>
                  <span className="text-slate-400 text-sm pb-1">{pkg.period}</span>
                </div>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">{pkg.description}</p>

                {/* WA Group highlight */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 mb-4 text-xs text-green-300 flex items-center gap-2">
                  <span>💬</span>
                  <span>Grup WA <strong>{pkg.name}</strong> — komunitas eksklusif</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className={`${c.accent} mt-0.5 flex-shrink-0`}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a href={`https://wa.me/6282218723401?text=Halo%20min%20saya%20mau%20order%20paket%20${pkg.name}%20${pkg.priceLabel}`} target="_blank"
                  className={`w-full block text-center py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] bg-gradient-to-r ${c.bg} text-white`}>
                  Order Paket {pkg.name} →
                </a>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-16 card-glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-blue-500/20">
            <h2 className="text-xl font-black text-white">Perbandingan Fitur</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-500/10">
                  <th className="text-left px-6 py-3 text-slate-400 font-medium">Fitur</th>
                  {packages.map(p => <th key={p.id} className="px-4 py-3 text-center text-slate-300 font-bold whitespace-nowrap">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sinyal Harian","✓","✓","✓","✓","✓","✓"],
                  ["Berita Realtime","✓","✓","✓","✓","✓","✓"],
                  ["Chart IHSG","✓","✓","✓","✓","✓","✓"],
                  ["Modul Fundamental","–","✓","✓","✓","✓","✓"],
                  ["Saham Bagger","–","✓","✓","✓","✓","✓"],
                  ["Sinyal Premium TP/SL","–","–","✓","✓","✓","✓"],
                  ["Modul Psikologi","–","–","✓","✓","✓","✓"],
                  ["AI Agent","–","–","–","✓","✓","✓"],
                  ["Konsultasi 1-on-1","–","–","–","–","✓","✓"],
                  ["Mentor Langsung","–","–","–","–","–","✓"],
                  ["Grup WA","✓","✓","✓","✓","✓","✓"],
                ].map(([feature,...vals]) => (
                  <tr key={feature as string} className="border-b border-blue-500/5 hover:bg-blue-500/5">
                    <td className="px-6 py-3 text-slate-300">{feature}</td>
                    {vals.map((v,i) => (
                      <td key={i} className={`px-4 py-3 text-center font-bold ${v==="✓" ? "text-green-400" : "text-slate-600"}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm mb-4">Ada pertanyaan tentang paket? Hubungi kami langsung!</p>
          <a href="https://wa.me/6282218723401" target="_blank" className="btn-gold inline-block px-10 py-4 rounded-xl font-black text-base">
            📱 Chat dengan Admin
          </a>
        </div>
      </div>

      {/* Live Chat */}
      <a href="https://wa.me/6282218723401" target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
