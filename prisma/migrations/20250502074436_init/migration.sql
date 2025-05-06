-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodType" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactRelation" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insurancePolicyNumber" TEXT NOT NULL,
    "insuranceGroupNumber" TEXT,
    "primaryDiagnosis" TEXT NOT NULL,
    "diagnosisDate" DATETIME NOT NULL,
    "notes" TEXT
);
INSERT INTO "new_Patient" ("address", "bloodType", "dateOfBirth", "diagnosisDate", "email", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "firstName", "gender", "id", "insuranceGroupNumber", "insurancePolicyNumber", "insuranceProvider", "lastName", "notes", "phone", "primaryDiagnosis") SELECT "address", "bloodType", "dateOfBirth", "diagnosisDate", "email", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "firstName", "gender", "id", "insuranceGroupNumber", "insurancePolicyNumber", "insuranceProvider", "lastName", "notes", "phone", "primaryDiagnosis" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT,
    "specialty" TEXT,
    "department" TEXT,
    "patientId" TEXT,
    CONSTRAINT "User_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("department", "id", "name", "password", "role", "specialty", "username") SELECT "department", "id", "name", "password", "role", "specialty", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_patientId_key" ON "User"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
