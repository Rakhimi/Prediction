import { openai } from "@/lib/openai";

export async function analyzeMatch(homeTeam: string, awayTeam: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: `
You are a professional football betting analyst.

Analyze this match:

Home Team: ${homeTeam}
Away Team: ${awayTeam}

Return ONLY valid JSON:

{
  "homeTeamForm": ["W","L","D","L","W"],
  "awayTeamForm": ["L","L","W","D","W"],

  "odds": {
    "home": number,
    "draw": number,
    "away": number,
    "over25": number,
    "under25": number
  },

  "probabilities": {
    "homeWin": number,
    "draw": number,
    "awayWin": number
  },

  "headToHead": ["2-1", "0-0", "3-2", "1-1", "4-0"],

  "prediction": {
    "correctScore": "2-1",
    "ftHandicap": "Home -0.5",
    "bestBet": "Home Win"
  },

  "analysis": "betting-style paragraph (6-7 sentences max)"
}

Rules:
- Predict the most likely final score
- FT Handicap must be a realistic betting handicap
- Use common handicap lines:
  Home -0.25
  Home -0.5
  Home -0.75
  Home -1
  Away +0.25
  Away +0.5
  Away +0.75
  Away +1

- Probabilities must sum close to 100
- Keep analysis concise
- No markdown
- No explanation
- ONLY JSON
`,
      },
    ],
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text!);
  } catch (err) {
    console.error("JSON parse failed:", text);
    return null;
  }
}