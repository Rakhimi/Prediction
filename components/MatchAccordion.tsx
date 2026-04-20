"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Match = {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date; 
  homeTeamForm: string;
  awayTeamForm: string;
  homeOdds: number | null; 
  drawOdds: number | null;
  awayOdds: number | null;
  analysis: string | null; 
};

export default function MatchAccordion({ matches }: { matches: Match[] }) {
  const renderForm = (form: string) => {
    return form.split(",").map((item, i) => {
      let color =
        item === "W"
          ? "bg-green-500"
          : item === "D"
          ? "bg-yellow-500"
          : "bg-red-500";

      return (
        <div
          key={i}
          className={`${color} text-white w-8 h-8 flex items-center justify-center rounded-full text-sm`}
        >
          {item}
        </div>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {matches.map((match) => (
          <AccordionItem
            key={match.matchId}
            value={match.matchId.toString()}
            className="border rounded-xl px-4"
          >
            <AccordionTrigger className="text-left cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold">
                  {match.homeTeam} vs {match.awayTeam}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(match.matchDate).toISOString().slice(0, 16).replace("T", " ")}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-6 pt-4">
              {/* FORM */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold mb-2">{match.homeTeam}</p>
                  <div className="flex gap-2">
                    {renderForm(match.homeTeamForm)}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2 text-right">
                    {match.awayTeam}
                  </p>
                  <div className="flex gap-2 justify-end">
                    {renderForm(match.awayTeamForm)}
                  </div>
                </div>
              </div>

              {/* ODDS */}
              <div>
                <p className="font-semibold mb-2">Betting Odds</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-300">Home</p>
                    <p className="font-bold text-lg">
                      {match.homeOdds?.toFixed(2) ?? "-"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-300">Draw</p>
                    <p className="font-bold text-lg">
                      {match.drawOdds?.toFixed(2) ?? "-"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-300">Away</p>
                    <p className="font-bold text-lg">
                      {match.awayOdds?.toFixed(2) ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ANALYSIS (LOWEST) */}
              <div>
                <p className="font-semibold mb-2">Analysis</p>
                <p className="text-gray-300 leading-relaxed">
                  {match.analysis}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}