/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Blog" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "isDeleted";
