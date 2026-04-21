/*
  Warnings:

  - Added the required column `league` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "awayWinProb" DOUBLE PRECISION,
ADD COLUMN     "drawProb" DOUBLE PRECISION,
ADD COLUMN     "headToHead" TEXT[],
ADD COLUMN     "homeWinProb" DOUBLE PRECISION,
ADD COLUMN     "league" TEXT NOT NULL,
ADD COLUMN     "over25Odds" DOUBLE PRECISION,
ADD COLUMN     "under25Odds" DOUBLE PRECISION;
