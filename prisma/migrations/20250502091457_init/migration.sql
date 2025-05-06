/*
  Warnings:

  - A unique constraint covering the columns `[patientId,medicationId,date,time]` on the table `MedicationSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MedicationSchedule_medicationId_date_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "MedicationSchedule_patientId_medicationId_date_time_key" ON "MedicationSchedule"("patientId", "medicationId", "date", "time");
