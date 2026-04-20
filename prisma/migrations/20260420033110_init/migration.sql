-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "homeTeamForm" TEXT NOT NULL,
    "awayTeamForm" TEXT NOT NULL,
    "homeOdds" DOUBLE PRECISION,
    "drawOdds" DOUBLE PRECISION,
    "awayOdds" DOUBLE PRECISION,
    "analysis" TEXT,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchId_key" ON "Match"("matchId");
