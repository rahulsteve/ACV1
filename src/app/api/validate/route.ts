import { NextRequest, NextResponse } from "next/server";
import { validateWithDataSoap } from "@/app/libs/datasoap";

export async function POST(req: NextRequest) {
  const { lookup } = await req.json();
  if (!lookup) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const res = await validateWithDataSoap(lookup);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
