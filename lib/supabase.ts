const SUPABASE_URL = "https://qsbpiijaxxjtnhejcepb.supabase.co";
// service_role key - bypasses RLS
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYnBpaWpheHhqdG5oZWpjZXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE0OTY3OSwiZXhwIjoyMDk1NzI1Njc5fQ.LDetNNQw9MKRz8X19ik5B0TATauCHfmwGR4_b-vu8eo";

export { SUPABASE_URL, SUPABASE_SERVICE_KEY };

export async function sb(
  method: string,
  path: string,
  body?: any,
  extraHeaders?: Record<string, string>
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "DELETE" && res.status === 204) return [];
  const text = await res.text();
  let parsed: any = [];
  if (text) { try { parsed = JSON.parse(text); } catch { parsed = []; } }
  if (!res.ok) {
    // Previously swallowed silently — a failed write here (e.g. saving a new
    // vip_users record) would look identical to success and the record would
    // just vanish. Log loudly so it shows up in Vercel function logs.
    console.error(`[sb] ${method} ${path} failed (${res.status}):`, typeof parsed === "object" ? JSON.stringify(parsed) : parsed);
  }
  return parsed;
}

// ── Supabase GoTrue Auth REST helper (Email OTP) ──────────────────
export async function sbAuth(path: string, body: any) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  return { ok: res.status >= 200 && res.status < 300, status: res.status, data };
}

// ── VIP users store (key/value in `settings` table, key = "vip_users") ──
export async function getVipUsers(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.vip_users&limit=1");
  return rows[0]?.value || [];
}

export async function saveVipUsers(users: any[]) {
  const payload = { key: "vip_users", value: users, updated_at: new Date().toISOString() };
  const prefer = { Prefer: "resolution=merge-duplicates,return=representation" };
  let result = await sb("POST", "/settings", payload, prefer);
  // Guard against a transient write failure silently dropping a just-registered
  // user — retry once before giving up, so the account reliably ends up saved.
  if (!Array.isArray(result) || result.length === 0) {
    await new Promise(r => setTimeout(r, 500));
    result = await sb("POST", "/settings", payload, prefer);
    if (!Array.isArray(result) || result.length === 0) {
      console.error("[saveVipUsers] write failed after retry — user record may not be persisted", payload.value.length, "users");
    }
  }
  return result;
}

// ── Telegram notification helper ──────────────────────────────────
export async function sendTelegramNotif(text: string) {
  try {
    const chatRows = await sb("GET", "/settings?key=eq.telegram_admin_chat_id&limit=1");
    const chatId = chatRows[0]?.value || process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ADMIN_IDS;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!chatId || !botToken) return;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    }).catch(() => {});
  } catch {}
}
