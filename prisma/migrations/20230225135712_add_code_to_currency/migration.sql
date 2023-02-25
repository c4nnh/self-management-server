/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `currency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `currency` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "currency_name_key";

-- DropIndex
DROP INDEX "currency_symbol_key";

-- AlterTable
ALTER TABLE "currency" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "currency_code_key" ON "currency"("code");
