"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function GalaxyBg() {
  return <div className="galaxy-stars" />;
}

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

// Packages that can access AI
const AI_ALLOWED = ["silver", "gold", "pro", "platinum", "elite"];

function formatMsg(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-emerald-300 text-xs">$1</code>')
    .replace(/\n/g, '<br/>');
}

const QUICK_PROMPTS = [
  " Analisis BBCA hari ini",
  " Ciri saham yang mau naik",
  " Cara tentukan TP dan SL",
  " Apa itu bandarmologi?",
  " Tips position sizing",
  " IHSG hari ini gimana?",
];

export default function AIAgentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Aku **RC-AI**, analis saham AI dari Ritel Community.ID \n\nAku bisa bantu kamu:\n- **Analisis teknikal & fundamental** saham BEI\n- **Baca chart** (kirim gambar screenshot chartnya!)\n- **Rekomendasi entry, TP, SL**\n- **Bandarmologi & tape reading**\n- **Manajemen risiko & psikologi trading**\n\nMau analisa saham apa hari ini? ",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth check - session (email OTP) required
  useEffect(() => {
    const session = localStorage.getItem("vip_session");
    const cached = localStorage.getItem("vip_user");
    if (!session || !cached) {
      router.push("/login?error=" + encodeURIComponent("Login dulu untuk akses RC-AI"));
      return;
    }
    try {
      setUser(JSON.parse(cached));
      setAuthChecked(true);
    } catch {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      setImage(b64);
      setImagePreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
      }
    }
  };

  const send = async (msgText?: string) => {
    const text = msgText || input.trim();
    if (!text && !image) return;
    if (loading) return;

    const userMsg: Message = { role: "user", content: text, image: image || undefined };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          imageBase64: userMsg.image || null,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || "Maaf, terjadi kesalahan. Coba lagi ya ",
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Koneksi bermasalah. Coba lagi." }]);
    }
    setLoading(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => setMessages([{
    role: "assistant",
    content: "Chat dibersihkan. Mau analisa saham apa? ",
  }]);

  // Loading state - verifying auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <GalaxyBg />
        <div className="relative z-10 text-slate-500 text-sm">Memverifikasi akses...</div>
      </div>
    );
  }

  // Access denied - not pro/platinum/elite
  if (!AI_ALLOWED.includes(user?.package?.toLowerCase())) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
        <GalaxyBg />
        <div className="relative z-10 text-center max-w-sm glass-card mark-lg p-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-xl font-bold text-[#2563EB]">LOCK</span>
          </div>
          <h1 className="headline text-xl mb-4">FITUR <span className="accent">TERKUNCI</span></h1>
          <p className="text-slate-400 text-xs mb-3">RC-AI Analyst hanya tersedia untuk paket:</p>
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {["Pro", "Platinum", "Elite"].map(p => (
              <span key={p} className="tag-chip">{p}</span>
            ))}
          </div>
          <p className="text-slate-500 text-xs mb-6">Paket kamu saat ini: <span className="text-white capitalize font-bold">{user?.package || "basic"}</span></p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20ke%20Pro!" target="_blank"
              className="btn-primary text-xs px-6 py-2.5 rounded-lg inline-block">
               Upgrade Sekarang
            </a>
            <Link href="/vip" className="text-xs px-6 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors">
               Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <GalaxyBg />

      {/* Header */}
      <header className="relative z-10 bg-[#030712]/80 backdrop-blur-md border-b border-white/8 px-4 h-14 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/vip" className="text-slate-400 hover:text-[#2563EB] transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-[#2563EB] text-xs font-black">AI</span>
            </div>
            <div>
              <div className="headline text-xs leading-none">RC-AI <span className="accent">ANALYST</span></div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"/>
                <span className="text-[10px] text-[#2563EB] font-bold">ONLINE · PAKET {user?.package?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="tag-chip text-[10px]" style={{ padding: "4px 10px" }}>
           Clear
        </button>
      </header>

      {/* Quick prompts */}
      <div className="relative z-10 px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-none bg-black/30 border-b border-white/8">
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => send(p)}
            className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-emerald-500/25 text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-emerald-500/5 whitespace-nowrap transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
              m.role === "assistant"
                ? "bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB]"
                : "bg-white/5 border border-white/10 text-white"
            }`}>
              {m.role === "assistant" ? "AI" : (user?.name?.charAt(0) || "U")}
            </div>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
              m.role === "assistant"
                ? "glass-card no-mark text-slate-200"
                : "bg-emerald-950/20 border border-[#2563EB]/30 text-[#EDEEF0]"
            }`}>
              {m.image && (
                <img src={m.image} alt="chart" className="rounded border border-white/10 mb-2 max-h-48 object-contain"/>
              )}
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] text-xs font-black flex-shrink-0">AI</div>
            <div className="glass-card no-mark rounded-lg px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{animationDelay:"0ms"}}/>
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{animationDelay:"150ms"}}/>
                <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{animationDelay:"300ms"}}/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative z-10 px-4 pb-2 max-w-2xl mx-auto w-full">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-20 rounded border border-emerald-500/30 object-contain"/>
            <button onClick={() => { setImage(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 bg-[#030712]/80 backdrop-blur-md border-t border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end">
            <button onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-all">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value=""; }}/>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                onPaste={onPaste}
                placeholder="Tanya analisis saham... atau paste screenshot chart "
                rows={1}
                style={{resize:"none",minHeight:"40px",maxHeight:"120px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)"}}
                className="w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#2563EB] rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={() => send()}
              disabled={loading || (!input.trim() && !image)}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-[#FFFFFF] transition-all disabled:opacity-40">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2 tracking-wider">RC-AI · POWERED BY GEMINI · BUKAN SARAN INVESTASI RESMI</p>
        </div>
      </div>
    </div>
  );
}
