-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "Score" INTEGER NOT NULL,
    "classement" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_userid_key" ON "Score"("userid");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
