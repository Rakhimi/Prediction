// /api/store-matches
import { prisma } from "@/lib/prisma";

export async function GET() {
  const res = await fetch(`${process.env.BASE_URL}/api/football-list`);
  const matches = await res.json();

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

  return Response.json({ success: true });
}