import { PrismaClient } from '@/generated/prisma';
import { z } from "zod";
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "POST") {
        try {
            // Validate the request body
            const data = {
                ...req.body,
                duration: parseInt(req.body.duration, 10),
                scheduledStart: new Date(req.body.scheduledStart),
                scheduledEnd: new Date(req.body.scheduledEnd),
            };

            // Save the dialysis session to the database
            const dialysisSession = await prisma.dialysisSessions.create({
                data: {
                    patientId: data.patientId,
                    room: data.room,
                    machine: data.machine,
                    scheduledStart: data.scheduledStart,
                    scheduledEnd: data.scheduledEnd,
                    duration: data.duration,
                    assignedTo: data.assignedTo,
                    status: "Scheduled", // Default status
                    startedAt: "", // Default value
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
    } else if (req.method === "GET") {
        try {
            const { patientId, date } = req.query;

            let dialysisSessions;
            if (date) {
                const selectedDate = new Date(date as string);

                // Fetch dialysis sessions filtered by date and patientId
                dialysisSessions = await prisma.dialysisSessions.findMany({
                    where: {
                        patientId: patientId as string,
                        scheduledStart: {
                            gte: selectedDate,
                            lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Same day range
                        },
                    },
                    include: {
                        patient: true,
                    },
                    orderBy: { scheduledStart: "asc" },
                });
            } else {
                // Fetch all dialysis sessions for the authenticated user
                dialysisSessions = await prisma.dialysisSessions.findMany({
                    where: { patientId: patientId as string },
                    orderBy: { scheduledStart: "asc" },
                    include: {
                        patient: true,
                    },
                });
            }

            res.status(200).json(dialysisSessions);
        } catch (error) {
            console.error("Error fetching dialysis sessions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});