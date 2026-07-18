"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PACKAGES: any = {
  basic:    { name:"Basic",    price:100000,  accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"blue" },
  silver:   { name:"Silver",   price:250000,  accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"emerald" },
  gold:     { name:"Gold",     price:500000,  accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"gold" },
  pro:      { name:"Pro",      price:750000,  accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"purple" },
  platinum: { name:"Platinum", price:900000,  accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"slate" },
  elite:    { name:"Elite",    price:1000000, accent:"#2563EB", bg:"linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.02))", tier:"elite" },
};

const PAYMENT_METHODS = [
  { id:"dana",    label:"DANA",    number:"082218723401", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"#108FE8",borderRadius:4,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:13,letterSpacing:1}}>DANA</span> },
  { id:"gopay",   label:"GoPay",   number:"082218723401", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"#00AED6",borderRadius:4,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:13}}>GoPay</span> },
  { id:"seabank", label:"SeaBank", number:"901555691160", an:"THIRAFI THARIQ AL IDRIS",
    logo: <span style={{background:"linear-gradient(135deg,#2A5FE3,#1a3fbf)",borderRadius:4,padding:"2px 8px",fontWeight:900,color:"#fff",fontSize:11}}>SeaBank</span> },
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
    { key:"form",    label:"DATA DIRI", icon:"01" },
    { key:"invoice", label:"INVOICE",   icon:"02" },
    { key:"confirm", label:"SELESAI",   icon:"03" },
  ];
  const idx = steps.findIndex(s => s.key === step);
  return (
    <div className="flex items-center gap-0 mb-8 w-full">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all
              ${i < idx ? "bg-[#2563EB] text-[#FFFFFF]" : i === idx ? "bg-[#2563EB] text-[#FFFFFF] ring-4 ring-[#2563EB]/20" : "bg-white/5 border border-white/10 text-slate-500"}`}>
              {i < idx ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : s.icon}
            </div>
            <span className={`text-[9px] mt-1 font-bold tracking-wider ${i === idx ? "text-[#2563EB]" : i < idx ? "text-[#2563EB]/70" : "text-slate-600"}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] mx-2 mb-4 ${i < idx ? "bg-[#2563EB]" : "bg-white/10"}`} />
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
    <div className="min-h-screen bg-[#030712] px-4 py-10">
      <div className="galaxy-stars" />
      <div className="relative z-10 max-w-md mx-auto">

        {/* Back */}
        <Link href="/paket" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#2563EB] transition-colors mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali ke Paket
        </Link>

        <StepBar step={step} />

        {/* ══════════ STEP 1: FORM ══════════ */}
        {step === "form" && (
          <div className="glass-card mark-lg overflow-hidden">
            {/* Header paket */}
            <div style={{background: "rgba(37,99,235,0.06)", borderBottom: "1px solid rgba(37,99,235,0.15)", padding:"20px 24px"}}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[#2563EB] uppercase font-bold tracking-wider mb-0.5">PAKET PILIHAN</p>
                  <p className="text-xl font-black text-white">{basePkg.name.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  {isFlashActive ? (
                    <>
                      <p className="text-[10px] text-slate-500 line-through font-bold">{formatRp(normalPrice)}</p>
                      <p className="text-xl font-black text-[#2563EB]">{flashPrice}</p>
                      <span className="inline-block bg-[#2563EB] text-[#FFFFFF] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">FLASH {flashDisc}</span>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-slate-500 mb-0.5 font-bold">TOTAL/BULAN</p>
                      <p className="text-xl font-black text-[#2563EB]">{formatRp(normalPrice)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Input fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                  <input value={nama} onChange={e => setNama(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                    className="w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#2563EB] rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">No. WhatsApp / HP</label>
                  <input value={hp} onChange={e => setHp(e.target.value)}
                    placeholder="08xxxxxxxxxx" type="tel"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                    className="w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#2563EB] rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>

              <div className="plus-divider mx-auto" />

              {/* Payment selection */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3 block">PILIH METODE PEMBAYARAN</label>
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map(m => {
                    const isSel = metodePay === m.id;
                    return (
                      <button key={m.id} onClick={() => setMetode(m.id)}
                        className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                          isSel ? "bg-[#2563EB]/5 border-[#2563EB] text-[#2563EB]" : "bg-white/20 border-white/5 text-slate-300 hover:border-white/10"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSel ? "border-[#2563EB]" : "border-slate-500"
                          }`}>
                            {isSel && <div className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                          </div>
                          <div>
                            <p className="text-white font-black text-sm uppercase tracking-wider">{m.label}</p>
                            <p className="text-[10px] text-slate-500">Atas Nama: {m.an}</p>
                          </div>
                        </div>
                        {m.logo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {err && (
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-bold text-center">
                  {err}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-4 text-xs font-black uppercase tracking-wider py-4">
                {loading ? "Memproses..." : "Konfirmasi & Buat Invoice"}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ STEP 2: INVOICE ══════════ */}
        {step === "invoice" && order && (
          <div className="glass-card mark-lg p-6 space-y-6">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="headline text-lg">DETAIL <span className="accent">INVOICE</span></h2>
                  <p className="text-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">No. {order.id}</p>
                </div>
                <div className="tag-chip">BELUM BAYAR</div>
              </div>

              {/* Details table */}
              <div className="glass-card no-mark p-4 mb-6">
                <div className="space-y-3">
                  {[
                    {l:"Nama Pemesan", v:order.nama},
                    {l:"No. WhatsApp", v:order.hp},
                    {l:"Paket Layanan", v:order.paket},
                    {l:"Metode Bayar", v:selMethod.label},
                  ].map(row=>(
                    <div key={row.l} className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">{row.l}</span>
                      <span className="text-white font-medium">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total box */}
              <div className="glass-card no-mark p-4 mb-6 border-[#2563EB]/30 bg-[#2563EB]/5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">TOTAL PEMBAYARAN</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Periode: 1 Bulan</p>
                  </div>
                  <p className="text-[#2563EB] font-black text-2xl">{finalPriceLabel}</p>
                </div>
              </div>

              {/* Transfer info */}
              <div className="glass-card no-mark p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">INSTRUKSI PEMBAYARAN</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {selMethod.logo}
                    <div>
                      <p className="text-white font-bold text-sm uppercase tracking-wider">{selMethod.label}</p>
                      <p className="text-slate-500 text-[10px]">Atas Nama: {selMethod.an}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-950/5 mb-3">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Nomor Rekening</p>
                    <p className="text-[#2563EB] font-black text-lg tracking-widest">{selMethod.number}</p>
                  </div>
                  <button onClick={() => copy(selMethod.number, "rek")}
                    className="tag-chip solid text-[10px] py-1.5 px-3">
                    {copied==="rek" ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-950/5">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Jumlah Transfer</p>
                    <p className="text-[#2563EB] font-black text-lg">{finalPriceLabel}</p>
                  </div>
                  <button onClick={() => copy(String(finalRaw), "nominal")}
                    className="tag-chip solid text-[10px] py-1.5 px-3">
                    {copied==="nominal" ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="text-[10px] text-slate-600 text-center mt-4 uppercase tracking-wider font-bold">Transfer sesuai nominal untuk mempercepat verifikasi</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* CTA WhatsApp */}
              <button onClick={goWhatsApp} className="btn-primary w-full text-xs font-black uppercase tracking-wider py-4 flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Konfirmasi Pembayaran via WhatsApp
              </button>

              <button onClick={() => setStep("form")} className="w-full py-2 text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-wider transition-colors">
                 Edit Data
              </button>
            </div>
          </div>
        )}

        {/* ══════════ STEP 3: SUCCESS ══════════ */}
        {step === "confirm" && order && (
          <div className="glass-card mark-lg p-6 space-y-6 text-center">
            {/* Success animation area */}
            <div className="py-6">
              <div className="w-16 h-16 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="headline text-xl mb-2">INVOICE <span className="accent">TERKIRIM</span></h2>
              <p className="text-slate-400 text-xs uppercase tracking-wider leading-relaxed font-semibold">Admin akan konfirmasi pembayaran kamu maksimal 1x24 jam.</p>
            </div>

            {/* Summary */}
            <div className="glass-card no-mark p-4 text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">RINGKASAN ORDER</p>
              <div className="space-y-3 text-xs">
                {[
                  {l:"No. Invoice", v:order.id, mono:true},
                  {l:"Paket", v:order.paket},
                  {l:"Metode", v:selMethod.label},
                  {l:"Total Bayar", v:finalPriceLabel, bold:true},
                ].map(row=>(
                  <div key={row.l} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">{row.l}</span>
                    <span className={`${row.mono?"font-mono text-xs":""} ${row.bold?"text-[#2563EB] font-black text-sm":"text-white font-medium"}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-950/5 text-left">
              <p className="text-[#2563EB] text-[10px] font-bold uppercase tracking-wider mb-1">LANGKAH SELANJUTNYA</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">Tunggu konfirmasi dari admin. Token VIP akan aktif otomatis setelah pembayaran diverifikasi.</p>
            </div>

            <Link href="/" className="btn-primary w-full text-xs font-black uppercase tracking-wider py-4 block">
              Kembali ke Beranda
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-slate-500 text-sm">Memuat...</div>
      </div>
    }>
      <OrderPageInner />
    </Suspense>
  );
}
