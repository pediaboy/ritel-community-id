"use client";
import { useState, useEffect, useCallback } from "react";
import MutasiTab from "@/app/components/MutasiTab";
import MoreMenu from "@/app/components/MoreMenu";
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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="galaxy-stars" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="card-glass rounded-xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-500 flex items-center justify-center text-[#FFFFFF] font-black text-xl mb-4">RC</div>
            <h1 className="headline text-xl">Admin Panel</h1>
            <p className="text-slate-500 text-xs mt-1 tracking-wide">RITEL COMMUNITY.ID</p>
          </div>
          <div className="space-y-3">
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Username" className="input-dark" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password" className="input-dark" />
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            <button onClick={login} disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm">
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </div>
          <Link href="/" className="block text-center text-xs text-slate-600 hover:text-emerald-400 mt-5 transition-colors">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

type Tab = "signals" | "tokens" | "topstocks" | "liveinfo" | "testimonials" | "pricing" | "ticker" | "motivasi" | "loginlogs" | "mutasi" | "orders" | "owners_partners" | "admin_feed" | "bagger" | "bandar" | "bsjp" | "bpjs" | "rekap" | "jurnal" | "leaderboard";

function Btn({ onClick, color, children, className = "" }: { onClick: () => void; color: string; children: React.ReactNode; className?: string }) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 hover:bg-green-500/25 border-green-500/20",
    red: "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/25 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20",
  };
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${colors[color] || colors.blue} ${className}`}>
      {children}
    </button>
  );
}



// ===== OWNERS & PARTNERS TAB =====
function OwnersPartnersTab({ syncToAPI }: { syncToAPI: (type:string, data:any)=>void }) {
  const [owners, setOwners] = useState<any[]>([
    { id:"o1", name:"Thirafi Thariq Al Idris", role:"Founder & CEO", badge:"", tag:"Owner" }
  ]);
  const [partners, setPartners] = useState<any[]>([]);
  const [waLinks, setWaLinks] = useState({ grup:"https://wa.me/6282218723401", channel:"https://wa.me/6282218723401" });
  const [ownerForm, setOwnerForm] = useState({ name:"", role:"", badge:"", tag:"Owner", verified:true });
  const [partnerForm, setPartnerForm] = useState({ name:"", role:"", badge:"", verified:false });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/sync").then(r=>r.json()).then((d:any)=>{
      if (d.owners?.length) setOwners(d.owners);
      if (d.partners?.length) setPartners(d.partners);
      if (d.wa_links) setWaLinks(d.wa_links);
    }).catch(()=>{});
  },[]);

  const saveOwners = (updated: any[]) => {
    setOwners(updated);
    syncToAPI("owners", updated);
    setMsg(" Owner disimpan!"); setTimeout(()=>setMsg(""),2500);
  };
  const savePartners = (updated: any[]) => {
    setPartners(updated);
    syncToAPI("partners", updated);
    setMsg(" Partner disimpan!"); setTimeout(()=>setMsg(""),2500);
  };
  const saveWaLinks = () => {
    syncToAPI("wa_links", waLinks);
    setMsg(" Link WA disimpan!"); setTimeout(()=>setMsg(""),2500);
  };

  const addOwner = () => {
    if (!ownerForm.name.trim()) return;
    saveOwners([...owners, {...ownerForm, id:"o_"+Date.now()}]);
    setOwnerForm({name:"",role:"",badge:"",tag:"Owner"});
  };
  const addPartner = () => {
    if (!partnerForm.name.trim()) return;
    savePartners([...partners, {...partnerForm, id:"p_"+Date.now()}]);
    setPartnerForm({name:"",role:"",badge:""});
  };

  return (
    <div>
      <h2 className="text-white font-bold text-sm mb-1">Owner & Partner</h2>
      <p className="text-slate-500 text-xs mb-4">Tampil di halaman Profil VIP member</p>
      {msg && <div className="mb-3 text-xs p-2 rounded-lg bg-green-500/10 text-green-400">{msg}</div>}
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-xs mb-3">Link WA (Homepage & VIP)</h3>
        <div className="space-y-2 mb-3">
          <div><label className="text-slate-400 text-xs mb-1 block">Grup WA</label><input value={waLinks.grup} onChange={e=>setWaLinks({...waLinks,grup:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" placeholder="https://chat.whatsapp.com/..."/></div>
          <div><label className="text-slate-400 text-xs mb-1 block">Channel WA</label><input value={waLinks.channel} onChange={e=>setWaLinks({...waLinks,channel:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" placeholder="https://whatsapp.com/channel/..."/></div>
        </div>
        <button onClick={saveWaLinks} className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">Simpan Link WA</button>
      </div>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold text-xs mb-3">Owner / Founder</h3>
        <div className="space-y-2 mb-3">
          {owners.map(o=>(
            <div key={o.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <span className="text-xl">{o.badge}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-sm">{o.name}</p>
                  {o.verified && <span title="Verified" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:"#1D9BF0",flexShrink:0}}><svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                </div>
                <p className="text-slate-400 text-xs">{o.role} · {o.tag}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>saveOwners(owners.map(x=>x.id===o.id?{...x,verified:!x.verified}:x))} className="text-xs px-2 py-1 rounded-lg border border-white/10 text-emerald-400">{o.verified?"":"○"}</button>
                <button onClick={()=>saveOwners(owners.filter(x=>x.id!==o.id))} className="text-red-400 text-xs px-2 py-1">Hapus</button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={ownerForm.name} onChange={e=>setOwnerForm({...ownerForm,name:e.target.value})} placeholder="Nama" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={ownerForm.role} onChange={e=>setOwnerForm({...ownerForm,role:e.target.value})} placeholder="Jabatan" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <input value={ownerForm.badge} onChange={e=>setOwnerForm({...ownerForm,badge:e.target.value})} placeholder="Emoji" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none"/>
          <button onClick={addOwner} className="col-span-2 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">+ Tambah Owner</button>
        </div>
      </div>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4">
        <h3 className="text-white font-bold text-xs mb-3">Partner</h3>
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
  const [authorName, setAuthorName] = useState("Admin RITEL COMMUNITY.ID");
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
      const res = await fetch("/api/admin/feed", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"create", content:content_text, tag, pinned, show_home:showHome, show_vip:showVip, author:authorName }) });
      const data = await res.json();
      if (data.success) { setMsg(" Feed diposting!"); setContentText(""); await loadFeed(); }
      else setMsg(" " + data.message);
    } catch { setMsg(" Error."); }
    setPosting(false); setTimeout(()=>setMsg(""),3000);
  };

  const tagColors: Record<string,string> = { info:"#3b82f6", sinyal:"#22c55e", berita:"#f59e0b", analisis:"#8b5cf6", penting:"#ef4444" };

  return (
    <div>
      <h2 className="text-white font-bold text-sm mb-1">Admin Feed</h2>
      <p className="text-slate-500 text-xs mb-4">Post sebagai "Admin RITEL COMMUNITY.ID" — tampil di homepage & VIP</p>
      <div className="bg-[#0a1628] border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#6ee7b7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>RC</div>
          <div className="flex-1">
            <select value={authorName} onChange={e=>setAuthorName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none font-bold mb-0.5">
              <option value="Admin RITEL COMMUNITY.ID">Admin RITEL COMMUNITY.ID</option>
              <option value="elthoriqqqq_">elthoriqqqq_</option>
            </select>
            <div className="flex items-center gap-1.5"><span title="Verified" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:13,height:13,borderRadius:"50%",background:"#1D9BF0"}}><svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="text-slate-500 text-xs">Verified Admin</span></div>
          </div>
        </div>
        <textarea value={content_text} onChange={e=>setContentText(e.target.value)} rows={4} maxLength={2000} placeholder="Tulis pengumuman, analisis, sinyal..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm resize-none outline-none focus:border-emerald-500/50 mb-3"/>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className="text-slate-400 text-xs mb-1 block">Tag</label>
            <select value={tag} onChange={e=>setTag(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none">
              {["info","sinyal","analisis","berita","penting"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="text-slate-400 text-xs mb-1 block">Opsi</label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pinned} onChange={e=>setPinned(e.target.checked)}/><span className="text-white text-xs">Pin</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showHome} onChange={e=>setShowHome(e.target.checked)}/><span className="text-white text-xs">Homepage</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showVip} onChange={e=>setShowVip(e.target.checked)}/><span className="text-white text-xs">VIP</span></label>
            </div>
          </div>
        </div>
        {msg && <div className={`mb-3 text-xs p-2 rounded-lg ${msg.startsWith("")?"text-green-400 bg-green-500/10":"text-red-400 bg-red-500/10"}`}>{msg}</div>}
        <button onClick={handlePost} disabled={!content_text.trim()||posting} className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl disabled:opacity-40">
          {posting?"Memposting...":" Post Sekarang"}
        </button>
      </div>
      {loading ? <div className="text-center py-8 text-slate-500 text-sm">Memuat...</div> : posts.length===0 ? <div className="text-center py-8 text-slate-600 text-sm">Belum ada feed.</div> : (
        <div className="space-y-3">
          {posts.map(p=>(
            <div key={p.id} style={{background:p.pinned?"rgba(30,90,240,0.07)":"rgba(255,255,255,0.02)",border:p.pinned?"1px solid rgba(30,90,240,0.25)":"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 16px"}}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {p.tag&&<span style={{fontSize:10,background:`${tagColors[p.tag]||"#6b7280"}22`,color:tagColors[p.tag]||"#9ca3af",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{p.tag}</span>}
                  {p.pinned&&<span className="text-[10px] text-yellow-400"></span>}
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
    const settingsKey = isBagger ? "bagger_signals" : "bandar_signals";
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      setItems(d[settingsKey] || []);
    }).catch(()=>{});
  },[type]);

  const save = async () => {
    if (!form.kode.trim()) { alert("Kode saham wajib diisi"); return; }
    const settingsKey = isBagger ? "bagger_signals" : "bandar_signals";
    const item = { ...form, id: editId||Date.now().toString(), isBagger, isBandar:!isBagger, type, created_at: editId ? undefined : new Date().toISOString() };
    let updated: any[];
    if (editId) {
      updated = items.map((s:any)=>s.id===editId ? {...s,...item} : s);
    } else {
      updated = [...items, item];
    }
    await fetch("/api/admin/sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({type:settingsKey, data:updated}) });
    setItems(updated);
    setMsg(` ${isBagger?"Bagger":"Bandar"} ${editId?"diperbarui":"ditambahkan"}!`);
    setTimeout(()=>setMsg(""),2500);
    setForm(emptyForm); setEditId(null); setShowForm(false);
  };

  const del = async (id:string) => {
    if (!confirm("Hapus sinyal ini?")) return;
    const settingsKey = isBagger ? "bagger_signals" : "bandar_signals";
    const updated = items.filter((x:any)=>x.id!==id);
    await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:settingsKey,data:updated})});
    setItems(updated);
    setMsg(" Dihapus!"); setTimeout(()=>setMsg(""),2000);
  };

  const edit = (item:any) => {
    setForm({kode:item.kode||"",saham:item.saham||"",entry:item.entry||"",tp:item.tp||"",sl:item.sl||"",notes:item.notes||"",action:item.action||emptyForm.action});
    setEditId(item.id); setShowForm(true);
  };

  const acColor = isBagger ? { bg:"rgba(245,158,11,0.1)", text:"#f59e0b", border:"rgba(245,158,11,0.3)" } : { bg:"rgba(139,92,246,0.1)", text:"#8b5cf6", border:"rgba(139,92,246,0.3)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-bold text-sm">{isBagger?" Bagger Picks":" Sinyal Bandar"}</h2>
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
          <p className="text-3xl mb-3">{isBagger?"":""}</p>
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
                  <button onClick={()=>edit(item)} className="text-xs px-2 py-1 rounded-lg text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">Edit</button>
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
  const [vipUsers, setVipUsers] = useLocalStore<any[]>("vip_users_admin", []);
  const [userFilter, setUserFilter] = useState("");
  const [testimonials, setTestimonials] = useLocalStore<any[]>("testimonials", []);
  const [liveMsg, setLiveMsgState] = useLocalStore<string>("liveinfo_msg", "");
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [maintenanceSaved, setMaintenanceSaved] = useState(false);
  const [liveActive, setLiveActiveState] = useLocalStore<boolean>("liveinfo_active", false);
  const [customStocks, setCustomStocks] = useLocalStore<any[]>("custom_stocks", []);
  const [stockMode, setStockMode] = useLocalStore<"live"|"custom">("stock_mode", "live");

  // PRICING DATA
  const defaultPricing = [
    { id:"basic", name:"Basic", price:100000, priceLabel:"Rp 100.000", period:"/bulan", color:"blue", description:"Cocok untuk pemula yang ingin mulai berinvestasi saham dengan panduan dasar dan sinyal harian.", features:["Sinyal saham harian","Berita pasar realtime","Chart IHSG live","Modul dasar investasi","Grup WA Basic"], flashSale:null },
    { id:"silver", name:"Silver", price:250000, priceLabel:"Rp 250.000", period:"/bulan", color:"emerald", description:"Untuk investor yang ingin memahami fundamental dan mulai screening saham potensial.", features:["Semua fitur Basic","Analisis fundamental saham","Screening saham bagger","Risk & money management","Grup WA Silver"], flashSale:null },
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
  const [tickerSpeed, setTickerSpeed] = useState<number>(32);

  // PREMIUM SIGNALS (halaman sinyal premium)
  const defaultPremiumSignals = [
    { id:"ps1", title:"Bandarmologi Report", content:"Analisis bandarmologi mingguan. Deteksi akumulasi & distribusi big player.", isActive:true },
    { id:"ps2", title:"Tape Reading Live", content:"Laporan tape reading intraday. Baca pergerakan smart money secara real-time.", isActive:true },
    { id:"ps3", title:"Bagger Pick Bulanan", content:"1-3 saham bagger pilihan analis setiap bulan. Potensi naik 2x-10x.", isActive:true },
  ];
  const [premiumSignals, setPremiumSignals] = useLocalStore<any[]>("premium_signals", defaultPremiumSignals);

  // Form states
  const [sigForm, setSigForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", tp2:"", tp3:"", sl:"", notes:"", package:["gold","pro","platinum","elite"], is_tomorrow:false, is_pinned:false });
  const [bsjpSignals, setBsjpSignals] = useState<any[]>([]);
  const [bpjsSignals, setBpjsSignals] = useState<any[]>([]);
  const [leaderboardWeekly, setLeaderboardWeekly] = useState<any[]>([]);
  const [leaderboardMonthly, setLeaderboardMonthly] = useState<any[]>([]);
  const [leaderboardTabPeriod, setLeaderboardTabPeriod] = useState<"weekly"|"monthly">("weekly");
  const [leaderboardForm, setLeaderboardForm] = useState<any>({ name:"", badge:"", stat:"", note:"" });
  const [editLeaderboardId, setEditLeaderboardId] = useState<string|null>(null);
  const [showLeaderboardForm, setShowLeaderboardForm] = useState(false);
  const [bsjpMinPkg, setBsjpMinPkg] = useState<string>("silver");
  const [bpjsMinPkg, setBpjsMinPkg] = useState<string>("silver");
  const [rekapList, setRekapList] = useState<any[]>([]);
  const [jurnalList, setJurnalList] = useState<any[]>([]);
  const [bsjpForm, setBsjpForm] = useState<any>({ kode:"", saham:"", action:"BUY", entry:"", tp:"", sl:"", description:"", notes:"", date:new Date().toISOString().slice(0,10) });
  const [bpjsForm, setBpjsForm] = useState<any>({ kode:"", saham:"", action:"BUY", entry:"", tp:"", sl:"", description:"", notes:"", date:new Date().toISOString().slice(0,10) });
  const [rekapForm, setRekapForm] = useState<any>({ kode:"", saham:"", result:"TP", entry:"", tp:"", sl:"", close_price:"", gain:"", date:new Date().toISOString().slice(0,10), notes:"" });
  const [jurnalFormAdmin, setJurnalFormAdmin] = useState<any>({ kode:"", saham:"", action:"BUY", entry:"", exit:"", result:"TP", gain:"", tanggal:new Date().toISOString().slice(0,10), alasan:"", evaluasi:"" });
  const [showBsjpForm, setShowBsjpForm] = useState(false);
  const [showBpjsForm, setShowBpjsForm] = useState(false);
  const [showRekapForm, setShowRekapForm] = useState(false);
  const [showJurnalFormAdmin, setShowJurnalFormAdmin] = useState(false);
  const [editSigId, setEditSigId] = useState<string|null>(null);
  const [showSigForm, setShowSigForm] = useState(false);
  const [baggerList, setBaggerList] = useState<any[]>([]);
  const [bandarList, setBandarList] = useState<any[]>([]);
  const [baggerForm, setBaggerForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
  const [bandarForm, setBandarForm] = useState<any>({ saham:"", kode:"", action:"BUY", entry:"", tp:"", sl:"", notes:"", package:["gold","pro","platinum","elite"] });
  const [editBaggerId, setEditBaggerId] = useState<string|null>(null);
  const [editBandarId, setEditBandarId] = useState<string|null>(null);
  const [showBaggerForm, setShowBaggerForm] = useState(false);
  const [showBandarForm, setShowBandarForm] = useState(false);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [doneSignalIds, setDoneSignalIds] = useState<string[]>([]);


  const [stockForm, setStockForm] = useState<any>({ kode:"", name:"", price:"", changePercent:"" });
  const [editStockId, setEditStockId] = useState<string|null>(null);
  const [showStockForm, setShowStockForm] = useState(false);

  const [testiForm, setTestiForm] = useState<any>({ name:"", package:"gold", rating:5, text:"", date:"", isApproved:true });
  const [editTestiId, setEditTestiId] = useState<string|null>(null);
  const [showTestiForm, setShowTestiForm] = useState(false);

  const [pricingForm, setPricingForm] = useState<any>({ id:"", name:"", price:0, priceLabel:"", period:"/bulan", description:"", features:"", flashSale:{ discount:"", price:"", rawPrice:0, endTime:"" }, hasFlashSale:false, discountPct:"", flashDuration:"" });
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
  const [motivasiForm, setMotivasiForm] = useState<any>({ text:"", jam:"", durasi_menit:5 });
  const [motivasiSpeed, setMotivasiSpeed] = useState<number>(32);
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

        // VIP users (email OTP accounts)
        const usersRes = await fetch("/api/admin/users").then(r => r.json()).catch(() => ({}));
        if (usersRes.users) setVipUsers(usersRes.users);

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

        // Ticker, pricing, premiumSignals + extra data
        const syncRes = await fetch("/api/admin/sync").then(r => r.json()).catch(() => ({}));
        if (syncRes.ticker && syncRes.ticker.length > 0) setTickerStocks(syncRes.ticker);
        if (syncRes.pricing && syncRes.pricing.length > 0) setPricing(syncRes.pricing);
        if (syncRes.premiumSignals && syncRes.premiumSignals.length > 0) setPremiumSignals(syncRes.premiumSignals);
        // Load extra states yang sebelumnya tidak di-load
        if (syncRes.done_signal_ids) setDoneSignalIds(syncRes.done_signal_ids || []);
        if (syncRes.ticker_speed) { setTickerSpeed(syncRes.ticker_speed); setMotivasiSpeed(syncRes.ticker_speed); }
        if (syncRes.maintenance_mode !== undefined) setMaintenanceMode(!!syncRes.maintenance_mode);
        if (syncRes.bsjp_signals) setBsjpSignals(syncRes.bsjp_signals || []);
        if (syncRes.bpjs_signals) setBpjsSignals(syncRes.bpjs_signals || []);
        if (syncRes.bsjp_min_pkg) setBsjpMinPkg(syncRes.bsjp_min_pkg);
        if (syncRes.bpjs_min_pkg) setBpjsMinPkg(syncRes.bpjs_min_pkg);
        if (syncRes.rekap_sinyal) setRekapList(syncRes.rekap_sinyal || []);
        if (syncRes.jurnal_global) setJurnalList(syncRes.jurnal_global || []);
        else if (syncRes.jurnal_trade) setJurnalList(syncRes.jurnal_trade || []);
        if (syncRes.motivasi && syncRes.motivasi.length > 0) setMotivasiList(syncRes.motivasi);
        if (syncRes.owners && syncRes.owners.length > 0) setOwners(syncRes.owners);
        if (syncRes.partners) setPartners(syncRes.partners || []);
        if (syncRes.bagger_signals) setBaggerList(syncRes.bagger_signals || []);
        if (syncRes.bandar_signals) setBandarList(syncRes.bandar_signals || []);
        if (syncRes.leaderboard_weekly) setLeaderboardWeekly(syncRes.leaderboard_weekly || []);
        if (syncRes.leaderboard_monthly) setLeaderboardMonthly(syncRes.leaderboard_monthly || []);
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
  const actionColor: any = { BUY:"text-green-400", SELL:"text-red-400", HOLD:"text-yellow-400", ANTRI:"text-emerald-400" };

  // ===== SIGNALS =====
  const saveSig = async () => {
    if (!sigForm.kode.trim() || !sigForm.saham.trim()) { alert("Isi kode dan nama saham!"); return; }
    const sigPayload = {
      saham: sigForm.saham||"", kode: sigForm.kode||"",
      action: sigForm.action||"BUY", entry: sigForm.entry||"",
      tp: sigForm.tp||"", sl: sigForm.sl||"",
      tp2: sigForm.tp2||"", tp3: sigForm.tp3||"",
      notes: sigForm.notes||"", package: sigForm.package||["gold","pro","platinum","elite"],
      is_tomorrow: sigForm.is_tomorrow||false, is_pinned: sigForm.is_pinned||false,
    };
    if (editSigId) {
      const res = await fetch("/api/admin/signals", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...sigPayload, id:editSigId})}).then(r=>r.json()).catch(()=>({}));
      if (res && res.success === false) { alert("Gagal update: " + (res.error||"unknown")); return; }
    } else {
      const newId = Date.now().toString();
      const res = await fetch("/api/admin/signals", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...sigPayload, id:newId})}).then(r=>r.json()).catch(()=>({}));
      if (res && res.success === false) { alert("Gagal simpan: " + (res.error||"unknown")); return; }
    }
    // Re-fetch dari DB supaya VIP juga dapat data terbaru
    const refreshed = await fetch("/api/admin/signals").then(r=>r.json()).catch(()=>({}));
    if (refreshed.signals) setSignals(refreshed.signals.map((s:any)=>({...s,saham:s.saham||"",kode:s.kode||"",action:s.action||"BUY",entry:s.entry||"",tp:s.tp||"",sl:s.sl||"",notes:s.notes||"",package:s.package||["gold"]})));
    setSigForm({ saham:"", kode:"", action:"BUY", entry:"", tp:"", tp2:"", tp3:"", sl:"", notes:"", package:["gold","pro","platinum","elite"], is_tomorrow:false, is_pinned:false });
    setEditSigId(null); setShowSigForm(false);
  };
  const editSig = (s: any) => { setSigForm({...s}); setEditSigId(s.id); setShowSigForm(true); window.scrollTo(0,0); };
  const delSig = async (id: string) => {
    if (!confirm("Hapus sinyal?")) return;
    await fetch(`/api/admin/signals?id=${id}`, {method:"DELETE"}).catch(()=>{});
    setSignals(signals.filter(s=>s.id!==id));
  };

  // ===== TOKENS =====
  const toggleUserRole = async (u: any) => {
    const newRole = u.role === "vip" ? "free" : "vip";
    const newSub = newRole === "vip" ? "gold" : "basic";
    await fetch("/api/admin/users", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email, role:newRole, subscription:newSub})}).catch(()=>{});
    setVipUsers(vipUsers.map(x=>x.email===u.email?{...x,role:newRole,subscription:newSub}:x));
  };
  const setUserSubscription = async (u: any, pkg: string) => {
    await fetch("/api/admin/users", {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u.email, subscription:pkg})}).catch(()=>{});
    setVipUsers(vipUsers.map(x=>x.email===u.email?{...x,subscription:pkg}:x));
  };
  const delVipUser = async (email: string) => {
    if (!confirm("Hapus user ini?")) return;
    await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {method:"DELETE"}).catch(()=>{});
    setVipUsers(vipUsers.filter(x=>x.email!==email));
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
      id: p.id, name: p.name, price: p.price || 0, priceLabel: p.priceLabel, period: p.period,
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
    const priceNum = parseInt(String(pricingForm.price).replace(/\D/g,""), 10);
    if (!priceNum || priceNum <= 0) { alert("Isi harga dengan angka yang valid!"); return; }
    const priceLabel = "Rp " + priceNum.toLocaleString("id-ID");
    const features = pricingForm.features.split("\n").map((f:string)=>f.trim()).filter(Boolean);
    const flashSale = pricingForm.hasFlashSale && pricingForm.flashSale.price ? pricingForm.flashSale : null;
    const updated = pricing.map(p => p.id === editPricingId ? { ...p, price: priceNum, priceLabel, period: pricingForm.period, description: pricingForm.description, features, flashSale } : p);
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

  // ===== LEADERBOARD =====
  const currentLeaderboardList = leaderboardTabPeriod === "weekly" ? leaderboardWeekly : leaderboardMonthly;
  const setCurrentLeaderboardList = leaderboardTabPeriod === "weekly" ? setLeaderboardWeekly : setLeaderboardMonthly;
  const leaderboardSyncKey = leaderboardTabPeriod === "weekly" ? "leaderboard_weekly" : "leaderboard_monthly";
  const saveLeaderboard = async () => {
    if (!leaderboardForm.name.trim()) { alert("Isi nama member!"); return; }
    let updated;
    if (editLeaderboardId) {
      updated = currentLeaderboardList.map((r:any)=> r.id===editLeaderboardId ? { ...leaderboardForm, id:editLeaderboardId } : r);
    } else {
      updated = [...currentLeaderboardList, { ...leaderboardForm, id: Date.now().toString() }];
    }
    setCurrentLeaderboardList(updated);
    await syncToAPI(leaderboardSyncKey, updated);
    setShowLeaderboardForm(false); setEditLeaderboardId(null);
    setLeaderboardForm({ name:"", badge:"", stat:"", note:"" });
  };
  const editLeaderboard = (row: any) => { setLeaderboardForm(row); setEditLeaderboardId(row.id); setShowLeaderboardForm(true); };
  const delLeaderboard = (id: string) => {
    if (!confirm("Hapus dari leaderboard?")) return;
    const updated = currentLeaderboardList.filter((r:any)=>r.id!==id);
    setCurrentLeaderboardList(updated);
    syncToAPI(leaderboardSyncKey, updated);
  };
  const moveLeaderboard = (idx: number, dir: -1|1) => {
    const arr = [...currentLeaderboardList];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    setCurrentLeaderboardList(arr);
    syncToAPI(leaderboardSyncKey, arr);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id:"signals", label:"Sinyal" },
    { id:"bagger", label:"Bagger" },
    { id:"bsjp", label:"BSJP (Beli Sore Jual Pagi)" },
    { id:"bpjs", label:"BPJS (Beli Pagi Jual Sore)" },
    { id:"rekap", label:"Rekap TP/SL" },
    { id:"jurnal", label:"Jurnal" },
    { id:"sinyal_besok", label:"Besok" },
    { id:"bandar", label:"Bandar" },
    { id:"admin_feed", label:"Post Feed" },
    { id:"tokens", label:"User VIP" },
    { id:"topstocks", label:"Top Saham" },
    { id:"liveinfo", label:"Live Info" },
    { id:"testimonials", label:"Testimoni" },
    { id:"pricing", label:"Harga/Paket" },
    { id:"motivasi", label:"Motivasi" },
    { id:"ticker", label:"Ticker" },
    { id:"mutasi", label:"Mutasi" },
    { id:"orders", label:"Orders" },
    { id:"loginlogs", label:"Login Log" },
    { id:"owners_partners", label:"Owner" },
    { id:"leaderboard", label:"Leaderboard" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="galaxy-stars" />
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            <p className="text-emerald-400 text-sm font-bold">Memuat data...</p>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-black/85 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-[#FFFFFF] text-xs flex-shrink-0">RC</div>
              <div className="min-w-0">
                <p className="font-black text-white text-sm leading-tight truncate">Admin Panel</p>
                <p className="text-[11px] text-slate-500 leading-tight truncate">{tabs.find(t => t.id === tab)?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/" className="text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-all">Lihat Web</Link>
              <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all">Keluar</button>
              <MoreMenu
                items={tabs.map(t => ({
                  id: t.id,
                  label: t.label,
                  active: tab === t.id,
                  onSelect: () => setTab(t.id),
                }))}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* ======== SIGNALS ======== */}
          {tab==="signals" && (
            <div>
              {/* SINYAL BESOK */}
              {signals.filter((s:any)=>s.is_tomorrow).length>0 && (
                <div className="mb-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400 font-black text-sm">Sinyal Besok</span>
                    <span className="text-xs text-yellow-400/60">{signals.filter((s:any)=>s.is_tomorrow).length} sinyal</span>
                  </div>
                  <div className="space-y-2">
                    {signals.filter((s:any)=>s.is_tomorrow).map((s:any)=>(
                      <div key={s.id} className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
                        <span className="font-black text-white text-sm">{s.kode}</span>
                        <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">{s.action}</span>
                        <span className="text-xs text-slate-400 flex-1">Entry: {s.entry} · TP: {s.tp}</span>
                        <button onClick={async()=>{ const updated=signals.map((x:any)=>x.id===s.id?{...x,is_tomorrow:false}:x); setSignals(updated); await syncToAPI("signals_bulk",updated); }} className="text-xs text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded">Hapus</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen Sinyal Harian</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{signals.filter((s:any)=>!s.is_tomorrow).length} sinyal aktif</p>
                </div>
                <button onClick={()=>{setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditSigId(null);setShowSigForm(!showSigForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showSigForm&&!editSigId?"Tutup":"Tambah Sinyal"}
                </button>
              </div>
              {showSigForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editSigId?"Edit Sinyal":"Tambah Sinyal Baru"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={sigForm.kode} onChange={e=>setSigForm({...sigForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={sigForm.saham} onChange={e=>setSigForm({...sigForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={sigForm.action} onChange={e=>setSigForm({...sigForm,action:e.target.value})} className="input-dark">
                        {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={sigForm.entry} onChange={e=>setSigForm({...sigForm,entry:e.target.value})} placeholder="9.750–9.800" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="9.100" className="input-dark"/></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-xs text-slate-500 mb-1 block">TP1</label><input value={sigForm.tp} onChange={e=>setSigForm({...sigForm,tp:e.target.value})} placeholder="10.200" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">TP2</label><input value={sigForm.tp2||""} onChange={e=>setSigForm({...sigForm,tp2:e.target.value})} placeholder="10.500" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">TP3</label><input value={sigForm.tp3||""} onChange={e=>setSigForm({...sigForm,tp3:e.target.value})} placeholder="11.000" className="input-dark"/></div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={()=>setSigForm({...sigForm,is_tomorrow:!sigForm.is_tomorrow})} className={`flex-1 text-xs py-2 rounded-xl border font-bold transition-all ${sigForm.is_tomorrow?"bg-yellow-500/15 border-yellow-500/40 text-yellow-400":"border-white/10 text-slate-500"}`}>{sigForm.is_tomorrow?" Sinyal Besok":" Set Besok"}</button>
                      <button onClick={()=>setSigForm({...sigForm,is_pinned:!sigForm.is_pinned})} className={`flex-1 text-xs py-2 rounded-xl border font-bold transition-all ${sigForm.is_pinned?"bg-emerald-500/15 border-emerald-500/40 text-emerald-400":"border-white/10 text-slate-500"}`}>{sigForm.is_pinned?" Disematkan":" Sematkan"}</button>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={sigForm.sl} onChange={e=>setSigForm({...sigForm,sl:e.target.value})} placeholder="9.500" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Catatan/Analisis</label><textarea value={sigForm.notes} onChange={e=>setSigForm({...sigForm,notes:e.target.value})} placeholder="Breakout resistance, volume tinggi..." rows={2} className="input-dark resize-none"/></div>
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-2 block">Akses Paket</label>
                    <div className="flex flex-wrap gap-3">
                      {pkgOpts.map(p=>(
                        <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={(sigForm.package||[]).includes(p)} onChange={e=>{const cur=sigForm.package||[];setSigForm({...sigForm,package:e.target.checked?[...cur,p]:cur.filter((x:string)=>x!==p)});}} className="accent-emerald-500 w-4 h-4"/>
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
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-white text-base">{s.kode}</span>
                          {doneSignalIds.includes(s.id) && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-bold">Target</span>}
                          {s.is_tomorrow && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold">Besok</span>}
                          {s.is_pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold"></span>}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">{s.saham}</div>
                      </div>
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
                      <Btn onClick={async()=>{ 
                        const isDoneNow = doneSignalIds.includes(s.id);
                        const newIds = isDoneNow ? doneSignalIds.filter((x:string)=>x!==s.id) : [...doneSignalIds, s.id];
                        setDoneSignalIds(newIds);
                        await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"done_signal_ids",data:newIds})}).catch(()=>{});
                        setSignals(signals.map(x=>x.id===s.id?{...x,is_done:!isDoneNow}:x));
                      }} color={doneSignalIds.includes(s.id)?"yellow":"green"} className="flex-1 text-center">{doneSignalIds.includes(s.id)?" Batalkan":" Target Tercapai"}</Btn>
                      <Btn onClick={()=>editSig(s)} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={()=>delSig(s.id)} color="red" className="flex-1 text-center">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== BAGGER ======== */}
          {tab==="bagger" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Bagger Picks</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Saham berpotensi naik 2x-10x jangka panjang</p>
                </div>
                <button onClick={()=>{setBaggerForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditBaggerId(null);setShowBaggerForm(!showBaggerForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">{showBaggerForm&&!editBaggerId?"Tutup":"Tambah Bagger"}</button>
              </div>
              {showBaggerForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-yellow-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editBaggerId?"Edit Bagger Pick":"Tambah Bagger Pick Baru"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={baggerForm.kode} onChange={e=>setBaggerForm({...baggerForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={baggerForm.saham} onChange={e=>setBaggerForm({...baggerForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Target (TP)</label><input value={baggerForm.tp} onChange={e=>setBaggerForm({...baggerForm,tp:e.target.value})} placeholder="2x - 5x dari entry" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry / Akumulasi</label><input value={baggerForm.entry} onChange={e=>setBaggerForm({...baggerForm,entry:e.target.value})} placeholder="1.200-1.350" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={baggerForm.sl} onChange={e=>setBaggerForm({...baggerForm,sl:e.target.value})} placeholder="1.100" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={baggerForm.action} onChange={e=>setBaggerForm({...baggerForm,action:e.target.value})} className="input-dark">
                        {["BUY","ANTRI","HOLD","ACCUMULATE"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Analisa &amp; Katalis</label><textarea value={baggerForm.notes} onChange={e=>setBaggerForm({...baggerForm,notes:e.target.value})} placeholder="Kenapa saham ini berpotensi jadi bagger? Katalis apa yang mendorong?" rows={3} className="input-dark resize-none"/></div>
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 mb-2 block">Akses Paket</label>
                    <div className="flex flex-wrap gap-2">{["basic","silver","gold","pro","platinum","elite"].map(p=>(
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={baggerForm.package.includes(p)} onChange={e=>setBaggerForm({...baggerForm,package:e.target.checked?[...baggerForm.package,p]:baggerForm.package.filter((x:string)=>x!==p)})} className="accent-yellow-400"/>
                        <span className="text-xs text-slate-300 capitalize">{p}</span>
                      </label>
                    ))}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async()=>{
                      const payload = {...baggerForm, id:editBaggerId||Date.now().toString(), created_at: editBaggerId ? (baggerList.find((x:any)=>x.id===editBaggerId)?.created_at||new Date().toISOString()) : new Date().toISOString()};
                      const newList = editBaggerId ? baggerList.map((x:any)=>x.id===editBaggerId?payload:x) : [{...payload},...baggerList];
                      setBaggerList(newList);
                      await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bagger_signals",data:newList})}).catch(()=>{});
                      setBaggerForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});
                      setEditBaggerId(null); setShowBaggerForm(false);
                    }} className="btn-primary text-sm flex-1">{editBaggerId?"Update":"Simpan Bagger"}</button>
                    <button onClick={()=>{setShowBaggerForm(false);setEditBaggerId(null);}} className="text-sm flex-1 py-2 rounded-xl bg-white/5 text-slate-400">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3">
                {baggerList.length===0 ? (
                  <div className="card rounded-xl p-8 text-center text-slate-500 text-sm">Belum ada Bagger Pick. Klik "Tambah Bagger" untuk membuat.</div>
                ) : baggerList.map(s=>(
                  <div key={s.id} className="card rounded-xl p-4 border-l-4 border-yellow-500/60">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2"><span className="font-black text-white text-base">{s.kode}</span><span className="text-xs px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold">BAGGER</span>{s.is_done&&<span className="text-xs px-2 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 font-bold">Target</span>}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{s.saham}</div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{s.action}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">Entry</div><div className="text-white font-bold">{s.entry||"-"}</div></div>
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">Target</div><div className="text-yellow-400 font-bold">{s.tp||"-"}</div></div>
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">SL</div><div className="text-red-400 font-bold">{s.sl||"-"}</div></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{s.notes}</p>}
                    <div className="flex gap-2 flex-wrap">
                      <Btn onClick={async()=>{ const done=!s.is_done; const newList=baggerList.map((x:any)=>x.id===s.id?{...x,is_done:done,done_at:done?new Date().toISOString():null}:x); setBaggerList(newList); await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bagger_signals",data:newList})}).catch(()=>{}); }} color={s.is_done?"yellow":"green"} className="flex-1 text-center">{s.is_done?" Batalkan":" Target Tercapai"}</Btn>
                      <Btn onClick={()=>{setBaggerForm({...s});setEditBaggerId(s.id);setShowBaggerForm(true);window.scrollTo(0,0);}} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={async()=>{ if(!confirm("Hapus bagger pick ini?"))return; const newList=baggerList.filter((x:any)=>x.id!==s.id); setBaggerList(newList); await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bagger_signals",data:newList})}).catch(()=>{}); }} color="red" className="flex-1 text-center">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== BANDAR ======== */}
          {tab==="bandar" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Bandarmologi Signals</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Deteksi pola akumulasi & distribusi smart money</p>
                </div>
                <button onClick={()=>{setBandarForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});setEditBandarId(null);setShowBandarForm(!showBandarForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">{showBandarForm&&!editBandarId?"Tutup":"Tambah Sinyal Bandar"}</button>
              </div>
              {showBandarForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-purple-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">{editBandarId?"Edit Sinyal Bandar":"Tambah Sinyal Bandar Baru"}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={bandarForm.kode} onChange={e=>setBandarForm({...bandarForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={bandarForm.saham} onChange={e=>setBandarForm({...bandarForm,saham:e.target.value})} placeholder="Nama emiten" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Pola Bandar</label>
                      <select value={bandarForm.action} onChange={e=>setBandarForm({...bandarForm,action:e.target.value})} className="input-dark">
                        {["AKUMULASI","DISTRIBUSI","BREAKOUT","MARKUP","MARKDOWN","BUY","SELL"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Zona Entry</label><input value={bandarForm.entry} onChange={e=>setBandarForm({...bandarForm,entry:e.target.value})} placeholder="Range harga akumulasi" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Target Harga</label><input value={bandarForm.tp} onChange={e=>setBandarForm({...bandarForm,tp:e.target.value})} placeholder="Target distribusi bandar" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={bandarForm.sl} onChange={e=>setBandarForm({...bandarForm,sl:e.target.value})} placeholder="Invalidation level" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Analisa Bandarmologi</label><textarea value={bandarForm.notes} onChange={e=>setBandarForm({...bandarForm,notes:e.target.value})} placeholder="Pola tape reading, volume anomali, dugaan aksi bandar..." rows={3} className="input-dark resize-none"/></div>
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 mb-2 block">Akses Paket</label>
                    <div className="flex flex-wrap gap-2">{["basic","silver","gold","pro","platinum","elite"].map(p=>(
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={bandarForm.package.includes(p)} onChange={e=>setBandarForm({...bandarForm,package:e.target.checked?[...bandarForm.package,p]:bandarForm.package.filter((x:string)=>x!==p)})} className="accent-purple-400"/>
                        <span className="text-xs text-slate-300 capitalize">{p}</span>
                      </label>
                    ))}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async()=>{
                      const payload = {...bandarForm, id:editBandarId||Date.now().toString(), created_at: editBandarId ? (bandarList.find((x:any)=>x.id===editBandarId)?.created_at||new Date().toISOString()) : new Date().toISOString()};
                      const newList = editBandarId ? bandarList.map((x:any)=>x.id===editBandarId?payload:x) : [{...payload},...bandarList];
                      setBandarList(newList);
                      await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bandar_signals",data:newList})}).catch(()=>{});
                      setBandarForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",sl:"",notes:"",package:["gold","pro","platinum","elite"]});
                      setEditBandarId(null); setShowBandarForm(false);
                    }} className="btn-primary text-sm flex-1">{editBandarId?"Update":"Simpan Sinyal Bandar"}</button>
                    <button onClick={()=>{setShowBandarForm(false);setEditBandarId(null);}} className="text-sm flex-1 py-2 rounded-xl bg-white/5 text-slate-400">Batal</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3">
                {bandarList.length===0 ? (
                  <div className="card rounded-xl p-8 text-center text-slate-500 text-sm">Belum ada sinyal bandar. Klik "Tambah Sinyal Bandar" untuk membuat.</div>
                ) : bandarList.map(s=>(
                  <div key={s.id} className="card rounded-xl p-4 border-l-4 border-purple-500/60">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2"><span className="font-black text-white text-base">{s.kode}</span><span className="text-xs px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">BANDAR</span>{s.is_done&&<span className="text-xs px-2 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 font-bold">Target</span>}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{s.saham}</div>
                      </div>
                      <span className="text-xs font-bold text-purple-400">{s.action}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">Zona Entry</div><div className="text-white font-bold">{s.entry||"-"}</div></div>
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">Target</div><div className="text-purple-400 font-bold">{s.tp||"-"}</div></div>
                      <div className="bg-white/03 rounded p-2"><div className="text-slate-500">SL</div><div className="text-red-400 font-bold">{s.sl||"-"}</div></div>
                    </div>
                    {s.notes && <p className="text-xs text-slate-400 mb-3">{s.notes}</p>}
                    <div className="flex gap-2 flex-wrap">
                      <Btn onClick={async()=>{ const done=!s.is_done; const newList=bandarList.map((x:any)=>x.id===s.id?{...x,is_done:done,done_at:done?new Date().toISOString():null}:x); setBandarList(newList); await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bandar_signals",data:newList})}).catch(()=>{}); }} color={s.is_done?"yellow":"green"} className="flex-1 text-center">{s.is_done?" Batalkan":" Target Tercapai"}</Btn>
                      <Btn onClick={()=>{setBandarForm({...s});setEditBandarId(s.id);setShowBandarForm(true);window.scrollTo(0,0);}} color="blue" className="flex-1 text-center">Edit</Btn>
                      <Btn onClick={async()=>{ if(!confirm("Hapus sinyal bandar ini?"))return; const newList=bandarList.filter((x:any)=>x.id!==s.id); setBandarList(newList); await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"bandar_signals",data:newList})}).catch(()=>{}); }} color="red" className="flex-1 text-center">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ======== VIP USERS (Email OTP accounts) ======== */}
          {tab==="tokens" && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                <div>
                  <h2 className="text-white font-bold text-sm">Manajemen User VIP</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{vipUsers.length} akun terdaftar · {vipUsers.filter(u=>u.role==="vip").length} VIP aktif</p>
                </div>
                <input
                  value={userFilter}
                  onChange={e=>setUserFilter(e.target.value)}
                  placeholder="Cari email..."
                  className="input-dark max-w-[220px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vipUsers.filter(u=>!userFilter || u.email?.toLowerCase().includes(userFilter.toLowerCase())).length===0 ? (
                  <div className="col-span-2 card rounded-2xl p-12 text-center"><p className="text-slate-500 text-sm">Belum ada user terdaftar.</p></div>
                ) : vipUsers.filter(u=>!userFilter || u.email?.toLowerCase().includes(userFilter.toLowerCase())).map((u:any)=>(
                  <div key={u.email} className="card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white break-all">{u.email}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${u.role==="vip"?"bg-blue-400/10 text-blue-400":"bg-slate-400/10 text-slate-400"}`}>
                          {u.role==="vip"?"VIP":"FREE"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-1.5">Terdaftar: {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}) : "-"}</div>
                    <div className="text-xs text-slate-500 mb-3">Login terakhir: {u.last_login_at ? new Date(u.last_login_at).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) : "-"}</div>
                    {u.role==="vip" && (
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Tier Paket</label>
                        <select value={u.subscription||"gold"} onChange={e=>setUserSubscription(u, e.target.value)} className="input-dark">
                          {pkgOpts.map(p=><option key={p} value={p} className="bg-black capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                      <Btn onClick={()=>toggleUserRole(u)} color={u.role==="vip"?"yellow":"green"}>{u.role==="vip"?"Set ke Free":"Set ke VIP"}</Btn>
                      <Btn onClick={()=>delVipUser(u.email)} color="red">Hapus</Btn>
                    </div>
                  </div>
                ))}
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
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
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
              <div className="card rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-white">Tampilkan Info Live</label>
                  <button onClick={()=>setLiveActiveState(!liveActive)} className={`relative w-12 h-6 rounded-full transition-all ${liveActive?"bg-emerald-500":"bg-slate-700"}`}>
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
              {/* MAINTENANCE MODE */}
              <div className="mt-6 card rounded-2xl p-5 border border-orange-500/25">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-sm">Mode Maintenance</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Halaman VIP akan ditutup & tampilkan halaman maintenance</p>
                  </div>
                  <button onClick={()=>setMaintenanceMode(m=>!m)} className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${maintenanceMode?"bg-orange-500":"bg-slate-700"}`}>
                    <span className={`absolute top-1.5 w-4 h-4 rounded-full bg-white transition-all ${maintenanceMode?"left-8":"left-1.5"}`}/>
                  </button>
                </div>
                {maintenanceMode && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-3">
                    <p className="text-orange-400 text-xs font-bold">AKTIF — Halaman VIP sedang ditutup untuk semua user</p>
                  </div>
                )}
                <button onClick={async()=>{
                  await syncToAPI("maintenance_mode", maintenanceMode);
                  setMaintenanceSaved(true);
                  setTimeout(()=>setMaintenanceSaved(false), 2000);
                }} className={`w-full py-2.5 rounded-xl text-sm font-bold border transition-all ${maintenanceMode?"bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25":"btn-primary border-transparent"}`}>
                  {maintenanceSaved ? "Tersimpan!" : maintenanceMode ? " Aktifkan Maintenance" : "Simpan (Maintenance Off)"}
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
                  <div className="card rounded-2xl p-5 mb-4 border border-emerald-500/20">
                    <div className="space-y-3">
                      <div><label className="text-xs text-slate-500 mb-1 block">Judul</label><input value={premSigForm.title} onChange={e=>setPremSigForm({...premSigForm,title:e.target.value})} placeholder="Bandarmologi Report" className="input-dark"/></div>
                      <div><label className="text-xs text-slate-500 mb-1 block">Konten/Deskripsi</label><textarea value={premSigForm.content} onChange={e=>setPremSigForm({...premSigForm,content:e.target.value})} rows={4} placeholder="Isi konten sinyal premium..." className="input-dark resize-none"/></div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={premSigForm.isActive} onChange={e=>setPremSigForm({...premSigForm,isActive:e.target.checked})} className="accent-emerald-500"/>
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
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
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
                    <input type="checkbox" checked={testiForm.isApproved} onChange={e=>setTestiForm({...testiForm,isApproved:e.target.checked})} className="accent-emerald-500"/>
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
                        <span className="ml-2 text-xs text-emerald-400 capitalize">{t.package}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.isApproved?"bg-green-400/10 text-green-400":"bg-red-400/10 text-red-400"}`}>
                        {t.isApproved?"Tampil":"Hidden"}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">{Array(t.rating||5).fill(0).map((_,i)=><span key={i} className="text-yellow-400 text-xs"></span>)}</div>
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
                }} className="btn-primary text-xs px-4 py-2 rounded-xl">Tambah Paket</button>
              </div>
              {showPricingForm && editPricingId && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Edit Paket: {pricing.find(p=>p.id===editPricingId)?.name}</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Harga Paket (Rp) — angka asli yang dipakai saat checkout</label>
                      <input
                        type="number"
                        value={pricingForm.price || ""}
                        onChange={e=>setPricingForm({...pricingForm,price:e.target.value})}
                        placeholder="100000"
                        className="input-dark"
                      />
                      {!!pricingForm.price && (
                        <p className="text-[11px] text-emerald-400 mt-1">
                          Akan tampil sebagai: Rp {parseInt(String(pricingForm.price).replace(/\D/g,""))||0 ? (parseInt(String(pricingForm.price).replace(/\D/g,""))).toLocaleString("id-ID") : "0"}
                        </p>
                      )}
                    </div>
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
                  const colorMap: any = { blue:"border-blue-500/30", emerald:"border-emerald-500/30", gold:"border-yellow-500/30", purple:"border-purple-500/30", platinum:"border-slate-400/30", elite:"border-yellow-400/50" };
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
                        {(p.features||[]).slice(0,3).map((f:string,i:number)=><li key={i} className="text-xs text-slate-500 flex gap-1"><span className="text-emerald-400"></span>{f}</li>)}
                        {(p.features||[]).length>3 && <li className="text-xs text-slate-600">+{p.features.length-3} fitur lainnya</li>}
                      </ul>
                      <div className="flex gap-2">
                        <button onClick={()=>openPricingEdit(p)} className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all">
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
                      onChange={e=>{ const v=parseInt(e.target.value); setTickerSpeed(v); setMotivasiSpeed(v); }}
                      className="w-32 accent-emerald-500"/>
                    <span className="text-xs text-slate-500">Lambat (80s)</span>
                    <span className="text-emerald-400 font-black text-sm w-12 text-center">{tickerSpeed}s</span>
                  </div>
                  <button onClick={async()=>{ await syncToAPI("ticker_speed", tickerSpeed); alert("Kecepatan disimpan!"); }} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Simpan</button>
                  <button onClick={()=>{ setTickerSpeed(32); setMotivasiSpeed(32); syncToAPI("ticker_speed", 32); }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-white hover:bg-white/5">Reset</button>
                </div>
              </div>
              {showTickerForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
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
              {/* Kecepatan ticker */}
              <div className="card rounded-xl p-4 mb-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold">Kecepatan Ticker Motivasi</span>
                  <span className="text-xs text-emerald-400 font-bold">{tickerSpeed}s</span>
                </div>
                <input type="range" min={10} max={80} step={5} value={tickerSpeed}
                  onChange={e=>{ const v=parseInt(e.target.value); setTickerSpeed(v); setMotivasiSpeed(v); }}
                  className="w-full accent-emerald-500"/>
                <div className="flex justify-between text-xs text-slate-600 mt-1 mb-3"><span>Cepat (10s)</span><span>Lambat (80s)</span></div>
                <button onClick={async()=>{ await syncToAPI("ticker_speed", tickerSpeed); alert("Kecepatan ticker disimpan!"); }} className="btn-primary w-full py-2 rounded-xl text-xs font-bold">Simpan Kecepatan</button>
              </div>
              {showMotivasiForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
                  <h3 className="text-white font-bold mb-3 text-sm">{editMotivasiId?"Edit Kata Motivasi":"Tambah Kata Motivasi"}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Isi Kata Motivasi</label>
                      <input value={motivasiForm.jam} onChange={e=>setMotivasiForm({...motivasiForm,jam:e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" placeholder="Jam tampil (opsional, contoh: 08:00)"/>
                      <div className="flex gap-2 items-center">
                        <input type="number" value={motivasiForm.durasi_menit} onChange={e=>setMotivasiForm({...motivasiForm,durasi_menit:parseInt(e.target.value)||5})} className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none" min={1} max={60}/>
                        <span className="text-slate-400 text-xs">menit durasi tampil</span>
                      </div>
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
              {/* Greeting otomatis */}
              <div className="card rounded-xl p-4 mb-4 border border-purple-500/10">
                <h3 className="text-xs font-bold text-white mb-3">Greeting Otomatis</h3>
                <div className="space-y-3 mb-2">
                  {[{key:"greeting_pagi",label:"Selamat Pagi (05:00–10:00)",def:"Selamat pagi! Semangat trading hari ini "},{key:"greeting_malam",label:"Selamat Malam (21:00–24:00)",def:"Selamat malam! Review portofolio hari ini "}].map(g=>(
                    <div key={g.key} className="bg-white/5 rounded-xl p-3">
                      <label className="text-xs text-slate-400 mb-2 block">{g.label}</label>
                      <div className="flex gap-2">
                        <input defaultValue={typeof window!=="undefined"?localStorage.getItem(g.key)||g.def:g.def}
                          onBlur={e=>{ localStorage.setItem(g.key,e.target.value); syncToAPI(g.key,e.target.value); }}
                          className="flex-1 bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/30"/>
                        <button onClick={()=>syncToAPI(g.key,typeof window!=="undefined"?localStorage.getItem(g.key)||g.def:g.def)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Simpan</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <label className="text-xs text-slate-400 flex-shrink-0">Kecepatan Ticker:</label>
                  <input type="range" min={10} max={80} value={tickerSpeed} onChange={e=>{ const v=parseInt(e.target.value); setTickerSpeed(v); setMotivasiSpeed(v); }} className="flex-1"/>
                  <span className="text-xs text-emerald-400 font-bold w-8">{tickerSpeed}s</span>
                </div>
                <button onClick={async()=>{ await syncToAPI("ticker_speed", tickerSpeed); alert("Kecepatan ticker disimpan!"); }} className="text-xs px-4 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-2">Simpan Kecepatan</button>
                <p className="text-xs text-slate-600">Jam kosong = tampil terus-menerus. Isi jam WIB untuk jadwal otomatis.</p>
              </div>
              <div className="space-y-3">
                {motivasiList.length===0 ? (
                  <div className="card rounded-xl p-10 text-center text-slate-500 text-sm">Belum ada kata motivasi.</div>
                ) : motivasiList.map(m=>(
                  <div key={m.id} className="card rounded-xl p-4 flex items-start gap-3">
                    <span className="text-yellow-400 text-lg flex-shrink-0 mt-0.5"></span>
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
                  <h2 className="text-white font-bold text-sm">Login Log — Email OTP</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{loginLogs.length} login tercatat</p>
                </div>
                <button onClick={async()=>{ const r=await fetch("/api/admin/loginlogs").then(x=>x.json()).catch(()=>({})); if(r.logs) setLoginLogs(r.logs); }} className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all">Refresh</button>
              </div>
              {loginLogs.length===0 ? (
                <div className="card rounded-xl p-10 text-center text-slate-500 text-sm">Belum ada log login.</div>
              ) : (
                <div className="space-y-2">
                  {loginLogs.map((log:any, i:number) => (
                    <div key={i} className="card rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs">
                          {log.email?.charAt(0)?.toUpperCase()||"?"}
                        </div>
                        <div>
                          <div className="text-white text-sm font-bold">{log.email||log.name||"-"}</div>
                          <div className="text-slate-500 text-xs">{log.ip}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${log.event==="register"?"bg-blue-500/10 text-blue-400":"bg-emerald-400/10 text-emerald-400"}`}>{log.event||"login"}</span>
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

          {tab==="leaderboard" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Leaderboard</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Peringkat member ditampilkan di tab Leaderboard VIP</p>
                </div>
                <button onClick={()=>{setLeaderboardForm({name:"",badge:"",stat:"",note:""});setEditLeaderboardId(null);setShowLeaderboardForm(!showLeaderboardForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showLeaderboardForm&&!editLeaderboardId?"Tutup":"Tambah Member"}
                </button>
              </div>

              <div className="flex mb-4 rounded-xl overflow-hidden border border-white/10 w-fit">
                {(["weekly","monthly"] as const).map(p => (
                  <button key={p} onClick={()=>setLeaderboardTabPeriod(p)}
                    className={`px-4 py-2 text-xs font-bold ${leaderboardTabPeriod===p ? "bg-blue-600 text-white" : "text-slate-400"}`}>
                    {p==="weekly"?"Mingguan":"Bulanan"}
                  </button>
                ))}
              </div>

              {showLeaderboardForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-blue-500/20">
                  <h3 className="text-white font-bold mb-3 text-sm">{editLeaderboardId?"Edit Member":"Tambah Member"} — {leaderboardTabPeriod==="weekly"?"Mingguan":"Bulanan"}</h3>
                  <div className="space-y-3">
                    <input value={leaderboardForm.name} onChange={e=>setLeaderboardForm({...leaderboardForm,name:e.target.value})} className="input-dark" placeholder="Nama member (contoh: Budi S.)"/>
                    <input value={leaderboardForm.badge} onChange={e=>setLeaderboardForm({...leaderboardForm,badge:e.target.value})} className="input-dark" placeholder="Badge (contoh: Gold Trader) — opsional"/>
                    <input value={leaderboardForm.stat} onChange={e=>setLeaderboardForm({...leaderboardForm,stat:e.target.value})} className="input-dark" placeholder="Statistik (contoh: +142% Profit)"/>
                    <input value={leaderboardForm.note} onChange={e=>setLeaderboardForm({...leaderboardForm,note:e.target.value})} className="input-dark" placeholder="Catatan singkat — opsional"/>
                    <div className="flex gap-2">
                      <button onClick={saveLeaderboard} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">{editLeaderboardId?"Update":"Simpan"}</button>
                      <button onClick={()=>{setShowLeaderboardForm(false);setEditLeaderboardId(null);}} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 border border-white/10 hover:bg-white/5">Batal</button>
                    </div>
                  </div>
                </div>
              )}

              {currentLeaderboardList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">Belum ada data leaderboard {leaderboardTabPeriod==="weekly"?"mingguan":"bulanan"}.</div>
              ) : (
                <div className="space-y-2">
                  {currentLeaderboardList.map((row:any, i:number) => (
                    <div key={row.id} className="card rounded-xl p-3 flex items-center gap-3 border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold text-sm">{row.name}</span>
                          {row.badge && <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-md font-bold">{row.badge}</span>}
                        </div>
                        {row.note && <p className="text-slate-500 text-xs mt-0.5">{row.note}</p>}
                      </div>
                      {row.stat && <span className="text-emerald-400 font-bold text-sm flex-shrink-0">{row.stat}</span>}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={()=>moveLeaderboard(i,-1)} disabled={i===0} className="text-slate-400 hover:text-white disabled:opacity-20 px-1.5 text-xs">▲</button>
                        <button onClick={()=>moveLeaderboard(i,1)} disabled={i===currentLeaderboardList.length-1} className="text-slate-400 hover:text-white disabled:opacity-20 px-1.5 text-xs">▼</button>
                        <button onClick={()=>editLeaderboard(row)} className="text-blue-400 hover:text-blue-300 px-2 text-xs font-bold">Edit</button>
                        <button onClick={()=>delLeaderboard(row.id)} className="text-red-400 hover:text-red-300 px-2 text-xs font-bold">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SINYAL BESOK TAB */}
          {tab==="sinyal_besok" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div><h2 className="text-white font-bold text-sm">Sinyal Besok</h2><p className="text-slate-500 text-xs mt-0.5">Sinyal yang akan tampil besok — bisa disematkan</p></div>
                <button onClick={()=>{ setSigForm({saham:"",kode:"",action:"BUY",entry:"",tp:"",tp2:"",tp3:"",sl:"",notes:"",package:["gold","pro","platinum","elite"],is_tomorrow:true,is_pinned:false}); setEditSigId(null); setShowSigForm(true); setTab("signals"); }} className="btn-primary text-xs px-4 py-2 rounded-xl">+ Tambah Sinyal Besok</button>
              </div>
              <div className="space-y-3">
                {signals.filter((s:any)=>s.is_tomorrow).length===0 ? (
                  <div className="card rounded-xl p-8 text-center text-slate-500 text-sm">Belum ada sinyal untuk besok.</div>
                ) : signals.filter((s:any)=>s.is_tomorrow).map((s:any)=>(
                  <div key={s.id} className="card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-black text-white">{s.kode}</span>
                      <span className={`text-xs font-bold ${actionColor[s.action]||"text-slate-400"}`}>{s.action}</span>
                      <span className="text-xs text-yellow-400 ml-auto">Sinyal Besok</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div><span className="text-slate-500">Entry</span><br/><span className="text-white font-bold">{s.entry}</span></div>
                      <div><span className="text-slate-500">TP1</span><br/><span className="text-green-400 font-bold">{s.tp}</span></div>
                      <div><span className="text-slate-500">SL</span><br/><span className="text-red-400 font-bold">{s.sl}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Btn onClick={async()=>{ const updated=signals.map((x:any)=>x.id===s.id?{...x,is_tomorrow:false}:x); setSignals(updated); await fetch("/api/admin/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"signals_tomorrow",data:updated})}).catch(()=>{}); }} color="yellow" className="flex-1 text-center">Pindah ke Hari Ini</Btn>
                      <Btn onClick={async()=>{ if(!confirm("Hapus?"))return; const updated=signals.filter((x:any)=>x.id!==s.id); setSignals(updated); await fetch(`/api/admin/signals?id=${s.id}`,{method:"DELETE"}).catch(()=>{}); }} color="red" className="flex-1 text-center">Hapus</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ADMIN FEED */}
          {tab==="admin_feed" && <AdminFeedTab />}

          {/* ===== BSJP TAB ===== */}
          {tab==="bsjp" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Beli Sore Jual Pagi (BSJP)</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{bsjpSignals.length} sinyal · Min akses: <span className="text-emerald-400 font-bold capitalize">{bsjpMinPkg}</span></p>
                </div>
                <button onClick={()=>{setBsjpForm({kode:"",saham:"",action:"BUY",entry:"",tp:"",sl:"",description:"",notes:"",date:new Date().toISOString().slice(0,10)});setShowBsjpForm(!showBsjpForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showBsjpForm?"Tutup":"+ Tambah"}
                </button>
              </div>
              {/* Kontrol Role BSJP */}
              <div className="card rounded-xl p-4 mb-4 border border-emerald-500/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 font-bold">Min. Paket Akses BSJP:</span>
                  {["basic","silver","gold","pro","platinum","elite"].map(p=>(
                    <button key={p} onClick={async()=>{ setBsjpMinPkg(p); await syncToAPI("bsjp_min_pkg", p); }} className={`text-xs px-3 py-1.5 rounded-lg capitalize font-bold border transition-all ${bsjpMinPkg===p?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":"bg-white/5 text-slate-500 border-white/10"}`}>{p}</button>
                  ))}
                </div>
                <p className="text-slate-600 text-xs mt-2">Pilih paket minimum — user di bawah paket ini tidak bisa akses tab BSJP</p>
              </div>
              {showBsjpForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Tambah Sinyal BSJP</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={bsjpForm.kode} onChange={e=>setBsjpForm({...bsjpForm,kode:e.target.value.toUpperCase()})} placeholder="BBCA" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={bsjpForm.saham} onChange={e=>setBsjpForm({...bsjpForm,saham:e.target.value})} placeholder="Bank Central Asia" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={bsjpForm.action} onChange={e=>setBsjpForm({...bsjpForm,action:e.target.value})} className="input-dark">
                        {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input type="date" value={bsjpForm.date} onChange={e=>setBsjpForm({...bsjpForm,date:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={bsjpForm.entry} onChange={e=>setBsjpForm({...bsjpForm,entry:e.target.value})} placeholder="9.750" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Stop Loss</label><input value={bsjpForm.sl} onChange={e=>setBsjpForm({...bsjpForm,sl:e.target.value})} placeholder="9.100" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">TP</label><input value={bsjpForm.tp} onChange={e=>setBsjpForm({...bsjpForm,tp:e.target.value})} placeholder="10.200" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Deskripsi Analisis</label><textarea value={bsjpForm.description} onChange={e=>setBsjpForm({...bsjpForm,description:e.target.value})} placeholder="Analisis teknikal & fundamental..." rows={3} className="input-dark resize-none"/></div>
                  <div className="mb-4"><label className="text-xs text-slate-500 mb-1 block">Catatan</label><textarea value={bsjpForm.notes} onChange={e=>setBsjpForm({...bsjpForm,notes:e.target.value})} placeholder="Catatan tambahan..." rows={2} className="input-dark resize-none"/></div>
                  <button onClick={async()=>{
                    if (!bsjpForm.kode) { alert("Isi kode saham!"); return; }
                    const newS = { ...bsjpForm, id: Date.now().toString() };
                    const updated = [newS, ...bsjpSignals];
                    setBsjpSignals(updated);
                    setShowBsjpForm(false);
                    setBsjpForm({kode:"",saham:"",action:"BUY",entry:"",tp:"",sl:"",description:"",notes:"",date:new Date().toISOString().slice(0,10)});
                    await syncToAPI("bsjp_signals", updated);
                  }} className="btn-primary w-full py-3 rounded-xl text-sm font-bold">Simpan Sinyal BSJP</button>
                </div>
              )}
              <div className="space-y-3">
                {bsjpSignals.map((s:any) => (
                  <div key={s.id} className="card rounded-2xl p-4 border border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-xs text-emerald-400">{(s.kode||"--").slice(0,4)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm">{s.kode}</span>
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">{s.action}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{s.saham} · {s.date}</p>
                      </div>
                      <button onClick={async()=>{
                        const updated = bsjpSignals.filter(x=>x.id!==s.id);
                        setBsjpSignals(updated); await syncToAPI("bsjp_signals", updated);
                      }} className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded-lg">Hapus</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      {[{l:"Entry",v:s.entry},{l:"TP",v:s.tp},{l:"SL",v:s.sl}].map(({l,v})=>(
                        <div key={l} className="bg-white/5 rounded-lg p-2"><p className="text-slate-500 text-[10px]">{l}</p><p className="text-white font-bold">{v||"-"}</p></div>
                      ))}
                    </div>
                    {s.description && <p className="text-slate-400 text-xs leading-relaxed">{s.description}</p>}
                  </div>
                ))}
                {bsjpSignals.length === 0 && <p className="text-slate-500 text-sm text-center py-10">Belum ada sinyal BSJP</p>}
              </div>
            </div>
          )}

          {/* ===== BPJS TAB ===== */}
          {tab==="bpjs" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Beli Pagi Jual Sore (BPJS)</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{bpjsSignals.length} sinyal · Min akses: <span className="text-purple-400 font-bold capitalize">{bpjsMinPkg}</span></p>
                </div>
                <button onClick={()=>{setBpjsForm({kode:"",saham:"",action:"BUY",entry:"",tp:"",sl:"",description:"",notes:"",date:new Date().toISOString().slice(0,10)});setShowBpjsForm(!showBpjsForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showBpjsForm?"Tutup":"+ Tambah"}
                </button>
              </div>
              {/* Kontrol Role BPJS */}
              <div className="card rounded-xl p-4 mb-4 border border-purple-500/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 font-bold">Min. Paket Akses BPJS:</span>
                  {["basic","silver","gold","pro","platinum","elite"].map(p=>(
                    <button key={p} onClick={async()=>{ setBpjsMinPkg(p); await syncToAPI("bpjs_min_pkg", p); }} className={`text-xs px-3 py-1.5 rounded-lg capitalize font-bold border transition-all ${bpjsMinPkg===p?"bg-purple-500/20 text-purple-400 border-purple-500/30":"bg-white/5 text-slate-500 border-white/10"}`}>{p}</button>
                  ))}
                </div>
                <p className="text-slate-600 text-xs mt-2">Pilih paket minimum — user di bawah paket ini tidak bisa akses tab BPJS</p>
              </div>
              {showBpjsForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-purple-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Tambah Sinyal BPJS</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode Saham</label><input value={bpjsForm.kode} onChange={e=>setBpjsForm({...bpjsForm,kode:e.target.value.toUpperCase()})} placeholder="BPJK" className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama</label><input value={bpjsForm.saham} onChange={e=>setBpjsForm({...bpjsForm,saham:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Aksi</label>
                      <select value={bpjsForm.action} onChange={e=>setBpjsForm({...bpjsForm,action:e.target.value})} className="input-dark">
                        {["BUY","SELL","HOLD","ANTRI"].map(a=><option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input type="date" value={bpjsForm.date} onChange={e=>setBpjsForm({...bpjsForm,date:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={bpjsForm.entry} onChange={e=>setBpjsForm({...bpjsForm,entry:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">TP</label><input value={bpjsForm.tp} onChange={e=>setBpjsForm({...bpjsForm,tp:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">SL</label><input value={bpjsForm.sl} onChange={e=>setBpjsForm({...bpjsForm,sl:e.target.value})} className="input-dark"/></div>
                  </div>
                  <div className="mb-4"><label className="text-xs text-slate-500 mb-1 block">Deskripsi</label><textarea value={bpjsForm.description} onChange={e=>setBpjsForm({...bpjsForm,description:e.target.value})} rows={3} className="input-dark resize-none"/></div>
                  <button onClick={async()=>{
                    if (!bpjsForm.kode) { alert("Isi kode!"); return; }
                    const newS = { ...bpjsForm, id: Date.now().toString() };
                    const updated = [newS, ...bpjsSignals];
                    setBpjsSignals(updated); setShowBpjsForm(false);
                    setBpjsForm({kode:"",saham:"",action:"BUY",entry:"",tp:"",sl:"",description:"",notes:"",date:new Date().toISOString().slice(0,10)});
                    await syncToAPI("bpjs_signals", updated);
                  }} className="btn-primary w-full py-3 rounded-xl text-sm font-bold">Simpan Sinyal BPJS</button>
                </div>
              )}
              <div className="space-y-3">
                {bpjsSignals.map((s:any) => (
                  <div key={s.id} className="card rounded-2xl p-4 border border-purple-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-black text-xs text-purple-400">{(s.kode||"--").slice(0,4)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm">{s.kode}</span>
                          <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold">{s.action}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{s.saham} · {s.date}</p>
                      </div>
                      <button onClick={async()=>{
                        const updated = bpjsSignals.filter(x=>x.id!==s.id);
                        setBpjsSignals(updated); await syncToAPI("bpjs_signals", updated);
                      }} className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded-lg">Hapus</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                      {[{l:"Entry",v:s.entry},{l:"TP",v:s.tp},{l:"SL",v:s.sl}].map(({l,v})=>(
                        <div key={l} className="bg-white/5 rounded-lg p-2"><p className="text-slate-500 text-[10px]">{l}</p><p className="text-white font-bold">{v||"-"}</p></div>
                      ))}
                    </div>
                    {s.description && <p className="text-slate-400 text-xs leading-relaxed">{s.description}</p>}
                  </div>
                ))}
                {bpjsSignals.length === 0 && <p className="text-slate-500 text-sm text-center py-10">Belum ada sinyal BPJS</p>}
              </div>
            </div>
          )}

          {/* ===== REKAP TP/SL TAB ===== */}
          {tab==="rekap" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Rekap Sinyal TP/SL</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{rekapList.length} rekap tersimpan</p>
                </div>
                <button onClick={()=>{setRekapForm({kode:"",saham:"",result:"TP",entry:"",tp:"",sl:"",close_price:"",gain:"",date:new Date().toISOString().slice(0,10),notes:""});setShowRekapForm(!showRekapForm);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showRekapForm?"Tutup":"+ Tambah Rekap"}
                </button>
              </div>
              {showRekapForm && (
                <div className="card rounded-2xl p-5 mb-5 border border-green-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Tambah Rekap Sinyal</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={rekapForm.kode} onChange={e=>setRekapForm({...rekapForm,kode:e.target.value.toUpperCase()})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Nama Saham</label><input value={rekapForm.saham} onChange={e=>setRekapForm({...rekapForm,saham:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Hasil</label>
                      <select value={rekapForm.result} onChange={e=>setRekapForm({...rekapForm,result:e.target.value})} className="input-dark">
                        {["TP","SL","TP1","TP2","TP3","BE"].map(r=><option key={r} value={r} className="bg-black">{r}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input type="date" value={rekapForm.date} onChange={e=>setRekapForm({...rekapForm,date:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={rekapForm.entry} onChange={e=>setRekapForm({...rekapForm,entry:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Close/Exit Price</label><input value={rekapForm.close_price} onChange={e=>setRekapForm({...rekapForm,close_price:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">TP Level</label><input value={rekapForm.tp} onChange={e=>setRekapForm({...rekapForm,tp:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Gain % (+ atau -)</label><input value={rekapForm.gain} onChange={e=>setRekapForm({...rekapForm,gain:e.target.value})} placeholder="+5.3" className="input-dark"/></div>
                  </div>
                  <div className="mb-4"><label className="text-xs text-slate-500 mb-1 block">Catatan</label><textarea value={rekapForm.notes} onChange={e=>setRekapForm({...rekapForm,notes:e.target.value})} rows={2} className="input-dark resize-none"/></div>
                  <button onClick={async()=>{
                    if (!rekapForm.kode) { alert("Isi kode!"); return; }
                    const newR = { ...rekapForm, id: Date.now().toString() };
                    const updated = [newR, ...rekapList];
                    setRekapList(updated); setShowRekapForm(false);
                    setRekapForm({kode:"",saham:"",result:"TP",entry:"",tp:"",sl:"",close_price:"",gain:"",date:new Date().toISOString().slice(0,10),notes:""});
                    await syncToAPI("rekap_sinyal", updated);
                  }} className="btn-primary w-full py-3 rounded-xl text-sm font-bold">Simpan Rekap</button>
                </div>
              )}
              <div className="space-y-3">
                {rekapList.map((r:any) => (
                  <div key={r.id} className={`card rounded-2xl p-4 border ${r.result==="SL"?"border-red-500/15":"border-green-500/15"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm">{r.kode}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold border ${r.result==="SL"?"bg-red-500/10 text-red-400 border-red-500/20":"bg-green-500/10 text-green-400 border-green-500/20"}`}>{r.result}</span>
                        {r.gain && <span className={`text-xs font-bold ${parseFloat(r.gain)>=0?"text-green-400":"text-red-400"}`}>{parseFloat(r.gain)>=0?"+":""}{r.gain}%</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">{r.date}</span>
                        <button onClick={async()=>{
                          const updated=rekapList.filter(x=>x.id!==r.id);
                          setRekapList(updated); await syncToAPI("rekap_sinyal",updated);
                        }} className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded-lg">Hapus</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[{l:"Entry",v:r.entry},{l:"Close",v:r.close_price},{l:"TP",v:r.tp},{l:"SL",v:r.sl}].map(({l,v})=>(
                        <div key={l} className="bg-white/5 rounded-lg p-2"><p className="text-slate-500 text-[10px]">{l}</p><p className="text-white font-bold">{v||"-"}</p></div>
                      ))}
                    </div>
                    {r.notes && <p className="text-slate-400 text-xs mt-2 leading-relaxed">{r.notes}</p>}
                  </div>
                ))}
                {rekapList.length === 0 && <p className="text-slate-500 text-sm text-center py-10">Belum ada rekap sinyal</p>}
              </div>
            </div>
          )}

          {/* ===== JURNAL TRADE TAB ===== */}
          {tab==="jurnal" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-white font-bold text-sm">Jurnal Trade</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{jurnalList.length} entry · Win rate: {jurnalList.length>0?Math.round(jurnalList.filter((j:any)=>j.result==="TP"||parseFloat(j.gain||0)>0).length/jurnalList.length*100):0}%</p>
                </div>
                <button onClick={()=>{setJurnalFormAdmin({kode:"",saham:"",action:"BUY",entry:"",exit:"",result:"TP",gain:"",tanggal:new Date().toISOString().slice(0,10),alasan:"",evaluasi:""});setShowJurnalFormAdmin(!showJurnalFormAdmin);}} className="btn-primary text-xs px-4 py-2 rounded-xl">
                  {showJurnalFormAdmin?"Tutup":"+ Tambah Jurnal"}
                </button>
              </div>
              {showJurnalFormAdmin && (
                <div className="card rounded-2xl p-5 mb-5 border border-emerald-500/20">
                  <h3 className="text-white font-bold mb-4 text-sm">Tambah Entry Jurnal</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-slate-500 mb-1 block">Kode</label><input value={jurnalFormAdmin.kode} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,kode:e.target.value.toUpperCase()})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Tanggal</label><input type="date" value={jurnalFormAdmin.tanggal} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,tanggal:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Entry</label><input value={jurnalFormAdmin.entry} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,entry:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Exit</label><input value={jurnalFormAdmin.exit} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,exit:e.target.value})} className="input-dark"/></div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Hasil</label>
                      <select value={jurnalFormAdmin.result} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,result:e.target.value})} className="input-dark">
                        {["TP","SL","BE","MANUAL"].map(r=><option key={r} value={r} className="bg-black">{r}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-500 mb-1 block">Gain %</label><input value={jurnalFormAdmin.gain} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,gain:e.target.value})} placeholder="+5.3" className="input-dark"/></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-slate-500 mb-1 block">Alasan Entry</label><textarea value={jurnalFormAdmin.alasan} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,alasan:e.target.value})} rows={2} className="input-dark resize-none"/></div>
                  <div className="mb-4"><label className="text-xs text-slate-500 mb-1 block">Evaluasi</label><textarea value={jurnalFormAdmin.evaluasi} onChange={e=>setJurnalFormAdmin({...jurnalFormAdmin,evaluasi:e.target.value})} rows={2} className="input-dark resize-none"/></div>
                  <button onClick={async()=>{
                    if (!jurnalFormAdmin.kode) { alert("Isi kode!"); return; }
                    const newJ = { ...jurnalFormAdmin, id: Date.now().toString(), source: "global", created_at: new Date().toISOString() };
                    const updated = [newJ, ...jurnalList];
                    setJurnalList(updated); setShowJurnalFormAdmin(false);
                    setJurnalFormAdmin({kode:"",saham:"",action:"BUY",entry:"",exit:"",result:"TP",gain:"",tanggal:new Date().toISOString().slice(0,10),alasan:"",evaluasi:""});
                    await syncToAPI("jurnal_global", updated);
                  }} className="btn-primary w-full py-3 rounded-xl text-sm font-bold">Simpan Jurnal (Muncul Semua Token)</button>
                </div>
              )}
              <div className="space-y-3">
                {jurnalList.map((j:any) => (
                  <div key={j.id} className={`card rounded-2xl p-4 border ${j.result==="SL"||parseFloat(j.gain||0)<0?"border-red-500/15":"border-green-500/15"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm">{j.kode}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold border ${j.result==="SL"?"bg-red-500/10 text-red-400 border-red-500/20":"bg-green-500/10 text-green-400 border-green-500/20"}`}>{j.result}</span>
                        {j.gain && <span className={`text-xs font-bold ${parseFloat(j.gain)>=0?"text-green-400":"text-red-400"}`}>{parseFloat(j.gain)>=0?"+":""}{j.gain}%</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">{j.tanggal}</span>
                        <button onClick={async()=>{
                          const updated=jurnalList.filter((x:any)=>x.id!==j.id);
                          setJurnalList(updated); await syncToAPI("jurnal_global",updated);
                        }} className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded-lg">Hapus</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      {[{l:"Entry",v:j.entry},{l:"Exit",v:j.exit}].map(({l,v})=>(
                        <div key={l} className="bg-white/5 rounded-lg p-2"><p className="text-slate-500 text-[10px]">{l}</p><p className="text-white font-bold">{v||"-"}</p></div>
                      ))}
                    </div>
                    {j.alasan && <p className="text-emerald-400/60 text-xs mt-1">Alasan: <span className="text-slate-400">{j.alasan}</span></p>}
                    {j.evaluasi && <p className="text-yellow-400/60 text-xs mt-1">Evaluasi: <span className="text-slate-400">{j.evaluasi}</span></p>}
                  </div>
                ))}
                {jurnalList.length === 0 && <p className="text-slate-500 text-sm text-center py-10">Belum ada jurnal trade</p>}
              </div>
            </div>
          )}

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
  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><div className="text-slate-500 text-sm">Memuat...</div></div>;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { localStorage.removeItem("admin_auth"); setAuthed(false); }} />;
}




