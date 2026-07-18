"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PACKAGES: any = {
  basic:    { name:"Basic",    price:100000,  accent:"#38BDF8", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)", tier:"blue" },
  silver:   { name:"Silver",   price:250000,  accent:"#34d399", bg:"linear-gradient(135deg,#0891b2,#1d4ed8)", tier:"emerald" },
  gold:     { name:"Gold",     price:500000,  accent:"#FBBF24", bg:"linear-gradient(135deg,#d97706,#b45309)", tier:"gold" },
  pro:      { name:"Pro",      price:750000,  accent:"#A78BFA", bg:"linear-gradient(135deg,#7c3aed,#4f46e5)", tier:"purple" },
  platinum: { name:"Platinum", price:900000,  accent:"#CBD5E1", bg:"linear-gradient(135deg,#64748b,#475569)", tier:"slate" },
  elite:    { name:"Elite",    price:1000000, accent:"#FDE68A", bg:"linear-gradient(135deg,#f59e0b,#d97706)", tier:"elite" },
};

const PAYMENT_METHODS = [
  { id:"dana",    label:"DANA",    number:"082218723401", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"#108FE8",borderRadius:6,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:13,letterSpacing:1}}>DANA</span> },
  { id:"gopay",   label:"GoPay",   number:"082218723401", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"#00AED6",borderRadius:6,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:13}}>Go<span style={{color:"#FFD700"}}>Pay</span></span> },
  { id:"seabank", label:"SeaBank", number:"901555691160", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"linear-gradient(135deg,#2A5FE3,#1a3fbf)",borderRadius:6,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:11}}>SeaBank</span> },
];

