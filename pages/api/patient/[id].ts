import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
    const { id } = req.query

    if (req.method === "GET") {
        try {
            // Fetch patient data by ID
            const patient = await prisma.patient.findUnique({
                where: { id: id as string },
            })

            if (!patient) {
                return res.status(404).json({ error: "Patient not found" })
            }

            res.status(200).json(patient)
        } catch (error) {
            console.error("Error fetching patient data:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    } else if (req.method === "DELETE") {
        try {
            // Delete the patient by ID
            await prisma.patient.delete({
                where: { id: String(id) },
            });

            res.status(200).json({ message: "Patient deleted successfully." });
        } catch (error: any) {
            console.error("Error deleting patient:", error.message);
            res.status(500).json({ error: "Failed to delete patient." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" })
    }
})
