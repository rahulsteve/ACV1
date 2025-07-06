import { NextRequest, NextResponse } from "next/server";
import { validateWithDataSoap } from "@/app/libs/datasoap"
export async function POST(req: NextRequest) {
  const { lookup } = await req.json();

  if (!lookup) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const result = await validateWithDataSoap({ lookup });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
