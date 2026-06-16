'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrendingUp, UserPlus, Wallet, Trophy, Target, Activity, ChartColumn, Award } from "lucide-react";
import AccuracyTrendChart from "@/components/AccuracyTrendChart";
import PredictionDistribution from "@/components/PredictionDistribution";
import WeeklyActivityChart from "@/components/WeeklyActivityChart";
import ChooseCard from "@/components/ChooseCard";
import { useAuthModal } from "@/stores/useAuthModal";
import { useRouter } from "next/navigation";
import { getAccuracy } from "./actions/getAccuracy";

//LnkZgFmzrmLQUZGf

export default async function Home() {


  const openRegister = useAuthModal((s) => s.openRegister);
  const router = useRouter();

  const accuracyData = await getAccuracy();


  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner Section (2/3 height) */}
      <div className="relative h-[60vh] sm:h-[66vh] w-full">
        <Image
          src="/images/tortoise.jpeg"
          alt="Banner"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay (optional dark layer for readability) */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4">
          <h1
            className="
              text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl
              font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6
              leading-[1.3] sm:leading-[1.4] md:leading-[1.5]
              bg-gradient-to-r
              from-[hsl(var(--primary-extra-light))]
              via-[hsl(var(--primary-light))]
              to-[hsl(var(--primary-glow))]
              bg-clip-text text-transparent
              animate-gradient-slide
              drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]
              font-cuprum
              text-center
            "
          >
            Win Big with AI-Powered Predictions
          </h1>

          <h2
            className="
              text-sm sm:text-base md:text-lg lg:text-xl
              font-semibold text-gray-400
              max-w-xs sm:max-w-sm md:max-w-xl
              text-center
              px-2
            "
          >
            Get accurate match predictions based on advanced analytics and historical data.
            Make smarter betting decisions today
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button
              onClick={() => router.push("/analysis")}
              className="
                inline-flex items-center justify-center gap-2
                font-semibold
                bg-gradient-to-r
                from-[hsl(var(--primary-light))]
                to-[hsl(var(--primary-dark))]
                text-white
                h-10 sm:h-11 rounded-lg
                text-xs sm:text-sm md:text-base lg:text-lg
                px-4 sm:px-5 md:px-6 lg:px-8
                transition-all duration-300
                hover:scale-105
                hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                cursor-pointer
                w-full sm:w-auto
              "
            >
              View Predictions
              <TrendingUp className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Remaining Content */}
      <div className="flex-1 bg-background">
        {/* Subscribe Section */}
        <section className="bg-black/95 py-8 sm:py-12 px-4 sm:px-6 border-y border-teal-500/20">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
            
            {/* Title */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-600 uppercase tracking-tight">
                Subscribe now to Unlock All Predictions
              </h2>

              <a href="#" className="text-teal-500 text-xs sm:text-sm underline hover:text-teal-600 transition-colors">
                More details
              </a>
            </div>

            {/* Steps Container */}
            <div className="font-semibold flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-8 w-full">

              {/* Step 1 */}
              <div className="flex items-center gap-3 w-fit justify-start md:justify-center">
                <span className="text-teal-500 font-bold text-xs sm:text-sm">STEP 1</span>

                <span className="text-teal-500 font-bold text-xs sm:text-sm md:inline hidden">&gt;</span>

                <div className="p-2 sm:p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                </div>

                <div className="text-white text-xs sm:text-sm leading-tight text-left">
                  Create New8scoreai<br />Account
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 w-fit justify-start md:justify-center">
                <span className="text-teal-500 font-bold text-xs sm:text-sm">STEP 2</span>

                <span className="text-teal-500 font-bold text-xs sm:text-sm md:inline hidden">&gt;</span>

                <div className="p-2 sm:p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                </div>

                <div className="text-white text-xs sm:text-sm leading-tight text-left">
                  Deposit a minimum of<br />RM50 in New8
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3 w-fit justify-start md:justify-center">
                <span className="text-teal-500 font-bold text-xs sm:text-sm">STEP 3</span>

                <span className="text-teal-500 font-bold text-xs sm:text-sm md:inline hidden">&gt;</span>

                <div className="p-2 sm:p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
                </div>

                <div className="text-white text-xs sm:text-sm text-left">
                  Start Winning
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={openRegister}
              className="mt-2 sm:mt-4 bg-teal-500 hover:bg-teal-600 text-black font-bold px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all hover:scale-105 cursor-pointer animate-blink w-full sm:w-auto"
            >
              Join New8 Now
            </Button>

          </div>
        </section>

        {/* Stats Section - Mobile optimized grid */}
        <section className="bg-black py-8 sm:py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {[
              { label: "Accuracy Rate", value: "87%", trend: "↑ 3% this month", icon: Target },
              { label: "Active Users", value: "10K+", trend: "↑ 12% this week", icon: Activity },
              { label: "Matches Analyzed", value: "100K+", trend: "↑ 35 today", icon: ChartColumn },
              { label: "User Satisfaction", value: "94%", trend: "↑ 2% this quarter", icon: Award },
            ].map((stat, index) => (
              <div 
                key={index}
                className="
                  relative group 
                  bg-[#111] border border-white/5 rounded-2xl p-6 sm:p-8 
                  flex flex-col items-center text-center 
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 sm:hover:-translate-y-3 
                  hover:scale-[1.02] sm:hover:scale-105 
                  hover:border-teal-500/40
                  hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                  cursor-default
                "
              >
                {/* Top Gradient Box */}
                <div className="
                  w-full bg-gradient-to-b from-teal-400 to-teal-600 
                  rounded-xl py-3 sm:py-4 mb-4 sm:mb-6 flex justify-center items-center 
                  shadow-[0_0_15px_rgba(20,184,166,0.3)]
                  transition-transform duration-300
                  group-hover:scale-105 sm:group-hover:scale-110
                ">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-black" strokeWidth={2.5} />
                </div>

                {/* Stats Content */}
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-bold text-teal-500 font-cuprum">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>

                {/* Subtle Divider */}
                <div className="w-12 h-[1px] bg-white/10 my-4 sm:my-6 transition-colors group-hover:bg-teal-500/30" />

                {/* Trend Footer */}
                <p className="text-emerald-500 text-xs font-medium tracking-tight">
                  {stat.trend}
                </p>

                {/* Background Glow that "appears" on hover */}
                <div className="
                  absolute inset-0 
                  bg-gradient-to-b from-teal-500/5 to-transparent 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 
                  rounded-2xl pointer-events-none
                " />
              </div>
            ))}

          </div>
        </section>
        {/* Yesterday Performance */}
        <section className="bg-black py-8 sm:py-12 px-4 border-y border-teal-500/10">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Yesterday Performance
              </h2>

              <p className="text-gray-400 mt-2">
                Based on the latest 10 completed matches
              </p>
            </div>

            {/* Accuracy Card */}
            <div className="mb-8 bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">

              <p className="text-gray-400 text-sm">
                Prediction Accuracy
              </p>

              <h3 className="text-5xl font-bold text-teal-400 mt-2">
                {accuracyData.accuracy}%
              </h3>

              <p className="text-gray-300 mt-2">
                {accuracyData.correct} Correct / {accuracyData.total} Matches
              </p>
            </div>

            {/* Results Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">

              <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/10 text-xs sm:text-sm text-gray-400 font-semibold">
                <div>Match</div>
                <div>Prediction</div>
                <div>Actual</div>
                <div>Result</div>
              </div>

              {accuracyData.matches.map((match: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 px-4 py-4 border-b border-white/5 text-xs sm:text-sm items-center"
                >
                  <div className="text-white">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>

                  <div className="text-orange-400">
                    {match.predicted}
                  </div>

                  <div className="text-cyan-400">
                    {match.actual}
                  </div>

                  <div>
                    {match.correct ? (
                      <span className="text-green-400 font-bold">
                        ✅ Correct
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold">
                        ❌ Wrong
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Charts Section - Mobile responsive */}
        <section className="bg-black py-8 sm:py-12 px-4">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="flex-1">
              <AccuracyTrendChart />
            </div>
            <div className="flex-1">
              <PredictionDistribution />
            </div>
          </div>
          <div className="mb-6 sm:mb-10">
            <WeeklyActivityChart />
          </div>
          <ChooseCard />
        </section>
      </div>
    </div>
  );
}