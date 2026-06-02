import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Kamu adalah RC-AI, analis saham BEI profesional dari RITEL COMMUNITY.ID.
Bahasa: Indonesia casual tapi profesional. Developer: THIRAFI THARIQ AL IDRIS.

KEMAMPUAN: Analisis teknikal, fundamental, bandarmologi, tape reading, manajemen risiko.

FORMAT WAJIB untuk setiap analisis saham:
✅ Ringkasan
🎯 Rekomendasi (BUY/SELL/HOLD/ANTRI/WAIT)  
📍 Entry
🏹 Target Price (TP)
🛡️ Stop Loss (SL)
⚠️ Risiko

Akhiri SELALU: "⚠️ Bukan saran investasi resmi. DYOR & kelola risiko."
Jika ada gambar chart → analisis visual secara detail.`;

const MODELS = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
];

async function getKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const rows = await sb("GET", "/settings?key=eq.gemini_api_key&limit=1");
    return rows[0]?.value || "";
  } catch { return ""; }
}

async function callGemini(key: string, model: string, contents: any[], system: string): Promise<string | null> {
  const payload = {
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048, topP: 0.95 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error(`Model ${model} failed:`, err.slice(0, 200));
    return null;
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, imageBase64 } = body;

    const key = await getKey();
    if (!key) {
      return NextResponse.json({ error: "API key belum dikonfigurasi. Hubungi admin." }, { status: 500 });
    }

    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg?.content || "";

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const currentParts: any[] = [];
    if (imageBase64) {
      const mimeType = imageBase64.startsWith("data:image/png") ? "image/png"
        : imageBase64.startsWith("data:image/webp") ? "image/webp" : "image/jpeg";
      currentParts.push({
        inline_data: {
          mime_type: mimeType,
          data: imageBase64.replace(/^data:image\/[^;]+;base64,/, ""),
        },
      });
    }
    if (userText) currentParts.push({ text: userText });

    const contents = [...history, { role: "user", parts: currentParts }];

    // Try each model in order until one works
    let reply: string | null = null;
    for (const model of MODELS) {
      reply = await callGemini(key, model, contents, SYSTEM_PROMPT);
      if (reply) break;
    }

    if (!reply) {
      return NextResponse.json({ error: "AI sementara tidak tersedia. Coba beberapa saat lagi." }, { status: 503 });
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("AI route error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 });
  }
}
