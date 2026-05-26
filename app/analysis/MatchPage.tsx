"use client";

import { useState, useMemo } from "react";
import MatchAccordion from "@/components/MatchAccordion";
import { Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MatchPageClient({
  matches,
  isMember,
}: {
  matches: any[];
  isMember: boolean;
}) {
  const [tab, setTab] = useState<"upcoming" | "today" | "completed">("upcoming");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [league, setLeague] = useState("all");

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
        if (league === "all") return true;

        return match.league === league;
      })
      .filter((match) => {
        const matchDate = new Date(match.matchDate);

        if (fromDate && matchDate < new Date(fromDate))
          return false;

        if (toDate && matchDate > new Date(toDate))
          return false;

        return true;
      });
  }, [matches, tab, search, fromDate, toDate, league]);

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
        <Select
          value={league}
          onValueChange={setLeague}
        >
          <SelectTrigger size="default" className="w-full md:w-[240px]">
            <SelectValue placeholder="Select League" />
          </SelectTrigger>

          <SelectContent
            className="
              bg-[#111]
              border border-white/10
              text-white
            "
          >
            <SelectItem value="all">
              All Leagues
            </SelectItem>

            <SelectItem value="Premier League">
              Premier League
            </SelectItem>

            <SelectItem value="Primera Division">
              La Liga
            </SelectItem>

            <SelectItem value="Serie A">
              Serie A
            </SelectItem>

            <SelectItem value="Bundesliga">
              Bundesliga
            </SelectItem>

            <SelectItem value="Ligue 1">
              Ligue 1
            </SelectItem>

            <SelectItem value="UEFA Champions League">
              Champions League
            </SelectItem>

            <SelectItem value="FIFA World Cup">
              World Cup
            </SelectItem>
          </SelectContent>
        </Select>

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
      <div className="relative">
        {!isMember ? (
          <MatchAccordion matches={filteredMatches} />
        ) : (
          <div className="relative rounded-2xl border border-white/10 overflow-hidden">

            {/* blurred preview */}
            <div className="blur-sm pointer-events-none opacity-60">
              <MatchAccordion matches={filteredMatches.slice(0, 3)} />
            </div>

            {/* lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 px-6 text-center">
              <Lock className="w-10 h-10 text-teal-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Premium Members Only
              </h2>
              <p className="text-gray-300 mb-6 max-w-md">
                Unlock full match predictions, AI analysis and winning insights.
              </p>

              <a
                href="https://new8myr.com"
                className="px-6 py-3 rounded-xl bg-teal-500 text-black font-bold hover:bg-teal-400 transition"
              >
                Join Now
              </a>
            </div>
          </div>
        )}
      </div>

      {filteredMatches.length === 0 && (
        <p className="text-gray-400 text-center">No matches found</p>
      )}
    </div>
  );
}