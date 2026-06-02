import { NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8675129710:AAHB_w1AsglY_3ZPhNekfYLoPdOtUeTIAU0";
const ADMIN_IDS_RAW = process.env.TELEGRAM_ADMIN_IDS || "";
const ADMIN_IDS = ADMIN_IDS_RAW.split(",").map(s=>s.trim()).filter(Boolean);
const WA_NUMBER = "6282218723401";

function isAdmin(userId: string|number): boolean {
  if (!ADMIN_IDS_RAW || ADMIN_IDS.length === 0) return true;
  return ADMIN_IDS.includes(String(userId));
}

async function sendMsg(chatId: number|string, text: string, extra: any = {}) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
}

async function sendKeyboard(chatId: number|string, text: string, keyboard: any[][]) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId, text, parse_mode: "HTML",
      reply_markup: { inline_keyboard: keyboard },
    }),
  });
}

async function editMsg(chatId: number|string, msgId: number, text: string, keyboard?: any[][]) {
  if (!BOT_TOKEN) return;
  const body: any = { chat_id: chatId, message_id: msgId, text, parse_mode: "HTML" };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function answerCallback(callbackId: string, text = "") {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  });
}

function fmtRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" }); }
function expiresSoon(dt: string) {
  if (!dt) return false;
  const diff = new Date(dt).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 3600 * 1000;
}
function isExpired(dt: string) { return dt ? new Date(dt) < new Date() : false; }

// User state for multi-step flows
const userState: Map<string, any> = new Map();

// ===== MAIN MENU =====
function mainMenu() {
  return [
    [{ text: "⚡ Sinyal", callback_data: "menu_signals" }, { text: "🔑 Token VIP", callback_data: "menu_tokens" }],
    [{ text: "💰 Harga/Paket", callback_data: "menu_pricing" }, { text: "📢 Live Info", callback_data: "menu_liveinfo" }],
    [{ text: "📈 Top Saham", callback_data: "menu_stocks" }, { text: "🎞️ Ticker", callback_data: "menu_ticker" }],
    [{ text: "💬 Testimoni", callback_data: "menu_testi" }, { text: "📦 Orders", callback_data: "menu_orders" }],
    [{ text: "📊 Statistik", callback_data: "menu_stats" }],
  ];
}

