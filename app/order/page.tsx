"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PACKAGES: any = {
  basic:    { name:"Basic",    price:100000,  accent:"text-blue-400",    bg:"from-blue-600 to-blue-800" },
  silver:   { name:"Silver",   price:250000,  accent:"text-cyan-400",    bg:"from-cyan-600 to-blue-700" },
  gold:     { name:"Gold",     price:500000,  accent:"text-yellow-400",  bg:"from-yellow-500 to-orange-600" },
  pro:      { name:"Pro",      price:750000,  accent:"text-purple-400",  bg:"from-purple-600 to-indigo-700" },
  platinum: { name:"Platinum", price:900000,  accent:"text-slate-300",   bg:"from-slate-400 to-slate-600" },
  elite:    { name:"Elite",    price:1000000, accent:"text-yellow-400",  bg:"from-yellow-400 to-orange-500" },
};

const PAYMENT_METHODS = [
  { id:"dana",    label:"DANA",    number:"082218723401", an:"THIRAFI THARIQ AL IDRIS", icon:"💚" },
  { id:"gopay",   label:"GoPay",   number:"082218723401", an:"THIRAFI THARIQ AL IDRIS", icon:"💙" },
  { id:"seabank", label:"SeaBank", number:"901555691160", an:"THIRAFI THARIQ AL IDRIS", icon:"🏦" },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function OrderPageInner() {
  const params = useSearchParams();
  const paketId = (params.get("paket") || "basic").toLowerCase();
  const pkg = PACKAGES[paketId] || PACKAGES.basic;

  const [step, setStep] = useState<"form"|"invoice"|"confirm">("form");
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [metodePay, setMetodePay] = useState("dana");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === metodePay) || PAYMENT_METHODS[0];

  async function handleSubmit() {
    setErr("");
    if (!nama.trim()) { setErr("Nama tidak boleh kosong"); return; }
    if (!hp.trim() || hp.trim().length < 9) { setErr("No HP tidak valid"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          nama: nama.trim(),
          hp: hp.trim(),
          paket: pkg.name,
          harga: pkg.price,
          metode: selectedMethod.label,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setStep("invoice");
      } else {
        setErr(data.message || "Gagal membuat order");
      }
    } catch {
      setErr("Terjadi kesalahan, coba lagi");
    }
    setLoading(false);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  function goWhatsApp() {
    if (!order) return;
    const m = selectedMethod;
    const invoiceText = `🧾 *INVOICE PEMBELIAN*
━━━━━━━━━━━━━━━━━━━━
📋 No. Invoice : ${order.id}
📅 Tanggal     : ${formatDate(order.created_at)}
━━━━━━━━━━━━━━━━━━━━
👤 Nama        : ${order.nama}
📱 No. HP      : ${order.hp}
📦 Paket       : ${order.paket}
💰 Total       : ${formatRp(order.harga)}/bulan
━━━━━━━━━━━━━━━━━━━━
💳 Metode Bayar: ${m.label}
🏷 No. Akun   : ${m.number}
👤 a.n         : ${m.an}
━━━━━━━━━━━━━━━━━━━━
_Mohon lampirkan bukti transfer._
_Token VIP aktif setelah pembayaran dikonfirmasi._`;
    const encoded = encodeURIComponent(invoiceText);
    window.open(`https://wa.me/6282218723401?text=${encoded}`, "_blank");
    setStep("confirm");
  }

  return (
    <div className="min-h-screen bg-[#04060f] px-4 py-10">
      <div className="galaxy-stars" />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/paket" className="text-sm text-slate-400 hover:text-cyan-400 flex items-center gap-1 mb-4">
            ← Kembali ke Paket
          </Link>
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${pkg.bg} text-white px-4 py-2 rounded-full text-sm font-bold mb-3`}>
            📦 Order Paket {pkg.name}
          </div>
          <h1 className="text-2xl font-black text-white">
            {step === "form" ? "Isi Data Order" : step === "invoice" ? "Invoice Pembelian" : "Konfirmasi Pembayaran"}
          </h1>
        </div>

        {step === "form" && (
          <div className="card-glass rounded-2xl p-6 border border-white/10 space-y-5">
            <div className={`bg-gradient-to-r ${pkg.bg} rounded-xl p-4 text-white`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-70 mb-1">Paket yang dipilih</p>
                  <p className="font-black text-xl">{pkg.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 mb-1">Total Pembayaran</p>
                  <p className="font-black text-xl">{formatRp(pkg.price)}<span className="text-xs font-normal opacity-70">/bln</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nama Lengkap *</label>
                <input value={nama} onChange={e => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap" className="input-dark" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">No. WhatsApp / HP *</label>
                <input value={hp} onChange={e => setHp(e.target.value)}
                  placeholder="08xxxxxxxxxx" type="tel" className="input-dark" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setMetodePay(m.id)}
                    className={`p-3 rounded-xl border text-center transition-all text-sm font-bold
                      ${metodePay === m.id
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>
                    <div className="text-xl mb-1">{m.icon}</div>
                    <div>{m.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-300">
                <p className="text-xs text-slate-500 mb-1">Transfer ke:</p>
                <p className="font-bold">{selectedMethod.label}: <span className="text-white">{selectedMethod.number}</span></p>
                <p className="text-xs text-slate-400">a.n {selectedMethod.an}</p>
              </div>
            </div>

            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity">
              {loading ? "Memproses..." : "Buat Invoice →"}
            </button>
          </div>
        )}

        {step === "invoice" && order && (
          <div className="space-y-4">
            <div className="card-glass rounded-2xl border border-cyan-500/30 overflow-hidden">
              <div className={`bg-gradient-to-r ${pkg.bg} p-5 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs opacity-70 mb-1">INVOICE</p>
                    <p className="font-black text-lg font-mono">{order.id}</p>
                  </div>
                  <span className="bg-yellow-400 text-[#04060f] text-xs font-black px-3 py-1 rounded-full">PENDING</span>
                </div>
                <p className="text-xs opacity-60 mt-2">{formatDate(order.created_at)}</p>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  {[
                    { label:"Nama", val:order.nama },
                    { label:"No. HP", val:order.hp },
                    { label:"Paket", val:order.paket, cls: pkg.accent + " font-bold" },
                    { label:"Metode Bayar", val:selectedMethod.label },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={row.cls || "text-white"}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Total Pembayaran</span>
                  <span className="text-2xl font-black text-white">{formatRp(order.harga)}</span>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs text-cyan-400 font-bold mb-2">💳 Transfer ke:</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">{selectedMethod.label}</p>
                      <p className="text-slate-300 text-sm">{selectedMethod.number}</p>
                      <p className="text-slate-400 text-xs">a.n {selectedMethod.an}</p>
                    </div>
                    <button onClick={() => copy(selectedMethod.number, "rek")}
                      className="text-xs bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-3 py-2 rounded-lg hover:bg-cyan-500/30 transition-all">
                      {copied === "rek" ? "✓ Copied!" : "Copy No."}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Klik tombol di bawah untuk kirim bukti pembayaran via WhatsApp
                </p>
              </div>
            </div>

            <button onClick={goWhatsApp}
              className="w-full py-4 rounded-xl font-black text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              💬 Konfirmasi Bayar via WhatsApp
            </button>

            <button onClick={() => setStep("form")}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Edit Data
            </button>
          </div>
        )}

        {step === "confirm" && order && (
          <div className="card-glass rounded-2xl p-8 border border-green-500/30 text-center space-y-4">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="text-xl font-black text-white">Konfirmasi Terkirim!</h2>
            <p className="text-slate-400 text-sm">
              Invoice dan detail pembelian sudah dikirim ke WhatsApp admin. Lampirkan <strong className="text-white">bukti transfer</strong> pada chat tersebut.
            </p>
            <div className="bg-white/5 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice</span>
                <span className="text-white font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paket</span>
                <span className={`font-bold ${pkg.accent}`}>{order.paket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total</span>
                <span className="text-white font-bold">{formatRp(order.harga)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">Token VIP akan diaktivasi setelah pembayaran dikonfirmasi admin (max 1×24 jam)</p>
            <Link href="/" className="block w-full py-3 rounded-xl font-bold text-sm bg-white/10 text-slate-300 hover:bg-white/15 transition-all">
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
    <Suspense fallback={<div className="min-h-screen bg-[#04060f] flex items-center justify-center"><div className="text-slate-400">Memuat...</div></div>}>
      <OrderPageInner />
    </Suspense>
  );
}
