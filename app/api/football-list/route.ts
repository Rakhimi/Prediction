import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.football-data.org/v4/matches", {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_KEY!,
      },
      cache: "no-store",
    });

    const data = await res.json();

    // Optional: filter only Premier League
    const eplMatches = data.matches.filter(
      (match: any) => match.competition.name === "Premier League"
    );

    const today = new Date().toISOString().split("T")[0];

    const todayMatches = eplMatches.filter((match: any) =>
    match.utcDate.startsWith(today)
    );

    return NextResponse.json(todayMatches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}