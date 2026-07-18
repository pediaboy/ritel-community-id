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

// Returns the current user, silently refreshing the access_token first if it's
// expired (or about to be). Returns null if there's no usable session at all.
export async function ensureFreshSession(): Promise<any | null> {
  const { session, user } = readSession();
  if (!session || !user) return null;

  const expiringSoon = Date.now() > (session.expires_at || 0) - 60_000;
  if (!expiringSoon) return user;
  if (!session.refresh_token) return user; // legacy session w/o refresh_token — let it ride

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
