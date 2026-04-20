import MatchAccordion from "@/components/MatchAccordion";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const matches = await prisma.match.findMany({
    orderBy: {
      matchDate: "asc",
    },
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-black via-[#1a1410] to-black border-b border-teal-500/10 text-white">
    <div className="m-20 px-6">
      <MatchAccordion matches={matches} />
    </div>
    </div>
  );
}