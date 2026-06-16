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
      bestBet: {
        not: null,
      },
    },
    take: 50, // increase limit for 5 days
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

  const results = predictions.map((prediction) => {
    const actualMatch = matchMap.get(prediction.matchId);

    if (!actualMatch) return null;

    let actualResult = "Draw";

    if (actualMatch.score?.winner === "HOME_TEAM") {
      actualResult = "Home Win";
    }

    if (actualMatch.score?.winner === "AWAY_TEAM") {
      actualResult = "Away Win";
    }

    const isCorrect = prediction.bestBet === actualResult;

    if (isCorrect) correct++;

    return {
      homeTeam: prediction.homeTeam,
      awayTeam: prediction.awayTeam,
      predicted: prediction.bestBet,
      actual: actualResult,
      correct: isCorrect,
    };
  }).filter(Boolean);

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