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
  "homeTeamForm": [string, string, string, string, string],
  "awayTeamForm": [string, string, string, string, string],

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

  "headToHead": [string, string, string, string, string],

  "prediction": {
    "correctScore": string,
    "ftHandicap": string,
    "bestBet": string
  },

  "analysis": "betting-style paragraph (6-7 sentences max)"
}

Rules:
- homeTeamForm and awayTeamForm must contain exactly 5 values.
- Each value must be one of:
  W = Win
  D = Draw
  L = Loss

Example:
["W","W","D","L","W"]

- headToHead must contain exactly 5 score results.
- Use realistic football scores.
- Format:
  "2-1"
  "0-0"
  "3-2"

Example:
["2-1","0-0","3-2","1-1","4-0"]

- correctScore must be a realistic football score.
Examples:
"1-0"
"2-1"
"2-2"
"3-1"

- bestBet must be one of:
Home Win
Away Win
Draw

- Ensure bestBet aligns with probabilities and predicted score.
- Ensure no contradictions between probabilities, handicap, score prediction, and bestBet.
- Return ONLY valid JSON.
- Probabilities must sum close to 100
- Keep analysis concise
- No markdown
- No explanation
- ONLY JSON

IMPORTANT CONSISTENCY RULES:

1. If Over 2.5 odds are LOW (e.g. 1.20–1.60):
   - match must be high scoring
   - correctScore must include at least 3 total goals
   - ftHandicap must be more aggressive (e.g. Home -1.25, -1.5, -2, -2.5)

2. If Over 2.5 odds are HIGH:
   - lower scoring match
   - handicap must be small (-0.25 to -1)

3. ftHandicap MUST be Asian Handicap ONLY:
   Allowed values:
   Home -0.25 to -3.0 (step 0.25)
   Away +0.25 to +3.0 (step 0.25)

4. DO NOT use European handicap format like "-1 or +1 only"

5. If match is high scoring:
  - Over 2.5 low odds
  - probability should favor Over 2.5 (>55%)
  - correctScore must be 2-1, 3-1, 2-2, 3-2
  - ftHandicap must be -1.0 or stronger

6. If match is low scoring:
  - Under 2.5 favored
  - draw probability higher
  - correctScore 0-0, 1-0, 1-1
  - ftHandicap -0.25 to -0.75 only

ALL FIELDS MUST BE INTERNALLY CONSISTENT.

You must treat:
- odds
- probabilities
- correctScore
- ftHandicap
- bestBet

as one connected system.

If any value contradicts another, adjust ALL values to match.

DO NOT generate unrelated or random values.

Every field must be derived from:
- team strength
- odds
- goal expectation

If uncertain, prefer conservative (low variance) predictions.

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