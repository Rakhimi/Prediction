import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tv, TrendingUp, UserPlus, Wallet, Trophy, Target, Activity, ChartColumn, Award } from "lucide-react";
import AccuracyTrendChart from "@/components/AccuracyTrendChart";
import PredictionDistribution from "@/components/PredictionDistribution";
import WeeklyActivityChart from "@/components/WeeklyActivityChart";

//LnkZgFmzrmLQUZGf

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner Section (2/3 height) */}
      <div className="relative h-[66vh] w-full">
        <Image
          src="/images/hero-background-BhZp_O0d.jpg"
          alt="Banner"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay (optional dark layer for readability) */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h1
            className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
              font-bold mb-3 sm:mb-4 md:mb-6
              leading-[1.5]
              bg-gradient-to-r
              from-[hsl(var(--primary-extra-light))]
              via-[hsl(var(--primary-light))]
              to-[hsl(var(--primary-glow))]
              bg-clip-text text-transparent
              animate-gradient-slide
              drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]
              font-cuprum
            "
          >
            Win Big with AI-Powered Predictions
          </h1>

          <h2
            className="
              text-xl font-semibold text-gray-400
              max-w-xl text-center
            "
          >
            Get accurate match predictions based on advanced analytics and historical data.
            Make smarter betting decisions today
          </h2>

          <div className="flex gap-4">
            <Button
              className="
                inline-flex items-center justify-center gap-2
                font-semibold
                bg-gradient-to-r
                from-[hsl(var(--primary-light))]
                to-[hsl(var(--primary-dark))]
                text-white
                h-11 rounded-lg
                text-sm sm:text-base md:text-lg
                px-5 sm:px-6 md:px-8
                transition-all duration-300
                hover:scale-105
                hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                cursor-pointer
              "
            >
              View Predictions
              <TrendingUp className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              className="
                inline-flex items-center justify-center gap-2
                font-semibold
                bg-gradient-to-r
                from-[hsl(var(--primary-light))]
                to-[hsl(var(--primary-dark))]
                text-white
                h-11 rounded-lg
                text-sm sm:text-base md:text-lg
                px-5 sm:px-6 md:px-8
                transition-all duration-300
                hover:scale-105
                hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                cursor-pointer
              "
            >
              Live Streaming
              <Tv className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Remaining Content */}
      <div className="flex-1 bg-background">
        {/* Subscribe Section */}
      <section className="bg-black/95 py-12 px-6 border-y border-teal-500/20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          
          {/* Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-600 uppercase tracking-tight">
              Subscribe now to Unlock All Predictions
            </h2>
            <a href="#" className="text-teal-500 text-sm underline hover:text-teal-600 transition-colors">
              More details
            </a>
          </div>

          {/* Steps Container */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
            
            {/* Step 1 */}
            <div className="flex items-center gap-4">
              <span className="text-teal-500 font-bold text-sm">STEP 1 &gt;</span>
              <div className="p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <UserPlus className="w-6 h-6 text-teal-500" />
              </div>
              <div className="text-white text-sm leading-tight">
                Create mescoreAI<br />Account
              </div>
            </div>

            <span className="hidden md:block text-teal-500 font-bold">&gt;</span>

            {/* Step 2 */}
            <div className="flex items-center gap-4">
              <span className="text-teal-500 font-bold text-sm">STEP 2 &gt;</span>
              <div className="p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Wallet className="w-6 h-6 text-teal-500" />
              </div>
              <div className="text-white text-sm leading-tight">
                Deposit a minimum of<br />RM50/SGD50 in me88
              </div>
            </div>

            <span className="hidden md:block text-teal-500 font-bold">&gt;</span>

            {/* Step 3 */}
            <div className="flex items-center gap-4">
              <span className="text-teal-500 font-bold text-sm">STEP 3 &gt;</span>
              <div className="p-3 rounded-full border-2 border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Trophy className="w-6 h-6 text-teal-500" />
              </div>
              <div className="text-white text-sm">Start Winning</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="mt-4 bg-teal-500 hover:bg-teal-600 text-black font-bold px-10 py-6 text-lg rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all hover:scale-105 cursor-pointer"
          >
            Join me88 Now
          </Button>
          
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
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
                bg-[#111] border border-white/5 rounded-2xl p-8 
                flex flex-col items-center text-center 
                transition-all duration-300 ease-out
                hover:-translate-y-3 
                hover:scale-105 
                hover:border-teal-500/40
                hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                cursor-default
              "
            >
              {/* Top Gradient Box */}
              <div className="
                w-full bg-gradient-to-b from-teal-400 to-teal-600 
                rounded-xl py-4 mb-6 flex justify-center items-center 
                shadow-[0_0_15px_rgba(20,184,166,0.3)]
                transition-transform duration-300
                group-hover:scale-110 /* Extra pop for the icon box */
              ">
                <stat.icon className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>

              {/* Stats Content */}
              <div className="space-y-1">
                <h3 className="text-4xl font-bold text-teal-500 font-cuprum">
                  {stat.value}
                </h3>
                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>

              {/* Subtle Divider */}
              <div className="w-12 h-[1px] bg-white/10 my-6 transition-colors group-hover:bg-teal-500/30" />

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

      <section className="bg-black py-12 px-4">
        <div className="flex gap-4 mb-10">
        <AccuracyTrendChart/>
        <PredictionDistribution/>
        </div>
        <WeeklyActivityChart/>
      </section>
      </div>
    </div>
  );
}