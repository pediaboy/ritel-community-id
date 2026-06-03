"use client";
import { useState, useEffect, useCallback } from "react";
import MutasiTab from "@/app/components/MutasiTab";
import OrdersTab from "@/app/components/OrdersTab";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "ritel2025";

// API-backed store: fetch on mount, setState locally for immediate UI update
function useLocalStore<T>(key: string, initial: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const set = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      return next;
    });
  }, []);
  return [state, set];
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const login = () => {
    setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem("admin_auth", "1");
        onLogin();
      } else { setErr("Username atau password salah."); }
      setLoading(false);
    }, 400);
  };
  return (
    <div className="min-h-screen bg-[#04060f] flex items-center justify-center px-4">
      <div className="galaxy-stars" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="card-glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl mb-4">RC</div>
            <h1 className="text-xl font-black text-white">Admin Panel</h1>
            <p className="text-slate-500 text-xs mt-1">RITEL COMMUNITY.ID</p>
          </div>
          <div className="space-y-3">
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Username" className="input-dark" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password" className="input-dark" />
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            <button onClick={login} disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </div>
          <Link href="/" className="block text-center text-xs text-slate-600 hover:text-cyan-400 mt-5 transition-colors">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = "signals" | "tokens" | "topstocks" | "liveinfo" | "testimonials" | "pricing" | "ticker" | "motivasi" | "loginlogs" | "mutasi" | "orders" | "owners_partners" | "admin_feed" | "bagger" | "bandar";

function Btn({ onClick, color, children, className = "" }: { onClick: () => void; color: string; children: React.ReactNode; className?: string }) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 hover:bg-green-500/25 border-green-500/20",
    red: "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/25 border-cyan-500/20",
  };
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${colors[color] || colors.blue} ${className}`}>
      {children}
    </button>
  );
}

function isExpired(dt: string) { return dt ? new Date(dt) < new Date() : false; }
function isNearExpiry(dt: string) { if (!dt) return false; const d = new Date(dt); const now = new Date(); return d > now && d.getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000; }


// ===== OWNERS & PARTNERS TAB =====
function OwnersPartnersTab({ syncToAPI }: { syncToAPI: (type:string, data:any)=>void }) {
  const [owners, setOwners] = useState<any[]>([
    { id:"o1", name:"Thirafi Thariq Al Idris", role:"Founder & CEO", badge:"👑", tag:"Owner" }
  ]);
  const [partners, setPartners] = useState<any[]>([]);
  const [waLinks, setWaLinks] = useState({ grup:"https://wa.me/6282218723401", channel:"https://wa.me/6282218723401" });
  const [ownerForm, setOwnerForm] = useState({ name:"", role:"", badge:"👤", tag:"Owner" });
  const [partnerForm, setPartnerForm] = useState({ name:"", role:"", badge:"🤝" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      if (d.owners?.length) setOwners(d.owners);
      if (d.partners?.length) setPartners(d.partners);
      if (d.wa_links) setWaLinks(d.wa_links);
    }).catch(()=>{});
  },[]);

  const saveOwners = (updated: any[]) => {
    setOwners(updated);
    syncToAPI("owners", updated);
    setMsg("✅ Owner disimpan!"); setTimeout(()=>setMsg(""),2500);
  };
  const savePartners = (updated: any[]) => {
    setPartners(updated);
    syncToAPI("partners", updated);
    setMsg("✅ Partner disimpan!"); setTimeout(()=>setMsg(""),2500);
  };
  const saveWaLinks = () => {
    syncToAPI("wa_links", waLinks);
    setMsg("✅ Link WA disimpan!"); setTimeout(()=>setMsg(""),2500);
  };

  const addOwner = () => {
    if (!ownerForm.name.trim()) return;
    saveOwners([...owners, {...ownerForm, id:"o_"+Date.now()}]);
    setOwnerForm({name:"",role:"",badge:"👤",tag:"Owner"});
  };
  const addPartner = () => {
    if (!partnerForm.name.trim()) return;
    savePartners([...partners, {...partnerForm, id:"p_"+Date.now()}]);
    setPartnerForm({name:"",role:"",badge:"🤝"});
  };

  return (
    <div>
      <h2 className="text-white font-bold text-sm mb-1">Owner & Partner</h2>
      <p className="text-slate-500 text-xs mb-4">Tampil di halaman Profil VIP member</p>
      {msg && <div className="mb-3 text-xs p-2 rounded-lg bg-green-500/10 text-green-400">{msg}</div>}
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-xs mb-3">🔗 Link WA (Homepage & VIP)</h3>
        <div className="space-y-2 mb-3">
          <div><label className="text-slate-400 text-xs mb-1 block">Grup WA</label><input value={waLinks.grup} onChange={e=>setWaLinks({...waLinks,grup:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" placeholder="https://chat.whatsapp.com/..."/></div>
          <div><label className="text-slate-400 text-xs mb-1 block">Channel WA</label><input value={waLinks.channel} onChange={e=>setWaLinks({...waLinks,channel:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" placeholder="https://whatsapp.com/channel/..."/></div>
        </div>
        <button onClick={saveWaLinks} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Simpan Link WA</button>
      </div>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-xs mb-3">👑 Owner / Founder</h3>
        <div className="space-y-2 mb-3">
          {owners.map(o=>(
            <div key={o.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <span className="text-xl">{o.badge}</span>
              <div className="flex-1"><p className="text-white font-bold text-sm">{o.name}</p><p className="text-slate-400 text-xs">{o.role}</p></div>
              <button onClick={()=>saveOwners(owners.filter(x=>x.id!==o.id))} className="text-red-400 text-xs">Hapus</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={ownerForm.name} onChange={e=>setOwnerForm({...ownerForm,name:e.target.value})} placeholder="Nama" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={ownerForm.role} onChange={e=>setOwnerForm({...ownerForm,role:e.target.value})} placeholder="Jabatan" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={ownerForm.badge} onChange={e=>setOwnerForm({...ownerForm,badge:e.target.value})} placeholder="Emoji" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <button onClick={addOwner} className="col-span-2 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">+ Tambah Owner</button>
        </div>
      </div>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-bold text-xs mb-3">🤝 Partner</h3>
        <div className="space-y-2 mb-3">
          {partners.length===0 && <p className="text-slate-600 text-xs text-center py-3">Belum ada partner</p>}
          {partners.map(p=>(
            <div key={p.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <span className="text-xl">{p.badge}</span>
              <div className="flex-1"><p className="text-white font-bold text-sm">{p.name}</p><p className="text-slate-400 text-xs">{p.role}</p></div>
              <button onClick={()=>savePartners(partners.filter(x=>x.id!==p.id))} className="text-red-400 text-xs">Hapus</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={partnerForm.name} onChange={e=>setPartnerForm({...partnerForm,name:e.target.value})} placeholder="Nama partner" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={partnerForm.role} onChange={e=>setPartnerForm({...partnerForm,role:e.target.value})} placeholder="Peran" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={partnerForm.badge} onChange={e=>setPartnerForm({...partnerForm,badge:e.target.value})} placeholder="Emoji" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <button onClick={addPartner} className="col-span-2 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl">+ Tambah Partner</button>
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN FEED TAB =====
function AdminFeedTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content_text, setContentText] = useState("");
  const [tag, setTag] = useState("info");
  const [pinned, setPinned] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showVip, setShowVip] = useState(true);
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState("");

  const loadFeed = async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/feed"); const data = await res.json(); if (data.success) setPosts(data.feed); } catch {}
    setLoading(false);
  };
  useEffect(() => { loadFeed(); }, []);

  const handlePost = async () => {
    if (!content_text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/admin/feed", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"create", content:content_text, tag, pinned, show_home:showHome, show_vip:showVip }) });
      const data = await res.json();
      if (data.success) { setMsg("✅ Feed diposting!"); setContentText(""); await loadFeed(); }
      else setMsg("❌ " + data.message);
    } catch { setMsg("❌ Error."); }
    setPosting(false); setTimeout(()=>setMsg(""),3000);
  };

  const tagColors: Record<string,string> = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };

  return (
    <div>
      <h2 className="text-white font-bold text-sm mb-1">Admin Feed</h2>
      <p className="text-slate-500 text-xs mb-4">Post sebagai "Admin RITEL COMMUNITY.ID" — tampil di homepage & VIP</p>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1e5af0,#00c8ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>RC</div>
          <div><div className="text-white font-bold text-sm">Admin RITEL COMMUNITY.ID</div><div className="text-slate-500 text-xs">Verified Admin</div></div>
        </div>
        <textarea value={content_text} onChange={e=>setContentText(e.target.value)} rows={4} maxLength={2000} placeholder="Tulis pengumuman, analisis, sinyal..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm resize-none outline-none focus:border-blue-500/50 mb-3"/>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className="text-slate-400 text-xs mb-1 block">Tag</label>
            <select value={tag} onChange={e=>setTag(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none">
              {["info","sinyal","analisis","berita","penting"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="text-slate-400 text-xs mb-1 block">Opsi</label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pinned} onChange={e=>setPinned(e.target.checked)}/><span className="text-white text-xs">📌 Pin</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showHome} onChange={e=>setShowHome(e.target.checked)}/><span className="text-white text-xs">🏠 Homepage</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showVip} onChange={e=>setShowVip(e.target.checked)}/><span className="text-white text-xs">💎 VIP</span></label>
            </div>
          </div>
        </div>
        {msg && <div className={`mb-3 text-xs p-2 rounded-lg ${msg.startsWith("✅")?"text-green-400 bg-green-500/10":"text-red-400 bg-red-500/10"}`}>{msg}</div>}
        <button onClick={handlePost} disabled={!content_text.trim()||posting} className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl disabled:opacity-40">
          {posting?"Memposting...":"📢 Post Sekarang"}
        </button>
      </div>
      {loading ? <div className="text-center py-8 text-slate-500 text-sm">Memuat...</div> : posts.length===0 ? <div className="text-center py-8 text-slate-600 text-sm">Belum ada feed.</div> : (
        <div className="space-y-3">
          {posts.map(p=>(
            <div key={p.id} style={{background:p.pinned?"rgba(30,90,240,0.07)":"rgba(255,255,255,0.02)",border:p.pinned?"1px solid rgba(30,90,240,0.25)":"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 16px"}}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {p.tag&&<span style={{fontSize:10,background:`${tagColors[p.tag]||"#6b7280"}22`,color:tagColors[p.tag]||"#9ca3af",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{p.tag}</span>}
                  {p.pinned&&<span className="text-[10px] text-yellow-400">📌</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={async()=>{await fetch("/api/admin/feed",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"pin",id:p.id})});loadFeed();}} className={`text-[10px] px-2 py-0.5 rounded border ${p.pinned?"text-yellow-400 border-yellow-500/30":"text-slate-500 border-white/10"}`}>{p.pinned?"Unpin":"Pin"}</button>
                  <button onClick={async()=>{await fetch("/api/admin/feed",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete",id:p.id})});loadFeed();}} className="text-[10px] text-red-400 border border-red-500/20 px-2 py-0.5 rounded">Hapus</button>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{p.content}</p>
              <p className="text-slate-600 text-[10px] mt-2">{new Date(p.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ===== BAGGER & BANDAR TAB =====
function BaggerBandarTab({ type, syncToAPI }: { type:"bagger"|"bandar", syncToAPI:(t:string,d:any)=>void }) {
  const isBagger = type==="bagger";
  const storeKey = isBagger ? "bagger_signals" : "bandar_signals";
  const [items, setItems] = useState<any[]>([]);
  const [editId, setEditId] = useState<string|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const emptyForm = { kode:"", saham:"", entry:"", tp:"", sl:"", notes:"", action: isBagger?"BAGGER":"BANDAR" };
  const [form, setForm] = useState<any>(emptyForm);

  useEffect(() => {
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      const all = d.signals || [];
      setItems(all.filter((s:any) => isBagger
        ? (s.isBagger || s.action==="BAGGER" || s.type==="bagger")
        : (s.isBandar || s.action==="BANDAR" || s.type==="bandar")
      ));
    }).catch(()=>{});
  },[type]);

  const save = async () => {
    if (!form.kode.trim()) { alert("Kode saham wajib diisi"); return; }
    const item = { ...form, id: editId||Date.now().toString(), isBagger, isBandar:!isBagger, type, created_at: editId ? undefined : new Date().toISOString() };
    let updated;
    // Fetch all signals, merge
    const r = await fetch("/api/admin/sync");
    const d = await r.json();
    const allSigs = d.signals || [];
    if (editId) {
      updated = allSigs.map((s:any)=>s.id===editId ? {...s,...item} : s);
    } else {
      updated = [...allSigs, item];
    }
    await fetch("/api/admin/sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({type:"signals",data:updated}) });
    setItems(updated.filter((s:any)=>isBagger?(s.isBagger||s.action==="BAGGER"):(s.isBandar||s.action==="BANDAR")));
    setMsg(`✅ ${isBagger?"Bagger":"Bandar"} ${editId?"diperbarui":"ditambahkan"}!`);
    setTimeout(()=>setMsg(""),2500);
    setForm(emptyForm); setEditId(null); setShowForm(false);
  };

  const del = async (id:string) => {
    if (!confirm("Hapus sinyal ini?")) return;
    const r = await fetch("/api/admin/sync");
    const d = await r.json();
    const updated = (d.signals||[]).filter((s:any)=>s.id!==id);
    await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"signals",data:updated})});
    setItems(items.filter(x=>x.id!==id));
    setMsg("✅ Dihapus!"); setTimeout(()=>setMsg(""),2000);
  };

  const edit = (item:any) => {
    setForm({kode:item.kode||"",saham:item.saham||"",entry:item.entry||"",tp:item.tp||"",sl:item.sl||"",notes:item.notes||"",action:item.action||emptyForm.action});
    setEditId(item.id); setShowForm(true);
  };

  const acColor = isBagger ? { bg:"rgba(245,158,11,0.1)", text:"#f59e0b", border:"rgba(245,158,11,0.3)" } : { bg:"rgba(139,92,246,0.1)", text:"#8b5cf6", border:"rgba(139,92,246,0.3)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-bold text-sm">{isBagger?"🚀 Bagger Picks":"🔍 Sinyal Bandar"}</h2>
        <button onClick={()=>{setShowForm(!showForm);setEditId(null);setForm(emptyForm);}} className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{background:acColor.bg,color:acColor.text,border:`1px solid ${acColor.border}`}}>
          {showForm?"Tutup":"+Tambah"}
        </button>
      </div>
      <p className="text-slate-500 text-xs mb-4">{isBagger?"Saham multi-bagger pilihan analis":"Deteksi pola akumulasi bandar"}</p>
      {msg&&<div className="mb-3 text-xs p-2 rounded-lg bg-green-500/10 text-green-400">{msg}</div>}

      {showForm&&(
        <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-5 space-y-3">
          <p className="text-white font-bold text-xs mb-2">{editId?"Edit":"Tambah"} {isBagger?"Bagger":"Bandar"}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Kode Saham *</label>
              <input value={form.kode} onChange={e=>setForm({...form,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none uppercase"/>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Nama Emiten</label>
              <input value={form.saham} onChange={e=>setForm({...form,saham:e.target.value})} placeholder="Bank Central Asia" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Entry / Akumulasi</label>
              <input value={form.entry} onChange={e=>setForm({...form,entry:e.target.value})} placeholder="9.800 – 10.200" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Target (TP)</label>
              <input value={form.tp} onChange={e=>setForm({...form,tp:e.target.value})} placeholder="12.000" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Stop Loss</label>
              <input value={form.sl} onChange={e=>setForm({...form,sl:e.target.value})} placeholder="9.200" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Action Label</label>
              <input value={form.action} onChange={e=>setForm({...form,action:e.target.value.toUpperCase()})} placeholder={isBagger?"BAGGER":"BANDAR"} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none uppercase"/>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Catatan / Analisis</label>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} placeholder={isBagger?"Alasan bagger: revenue tumbuh 40% YoY, ekspansi ke...":"Deteksi akumulasi: volume anomali 3x rata-rata, broker asing net buy..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none resize-none"/>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2.5 text-white text-xs font-bold rounded-xl" style={{background:`linear-gradient(135deg,${isBagger?"#f59e0b,#d97706":"#8b5cf6,#6d28d9"})`}}>
              {editId?"Simpan Perubahan":"+Tambah"}
            </button>
            {editId&&<button onClick={()=>{setShowForm(false);setEditId(null);setForm(emptyForm);}} className="px-4 py-2.5 text-slate-400 text-xs font-bold rounded-xl bg-white/5">Batal</button>}
          </div>
        </div>
      )}

      {items.length===0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">{isBagger?"🚀":"🔍"}</p>
          <p className="text-slate-500 text-sm">Belum ada {isBagger?"bagger":"bandar"} signals. Klik +Tambah.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item=>(
            <div key={item.id} className="bg-[#0a1628] border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{width:40,height:40,borderRadius:10,background:acColor.bg,border:`1px solid ${acColor.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:acColor.text,flexShrink:0}}>{(item.kode||"--").slice(0,4)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-base">{item.kode}</span>
                      <span style={{background:acColor.bg,color:acColor.text,border:`1px solid ${acColor.border}`,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:6}}>{item.action}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{item.saham}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>edit(item)} className="text-xs px-2 py-1 rounded-lg text-blue-400 border border-blue-500/20 bg-blue-500/5">Edit</button>
                  <button onClick={()=>del(item.id)} className="text-xs px-2 py-1 rounded-lg text-red-400 border border-red-500/20 bg-red-500/5">Hapus</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[{l:"Entry",v:item.entry,c:"rgba(255,255,255,0.8)"},{l:"Target",v:item.tp,c:"#22c55e"},{l:"Stop Loss",v:item.sl,c:"#ef4444"}].map(({l,v,c})=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"6px 8px"}}>
                    <p style={{color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:2}}>{l}</p>
                    <p style={{color:c,fontWeight:700,fontSize:13}}>{v||"-"}</p>
                  </div>
                ))}
              </div>
              {item.notes&&<p className="text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-2 mt-2">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("signals");
  const [loading, setLoading] = useState(true);

  const [signals, setSignals] = useLocalStore<any[]>("signals", []);
  const [tokens, setTokens] = useLocalStore<any[]>("tokens", []);
  const [testimonials, setTestimonials] = useLocalStore<any[]>("testimonials", []);
  const [liveMsg, setLiveMsgState] = useLocalStore<string>("liveinfo_msg", "");
  const [liveActive, setLiveActiveState] = useLocalStore<boolean>("liveinfo_active", false);
  const [customStocks, setCustomStocks] = useLocalStore<any[]>("custom_stocks", []);
  const [stockMode, setStockMode] = useLocalStore<"live"|"custom">("stock_mode", "live");

  // PRICING DATA
  const defaultPricing = [
    { id:"basic", name:"Basic", price:100000, priceLabel:"Rp 100.000", period:"/bulan", color:"blue", description:"Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.", features:["Sinyal saham harian","Berita pasar realtime","Chart IHSG live","Modul dasar investasi","Grup WA Basic"], flashSale:null },
    { id:"silver", name:"Silver", price:250000, priceLabel:"Rp 250.000", period:"/bulan", color:"cyan", description:"Untuk investor yang ingin memahami fundamental dan mulai screening saham potensial.", features:["Semua fitur Basic","Analisis fundamental saham","Screening saham bagger","Risk & money management","Grup WA Silver"], flashSale:null },
    { id:"gold", name:"Gold", price:500000, priceLabel:"Rp 500.000", period:"/bulan", color:"gold", popular:true, description:"Paket terlaris! Lengkap dengan sinyal premium dan panduan psikologi trading.", features:["Semua fitur Silver","Sinyal entry, antri, TP, SL premium","Analisis teknikal mendalam","Modul psikologi & emosi trading","Potensi saham multi-bagger","Grup WA Gold Eksklusif"], flashSale:null },
    { id:"pro", name:"Pro", price:750000, priceLabel:"Rp 750.000", period:"/bulan", color:"purple", description:"Dilengkapi AI Agent personal untuk bantu analisis dan keputusan trading.", features:["Semua fitur Gold","AI Agent trading assistant","Watchlist saham personal","Laporan mingguan eksklusif","Priority support","Grup WA Pro VIP"], hasAI:true, flashSale:null },
    { id:"platinum", name:"Platinum", price:900000, priceLabel:"Rp 900.000", period:"/bulan", color:"platinum", description:"Pengalaman investasi terdepan dengan AI Agent canggih dan konsultasi personal.", features:["Semua fitur Pro","AI Agent + analisis portofolio","Konsultasi 1-on-1 dengan analis","Akses semua modul VIP","Sinyal real-time 24/7","Grup WA Platinum Elite"], hasAI:true, flashSale:null },
    { id:"elite", name:"Elite", price:1000000, priceLabel:"Rp 1.000.000", period:"/bulan", color:"elite", isElite:true, description:"Paket paling eksklusif. Mentoring langsung, AI Agent Elite, dan akses penuh semua fitur.", features:["Semua fitur Platinum","AI Agent Elite terdepan","Portofolio management personal","Akses mentor langsung","Event & webinar eksklusif","Grup WA Elite Master","Laporan harian personal"], hasAI:true, flashSale:null },
  ];
  const [pricing, setPricing] = useLocalStore<any[]>("pricing", defaultPricing);

  // TICKER DATA
  const defaultTicker = [
    { id:"t1", kode:"IHSG", price:"7.333", change:"+0.66%" },
    { id:"t2", kode:"BBCA", price:"9.875", change:"+1.28%" },
    { id:"t3", kode:"BBRI", price:"4.680", change:"-0.64%" },
    { id:"t4", kode:"TLKM", price:"3.290", change:"+1.54%" },
    { id:"t5", kode:"ASII", price:"5.200", change:"-1.42%" },
    { id:"t6", kode:"GOTO", price:"86", change:"+4.88%" },
  ];
  const [tickerStocks, setTickerStocks] = useLocalStore<any[]>("ticker_stocks", defaultTicker);
  const [tickerSpeed, setTickerSpeed] = useLocalStore<number>("ticker_speed", 32);

  // PREMIUM SIGNALS (halaman sinyal premium)
  const defaultPremiumSignals = [
    { id:"ps1", title:"Bandarmologi Report", content:"Analisis bandarmologi mingguan. Deteksi akumulasi & distribusi big player.", isActive:true },
    { id:"ps2", title:"Tape Reading Live", content:"Laporan tape reading intraday. Baca pergerakan smart money secara real-time.", isActive:true },
    { id:"ps3", title:"Bagger Pick Bulanan", content:"1-3 saham bagger pilihan analis setiap bulan. Potensi naik 2x-10x.", isActive:true },
  ];
  const [premiumSignals, setPremiumSignals] = useLocalStore<any[]>("premium_signals", defaultPremiumSignals);

  // Form states
  const [sigForm, setSigForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
  const [editSigId, setEditSigId] = useState<string|null>(null);
  const [showSigForm, setShowSigForm] = useState(false);

  const [tokForm, setTokForm] = useState<any>({ email:"", name:"", package:"gold", expiredAt:"" });
  const [editTokId, setEditTokId] = useState<string|null>(null);
  const [showTokForm, setShowTokForm] = useState(false);

  const [stockForm, setStockForm] = useState<any>({ kode:"", name:"", price:"", changePercent:"" });
  const [editStockId, setEditStockId] = useState<string|null>(null);
  const [showStockForm, setShowStockForm] = useState(false);

  const [testiForm, setTestiForm] = useState<any>({ name:"", package:"gold", rating:5, text:"", date:"", isApproved:true });
  const [editTestiId, setEditTestiId] = useState<string|null>(null);
  const [showTestiForm, setShowTestiForm] = useState(false);

  const [pricingForm, setPricingForm] = useState<any>({ id:"", name:"", priceLabel:"", period:"/bulan", description:"", features:"", flashSale:{ discount:"", price:"", rawPrice:0, endTime:"" }, hasFlashSale:false, discountPct:"", flashDuration:"" });
  const [editPricingId, setEditPricingId] = useState<string|null>(null);
  const [showPricingForm, setShowPricingForm] = useState(false);

  const [tickerForm, setTickerForm] = useState<any>({ kode:"", price:"", change:"" });
  const [editTickerId, setEditTickerId] = useState<string|null>(null);
  const [showTickerForm, setShowTickerForm] = useState(false);

  // MOTIVASI
  const [motivasiList, setMotivasiList] = useLocalStore<any[]>("motivasi", [
    { id:"m1", text:"Jangan takut untuk belajar — satu langkah kecil hari ini adalah investasi terbesar untuk masa depanmu." },
    { id:"m2", text:"Pasar tidak menghukum yang berani belajar. Pasar menghukum yang tidak mau bersiap." },
    { id:"m3", text:"Setiap investor sukses pernah menjadi pemula. Yang membedakan mereka adalah konsistensi belajar." },
    { id:"m4", text:"Cari mentor yang tepat, karena pengalaman mereka bisa memotong kurva belajarmu bertahun-tahun." },
    { id:"m5", text:"Profit bukan keberuntungan — itu adalah hasil dari disiplin, ilmu, dan manajemen risiko yang benar." },
  ]);
  const [motivasiForm, setMotivasiForm] = useState<any>({ text:"" });
  const [editMotivasiId, setEditMotivasiId] = useState<string|null>(null);
  const [showMotivasiForm, setShowMotivasiForm] = useState(false);

  const [premSigForm, setPremSigForm] = useState<any>({ title:"", content:"", isActive:true });
  const [editPremSigId, setEditPremSigId] = useState<string|null>(null);
  const [showPremSigForm, setShowPremSigForm] = useState(false);

  const [liveInput, setLiveInput] = useState("");
  const [liveSaved, setLiveSaved] = useState(false);
  const [topStocksLive, setTopStocksLive] = useState<any[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);

  useEffect(() => { setLiveInput(liveMsg); }, [liveMsg]);
  useEffect(() => {
    fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[])).catch(()=>{});
  }, []);

  // Load all data from API on mount
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        // Signals - normalize from DB
        const sigRes = await fetch("/api/admin/signals").then(r => r.json()).catch(() => ({}));
        if (sigRes.signals) setSignals(sigRes.signals.map((s: any) => ({
          ...s,
          saham: s.saham || "", kode: s.kode || "",
          action: s.action || "BUY", entry: s.entry || "",
          tp: s.tp || "", sl: s.sl || "", notes: s.notes || "",
          package: s.package || ["gold"],
        })));

        // Tokens - normalize snake_case from DB to camelCase
        const tokRes = await fetch("/api/admin/tokens").then(r => r.json()).catch(() => ({}));
        if (tokRes.tokens) setTokens(tokRes.tokens.map((t: any) => ({
          ...t,
          isActive: t.is_active !== undefined ? t.is_active : t.isActive,
          expiredAt: t.expired_at || t.expiredAt,
        })));

        // Testimonials - normalize
        const testiRes = await fetch("/api/testimonials").then(r => r.json()).catch(() => ({}));
        if (testiRes.testimonials) setTestimonials(testiRes.testimonials.map((t: any) => ({
          ...t,
          isApproved: t.is_approved !== undefined ? t.is_approved : t.isApproved,
        })));

        // Live info
        const liveRes = await fetch("/api/admin/liveinfo").then(r => r.json()).catch(() => ({}));
        if (liveRes.liveInfo) {
          setLiveMsgState(liveRes.liveInfo.message || "");
          setLiveActiveState(liveRes.liveInfo.isActive !== undefined ? liveRes.liveInfo.isActive : (liveRes.liveInfo.is_active || false));
        }

        // Custom stocks - normalize
        const stocksRes = await fetch("/api/admin/stocks").then(r => r.json()).catch(() => ({}));
        if (stocksRes.custom && stocksRes.custom.length > 0) {
          setCustomStocks(stocksRes.custom.map((s: any) => ({
            ...s,
            changePercent: s.change_percent || s.changePercent || "",
          })));
          setStockMode("custom");
        }

        // Ticker, pricing, premiumSignals
        const syncRes = await fetch("/api/admin/sync").then(r => r.json()).catch(() => ({}));
        if (syncRes.ticker && syncRes.ticker.length > 0) setTickerStocks(syncRes.ticker);
        if (syncRes.pricing && syncRes.pricing.length > 0) setPricing(syncRes.pricing);
        if (syncRes.premiumSignals && syncRes.premiumSignals.length > 0) setPremiumSignals(syncRes.premiumSignals);
        // Login logs
        const logsRes = await fetch("/api/admin/loginlogs").then(r => r.json()).catch(() => ({}));
        if (logsRes.logs) setLoginLogs(logsRes.logs);
      } catch (e) {}
      setLoading(false);
    };
    loadAll();
  }, []);

  const syncToAPI = async (type: string, data: any) => {
    try {
      await fetch("/api/admin/sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type, data }) });
    } catch {}
  };

  const pkgOpts = ["basic","silver","gold","pro","platinum","elite"];
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-cyan-400" };

  // ===== SIGNALS =====
  const saveSig = async () => {
    if (!sigForm.kode.trim() || !sigForm.saham.trim()) { alert("Isi kode dan nama saham!"); return; }
    if (editSigId) {
      await fetch(`/api/admin/signals?id=${editSigId}`, {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...sigForm, id:editSigId})}).catch(()=>{});
      setSignals(signals.map(s => s.id === editSigId ? { ...sigForm, id: editSigId } : s));
    } else {
      const newId = Date.now().toString();
      await fetch("/api/admin/signals", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...sigForm, id:newId})}).catch(()=>{});
      setSignals([{ ...sigForm, id: newId, createdAt: new Date().toISOString() }, ...signals]);
    }
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
    setEditSigId(null); setShowSigForm(false);
  };
  const editSig = (s: any) => { setSigForm({...s}); setEditSigId(s.id); setShowSigForm(true); window.scrollTo(0,0); };
  const delSig = async (id: string) => {
    if (!confirm("Hapus sinyal?")) return;
    await fetch(`/api/admin/signals?id=${id}`, {method:"DELETE"}).catch(()=>{});
    setSignals(signals.filter(s=>s.id!==id));
  };

  // ===== TOKENS =====
  const genToken = (pkg: string) => "RC-" + pkg.toUpperCase() + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
  const saveTok = async () => {
    if (!tokForm.email.trim() || !tokForm.expiredAt) { alert("Isi email dan tanggal expired!"); return; }
    if (editTokId) {
      await fetch("/api/admin/tokens", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:editTokId, ...tokForm})}).catch(()=>{});
      setTokens(tokens.map(t => t.id === editTokId ? { ...t, ...tokForm } : t));
    } else {
      const res = await fetch("/api/admin/tokens", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(tokForm)}).then(r=>r.json()).catch(()=>({}));
      const newTok = res.token || { ...tokForm, id: Date.now().toString(), token: genToken(tokForm.package), isActive:true };
      // Normalize field names from DB
      const normalized = { ...newTok, isActive: newTok.is_active ?? newTok.isActive ?? true, expiredAt: newTok.expired_at || newTok.expiredAt };
      setTokens([normalized, ...tokens]);
    }
    setTokForm({ email:"", name:"", package:"gold", expiredAt:"" });
    setEditTokId(null); setShowTokForm(false);
  };
  const editTok = (t: any) => { setTokForm({ email:t.email, name:t.name, package:t.package, expiredAt:(t.expiredAt||t.expired_at||"")?.slice(0,16) }); setEditTokId(t.id); setShowTokForm(true); window.scrollTo(0,0); };
  const delTok = async (id: string) => {
    if (!confirm("Hapus token?")) return;
    await fetch(`/api/admin/tokens?id=${id}`, {method:"DELETE"}).catch(()=>{});
    setTokens(tokens.filter(t=>t.id!==id));
  };
  const toggleTok = async (t: any) => {
    const newActive = !(t.isActive !== undefined ? t.isActive : t.is_active);
    await fetch("/api/admin/tokens", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t.id, isActive:newActive})}).catch(()=>{});
    setTokens(tokens.map(x=>x.id===t.id?{...x,isActive:newActive,is_active:newActive}:x));
  };
  const extendTok = async (t: any) => {
    const days = prompt("Tambah berapa hari?"); if (!days || isNaN(parseInt(days))) return;
    const baseDate = new Date(t.expiredAt || t.expired_at || Date.now());
    baseDate.setDate(baseDate.getDate()+parseInt(days));
    const newExp = baseDate.toISOString();
    await fetch("/api/admin/tokens", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t.id, expiredAt:newExp})}).catch(()=>{});
    setTokens(tokens.map(x=>x.id===t.id?{...x,expiredAt:newExp,expired_at:newExp}:x));
  };

  // ===== TOP STOCKS =====
  const importLive = async () => {
    const imported = topStocksLive.map(s => ({
      id: s.symbol || Date.now().toString(), kode: s.symbol?.replace(".JK",""), name: s.name,
      price: s.price?.toString(), changePercent: s.changePercent?.toFixed(2)
    }));
    setCustomStocks(imported); setStockMode("custom");
    await fetch("/api/admin/stocks", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:imported})}).catch(()=>{});
  };
  const resetLive = async () => {
    setCustomStocks([]); setStockMode("live");
    await fetch("/api/admin/stocks", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:[]})}).catch(()=>{});
  };
  const saveStock = async () => {
    if (!stockForm.kode.trim()) { alert("Isi kode saham!"); return; }
    let updated;
    if (editStockId) {
      updated = customStocks.map(s => s.id === editStockId ? { ...stockForm, id: editStockId } : s);
    } else {
      updated = [...customStocks, { ...stockForm, id: Date.now().toString() }];
    }
    setCustomStocks(updated); setStockMode("custom");
    await fetch("/api/admin/stocks", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:updated})}).catch(()=>{});
    syncToAPI("stocks_mode", "custom");
    setStockForm({ kode:"", name:"", price:"", changePercent:"" });
    setEditStockId(null); setShowStockForm(false);
  };
  const editStock = (s: any) => { setStockForm({...s}); setEditStockId(s.id); setShowStockForm(true); };
  const delStock = async (id: string) => {
    if (!confirm("Hapus saham?")) return;
    const updated = customStocks.filter(s=>s.id!==id);
    setCustomStocks(updated);
    await fetch("/api/admin/stocks", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({custom:updated})}).catch(()=>{});
  };

  // ===== TESTIMONIALS =====
  const saveTesti = async () => {
    if (!testiForm.name.trim() || !testiForm.text.trim()) { alert("Isi nama dan testimoni!"); return; }
    if (editTestiId) {
      await fetch("/api/testimonials", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...testiForm, id: editTestiId }) }).catch(()=>{});
      setTestimonials(testimonials.map(t => t.id === editTestiId ? { ...testiForm, id: editTestiId } : t));
    } else {
      const res = await fetch("/api/testimonials", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(testiForm) }).then(r=>r.json()).catch(()=>({}));
      const newT = res.testimonial || { ...testiForm, id: Date.now().toString() };
      setTestimonials([newT, ...testimonials]);
    }
    setTestiForm({ name:"", package:"gold", rating:5, text:"", date:"", isApproved:true });
    setEditTestiId(null); setShowTestiForm(false);
  };
  const editTesti = (t: any) => { setTestiForm({...t}); setEditTestiId(t.id); setShowTestiForm(true); window.scrollTo(0,0); };
  const delTesti = async (id: string) => {
    if (!confirm("Hapus testimoni?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method:"DELETE" }).catch(()=>{});
    setTestimonials(testimonials.filter(t=>t.id!==id));
  };
  const toggleTesti = async (t: any) => {
    const updated = { ...t, isApproved: !t.isApproved };
    await fetch("/api/testimonials", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(updated) }).catch(()=>{});
    setTestimonials(testimonials.map(x=>x.id===t.id ? updated : x));
  };

  // ===== PRICING =====
  const calcFlashPrice = (basePrice: number, pct: number) => {
    const discounted = Math.round(basePrice * (1 - pct/100));
    return "Rp " + discounted.toLocaleString("id-ID");
  };
  const openPricingEdit = (p: any) => {
    const fs = p.flashSale || { discount:"", price:"", rawPrice:0, endTime:"" };
    // Back-calculate discount pct if exists
    let discPct = "";
    if (fs.discount) discPct = fs.discount.replace("%","");
    setPricingForm({
      id: p.id, name: p.name, priceLabel: p.priceLabel, period: p.period,
      description: p.description, features: (p.features||[]).join("\n"),
      flashSale: fs, hasFlashSale: !!p.flashSale,
      discountPct: discPct,
      flashDuration: "",
    });
    setEditPricingId(p.id); setShowPricingForm(true); window.scrollTo(0,0);
  };
  const applyDiscountCalc = () => {
    const pct = parseFloat(pricingForm.discountPct);
    if (isNaN(pct) || pct <= 0 || pct >= 100) { alert("Masukkan % diskon yang valid (1-99)"); return; }
    const basePkg = pricing.find(p => p.id === editPricingId);
    if (!basePkg) return;
    const rawBase = basePkg.price || 100000;
    const flashPrice = calcFlashPrice(rawBase, pct);
    const endTime = pricingForm.flashDuration
      ? new Date(Date.now() + parseFloat(pricingForm.flashDuration) * 3600000).toISOString()
      : pricingForm.flashSale?.endTime || "";
    setPricingForm({...pricingForm,
      flashSale: { ...pricingForm.flashSale, discount: pct+"%" , price: flashPrice, rawPrice: Math.round(rawBase*(1-pct/100)), endTime },
    });
  };
  const savePricing = () => {
    if (!pricingForm.priceLabel.trim()) { alert("Isi harga!"); return; }
    const features = pricingForm.features.split("\n").map((f:string)=>f.trim()).filter(Boolean);
    const flashSale = pricingForm.hasFlashSale && pricingForm.flashSale.price ? pricingForm.flashSale : null;
    const updated = pricing.map(p => p.id === editPricingId ? { ...p, priceLabel: pricingForm.priceLabel, period: pricingForm.period, description: pricingForm.description, features, flashSale, price: p.price } : p);
    setPricing(updated);
    syncToAPI("pricing", updated);
    setEditPricingId(null); setShowPricingForm(false);
  };

  // ===== TICKER =====
  const saveTicker = () => {
    if (!tickerForm.kode.trim()) { alert("Isi kode saham!"); return; }
    let updated;
    if (editTickerId) {
      updated = tickerStocks.map(t => t.id === editTickerId ? { ...tickerForm, id: editTickerId } : t);
    } else {
      updated = [...tickerStocks, { ...tickerForm, id: Date.now().toString() }];
    }
    setTickerStocks(updated);
    syncToAPI("ticker", updated);
    setTickerForm({ kode:"", price:"", change:"" });
    setEditTickerId(null); setShowTickerForm(false);
  };
  const editTicker = (t: any) => { setTickerForm({...t}); setEditTickerId(t.id); setShowTickerForm(true); };
  const delTicker = (id: string) => {
    const updated = tickerStocks.filter(t=>t.id!==id);
    if (!confirm("Hapus dari ticker?")) return;
    setTickerStocks(updated);
    syncToAPI("ticker", updated);
  };

  // ===== PREMIUM SIGNALS PAGE =====
  const savePremSig = () => {
    if (!premSigForm.title.trim()) { alert("Isi judul!"); return; }
    let updated;
    if (editPremSigId) {
      updated = premiumSignals.map(s => s.id === editPremSigId ? { ...premSigForm, id: editPremSigId } : s);
    } else {
      updated = [{ ...premSigForm, id: Date.now().toString() }, ...premiumSignals];
    }
    setPremiumSignals(updated);
    syncToAPI("premiumSignals", updated);
    setPremSigForm({ title:"", content:"", isActive:true });
    setEditPremSigId(null); setShowPremSigForm(false);
  };
  const editPremSig = (s: any) => { setPremSigForm({...s}); setEditPremSigId(s.id); setShowPremSigForm(true); window.scrollTo(0,0); };
  const delPremSig = (id: string) => {
    if (!confirm("Hapus?")) return;
    const updated = premiumSignals.filter(s=>s.id!==id);
    setPremiumSignals(updated);
    syncToAPI("premiumSignals", updated);
  };

  // MOTIVASI CRUD
  const saveMotivasi = () => {
    if (!motivasiForm.text.trim()) { alert("Isi kata motivasi!"); return; }
    let updated;
    if (editMotivasiId) {
      updated = motivasiList.map(m => m.id === editMotivasiId ? { ...m, text: motivasiForm.text } : m);
    } else {
      updated = [...motivasiList, { id: "m"+Date.now(), text: motivasiForm.text }];
    }
    setMotivasiList(updated);
    syncToAPI("motivasi", updated);
    setMotivasiForm({ text:"" }); setEditMotivasiId(null); setShowMotivasiForm(false);
  };
  const editMotivasi = (m: any) => { setMotivasiForm({ text: m.text }); setEditMotivasiId(m.id); setShowMotivasiForm(true); window.scrollTo(0,0); };
  const delMotivasi = (id: string) => { if (!confirm("Hapus motivasi ini?")) return; const updated = motivasiList.filter(m=>m.id!==id); setMotivasiList(updated); syncToAPI("motivasi", updated); };

  const tabs: { id: Tab; label: string }[] = [
    { id:"signals", label:"Sinyal" },
    { id:"tokens", label:"Token VIP" },
    { id:"topstocks", label:"Top Saham" },
    { id:"liveinfo", label:"Live Info" },
    { id:"testimonials", label:"Testimoni" },
    { id:"pricing", label:"Harga/Paket" },
    { id:"motivasi", label:"Motivasi" },
    { id:"ticker", label:"Ticker" },
    { id:"mutasi", label:"💰 Mutasi" },
    { id:"orders", label:"🧾 Orders" },
    { id:"loginlogs", label:"🔐 Login Log" },
  ];

  return (
    <div className="min-h-screen bg-[#04060f] text-white">
      <div className="galaxy-stars" />
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            <p className="text-cyan-400 text-sm font-bold">Memuat data...</p>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xs">RC</div>
              <span className="font-black text-white text-sm">Admin Panel</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-all">Lihat Web</Link>
              <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all">Keluar</button>
            </div>
          </div>
          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-1 pb-0">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`text-xs px-3 py-2.5 font-medium whitespace-nowrap border-b-2 transition-all ${tab===t.id ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* ======== SIGNALS ======== */}
          {tab==="signals" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Sinyal Harian</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{signals.length} sinyal aktif</p>
                </div>
                <button onClick={()=>{setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditSigId(null);setShowSigForm(!showSigForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showSigForm&&!editSigId?"Tutup":"Tambah Sinyal"}
                </button>
              </div>
              {showSigForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editSigId?"Edit Sinyal":"Tambah Sinyal Baru"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="input-dark">
                        {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="9.750–9.800" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Target (TP)</label><input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="10.200 | 10.500" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="9.500" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Catatan/Analisis</label><textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Breakout resistance, volume tinggi..." rows={2} className="input-dark resize-none"/></div>
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-2 block">Akses Paket</label>
                    <div className="flex flex-wrap gap-3">
                      {pkgOpts.map(p=>(
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e=>{const cur=sigForm.package||[];setSigForm({...sigForm,package:e.target.checked?[...cur,p]:cur.filter((x:string)=>x!==p)});}} className="accent-cyan-500 w-4 h-4"/>
                          <span className="text-xs text-slate-300 capitalize">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveSig} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editSigId?"Update Sinyal":"Simpan Sinyal"}</button>
                    <button onClick={()=>{setShowSigForm(false);setEditSigId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {signals.length===0 ? (
                  <div className="col-span-3 card rounded-2xl p-12 text-center">
                    <p className="text-slate-400 text-sm">Belum ada sinyal. Klik "Tambah Sinyal" untuk membuat sinyal.</p>
                  </div>
                ) : signals.map(s=>(
                  <div key={s.id} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div><span className="font-black text-white text-base">{s.kode}</span><div className="text-slate-500 text-xs mt-0.5">{s.saham}</div></div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${actionColor[s.action]||"text-white"} bg-white/5`}>{s.action}</span>
                    </div>
                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="text-white font-medium">{s.entry||"—"}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">TP</span><span className="text-green-400 font-medium">{s.tp||"—"}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">SL</span><span className="text-red-400 font-medium">{s.sl||"—"}</span></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-500 border-t border-white/5 pt-2 mb-3 line-clamp-2">{s.notes}</p>}
                    <div className="flex flex-wrap gap-1 mb-3">{(s.package||[]).map((p:string)=><span key={p} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500 capitalize">{p}</span>)}</div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <Btn onClick={()=>editSig(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={()=>delSig(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== TOKENS ======== */}
          {tab==="tokens" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Token VIP</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{tokens.length} token · {tokens.filter(t=>t.isActive&&!isExpired(t.expiredAt)).length} aktif</p>
                </div>
                <button onClick={()=>{setTokForm({email:"",name:"",package:"gold",expiredAt:""});setEditTokId(null);setShowTokForm(!showTokForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTokForm&&!editTokId?"Tutup":"Tambah Token"}
                </button>
              </div>
              {showTokForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTokId?"Edit Token":"Generate Token Baru"}</h3>
                  <div className="space-y-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama User</label><input value={tokForm.name} onChange={e=>setTokForm({...tokForm,name:e.target.value})} placeholder="Nama lengkap" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Email</label><input value={tokForm.email} onChange={e=>setTokForm({...tokForm,email:e.target.value})} placeholder="user@email.com" className="input-dark" type="email"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                      <select value={tokForm.package} onChange={e=>setTokForm({...tokForm,package:e.target.value})} className="input-dark">
                        {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Expired Tanggal</label><input type="datetime-local" value={tokForm.expiredAt} onChange={e=>setTokForm({...tokForm,expiredAt:e.target.value})} className="input-dark"/></div>
                    <div className="flex gap-2">
                      <button onClick={saveTok} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editTokId?"Update Token":"Generate Token"}</button>
                      <button onClick={()=>{setShowTokForm(false);setEditTokId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tokens.length===0 ? (
                  <div className="col-span-2 card rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">Belum ada token.</p></div>
                ) : tokens.map(t=>{
                  const expired=isExpired(t.expiredAt); const near=isNearExpiry(t.expiredAt);
                  return (
                    <div key={t.id} className={`card rounded-xl p-4 ${expired?"border-red-500/20":near?"border-yellow-500/15":""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-white">{t.name||"—"}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${expired?"bg-red-400/10 text-red-400":t.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>
                            {expired?"EXPIRED":t.isActive?"AKTIF":"NONAKTIF"}
                          </span>
                        </div>
                        <span className="text-xs text-cyan-400 font-bold capitalize">{t.package}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1.5">{t.email}</div>
                      <div className="font-mono text-xs bg-white/5 rounded-lg px-3 py-2 text-slate-300 mb-2 break-all select-all">{t.token}</div>
                      <div className={`text-xs mb-3 ${expired?"text-red-400":near?"text-yellow-400":"text-slate-600"}`}>
                        Expired: {new Date(t.expiredAt).toLocaleString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                      </div>
                      <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                        <Btn onClick={()=>editTok(t)} color="blue">Edit</Btn>
                        <Btn onClick={()=>toggleTok(t)} color={(t.isActive??t.is_active)?"yellow":"green"}>{(t.isActive??t.is_active)?"Nonaktif":"Aktifkan"}</Btn>
                        <Btn onClick={()=>extendTok(t)} color="purple">+Hari</Btn>
                        <Btn onClick={()=>delTok(t.id)} color="red">Hapus</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======== TOP STOCKS ======== */}
          {tab==="topstocks" && (
            <div>
              <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Top Saham</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${stockMode==="custom"?"bg-yellow-400/10 text-yellow-400":"bg-green-400/10 text-green-400"}`}>
                    {stockMode==="custom"?"Mode Custom":"Mode Live"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Btn onClick={()=>fetch("/api/stocks").then(r=>r.json()).then(d=>setTopStocksLive(d.stocks||[]))} color="green">Refresh Live</Btn>
                  {stockMode==="live" && <Btn onClick={importLive} color="blue">Import & Edit</Btn>}
                  {stockMode==="custom" && <Btn onClick={resetLive} color="yellow">Reset ke Live</Btn>}
                  <button onClick={()=>{setStockForm({kode:"",name:"",price:"",changePercent:""});setEditStockId(null);setShowStockForm(!showStockForm);setStockMode("custom");}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                    {showStockForm&&!editStockId?"Tutup":"Tambah Saham"}
                  </button>
                </div>
              </div>
              {showStockForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editStockId?"Edit Saham":"Tambah Saham Custom"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={stockForm.kode} onChange={e=>setStockForm({...stockForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={stockForm.name} onChange={e=>setStockForm({...stockForm,name:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Harga</label><input value={stockForm.price} onChange={e=>setStockForm({...stockForm,price:e.target.value})} placeholder="9875" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Perubahan %</label><input value={stockForm.changePercent} onChange={e=>setStockForm({...stockForm,changePercent:e.target.value})} placeholder="1.28" className="input-dark"/></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveStock} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editStockId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowStockForm(false);setEditStockId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5 transition-all">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(stockMode==="custom"?customStocks:topStocksLive).map((s,i)=>{
                  const pct = parseFloat(stockMode==="custom"?s.changePercent:s.changePercent);
                  const pos = pct >= 0;
                  return (
                    <div key={i} className="card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-1">
                        <div><div className="font-black text-white">{stockMode==="custom"?s.kode:s.symbol?.replace(".JK","")}</div><div className="text-xs text-slate-500">{s.name}</div></div>
                        <span className={`text-xs font-bold ${pos?"text-green-400":"text-red-400"}`}>{pos?"+":""}{pct?.toFixed?.(2)||pct}%</span>
                      </div>
                      <div className="text-lg font-black text-white mb-3">{stockMode==="custom"?Number(s.price).toLocaleString("id-ID"):s.price?.toLocaleString("id-ID")}</div>
                      {stockMode==="custom" && (
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <Btn onClick={()=>editStock(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                          <Btn onClick={()=>delStock(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======== LIVE INFO ======== */}
          {tab==="liveinfo" && (
            <div className="max-w-2xl">
              <h2 className="text-white font-bold text-sm mb-4">Info Live (Halaman VIP)</h2>
              <div className="card rounded-2xl p-5 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-white">Tampilkan Info Live</label>
                  <button onClick={()=>setLiveActiveState(!liveActive)} className={`relative w-12 h-6 rounded-full transition-all ${liveActive?"bg-cyan-500":"bg-slate-700"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${liveActive?"left-7":"left-1"}`}/>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Pesan Info</label>
                  <textarea value={liveInput} onChange={e=>setLiveInput(e.target.value)} rows={4} placeholder="Contoh: Market hari ini volatile, harap perhatikan manajemen risiko..." className="input-dark resize-none"/>
                </div>
                <button onClick={async()=>{
  setLiveMsgState(liveInput);
  setLiveActiveState(liveActive);
  await fetch("/api/admin/liveinfo", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:liveInput,isActive:liveActive})}).catch(()=>{});
  setLiveSaved(true);setTimeout(()=>setLiveSaved(false),2000);
}} className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold">
                  {liveSaved?"Tersimpan!":"Simpan Info"}
                </button>
              </div>
              {/* Premium Signals Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-white font-bold text-sm">Konten Sinyal Premium (Halaman VIP)</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Isi bagian sinyal premium yang muncul di halaman VIP</p>
                  </div>
                  <button onClick={()=>{setPremSigForm({title:"",content:"",isActive:true});setEditPremSigId(null);setShowPremSigForm(!showPremSigForm);}} className="btn-primary text-xs px-3 py-1.5 rounded-xl">
                    {showPremSigForm&&!editPremSigId?"Tutup":"Tambah"}
                  </button>
                </div>
                {showPremSigForm && (
                  <div className="card rounded-2xl p-5 mb-4 border border-cyan-500/20">
                    <div className="space-y-3">
                      <div><label className="text-xs text-slate-500 mb-1 block">Judul</label><input value={premSigForm.title} onChange={e=>setPremSigForm({...premSigForm,title:e.target.value})} placeholder="Bandarmologi Report" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">Konten/Deskripsi</label><textarea value={premSigForm.content} onChange={e=>setPremSigForm({...premSigForm,content:e.target.value})} rows={4} placeholder="Isi konten sinyal premium..." className="input-dark resize-none"/></div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={premSigForm.isActive} onChange={e=>setPremSigForm({...premSigForm,isActive:e.target.checked})} className="accent-cyan-500"/>
                        <label className="text-xs text-slate-300">Aktif (tampil di halaman VIP)</label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={savePremSig} className="btn-primary flex-1 py-2 rounded-xl text-sm">{editPremSigId?"Update":"Simpan"}</button>
                        <button onClick={()=>{setShowPremSigForm(false);setEditPremSigId(null);}} className="px-4 py-2 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {premiumSignals.map(s=>(
                    <div key={s.id} className="card rounded-xl p-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white text-sm">{s.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive?"bg-green-400/10 text-green-400":"bg-slate-400/10 text-slate-400"}`}>{(s.isActive ?? s.is_active)?"Aktif":"Nonaktif"}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{s.content}</p>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Btn onClick={()=>editPremSig(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                        <Btn onClick={()=>delPremSig(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======== TESTIMONIALS ======== */}
          {tab==="testimonials" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Testimoni</h2>
                  <p className="text-slate-500 text-xs">{testimonials.filter(t=>t.isApproved).length} aktif · {testimonials.length} total</p>
                </div>
                <button onClick={()=>{setTestiForm({name:"",package:"gold",rating:5,text:"",date:"",isApproved:true});setEditTestiId(null);setShowTestiForm(!showTestiForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTestiForm&&!editTestiId?"Tutup":"Tambah Testimoni"}
                </button>
              </div>
              {showTestiForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTestiId?"Edit":"Tambah"} Testimoni</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={testiForm.name} onChange={e=>setTestiForm({...testiForm,name:e.target.value})} placeholder="Nama member" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Paket</label>
                      <select value={testiForm.package} onChange={e=>setTestiForm({...testiForm,package:e.target.value})} className="input-dark">
                        {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Rating (1-5)</label>
                      <select value={testiForm.rating} onChange={e=>setTestiForm({...testiForm,rating:parseInt(e.target.value)})} className="input-dark">
                        {[5,4,3,2,1].map(r=><option key={r} value={r} className="bg-black">{r} Bintang</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input value={testiForm.date} onChange={e=>setTestiForm({...testiForm,date:e.target.value})} placeholder="Mei 2025" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Testimoni</label><textarea value={testiForm.text} onChange={e=>setTestiForm({...testiForm,text:e.target.value})} rows={3} placeholder="Isi testimoni..." className="input-dark resize-none"/></div>
                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" checked={testiForm.isApproved} onChange={e=>setTestiForm({...testiForm,isApproved:e.target.checked})} className="accent-cyan-500"/>
                    <label className="text-xs text-slate-300">Tampilkan di halaman (approved)</label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTesti} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">{editTestiId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowTestiForm(false);setEditTestiId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map(t=>(
                  <div key={t.id} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white">{t.name}</span>
                        <span className="ml-2 text-xs text-cyan-400 capitalize">{t.package}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.isApproved?"bg-green-400/10 text-green-400":"bg-red-400/10 text-red-400"}`}>
                        {t.isApproved?"Tampil":"Hidden"}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">{Array(t.rating||5).fill(0).map((_,i)=><span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
                    <p className="text-slate-400 text-xs mb-2 line-clamp-3">{t.text}</p>
                    <div className="text-xs text-slate-600 mb-3">{t.date}</div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <Btn onClick={()=>editTesti(t)} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={()=>toggleTesti(t)} color={t.isApproved?"yellow":"green"} className="flex-1 text-center">{t.isApproved?"Sembunyikan":"Tampilkan"}</Btn>
                      <Btn onClick={()=>delTesti(t.id)} color="red">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== PRICING ======== */}
          {tab==="pricing" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Harga/Paket</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Tambah, edit, hapus paket · Flash sale + kalkulator otomatis · Edit periode /bulan</p>
                </div>
                <button onClick={()=>{
                  const newId = "paket_"+Date.now();
                  const newPkg = { id:newId, name:"Paket Baru", price:200000, priceLabel:"Rp 200.000", period:"/bulan", color:"blue", popular:false, isElite:false, hasAI:false, flashSale:null, description:"Deskripsi paket baru.", features:["Fitur 1","Fitur 2"] };
                  const updated = [...pricing, newPkg];
                  setPricing(updated); syncToAPI("pricing", updated);
                  openPricingEdit(newPkg);
                }} className="btn-primary text-xs px-4 py-2 rounded-xl">➕ Tambah Paket</button>
              </div>
              {showPricingForm && editPricingId && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Edit Paket: {pricing.find(p=>p.id===editPricingId)?.name}</h3>
                  <div className="space-y-3 mb-4">
                    <div><label className="text-xs text-slate-500 mb-1 block">Label Harga Normal</label><input value={pricingForm.priceLabel} onChange={e=>setPricingForm({...pricingForm,priceLabel:e.target.value})} placeholder="Rp 100.000" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Periode</label><input value={pricingForm.period} onChange={e=>setPricingForm({...pricingForm,period:e.target.value})} placeholder="/bulan" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Deskripsi Paket</label><textarea value={pricingForm.description} onChange={e=>setPricingForm({...pricingForm,description:e.target.value})} rows={3} className="input-dark resize-none"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Fitur (1 per baris)</label><textarea value={pricingForm.features} onChange={e=>setPricingForm({...pricingForm,features:e.target.value})} rows={5} placeholder="Sinyal saham harian&#10;Berita pasar realtime" className="input-dark resize-none"/></div>
                  </div>
                  {/* Flash Sale */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <button onClick={()=>setPricingForm({...pricingForm,hasFlashSale:!pricingForm.hasFlashSale})}
                        className={`relative w-10 h-5 rounded-full transition-all ${pricingForm.hasFlashSale?"bg-orange-500":"bg-slate-700"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${pricingForm.hasFlashSale?"left-5":"left-0.5"}`}/>
                      </button>
                      <label className="text-sm font-bold text-white">Aktifkan Flash Sale</label>
                      {pricingForm.flashSale?.endTime && new Date(pricingForm.flashSale.endTime) > new Date() && (
                        <span className="ml-auto text-xs text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full">Timer aktif</span>
                      )}
                    </div>
                    {pricingForm.hasFlashSale && (
                      <div className="space-y-3">
                        {/* Calculator */}
                        <div className="bg-black/30 rounded-xl p-3 border border-orange-500/10">
                          <p className="text-xs text-orange-400 font-bold mb-2">Kalkulator Diskon Otomatis</p>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="text-xs text-slate-500 mb-1 block">% Diskon</label>
                              <input value={pricingForm.discountPct||""} onChange={e=>setPricingForm({...pricingForm,discountPct:e.target.value})}
                                placeholder="50" type="number" min="1" max="99" className="input-dark"/>
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-slate-500 mb-1 block">Durasi Timer (jam)</label>
                              <input value={pricingForm.flashDuration||""} onChange={e=>setPricingForm({...pricingForm,flashDuration:e.target.value})}
                                placeholder="24" type="number" min="0" className="input-dark"/>
                            </div>
                            <button onClick={applyDiscountCalc}
                              className="px-3 py-2.5 rounded-xl text-xs font-bold bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/20 transition-all whitespace-nowrap">
                              Hitung
                            </button>
                          </div>
                          {pricingForm.discountPct && !isNaN(parseFloat(pricingForm.discountPct)) && (
                            <p className="text-xs text-green-400 mt-2">
                              Harga setelah diskon {pricingForm.discountPct}%: <strong>{calcFlashPrice(pricing.find(p=>p.id===editPricingId)?.price||100000, parseFloat(pricingForm.discountPct))}</strong>
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Label Diskon (auto/manual)</label>
                            <input value={pricingForm.flashSale?.discount||""} onChange={e=>setPricingForm({...pricingForm,flashSale:{...pricingForm.flashSale,discount:e.target.value}})}
                              placeholder="50%" className="input-dark"/>
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Harga Flash Sale (auto/manual)</label>
                            <input value={pricingForm.flashSale?.price||""} onChange={e=>setPricingForm({...pricingForm,flashSale:{...pricingForm.flashSale,price:e.target.value}})}
                              placeholder="Rp 50.000" className="input-dark"/>
                          </div>
                        </div>
                        {pricingForm.flashSale?.endTime && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Timer: {new Date(pricingForm.flashSale.endTime) > new Date() ? "Aktif hingga "+new Date(pricingForm.flashSale.endTime).toLocaleString("id-ID") : "Sudah berakhir"}</span>
                            <button onClick={()=>setPricingForm({...pricingForm,flashSale:{...pricingForm.flashSale,endTime:""}})}
                              className="text-red-400 hover:text-red-300 text-xs">Hapus Timer</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={savePricing} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">Simpan Perubahan</button>
                    <button onClick={()=>{setShowPricingForm(false);setEditPricingId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricing.map(p=>{
                  const colorMap: any = { blue:"border-blue-500/30", cyan:"border-cyan-500/30", gold:"border-yellow-500/30", purple:"border-purple-500/30", platinum:"border-slate-400/30", elite:"border-yellow-400/50" };
                  return (
                    <div key={p.id} className={`card rounded-xl p-5 border ${colorMap[p.color]||"border-white/10"}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div><div className="font-black text-white text-base">{p.name}</div><div className="text-xs text-slate-500 mt-0.5">{p.period}</div></div>
                        <div className="text-right">
                          <div className="text-lg font-black text-white">{p.priceLabel}</div>
                          {p.flashSale && <span className="flash-badge">FLASH {p.flashSale.discount}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.description}</p>
                      <ul className="space-y-1 mb-4">
                        {(p.features||[]).slice(0,3).map((f:string,i:number)=><li key={i} className="text-xs text-slate-500 flex gap-1"><span className="text-cyan-400">✓</span>{f}</li>)}
                        {(p.features||[]).length>3 && <li className="text-xs text-slate-600">+{p.features.length-3} fitur lainnya</li>}
                      </ul>
                      <div className="flex gap-2">
                        <button onClick={()=>openPricingEdit(p)} className="flex-1 py-2 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all">
                          Edit
                        </button>
                        <button onClick={()=>{ if(!confirm("Hapus paket "+p.name+"?")) return; const updated=pricing.filter(x=>x.id!==p.id); setPricing(updated); syncToAPI("pricing",updated); }} className="px-3 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all">
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======== TICKER ======== */}
          {tab==="ticker" && (
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Ticker Saham</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Kelola saham di ticker berjalan + atur kecepatan animasi</p>
                </div>
                <button onClick={()=>{setTickerForm({kode:"",price:"",change:""});setEditTickerId(null);setShowTickerForm(!showTickerForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showTickerForm&&!editTickerId?"Tutup":"Tambah Ticker"}
                </button>
              </div>
              {/* Ticker Speed Control */}
              <div className="card rounded-xl p-4 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Kecepatan Ticker (detik)</label>
                    <p className="text-xs text-slate-600">Makin kecil = makin cepat. Default: 32 detik</p>
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="text-xs text-slate-500">Cepat (10s)</span>
                    <input type="range" min="10" max="80" step="5" value={tickerSpeed}
                      onChange={e=>{ const v=parseInt(e.target.value); setTickerSpeed(v); syncToAPI("ticker_speed", v); }}
                      className="w-32 accent-blue-500"/>
                    <span className="text-xs text-slate-500">Lambat (80s)</span>
                    <span className="text-blue-400 font-black text-sm w-12 text-center">{tickerSpeed}s</span>
                  </div>
                  <button onClick={()=>{ setTickerSpeed(32); syncToAPI("ticker_speed", 32); }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-white hover:bg-white/5">Reset</button>
                </div>
              </div>
              {showTickerForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-cyan-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editTickerId?"Edit":"Tambah"} Item Ticker</h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={tickerForm.kode} onChange={e=>setTickerForm({...tickerForm,kode:e.target.value.toUpperCase()})} placeholder="IHSG" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Harga</label><input value={tickerForm.price} onChange={e=>setTickerForm({...tickerForm,price:e.target.value})} placeholder="7.333" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Perubahan</label><input value={tickerForm.change} onChange={e=>setTickerForm({...tickerForm,change:e.target.value})} placeholder="+0.66%" className="input-dark"/></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTicker} className="btn-primary flex-1 py-2.5 rounded-xl text-sm">{editTickerId?"Update":"Simpan"}</button>
                    <button onClick={()=>{setShowTickerForm(false);setEditTickerId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tickerStocks.map((t,i)=>{
                  const pos = t.change?.startsWith("+");
                  return (
                    <div key={i} className="card rounded-xl p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-white text-sm">{t.kode}</span>
                        <span className={`text-xs font-bold ${pos?"text-green-400":"text-red-400"}`}>{t.change}</span>
                      </div>
                      <div className="font-bold text-slate-300 text-sm mb-3">{t.price}</div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <Btn onClick={()=>editTicker(t)} color="blue" className="flex-1 text-center">Edit</Btn>
                        <Btn onClick={()=>delTicker(t.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

          {tab==="mutasi" && <MutasiTab />}
          {tab==="orders" && <OrdersTab />}

          {/* ======== MOTIVASI ======== */}
          {tab==="motivasi" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Kata Motivasi</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Tampil sebagai ticker berjalan di halaman utama & VIP</p>
                </div>
                <button onClick={()=>{setMotivasiForm({text:""});setEditMotivasiId(null);setShowMotivasiForm(!showMotivasiForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showMotivasiForm&&!editMotivasiId?"Tutup":"Tambah Motivasi"}
                </button>
              </div>
              {showMotivasiForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                  <h3 className="text-white font-bold mb-3 text-sm">{editMotivasiId?"Edit Kata Motivasi":"Tambah Kata Motivasi"}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Isi Kata Motivasi</label>
                      <textarea value={motivasiForm.text} onChange={e=>setMotivasiForm({...motivasiForm,text:e.target.value})}
                        placeholder="Jangan takut untuk belajar — setiap langkah kecil adalah investasi untuk masa depanmu..."
                        rows={3} className="input-dark resize-none"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveMotivasi} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editMotivasiId?"Update":"Simpan"}</button>
                      <button onClick={()=>{setShowMotivasiForm(false);setEditMotivasiId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {motivasiList.length===0 ? (
                  <div className="card rounded-xl p-10 text-center text-slate-500 text-sm">Belum ada kata motivasi.</div>
                ) : motivasiList.map(m=>(
                  <div key={m.id} className="card rounded-xl p-4 flex items-start gap-3">
                    <span className="text-yellow-400 text-lg flex-shrink-0 mt-0.5">✨</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm leading-relaxed">{m.text}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Btn onClick={()=>editMotivasi(m)} color="blue">Edit</Btn>
                      <Btn onClick={()=>delMotivasi(m.id)} color="red">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="loginlogs" && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-white font-bold text-sm">🔐 Login Log — Silver ke Atas</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{loginLogs.length} login tercatat</p>
                </div>
                <button onClick={async()=>{ const r=await fetch("/api/admin/loginlogs").then(x=>x.json()).catch(()=>({})); if(r.logs) setLoginLogs(r.logs); }} className="text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all">Refresh</button>
              </div>
              {loginLogs.length===0 ? (
                <div className="card rounded-xl p-10 text-center text-slate-500 text-sm">Belum ada log login.</div>
              ) : (
                <div className="space-y-2">
                  {loginLogs.map((log:any, i:number) => (
                    <div key={i} className="card rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs">
                          {log.name?.charAt(0)||"?"}
                        </div>
                        <div>
                          <div className="text-white text-sm font-bold">{log.name}</div>
                          <div className="text-slate-500 text-xs">🌐 {log.ip}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${log.package==="elite"?"bg-yellow-400/10 text-yellow-300":log.package==="platinum"?"bg-slate-400/10 text-slate-300":log.package==="pro"?"bg-purple-400/10 text-purple-400":log.package==="gold"?"bg-yellow-500/10 text-yellow-400":log.package==="silver"?"bg-cyan-400/10 text-cyan-400":"bg-white/5 text-white"}`}>{log.package}</span>
                        <span className="text-slate-600">...{log.token}</span>
                        <span className="text-slate-500">{new Date(log.time).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OWNERS & PARTNERS */}
          {tab==="owners_partners" && <OwnersPartnersTab syncToAPI={syncToAPI} />}

          {/* ADMIN FEED */}
          {tab==="admin_feed" && <AdminFeedTab />}

          {/* BAGGER */}
          {tab==="bagger" && <BaggerBandarTab type="bagger" syncToAPI={syncToAPI} />}

          {/* BANDAR */}
          {tab==="bandar" && <BaggerBandarTab type="bandar" syncToAPI={syncToAPI} />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setAuthed(localStorage.getItem("admin_auth") === "1");
    setLoading(false);
  }, []);
  if (loading) return <div className="min-h-screen bg-[#04060f] flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { localStorage.removeItem("admin_auth"); setAuthed(false); }} />;
}


