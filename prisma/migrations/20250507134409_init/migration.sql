-- CreateTable
CREATE TABLE "Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "healthStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DonorMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DonorMessage_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
