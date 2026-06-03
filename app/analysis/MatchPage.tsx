"use client";

import { useState, useMemo } from "react";
import MatchAccordion from "@/components/MatchAccordion";
import { Lock, Wallet } from "lucide-react";
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
  isMember: boolean | null | undefined
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
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">

      {/* TABS - Mobile optimized */}
      <div className="flex gap-2 sm:gap-4">
        {["upcoming", "today", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer text-xs sm:text-sm md:text-base ${
              tab === t
                ? "bg-teal-500 text-black font-semibold"
                : "bg-black/30 border-white/10 hover:bg-teal-500/20"
            }`}
          >
            {t === "upcoming"
              ? "Upcoming"
              : t === "today"
              ? "Today"
              : "Completed"}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER - Mobile responsive grid */}
      <div className="flex flex-col gap-3 sm:gap-4">
        
        {/* Search - Full width on mobile */}
        <input
          type="text"
          placeholder="Search by team or league..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
        />
        
        {/* Filters grid - 2 columns on mobile, row on desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 sm:gap-4">
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
            className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 border border-white/10 cursor-pointer text-sm sm:text-base"
          />

          {/* TO DATE */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 border border-white/10 cursor-pointer text-sm sm:text-base"
          />

          {/* RESET - Full width on mobile when in column layout */}
          <button
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
            className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/10 hover:bg-teal-500/20 transition cursor-pointer text-sm sm:text-base md:col-span-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* MATCH LIST */}
      <div className="relative">
        {isMember ? (
          <MatchAccordion matches={filteredMatches} />
        ) : (
          <div className="relative rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">

            {/* blurred preview */}
            <div className="blur-sm pointer-events-none opacity-60">
              <MatchAccordion matches={filteredMatches.slice(0, 3)} />
            </div>

            {/* lock overlay - Mobile optimized */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 px-4 sm:px-6 text-center overflow-y-auto py-8 sm:py-10">
              <div className="max-w-md w-full">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500 mb-3 sm:mb-4 mx-auto" />

                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Premium Members Only
                </h2>

                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  Deposit a minimum of RM50 to unlock 1 month of access to AI match predictions,
                  detailed analysis and winning insights.
                </p>

                {!isMember ? (
                  <a
                    href="https://new8myr.com"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-teal-500 text-black font-bold hover:bg-teal-400 transition inline-block text-sm sm:text-base"
                  >
                    Join Now
                  </a>
                ) : (
                  <a
                    href="/api/deposit"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-teal-500 text-black font-bold hover:bg-teal-400 transition inline-flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                    Deposit RM50+
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredMatches.length === 0 && (
        <p className="text-gray-400 text-center py-8 text-sm sm:text-base">No matches found</p>
      )}
    </div>
  );
}