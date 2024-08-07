/*
  Warnings:

  - Added the required column `BloodPint` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `HospitalName` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RequiredBy` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "BloodPint" TEXT NOT NULL,
ADD COLUMN     "HospitalName" TEXT NOT NULL,
ADD COLUMN     "RequiredBy" TEXT NOT NULL;
