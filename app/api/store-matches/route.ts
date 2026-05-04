import { prisma } from "@/lib/prisma";
import { getFootballMatches } from "@/lib/football";

export async function GET() {
  try {
    const matches = await getFootballMatches();

    console.log("MATCH COUNT:", matches.length);

    for (const match of matches) {
      await prisma.match.upsert({
        where: { matchId: match.id },
        update: {},
        create: {
          matchId: match.id,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          matchDate: new Date(match.utcDate),
          league: match.competition?.name ?? "unknown",
          analyzed: false,
        },
      });
    }

    return Response.json({ success: true, inserted: matches.length });
  } catch (err) {
    console.error("STORE MATCH ERROR:", err);
    return Response.json({ error: "store failed" }, { status: 500 });
  }
}