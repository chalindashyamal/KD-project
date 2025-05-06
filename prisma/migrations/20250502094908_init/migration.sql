-- CreateTable
CREATE TABLE "Task" (
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
    CONSTRAINT "Task_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
