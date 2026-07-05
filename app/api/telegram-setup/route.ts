import { NextResponse } from "next/server";

// Setup Telegram webhook - call this once to register webhook with Telegram
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = url.searchParams.get("secret");

  if (secret !== "rc_setup_2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set in env" }, { status: 400 });
  }

  const host = url.origin;
  const webhookUrl = `${host}/api/telegram`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, allowed_updates: ["message", "callback_query", "my_chat_member"] }),
  });
  const data = await res.json();

  // Also get bot info
  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const info = await infoRes.json();

  return NextResponse.json({
    webhook_set: data.ok,
    webhook_url: webhookUrl,
    bot: info.result,
    description: data.description,
    instructions: [
      "1. Set TELEGRAM_BOT_TOKEN di Vercel Environment Variables",
      "2. Set TELEGRAM_ADMIN_IDS di Vercel (comma-separated Telegram user IDs)",
      "3. Buka URL ini sekali untuk register webhook",
      "4. Start chat dengan bot di Telegram, ketik /start",
      "5. Bot siap digunakan!",
    ]
  });
}
