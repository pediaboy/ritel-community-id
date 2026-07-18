"use client";
import { useState } from "react";
import Link from "next/link";

function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id:"beranda", label:"BERANDA", href:"/" },
    { id:"cari", label:"CARI", href:"/cari" },
    { id:"alat", label:"ALAT", href:"/alat" },
    { id:"vip", label:"VIP", href:"/vip" },
    { id:"profil", label:"PROFIL", href:"/profil" },
  ];
  const icons: Record<string, any> = {
    beranda: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    cari: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alat: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/></svg>,
    vip: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    profil: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };

  return (
    <nav className="dock-nav w-[90%] max-w-[440px]">
      {tabs.map(t => (
        <Link key={t.id} href={t.href} className={`dock-item flex-1 ${active === t.id ? "active" : ""}`}>
          <div className="dock-icon">{icons[t.id]}</div>
          <span className="dock-label">{t.label}</span>
        </Link>
      ))}
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
    <div className="glass-card p-4">
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1 border border-white/5">
        {(["reguler","akselerasi"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(null); }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode===m?"bg-emerald-500 text-[#FFFFFF]":"text-neutral-400"}`}>
            {m === "reguler" ? "Reguler" : "Akselerasi & FCA"}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1.5 block">Harga Saham (Rp)</label>
        <input 
          value={harga} 
          onChange={e => setHarga(e.target.value)} 
          placeholder="CONTOH: 4950"
          type="number" 
          className="input-dark"
        />
      </div>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Proyeksi
      </button>
      {result && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-3 text-center">
              <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-1">ARA (+{result.pctARA}%)</p>
              <p className="text-white font-black text-base">Rp {fmt(result.ara)}</p>
            </div>
            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-3 text-center">
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mb-1">ARB (-{result.pctARB}%)</p>
              <p className="text-white font-black text-base">Rp {fmt(result.arb)}</p>
            </div>
          </div>
          <div className="glass-card no-mark p-3">
            <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-2">Proyeksi ARA ({result.steps.length} Step)</p>
            <div className="flex flex-wrap gap-1.5">
              {result.steps.map((s: number, i: number) => (
                <span key={i} className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                  S{i+1}: Rp {fmt(s)}
                </span>
              ))}
            </div>
          </div>
          <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider">Fraksi Harga: Rp {result.f}</p>
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
    <div className="glass-card p-4">
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2 px-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          <span>Harga Beli (Rp)</span>
          <span>Lot</span>
        </div>
        {entries.map((e, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input 
              value={e.harga} 
              onChange={ev => updateEntry(i, "harga", ev.target.value)} 
              type="number"
              placeholder="Harga" 
              className="input-dark flex-1"
            />
            <input 
              value={e.lot} 
              onChange={ev => updateEntry(i, "lot", ev.target.value)} 
              type="number"
              placeholder="Lot" 
              className="input-dark w-24"
            />
            {entries.length > 1 && (
              <button 
                onClick={() => removeEntry(i)} 
                className="text-red-400 hover:text-red-300 p-2 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <button 
        onClick={addEntry} 
        className="w-full py-2 border border-dashed border-white/20 text-neutral-400 rounded-xl text-[10px] uppercase font-bold tracking-wider mb-4 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
      >
        + Tambah Transaksi
      </button>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Rata-Rata
      </button>
      {result && (
        <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 text-center">
          <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-2">Hasil Perhitungan</p>
          <div className="mb-3">
            <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Harga Rata-Rata</p>
            <p className="text-white font-black text-xl">Rp {parseFloat(result.avg).toLocaleString("id-ID", {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Lot</p>
              <p className="text-white font-bold">{result.totalLot} lot</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Nilai</p>
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
    const fee_beli = modalBruto * 0.0019;
    const fee_jual = hasilBruto * 0.0029;
    const modal = modalBruto + fee_beli;
    const hasil = hasilBruto - fee_jual;
    const pl = hasil - modal;
    const pct = (pl / modal) * 100;
    setResult({ pl: Math.round(pl), pct: pct.toFixed(2), modal: Math.round(modal), hasil: Math.round(hasil), fee_total: Math.round(fee_beli + fee_jual) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="glass-card p-4">
      <div className="space-y-4 mb-4">
        <div>
          <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Harga Beli (Rp)</label>
          <input value={hargaBeli} onChange={e => setHargaBeli(e.target.value)} type="number" placeholder="HARGA BELI PER LEMBAR"
            className="input-dark"/>
        </div>
        <div>
          <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Harga Jual (Rp)</label>
          <input value={hargaJual} onChange={e => setHargaJual(e.target.value)} type="number" placeholder="HARGA JUAL PER LEMBAR"
            className="input-dark"/>
        </div>
        <div>
          <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Jumlah Lot</label>
          <input value={lot} onChange={e => setLot(e.target.value)} type="number" placeholder="JUMLAH LOT"
            className="input-dark"/>
        </div>
      </div>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Estimasi P&L
      </button>
      {result && (
        <div className="mt-4">
          <div className={`rounded-xl p-4 text-center mb-3 ${result.pl >= 0 ? "border border-emerald-500/20 bg-emerald-500/5" : "border border-red-500/20 bg-red-500/5"}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${result.pl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {result.pl >= 0 ? "PROFIT" : "LOSS"}
            </p>
            <p className={`font-black text-2xl ${result.pl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {result.pl >= 0 ? "+" : ""}Rp {fmt(result.pl)}
            </p>
            <p className={`text-xs font-bold ${result.pl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ({result.pl >= 0 ? "+" : ""}{result.pct}%)
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-2.5 text-center">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Modal</p>
              <p className="text-white text-xs font-bold">Rp {fmt(result.modal)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 text-center">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Hasil Jual</p>
              <p className="text-white text-xs font-bold">Rp {fmt(result.hasil)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 text-center">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Fee</p>
              <p className="text-emerald-400 text-xs font-bold">Rp {fmt(result.fee_total)}</p>
            </div>
          </div>
          <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider text-center mt-2.5">*Fee: Beli 0.19% + Jual 0.29%</p>
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
    <div className="glass-card p-4">
      <div className="space-y-4 mb-4">
        <div>
          <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Harga Saham (Rp)</label>
          <input value={harga} onChange={e => setHarga(e.target.value)} type="number" placeholder="HARGA PER LEMBAR"
            className="input-dark"/>
        </div>
        <div>
          <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Jumlah Lot</label>
          <input value={lot} onChange={e => setLot(e.target.value)} type="number" placeholder="JUMLAH LOT YANG MAU DIBELI"
            className="input-dark"/>
        </div>
      </div>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Modal
      </button>
      {result && (
        <div className="mt-4 space-y-2">
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Modal Bersih</p>
                <p className="text-white font-bold text-sm">Rp {fmt(result.bruto)}</p>
              </div>
              <div>
                <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Fee Beli (0.19%)</p>
                <p className="text-emerald-400 font-bold text-sm">Rp {fmt(result.fee)}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Total yang Harus Disiapkan</p>
              <p className="text-emerald-400 font-black text-lg">Rp {fmt(result.total)}</p>
            </div>
          </div>
          <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider text-center">{result.lembar} Lembar Saham</p>
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
    const pajak = totalDividen * 0.10;
    const bersih = totalDividen - pajak;
    setResult({ totalDividen: Math.round(totalDividen), dyield: dyield.toFixed(2), pajak: Math.round(pajak), bersih: Math.round(bersih) });
  };

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="glass-card p-4">
      <div className="space-y-4 mb-4">
        {[["Harga Saham (Rp)", harga, setHarga, "Harga per lembar"],
          ["Dividen per Lembar (Rp)", dividen, setDividen, "Dividen per lembar"],
          ["Jumlah Lot", lot, setLot, "Jumlah lot"]
        ].map(([label, val, setter, ph]: any) => (
          <div key={label}>
            <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">{label}</label>
            <input value={val} onChange={(e: any) => setter(e.target.value)} type="number" placeholder={ph.toUpperCase()}
              className="input-dark"/>
          </div>
        ))}
      </div>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Dividen
      </button>
      {result && (
        <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Dividen Yield</p>
              <p className="text-emerald-400 font-black text-lg">{result.dyield}%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Total Dividen</p>
              <p className="text-white font-bold text-sm">Rp {fmt(result.totalDividen)}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Pajak 10%</p>
              <p className="text-red-400 font-bold">-Rp {fmt(result.pajak)}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Diterima Bersih</p>
              <p className="text-emerald-400 font-bold">Rp {fmt(result.bersih)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== KALKULATOR TARGET HARGA =====
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
    <div className="glass-card p-4">
      <div className="space-y-4 mb-4">
        {[["Modal Investasi (Rp)", modal, setModal, "Total modal investasi"],
          ["Target Profit (%)", target, setTarget, "Target profit"],
          ["Harga Beli (Rp)", hargaBeli, setHargaBeli, "Harga beli per lembar"],
        ].map(([label, val, setter, ph]: any) => (
          <div key={label}>
            <label className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">{label}</label>
            <input value={val} onChange={(e: any) => setter(e.target.value)} type="number" placeholder={ph.toUpperCase()}
              className="input-dark"/>
          </div>
        ))}
      </div>
      <button onClick={hitung} className="btn-primary w-full text-xs font-bold uppercase tracking-wider py-3">
        Hitung Target Jual
      </button>
      {result && (
        <div className="mt-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 text-center">
          <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1">Harga Target Jual</p>
          <p className="text-emerald-400 font-black text-2xl mb-2">Rp {parseInt(result.hargaTarget).toLocaleString("id-ID")}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2.5">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Estimasi Profit</p>
              <p className="text-emerald-400 font-bold">+Rp {fmt(result.profit)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5">
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Terima</p>
              <p className="text-white font-bold">Rp {fmt(result.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== MAIN ALAT PAGE =====
const tools = [
  { id: "araArb", label: "Kalkulator ARA/ARB", desc: "Hitung batas atas/bawah + proyeksi step" },
  { id: "rataRata", label: "Harga Rata-rata", desc: "Rata-rata dari beberapa transaksi beli" },
  { id: "profitLoss", label: "Profit / Loss", desc: "Hitung P&L dengan fee broker" },
  { id: "modal", label: "Modal Beli", desc: "Total modal termasuk fee beli" },
  { id: "dividen", label: "Kalkulator Dividen", desc: "Hitung yield & dividen bersih" },
  { id: "target", label: "Target Harga Jual", desc: "Harga jual berdasarkan target profit" },
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
    <div className="min-h-screen bg-[#030712] text-[#EDEEF0] max-w-[480px] mx-auto font-sans relative pb-24">
      <div className="galaxy-stars" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#030712]/95 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center justify-between">
        {activeTool ? (
          <button onClick={() => setActiveTool(null)} className="text-neutral-400 hover:text-emerald-400 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        ) : (
          <Link href="/" className="text-neutral-400 hover:text-emerald-400 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
        )}
        
        <h1 className="headline text-base font-black">
          {activeTool ? (
            tools.find(t => t.id === activeTool)?.label.toUpperCase()
          ) : (
            <>ALAT <span className="accent">TRADING</span></>
          )}
        </h1>
        
        <div className="w-5" />
      </header>

      <main className="p-4 relative z-10">
        {!activeTool ? (
          <>
            <div className="mb-6">
              <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Kalkulator Kalkulasi</p>
              <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider mt-0.5">Pilih kalkulator untuk memulai analisis cepat</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {tools.map((t, idx) => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveTool(t.id)}
                  className="glass-card p-4 text-left flex flex-col justify-between hover:border-emerald-500/40 transition-all min-h-[140px]"
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <div className="index-badge">{"0" + (idx + 1)}</div>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="9,18 15,12 9,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs uppercase tracking-wider mb-1 leading-tight">{t.label}</p>
                    <p className="text-neutral-400 text-[9px] leading-tight">{t.desc}</p>
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
