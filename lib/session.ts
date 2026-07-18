"use client";

// ── Shared VIP session helpers ──────────────────────────────────────────
// "Ingat Saya" checked  -> localStorage (survives browser restarts) + the
//                          refresh_token is used to silently renew the
//                          access_token in the background, so the user is
//                          never forced to log in again unless they log out.
// "Ingat Saya" unchecked -> sessionStorage only (wiped when the tab/browser
//                          closes), no silent refresh beyond that.

export type VipSessionData = {
  email: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: number; // ms epoch
};

const SESSION_KEY = "vip_session";
const USER_KEY = "vip_user";
const REMEMBER_KEY = "vip_remember";

function isRemembered(): boolean {
  try { return localStorage.getItem(REMEMBER_KEY) !== "0"; } catch { return true; }
}

function activeStore(): Storage {
  return isRemembered() ? localStorage : sessionStorage;
}

export function saveSession(
  user: any,
  tokens: { access_token: string; refresh_token?: string; expires_in?: number },
  remember: boolean = true
) {
  const session: VipSessionData = {
    email: user.email,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in || 3600) * 1000,
  };
  try {
    // Clear both storages so flipping the remember-me choice doesn't leave a stale copy behind
    localStorage.removeItem(SESSION_KEY); localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(USER_KEY);
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
    const store = remember ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
    store.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

// Update just the cached user profile (role/package/etc.) without touching tokens
function patchUser(user: any) {
  try {
    const store = activeStore();
    store.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function readSession(): { session: VipSessionData | null; user: any | null } {
  try {
    const store = activeStore();
    const rawSession = store.getItem(SESSION_KEY);
    const rawUser = store.getItem(USER_KEY);
    if (!rawSession || !rawUser) return { session: null, user: null };
    const session = JSON.parse(rawSession);
    const user = JSON.parse(rawUser);
    if (!session?.access_token || !session?.email || !user?.email) return { session: null, user: null };
    return { session, user };
  } catch {
    return { session: null, user: null };
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(USER_KEY);
  } catch {}
}

// Returns the current user, ALWAYS re-synced live from the server first
// (role/package/VIP status can change any time an admin edits it, so we
// never trust the cached copy for anything beyond avoiding a login flash).
// Rotates the access_token via refresh_token only when it's actually
// expiring soon — resyncing the profile itself is cheap and safe to do
// on every page load via the read-only /api/auth/me endpoint.
export async function ensureFreshSession(): Promise<any | null> {
  const { session, user } = readSession();
  if (!session || !user) return null;

  const expiringSoon = Date.now() > (session.expires_at || 0) - 60_000;

  if (expiringSoon && session.refresh_token) {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      });
      const data = await res.json();
      if (data.success) {
        saveSession(data.user, { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in }, isRemembered());
        return data.user;
      }
    } catch {}
    return null; // refresh genuinely failed — caller should send them to /login
  }

  // Not expiring yet — still resync the live profile (role/package/expiry)
  // against the DB so admin changes reflect immediately, without rotating tokens.
  try {
    const res = await fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: session.access_token }),
    });
    const data = await res.json();
    if (data.success) {
      patchUser(data.user);
      return data.user;
    }
  } catch {}

  // /api/auth/me failed for some transient reason — don't kick the user out,
  // just fall back to the cached profile for this one load.
  return user;
}
