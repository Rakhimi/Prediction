import MatchPageClient from "./MatchPage";
import { prisma } from "@/lib/prisma";
import { getCurrentMember } from "@/lib/auth";

export default async function Page() {

  const member = await getCurrentMember();

  const isLoggedIn = true;

  const isActiveMember = true;

  const matches = await prisma.match.findMany({
    orderBy: {
      matchDate: "asc",
    },
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-black via-[#1a1410] to-black text-white">
      {/* Responsive margins: small on mobile, larger on desktop */}
      <div className="m-4 sm:m-8 md:m-12 lg:m-20 px-2 sm:px-4 md:px-6 space-y-4 sm:space-y-6 md:space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400">
            Match Predictions
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">
            Click on any match to view detailed statistics and analysis
          </p>
        </div>

        <MatchPageClient
          matches={matches}
          isLoggedIn={isLoggedIn}
          isMember={isActiveMember}
        />
      </div>
    </div>
  );
}