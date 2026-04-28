import { prisma } from "@/lib/prisma";
import { processMatch } from "@/app/actions/processMatch";

export async function GET() {
  const pending = await prisma.match.findMany({
    where: {
      analyzed: false,
    },
    orderBy: {
      matchDate: "asc",
    },
    take: 10, // avoid overload
  });

  for (const match of pending) {
    await processMatch({
      id: match.matchId,
      homeTeam: { name: match.homeTeam },
      awayTeam: { name: match.awayTeam },
      utcDate: match.matchDate,
      league: { name: match.league },
    });
  }

  return Response.json({
    success: true,
    analyzed: pending.length,
  });
}