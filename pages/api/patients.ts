import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const patients = await prisma.patient.findMany({
                include: {
                    allergies: true, // Include related allergies if needed
                },
            });

            res.status(200).json(patients);
        } catch (error: any) {
            console.error("Error fetching patients:", error.message);
            res.status(500).json({ error: "Failed to fetch patient data." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});