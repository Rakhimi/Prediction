import { NextResponse } from "next/server";
import { getFootballMatches } from "@/lib/football";

export async function GET() {
  try {
    const matches =
      await getFootballMatches();

    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}