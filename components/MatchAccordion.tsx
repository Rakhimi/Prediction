"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Match = {
  matchId: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date; 
  homeTeamForm: string | null;
  awayTeamForm: string | null;
  homeOdds: number | null; 
  drawOdds: number | null;
  awayOdds: number | null;
  over25Odds: number | null;
  under25Odds: number | null;
  homeWinProb: number | null;
  awayWinProb: number | null;
  drawProb: number | null;
  analysis: string | null;
  headToHead: string[] 
};

const getPrediction = (match: Match) => {
  if (!match.homeOdds || !match.drawOdds || !match.awayOdds)
    return "No prediction";

  const min = Math.min(match.homeOdds, match.drawOdds, match.awayOdds);

  if (min === match.homeOdds) return "Home Win";
  if (min === match.awayOdds) return "Away Win";
  return "Draw";
};

const getConfidence = (match: Match) => {
  if (!match.homeWinProb) return 0;
  return Math.max(
    match.homeWinProb ?? 0,
    match.drawProb ?? 0,
    match.awayWinProb ?? 0
  );
};

const TEAM_LOGO_MAP: Record<string, string> = {
  // PREMIER LEAGUE
  "Arsenal FC": "arsenal",
  "Aston Villa FC": "astonvilla",
  "AFC Bournemouth": "bournemouth",
  "Brentford FC": "brentford",
  "Brighton & Hove Albion FC": "brighton",
  "Burnley FC": "burnley",
  "Chelsea FC": "chelsea",
  "Crystal Palace FC": "crystalpalace",
  "Everton FC": "everton",
  "Fulham FC": "fulham",
  "Liverpool FC": "liverpool",
  "Luton Town FC": "luton",
  "Manchester City FC": "manchestercity",
  "Manchester United FC": "manchesterunited",
  "Newcastle United FC": "newcastle",
  "Nottingham Forest FC": "nottinghamforest",
  "Sheffield United FC": "sheffieldunited",
  "Tottenham Hotspur FC": "tottenham",
  "West Ham United FC": "westham",
  "Wolverhampton Wanderers FC": "wolves",
  "Sunderland AFC": "sunderland",
  "Leeds United FC": "leedsunited",

  // LA LIGA
  "Real Madrid CF": "realmadrid",
  "FC Barcelona": "barcelona",
  "Club Atlético de Madrid": "atleticomadrid",
  "Girona FC": "girona",
  "Athletic Club": "athleticclubbilbao",
  "Real Sociedad de Fútbol": "realsociedad",
  "Real Betis Balompié": "realbetis",
  "Valencia CF": "valencia",
  "Sevilla FC": "sevilla",
  "Villarreal CF": "villareal",
  "CA Osasuna": "osasuna",
  "RCD Mallorca": "mallorca",
  "Getafe CF": "getafe",
  "RC Celta de Vigo": "celta",
  "UD Las Palmas": "laspalmas",
  "Deportivo Alavés": "deportivoalaves",
  "Rayo Vallecano de Madrid": "rayovallecano",
  "Granada CF": "granada",
  "Cádiz CF": "cadiz",
  "UD Almería": "almeria",
  "Levante UD": "levante",
  "Elche CF": "elche",
  "RCD Espanyol de Barcelona": "espanyol",
  "Real Oviedo": "realoviedo",

  // SERIE A
  "Juventus FC": "juventus",
  "FC Internazionale Milano": "intermilan",
  "AC Milan": "acmilan",
  "SSC Napoli": "napoli",
  "AS Roma": "roma",
  "SS Lazio": "lazio",
  "Atalanta BC": "atalanta",
  "ACF Fiorentina": "fiorentina",
  "Bologna FC 1909": "bologna",
  "Torino FC": "torino",
  "Genoa CFC": "genoa",
  "US Lecce": "lecce",
  "Udinese Calcio": "udinese",
  "US Sassuolo Calcio": "sassuolo",
  "Cagliari Calcio": "cagliari",
  "Hellas Verona FC": "verona",
  "Empoli FC": "empoli",
  "Frosinone Calcio": "frosinone",
  "US Salernitana 1919": "salernitana",
  "AC Monza": "monza",
  "US Cremonese": "cremonese",
  "AC Pisa 1909": "pisa",
  "Parma Calcio 1913": "parma",

  // BUNDESLIGA
  "FC Bayern München": "bayernmunchen",
  "Borussia Dortmund": "borussiadortmund",
  "Bayer 04 Leverkusen": "bayerleverkusen",
  "RB Leipzig": "rbleipzig",
  "VfB Stuttgart": "vfbstuttgart",
  "Eintracht Frankfurt": "eintrachtfrankfurt",
  "VfL Wolfsburg": "wolfsburg",
  "SC Freiburg": "freiburg",
  "TSG 1899 Hoffenheim": "hoffenheim",
  "Borussia Mönchengladbach": "gladbach",
  "1. FC Union Berlin": "unionberlin",
  "1. FC Heidenheim 1846": "fcheidenheim",
  "SV Werder Bremen": "werderbremen",
  "FC Augsburg": "augsburg",
  "VfL Bochum 1848": "bochum",
  "1. FSV Mainz 05": "mainz05",
  "1. FC Köln": "koln",
  "SV Darmstadt 98": "darmstadt",
  "FC St. Pauli 1910": "stpauli",

  // LIGUE 1
  "Paris Saint-Germain FC": "parissaintgermain",
  "Olympique de Marseille": "marseille",
  "AS Monaco FC": "monaco",
  "Angers SCO": "angers",
  "Lille OSC": "lille",
  "Olympique Lyonnais": "lyon",
  "OGC Nice": "nice",
  "Racing Club de Lens": "rclens",
  "Stade Rennais FC 1901": "rennes",
  "Stade de Reims": "reims",
  "Montpellier HSC": "montpellier",
  "FC Nantes": "nantes",
  "RC Strasbourg Alsace": "rcstrasbourgalsace",
  "FC Metz": "fcmetz",
  "Toulouse FC": "toulouse",
  "Le Havre AC": "lehavre",
  "Clermont Foot 63": "clermont",
  "FC Lorient": "fclorient",
  "Stade Brestois 29": "brest",
  "AJ Auxerre": "auxerre",

  // WORLD CUP NATIONAL TEAMS
  "Argentina": "argentina",
  "Algeria": "algeria",
  "Austria": "austria",
  "Brazil": "brazil",
  "Bosnia and Herzegovina": "bosniaandherzegovina",
  "France": "france",
  "Cabo Verde": "carboverde",
  "Canada": "canada",
  "Colombia": "colombia",
  "Congo Dr": "congodr",
  "Cote D Ivoire": "cotedivoire",
  "Curaco": "curaco",
  "Czech Republic": "czechrepublic",
  "Ecuador": "ecuador",
  "Egypt": "egypt",
  "Ghana": "ghana",
  "Haiti": "haiti",
  "Iran": "iran",
  "Iraq": "iraq",
  "Jordan": "jordan",
  "New Zealand": "newzealand",
  "Norway": "norway",
  "Panama": "panama",
  "Paraguay": "paraguay",
  "Qatar": "qatar",
  "Saudi Arabia": "saudiarabia",
  "Scotland": "scotland",
  "South Africa": "southafrica",
  "Sweden": "sweden",
  "Tunisia": "tunisia",
  "Uzbekistan": "uzbekistan",
  "England": "england",
  "Germany": "germany",
  "Spain": "spain",
  "Portugal": "portugal",
  "Netherlands": "netherlands",
  "Belgium": "belgium",
  "Italy": "italy",
  "Croatia": "croatia",
  "Uruguay": "uruguay",
  "Mexico": "mexico",
  "USA": "usa",
  "Japan": "japan",
  "South Korea": "southkorea",
  "Australia": "australia",
  "Morocco": "morocco",
  "Senegal": "senegal",
  "Switzerland": "switzerland",
  "Denmark": "denmark",
  "Poland": "poland",
  "Serbia": "serbia",
  "Turkey": "turkey",
};

