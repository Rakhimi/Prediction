"use client";

import { useState, useMemo } from "react";
import MatchAccordion from "@/components/MatchAccordion";

export default function MatchPageClient({ matches }: { matches: any[] }) {
  const [tab, setTab] = useState<"upcoming" | "today" | "completed">("upcoming");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const now = new Date();

  const filteredMatches = useMemo(() => {
    return matches
      .filter((match) => {
        const matchDate = new Date(match.matchDate);

        if (tab === "today") {
          return matchDate.toDateString() === now.toDateString();
        }

        if (tab === "upcoming") {
          return matchDate > now;
        }

        if (tab === "completed") {
          return matchDate < now;
        }

        return true;
      })
      .filter((match) => {
        const text = `${match.homeTeam} ${match.awayTeam} ${match.league}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
      .filter((match) => {
        const matchDate = new Date(match.matchDate);

        if (fromDate && matchDate < new Date(fromDate)) return false;
        if (toDate && matchDate > new Date(toDate)) return false;

        return true;
      });
  }, [matches, tab, search, fromDate, toDate]);

  return (
    <div className="space-y-6">

      {/* TABS */}
      <div className="flex gap-4">
        {["upcoming", "today", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-3 rounded-xl border transition-all cursor-pointer ${
              tab === t
                ? "bg-teal-500 text-black font-semibold"
                : "bg-black/30 border-white/10 hover:bg-teal-500/20"
            }`}
          >
            {t === "upcoming"
              ? "Upcoming Matches"
              : t === "today"
              ? "Today's Matches"
              : "Completed Matches"}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by team or league..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* FROM DATE */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer"
        />

        {/* TO DATE */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer"
        />

        {/* RESET */}
        <button
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
          }}
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-teal-500/20 transition cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* MATCH LIST */}
      <div className="cursor-pointer">
        <MatchAccordion matches={filteredMatches} />
      </div>

      {filteredMatches.length === 0 && (
        <p className="text-gray-400 text-center">No matches found</p>
      )}
    </div>
  );
}