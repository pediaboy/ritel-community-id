import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/supabase";

interface MutasiPayload {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  order_id?: string;
}

// Reset bulanan otomatis
async function getMutasiWithReset() {
  try {
    const today = new Date();
    const currentMonth = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");
    const lastResetKey = "mutasi_last_reset";

    // Cek reset state di settings table
    const lastReset = await sb("GET", `/settings?key=eq.${lastResetKey}`);
    const storedMonth = lastReset?.[0]?.value || "";

    // Jika bulan beda, reset
    if (storedMonth !== currentMonth) {
      // Delete semua mutasi dari bulan lalu
      await sb("DELETE", "/mutasi?date=lt." + today.toISOString().substring(0, 7));

      // Update reset marker
      if (lastReset?.length > 0) {
        await sb(
          "PATCH",
          `/settings?key=eq.${lastResetKey}`,
          { value: currentMonth }
        );
      } else {
        await sb("POST", "/settings", { key: lastResetKey, value: currentMonth });
      }
    }

    // Ambil mutasi bulan ini
    const startOfMonth = `${currentMonth}-01`;
    const mutations = await sb("GET", `/mutasi?date=gte.${startOfMonth}&order=date.desc`);

    // Hitung total
    let totalIncome = 0;
    let totalExpense = 0;
    mutations.forEach((m: any) => {
      if (m.type === "income") totalIncome += m.amount;
      else totalExpense += m.amount;
    });

    return { mutations, totalIncome, totalExpense };
  } catch (error) {
    console.error("getMutasiWithReset error:", error);
    return { mutations: [], totalIncome: 0, totalExpense: 0 };
  }
}

export async function GET(req: NextRequest) {
  const data = await getMutasiWithReset();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body: MutasiPayload = await req.json();

    if (!body.date || !body.description || body.amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mutasiData = {
      date: body.date,
      description: body.description,
      amount: body.amount,
      type: body.type,
      order_id: body.order_id || null,
      created_at: new Date().toISOString(),
    };

    const result = await sb("POST", "/mutasi", mutasiData);
    const data = await getMutasiWithReset();

    return NextResponse.json({ success: true, mutasi: result, ...data }, { status: 201 });
  } catch (error) {
    console.error("POST mutasi error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await sb("PATCH", `/mutasi?id=eq.${id}`, body);
    const data = await getMutasiWithReset();

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error) {
    console.error("PUT mutasi error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await sb("DELETE", `/mutasi?id=eq.${id}`);
    const data = await getMutasiWithReset();

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error) {
    console.error("DELETE mutasi error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
