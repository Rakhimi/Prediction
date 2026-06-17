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
            homeTeamForm: conservative.homeTeamForm,
            awayTeamForm: conservative.awayTeamForm,
            homeOdds: conservative.homeOdds,
            drawOdds: conservative.drawOdds,
            awayOdds: conservative.awayOdds,
            over25Odds: conservative.over25Odds,
            under25Odds: conservative.under25Odds,
            homeWinProb: conservative.homeWinProb,
            drawProb: conservative.drawProb,
            awayWinProb: conservative.awayWinProb,
            headToHead: conservative.headToHead,
          },
          {
            strategy: "balanced",
            bestBet: balanced.prediction.bestBet,
            correctScore: balanced.prediction.correctScore,
            ftHandicap: balanced.prediction.ftHandicap,
            analysis: balanced.analysis,
            homeTeamForm: balanced.homeTeamForm,
            awayTeamForm: balanced.awayTeamForm,
            homeOdds: balanced.homeOdds,
            drawOdds: balanced.drawOdds,
            awayOdds: balanced.awayOdds,
            over25Odds: balanced.over25Odds,
            under25Odds: balanced.under25Odds,
            homeWinProb: balanced.homeWinProb,
            drawProb: balanced.drawProb,
            awayWinProb: balanced.awayWinProb,
            headToHead: balanced.headToHead,
          },
          {
            strategy: "aggressive",
            bestBet: aggressive.prediction.bestBet,
            correctScore: aggressive.prediction.correctScore,
            ftHandicap: aggressive.prediction.ftHandicap,
            analysis: aggressive.analysis,
            homeTeamForm: aggressive.homeTeamForm,
            awayTeamForm: aggressive.awayTeamForm,
            homeOdds: aggressive.homeOdds,
            drawOdds: aggressive.drawOdds,
            awayOdds: aggressive.awayOdds,
            over25Odds: aggressive.over25Odds,
            under25Odds: aggressive.under25Odds,
            homeWinProb: aggressive.homeWinProb,
            drawProb: aggressive.drawProb,
            awayWinProb: aggressive.awayWinProb,
            headToHead: aggressive.headToHead,
          }
        ]
      }
    }
  });
}