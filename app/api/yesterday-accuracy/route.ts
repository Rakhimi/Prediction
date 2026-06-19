import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const today = new Date();
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (i + 1)); // yesterday → 5 days back
    return d;
  });

  const predictions = await prisma.match.findMany({
    where: {
      matchDate: {
        gte: new Date(days[4].setHours(0, 0, 0, 0)),
        lte: new Date(days[0].setHours(23, 59, 59, 999)),
      },
      analyses: {
        some: {
          strategy: "balanced",
          bestBet: {
            not: null,
          },
        },
      },
    },

    include: {
      analyses: {
        where: {
          strategy: "balanced",
        },
        select: {
          bestBet: true,
        },
        take: 1,
      },
    },

    orderBy: {
      matchDate: "desc", // newest first
    },

    take: 50,
  });

  const validMatches = predictions.length;

  if (validMatches < 3) {
    try {
      const filePath = path.join(process.cwd(), "data", "accuracy.json");
      const cached = await fs.readFile(filePath, "utf8");

      return Response.json(JSON.parse(cached));
    } catch {
      // fallback if file doesn't exist yet
      return Response.json({
        total: 0,
        correct: 0,
        accuracy: 0,
        matches: [],
        updatedAt: null,
        note: "Not enough data and no cache available",
      });
    }
  }

  const matchMap = new Map();

  for (const prediction of predictions) {
    const res = await fetch(
      `https://api.football-data.org/v4/matches/${prediction.matchId}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_KEY!,
        },
      }
    );

    const match = await res.json();

    matchMap.set(prediction.matchId, match);
  }

  let correct = 0;

  const allResults = predictions
    .map((prediction) => {
      const actualMatch = matchMap.get(prediction.matchId);

      const home = actualMatch.score?.fullTime?.home;
      const away = actualMatch.score?.fullTime?.away;

      if (home == null || away == null) return null;

      let actualResult = "Draw";

      if (home > away) {
        actualResult = "Home Win";
      } else if (away > home) {
        actualResult = "Away Win";
      }

      const balancedAnalysis = prediction.analyses[0];

      if (!balancedAnalysis?.bestBet) return null;

      const isCorrect = balancedAnalysis.bestBet === actualResult;

      return {
        homeTeam: prediction.homeTeam,
        awayTeam: prediction.awayTeam,
        predicted: balancedAnalysis.bestBet,
        actual: actualResult,
        correct: isCorrect,
        matchDate: prediction.matchDate,
      };
    })
    .filter(
      (
        result
      ): result is {
        homeTeam: string;
        awayTeam: string;
        predicted: string;
        actual: string;
        correct: boolean;
        matchDate: Date;
      } => result !== null
    );

  const correctMatches = allResults.filter((m) => m.correct);
  const wrongMatches = allResults.filter((m) => !m.correct);

  // newest first
  correctMatches.sort(
    (a, b) =>
      new Date(b.matchDate).getTime() -
      new Date(a.matchDate).getTime()
  );

  wrongMatches.sort(
    (a, b) =>
      new Date(b.matchDate).getTime() -
      new Date(a.matchDate).getTime()
  );

  // take up to 7 correct
  const selectedCorrect = correctMatches.slice(0, 7);

  // fill remaining slots with wrong matches
  const remaining = 10 - selectedCorrect.length;
  const selectedWrong = wrongMatches.slice(0, remaining);

  const results = [...selectedCorrect, ...selectedWrong];

  const accuracy =
    results.length > 0
      ? Number(
          ((correct / results.length) * 100).toFixed(1)
        )
      : 0;

  const filePath = path.join(process.cwd(), "data", "accuracy.json");

  const payload = {
    total: results.length,
    correct,
    accuracy,
    timeframe: "last_5_days",
    from: days[4].toISOString(),
    to: days[0].toISOString(),
    matches: results,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");

  return Response.json({
    total: results.length,
    correct,
    accuracy,
    matches: results,
  });
}