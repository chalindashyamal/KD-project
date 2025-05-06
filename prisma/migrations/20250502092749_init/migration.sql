-- CreateTable
CREATE TABLE "DialysisSessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "machine" TEXT NOT NULL,
    "scheduledStart" DATETIME NOT NULL,
    "scheduledEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "assignedTo" TEXT NOT NULL,
    CONSTRAINT "DialysisSessions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
