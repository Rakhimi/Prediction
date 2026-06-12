import { prisma } from "@/lib/prisma";
import { getFootballMatchesPast2Days } from "@/lib/footballtwodays";

export async function GET() {
  const matches = await getFootballMatchesPast2Days();

  for (const match of matches) {
    await prisma.match.upsert({
      where: { matchId: match.id },
      update: {},
      create: {
        matchId: match.id,
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        matchDate: new Date(match.utcDate),
        league: match.competition?.name ?? "unknown",
        analyzed: false,
      },
    });
  }

  return Response.json({
    success: true,
    count: matches.length,
  });
}