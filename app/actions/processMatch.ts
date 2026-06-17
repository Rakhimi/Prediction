import { analyzeMatch } from "./getAnalysis";
import { prisma } from "@/lib/prisma";

export async function processMatch(match: any) {

  const conservative = await analyzeMatch(
    match.homeTeam.name,
    match.awayTeam.name,
    "conservative"
  );

  const balanced = await analyzeMatch(
    match.homeTeam.name,
    match.awayTeam.name,
    "balanced"
  );

  const aggressive = await analyzeMatch(
    match.homeTeam.name,
    match.awayTeam.name,
    "aggressive"
  );

  console.log(conservative);

  await prisma.match.update({
    where: {
      matchId: match.id,
    },
    data: {
      analyzed: true,

      analyses: {
        deleteMany: {},

        create: [
          {
            strategy: "conservative",
            bestBet: conservative.prediction.bestBet,
            correctScore: conservative.prediction.correctScore,
            ftHandicap: conservative.prediction.ftHandicap,
            analysis: conservative.analysis,
            homeTeamForm: conservative.homeTeamForm.join(","),
            awayTeamForm: conservative.awayTeamForm.join(","),
            homeOdds: conservative.odds.home,
            drawOdds: conservative.odds.draw,
            awayOdds: conservative.odds.away,

            over25Odds: conservative.odds.over25,
            under25Odds: conservative.odds.under25,

            homeWinProb: conservative.probabilities.homeWin,
            drawProb: conservative.probabilities.draw,
            awayWinProb: conservative.probabilities.awayWin,
            headToHead: conservative.headToHead,
          },
          {
            strategy: "balanced",
            bestBet: balanced.prediction.bestBet,
            correctScore: balanced.prediction.correctScore,
            ftHandicap: balanced.prediction.ftHandicap,
            analysis: balanced.analysis,
            homeTeamForm: balanced.homeTeamForm.join(","),
            awayTeamForm: balanced.awayTeamForm.join(","),
            homeOdds: balanced.odds.home,
            drawOdds: balanced.odds.draw,
            awayOdds: balanced.odds.away,

            over25Odds: balanced.odds.over25,
            under25Odds: balanced.odds.under25,

            homeWinProb: balanced.probabilities.homeWin,
            drawProb: balanced.probabilities.draw,
            awayWinProb: balanced.probabilities.awayWin,
            headToHead: balanced.headToHead,
          },
          {
            strategy: "aggressive",
            bestBet: aggressive.prediction.bestBet,
            correctScore: aggressive.prediction.correctScore,
            ftHandicap: aggressive.prediction.ftHandicap,
            analysis: aggressive.analysis,
            homeTeamForm: aggressive.homeTeamForm.join(","),
            awayTeamForm: aggressive.awayTeamForm.join(","),
            homeOdds: aggressive.odds.home,
            drawOdds: aggressive.odds.draw,
            awayOdds: aggressive.odds.away,

            over25Odds: aggressive.odds.over25,
            under25Odds: aggressive.odds.under25,

            homeWinProb: aggressive.probabilities.homeWin,
            drawProb: aggressive.probabilities.draw,
            awayWinProb: aggressive.probabilities.awayWin,
            headToHead: aggressive.headToHead,
          }
        ]
      }
    }
  });
}