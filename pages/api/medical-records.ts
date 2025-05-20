import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const {
                patientId,
                recordType,
                date,
                provider,
                description,
            } = req.body;

            // Create a new medical record in the database
            const newMedicalRecord = await prisma.medicalRecord.create({
                data: {
                    patientId,
                    recordType,
                    date: new Date(date),
                    provider,
                    description,
                },
                include: {
                    patient: true,
                },
            });

            res.status(201).json(newMedicalRecord);
        } catch (error) {
            console.error("Error creating medical record:", error);
            res.status(500).json({ error: "Failed to create medical record." });
        }
    } else if (req.method === "GET") {
        try {
            // Fetch all medical records from the database
            const medicalRecords = await prisma.medicalRecord.findMany({
                include: {
                    patient: true,
                },
            });

            res.status(200).json(medicalRecords);
        } catch (error) {
            console.error("Error fetching medical records:", error);
            res.status(500).json({ error: "Failed to fetch medical records." });
        }
    } else if (req.method === "PUT") {
        try {
            const {
                id,
                patientId,
                recordType,
                date,
                provider,
                description,
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Medical record ID is required" });
            }

            // Update medical record in the database
            const updatedMedicalRecord = await prisma.medicalRecord.update({
                where: { id: parseInt(id) },
                data: {
                    patientId,
                    recordType,
                    date: new Date(date),
                    provider,
                    description,
                },
                include: {
                    patient: true,
                },
            });

            res.status(200).json(updatedMedicalRecord);
        } catch (error) {
            console.error("Error updating medical record:", error);
            res.status(500).json({ error: "Failed to update medical record." });
        }
    } else if (req.method === "DELETE") {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Medical record ID is required" });
            }

            // Delete medical record from the database
            await prisma.medicalRecord.delete({
                where: { id: parseInt(id) },
            });

            res.status(200).json({ message: "Medical record deleted successfully" });
        } catch (error) {
            console.error("Error deleting medical record:", error);
            res.status(500).json({ error: "Failed to delete medical record." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})