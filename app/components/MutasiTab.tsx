"use client";
import { useState, useEffect } from "react";

interface Mutasi {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  order_id?: string;
  created_at?: string;
}

interface MutasiDashboard {
  totalIncome: number;
  totalExpense: number;
  mutations: Mutasi[];
}

function MutasiTab() {
  const [data, setData] = useState<MutasiDashboard>({ totalIncome: 0, totalExpense: 0, mutations: [] });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Mutasi>>({});
  const [newMutasi, setNewMutasi] = useState<Partial<Mutasi>>({ type: "income", date: new Date().toISOString().split("T")[0] });
  const [showAdd, setShowAdd] = useState(false);

  const fetchMutasi = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/mutasi");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Fetch mutasi error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutasi();
  }, []);

  const handleEdit = (m: Mutasi) => {
    setEditingId(m.id);
    setEditForm({ ...m });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/admin/mutasi?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        fetchMutasi();
      }
    } catch (e) {
      console.error("Save edit error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus mutasi ini?")) return;
    try {
      const res = await fetch(`/api/admin/mutasi?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMutasi();
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleAddMutasi = async () => {
    if (!newMutasi.date || !newMutasi.description || !newMutasi.amount) {
      alert("Isi semua field");
      return;
    }
    try {
      const res = await fetch("/api/admin/mutasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMutasi),
      });
      if (res.ok) {
        setNewMutasi({ type: "income", date: new Date().toISOString().split("T")[0] });
        setShowAdd(false);
        fetchMutasi();
      }
    } catch (e) {
      console.error("Add error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-glass rounded-xl p-6 border border-green-500/30">
          <p className="text-sm text-slate-400 mb-1">Total Pemasukan</p>
          <p className="text-3xl font-black text-green-400">
            Rp {data.totalIncome.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 mt-2">Bulan ini (reset otomatis)</p>
        </div>
        <div className="card-glass rounded-xl p-6 border border-red-500/30">
          <p className="text-sm text-slate-400 mb-1">Total Pengeluaran</p>
          <p className="text-3xl font-black text-red-400">
            Rp {data.totalExpense.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 mt-2">Bulan ini</p>
        </div>
      </div>

      {/* Net Income */}
      <div className="card-glass rounded-xl p-6 border border-emerald-500/30">
        <p className="text-sm text-slate-400 mb-1">Net (Pemasukan - Pengeluaran)</p>
        <p className={`text-3xl font-black ${data.totalIncome - data.totalExpense >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          Rp {(data.totalIncome - data.totalExpense).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Add Mutasi */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-sm hover:bg-blue-500/20 transition-all"
      >
        + Tambah Mutasi
      </button>

      {showAdd && (
        <div className="card-glass rounded-xl p-6 border border-blue-500/30 space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Tanggal</label>
            <input
              type="date"
              value={newMutasi.date || ""}
              onChange={(e) => setNewMutasi({ ...newMutasi, date: e.target.value })}
              className="input-dark w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Keterangan</label>
            <input
              type="text"
              placeholder="Contoh: Pembelian paket Gold - Thoriq"
              value={newMutasi.description || ""}
              onChange={(e) => setNewMutasi({ ...newMutasi, description: e.target.value })}
              className="input-dark w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Jumlah</label>
              <input
                type="number"
                placeholder="0"
                value={newMutasi.amount || ""}
                onChange={(e) => setNewMutasi({ ...newMutasi, amount: parseInt(e.target.value) || 0 })}
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Tipe</label>
              <select
                value={newMutasi.type || "income"}
                onChange={(e) => setNewMutasi({ ...newMutasi, type: e.target.value as "income" | "expense" })}
                className="input-dark w-full"
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 rounded-lg bg-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-600 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleAddMutasi}
              className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-bold text-sm hover:opacity-90 transition-all"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      {/* Mutasi List */}
      <div className="card-glass rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Riwayat Mutasi</h3>
          <p className="text-xs text-slate-400 mt-1">Klik untuk edit atau hapus</p>
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-400">Loading...</div>
        ) : data.mutations.length === 0 ? (
          <div className="p-6 text-center text-slate-400">Belum ada mutasi</div>
        ) : (
          <div className="space-y-2 p-6">
            {data.mutations.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition-all">
                {editingId === m.id ? (
                  <div className="w-full space-y-2">
                    <input
                      type="date"
                      value={editForm.date || ""}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="input-dark w-full text-sm"
                    />
                    <input
                      type="text"
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="input-dark w-full text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editForm.amount || ""}
                        onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) || 0 })}
                        className="input-dark flex-1 text-sm"
                      />
                      <select
                        value={editForm.type || "income"}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                        className="input-dark text-sm"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 rounded text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 py-2 rounded text-xs bg-green-600 text-white hover:bg-green-500 transition-all"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm text-white font-bold">{m.description}</p>
                      <p className="text-xs text-slate-400">{m.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className={`text-sm font-bold ${m.type === "income" ? "text-green-400" : "text-red-400"}`}>
                        {m.type === "income" ? "+" : "-"} Rp {m.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="px-3 py-1 rounded text-xs bg-yellow-600 text-white hover:bg-yellow-500 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-500 transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MutasiTab;
