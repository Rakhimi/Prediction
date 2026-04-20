import { openai } from "@/lib/openai";

export async function analyzeMatch(homeTeam: string, awayTeam: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // cheaper + good enough
    messages: [
      {
        role: "user",
        content: `
You are a football match analyst.

Analyze the upcoming match:

Home Team: ${homeTeam}
Away Team: ${awayTeam}

Return ONLY valid JSON:

{
  "homeTeamForm": ["W","L","D","L","W"],
  "awayTeamForm": ["L","L","W","D","W"],
  "odds": {
    "home": number,
    "draw": number,
    "away": number
  },
  "analysis": "short paragraph"
}

Rules:
- EXACT JSON ONLY
- No extra text
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