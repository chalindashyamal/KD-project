import { PrismaClient } from '@/generated/prisma';
import { z } from "zod";
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            if (!req.patient) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { name, bloodType, contact, relationship, healthStatus, status } = req.body;

            const data = { name, bloodType, contact, relationship, healthStatus, status };

            const newDonor = await prisma.donor.create({
                data,
            });

            res.status(201).json(newDonor);
        } catch (error) {
            console.error("Error creating donor:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            res.status(500).json({ error: "Failed to create donor" });
        }
    } else if (req.method === "GET") {
        try {
            if (!req.patient) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const donors = await prisma.donor.findMany();

            res.status(200).json(donors);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch donors" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});
