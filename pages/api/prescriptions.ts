import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        patientId,
        medication,
        dosage,
        frequency,
        prescribedDate,
        expiryDate,
        refills,
        time,
        instructions,
      } = req.body;

      // Create a new prescription in the database
      const newPrescription = await prisma.prescription.create({
        data: {
          patientId,
          medication,
          dosage,
          frequency,
          prescribedDate: new Date(prescribedDate),
          expiryDate: new Date(expiryDate),
          refills: parseInt(refills, 10),
          status: parseInt(refills, 10) > 0 ? "Active" : "Needs Refill",
        },
        include: {
          patient: true,
        },
      });

      
      // Create a new medication in the database
      const newMedication = await prisma.medication.create({
          data: {
              patientId,
              name: medication,
              dosage,
              frequency,
              times: time.join(","), // Store times as a comma-separated string
              instructions,
          },
      });

      res.status(201).json(newPrescription);
    } catch (error) {
      console.error("Error creating prescription:", error);
      res.status(500).json({ error: "Failed to create prescription." });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all prescriptions from the database
      const prescriptions = await prisma.prescription.findMany({
        include: {
          patient: true, // Include related patient information
        },
      });

      res.status(200).json(prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ error: "Failed to fetch prescriptions." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
})