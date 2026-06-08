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

export default function MatchPageClient({
  matches,
  isLoggedIn,
  isMember,
}: {
  matches: any[];
  isLoggedIn: boolean | null | undefined;
  isMember: boolean | null | undefined;
}) {
  const [tab, setTab] = useState<"upcoming" | "today" | "completed">("upcoming");
  const [search, setSearch] = useState("");
  const today = new Date();

  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const [fromDate, setFromDate] = useState<Date | undefined>(today);
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
  const previewMatches = filteredMatches.length > 0 
    ? filteredMatches.slice(0, Math.min(5, filteredMatches.length))
    : [];

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">

      {/* TABS - Full width on mobile */}
      <div className="flex gap-2 sm:gap-4 w-full">
        {["upcoming", "today", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer text-sm sm:text-base md:text-base font-medium ${
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
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-5">
        {/* Row 1 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by team or league..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-12
                px-4
                rounded-xl
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
              h-12
              px-6
              rounded-xl
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

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* League */}
          <div className="space-y-2">
            <Label className="text-zinc-300">
              League
            </Label>

            <Select value={league} onValueChange={setLeague}>
              <SelectTrigger className="h-12">
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
          <div className="space-y-2">
            <Label className="text-zinc-300">
              From Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-black/40
                    border border-white/10
                    text-white
                    flex items-center justify-between
                  "
                >
                  {fromDate
                    ? format(fromDate, "MMMM do, yyyy")
                    : "Select Date"}

                  <CalendarIcon className="h-4 w-4 opacity-60" />
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
          <div className="space-y-2">
            <Label className="text-zinc-300">
              To Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-black/40
                    border border-white/10
                    text-white
                    flex items-center justify-between
                  "
                >
                  {toDate
                    ? format(toDate, "MMMM do, yyyy")
                    : "Select Date"}

                  <CalendarIcon className="h-4 w-4 opacity-60" />
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

      {/* MATCH LIST */}
      <div className="relative">
        {isMember ? (
          filteredMatches.length > 0 ? (
            <MatchAccordion matches={filteredMatches} />
          ) : (
            <div className="text-gray-400 text-center py-12 text-base sm:text-lg bg-black/30 rounded-xl">
              No matches found
            </div>
          )
        ) : (
          <div className="relative rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden min-h-[550px]">
            {/* blurred preview - Only show if there are matches */}
            {previewMatches.length > 0 ? (
              <div className="blur-md pointer-events-none opacity-40">
                <MatchAccordion matches={previewMatches} />
              </div>
            ) : (
              // Show placeholder when no matches to preview
              <div className="bg-black/20 p-8 min-h-[550px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No matches found</p>
                  <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
                </div>
              </div>
            )}

            {/* lock overlay - Always full size, no scroll */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-10 p-6 sm:p-8">
              <div className="max-w-md w-full text-center">
                <div className="bg-teal-500/10 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-5 border-2 border-teal-500/30">
                  <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-teal-500" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                  Premium Members Only
                </h2>

                <p className="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">
                  Deposit a minimum of <span className="text-teal-400 font-bold">RM50</span> to unlock 1 month of access to:
                </p>

                <div className="space-y-2 mb-8 text-left">
                  <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                    <span>AI match predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                    <span>Detailed analysis & insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                    <span>Winning strategies</span>
                  </div>
                </div>

                {!isLoggedIn ? (
                  <button
                    onClick={openRegister}
                    className="
                      w-full px-6 py-3.5 rounded-xl
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
                    className="w-full px-6 py-3.5 rounded-xl bg-teal-500 text-black font-bold inline-flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Deposit RM50+
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}