import { PrismaClient } from '@/generated/prisma';
import { z } from "zod";
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// Define the Zod schema for vitals data
const vitalsFormSchema = z.object({
    patientId: z.string({
        required_error: "Please select a patient.",
    }),
    temperature: z.string().optional(),
    systolic: z.string().optional(),
    diastolic: z.string().optional(),
    heartRate: z.string().optional(),
    respiratoryRate: z.string().optional(),
    oxygenSaturation: z.string().optional(),
    weight: z.string().optional(),
    notes: z.string().optional(),
});

export default withAuth(async function handler(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "POST") {
        try {
            // Validate the request body
            const data = vitalsFormSchema.parse(req.body);

            // Save the vitals data to the database
            const vitals = await prisma.vitals.create({
                data: {
                    patientId: data.patientId,
                    temperature: data.temperature || null,
                    systolic: data.systolic || null,
                    diastolic: data.diastolic || null,
                    heartRate: data.heartRate || null,
                    respiratoryRate: data.respiratoryRate || null,
                    oxygenSaturation: data.oxygenSaturation || null,
                    weight: data.weight || null,
                    notes: data.notes || null,
                },
            });

            return res.status(201).json(vitals);
        } catch (error) {
            console.error("Error saving vitals:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "GET") {
        try {
            const { patientId, date } = req.query;

            if (!patientId) {
                return res.status(400).json({ error: "Patient ID is required." });
            }

            let vitals;
            if (date) {
                const selectedDate = new Date(date as string);

                // Fetch vitals filtered by date and patientId
                vitals = await prisma.vitals.findMany({
                    where: {
                        patientId: patientId as string,
                        createdAt: {
                            gte: selectedDate,
                            lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Same day range
                        },
                    },
                    orderBy: { createdAt: "asc" },
                });
            } else {
                // Fetch all vitals for the patient
                vitals = await prisma.vitals.findMany({
                    where: { patientId: patientId as string },
                    orderBy: { createdAt: "asc" },
                });
            }

            res.status(200).json(vitals);
        } catch (error) {
            console.error("Error fetching vitals:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});