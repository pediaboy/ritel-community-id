import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

// Simpan mutasi di settings table (key: mutasi_YYYY-MM)
async function getMutasiKey() {
  const d = new Date();
  return `mutasi_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}

async function getMutasiAll(): Promise<any[]> {
  const key = await getMutasiKey();
  const rows = await sb("GET", `/settings?key=eq.${key}&limit=1`);
  return rows[0]?.value || [];
}

async function saveMutasi(list: any[]) {
  const key = await getMutasiKey();
  await sb("POST", "/settings",
    { key, value: list, updated_at: new Date().toISOString() },
    { Prefer: "resolution=merge-duplicates,return=representation" }
  );
}

function calcTotals(list: any[]) {
  let totalIncome = 0, totalExpense = 0;
  list.forEach((m: any) => {
    if (m.type === "income") totalIncome += (m.amount || 0);
    else totalExpense += (m.amount || 0);
  });
  return { totalIncome, totalExpense };
}

export async function GET() {
  const mutations = await getMutasiAll();
  const { totalIncome, totalExpense } = calcTotals(mutations);
  return NextResponse.json({ mutations, totalIncome, totalExpense });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.date || !body.description || body.amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mutations = await getMutasiAll();
    const newItem = {
      id: Date.now().toString(),
      date: body.date,
      description: body.description,
      amount: Number(body.amount),
      type: body.type || "income",
      order_id: body.order_id || null,
      created_at: new Date().toISOString(),
    };
    mutations.unshift(newItem);
    await saveMutasi(mutations);

    const { totalIncome, totalExpense } = calcTotals(mutations);
    return NextResponse.json({ success: true, mutations, totalIncome, totalExpense }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const mutations = await getMutasiAll();
    const idx = mutations.findIndex((m: any) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    mutations[idx] = { ...mutations[idx], ...body };
    await saveMutasi(mutations);

    const { totalIncome, totalExpense } = calcTotals(mutations);
    return NextResponse.json({ success: true, mutations, totalIncome, totalExpense });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const mutations = await getMutasiAll();
    const filtered = mutations.filter((m: any) => m.id !== id);
    await saveMutasi(filtered);

    const { totalIncome, totalExpense } = calcTotals(filtered);
    return NextResponse.json({ success: true, mutations: filtered, totalIncome, totalExpense });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
