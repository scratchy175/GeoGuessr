/*
  Warnings:

  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userid_fkey";

-- DropTable
DROP TABLE "Score";

-- CreateTable
CREATE TABLE "Game" (
    "game_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "map_type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Round" (
    "round_id" SERIAL NOT NULL,
    "game_id" TEXT NOT NULL,
    "round_nb" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "user_point" TEXT NOT NULL,
    "map_point" TEXT NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("round_id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