function formatRp(n: number) {
  return "Rp\u00A0" + n.toLocaleString("id-ID");
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

/* ─── STEP INDICATOR ─── */
function StepBar({ step }: { step: "form"|"invoice"|"confirm" }) {
  const steps = [
    { key:"form",    label:"Data Diri", icon:"01" },
    { key:"invoice", label:"Invoice",   icon:"02" },
    { key:"confirm", label:"Selesai",   icon:"03" },
  ];
  const idx = steps.findIndex(s => s.key === step);
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all
              ${i < idx ? "bg-green-500 text-white" : i === idx ? "bg-blue-500 text-white ring-4 ring-blue-500/30" : "bg-white/10 text-slate-500"}`}>
              {i < idx ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : s.icon}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${i === idx ? "text-blue-400" : i < idx ? "text-green-400" : "text-slate-600"}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 ${i < idx ? "bg-green-500/50" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN ─── */
function OrderPageInner() {
  const params = useSearchParams();
  const paketId = (params.get("paket") || "basic").toLowerCase();
  const flashPriceParam = params.get("flash");
  const flashDiscParam  = params.get("disc");
  const flashRawParam   = params.get("raw");   // raw number price from paket page

  const [apiPkg, setApiPkg] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/sync").then(r => r.json()).then(d => {
      if (d.pricing) {
        const found = d.pricing.find((p: any) => p.id === paketId);
        if (found) setApiPkg(found);
      }
    }).catch(() => {});
  }, [paketId]);

  const basePkg = PACKAGES[paketId] || PACKAGES.basic;

  // Flash sale logic: URL params diutamakan (dikirim dari halaman /paket saat flash aktif)
  const apiFlash = apiPkg?.flashSale;
  const isFlashActive = !!(
    flashPriceParam ||
    (apiFlash && (!apiFlash.endTime || new Date(apiFlash.endTime) > new Date()))
  );

  const flashPrice   = flashPriceParam || apiFlash?.price || "";
  const flashDisc    = flashDiscParam  || apiFlash?.discount || "";
  const normalPrice  = basePkg.price;
  const finalRaw: number = isFlashActive
    ? (flashRawParam ? parseInt(flashRawParam) : (apiFlash?.rawPrice || normalPrice))
    : normalPrice;
  const finalPriceLabel = isFlashActive ? flashPrice : (apiPkg?.priceLabel || formatRp(normalPrice));

  const [step, setStep]         = useState<"form"|"invoice"|"confirm">("form");
  const [nama, setNama]         = useState("");
  const [hp,   setHp]           = useState("");
  const [metodePay, setMetode]  = useState("dana");
  const [loading, setLoading]   = useState(false);
  const [order, setOrder]       = useState<any>(null);
  const [copied, setCopied]     = useState("");
  const [err, setErr]           = useState("");

  const selMethod = PAYMENT_METHODS.find(m => m.id === metodePay) || PAYMENT_METHODS[0];

  async function handleSubmit() {
    setErr("");
    if (!nama.trim()) { setErr("Nama tidak boleh kosong"); return; }
    if (!hp.trim() || hp.trim().length < 9) { setErr("Nomor HP tidak valid"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          nama: nama.trim(),
          hp: hp.trim(),
          paket: basePkg.name,
          harga: finalRaw,
          metode: selMethod.label,
        }),
      });
      const data = await res.json();
      if (data.success) { setOrder(data.order); setStep("invoice"); }
      else setErr(data.message || "Gagal membuat order");
    } catch { setErr("Terjadi kesalahan, coba lagi"); }
    setLoading(false);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(""), 2000);
    });
  }

  function goWhatsApp() {
    if (!order) return;
    const m = selMethod;
    const msg = ` *INVOICE RITEL COMMUNITY*
━━━━━━━━━━━━━━━━━━━━━━━━
 No. Invoice : *${order.id}*
 Tanggal     : ${formatDate(order.created_at)}
━━━━━━━━━━━━━━━━━━━━━━━━
 Nama        : ${order.nama}
 No. HP      : ${order.hp}
 Paket       : ${order.paket}${isFlashActive ? ` *(Flash Sale ${flashDisc})*` : ""}
 Total       : *${finalPriceLabel}/bulan*${isFlashActive ? `\n Harga Normal: ~~${formatRp(normalPrice)}~~` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━
 Metode Bayar: ${m.label}
 No. Akun    : *${m.number}*
 a.n          : ${m.an}
━━━━━━━━━━━━━━━━━━━━━━━━
_Mohon lampirkan bukti transfer._
_Token VIP aktif setelah pembayaran dikonfirmasi._`;
    window.open(`https://wa.me/6282218723401?text=${encodeURIComponent(msg)}`, "_blank");
    setStep("confirm");
  }

  return (
    <div className="min-h-screen bg-[#04060f] px-4 py-10">
      <div className="galaxy-stars" />
      <div className="relative z-10 max-w-md mx-auto">

        {/* Back */}
        <Link href="/paket" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali ke Paket
        </Link>

        <StepBar step={step} />

        {/* ══════════ STEP 1: FORM ══════════ */}
        {step === "form" && (
          <div style={{background:"#080d1a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20}} className="overflow-hidden">
            {/* Header paket */}
            <div style={{background: basePkg.bg, padding:"20px 24px"}}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-white/60 mb-0.5">Paket dipilih</p>
                  <p className="text-xl font-black text-white">{basePkg.name}</p>
                </div>
                <div className="text-right">
                  {isFlashActive ? (
                    <>
                      <p className="text-xs text-white/60 line-through">{formatRp(normalPrice)}</p>
                      <p className="text-xl font-black text-white">{flashPrice}</p>
                      <span className="inline-block bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">FLASH {flashDisc}</span>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-white/60 mb-0.5">Total/bulan</p>
                      <p className="text-xl font-black text-white">{formatRp(normalPrice)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Input fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Nama Lengkap</label>
                  <input value={nama} onChange={e => setNama(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="input-dark" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">No. WhatsApp / HP</label>
                  <input value={hp} onChange={e => setHp(e.target.value)}
                    placeholder="08xxxxxxxxxx" type="tel"
                    className="input-dark" />
                </div>
              </div>

              {/* Metode pembayaran */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setMetode(m.id)}
                      style={{
                        border: metodePay === m.id ? "1.5px solid #1E5AF0" : "1px solid rgba(255,255,255,0.08)",
                        background: metodePay === m.id ? "rgba(30,90,240,0.12)" : "rgba(255,255,255,0.03)",
                        borderRadius: 12, padding: "10px 8px", cursor:"pointer", transition:"all .2s"
                      }}>
                      <div className="flex justify-center mb-1.5">{m.logo}</div>
                      <p className={`text-xs font-bold text-center ${metodePay === m.id ? "text-blue-400" : "text-slate-400"}`}>{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Detail rekening */}
                <div style={{background:"rgba(30,90,240,0.07)",border:"1px solid rgba(30,90,240,0.2)",borderRadius:12,padding:"12px 14px"}}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Transfer ke rekening</p>
                      <p className="text-sm font-bold text-white">{selMethod.label}</p>
                      <p className="text-base font-black text-blue-300 tracking-wide">{selMethod.number}</p>
                      <p className="text-xs text-slate-400">a.n {selMethod.an}</p>
                    </div>
                    <button onClick={() => copy(selMethod.number, "rek-form")}
                      style={{background:"rgba(30,90,240,0.2)",border:"1px solid rgba(30,90,240,0.4)",borderRadius:8,padding:"6px 12px",cursor:"pointer"}}>
                      <span className="text-xs font-bold text-blue-300">{copied==="rek-form" ? " Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {err && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">{err}</p>}

              <button onClick={handleSubmit} disabled={loading}
                style={{
                  width:"100%", padding:"14px", borderRadius:14, border:"none", cursor: loading ? "not-allowed":"pointer",
                  background: loading ? "#1a2540" : "linear-gradient(135deg,#1E5AF0,#10b981)",
                  color:"#fff", fontWeight:900, fontSize:15, transition:"opacity .2s"
                }}>
                {loading ? "Memproses..." : "Buat Invoice "}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ STEP 2: INVOICE (Midtrans style) ══════════ */}
        {step === "invoice" && order && (
          <div className="space-y-3">
            {/* Invoice card */}
            <div style={{background:"#080d1a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,overflow:"hidden"}}>

              {/* Top header - logo + status */}
              <div style={{background:"#0b1322",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"16px 20px"}} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#1E5AF0,#10b981)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:16}}></span>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm leading-none">RITEL COMMUNITY</p>
                    <p className="text-slate-500 text-[10px]">ritelcommunity.web.id</p>
                  </div>
                </div>
                <span style={{background:"rgba(251,191,36,0.15)",border:"1px solid rgba(251,191,36,0.4)",color:"#FBBF24",fontSize:10,fontWeight:900,padding:"4px 10px",borderRadius:20}}>
                  ⏳ MENUNGGU BAYAR
                </span>
              </div>

              {/* Invoice number + date */}
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">No. Invoice</p>
                    <p className="text-white font-black font-mono text-base">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Tanggal</p>
                    <p className="text-slate-300 text-xs">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Detail items - mirip Midtrans */}
              <div style={{padding:"16px 20px"}}>
                {/* Baris item */}
                <div style={{marginBottom:12}}>
                  <div className="flex justify-between items-center py-2" style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                    <div className="flex items-center gap-2">
                      <span style={{fontSize:18}}></span>
                      <div>
                        <p className="text-white font-bold text-sm">Paket {order.paket}</p>
                        <p className="text-slate-500 text-xs">Membership 1 Bulan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isFlashActive && <p className="text-slate-500 text-xs line-through">{formatRp(normalPrice)}</p>}
                      <p style={{color: basePkg.accent, fontWeight:900, fontSize:14}}>{finalPriceLabel}</p>
                    </div>
                  </div>

                  {isFlashActive && (
                    <div className="flex justify-between items-center py-2" style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <div className="flex items-center gap-2">
                        <span style={{fontSize:18}}></span>
                        <p className="text-green-400 text-sm font-medium">Diskon Flash Sale {flashDisc}</p>
                      </div>
                      <p className="text-green-400 font-bold text-sm">- Hemat {flashDisc}</p>
                    </div>
                  )}
                </div>

                {/* Customer info */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Detail Pelanggan</p>
                  <div className="space-y-1.5">
                    {[{l:"Nama", v:order.nama},{l:"No. HP", v:order.hp}].map(row=>(
                      <div key={row.l} className="flex justify-between text-sm">
                        <span className="text-slate-500">{row.l}</span>
                        <span className="text-white font-medium">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total box */}
                <div style={{background:"rgba(30,90,240,0.1)",border:"1.5px solid rgba(30,90,240,0.3)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Total Pembayaran</p>
                      <p className="text-slate-500 text-[10px]">Periode: 1 bulan</p>
                    </div>
                    <p className="text-white font-black text-2xl">{finalPriceLabel}</p>
                  </div>
                </div>

                {/* Transfer info */}
                <div style={{background:"#0b1322",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 16px"}}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Instruksi Pembayaran</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {selMethod.logo}
                      <div>
                        <p className="text-white font-bold text-sm">{selMethod.label}</p>
                        <p className="text-slate-400 text-xs">a.n {selMethod.an}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{background:"rgba(30,90,240,0.08)",border:"1px dashed rgba(30,90,240,0.3)",borderRadius:10,padding:"10px 14px"}} className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">Nomor Rekening</p>
                      <p className="text-blue-300 font-black text-lg tracking-widest">{selMethod.number}</p>
                    </div>
                    <button onClick={() => copy(selMethod.number, "rek")}
                      style={{background:"rgba(30,90,240,0.25)",border:"1px solid rgba(30,90,240,0.5)",borderRadius:8,padding:"7px 14px",cursor:"pointer"}}>
                      <span className="text-blue-300 font-bold text-xs">{copied==="rek" ? " Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div style={{background:"rgba(30,90,240,0.08)",border:"1px dashed rgba(30,90,240,0.3)",borderRadius:10,padding:"10px 14px",marginTop:8}} className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">Jumlah Transfer</p>
                      <p className="text-green-300 font-black text-lg">{finalPriceLabel}</p>
                    </div>
                    <button onClick={() => copy(String(finalRaw), "nominal")}
                      style={{background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:8,padding:"7px 14px",cursor:"pointer"}}>
                      <span className="text-green-400 font-bold text-xs">{copied==="nominal" ? " Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-600 text-center mt-3"> Transfer sesuai nominal untuk mempercepat verifikasi</p>
                </div>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <button onClick={goWhatsApp}
              style={{
                width:"100%", padding:"16px", borderRadius:14, border:"none", cursor:"pointer",
                background:"linear-gradient(135deg,#22C55E,#16a34a)",
                color:"#fff", fontWeight:900, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Konfirmasi Pembayaran via WhatsApp
            </button>

            <button onClick={() => setStep("form")}
              className="w-full py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors">
               Edit Data
            </button>
          </div>
        )}

        {/* ══════════ STEP 3: SUCCESS ══════════ */}
        {step === "confirm" && order && (
          <div style={{background:"#080d1a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,overflow:"hidden"}}>
            {/* Success animation area */}
            <div style={{background:"linear-gradient(180deg,#071a10 0%,#080d1a 100%)",padding:"40px 24px 32px",textAlign:"center"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(34,197,94,0.12)",border:"2px solid rgba(34,197,94,0.4)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="text-white font-black text-xl mb-1">Invoice Terkirim! </h2>
              <p className="text-slate-400 text-sm">Admin akan konfirmasi pembayaran kamu maksimal 1x24 jam.</p>
            </div>

            {/* Summary */}
            <div style={{padding:"0 20px 20px"}}>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Ringkasan Order</p>
                <div className="space-y-2.5 text-sm">
                  {[
                    {l:"No. Invoice", v:order.id, mono:true},
                    {l:"Paket", v:order.paket},
                    {l:"Metode", v:selMethod.label},
                    {l:"Total Bayar", v:finalPriceLabel, bold:true},
                  ].map(row=>(
                    <div key={row.l} className="flex justify-between items-center" style={{borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:8}}>
                      <span className="text-slate-500">{row.l}</span>
                      <span className={`${row.mono?"font-mono text-xs":""} ${row.bold?"text-white font-black text-base":"text-white font-medium"}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
                <p className="text-yellow-400 text-xs font-bold mb-1"> Langkah selanjutnya</p>
                <p className="text-slate-400 text-xs leading-relaxed">Tunggu konfirmasi dari admin. Token VIP akan aktif otomatis setelah pembayaran diverifikasi.</p>
              </div>

              <Link href="/" style={{
                display:"block", width:"100%", padding:"14px", borderRadius:14, textAlign:"center",
                background:"linear-gradient(135deg,#1E5AF0,#10b981)", color:"#fff", fontWeight:900, fontSize:14, textDecoration:"none"
              }}>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#04060f] flex items-center justify-center">
        <div className="text-slate-500 text-sm">Memuat...</div>
      </div>
    }>
      <OrderPageInner />
    </Suspense>
  );
}
