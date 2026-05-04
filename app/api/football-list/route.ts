import { NextResponse } from "next/server";
import { getFootballMatches } from "@/lib/football";

export async function GET(req: Request) {
  const CRON_SECRET = process.env.CRON_SECRET;

  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const matches = await getFootballMatches();
    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}