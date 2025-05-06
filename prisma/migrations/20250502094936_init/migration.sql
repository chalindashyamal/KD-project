/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "dueTime" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "notes" TEXT,
    "completedBy" TEXT,
    "completedDate" DATETIME,
    "completedTime" TEXT,
    CONSTRAINT "Tasks_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
