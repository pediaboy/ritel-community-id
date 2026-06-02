import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `Kamu adalah AI Analis Saham Indonesia profesional dari RITEL COMMUNITY.ID. 

IDENTITAS:
- Nama: RC-AI (Ritel Community AI Analyst)
- Keahlian: Analisis saham BEI (Bursa Efek Indonesia), teknikal, fundamental, bandarmologi
- Bahasa: Indonesia (casual tapi profesional)

KEMAMPUAN ANALISIS:
1. Analisis Teknikal: Support/Resistance, Tren, Chart Pattern, Indikator (RSI, MACD, BB)
2. Analisis Fundamental: PER, PBV, ROE, DER, laporan keuangan
3. Bandarmologi: Deteksi pola akumulasi/distribusi big player
4. Manajemen Risiko: Position sizing, cut loss, TP/SL
5. Rekomendasi: BUY / SELL / HOLD / ANTRI dengan alasan jelas

FORMAT RESPON:
- Gunakan emoji untuk visual yang menarik
- Gunakan format terstruktur dengan section yang jelas  
- Selalu sertakan: harga saat ini (jika disebutkan), analisis, rekomendasi, level entry/TP/SL
- Akhiri dengan disclaimer: "Bukan merupakan saran investasi. DYOR."

ATURAN:
- Jika ada gambar chart yang dikirim, analisis dengan detail
- Selalu tanyakan konteks jika kurang jelas (kode saham, timeframe, dll)
- Berikan analisis yang actionable, bukan teori semata
- Jika harga saham tidak diketahui, minta user untuk menyebutkan atau cek sendiri`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, imageBase64 } = body;

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: "API key tidak tersedia" }, { status: 500 });
    }

    // Build Gemini content parts
    const lastUserMsg = messages[messages.length - 1];
    const userText = lastUserMsg?.content || "";

    // Build history (all messages except last)
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Build current parts
    const currentParts: any[] = [{ text: userText }];
    if (imageBase64) {
      currentParts.unshift({
        inline_data: {
          mime_type: imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg",
          data: imageBase64.replace(/^data:image\/(jpeg|png|webp);base64,/, ""),
        },
      });
    }

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history,
        { role: "user", parts: currentParts },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
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
