-- CreateEnum
CREATE TYPE "EventPriority" AS ENUM ('SUPER_LOW', 'LOW', 'MEDIUM', 'HIGH', 'SUPER_HIGH');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'DONE', 'CANCELED');

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "priority" "EventPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
