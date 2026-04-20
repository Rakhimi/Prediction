import { NextRequest, NextResponse } from "next/server";
import { processMatch } from "@/app/actions/processMatch";

export async function POST(req: NextRequest) {
  const match = await req.json();

  await processMatch(match);

  return NextResponse.json({ success: true });
}