-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_currencyId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "currencyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
