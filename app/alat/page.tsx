"use client";
import { useState } from "react";
import Link from "next/link";

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id:"beranda", label:"Beranda", href:"/" },
    { id:"cari", label:"Cari", href:"/cari" },
    { id:"alat", label:"Alat", href:"/alat" },
    { id:"vip", label:"VIP", href:"/vip" },
    { id:"profil", label:"Profil", href:"/profil" },
  ];
  const icons: Record<string,any> = {
    beranda:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    cari:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>,
    vip:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    profil:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5" style={{background:"rgba(4,7,15,0.97)",backdropFilter:"blur(20px)"}}>
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map(t=>(
          <Link key={t.id} href={t.href} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active===t.id?"text-blue-400":"text-gray-600 hover:text-gray-400"}`}>
            <div className={active===t.id?"drop-shadow-[0_0_6px_rgba(30,90,240,0.8)]":""}>{icons[t.id]}</div>
            <span className="text-[10px] font-medium">{t.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ===== KALKULATOR ARA/ARB =====
function KalkulatorARAARB() {
  const [harga, setHarga] = useState("");
  const [mode, setMode] = useState<"reguler"|"akselerasi">("reguler");
  const [result, setResult] = useState<any>(null);

  const fraksi: [number,number,number][] = [
    [0, 200, 1], [200, 500, 2], [500, 2000, 5], [2000, 5000, 10],
    [5000, 10000, 25], [10000, 50000, 50], [50000, Infinity, 100],
  ];
  const getFraksi = (h: number) => fraksi.find(([lo, hi]) => h >= lo && h < hi)?.[2] || 1;

  const hitung = () => {
    const h = parseFloat(harga.replace(/\./g,"").replace(",","."));
    if (!h || h <= 0) return;
    const f = getFraksi(h);
    const pctARA = mode === "akselerasi" ? 0.25 : (h < 200 ? 0.35 : 0.25);
    const pctARB = mode === "akselerasi" ? -0.10 : -0.07;

    const ara = Math.ceil(h * (1 + pctARA) / f) * f;
    const arb = Math.floor(h * (1 + pctARB) / f) * f;

    // Generate steps
    const steps: number[] = [];
    let cur = h;
    for (let i = 0; i < 10; i++) {
      const nxt = Math.ceil(cur * (1 + pctARA) / getFraksi(cur)) * getFraksi(cur);
      steps.push(nxt);
      cur = nxt;
    }

    setResult({ ara, arb, f, steps, pctARA: (pctARA * 100).toFixed(0), pctARB: (Math.abs(pctARB)*100).toFixed(0) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
        {(["reguler","akselerasi"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode===m?"bg-blue-600 text-white":"text-gray-400"}`}>
            {m === "reguler" ? "Reguler" : "Akselerasi & FCA"}
          </button>
        ))}
      </div>
      <div className="mb-3">
        <label className="text-gray-400 text-xs mb-1 block">Harga Saham (Rp)</label>
        <input value={harga} onChange={e => setHarga(e.target.value)} placeholder="Contoh: 4950"
          type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
      </div>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung
      </button>
      {result && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
              <p className="text-green-400 text-[10px] font-semibold mb-1">ARA (+{result.pctARA}%)</p>
              <p className="text-white font-black text-lg">Rp {fmt(result.ara)}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <p className="text-red-400 text-[10px] font-semibold mb-1">ARB (-{result.pctARB}%)</p>
              <p className="text-white font-black text-lg">Rp {fmt(result.arb)}</p>
            </div>
          </div>
          <div className="bg-white/3 border border-white/5 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2 font-semibold">Proyeksi ARA ({result.steps.length} step)</p>
            <div className="flex flex-wrap gap-1.5">
              {result.steps.map((s: number, i: number) => (
                <span key={i} className="bg-green-500/10 text-green-300 text-[11px] px-2 py-0.5 rounded">
                  Step {i+1}: <b>{fmt(s)}</b>
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-[10px]">Fraksi harga: Rp {result.f}</p>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR HARGA RATA-RATA =====
function KalkulatorRataRata() {
  const [entries, setEntries] = useState([{ harga: "", lot: "" }, { harga: "", lot: "" }]);
  const [result, setResult] = useState<any>(null);

  const addEntry = () => setEntries(p => [...p, { harga: "", lot: "" }]);
  const removeEntry = (i: number) => setEntries(p => p.filter((_,j) => j !== i));
  const updateEntry = (i: number, field: "harga"|"lot", val: string) => {
    setEntries(p => p.map((e, j) => j === i ? { ...e, [field]: val } : e));
  };

  const hitung = () => {
    const valid = entries.filter(e => e.harga && e.lot && parseFloat(e.harga) > 0 && parseFloat(e.lot) > 0);
    if (valid.length < 1) return;
    let totalNilai = 0, totalLot = 0;
    valid.forEach(e => {
      const h = parseFloat(e.harga); const l = parseFloat(e.lot);
      totalNilai += h * l * 100;
      totalLot += l;
    });
    const avg = totalNilai / (totalLot * 100);
    setResult({ avg: avg.toFixed(2), totalNilai, totalLot });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="space-y-2 mb-3">
        <div className="grid grid-cols-2 gap-2 px-1">
          <span className="text-gray-500 text-xs">Harga Beli (Rp)</span>
          <span className="text-gray-500 text-xs">Lot</span>
        </div>
        {entries.map((e, i) => (
          <div key={i} className="flex gap-2">
            <input value={e.harga} onChange={ev => updateEntry(i, "harga", ev.target.value)} type="number"
              placeholder="Harga" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/50"/>
            <input value={e.lot} onChange={ev => updateEntry(i, "lot", ev.target.value)} type="number"
              placeholder="Lot" className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-500/50"/>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-300 px-1"></button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addEntry} className="w-full py-2 border border-dashed border-white/15 text-gray-500 rounded-xl text-xs mb-3 hover:border-blue-500/40 hover:text-blue-400 transition-colors">
        + Tambah Transaksi
      </button>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung Rata-rata
      </button>
      {result && (
        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-xs mb-2 font-semibold text-center">Hasil Perhitungan</p>
          <div className="text-center mb-3">
            <p className="text-gray-400 text-xs">Harga Rata-rata</p>
            <p className="text-white font-black text-2xl">Rp {parseFloat(result.avg).toLocaleString("id-ID", {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-gray-500 text-xs">Total Lot</p>
              <p className="text-white font-bold">{result.totalLot} lot</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-gray-500 text-xs">Total Nilai</p>
              <p className="text-white font-bold">Rp {fmt(result.totalNilai)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR PROFIT/LOSS =====
function KalkulatorPL() {
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [lot, setLot] = useState("");
  const [result, setResult] = useState<any>(null);

  const hitung = () => {
    const hb = parseFloat(hargaBeli); const hj = parseFloat(hargaJual); const l = parseFloat(lot);
    if (!hb || !hj || !l) return;
    const lembar = l * 100;
    const modalBruto = hb * lembar;
    const hasilBruto = hj * lembar;
    const fee_beli = modalBruto * 0.0019; // 0.19% beli
    const fee_jual = hasilBruto * 0.0029; // 0.29% jual
    const modal = modalBruto + fee_beli;
    const hasil = hasilBruto - fee_jual;
    const pl = hasil - modal;
    const pct = (pl / modal) * 100;
    setResult({ pl: Math.round(pl), pct: pct.toFixed(2), modal: Math.round(modal), hasil: Math.round(hasil), fee_total: Math.round(fee_beli + fee_jual) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="space-y-3 mb-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Harga Beli (Rp)</label>
          <input value={hargaBeli} onChange={e => setHargaBeli(e.target.value)} type="number" placeholder="Harga beli per lembar"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Harga Jual (Rp)</label>
          <input value={hargaJual} onChange={e => setHargaJual(e.target.value)} type="number" placeholder="Harga jual per lembar"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Jumlah Lot</label>
          <input value={lot} onChange={e => setLot(e.target.value)} type="number" placeholder="Jumlah lot"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
        </div>
      </div>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung
      </button>
      {result && (
        <div className="mt-4">
          <div className={`rounded-xl p-4 text-center mb-3 ${result.pl >= 0 ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
            <p className={`text-xs font-semibold mb-1 ${result.pl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {result.pl >= 0 ? "PROFIT ▲" : "LOSS ▼"}
            </p>
            <p className={`font-black text-2xl ${result.pl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {result.pl >= 0 ? "+" : ""}Rp {fmt(result.pl)}
            </p>
            <p className={`text-sm font-semibold ${result.pl >= 0 ? "text-green-400" : "text-red-400"}`}>
              ({result.pl >= 0 ? "+" : ""}{result.pct}%)
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-gray-500 text-[10px]">Modal</p>
              <p className="text-white text-xs font-bold">Rp {fmt(result.modal)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-gray-500 text-[10px]">Hasil Jual</p>
              <p className="text-white text-xs font-bold">Rp {fmt(result.hasil)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 text-center">
              <p className="text-gray-500 text-[10px]">Total Fee</p>
              <p className="text-yellow-400 text-xs font-bold">Rp {fmt(result.fee_total)}</p>
            </div>
          </div>
          <p className="text-gray-600 text-[10px] text-center mt-2">*Fee: Beli 0.19% + Jual 0.29%</p>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR MODAL BELI =====
function KalkulatorModal() {
  const [harga, setHarga] = useState("");
  const [lot, setLot] = useState("");
  const [result, setResult] = useState<any>(null);

  const hitung = () => {
    const h = parseFloat(harga); const l = parseFloat(lot);
    if (!h || !l) return;
    const lembar = l * 100;
    const bruto = h * lembar;
    const fee = bruto * 0.0019;
    const total = bruto + fee;
    setResult({ bruto: Math.round(bruto), fee: Math.round(fee), total: Math.round(total), lembar });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="space-y-3 mb-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Harga Saham (Rp)</label>
          <input value={harga} onChange={e => setHarga(e.target.value)} type="number" placeholder="Harga per lembar"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Jumlah Lot</label>
          <input value={lot} onChange={e => setLot(e.target.value)} type="number" placeholder="Jumlah lot yang mau dibeli"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
        </div>
      </div>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung
      </button>
      {result && (
        <div className="mt-4 space-y-2">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400 text-xs">Modal Bersih</p>
                <p className="text-white font-bold text-base">Rp {fmt(result.bruto)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Fee Beli (0.19%)</p>
                <p className="text-yellow-400 font-bold text-base">Rp {fmt(result.fee)}</p>
              </div>
            </div>
            <div className="border-t border-white/10 mt-3 pt-3">
              <p className="text-gray-400 text-xs">Total yang Harus Disiapkan</p>
              <p className="text-blue-400 font-black text-xl">Rp {fmt(result.total)}</p>
            </div>
          </div>
          <p className="text-gray-600 text-[10px] text-center">{result.lembar} lembar saham</p>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR DIVIDEN =====
function KalkulatorDividen() {
  const [harga, setHarga] = useState("");
  const [dividen, setDividen] = useState("");
  const [lot, setLot] = useState("");
  const [result, setResult] = useState<any>(null);

  const hitung = () => {
    const h = parseFloat(harga); const d = parseFloat(dividen); const l = parseFloat(lot);
    if (!h || !d || !l) return;
    const lembar = l * 100;
    const totalDividen = d * lembar;
    const dyield = (d / h) * 100;
    // Pajak dividen 10%
    const pajak = totalDividen * 0.10;
    const bersih = totalDividen - pajak;
    setResult({ totalDividen: Math.round(totalDividen), dyield: dyield.toFixed(2), pajak: Math.round(pajak), bersih: Math.round(bersih) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="space-y-3 mb-3">
        {[["Harga Saham (Rp)", harga, setHarga, "Harga per lembar"],
          ["Dividen per Lembar (Rp)", dividen, setDividen, "Dividen per lembar"],
          ["Jumlah Lot", lot, setLot, "Jumlah lot"]
        ].map(([label, val, setter, ph]: any) => (
          <div key={label}>
            <label className="text-gray-400 text-xs mb-1 block">{label}</label>
            <input value={val} onChange={(e: any) => setter(e.target.value)} type="number" placeholder={ph}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
          </div>
        ))}
      </div>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung
      </button>
      {result && (
        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-gray-400 text-xs">Dividen Yield</p>
              <p className="text-green-400 font-black text-xl">{result.dyield}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Dividen</p>
              <p className="text-white font-bold text-base">Rp {fmt(result.totalDividen)}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-400 text-xs">Pajak 10%</p>
              <p className="text-red-400 font-bold">-Rp {fmt(result.pajak)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Diterima Bersih</p>
              <p className="text-green-400 font-bold">Rp {fmt(result.bersih)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR EMITEN KONVERSI =====
function KalkulatorTarget() {
  const [modal, setModal] = useState("");
  const [target, setTarget] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [result, setResult] = useState<any>(null);

  const hitung = () => {
    const m = parseFloat(modal.replace(/\./g,"")); const t = parseFloat(target)/100; const hb = parseFloat(hargaBeli);
    if (!m || !t || !hb) return;
    const profit = m * t;
    const total = m + profit;
    const fee_beli = m * 0.0019;
    const fee_jual = total * 0.0029;
    const brutoTarget = total + fee_jual + fee_beli;
    const hargaTarget = brutoTarget / (m / (hb * 100)) / 100;
    setResult({ profit: Math.round(profit), total: Math.round(total), hargaTarget: hargaTarget.toFixed(0) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="bg-[#0A1628] border border-white/5 rounded-2xl p-4">
      <div className="space-y-3 mb-3">
        {[["Modal (Rp)", modal, setModal, "Total modal investasi"],
          ["Target Profit (%)", target, setTarget, "Contoh: 15"],
          ["Harga Beli (Rp)", hargaBeli, setHargaBeli, "Harga beli per lembar"],
        ].map(([label, val, setter, ph]: any) => (
          <div key={label}>
            <label className="text-gray-400 text-xs mb-1 block">{label}</label>
            <input value={val} onChange={(e: any) => setter(e.target.value)} type="number" placeholder={ph}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50"/>
          </div>
        ))}
      </div>
      <button onClick={hitung} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors">
        Hitung
      </button>
      {result && (
        <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Harga Target Jual</p>
          <p className="text-blue-400 font-black text-3xl mb-2">Rp {parseInt(result.hargaTarget).toLocaleString("id-ID")}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-2">
              <p className="text-gray-500 text-[10px]">Profit</p>
              <p className="text-green-400 text-sm font-bold">+Rp {fmt(result.profit)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <p className="text-gray-500 text-[10px]">Total Terima</p>
              <p className="text-white text-sm font-bold">Rp {fmt(result.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== MAIN ALAT PAGE =====
const tools = [
  { id: "araArb", label: "Kalkulator ARA/ARB", icon: "", desc: "Hitung batas atas/bawah + proyeksi step" },
  { id: "rataRata", label: "Harga Rata-rata", icon: "", desc: "Rata-rata dari beberapa transaksi beli" },
  { id: "profitLoss", label: "Profit / Loss", icon: "", desc: "Hitung P&L dengan fee broker" },
  { id: "modal", label: "Modal Beli", icon: "", desc: "Total modal termasuk fee beli" },
  { id: "dividen", label: "Kalkulator Dividen", icon: "", desc: "Hitung yield & dividen bersih" },
  { id: "target", label: "Target Harga Jual", icon: "", desc: "Harga jual berdasarkan target profit" },
];

export default function AlatPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case "araArb": return <KalkulatorARAARB />;
      case "rataRata": return <KalkulatorRataRata />;
      case "profitLoss": return <KalkulatorPL />;
      case "modal": return <KalkulatorModal />;
      case "dividen": return <KalkulatorDividen />;
      case "target": return <KalkulatorTarget />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#04070F", color: "white" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(4,7,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {activeTool ? (
            <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          ) : (
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
          )}
          <span className="text-white font-bold">
            {activeTool ? tools.find(t => t.id === activeTool)?.label : "Alat Trading"}
          </span>
          <div className="w-5" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {!activeTool ? (
          <>
            <p className="text-gray-500 text-sm mb-4">Pilih kalkulator yang ingin digunakan</p>
            <div className="grid grid-cols-2 gap-3">
              {tools.map(t => (
                <button key={t.id} onClick={() => setActiveTool(t.id)}
                  className="bg-[#0A1628] border border-white/5 rounded-2xl p-4 text-left hover:border-blue-500/30 hover:bg-[#0d1f3a] transition-all group">
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <p className="text-white font-semibold text-sm leading-tight mb-1">{t.label}</p>
                  <p className="text-gray-500 text-xs leading-tight">{t.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-xs font-medium">Buka</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9,18 15,12 9,6"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          renderTool()
        )}
      </main>

      <BottomNav active="alat" />
    </div>
  );
}
