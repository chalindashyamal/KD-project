import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "GET") {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const data = await prisma.user.findUniqueOrThrow({
                where: {
                    id: req.user.id,
                },
                select: {
                    id: true,
                    name: true,
                }
            });

            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching staff data:", error);
            res.status(500).json({ error: "Failed to fetch staff data" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})
