-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DialysisSessions" (
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
INSERT INTO "new_DialysisSessions" ("assignedTo", "duration", "id", "machine", "patientId", "room", "scheduledEnd", "scheduledStart", "startedAt", "status") SELECT "assignedTo", "duration", "id", "machine", "patientId", "room", "scheduledEnd", "scheduledStart", "startedAt", "status" FROM "DialysisSessions";
DROP TABLE "DialysisSessions";
ALTER TABLE "new_DialysisSessions" RENAME TO "DialysisSessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
