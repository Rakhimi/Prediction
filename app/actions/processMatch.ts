import { analyzeMatch } from "./getAnalysis";
import { prisma } from "@/lib/prisma";

export async function processMatch(match: any) {
  const result = await analyzeMatch(
    match.homeTeam.name,
    match.awayTeam.name
  );

  console.log("result", result)

  if (!result) return;

  await prisma.match.upsert({
    where: { matchId: match.id },
    update: {
      homeTeamForm: result.homeTeamForm.join(","), 
      awayTeamForm: result.awayTeamForm.join(","), 
      homeOdds: result.odds.home,
      drawOdds: result.odds.draw,
      awayOdds: result.odds.away,
      analysis: result.analysis,
      analyzed: true,
    },
    create: {
      matchId: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      matchDate: new Date(match.utcDate),

      homeTeamForm: result.homeTeamForm.join(","), 
      awayTeamForm: result.awayTeamForm.join(","), 
      homeOdds: result.odds.home,
      drawOdds: result.odds.draw,
      awayOdds: result.odds.away,
      analysis: result.analysis,
      analyzed: true,
    },
  });
}