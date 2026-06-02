const SUPABASE_URL = process.env.SUPABASE_URL || "https://qsbpiijaxxjtnhejcepb.supabase.co";
// Prioritaskan SUPABASE_SERVICE_ROLE_KEY (service_role), fallback ke SUPABASE_SERVICE_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

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
  if (!text) return [];
  try { return JSON.parse(text); } catch { return []; }
}
