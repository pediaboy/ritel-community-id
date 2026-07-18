import { NextResponse } from "next/server";
import { sb, getVipUsers, saveVipUsers } from "@/lib/supabase";

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
    [{ text: " Sinyal", callback_data: "menu_signals" }, { text: "User VIP", callback_data: "menu_tokens" }],
    [{ text: " Harga/Paket", callback_data: "menu_pricing" }, { text: " Live Info", callback_data: "menu_liveinfo" }],
    [{ text: " Top Saham", callback_data: "menu_stocks" }, { text: " Ticker", callback_data: "menu_ticker" }],
    [{ text: " Testimoni", callback_data: "menu_testi" }, { text: " Orders", callback_data: "menu_orders" }],
    [{ text: " Statistik", callback_data: "menu_stats" }, { text: " Channels", callback_data: "menu_channels" }],
  ];
}

// ===== BROADCAST CHANNELS (auto-forward) =====
async function getChannels(): Promise<any[]> {
  const rows = await sb("GET", "/settings?key=eq.broadcast_channels");
  return rows[0]?.value || [];
}

async function saveChannels(list: any[]) {
  await sb("POST", "/settings",
    { key: "broadcast_channels", value: list, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
}

async function broadcastToChannels(text: string) {
  const channels = await getChannels();
  for (const c of channels) {
    try {
      await sendMsg(c.id, text);
    } catch (e) {
      // ignore individual failures
    }
  }
}

async function handleChannels(chatId: number|string) {
  const channels = await getChannels();
  let txt = " <b>CHANNELS / GRUP TERDAFTAR</b>\n\n";
  if (!channels.length) {
    txt += "Belum ada channel/grup terdaftar.\n\n";
  } else {
    channels.forEach((c:any, i:number) => {
      txt += `${i+1}. ${c.type === "channel" ? "" : ""} <b>${c.title}</b>\n   ID: <code>${c.id}</code>\n\n`;
    });
  }
  txt += "<b>Cara daftar channel/grup baru:</b>\n" +
    "1. Buat channel/grup di Telegram\n" +
    "2. Tambahkan bot ini sebagai <b>admin</b> di sana (lewat menu Add Member/Admin Telegram — bot tidak bisa join sendiri lewat link, ini batasan resmi Telegram Bot API)\n" +
    "3. Begitu ditambahkan, bot otomatis terdaftar di sini dan sinyal baru akan auto-forward ke situ ";

  const delBtns = channels.map((c:any) => [{ text: ` Hapus ${c.title}`, callback_data: `chan_del_${c.id}` }]);
  await sendKeyboard(chatId, txt, [
    ...delBtns,
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== SINYAL =====
async function handleSignals(chatId: number|string, page = 0) {
  const signals = await sb("GET", "/signals?order=created_at.desc&limit=100");
  if (!signals.length) {
    await sendKeyboard(chatId, " <b>Sinyal</b>\n\nBelum ada sinyal.", [
      [{ text: " Tambah Sinyal", callback_data: "sig_add" }],
      [{ text: " Menu Utama", callback_data: "main_menu" }],
    ]);
    return;
  }
  const perPage = 5;
  const totalPages = Math.ceil(signals.length / perPage);
  const pageSigs = signals.slice(page * perPage, (page+1) * perPage);

  let txt = ` <b>SINYAL</b> (${signals.length} total) — Hal ${page+1}/${totalPages}\n\n`;
  pageSigs.forEach((s: any) => {
    const a = s.action === "BUY" ? "" : s.action === "SELL" ? "" : s.action === "ANTRI" ? "" : "";
    txt += `${a} <b>${s.kode}</b> — ${s.action}\n   Entry: ${s.entry||"—"} | TP: ${s.tp||"—"} | SL: ${s.sl||"—"}\n`;
    if (s.notes) txt += `    ${s.notes}\n`;
    txt += "\n";
  });

  const editBtns = pageSigs.map((s:any) => [
    { text: ` ${s.kode}`, callback_data: `sig_edit_${s.id}` },
    { text: ` ${s.kode}`, callback_data: `sig_del_${s.id}` },
  ]);

  const navBtns = [];
  if (page > 0) navBtns.push({ text: "◀ Prev", callback_data: `sig_page_${page-1}` });
  if (page < totalPages-1) navBtns.push({ text: "Next ▶", callback_data: `sig_page_${page+1}` });

  const keyboard: any[][] = [
    ...editBtns,
    ...(navBtns.length ? [navBtns] : []),
    [{ text: " Tambah", callback_data: "sig_add" }, { text: " Hapus Semua", callback_data: "sig_delall_confirm" }],
    [{ text: " Menu", callback_data: "main_menu" }],
  ];
  await sendKeyboard(chatId, txt, keyboard);
}

// ===== TOKEN =====
async function handleTokens(chatId: number|string, page = 0) {
  const users = await getVipUsers();
  // Sort by created_at desc
  users.sort((a: any, b: any) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });

  const aktif = users.filter((u: any) => u.role === "vip" && !isExpired(u.expired_at || ""));
  const expired = users.filter((u: any) => isExpired(u.expired_at || ""));
  const nearExp = users.filter((u: any) => expiresSoon(u.expired_at || "") && !isExpired(u.expired_at || ""));

  const perPage = 5;
  const totalPages = Math.ceil(users.length / perPage) || 1;
  const pageUsers = users.slice(page * perPage, (page + 1) * perPage);

  let txt = `<b>USER VIP</b> — Hal ${page+1}/${totalPages}\n${aktif.length} Aktif | ${nearExp.length} Segera Exp | ${expired.length} Expired\n\n`;
  pageUsers.forEach((u: any) => {
    const status = isExpired(u.expired_at || "") ? "[EXPIRED]" : u.role === "vip" ? "[VIP]" : "[FREE]";
    txt += `${status} <b>${u.name || "—"}</b> (${u.subscription || "basic"})\nEmail: ${u.email || "—"}\nExp: ${u.expired_at ? fmtDate(u.expired_at) : "—"}\n\n`;
  });

  const actionBtns = pageUsers.map((u: any) => [
    { text: u.role === "vip" ? `Suspend ${u.name?.slice(0, 10) || u.email?.slice(0, 10)}` : `Activate ${u.name?.slice(0, 10) || u.email?.slice(0, 10)}`, callback_data: `tok_toggle_${u.email}` },
    { text: "Hapus", callback_data: `tok_del_${u.email}` },
  ]);

  const navBtns = [];
  if (page > 0) navBtns.push({ text: "Prev", callback_data: `tok_page_${page-1}` });
  if (page < totalPages-1) navBtns.push({ text: "Next", callback_data: `tok_page_${page+1}` });

  const keyboard: any[][] = [
    ...actionBtns,
    ...(navBtns.length ? [navBtns] : []),
    [{ text: "Buat User VIP", callback_data: "tok_create" }, { text: "Cari", callback_data: "tok_search" }],
    [{ text: "Downgrade Expired", callback_data: "tok_del_expired_confirm" }],
    [{ text: "Menu", callback_data: "main_menu" }],
  ];
  await sendKeyboard(chatId, txt, keyboard);
}

// ===== PRICING =====
async function handlePricing(chatId: number|string) {
  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing = rows[0]?.value || [];
  if (!pricing.length) {
    await sendKeyboard(chatId, " <b>Harga/Paket</b>\n\nBelum ada data harga.", [[{ text: " Menu", callback_data: "main_menu" }]]);
    return;
  }
  let txt = " <b>HARGA PAKET</b>\n\n";
  pricing.forEach((p: any) => {
    const fs = p.flashSale;
    txt += ` <b>${p.name}</b>: ${p.priceLabel}`;
    if (fs) txt += `  <b>${fs.price}</b> (${fs.discount} OFF)`;
    txt += "\n";
  });
  txt += "\n<i>Tap paket untuk edit harga, deskripsi, fitur, atau flash sale</i>";

  const kboard = pricing.map((p:any) => [{ text: ` ${p.name} — ${p.priceLabel}`, callback_data: `pricing_edit_${p.id}` }]);
  kboard.push([{ text: " Menu", callback_data: "main_menu" }]);
  await sendKeyboard(chatId, txt, kboard);
}

// ===== LIVE INFO =====
async function handleLiveInfo(chatId: number|string) {
  const rows = await sb("GET", "/liveinfo?id=eq.1");
  const li = rows[0] || { message: "", is_active: false };
  const status = li.is_active ? " AKTIF" : " NONAKTIF";
  const txt = ` <b>LIVE INFO</b>\n\nStatus: ${status}\n\nPesan:\n${li.message || "(kosong)"}`;
  await sendKeyboard(chatId, txt, [
    [{ text: li.is_active ? " Matikan" : " Aktifkan", callback_data: "li_toggle" }],
    [{ text: " Edit Pesan", callback_data: "li_edit" }],
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== TICKER =====
async function handleTicker(chatId: number|string) {
  const rows = await sb("GET", '/settings?key=eq.ticker');
  const ticker = rows[0]?.value || [];
  let txt = " <b>TICKER SAHAM</b>\n\n";
  if (!ticker.length) {
    txt += "Belum ada item ticker.\n\n";
  } else {
    ticker.forEach((t:any, i:number) => {
      txt += `${i+1}. <b>${t.kode}</b> ${t.price} <code>${t.change}</code>\n`;
    });
  }
  txt += "\n<i>/addticker KODE HARGA %CHANGE — untuk tambah</i>";

  const delBtns = ticker.map((t:any) => [{ text: ` Hapus ${t.kode}`, callback_data: `ticker_del_${t.kode}` }]);
  await sendKeyboard(chatId, txt, [
    ...delBtns,
    [{ text: " Tambah Ticker", callback_data: "ticker_add" }],
    [{ text: " Reset Semua", callback_data: "ticker_reset_confirm" }],
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== TOP SAHAM (STOCKS) =====
async function handleStocks(chatId: number|string) {
  const rows = await sb("GET", '/settings?key=eq.top_saham');
  const stocks = rows[0]?.value || [];
  let txt = " <b>TOP SAHAM</b>\n\n";
  if (!stocks.length) {
    txt += "Belum ada data top saham.\n";
  } else {
    stocks.forEach((s:any, i:number) => {
      txt += `${i+1}. <b>${s.kode}</b> — ${s.nama}\n   Target: ${s.target||"—"} | Rekomendasi: ${s.rek||"—"}\n\n`;
    });
  }

  const delBtns = stocks.map((s:any) => [{ text: ` Hapus ${s.kode}`, callback_data: `stock_del_${s.kode}` }]);
  await sendKeyboard(chatId, txt, [
    ...delBtns,
    [{ text: " Tambah Saham", callback_data: "stock_add" }],
    [{ text: " Hapus Semua", callback_data: "stock_delall_confirm" }],
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== ORDERS =====
async function handleOrders(chatId: number|string, page = 0) {
  const orders = await sb("GET", "/orders?order=created_at.desc&limit=200");
  if (!orders.length) {
    await sendKeyboard(chatId, " <b>ORDERS</b>\n\nBelum ada order.", [[{ text: " Menu", callback_data: "main_menu" }]]);
    return;
  }
  const perPage = 5;
  const totalPages = Math.ceil(orders.length / perPage);
  const pageOrds = orders.slice(page * perPage, (page+1) * perPage);

  let txt = ` <b>ORDERS</b> (${orders.length}) — Hal ${page+1}/${totalPages}\n\n`;
  pageOrds.forEach((o: any) => {
    const ic = o.status === "confirmed" ? "" : o.status === "cancelled" ? "" : "";
    txt += `${ic} <b>${o.id?.slice(-8)}</b> — ${o.paket}\n   ${o.nama} | ${fmtRp(o.harga||0)}\n   ${o.hp||""} | ${fmtDate(o.created_at)}\n\n`;
  });

  const orderBtns = pageOrds.filter((o:any) => o.status !== "confirmed").map((o:any) => [
    { text: ` Konfirmasi ${o.id?.slice(-6)}`, callback_data: `order_confirm_${o.id}` },
    { text: ` Cancel`, callback_data: `order_cancel_${o.id}` },
  ]);

  const navBtns = [];
  if (page > 0) navBtns.push({ text: "◀ Prev", callback_data: `ord_page_${page-1}` });
  if (page < totalPages-1) navBtns.push({ text: "Next ▶", callback_data: `ord_page_${page+1}` });

  await sendKeyboard(chatId, txt, [
    ...orderBtns,
    ...(navBtns.length ? [navBtns] : []),
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== STATS =====
async function handleStats(chatId: number|string) {
  const [signals, users, orders] = await Promise.all([
    sb("GET", "/signals?select=id"),
    getVipUsers(),
    sb("GET", "/orders?select=id,status,harga,created_at"),
  ]);
  const totalUsers = users.length;
  const activeVip = users.filter((u: any) => u.role === "vip" && !isExpired(u.expired_at || "")).length;
  const pendingOrders = orders.filter((o:any) => o.status === "pending").length;
  const totalRevenue = orders.filter((o:any) => o.status === "confirmed").reduce((sum:number, o:any) => sum + (o.harga||0), 0);
  const today = orders.filter((o:any) => o.created_at && new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  const txt = `<b>STATISTIK RC</b>\n\n` +
    `Sinyal aktif: <b>${signals.length}</b>\n` +
    `VIP Users: <b>${totalUsers}</b> (aktif: ${activeVip})\n` +
    `Order hari ini: <b>${today}</b>\n` +
    `Order pending: <b>${pendingOrders}</b>\n` +
    `Revenue confirmed: <b>${fmtRp(totalRevenue)}</b>`;

  await sendKeyboard(chatId, txt, [[{ text: "Menu", callback_data: "main_menu" }]]);
}

// ===== TESTIMONI =====
async function handleTestimonials(chatId: number|string, page = 0) {
  const testi = await sb("GET", "/testimonials?order=created_at.desc&limit=100").catch(() => []);
  const rows = await sb("GET", '/settings?key=eq.testimonials');
  const settingsTesti = rows[0]?.value || [];
  const allTesti = testi.length ? testi : settingsTesti;

  const perPage = 5;
  const totalPages = Math.ceil(allTesti.length / perPage) || 1;
  const pageTesti = allTesti.slice(page * perPage, (page+1) * perPage);

  let txt = ` <b>TESTIMONI</b> (${allTesti.length}) — Hal ${page+1}/${totalPages}\n\n`;
  pageTesti.forEach((t:any, i:number) => {
    const approved = t.isApproved !== false;
    txt += `${approved ? "" : ""} <b>${t.name}</b> (${t.package || t.paket})\n ${t.rating||5} — ${(t.text||t.teks||"").slice(0,80)}\n\n`;
  });

  const testiBtns = pageTesti.map((t:any) => [
    { text: `${t.isApproved !== false ? " Sembunyikan" : " Tampilkan"} ${t.name?.slice(0,10)}`, callback_data: `testi_toggle_${t.id}` },
    { text: ` Hapus`, callback_data: `testi_del_${t.id}` },
  ]);

  const navBtns = [];
  if (page > 0) navBtns.push({ text: "◀ Prev", callback_data: `testi_page_${page-1}` });
  if (page < totalPages-1) navBtns.push({ text: "Next ▶", callback_data: `testi_page_${page+1}` });

  await sendKeyboard(chatId, txt, [
    ...testiBtns,
    ...(navBtns.length ? [navBtns] : []),
    [{ text: " Tambah Testimoni", callback_data: "testi_add" }],
    [{ text: " Menu", callback_data: "main_menu" }],
  ]);
}

// ===== COMMAND HANDLERS =====
async function handleFlashSaleCmd(chatId: number|string, args: string[]) {
  if (args.length < 2) {
    await sendMsg(chatId, " Format: /flashsale [paket] [persen] [jam]\nContoh: /flashsale basic 50 24");
    return;
  }
  const [paketId, pctStr, hoursStr] = args;
  const pct = parseInt(pctStr);
  const hours = parseInt(hoursStr || "24");
  if (isNaN(pct) || pct <= 0 || pct >= 100) { await sendMsg(chatId, " Persen harus 1-99"); return; }

  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing: any[] = rows[0]?.value || [];
  const pkg = pricing.find((p: any) => p.id?.toLowerCase() === paketId.toLowerCase() || p.name?.toLowerCase() === paketId.toLowerCase());
  if (!pkg) { await sendMsg(chatId, ` Paket "${paketId}" tidak ditemukan`); return; }

  const rawPrice = pkg.price || parseInt(pkg.priceLabel?.replace(/\D/g,"") || "0");
  const salePrice = Math.round(rawPrice * (1 - pct/100));
  const endTime = new Date(Date.now() + hours * 3600000).toISOString();
  const flashSale = { price: fmtRp(salePrice), rawPrice: salePrice, discount: `${pct}%`, endTime };

  const updated = pricing.map((p:any) => p.id === pkg.id ? { ...p, flashSale } : p);
  await sb("POST", "/settings",
    { key: "pricing", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  await sendMsg(chatId, ` Flash sale <b>${pkg.name}</b> aktif!\n\nHarga: ${fmtRp(rawPrice)}  <b>${fmtRp(salePrice)}</b> (${pct}% OFF)\nBerakhir: ${fmtDate(endTime)}`);
}

async function handleRemoveFlashSale(chatId: number|string, args: string[]) {
  const paketId = args[0];
  const rows = await sb("GET", '/settings?key=eq.pricing');
  const pricing: any[] = rows[0]?.value || [];
  const updated = pricing.map((p:any) => {
    if (p.id?.toLowerCase() === paketId?.toLowerCase() || p.name?.toLowerCase() === paketId?.toLowerCase()) {
      const { flashSale, ...rest } = p; return rest;
    }
    return p;
  });
  await sb("POST", "/settings",
    { key: "pricing", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  await sendMsg(chatId, ` Flash sale dihapus.`);
}

async function handleAddTicker(chatId: number|string, args: string[]) {
  if (args.length < 3) { await sendMsg(chatId, " Format: /addticker KODE HARGA %CHANGE\nContoh: /addticker BBCA 9875 +1.28%"); return; }
  const [kode, price, change] = args;
  const item = { kode: kode.toUpperCase(), price, change };
  const rows = await sb("GET", '/settings?key=eq.ticker');
  const ticker: any[] = rows[0]?.value || [];
  const existing = ticker.findIndex((t:any) => t.kode === kode.toUpperCase());
  let updated: any[];
  if (existing >= 0) { updated = [...ticker]; updated[existing] = item; }
  else { updated = [...ticker, item]; }
  await sb("POST", "/settings",
    { key: "ticker", value: updated, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  await sendMsg(chatId, ` Ticker <b>${kode.toUpperCase()}</b> ${existing >= 0 ? "diupdate" : "ditambah"}!\n${price} ${change}`);
}

// ===== MULTI-STEP FLOWS =====
async function handleAddSignal(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "sig_kode") {
    userState.set(String(chatId), { ...state, kode: text.toUpperCase(), step: "sig_saham" });
    await sendMsg(chatId, " Nama saham? (contoh: Bank Central Asia)");
    return;
  }
  if (state.step === "sig_saham") {
    userState.set(String(chatId), { ...state, saham: text, step: "sig_action" });
    await sendKeyboard(chatId, `Aksi untuk <b>${state.kode}</b>?`, [
      [{ text: " BUY", callback_data: "sigact_BUY" }, { text: " SELL", callback_data: "sigact_SELL" }],
      [{ text: " ANTRI", callback_data: "sigact_ANTRI" }, { text: " HOLD", callback_data: "sigact_HOLD" }],
    ]);
    return;
  }
  if (state.step === "sig_entry") {
    userState.set(String(chatId), { ...state, entry: text, step: "sig_tp" });
    await sendMsg(chatId, " Target Profit (TP)? (contoh: 10.200 atau . untuk skip)");
    return;
  }
  if (state.step === "sig_tp") {
    userState.set(String(chatId), { ...state, tp: text === "." ? "" : text, step: "sig_sl" });
    await sendMsg(chatId, " Stop Loss (SL)? (contoh: 9.400 atau . untuk skip)");
    return;
  }
  if (state.step === "sig_sl") {
    userState.set(String(chatId), { ...state, sl: text === "." ? "" : text, step: "sig_notes" });
    await sendMsg(chatId, " Catatan tambahan? (atau . untuk skip)");
    return;
  }
  if (state.step === "sig_notes") {
    const notes = text === "." ? "" : text;
    const newSig = {
      kode: state.kode, saham: state.saham, action: state.action,
      entry: state.entry, tp: state.tp, sl: state.sl, notes,
      created_at: new Date().toISOString(),
    };
    await sb("POST", "/signals", [newSig]);
    userState.delete(String(chatId));
    await sendKeyboard(chatId,
      ` Sinyal <b>${state.kode}</b> berhasil ditambah!\n\n${state.action} | Entry: ${state.entry} | TP: ${state.tp||"—"} | SL: ${state.sl||"—"}`,
      [[{ text: " Lihat Sinyal", callback_data: "menu_signals" }, { text: " Menu", callback_data: "main_menu" }]]
    );
    const bIcon = state.action === "BUY" ? "" : state.action === "SELL" ? "" : state.action === "ANTRI" ? "" : "";
    await broadcastToChannels(
      `${bIcon} <b>SINYAL BARU — ${state.kode}</b> (${state.action})\n\n` +
      `Entry: ${state.entry||"—"} | TP: ${state.tp||"—"} | SL: ${state.sl||"—"}\n` +
      (notes ? ` ${notes}\n\n` : "\n") +
      ` Ritel Community — auto signal`
    );
    return;
  }
}

async function handleTokenCreate(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "tok_email") {
    userState.set(String(chatId), { ...state, email: text.trim(), step: "tok_name" });
    await sendMsg(chatId, "Nama user?");
    return;
  }
  if (state.step === "tok_name") {
    userState.set(String(chatId), { ...state, name: text.trim(), step: "tok_package" });
    await sendKeyboard(chatId, "Pilih paket:", [
      [{ text: "Basic", callback_data: "tokpkg_basic" }, { text: "Silver", callback_data: "tokpkg_silver" }],
      [{ text: "Gold", callback_data: "tokpkg_gold" }, { text: "Pro", callback_data: "tokpkg_pro" }],
      [{ text: "Platinum", callback_data: "tokpkg_platinum" }, { text: "Elite", callback_data: "tokpkg_elite" }],
    ]);
    return;
  }
}

async function handleLiveInfoEdit(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state || state.step !== "li_msg") return;
  await sb("POST", "/liveinfo",
    { id: 1, message: text, is_active: true, updated_at: new Date().toISOString() },
    { "Prefer": "resolution=merge-duplicates,return=representation" }
  );
  userState.delete(String(chatId));
  await sendKeyboard(chatId, ` Live info diupdate dan diaktifkan!\n\n${text}`,
    [[{ text: " Live Info", callback_data: "menu_liveinfo" }, { text: " Menu", callback_data: "main_menu" }]]
  );
}

async function handleOrderConfirm(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "order_id") {
    const allOrders = await sb("GET", `/orders?id=like.%25${text}%25`);
    if (!allOrders.length) { await sendMsg(chatId, " Order tidak ditemukan"); userState.delete(String(chatId)); return; }
    const ord = allOrders[0];
    await sb("PATCH", `/orders?id=eq.${ord.id}`, { status: "confirmed" });
    userState.delete(String(chatId));
    await sendMsg(chatId, ` Order <b>${ord.id?.slice(-8)}</b> dikonfirmasi!\n${ord.nama} | ${ord.paket}`);
    return;
  }
}

async function handleTokenSearch(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state || state.step !== "tok_search") return;
  userState.delete(String(chatId));
  
  const users = await getVipUsers();
  const query = text.toLowerCase();
  const results = users.filter((u: any) => 
    (u.email && u.email.toLowerCase().includes(query)) || 
    (u.name && u.name.toLowerCase().includes(query))
  );

  if (!results.length) { await sendMsg(chatId, "User tidak ditemukan"); return; }
  let txt = `<b>Hasil: "${text}"</b>\n\n`;
  results.forEach((u: any) => {
    const status = isExpired(u.expired_at || "") ? "[EXPIRED]" : u.role === "vip" ? "[VIP]" : "[FREE]";
    txt += `${status} <b>${u.name || "—"}</b> (${u.subscription || "basic"})\nEmail: ${u.email || "—"}\nExp: ${u.expired_at ? fmtDate(u.expired_at) : "—"}\n\n`;
  });
  await sendKeyboard(chatId, txt, [
    [{ text: "Semua User", callback_data: "menu_tokens" }],
    [{ text: "Menu", callback_data: "main_menu" }],
  ]);
}

async function handlePricingEdit(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "pe_price") {
    userState.set(String(chatId), { ...state, priceLabel: text, step: "pe_period" });
    await sendMsg(chatId, ` Harga: <b>${text}</b>\n\nKetik <b>periode</b> (contoh: /bulan, /tahun, atau . untuk skip):`);
    return;
  }
  if (state.step === "pe_period") {
    const period = text === "." ? state.origPeriod : text;
    userState.set(String(chatId), { ...state, period, step: "pe_desc" });
    await sendMsg(chatId, ` Periode: ${period}\n\nKetik <b>deskripsi</b> paket (atau . untuk skip):`);
    return;
  }
  if (state.step === "pe_desc") {
    const desc = text === "." ? state.origDesc : text;
    userState.set(String(chatId), { ...state, description: desc, step: "pe_confirm" });
    await sendKeyboard(chatId,
      ` <b>Konfirmasi Edit ${state.pkgName}</b>\n\nHarga: <b>${state.priceLabel}</b>${state.period}\nDeskripsi: ${desc?.slice(0,100)}\n\nSimpan?`,
      [[{ text: " Simpan", callback_data: "pe_save" }, { text: " Batal", callback_data: "pe_cancel" }]]
    );
    return;
  }
}

async function handleSignalEdit(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "se_entry") {
    userState.set(String(chatId), { ...state, entry: text === "." ? state.origEntry : text, step: "se_tp" });
    await sendMsg(chatId, ` Entry: ${state.entry}\n\nKetik <b>TP baru</b> (atau . untuk skip):`);
    return;
  }
  if (state.step === "se_tp") {
    userState.set(String(chatId), { ...state, tp: text === "." ? state.origTp : text, step: "se_sl" });
    await sendMsg(chatId, ` TP: ${state.tp}\n\nKetik <b>SL baru</b> (atau . untuk skip):`);
    return;
  }
  if (state.step === "se_sl") {
    userState.set(String(chatId), { ...state, sl: text === "." ? state.origSl : text, step: "se_notes" });
    await sendMsg(chatId, ` SL: ${state.sl}\n\nKetik <b>catatan</b> (atau . untuk skip):`);
    return;
  }
  if (state.step === "se_notes") {
    const notes = text === "." ? state.origNotes : text;
    userState.set(String(chatId), { ...state, notes, step: "se_confirm" });
    await sendKeyboard(chatId,
      ` <b>Konfirmasi Edit ${state.kode}</b>\n\nEntry: ${state.entry||"—"}\nTP: ${state.tp||"—"} | SL: ${state.sl||"—"}\nNotes: ${notes||"—"}\n\nSimpan?`,
      [[{ text: " Simpan", callback_data: "se_save" }, { text: " Batal", callback_data: "se_cancel" }]]
    );
    return;
  }
}

async function handleAddTicker_flow(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "ticker_kode") {
    userState.set(String(chatId), { ...state, kode: text.toUpperCase(), step: "ticker_price" });
    await sendMsg(chatId, " Harga sekarang? (contoh: 9875)");
    return;
  }
  if (state.step === "ticker_price") {
    userState.set(String(chatId), { ...state, price: text, step: "ticker_change" });
    await sendMsg(chatId, " Perubahan %? (contoh: +1.28% atau -0.5%)");
    return;
  }
  if (state.step === "ticker_change") {
    const item = { kode: state.kode, price: state.price, change: text };
    const rows = await sb("GET", '/settings?key=eq.ticker');
    const ticker: any[] = rows[0]?.value || [];
    const existing = ticker.findIndex((t:any) => t.kode === state.kode);
    let updated: any[];
    if (existing >= 0) { updated = [...ticker]; updated[existing] = item; }
    else { updated = [...ticker, item]; }
    await sb("POST", "/settings",
      { key: "ticker", value: updated, updated_at: new Date().toISOString() },
      { "Prefer": "resolution=merge-duplicates,return=representation" }
    );
    userState.delete(String(chatId));
    await sendKeyboard(chatId, ` Ticker <b>${state.kode}</b> ${existing >= 0 ? "diupdate" : "ditambah"}!\n${state.price} ${text}`, [
      [{ text: " Lihat Ticker", callback_data: "menu_ticker" }, { text: " Menu", callback_data: "main_menu" }]
    ]);
    return;
  }
}

async function handleAddStock_flow(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "stock_kode") {
    userState.set(String(chatId), { ...state, kode: text.toUpperCase(), step: "stock_nama" });
    await sendMsg(chatId, " Nama perusahaan? (contoh: Bank Central Asia)");
    return;
  }
  if (state.step === "stock_nama") {
    userState.set(String(chatId), { ...state, nama: text, step: "stock_target" });
    await sendMsg(chatId, " Target harga? (contoh: 10.500 atau . untuk skip)");
    return;
  }
  if (state.step === "stock_target") {
    const target = text === "." ? "" : text;
    userState.set(String(chatId), { ...state, target, step: "stock_rek" });
    await sendMsg(chatId, " Rekomendasi? (BUY/HOLD/SELL atau . untuk skip)");
    return;
  }
  if (state.step === "stock_rek") {
    const rek = text === "." ? "" : text;
    const item = { kode: state.kode, nama: state.nama, target: state.target, rek };
    const rows = await sb("GET", '/settings?key=eq.top_saham');
    const stocks: any[] = rows[0]?.value || [];
    const existing = stocks.findIndex((s:any) => s.kode === state.kode);
    let updated: any[];
    if (existing >= 0) { updated = [...stocks]; updated[existing] = item; }
    else { updated = [...stocks, item]; }
    await sb("POST", "/settings",
      { key: "top_saham", value: updated, updated_at: new Date().toISOString() },
      { "Prefer": "resolution=merge-duplicates,return=representation" }
    );
    userState.delete(String(chatId));
    await sendKeyboard(chatId, ` <b>${state.kode}</b> berhasil ditambah ke Top Saham!\n${state.nama} | Target: ${state.target||"—"} | ${rek||"—"}`, [
      [{ text: " Top Saham", callback_data: "menu_stocks" }, { text: " Menu", callback_data: "main_menu" }]
    ]);
    return;
  }
}

async function handleAddTesti_flow(chatId: number|string, text: string) {
  const state = userState.get(String(chatId));
  if (!state) return;

  if (state.step === "testi_name") {
    userState.set(String(chatId), { ...state, name: text, step: "testi_package" });
    await sendKeyboard(chatId, " Paket yang dipakai?", [
      [{ text: "Basic", callback_data: "testipkg_basic" }, { text: "Silver", callback_data: "testipkg_silver" }],
      [{ text: "Gold", callback_data: "testipkg_gold" }, { text: "Pro", callback_data: "testipkg_pro" }],
      [{ text: "Platinum", callback_data: "testipkg_platinum" }, { text: "Elite", callback_data: "testipkg_elite" }],
    ]);
    return;
  }
  if (state.step === "testi_rating") {
    const rating = parseInt(text);
    if (isNaN(rating) || rating < 1 || rating > 5) { await sendMsg(chatId, " Rating 1-5"); return; }
    userState.set(String(chatId), { ...state, rating, step: "testi_text" });
    await sendMsg(chatId, " Tulis testimoni:");
    return;
  }
  if (state.step === "testi_text") {
    const item = { name: state.name, package: state.package, rating: state.rating, text, isApproved: true, created_at: new Date().toISOString() };
    await sb("POST", "/testimonials", [item]).catch(async () => {
      // fallback ke settings
      const rows = await sb("GET", '/settings?key=eq.testimonials');
      const existing: any[] = rows[0]?.value || [];
      await sb("POST", "/settings",
        { key: "testimonials", value: [...existing, item], updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
    });
    userState.delete(String(chatId));
    await sendKeyboard(chatId, ` Testimoni dari <b>${state.name}</b> ditambah!`, [
      [{ text: " Testimoni", callback_data: "menu_testi" }, { text: " Menu", callback_data: "main_menu" }]
    ]);
    return;
  }
}

// ===== PROCESS UPDATE =====
async function processUpdate(update: any) {
  const msg = update.message;
  const cb = update.callback_query;
  const chatMemberUpdate = update.my_chat_member;

  // ===== AUTO-DETECT: bot added/removed from a channel or group =====
  if (chatMemberUpdate) {
    const chat = chatMemberUpdate.chat;
    const newStatus = chatMemberUpdate.new_chat_member?.status;
    const channels = await getChannels();
    const exists = channels.find((c:any) => String(c.id) === String(chat.id));

    if (["administrator", "member"].includes(newStatus)) {
      if (!exists) {
        const entry = { id: chat.id, title: chat.title || chat.username || String(chat.id), type: chat.type };
        await saveChannels([...channels, entry]);
        // notify admins
        for (const adminId of ADMIN_IDS) {
          await sendMsg(adminId, ` Bot ditambahkan ke <b>${entry.title}</b> (${chat.type}).\n\nSinyal baru akan auto-forward ke sini. Kelola di menu  Channels.`);
        }
      }
    } else if (["left", "kicked"].includes(newStatus)) {
      if (exists) {
        await saveChannels(channels.filter((c:any) => String(c.id) !== String(chat.id)));
      }
    }
    return;
  }

  if (msg) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const text = msg.text || "";
    const stateKey = String(chatId);
    const state = userState.get(stateKey);

    if (!isAdmin(userId)) {
      await sendMsg(chatId, ` <b>RC Admin Bot</b>\n\nID Telegram kamu: <code>${userId}</code>\n\nSampaikan ID ini ke developer untuk akses admin.`);
      return;
    }

    // Multi-step flows
    if (state) {
      if (state.flow === "sig") { await handleAddSignal(chatId, text); return; }
      if (state.flow === "tok") { await handleTokenCreate(chatId, text); return; }
      if (state.flow === "li") { await handleLiveInfoEdit(chatId, text); return; }
      if (state.flow === "order") { await handleOrderConfirm(chatId, text); return; }
      if (state.flow === "search") { await handleTokenSearch(chatId, text); return; }
      if (state.flow === "pricing_edit") { await handlePricingEdit(chatId, text); return; }
      if (state.flow === "signal_edit") { await handleSignalEdit(chatId, text); return; }
      if (state.flow === "ticker_add") { await handleAddTicker_flow(chatId, text); return; }
      if (state.flow === "stock_add") { await handleAddStock_flow(chatId, text); return; }
      if (state.flow === "testi_add") { await handleAddTesti_flow(chatId, text); return; }
    }

    if (text.startsWith("/start") || text.startsWith("/menu")) {
      await sendKeyboard(chatId,
        ` <b>RC Admin Bot - Ritel Community</b>\n\nHalo Admin! \nID: <code>${userId}</code>`,
        mainMenu()
      );
      return;
    }
    if (text.startsWith("/flashsale")) {
      await handleFlashSaleCmd(chatId, text.slice("/flashsale".length).trim().split(/\s+/));
      return;
    }
    if (text.startsWith("/removefs")) {
      await handleRemoveFlashSale(chatId, text.slice("/removefs".length).trim().split(/\s+/));
      return;
    }
    if (text.startsWith("/addticker")) {
      await handleAddTicker(chatId, text.slice("/addticker".length).trim().split(/\s+/));
      return;
    }
    if (text.startsWith("/tokens") || text.startsWith("/users")) { await handleTokens(chatId); return; }
    if (text.startsWith("/stats")) { await handleStats(chatId); return; }
    if (text.startsWith("/help")) {
      await sendMsg(chatId,
        ` <b>PERINTAH BOT RC ADMIN</b>\n\n` +
        `/menu — Menu utama\n/stats — Statistik\n/users — List user VIP\n` +
        `/flashsale [paket] [%] [jam] — Set flash sale\n/removefs [paket] — Hapus flash sale\n` +
        `/addticker [KODE] [HARGA] [%] — Tambah ticker\n\n` +
        `Semua fitur bisa juga via menu interaktif `
      );
      return;
    }

    await sendKeyboard(chatId, `Ketik /menu untuk panel admin.`, [[{ text: " Menu Utama", callback_data: "main_menu" }]]);
  }

  if (cb) {
    const chatId = cb.message?.chat?.id;
    const msgId = cb.message?.message_id;
    const userId = cb.from?.id;
    const data = cb.data || "";

    await answerCallback(cb.id);

    if (!isAdmin(userId)) { await sendMsg(chatId, " Akses ditolak."); return; }

    // ===== MAIN MENU =====
    if (data === "main_menu") {
      await editMsg(chatId, msgId, ` <b>RC Admin Bot</b>\n\nPilih menu:`, mainMenu());
      return;
    }

    if (data === "menu_signals") { await handleSignals(chatId); return; }
    if (data === "menu_tokens") { await handleTokens(chatId); return; }
    if (data === "menu_pricing") { await handlePricing(chatId); return; }
    if (data === "menu_liveinfo") { await handleLiveInfo(chatId); return; }
    if (data === "menu_stocks") { await handleStocks(chatId); return; }
    if (data === "menu_ticker") { await handleTicker(chatId); return; }
    if (data === "menu_testi") { await handleTestimonials(chatId); return; }
    if (data === "menu_orders") { await handleOrders(chatId); return; }
    if (data === "menu_stats") { await handleStats(chatId); return; }
    if (data === "menu_channels") { await handleChannels(chatId); return; }
    if (data.startsWith("chan_del_")) {
      const id = data.replace("chan_del_", "");
      const channels = await getChannels();
      await saveChannels(channels.filter((c:any) => String(c.id) !== String(id)));
      await handleChannels(chatId);
      return;
    }

    // ===== PAGINATION =====
    if (data.startsWith("sig_page_")) { await handleSignals(chatId, parseInt(data.replace("sig_page_",""))); return; }
    if (data.startsWith("tok_page_")) { await handleTokens(chatId, parseInt(data.replace("tok_page_",""))); return; }
    if (data.startsWith("ord_page_")) { await handleOrders(chatId, parseInt(data.replace("ord_page_",""))); return; }
    if (data.startsWith("testi_page_")) { await handleTestimonials(chatId, parseInt(data.replace("testi_page_",""))); return; }

    // ===== SINYAL =====
    if (data === "sig_add") {
      userState.set(String(chatId), { flow: "sig", step: "sig_kode" });
      await sendMsg(chatId, " <b>Tambah Sinyal</b>\n\nKode saham? (contoh: BBCA)");
      return;
    }
    if (data.startsWith("sigact_")) {
      const action = data.replace("sigact_", "");
      const state = userState.get(String(chatId));
      if (state) {
        userState.set(String(chatId), { ...state, action, step: "sig_entry" });
        await sendMsg(chatId, ` Entry range? (contoh: 9.750–9.800 atau . untuk skip)`);
      }
      return;
    }
    if (data.startsWith("sig_edit_")) {
      const sigId = data.replace("sig_edit_", "");
      const signals = await sb("GET", `/signals?id=eq.${sigId}`);
      const sig = signals[0];
      if (!sig) { await sendMsg(chatId, " Sinyal tidak ditemukan"); return; }
      userState.set(String(chatId), {
        flow: "signal_edit", step: "se_entry",
        sigId, kode: sig.kode,
        origEntry: sig.entry, origTp: sig.tp, origSl: sig.sl, origNotes: sig.notes||"",
        entry: sig.entry, tp: sig.tp, sl: sig.sl,
      });
      await sendMsg(chatId, ` <b>Edit Sinyal ${sig.kode}</b>\n\nEntry: ${sig.entry||"—"} | TP: ${sig.tp||"—"} | SL: ${sig.sl||"—"}\n\nKetik <b>Entry baru</b> (atau . untuk skip):`);
      return;
    }
    if (data.startsWith("sig_del_")) {
      const sigId = data.replace("sig_del_", "");
      const signals = await sb("GET", `/signals?id=eq.${sigId}`);
      const sig = signals[0];
      await sendKeyboard(chatId, ` Hapus sinyal <b>${sig?.kode}</b>?`, [
        [{ text: " Ya, Hapus", callback_data: `sig_del_do_${sigId}` }, { text: " Batal", callback_data: "menu_signals" }]
      ]);
      return;
    }
    if (data.startsWith("sig_del_do_")) {
      const sigId = data.replace("sig_del_do_", "");
      await sb("DELETE", `/signals?id=eq.${sigId}`);
      await sendKeyboard(chatId, " Sinyal dihapus.", [[{ text: " Sinyal", callback_data: "menu_signals" }, { text: " Menu", callback_data: "main_menu" }]]);
      return;
    }
    if (data === "sig_delall_confirm") {
      await sendKeyboard(chatId, " <b>Hapus SEMUA sinyal?</b>", [
        [{ text: " Ya, Hapus Semua", callback_data: "sig_delall_do" }],
        [{ text: " Batal", callback_data: "menu_signals" }],
      ]);
      return;
    }
    if (data === "sig_delall_do") {
      await sb("DELETE", "/signals?id=neq.NONE");
      await sendKeyboard(chatId, " Semua sinyal dihapus.", [[{ text: " Menu", callback_data: "main_menu" }]]);
      return;
    }
    if (data === "se_save") {
      const state = userState.get(String(chatId));
      if (!state) return;
      await sb("PATCH", `/signals?id=eq.${state.sigId}`, { entry: state.entry, tp: state.tp, sl: state.sl, notes: state.notes });
      userState.delete(String(chatId));
      await sendKeyboard(chatId, ` Sinyal <b>${state.kode}</b> diupdate!\nEntry: ${state.entry||"—"} | TP: ${state.tp||"—"} | SL: ${state.sl||"—"}`, [
        [{ text: " Sinyal", callback_data: "menu_signals" }, { text: " Menu", callback_data: "main_menu" }]
      ]);
      return;
    }
    if (data === "se_cancel") { userState.delete(String(chatId)); await handleSignals(chatId); return; }

    // ===== TOKEN =====
    if (data === "tok_create") {
      userState.set(String(chatId), { flow: "tok", step: "tok_email" });
      await sendMsg(chatId, "<b>Buat User VIP</b>\n\nEmail user?");
      return;
    }
    if (data === "tok_search") {
      userState.set(String(chatId), { flow: "search", step: "tok_search" });
      await sendMsg(chatId, "Cari user — ketik nama atau email:");
      return;
    }
    if (data.startsWith("tokpkg_")) {
      const pkg = data.replace("tokpkg_", "");
      const state = userState.get(String(chatId));
      if (state) {
        const email = state.email?.trim();
        const name = state.name?.trim() || "";
        const expiredAt = new Date(Date.now() + 30 * 86400000).toISOString();
        
        const users = await getVipUsers();
        const userIndex = users.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        
        if (userIndex !== -1) {
          users[userIndex].role = "vip";
          users[userIndex].subscription = pkg;
          users[userIndex].expired_at = expiredAt;
          if (name) users[userIndex].name = name;
        } else {
          users.push({
            auth_user_id: null,
            email,
            name: name || null,
            role: "vip",
            subscription: pkg,
            expired_at: expiredAt,
            created_at: new Date().toISOString(),
            last_login_at: null,
          });
        }
        await saveVipUsers(users);
        userState.delete(String(chatId));
        await sendKeyboard(chatId,
          `User VIP berhasil diupdate/dibuat!\n\nNama: ${name || "—"}\nEmail: ${email}\nPaket: ${pkg}\nExp: ${fmtDate(expiredAt)}`,
          [[{ text: "Lihat User", callback_data: "menu_tokens" }, { text: "Menu", callback_data: "main_menu" }]]
        );
      }
      return;
    }
    if (data.startsWith("tok_toggle_")) {
      const email = data.replace("tok_toggle_", "");
      const users = await getVipUsers();
      const userIndex = users.findIndex((u: any) => u.email === email);
      if (userIndex === -1) {
        await sendMsg(chatId, "User tidak ditemukan.");
        return;
      }
      const u = users[userIndex];
      if (u.role === "vip") {
        u.role = "free";
        u.subscription = "basic";
      } else {
        u.role = "vip";
        u.subscription = "gold";
        if (!u.expired_at || isExpired(u.expired_at)) {
          u.expired_at = new Date(Date.now() + 30 * 86400000).toISOString();
        }
      }
      await saveVipUsers(users);
      await sendMsg(chatId, `User ${u.email} diubah menjadi ${u.role?.toUpperCase()} (${u.subscription}).`);
      return;
    }
    if (data.startsWith("tok_del_") && !data.includes("expired")) {
      const email = data.replace("tok_del_", "");
      await sendKeyboard(chatId, `Hapus user <b>${email}</b> dari VIP?`, [
        [{ text: "Ya", callback_data: `tok_del_do_${email}` }, { text: "Batal", callback_data: "menu_tokens" }]
      ]);
      return;
    }
    if (data.startsWith("tok_del_do_")) {
      const email = data.replace("tok_del_do_", "");
      const users = await getVipUsers();
      const updated = users.filter((u: any) => u.email !== email);
      await saveVipUsers(updated);
      await sendKeyboard(chatId, "User dihapus.", [[{ text: "User", callback_data: "menu_tokens" }, { text: "Menu", callback_data: "main_menu" }]]);
      return;
    }
    if (data === "tok_del_expired_confirm") {
      await sendKeyboard(chatId, "Downgrade semua user expired ke Free?", [
        [{ text: "Ya, Downgrade", callback_data: "tok_del_expired_do" }],
        [{ text: "Batal", callback_data: "menu_tokens" }]
      ]);
      return;
    }
    if (data === "tok_del_expired_do") {
      const users = await getVipUsers();
      let count = 0;
      users.forEach((u: any) => {
        if (u.role === "vip" && isExpired(u.expired_at || "")) {
          u.role = "free";
          u.subscription = "basic";
          count++;
        }
      });
      if (count > 0) {
        await saveVipUsers(users);
      }
      await sendKeyboard(chatId, `${count} user expired didowngrade ke Free.`, [[{ text: "User", callback_data: "menu_tokens" }]]);
      return;
    }

    // ===== PRICING =====
    if (data.startsWith("pricing_edit_")) {
      const pkgId = data.replace("pricing_edit_", "");
      const rows = await sb("GET", '/settings?key=eq.pricing');
      const pricing: any[] = rows[0]?.value || [];
      const pkg = pricing.find((p:any) => p.id === pkgId);
      if (!pkg) { await sendMsg(chatId, " Paket tidak ditemukan"); return; }
      userState.set(String(chatId), {
        flow: "pricing_edit", step: "pe_price",
        pkgId: pkg.id, pkgName: pkg.name,
        origPeriod: pkg.period||"/bulan", origDesc: pkg.description||"",
      });
      await sendKeyboard(chatId,
        ` <b>Edit Paket ${pkg.name}</b>\n\nHarga saat ini: <b>${pkg.priceLabel}</b>\nFlash Sale: ${pkg.flashSale ? pkg.flashSale.price+" ("+pkg.flashSale.discount+")" : "—"}\n\nKetik <b>harga baru</b> (atau . untuk skip):`,
        [
          [{ text: " Set Flash Sale", callback_data: `pe_flash_${pkg.id}` }, { text: " Hapus Flash", callback_data: `pe_rmflash_${pkg.id}` }],
          [{ text: " Batal", callback_data: "menu_pricing" }],
        ]
      );
      return;
    }
    if (data === "pe_save") {
      const state = userState.get(String(chatId));
      if (!state) return;
      const rows = await sb("GET", '/settings?key=eq.pricing');
      const pricing: any[] = rows[0]?.value || [];
      const updated = pricing.map((p:any) => p.id === state.pkgId
        ? { ...p, priceLabel: state.priceLabel, period: state.period, description: state.description }
        : p
      );
      await sb("POST", "/settings",
        { key: "pricing", value: updated, updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      userState.delete(String(chatId));
      await sendKeyboard(chatId, ` Paket <b>${state.pkgName}</b> diupdate!\nHarga: ${state.priceLabel}`, [
        [{ text: " Harga Paket", callback_data: "menu_pricing" }, { text: " Menu", callback_data: "main_menu" }]
      ]);
      return;
    }
    if (data === "pe_cancel") { userState.delete(String(chatId)); await handlePricing(chatId); return; }
    if (data.startsWith("pe_flash_")) {
      const pkgId = data.replace("pe_flash_","");
      const rows = await sb("GET", '/settings?key=eq.pricing');
      const pricing: any[] = rows[0]?.value || [];
      const pkg = pricing.find((p:any) => p.id === pkgId);
      await sendMsg(chatId, ` Set flash sale untuk <b>${pkg?.name}</b>:\n\nKetik: /flashsale ${pkgId} [persen] [jam]\nContoh: /flashsale ${pkgId} 50 24`);
      return;
    }
    if (data.startsWith("pe_rmflash_")) {
      await handleRemoveFlashSale(chatId, [data.replace("pe_rmflash_","")]);
      return;
    }

    // ===== LIVE INFO =====
    if (data === "li_toggle") {
      const rows = await sb("GET", "/liveinfo?id=eq.1");
      const li = rows[0] || { message: "", is_active: false };
      await sb("POST", "/liveinfo",
        { id: 1, message: li.message||"", is_active: !li.is_active, updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendMsg(chatId, ` Live info ${!li.is_active ? "DIAKTIFKAN" : "DIMATIKAN"}.`);
      return;
    }
    if (data === "li_edit") {
      userState.set(String(chatId), { flow: "li", step: "li_msg" });
      await sendMsg(chatId, " Ketik pesan live info baru:");
      return;
    }

    // ===== TICKER =====
    if (data === "ticker_add") {
      userState.set(String(chatId), { flow: "ticker_add", step: "ticker_kode" });
      await sendMsg(chatId, " <b>Tambah Ticker</b>\n\nKode saham? (contoh: BBCA)");
      return;
    }
    if (data.startsWith("ticker_del_")) {
      const kode = data.replace("ticker_del_","");
      await sendKeyboard(chatId, ` Hapus ticker <b>${kode}</b>?`, [
        [{ text: " Ya", callback_data: `ticker_del_do_${kode}` }, { text: " Batal", callback_data: "menu_ticker" }]
      ]);
      return;
    }
    if (data.startsWith("ticker_del_do_")) {
      const kode = data.replace("ticker_del_do_","");
      const rows = await sb("GET", '/settings?key=eq.ticker');
      const ticker: any[] = rows[0]?.value || [];
      const updated = ticker.filter((t:any) => t.kode !== kode);
      await sb("POST", "/settings",
        { key: "ticker", value: updated, updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendKeyboard(chatId, ` Ticker <b>${kode}</b> dihapus.`, [[{ text: " Ticker", callback_data: "menu_ticker" }]]);
      return;
    }
    if (data === "ticker_reset_confirm") {
      await sendKeyboard(chatId, " Reset semua ticker?", [
        [{ text: " Ya", callback_data: "ticker_reset_do" }, { text: " Batal", callback_data: "menu_ticker" }]
      ]);
      return;
    }
    if (data === "ticker_reset_do") {
      await sb("POST", "/settings",
        { key: "ticker", value: [], updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendKeyboard(chatId, " Ticker direset.", [[{ text: " Ticker", callback_data: "menu_ticker" }]]);
      return;
    }

    // ===== TOP SAHAM =====
    if (data === "stock_add") {
      userState.set(String(chatId), { flow: "stock_add", step: "stock_kode" });
      await sendMsg(chatId, " <b>Tambah Top Saham</b>\n\nKode saham? (contoh: BBCA)");
      return;
    }
    if (data.startsWith("stock_del_")) {
      const kode = data.replace("stock_del_","");
      await sendKeyboard(chatId, ` Hapus saham <b>${kode}</b> dari Top Saham?`, [
        [{ text: " Ya", callback_data: `stock_del_do_${kode}` }, { text: " Batal", callback_data: "menu_stocks" }]
      ]);
      return;
    }
    if (data.startsWith("stock_del_do_")) {
      const kode = data.replace("stock_del_do_","");
      const rows = await sb("GET", '/settings?key=eq.top_saham');
      const stocks: any[] = rows[0]?.value || [];
      const updated = stocks.filter((s:any) => s.kode !== kode);
      await sb("POST", "/settings",
        { key: "top_saham", value: updated, updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendKeyboard(chatId, ` Saham <b>${kode}</b> dihapus dari Top Saham.`, [[{ text: " Top Saham", callback_data: "menu_stocks" }]]);
      return;
    }
    if (data === "stock_delall_confirm") {
      await sendKeyboard(chatId, " Hapus SEMUA top saham?", [
        [{ text: " Ya", callback_data: "stock_delall_do" }, { text: " Batal", callback_data: "menu_stocks" }]
      ]);
      return;
    }
    if (data === "stock_delall_do") {
      await sb("POST", "/settings",
        { key: "top_saham", value: [], updated_at: new Date().toISOString() },
        { "Prefer": "resolution=merge-duplicates,return=representation" }
      );
      await sendKeyboard(chatId, " Semua top saham dihapus.", [[{ text: " Menu", callback_data: "main_menu" }]]);
      return;
    }

    // ===== TESTIMONI =====
    if (data === "testi_add") {
      userState.set(String(chatId), { flow: "testi_add", step: "testi_name" });
      await sendMsg(chatId, " <b>Tambah Testimoni</b>\n\nNama user?");
      return;
    }
    if (data.startsWith("testipkg_")) {
      const pkg = data.replace("testipkg_","");
      const state = userState.get(String(chatId));
      if (state) {
        userState.set(String(chatId), { ...state, package: pkg, step: "testi_rating" });
        await sendMsg(chatId, " Rating 1-5?");
      }
      return;
    }
    if (data.startsWith("testi_toggle_")) {
      const id = data.replace("testi_toggle_","");
      const testi = await sb("GET", `/testimonials?id=eq.${id}`).catch(()=>[]);
      if (testi.length) {
        await sb("PATCH", `/testimonials?id=eq.${id}`, { isApproved: !testi[0].isApproved });
        await sendMsg(chatId, ` Testimoni ${!testi[0].isApproved ? "ditampilkan" : "disembunyikan"}.`);
      } else {
        await sendMsg(chatId, " Tidak bisa ubah status testimoni ini.");
      }
      return;
    }
    if (data.startsWith("testi_del_")) {
      const id = data.replace("testi_del_","");
      await sendKeyboard(chatId, " Hapus testimoni ini?", [
        [{ text: " Ya", callback_data: `testi_del_do_${id}` }, { text: " Batal", callback_data: "menu_testi" }]
      ]);
      return;
    }
    if (data.startsWith("testi_del_do_")) {
      const id = data.replace("testi_del_do_","");
      await sb("DELETE", `/testimonials?id=eq.${id}`).catch(()=>{});
      await sendKeyboard(chatId, " Testimoni dihapus.", [[{ text: " Testimoni", callback_data: "menu_testi" }]]);
      return;
    }

    // ===== ORDERS =====
    if (data === "order_confirm_ask") {
      userState.set(String(chatId), { flow: "order", step: "order_id" });
      await sendMsg(chatId, " Masukkan ID order (bisa sebagian):");
      return;
    }
    if (data.startsWith("order_confirm_")) {
      const ordId = data.replace("order_confirm_","");
      await sb("PATCH", `/orders?id=eq.${ordId}`, { status: "confirmed" });
      await sendKeyboard(chatId, ` Order dikonfirmasi!`, [[{ text: " Orders", callback_data: "menu_orders" }]]);
      return;
    }
    if (data.startsWith("order_cancel_")) {
      const ordId = data.replace("order_cancel_","");
      await sendKeyboard(chatId, " Cancel order ini?", [
        [{ text: " Ya, Cancel", callback_data: `order_cancel_do_${ordId}` }, { text: " Batal", callback_data: "menu_orders" }]
      ]);
      return;
    }
    if (data.startsWith("order_cancel_do_")) {
      const ordId = data.replace("order_cancel_do_","");
      await sb("PATCH", `/orders?id=eq.${ordId}`, { status: "cancelled" });
      await sendKeyboard(chatId, " Order dicancelled.", [[{ text: " Orders", callback_data: "menu_orders" }]]);
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
