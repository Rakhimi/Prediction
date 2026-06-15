export async function getFootballMatchesPast2Days() {
  const todayDate = new Date();

  const past2Days = new Date();
  past2Days.setDate(todayDate.getDate() - 7);

  const dateFrom = past2Days
    .toISOString()
    .split("T")[0];

  const dateTo = todayDate
    .toISOString()
    .split("T")[0];

  const res = await fetch(
    `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
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