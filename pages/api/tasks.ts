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
                dueDate: new Date(req.body.dueDate), // Parse ISO string into Date object
            };
            delete data.patientName

            // Save the task to the database
            const task = await prisma.tasks.create({
                data,
            });

            return res.status(201).json(task);
        } catch (error) {
            console.error("Error creating task:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "GET") {
        try {
            const { dueDate } = req.query;
            const patientId = req.query.patientId as string || req.patient?.id;

            let tasks;
            if (dueDate) {
                const selectedDate = new Date(dueDate as string);

                // Fetch tasks filtered by dueDate and patientId
                tasks = await prisma.tasks.findMany({
                    where: {
                        patientId,
                        dueDate: {
                            gte: selectedDate,
                            lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Same day range
                        },
                    },
                    orderBy: { dueDate: "asc" },
                    include: {
                        patient: true,
                    },
                });
            } else {
                // Fetch all tasks for the authenticated user
                tasks = await prisma.tasks.findMany({
                    where: { patientId },
                    orderBy: { dueDate: "asc" },
                    include: {
                        patient: true,
                    },
                });
            }

            res.status(200).json(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "PATCH") {
        try {
            const { taskId } = req.body;
            const updatedTask = await prisma.tasks.update({
                where: { id: taskId },
                data: {
                    status: 'Completed',
                    completed: true,
                    completedDate: new Date(),
                    completedTime: new Date().toLocaleTimeString(),
                },
            });

            res.status(200).json(updatedTask);
        } catch (error) {
            console.error('Error completing task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});