"use client";
import { useState, useEffect } from "react";

function formatRp(n: number) {
  return "Rp " + (n || 0).toLocaleString("id-ID");
}
function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

const STATUS_COLORS: any = {
  pending:   "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
  paid:      "bg-green-400/20 text-green-400 border-green-400/30",
  cancelled: "bg-red-400/20 text-red-400 border-red-400/30",
};

const PKG_COLORS: any = {
  Basic:"text-blue-400", Silver:"text-emerald-400", Gold:"text-yellow-400",
  Pro:"text-purple-400", Platinum:"text-slate-300", Elite:"text-yellow-300",
};

const METODE_LIST = ["DANA","OVO","GoPay","ShopeePay","SeaBank","BCA","Mandiri","BNI","BRI","Transfer Manual"];

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string|null>(null);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editMetode, setEditMetode] = useState("");
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [copiedToken, setCopiedToken] = useState<string|null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const d = await res.json();
      setOrders(d.orders || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string, note?: string, metode?: string) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action:"update_status", id, status, note, metode }),
    });
    const d = await res.json();
    // Update local state langsung (termasuk token_generated)
    if (d.success && d.order) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...d.order } : o));
    } else {
      fetchOrders();
    }
    setEditId(null);
  }

  async function deleteOrder(id: string) {
    if (!confirm("Hapus order ini?")) return;
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action:"delete", id }),
    });
    fetchOrders();
  }

  function startEdit(o: any) {
    setEditId(o.id);
    setEditNote(o.note || "");
    setEditStatus(o.status);
    setEditMetode(o.metode || "");
  }

  async function saveEdit() {
    if (!editId) return;
    await updateStatus(editId, editStatus, editNote, editMetode);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToken(text);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  // Filter
  let filtered = sourceFilter === "all" ? orders : orders.filter(o => (o.source||"ritel") === sourceFilter);
  filtered = filter === "all" ? filtered : filtered.filter(o => o.status === filter);

  const totalPaid = filtered.filter(o => o.status === "paid").reduce((s,o) => s+(o.harga||0), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const analisisCount = orders.filter(o => o.source === "analisis").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-glass rounded-xl p-4 border border-green-500/30 text-center">
          <p className="text-xs text-slate-400 mb-1">Total Terkonfirmasi</p>
          <p className="text-lg font-black text-green-400">{formatRp(totalPaid)}</p>
        </div>
        <div className="card-glass rounded-xl p-4 border border-yellow-500/30 text-center">
          <p className="text-xs text-slate-400 mb-1">Pending</p>
          <p className="text-lg font-black text-yellow-400">{pendingCount} order</p>
        </div>
        <div className="card-glass rounded-xl p-4 border border-emerald-500/30 text-center">
          <p className="text-xs text-slate-400 mb-1">Dari Analisis.io</p>
          <p className="text-lg font-black text-emerald-400">{analisisCount}</p>
        </div>
        <div className="card-glass rounded-xl p-4 border border-slate-700 text-center">
          <p className="text-xs text-slate-400 mb-1">Total Order</p>
          <p className="text-lg font-black text-white">{orders.length}</p>
        </div>
      </div>

      {/* Source filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id:"all", label:"Semua Sumber" },
          { id:"analisis", label:" Analisis.io" },
          { id:"ritel", label:" Ritel Community" },
        ].map(f => (
          <button key={f.id} onClick={() => setSourceFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${sourceFilter===f.id ? "bg-purple-500/20 border-purple-500/50 text-purple-300" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}>
            {f.label}
          </button>
        ))}
        <div className="flex-1 min-w-4" />
        {/* Status filter */}
        {["all","pending","paid","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${filter===f ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}>
            {f==="all"?"Semua":f==="pending"?"Pending":f==="paid"?"Lunas":"Batal"}
            {f!=="all"&&` (${orders.filter(o=>o.status===f).length})`}
          </button>
        ))}
        <button onClick={fetchOrders} className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-white/5 border-white/10 text-slate-400 hover:border-white/20">
           Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-slate-400 py-8">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-8 card-glass rounded-xl border border-white/10">
          Tidak ada order
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.id} className={`card-glass rounded-xl border overflow-hidden ${o.source==="analisis" ? "border-emerald-500/20" : "border-white/10"}`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-slate-400">{o.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[o.status]||STATUS_COLORS.pending}`}>
                    {o.status==="paid"?"LUNAS":o.status==="cancelled"?"BATAL":"PENDING"}
                  </span>
                  {o.source === "analisis" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                       analisis.io
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{formatDate(o.created_at)}</span>
              </div>

              {/* Body */}
              <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Nama</p>
                  <p className="text-white font-semibold">{o.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">No. WA</p>
                  <a href={`https://wa.me/${(o.hp||"").replace(/^0/,"62").replace(/\D/g,"")}`} target="_blank"
                    className="text-green-400 hover:underline font-semibold">{o.hp}</a>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Paket</p>
                  <p className={`font-bold ${PKG_COLORS[o.paket]||"text-white"}`}>{o.paket}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Total</p>
                  <p className="text-white font-bold">{formatRp(o.harga)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Metode</p>
                  <p className="text-slate-300">{o.metode||"-"}</p>
                </div>
                {o.email && (
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-slate-300 text-xs">{o.email}</p>
                  </div>
                )}
                {o.note && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-0.5">Catatan</p>
                    <p className="text-slate-300">{o.note}</p>
                  </div>
                )}
                {/* Token generated */}
                {o.token_generated && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Token VIP (Auto-Generated)</p>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                      <span className="font-mono text-sm font-black text-green-400 flex-1">{o.token_generated}</span>
                      <button onClick={() => copyToClipboard(o.token_generated)}
                        className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all">
                        {copiedToken === o.token_generated ? " Copied" : "Copy"}
                      </button>
                    </div>
                    {o.paid_at && <p className="text-xs text-slate-600 mt-1">Aktif sejak {formatDate(o.paid_at)}</p>}
                  </div>
                )}
              </div>

              {/* Edit Mode */}
              {editId === o.id ? (
                <div className="p-4 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Status</label>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="input-dark w-full text-sm">
                        <option value="pending">Pending</option>
                        <option value="paid">Lunas </option>
                        <option value="cancelled">Batal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Metode</label>
                      <select value={editMetode} onChange={e => setEditMetode(e.target.value)} className="input-dark w-full text-sm">
                        {METODE_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Catatan Admin</label>
                    <input value={editNote} onChange={e => setEditNote(e.target.value)}
                      placeholder="Catatan opsional..." className="input-dark w-full text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(null)}
                      className="flex-1 py-2 rounded-lg text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">Batal</button>
                    <button onClick={saveEdit}
                      className="flex-1 py-2 rounded-lg text-xs bg-green-600 text-white hover:bg-green-500 font-bold">Simpan</button>
                  </div>
                </div>
              ) : (
                <div className="px-4 pb-4 flex gap-2 flex-wrap">
                  {o.status === "pending" && (
                    <button onClick={() => updateStatus(o.id, "paid")}
                      className="flex-1 py-2 rounded-lg text-xs bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 font-bold min-w-[120px]">
                       Konfirmasi Lunas + Generate Token
                    </button>
                  )}
                  <button onClick={() => startEdit(o)}
                    className="py-2 px-3 rounded-lg text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                    Edit
                  </button>
                  <button onClick={() => deleteOrder(o.id)}
                    className="py-2 px-3 rounded-lg text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">
                    Hapus
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
