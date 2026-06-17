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
import { useAuthModal } from "@/stores/useAuthModal";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type MatchAnalysis = {
  id: number;
  strategy: string;

  homeTeamForm: string | null;
  awayTeamForm: string | null;

  homeOdds: number | null;
  drawOdds: number | null;
  awayOdds: number | null;

  over25Odds: number | null;
  under25Odds: number | null;

  homeWinProb: number | null;
  drawProb: number | null;
  awayWinProb: number | null;

  headToHead: string[];

  correctScore: string | null;
  ftHandicap: string | null;
  bestBet: string | null;

  analysis: string | null;
};

type Match = {
  matchId: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;

  analyses: MatchAnalysis[];
};

export default function MatchPageClient({
  matches,
  isLoggedIn,
  isMember,
}: {
  matches: Match[];
  isLoggedIn: boolean | null | undefined;
  isMember: boolean | null | undefined;
}) {
  const [tab, setTab] = useState<"upcoming" | "today" | "completed">("upcoming");
  const [search, setSearch] = useState("");
  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const [fromDate, setFromDate] = useState<Date | undefined>(last7Days);
  const [toDate, setToDate] = useState<Date | undefined>(next7Days);

  const [league, setLeague] = useState("all");

  const now = new Date();

  const openRegister = useAuthModal((s) => s.openRegister);

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

        if (fromDate && matchDate < fromDate) {
          return false;
        }

        if (toDate) {
          const endDate = new Date(toDate);
          endDate.setHours(23, 59, 59, 999);

          if (matchDate > endDate) {
            return false;
          }
        }

        return true;
      })
  }, [matches, tab, search, fromDate, toDate, league]);

  // Determine how many matches to show in preview (at least 3, but not more than available)

  // If not member, show lock screen without scrolling through content
  if (!isMember) {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* TABS - Responsive sizing */}
        <div className="flex gap-1.5 sm:gap-4 w-full">
          {["upcoming", "today", "completed"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer text-xs sm:text-sm md:text-base font-medium ${
                tab === t
                  ? "bg-teal-500 text-black font-semibold"
                  : "bg-black/30 border-white/10 hover:bg-teal-500/20 text-white"
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

        {/* SEARCH + FILTER - Mobile optimized */}
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-5 space-y-3 sm:space-y-5">
          {/* Row 1 */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by team or league..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  h-10 sm:h-12
                  px-3 sm:px-4
                  text-sm sm:text-base
                  rounded-lg sm:rounded-xl
                  bg-black/40
                  border border-white/10
                  text-white
                  placeholder:text-zinc-500
                  focus:ring-2
                  focus:ring-teal-500
                  focus:outline-none
                "
              />
            </div>

            <button
              onClick={() => {
                const today = new Date();
                const next7Days = new Date();
                next7Days.setDate(today.getDate() + 7);

                setSearch("");
                setLeague("all");
                setFromDate(today);
                setToDate(next7Days);
              }}
              className="
                h-10 sm:h-12
                px-4 sm:px-6
                text-sm sm:text-base
                rounded-lg sm:rounded-xl
                border
                border-white/10
                bg-black/40
                hover:bg-white/5
                text-white
                font-medium
                transition
                whitespace-nowrap
              "
            >
              Reset
            </button>
          </div>

          {/* Row 2 - Stacks on mobile, grid on desktop */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4">
            {/* League */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-zinc-300 text-xs sm:text-sm">
                League
              </Label>

              <Select value={league} onValueChange={setLeague}>
                <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                  <SelectValue placeholder="All Leagues" />
                </SelectTrigger>

                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="all">All Leagues</SelectItem>
                  <SelectItem value="Premier League">Premier League</SelectItem>
                  <SelectItem value="Primera Division">La Liga</SelectItem>
                  <SelectItem value="Serie A">Serie A</SelectItem>
                  <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                  <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                  <SelectItem value="UEFA Champions League">
                    Champions League
                  </SelectItem>
                  <SelectItem value="FIFA World Cup">
                    World Cup
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-zinc-300 text-xs sm:text-sm">
                From Date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="
                      w-full
                      h-10 sm:h-12
                      px-3 sm:px-4
                      text-xs sm:text-sm
                      rounded-lg sm:rounded-xl
                      bg-black/40
                      border border-white/10
                      text-white
                      flex items-center justify-between
                    "
                  >
                    <span className="truncate">
                      {fromDate
                        ? format(fromDate, "MMM do, yyyy")
                        : "Select Date"}
                    </span>

                    <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-60 flex-shrink-0" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto p-0 bg-[#111] border-white/10"
                >
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-zinc-300 text-xs sm:text-sm">
                To Date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="
                      w-full
                      h-10 sm:h-12
                      px-3 sm:px-4
                      text-xs sm:text-sm
                      rounded-lg sm:rounded-xl
                      bg-black/40
                      border border-white/10
                      text-white
                      flex items-center justify-between
                    "
                  >
                    <span className="truncate">
                      {toDate
                        ? format(toDate, "MMM do, yyyy")
                        : "Select Date"}
                    </span>

                    <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-60 flex-shrink-0" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto p-0 bg-[#111] border-white/10"
                >
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* LOCK OVERLAY - Fixed height, centered content */}
        <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-black/20 min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 py-8 sm:py-12 max-w-md w-full mx-auto">
            <div className="bg-teal-500/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 border-2 border-teal-500/30">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-500" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-white">
              Premium Members Only
            </h2>

            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
              Deposit a minimum of <span className="text-teal-400 font-bold">RM50</span> to unlock 1 month of access to:
            </p>

            <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm md:text-base">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span>AI match predictions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm md:text-base">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span>Detailed analysis & insights</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm md:text-base">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                <span>Winning strategies</span>
              </div>
            </div>

            {!isLoggedIn ? (
              <button
                onClick={openRegister}
                className="
                  w-full max-w-sm mx-auto
                  px-4 sm:px-6
                  py-2.5 sm:py-3.5
                  text-sm sm:text-base
                  rounded-lg sm:rounded-xl
                  bg-teal-500 text-black font-bold
                  hover:bg-teal-400 transition
                  cursor-pointer
                "
              >
                Join New8 Now
              </button>
            ) : (
              <a
                href="/api/deposit"
                className="
                  w-full max-w-sm mx-auto
                  px-4 sm:px-6
                  py-2.5 sm:py-3.5
                  text-sm sm:text-base
                  rounded-lg sm:rounded-xl
                  bg-teal-500 text-black font-bold
                  inline-flex items-center justify-center gap-2
                "
              >
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                Deposit RM50+
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Member view - show actual matches
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* TABS - Responsive sizing */}
      <div className="flex gap-1.5 sm:gap-4 w-full">
        {["upcoming", "today", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer text-xs sm:text-sm md:text-base font-medium ${
              tab === t
                ? "bg-teal-500 text-black font-semibold"
                : "bg-black/30 border-white/10 hover:bg-teal-500/20 text-white"
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

      {/* SEARCH + FILTER - Mobile optimized */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-5 space-y-3 sm:space-y-5">
        {/* Row 1 */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by team or league..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-10 sm:h-12
                px-3 sm:px-4
                text-sm sm:text-base
                rounded-lg sm:rounded-xl
                bg-black/40
                border border-white/10
                text-white
                placeholder:text-zinc-500
                focus:ring-2
                focus:ring-teal-500
                focus:outline-none
              "
            />
          </div>

          <button
            onClick={() => {
              const today = new Date();
              const next7Days = new Date();
              next7Days.setDate(today.getDate() + 7);

              setSearch("");
              setLeague("all");
              setFromDate(today);
              setToDate(next7Days);
            }}
            className="
              h-10 sm:h-12
              px-4 sm:px-6
              text-sm sm:text-base
              rounded-lg sm:rounded-xl
              border
              border-white/10
              bg-black/40
              hover:bg-white/5
              text-white
              font-medium
              transition
              whitespace-nowrap
            "
          >
            Reset
          </button>
        </div>

        {/* Row 2 - Stacks on mobile, grid on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4">
          {/* League */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-zinc-300 text-xs sm:text-sm">
              League
            </Label>

            <Select value={league} onValueChange={setLeague}>
              <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>

              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="all">All Leagues</SelectItem>
                <SelectItem value="Premier League">Premier League</SelectItem>
                <SelectItem value="Primera Division">La Liga</SelectItem>
                <SelectItem value="Serie A">Serie A</SelectItem>
                <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                <SelectItem value="UEFA Champions League">
                  Champions League
                </SelectItem>
                <SelectItem value="FIFA World Cup">
                  World Cup
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-zinc-300 text-xs sm:text-sm">
              From Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="
                    w-full
                    h-10 sm:h-12
                    px-3 sm:px-4
                    text-xs sm:text-sm
                    rounded-lg sm:rounded-xl
                    bg-black/40
                    border border-white/10
                    text-white
                    flex items-center justify-between
                  "
                >
                  <span className="truncate">
                    {fromDate
                      ? format(fromDate, "MMM do, yyyy")
                      : "Select Date"}
                  </span>

                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-60 flex-shrink-0" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-auto p-0 bg-[#111] border-white/10"
              >
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-zinc-300 text-xs sm:text-sm">
              To Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="
                    w-full
                    h-10 sm:h-12
                    px-3 sm:px-4
                    text-xs sm:text-sm
                    rounded-lg sm:rounded-xl
                    bg-black/40
                    border border-white/10
                    text-white
                    flex items-center justify-between
                  "
                >
                  <span className="truncate">
                    {toDate
                      ? format(toDate, "MMM do, yyyy")
                      : "Select Date"}
                  </span>

                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-60 flex-shrink-0" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-auto p-0 bg-[#111] border-white/10"
              >
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* MATCH LIST - Only visible to members */}
      {filteredMatches.length > 0 ? (
        <MatchAccordion matches={filteredMatches} />
      ) : (
        <div className="text-gray-400 text-center py-12 text-sm sm:text-lg bg-black/30 rounded-xl">
          No matches found
        </div>
      )}
    </div>
  );
}