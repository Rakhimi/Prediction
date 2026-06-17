import { prisma } from "@/lib/prisma";
import { processMatch } from "@/app/actions/processMatch";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const CRON_SECRET = process.env.CRON_SECRET;

  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pending = await prisma.match.findMany({
    where: {
      analyzed: false,
    },
    orderBy: {
      matchDate: "asc",
    },
    take: 6,
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