// ===== HANDLERS =====
async function handleSignals(chatId: number|string) {
  const signals = await sb("GET", "/signals?order=created_at.desc&limit=20");
  if (!signals.length) {
    await sendKeyboard(chatId, "⚡ <b>Sinyal</b>\n\nBelum ada sinyal.", [
      [{ text: "➕ Tambah Sinyal", callback_data: "sig_add" }],
      [{ text: "🏠 Menu Utama", callback_data: "main_menu" }],
    ]);
    return;
  }
  let txt = `⚡ <b>SINYAL AKTIF</b> (${signals.length})\n\n`;
  signals.slice(0, 8).forEach((s: any, i: number) => {
    const a = s.action === "BUY" ? "🟢" : s.action === "SELL" ? "🔴" : s.action === "ANTRI" ? "🔵" : "🟡";
    txt += `${a} <b>${s.kode}</b> — ${s.action}\n   Entry: ${s.entry||"—"} | TP: ${s.tp||"—"} | SL: ${s.sl||"—"}\n`;
  });
  if (signals.length > 8) txt += `\n...+${signals.length - 8} lainnya`;
  await sendKeyboard(chatId, txt, [
    [{ text: "➕ Tambah", callback_data: "sig_add" }, { text: "🗑️ Hapus Semua", callback_data: "sig_delall_confirm" }],
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

async function handleTokens(chatId: number|string) {
  const tokens = await sb("GET", "/tokens?order=created_at.desc&limit=50");
  const aktif = tokens.filter((t:any) => t.is_active && !isExpired(t.expired_at || ""));
  const expired = tokens.filter((t:any) => isExpired(t.expired_at || ""));
  const nearExp = tokens.filter((t:any) => expiresSoon(t.expired_at || "") && !isExpired(t.expired_at||""));

  let txt = `🔑 <b>TOKEN VIP</b>\n\nTotal: ${tokens.length}\n✅ Aktif: ${aktif.length}\n⚠️ Segera Exp: ${nearExp.length}\n❌ Expired: ${expired.length}\n\n`;

  // Show recent tokens
  tokens.slice(0, 5).forEach((t:any) => {
    const status = isExpired(t.expired_at||"") ? "❌" : t.is_active ? "✅" : "⏸";
    txt += `${status} <b>${t.name||"—"}</b> (${t.package})\n   ${t.token}\n   Exp: ${t.expired_at ? fmtDate(t.expired_at) : "—"}\n\n`;
  });
  if (tokens.length > 5) txt += `...+${tokens.length-5} lainnya\n\nGunakan /tokens untuk list lengkap`;

  await sendKeyboard(chatId, txt, [
    [{ text: "➕ Buat Token", callback_data: "tok_create" }, { text: "🔍 Cari Token", callback_data: "tok_search" }],
    [{ text: "🗑️ Hapus Expired", callback_data: "tok_del_expired_confirm" }],
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

async function handlePricing(chatId: number|string) {
  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing = rows[0]?.value || [];
  if (!pricing.length) {
    await sendKeyboard(chatId, "💰 <b>Harga/Paket</b>\n\nBelum ada data harga.", [[{ text: "🏠 Menu", callback_data: "main_menu" }]]);
    return;
  }
  let txt = "💰 <b>HARGA PAKET</b>\n\n";
  pricing.forEach((p: any) => {
    const fs = p.flashSale;
    txt += `📦 <b>${p.name}</b>: ${p.priceLabel}`;
    if (fs) txt += ` → <b>${fs.price}</b> (${fs.discount} OFF)`;
    txt += "\n";
  });
  txt += "\n<i>Ketik /flashsale [nama_paket] [persen] [jam_timer] untuk set flash sale</i>";
  txt += "\n<i>Contoh: /flashsale basic 50 24</i>";

  const kboard = pricing.slice(0,6).map((p:any) => [{ text: `✏️ ${p.name}`, callback_data: `pricing_edit_${p.id}` }]);
  kboard.push([{ text: "🏠 Menu", callback_data: "main_menu" }]);
  await sendKeyboard(chatId, txt, kboard);
}

async function handleLiveInfo(chatId: number|string) {
  const rows = await sb("GET", "/liveinfo?id=eq.1");
  const li = rows[0] || { message: "", is_active: false };
  const status = li.is_active ? "🟢 AKTIF" : "🔴 NONAKTIF";
  const txt = `📢 <b>LIVE INFO</b>\n\nStatus: ${status}\n\nPesan:\n${li.message || "(kosong)"}`;
  await sendKeyboard(chatId, txt, [
    [{ text: li.is_active ? "🔴 Matikan" : "🟢 Aktifkan", callback_data: "li_toggle" }],
    [{ text: "✏️ Edit Pesan", callback_data: "li_edit" }],
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

async function handleTicker(chatId: number|string) {
  const rows = await sb("GET", '/settings?key=eq.ticker');
  const ticker = rows[0]?.value || [];
  let txt = "🎞️ <b>TICKER SAHAM</b>\n\n";
  if (!ticker.length) {
    txt += "Belum ada item ticker.\n";
  } else {
    ticker.forEach((t:any, i:number) => {
      const pos = t.change?.startsWith("+");
      txt += `${i+1}. ${t.kode} ${t.price} <b>${t.change}</b>\n`;
    });
  }
  txt += "\n<i>Gunakan /addticker KODE HARGA %CHANGE untuk tambah</i>\n<i>Contoh: /addticker BBCA 9875 +1.28%</i>";
  await sendKeyboard(chatId, txt, [
    [{ text: "🗑️ Reset Ticker", callback_data: "ticker_reset_confirm" }],
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

async function handleOrders(chatId: number|string) {
  const orders = await sb("GET", "/orders?order=created_at.desc&limit=20");
  if (!orders.length) {
    await sendKeyboard(chatId, "📦 <b>ORDERS</b>\n\nBelum ada order.", [[{ text: "🏠 Menu", callback_data: "main_menu" }]]);
    return;
  }
  let txt = `📦 <b>ORDERS TERBARU</b> (${orders.length})\n\n`;
  orders.slice(0, 10).forEach((o: any) => {
    const statusIcon = o.status === "confirmed" ? "✅" : o.status === "cancelled" ? "❌" : "🕐";
    txt += `${statusIcon} <b>${o.id?.slice(-8)}</b>\n   ${o.nama} | ${o.paket} | ${fmtRp(o.harga)}\n   ${fmtDate(o.created_at)}\n\n`;
  });
  await sendKeyboard(chatId, txt, [
    [{ text: "✅ Konfirmasi Order", callback_data: "order_confirm_ask" }],
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

async function handleStats(chatId: number|string) {
  const [signals, tokens, orders] = await Promise.all([
    sb("GET", "/signals?select=id"),
    sb("GET", "/tokens?select=id,is_active,expired_at"),
    sb("GET", "/orders?select=id,status,harga,created_at"),
  ]);
  const aktifTok = tokens.filter((t:any) => t.is_active && !isExpired(t.expired_at||"")).length;
  const pendingOrders = orders.filter((o:any) => o.status === "pending").length;
  const totalRevenue = orders.filter((o:any) => o.status === "confirmed").reduce((sum:number, o:any) => sum + (o.harga||0), 0);
  const today = orders.filter((o:any) => {
    return o.created_at && new Date(o.created_at).toDateString() === new Date().toDateString();
  }).length;

  const txt = `📊 <b>STATISTIK</b>\n\n` +
    `⚡ Sinyal aktif: <b>${signals.length}</b>\n` +
    `🔑 Token total: <b>${tokens.length}</b> (aktif: ${aktifTok})\n` +
    `📦 Order hari ini: <b>${today}</b>\n` +
    `📦 Order pending: <b>${pendingOrders}</b>\n` +
    `💰 Total revenue confirmed: <b>${fmtRp(totalRevenue)}</b>\n`;

  await sendKeyboard(chatId, txt, [[{ text: "🏠 Menu", callback_data: "main_menu" }]]);
}

async function handleTestimonials(chatId: number|string) {
  const testi = await sb("GET", "/testimonials?order=created_at.desc&limit=10").catch(() => []);
  const rows = await sb("GET", '/settings?key=eq.testimonials');
  const settingsTesti = rows[0]?.value || [];
  const allTesti = testi.length ? testi : settingsTesti;

  let txt = `💬 <b>TESTIMONI</b> (${allTesti.length})\n\n`;
  allTesti.slice(0,5).forEach((t:any) => {
    const approved = t.isApproved !== false;
    txt += `${approved ? "✅" : "🔴"} <b>${t.name}</b> (${t.package})\n${t.text?.slice(0,60)}...\n\n`;
  });
  txt += "<i>Gunakan /addtesti Nama|Paket|Rating|Teks untuk tambah</i>";
  await sendKeyboard(chatId, txt, [
    [{ text: "🏠 Menu", callback_data: "main_menu" }],
  ]);
}

// ===== COMMAND HANDLERS =====
async function handleFlashSaleCmd(chatId: number|string, args: string[]) {
  // /flashsale basic 50 24
  if (args.length < 2) {
    await sendMsg(chatId, "❌ Format: /flashsale [paket] [persen] [jam_timer opsional]\nContoh: /flashsale basic 50 24");
    return;
  }
  const [paketId, pctStr, jamStr] = args;
  const pct = parseFloat(pctStr);
  if (isNaN(pct) || pct <= 0 || pct >= 100) { await sendMsg(chatId, "❌ Persen tidak valid (1-99)"); return; }

  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing: any[] = rows[0]?.value || [];
  const pkg = pricing.find((p: any) => p.id?.toLowerCase() === paketId.toLowerCase() || p.name?.toLowerCase() === paketId.toLowerCase());
  if (!pkg) { await sendMsg(chatId, `❌ Paket '${paketId}' tidak ditemukan`); return; }

  const rawPrice = pkg.price || 100000;
  const discounted = Math.round(rawPrice * (1 - pct/100));
  const discountedLabel = "Rp " + discounted.toLocaleString("id-ID");
  const endTime = jamStr && !isNaN(parseFloat(jamStr)) ? new Date(Date.now() + parseFloat(jamStr) * 3600000).toISOString() : "";

  const flashSale = { discount: pct + "%", price: discountedLabel, rawPrice: discounted, endTime };
  const updated = pricing.map((p:any) => p.id === pkg.id ? { ...p, flashSale } : p);

  await sb("POST", "/settings",
    { key: "pricing", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );

  let txt = `✅ <b>Flash Sale Diaktifkan!</b>\n\nPaket: ${pkg.name}\nHarga normal: ${pkg.priceLabel}\nDiskon: ${pct}%\nHarga flash: ${discountedLabel}`;
  if (endTime) txt += `\nTimer: ${parseFloat(jamStr)} jam (berakhir ${new Date(endTime).toLocaleString("id-ID")})`;
  else txt += "\nTanpa timer (manual hapus)";
  await sendMsg(chatId, txt);
}

async function handleRemoveFlashSale(chatId: number|string, args: string[]) {
  // /removefs basic
  const paketId = args[0] || "basic";
  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing: any[] = rows[0]?.value || [];
  const updated = pricing.map((p:any) => {
    if (p.id?.toLowerCase() === paketId.toLowerCase() || p.name?.toLowerCase() === paketId.toLowerCase()) {
      return { ...p, flashSale: null };
    }
    return p;
  });
  await sb("POST", "/settings",
    { key: "pricing", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  await sendMsg(chatId, `✅ Flash sale paket ${paketId} dihapus.`);
}

async function handleAddTicker(chatId: number|string, args: string[]) {
  // /addticker BBCA 9875 +1.28%
  if (args.length < 3) { await sendMsg(chatId, "❌ Format: /addticker KODE HARGA %CHANGE\nContoh: /addticker BBCA 9875 +1.28%"); return; }
  const [kode, price, change] = args;
  const rows = await sb("GET", '/settings?key=eq.ticker');
  const ticker: any[] = rows[0]?.value || [];
  const existing = ticker.findIndex((t:any) => t.kode === kode.toUpperCase());
  const item = { id: Date.now().toString(), kode: kode.toUpperCase(), price, change };
  let updated;
  if (existing >= 0) { updated = [...ticker]; updated[existing] = item; }
  else { updated = [...ticker, item]; }
  await sb("POST", "/settings",
    { key: "ticker", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  await sendMsg(chatId, `✅ Ticker ${kode.toUpperCase()} ${price} ${change} disimpan.`);
}

async function handleAddSignal(chatId: number|string, text: string) {
  // /addsig KODE SAHAM ACTION ENTRY TP SL [NOTES]
  // /addsig BBCA "Bank Central Asia" BUY 9750-9800 10200 9500
  const state = userState.get(String(chatId));
  if (state?.step === "sig_kode") {
    userState.set(String(chatId), { ...state, kode: text.toUpperCase(), step: "sig_saham" });
    await sendMsg(chatId, "📝 Nama saham? (contoh: Bank Central Asia)");
    return;
  }
  if (state?.step === "sig_saham") {
    userState.set(String(chatId), { ...state, saham: text, step: "sig_action" });
    await sendKeyboard(chatId, "📝 Pilih aksi:", [
      [{ text: "🟢 BUY", callback_data: "sigact_BUY" }, { text: "🔴 SELL", callback_data: "sigact_SELL" }],
      [{ text: "🔵 ANTRI", callback_data: "sigact_ANTRI" }, { text: "🟡 HOLD", callback_data: "sigact_HOLD" }],
    ]);
    return;
  }
  if (state?.step === "sig_entry") {
    userState.set(String(chatId), { ...state, entry: text, step: "sig_tp" });
    await sendMsg(chatId, "📝 Target Profit (TP)? (contoh: 10.200 | 10.500)");
    return;
  }
  if (state?.step === "sig_tp") {
    userState.set(String(chatId), { ...state, tp: text, step: "sig_sl" });
    await sendMsg(chatId, "📝 Stop Loss (SL)?");
    return;
  }
  if (state?.step === "sig_sl") {
    userState.set(String(chatId), { ...state, sl: text, step: "sig_notes" });
    await sendMsg(chatId, "📝 Catatan/analisis? (ketik - untuk skip)");
    return;
  }
  if (state?.step === "sig_notes") {
    const notes = text === "-" ? "" : text;
    const newSig = {
      id: Date.now().toString(),
      kode: state.kode, saham: state.saham, action: state.action,
      entry: state.entry, tp: state.tp, sl: state.sl,
      notes, package: ["gold","pro","platinum","elite"],
      created_at: new Date().toISOString(),
    };
    await sb("POST", "/signals", [newSig]);
    userState.delete(String(chatId));
    await sendMsg(chatId, `✅ Sinyal <b>${newSig.kode}</b> (${newSig.action}) berhasil ditambahkan!\n\nEntry: ${newSig.entry}\nTP: ${newSig.tp}\nSL: ${newSig.sl}`);
    return;
  }
}

async function handleTokenCreate(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (state?.step === "tok_email") {
    userState.set(String(chatId), { ...state, email: text, step: "tok_name" });
    await sendMsg(chatId, "👤 Nama user?");
    return;
  }
  if (state?.step === "tok_name") {
    userState.set(String(chatId), { ...state, name: text, step: "tok_package" });
    await sendKeyboard(chatId, "📦 Pilih paket:", [
      [{ text: "Basic", callback_data: "tokpkg_basic" }, { text: "Silver", callback_data: "tokpkg_silver" }],
      [{ text: "Gold", callback_data: "tokpkg_gold" }, { text: "Pro", callback_data: "tokpkg_pro" }],
      [{ text: "Platinum", callback_data: "tokpkg_platinum" }, { text: "Elite", callback_data: "tokpkg_elite" }],
    ]);
    return;
  }
  if (state?.step === "tok_days") {
    const days = parseInt(text);
    if (isNaN(days) || days < 1) { await sendMsg(chatId, "❌ Masukkan jumlah hari yang valid"); return; }
    const expiredAt = new Date(Date.now() + days * 24 * 3600000).toISOString();
    const token = "RC-" + state.package.toUpperCase() + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
    const newTok = {
      id: Date.now().toString(),
      email: state.email, name: state.name, package: state.package,
      token, expired_at: expiredAt, is_active: true,
      created_at: new Date().toISOString(),
    };
    await sb("POST", "/tokens", [newTok]);
    userState.delete(String(chatId));
    await sendMsg(chatId, `✅ <b>Token VIP Dibuat!</b>\n\n👤 Nama: ${newTok.name}\n📧 Email: ${newTok.email}\n📦 Paket: ${newTok.package}\n🔑 Token: <code>${newTok.token}</code>\n📅 Expired: ${fmtDate(expiredAt)}`);
    return;
  }
}

async function handleLiveInfoEdit(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (state?.step === "li_msg") {
    await sb("POST", "/liveinfo",
      { id: 1, message: text, is_active: true, updated_at: new Date().toISOString() },
      { "Prefer": "resolution=merge-duplicates,return=representation" }
    );
    userState.delete(String(chatId));
    await sendMsg(chatId, `✅ Live info diperbarui dan diaktifkan!\n\nPesan:\n${text}`);
    return;
  }
}

async function handleOrderConfirm(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (state?.step === "order_id") {
    const orders = await sb("GET", `/orders?id=eq.${text.trim()}`);
    const order = orders[0];
    if (!order) {
      // Try partial match
      const allOrders = await sb("GET", `/orders?id=like.*${text.trim()}*&limit=1`);
      if (!allOrders.length) { await sendMsg(chatId, "❌ Order tidak ditemukan"); userState.delete(String(chatId)); return; }
      const o = allOrders[0];
      await sb("PATCH", `/orders?id=eq.${o.id}`, { status: "confirmed", confirmed_at: new Date().toISOString() });
      userState.delete(String(chatId));
      await sendMsg(chatId, `✅ Order <b>${o.id}</b> dikonfirmasi!\n👤 ${o.nama} | 📦 ${o.paket} | 💰 ${fmtRp(o.harga)}`);
      return;
    }
    await sb("PATCH", `/orders?id=eq.${order.id}`, { status: "confirmed", confirmed_at: new Date().toISOString() });
    userState.delete(String(chatId));
    await sendMsg(chatId, `✅ Order <b>${order.id}</b> dikonfirmasi!\n👤 ${order.nama} | 📦 ${order.paket} | 💰 ${fmtRp(order.harga)}`);
  }
}

async function handleTokenSearch(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (state?.step === "tok_search") {
    const results = await sb("GET", `/tokens?or=(name.ilike.*${text}*,email.ilike.*${text}*,token.ilike.*${text}*)&limit=5`);
    userState.delete(String(chatId));
    if (!results.length) { await sendMsg(chatId, "❌ Token tidak ditemukan"); return; }
    let txt = `🔍 <b>Hasil Pencarian: "${text}"</b>\n\n`;
    results.forEach((t:any) => {
      const status = isExpired(t.expired_at||"") ? "❌" : t.is_active ? "✅" : "⏸";
      txt += `${status} <b>${t.name}</b> (${t.package})\n📧 ${t.email}\n🔑 <code>${t.token}</code>\n📅 Exp: ${t.expired_at ? fmtDate(t.expired_at) : "—"}\n\n`;
    });
    await sendMsg(chatId, txt);
  }
}

// ===== PROCESS UPDATE =====
async function processUpdate(update: any) {
  const msg = update.message;
  const cb = update.callback_query;

  if (msg) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const text = msg.text || "";
    const stateKey = String(chatId);
    const state = userState.get(stateKey);

    if (!isAdmin(userId)) {
      await sendMsg(chatId, "⛔ Akses ditolak. Kamu bukan admin.");
      return;
    }

    // Check if in multi-step flow
    if (state) {
      if (state.flow === "sig") { await handleAddSignal(chatId, text); return; }
      if (state.flow === "tok") { await handleTokenCreate(chatId, text); return; }
      if (state.flow === "li") { await handleLiveInfoEdit(chatId, text); return; }
      if (state.flow === "order") { await handleOrderConfirm(chatId, text); return; }
      if (state.flow === "search") { await handleTokenSearch(chatId, text); return; }
    }

    if (text.startsWith("/start") || text.startsWith("/menu")) {
      if (!isAdmin(userId)) {
        await sendMsg(chatId, `🤖 <b>RC Admin Bot</b>\n\nID Telegram kamu: <code>${userId}</code>\n\nSampaikan ID ini ke developer untuk akses admin.`);
        return;
      }
      await sendKeyboard(chatId,
        `🏠 <b>RC Admin Bot - Ritel Community</b>\n\nHalo Admin! \nID: <code>${userId}</code>`,
        mainMenu()
      );
      return;
    }

    if (text.startsWith("/flashsale")) {
      const args = text.slice("/flashsale".length).trim().split(/\s+/);
      await handleFlashSaleCmd(chatId, args);
      return;
    }
    if (text.startsWith("/removefs")) {
      const args = text.slice("/removefs".length).trim().split(/\s+/);
      await handleRemoveFlashSale(chatId, args);
      return;
    }
    if (text.startsWith("/addticker")) {
      const args = text.slice("/addticker".length).trim().split(/\s+/);
      await handleAddTicker(chatId, args);
      return;
    }
    if (text.startsWith("/tokens")) {
      await handleTokens(chatId);
      return;
    }
    if (text.startsWith("/stats")) {
      await handleStats(chatId);
      return;
    }
    if (text.startsWith("/help")) {
      const helpTxt = `📖 <b>PERINTAH BOT RC ADMIN</b>\n\n` +
        `/menu — Menu utama\n` +
        `/stats — Statistik\n` +
        `/tokens — List token VIP\n` +
        `/flashsale [paket] [%] [jam] — Set flash sale\n` +
        `  <i>Contoh: /flashsale basic 50 24</i>\n` +
        `/removefs [paket] — Hapus flash sale\n` +
        `/addticker [KODE] [HARGA] [%] — Tambah ticker\n` +
        `  <i>Contoh: /addticker BBCA 9875 +1.28%</i>\n\n` +
        `Atau gunakan menu interaktif dengan /menu`;
      await sendMsg(chatId, helpTxt);
      return;
    }

    // Default: show menu
    await sendKeyboard(chatId, `❓ Ketik /menu untuk menu utama atau /help untuk bantuan.`, [[{ text: "🏠 Menu Utama", callback_data: "main_menu" }]]);
  }

  if (cb) {
    const chatId = cb.message?.chat?.id;
    const msgId = cb.message?.message_id;
    const userId = cb.from?.id;
    const data = cb.data || "";

    await answerCallback(cb.id);

    if (!isAdmin(userId)) {
      await sendMsg(chatId, "⛔ Akses ditolak.");
      return;
    }

    if (data === "main_menu") {
      await editMsg(chatId, msgId, `🏠 <b>RC Admin Bot</b>\n\nPilih menu:`, mainMenu());
      return;
    }

    if (data === "menu_signals") { await handleSignals(chatId); return; }
    if (data === "menu_tokens") { await handleTokens(chatId); return; }
    if (data === "menu_pricing") { await handlePricing(chatId); return; }
    if (data === "menu_liveinfo") { await handleLiveInfo(chatId); return; }
    if (data === "menu_stocks") { await handleTicker(chatId); return; }
    if (data === "menu_ticker") { await handleTicker(chatId); return; }
    if (data === "menu_testi") { await handleTestimonials(chatId); return; }
    if (data === "menu_orders") { await handleOrders(chatId); return; }
    if (data === "menu_stats") { await handleStats(chatId); return; }

    // Signal flows
    if (data === "sig_add") {
      userState.set(String(chatId), { flow: "sig", step: "sig_kode" });
      await sendMsg(chatId, "⚡ <b>Tambah Sinyal</b>\n\nKode saham? (contoh: BBCA)");
      return;
    }
    if (data.startsWith("sigact_")) {
      const action = data.replace("sigact_", "");
      const state = userState.get(String(chatId));
      if (state) {
        userState.set(String(chatId), { ...state, action, step: "sig_entry" });
        await sendMsg(chatId, `📝 Entry range? (contoh: 9.750–9.800)`);
      }
      return;
    }
    if (data === "sig_delall_confirm") {
      await sendKeyboard(chatId, "⚠️ <b>Hapus SEMUA sinyal?</b>\n\nTindakan ini tidak bisa dibatalkan!", [
        [{ text: "✅ Ya, Hapus Semua", callback_data: "sig_delall_do" }],
        [{ text: "❌ Batal", callback_data: "menu_signals" }],
      ]);
      return;
    }
    if (data === "sig_delall_do") {
      await sb("DELETE", "/signals?id=neq.NONE");
      await sendMsg(chatId, "✅ Semua sinyal telah dihapus.");
      return;
    }

    // Token flows
    if (data === "tok_create") {
      userState.set(String(chatId), { flow: "tok", step: "tok_email" });
      await sendMsg(chatId, "🔑 <b>Buat Token VIP</b>\n\nEmail user?");
      return;
    }
    if (data === "tok_search") {
      userState.set(String(chatId), { flow: "search", step: "tok_search" });
      await sendMsg(chatId, "🔍 Cari token — ketik nama, email, atau kode token:");
      return;
    }
    if (data.startsWith("tokpkg_")) {
      const pkg = data.replace("tokpkg_", "");
      const state = userState.get(String(chatId));
      if (state) {
        userState.set(String(chatId), { ...state, package: pkg, step: "tok_days" });
        await sendMsg(chatId, `📅 Berapa hari aktif? (contoh: 30)`);
      }
      return;
    }
    if (data === "tok_del_expired_confirm") {
      await sendKeyboard(chatId, "⚠️ Hapus semua token expired?", [
        [{ text: "✅ Ya", callback_data: "tok_del_expired_do" }],
        [{ text: "❌ Batal", callback_data: "menu_tokens" }],
      ]);
      return;
    }
    if (data === "tok_del_expired_do") {
      const tokens = await sb("GET", "/tokens?select=id,expired_at");
      const expiredIds = tokens.filter((t:any) => isExpired(t.expired_at||"")).map((t:any) => t.id);
      for (const id of expiredIds) {
        await sb("DELETE", `/tokens?id=eq.${id}`);
      }
      await sendMsg(chatId, `✅ ${expiredIds.length} token expired dihapus.`);
      return;
    }

    // Live info
    if (data === "li_toggle") {
      const rows = await sb("GET", "/liveinfo?id=eq.1");
      const li = rows[0] || { message: "", is_active: false };
      const newActive = !li.is_active;
      await sb("POST", "/liveinfo",
        { id: 1, message: li.message || "", is_active: newActive, updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendMsg(chatId, `✅ Live info ${newActive ? "DIAKTIFKAN" : "DIMATIKAN"}.`);
      return;
    }
    if (data === "li_edit") {
      userState.set(String(chatId), { flow: "li", step: "li_msg" });
      await sendMsg(chatId, "📝 Ketik pesan live info baru:");
      return;
    }

    // Ticker
    if (data === "ticker_reset_confirm") {
      await sendKeyboard(chatId, "⚠️ Reset ticker ke default?", [
        [{ text: "✅ Ya", callback_data: "ticker_reset_do" }],
        [{ text: "❌ Batal", callback_data: "menu_ticker" }],
      ]);
      return;
    }
    if (data === "ticker_reset_do") {
      await sb("POST", "/settings",
        { key: "ticker", value: [], updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendMsg(chatId, "✅ Ticker direset ke mode live.");
      return;
    }

    // Orders
    if (data === "order_confirm_ask") {
      userState.set(String(chatId), { flow: "order", step: "order_id" });
      await sendMsg(chatId, "📦 Masukkan ID order yang akan dikonfirmasi:");
      return;
    }

    // Pricing edit
    if (data.startsWith("pricing_edit_")) {
      const pkgId = data.replace("pricing_edit_", "");
      const rows = await sb("GET", '/settings?key=eq.pricing');
      const pricing: any[] = rows[0]?.value || [];
      const pkg = pricing.find((p:any) => p.id === pkgId);
      if (!pkg) { await sendMsg(chatId, "❌ Paket tidak ditemukan"); return; }
      await sendMsg(chatId, 
        `✏️ <b>Edit Paket ${pkg.name}</b>\n\nHarga: ${pkg.priceLabel}\n\nGunakan command:\n/flashsale ${pkg.id} [persen] [jam]\nContoh: /flashsale ${pkg.id} 50 24\n\nUntuk hapus flash sale:\n/removefs ${pkg.id}`
      );
      return;
    }
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    await processUpdate(update);
  } catch (e) {
    console.error("Telegram webhook error:", e);
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "Telegram Bot RC Admin webhook active" });
}

