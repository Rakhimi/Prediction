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
      league: match.league?.name ?? "unknown",

      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      matchDate: new Date(match.utcDate),

      homeTeamForm: result.homeTeamForm.join(","),
      awayTeamForm: result.awayTeamForm.join(","),

      homeOdds: result.odds?.home ?? null,
      drawOdds: result.odds?.draw ?? null,
      awayOdds: result.odds?.away ?? null,

      over25Odds: result.odds?.over25 ?? null,
      under25Odds: result.odds?.under25 ?? null,

      homeWinProb: result.probabilities?.homeWin ?? null,
      drawProb: result.probabilities?.draw ?? null,
      awayWinProb: result.probabilities?.awayWin ?? null,

      headToHead: result.headToHead ?? [],

      analysis: result.analysis ?? null,

      analyzed: true,
    },

    create: {
      matchId: match.id,

      league: match.league?.name ?? "unknown",

      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      matchDate: new Date(match.utcDate),

      homeTeamForm: result.homeTeamForm.join(","),
      awayTeamForm: result.awayTeamForm.join(","),

      homeOdds: result.odds?.home ?? null,
      drawOdds: result.odds?.draw ?? null,
      awayOdds: result.odds?.away ?? null,

      over25Odds: result.odds?.over25 ?? null,
      under25Odds: result.odds?.under25 ?? null,

      homeWinProb: result.probabilities?.homeWin ?? null,
      drawProb: result.probabilities?.draw ?? null,
      awayWinProb: result.probabilities?.awayWin ?? null,

      headToHead: result.headToHead ?? [],

      analysis: result.analysis ?? null,

      analyzed: true,
    },
  });
}