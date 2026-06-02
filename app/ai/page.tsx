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
const AI_ALLOWED = ["pro", "platinum", "elite"];

function formatMsg(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-cyan-300 text-xs">$1</code>')
    .replace(/\n/g, '<br/>');
}

const QUICK_PROMPTS = [
  "📊 Analisis BBCA hari ini",
  "📈 Ciri saham yang mau naik",
  "🎯 Cara tentukan TP dan SL",
  "🔍 Apa itu bandarmologi?",
  "💰 Tips position sizing",
  "📉 IHSG hari ini gimana?",
];

export default function AIAgentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Aku **RC-AI**, analis saham AI dari Ritel Community.ID 🤖📊\n\nAku bisa bantu kamu:\n- **Analisis teknikal & fundamental** saham BEI\n- **Baca chart** (kirim gambar screenshot chartnya!)\n- **Rekomendasi entry, TP, SL**\n- **Bandarmologi & tape reading**\n- **Manajemen risiko & psikologi trading**\n\nMau analisa saham apa hari ini? 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth check - pro/platinum/elite only
  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    if (!token) {
      router.push("/login?error=" + encodeURIComponent("Login dulu untuk akses RC-AI"));
      return;
    }
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (!d.success) {
          localStorage.removeItem("vip_token");
          localStorage.removeItem("vip_user");
          router.push("/login?error=" + encodeURIComponent("Session tidak valid"));
        } else {
          setUser(d.user);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        // fallback ke cached user
        try {
          const cached = localStorage.getItem("vip_user");
          if (cached) { setUser(JSON.parse(cached)); setAuthChecked(true); }
          else router.push("/login");
        } catch { router.push("/login"); }
      });
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
        content: data.reply || "Maaf, terjadi kesalahan. Coba lagi ya 🙏",
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
    content: "Chat dibersihkan. Mau analisa saham apa? 📊",
  }]);

  // Loading state - verifying auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#04060f] flex items-center justify-center">
        <GalaxyBg />
        <div className="relative z-10 text-slate-500 text-sm">Memverifikasi akses...</div>
      </div>
    );
  }

  // Access denied - not pro/platinum/elite
  if (!AI_ALLOWED.includes(user?.package?.toLowerCase())) {
    return (
      <div className="min-h-screen bg-[#04060f] flex items-center justify-center px-4">
        <GalaxyBg />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-white font-black text-xl mb-2">Fitur Terkunci</h1>
          <p className="text-slate-400 text-sm mb-2">RC-AI Analyst hanya tersedia untuk paket:</p>
          <div className="flex gap-2 justify-center mb-4">
            {["Pro", "Platinum", "Elite"].map(p => (
              <span key={p} className="text-xs px-3 py-1 rounded-full border border-purple-500/40 text-purple-400">{p}</span>
            ))}
          </div>
          <p className="text-slate-500 text-xs mb-6">Paket kamu saat ini: <span className="text-white capitalize font-bold">{user?.package || "basic"}</span></p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://wa.me/6282218723401?text=Halo%20mau%20upgrade%20ke%20Pro!" target="_blank"
              className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">
              ⚡ Upgrade Sekarang
            </a>
            <Link href="/vip" className="text-sm px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors">
              ← Kembali
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060f] flex flex-col">
      <GalaxyBg />

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/vip" className="text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">AI</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-none">RC-AI Analyst</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                <span className="text-xs text-green-400">Online · Paket {user?.package}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/5">
          🗑 Clear
        </button>
      </header>

      {/* Quick prompts */}
      <div className="relative z-10 px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-none bg-black/30 border-b border-white/5">
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => send(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 whitespace-nowrap transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
              m.role === "assistant"
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            }`}>
              {m.role === "assistant" ? "AI" : (user?.name?.charAt(0) || "U")}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              m.role === "assistant"
                ? "bg-white/5 border border-white/8 text-slate-200"
                : "bg-gradient-to-br from-cyan-600 to-blue-700 text-white"
            }`}>
              {m.image && (
                <img src={m.image} alt="chart" className="rounded-lg mb-2 max-h-48 object-contain border border-white/10"/>
              )}
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">AI</div>
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:"0ms"}}/>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:"150ms"}}/>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:"300ms"}}/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative z-10 px-4 pb-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-20 rounded-xl border border-cyan-500/30 object-contain"/>
            <button onClick={() => { setImage(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 bg-black/80 backdrop-blur-md border-t border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end">
            <button onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
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
                placeholder="Tanya analisis saham... atau paste screenshot chart 📊"
                rows={1}
                style={{resize:"none",minHeight:"40px",maxHeight:"120px"}}
                className="w-full input-dark rounded-xl pr-3 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={() => send()}
              disabled={loading || (!input.trim() && !image)}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white transition-all disabled:opacity-40 hover:shadow-lg hover:shadow-cyan-500/30">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-700 text-center mt-2">RC-AI · Gemini · Bukan saran investasi resmi</p>
        </div>
      </div>
    </div>
  );
}