const getTeamLogo = (teamName: string) => {
  const mapped =
    TEAM_LOGO_MAP[teamName];

  if (mapped) {
    return `/club_logo/${mapped}.png`;
  }

  const normalized = teamName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return `/club_logo/${normalized}.png`;
};

export default function MatchAccordion({ matches }: { matches: Match[] }) {
  const renderForm = (form: string | null) => {
    if (!form) return null; // or return []

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
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <Accordion type="single" collapsible className="w-full space-y-6">
        {matches.map((match) => {
          const prediction = getPrediction(match);
          const confidence = getConfidence(match);

          return (
            <AccordionItem
              key={match.matchId}
              value={match.matchId.toString()}
              className="border border-orange-500/20 rounded-2xl overflow-hidden bg-gradient-to-r from-black via-[#1a1410] to-black"
            >
              <AccordionTrigger className="p-6 cursor-pointer hover:no-underline">
                
                {/* HEADER */}
                <div className="w-full space-y-6 text-left">
                  
                  {/* TOP ROW */}
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex gap-3 items-center">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
                        {match.league}
                      </span>
                      <span>
                        {new Date(match.matchDate)
                          .toISOString()
                          .slice(0, 16)
                          .replace("T", " ")}
                      </span>
                    </div>

                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                      {confidence}% Confidence
                    </span>
                  </div>

                  {/* TEAMS */}
                  <div className="flex items-center justify-between">
                    {/* HOME */}
                    <div className="flex items-center justify-end gap-3 w-1/3">
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-lg">{match.homeTeam}</p>
                        <div className="flex gap-1">
                          {renderForm(match.homeTeamForm)}
                        </div>
                      </div>

                      <img
                        src={getTeamLogo(match.homeTeam)}
                        alt={match.homeTeam}
                        className="w-14 h-14 object-contain"
                      />
                    </div>

                    <div className="text-gray-500 font-bold text-xl">VS</div>

                    {/* AWAY */}
                    <div className="flex items-center justify-start gap-3 w-1/3">
                      <img
                        src={getTeamLogo(match.awayTeam)}
                        alt={match.awayTeam}
                        className="w-14 h-14 object-contain"
                      />

                      <div className="flex flex-col items-start gap-2">
                        <p className="font-semibold text-lg">{match.awayTeam}</p>
                        <div className="flex gap-1">
                          {renderForm(match.awayTeamForm)}
                        </div>
                      </div>
                    </div>

                  </div>
                  {/* PREDICTION + ANALYSIS */}
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 space-y-3">
                    <div className="flex gap-4 items-center">
                      <p className="text-sm text-gray-400">AI Prediction</p>
                      <p className="text-orange-400 font-bold text-lg">
                        {prediction}
                      </p>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {match.analysis}
                    </p>
                  </div>

                  {/* ODDS (NOW IN HEADER) */}
                  <p className="font-semibold text-white">Betting Odds</p>

                  {/* MATCH WINNER */}
                  <div>
                    <p className="text-sm text-gray-400 mb-3">Match Winner (1X2)</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl text-center bg-gradient-to-br from-orange-500/20 to-orange-700/10 border border-orange-500/30">
                        <p className="text-sm text-gray-400">Home</p>
                        <p className="font-bold text-xl text-orange-400">
                          {match.homeOdds?.toFixed(2) ?? "-"}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl text-center bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 border border-yellow-500/30">
                        <p className="text-sm text-gray-400">Draw</p>
                        <p className="font-bold text-xl text-yellow-400">
                          {match.drawOdds?.toFixed(2) ?? "-"}
                        </p>
                      </div>

                      <div className="p-5 rounded-xl text-center bg-gradient-to-br from-red-500/20 to-red-700/10 border border-red-500/30">
                        <p className="text-sm text-gray-400">Away</p>
                        <p className="font-bold text-xl text-red-400">
                          {match.awayOdds?.toFixed(2) ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </AccordionTrigger>

              {/* EXPANDED CONTENT */}
              <AccordionContent className="p-6 pb-8 space-y-8 border-t border-orange-500/10">

              {/* BETTING ODDS */}
              <div className="space-y-4">

                {/* OVER / UNDER */}
                <div>
                  <p className="text-sm text-gray-400 mb-3">Goals Over/Under 2.5</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl text-center bg-gradient-to-br from-green-500/20 to-green-700/10 border border-green-500/30">
                      <p className="text-sm text-gray-400">Over 2.5</p>
                      <p className="font-bold text-xl text-green-400">
                        {match.over25Odds?.toFixed(2) ?? "-"}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl text-center bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-500/30">
                      <p className="text-sm text-gray-400">Under 2.5</p>
                      <p className="font-bold text-xl text-blue-400">
                        {match.under25Odds?.toFixed(2) ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROBABILITIES */}
              <p className="font-semibold text-white">Probability</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-black/30 text-center">
                  <p className="text-sm text-gray-400">Home Win %</p>
                  <p className="font-bold text-green-400">
                    {match.homeWinProb ?? "-"}%
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-black/30 text-center">
                  <p className="text-sm text-gray-400">Draw %</p>
                  <p className="font-bold text-yellow-400">
                    {match.drawProb ?? "-"}%
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-black/30 text-center">
                  <p className="text-sm text-gray-400">Away Win %</p>
                  <p className="font-bold text-red-400">
                    {match.awayWinProb ?? "-"}%
                  </p>
                </div>
              </div>

              {/* HEAD TO HEAD */}
              <div className="space-y-2">
                
                {/* TITLE ROW */}
                <div className="flex items-center gap-2 flex-wrap leading-none">
                  <span className="font-semibold text-white">
                    Head-to-Head:
                  </span>

                  <span className="text-green-300 font-medium">
                    {match.homeTeam}
                  </span>

                  <span className="text-gray-500">vs</span>

                  <span className="text-red-300 font-medium">
                    {match.awayTeam}
                  </span>
                </div>

                <p className="text-sm text-gray-400">Last 5 meetings</p>

                {/* MATCH LIST */}
                <div className="space-y-2">
                  {match.headToHead?.map((game, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/5"
                    >
                      <span className="text-gray-300 text-sm">{game}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}