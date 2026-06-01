import { NextResponse } from "next/server";
import { serverStore } from "@/app/api/admin/sync/route";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ signals: serverStore.signals });
}
