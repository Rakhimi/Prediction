"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/football-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.error("API Error:", data);
          setMatches([]); // prevent crash
        }
      });
  }, []);

  const handleAnalyze = async (match: any) => {
    setLoadingId(match.id);

    await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify(match),
    });

    setLoadingId(null);
    alert("Analysis stored!");
  };

  {matches.length === 0 && (
    <p className="text-gray-400">No matches found</p>
  )}

  return (
    <div className="m-20 px-6 space-y-6">
      {matches.map((match) => (
        <div
          key={match.id}
          className="border p-4 rounded-xl shadow"
        >
          <h2 className="text-lg font-bold">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h2>

          <p>{new Date(match.utcDate).toLocaleString()}</p>

          <button
            onClick={() => handleAnalyze(match)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loadingId === match.id}
          >
            {loadingId === match.id
              ? "Analyzing..."
              : "Analyze & Store"}
          </button>
        </div>
      ))}
    </div>
  );
}