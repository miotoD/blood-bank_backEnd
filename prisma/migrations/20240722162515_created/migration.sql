-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "BLoodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'AB_POSIITVE', 'AB_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" "Role" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "Id" SERIAL NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "BloodType" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "BloodDonation" (
    "Id" SERIAL NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "BloodDonation_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonation" ADD CONSTRAINT "BloodDonation_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
