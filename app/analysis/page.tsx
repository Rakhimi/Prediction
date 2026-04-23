import MatchPageClient from "./MatchPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const matches = await prisma.match.findMany({
    orderBy: {
      matchDate: "asc",
    },
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-black via-[#1a1410] to-black text-white">
      <div className="m-20 px-6 space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-teal-400">
            Match Predictions
          </h1>
          <p className="text-gray-400 text-sm">
            Click on any match to view detailed statistics and analysis
          </p>
        </div>

        <MatchPageClient matches={matches} />
      </div>
    </div>
  );
}