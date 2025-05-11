import { PrismaClient } from '@/generated/prisma';
import { z } from "zod";
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        if (!req.staff) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const sessionId = req.query.id as string;
            const status = req.body.status as string;
            const startedAt = status === "In Progress" ? new Date().toISOString() : undefined;

            const dialysisSession = await prisma.dialysisSessions.update({
                where: { id: sessionId },
                data: {
                    status,
                    startedAt: startedAt,
                },
            });

            return res.status(201).json(dialysisSession);
        } catch (error) {
            console.error("Error creating dialysis session:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});