export async function getFootballMatches() {
  const today = new Date().toISOString().split("T")[0];

  const next7DaysDate = new Date();
  next7DaysDate.setDate(new Date().getDate() + 7);
  const next7 = next7DaysDate.toISOString().split("T")[0];

  const res = await fetch(
    `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${next7}`,
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_KEY!,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.matches || [];
}