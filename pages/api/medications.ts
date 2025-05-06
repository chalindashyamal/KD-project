import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { name, dosage, frequency, time, instructions } = req.body;

            // Create a new medication in the database
            const newMedication = await prisma.medication.create({
                data: {
                    patientId: req.patient!.id,
                    name,
                    dosage,
                    frequency,
                    times: time.join(","), // Store times as a comma-separated string
                    instructions,
                },
            });

            res.status(201).json(newMedication);
        } catch (error) {
            console.error("Error saving medication:", error);
            res.status(500).json({ error: "Failed to save medication data." });
        }
    } else if (req.method === "GET") {
        try {
            // Fetch all medications from the database
            const medications = await prisma.medication.findMany();

            res.status(200).json(medications.map(medication => ({
                ...medication,
                times: medication.times.split(","), // Convert comma-separated string back to array
            }))
            );
        } catch (error) {
            console.error("Error fetching medications:", error);
            res.status(500).json({ error: "Failed to fetch medications." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})
