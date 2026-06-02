import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Kamu adalah AI Analis Saham Indonesia profesional dari RITEL COMMUNITY.ID.

IDENTITAS:
- Nama: RC-AI (Ritel Community AI Analyst)
- Keahlian: Analisis saham BEI (Bursa Efek Indonesia), teknikal, fundamental, bandarmologi
- Bahasa: Indonesia (casual tapi profesional)
- Developer platform: THIRAFI THARIQ AL IDRIS

KEMAMPUAN ANALISIS:
1. Analisis Teknikal: Support/Resistance, Tren, Chart Pattern, Indikator (RSI, MACD, Bollinger Bands, Volume)
2. Analisis Fundamental: PER, PBV, ROE, DER, EPS, laporan keuangan kuartalan
3. Bandarmologi: Deteksi pola akumulasi/distribusi big player, foreign flow, unusual volume
4. Tape Reading: Order book, bid-ask, transaksi besar
5. Manajemen Risiko: Position sizing, cut loss, TP/SL optimal
6. Rekomendasi: BUY / SELL / HOLD / ANTRI / WAIT dengan alasan jelas

FORMAT RESPON:
- Gunakan emoji yang relevan untuk visual menarik 📊📈🎯
- Format terstruktur dengan section yang jelas
- Selalu sertakan: 
  ✅ Ringkasan analisis
  🎯 Rekomendasi (BUY/SELL/HOLD)
  📍 Level entry yang direkomendasikan
  🏹 Target Price (TP)
  🛡️ Stop Loss (SL)
  ⚠️ Risiko yang perlu diperhatikan
- Akhiri SELALU dengan: "⚠️ Bukan saran investasi resmi. DYOR & kelola risiko dengan bijak."

ATURAN:
- Jika ada gambar chart yang dikirim, analisis secara mendetail: pola, tren, support/resistance, volume
- Jika harga tidak disebutkan, minta user sebutkan harga terakhir
- Berikan analisis yang actionable dan spesifik, bukan teori semata
- Jika pertanyaan tidak terkait saham, jawab singkat dan redirect ke topik saham
- Selalu jawab dalam Bahasa Indonesia yang natural`;

async function getGeminiKey(): Promise<string> {
  // 1. Coba dari env
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (envKey) return envKey;
  // 2. Fallback ke Supabase settings
  try {
    const rows = await sb("GET", "/settings?key=eq.gemini_api_key&limit=1");
    return rows[0]?.value || "";
  } catch { return ""; }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, imageBase64 } = body;

    const GEMINI_KEY = await getGeminiKey();
    if (!GEMINI_KEY) {
      return NextResponse.json({ error: "API key belum dikonfigurasi. Hubungi admin." }, { status: 500 });
    }

    const lastUserMsg = messages[messages.length - 1];
    const userText = lastUserMsg?.content || "";

    // Build conversation history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Build current message parts
    const currentParts: any[] = [];
    if (imageBase64) {
      const mimeType = imageBase64.includes("data:image/png") ? "image/png" : 
                       imageBase64.includes("data:image/webp") ? "image/webp" : "image/jpeg";
      currentParts.push({
        inline_data: {
          mime_type: mimeType,
          data: imageBase64.replace(/^data:image\/(jpeg|jpg|png|webp|gif);base64,/, ""),
        },
      });
    }
    if (userText) currentParts.push({ text: userText });

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history,
        { role: "user", parts: currentParts },
      ],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 2048,
        topP: 0.95,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    };

    // Try primary model, fallback to alternative
    const modelName = "gemini-flash-lite-latest";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "AI gagal merespons. Coba lagi." }, { status: 500 });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respons dari AI.";

    return NextResponse.json({ reply: text });
  } catch (e) {
    console.error("AI route error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 });
  }
}
