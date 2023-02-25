/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `currency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symbol` to the `currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currency" ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "currency_symbol_key" ON "currency"("symbol");
