import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const patientId = req.body.patientId || req.patient!.id;
            let medicationId = req.body.medicationId;
            if (!medicationId) {
                medicationId = await prisma.medication.findFirst({
                    where: {
                        //name: req.body.medication,
                    },
                }).then(x => x?.id)
            }
            const administeredBy = req.body.administeredBy || "";

            await prisma.medicationSchedule.upsert({
                create: {
                    medicationId,
                    patientId,
                    date: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
                    time: req.body.time,
                    taken: true,
                    takenAt: new Date(), // Current date and time
                    AdministeredBy: administeredBy,
                },
                update: {
                    taken: true,
                    takenAt: new Date(), // Current date and time
                    AdministeredBy: administeredBy,
                },
                where: {
                    patientId_medicationId_date_time: {
                        patientId,
                        medicationId,
                        date: new Date(new Date().setHours(0, 0, 0, 0)),
                        time: req.body.time,
                    },
                },
            })

            res.status(201).json({ message: "Medication marked as taken successfully!" });
        } catch (error) {
            console.error("Error saving medication:", error);
            res.status(500).json({ error: "Failed to save medication data." });
        }
    } else if (req.method === "GET") {
        try {
            const date = req.query.date as string | undefined;

            // Default to today's date if not provided
            const start = date ? new Date(date) : new Date()

            const medications = await prisma.medication.findMany({
                include: {
                    MedicationSchedule: {
                        where: {
                            date: {
                                gte: new Date(start.setHours(0, 0, 0, 0)), // Start of the day
                                lte: new Date(start.setHours(23, 59, 59, 999)), // End of the day
                            },
                        },
                    },
                    patient: true,
                },
            });

            type Medication = {
                id: number
                patientId: string
                patient: any
                name: string
                dosage: string
                times: string[]
                instructions: string
                status: { time: string; taken: boolean, takenAt: Date }[]
            }

            res.status(200).json(medications.map(medication => {
                const times = medication.times.split(",")
                return {
                    id: medication.id,
                    patientId: medication.patientId,
                    patient: medication.patient,
                    name: medication.name,
                    dosage: medication.dosage,
                    times,
                    instructions: medication.instructions,
                    status: times.map(time => {
                        const schedule = medication.MedicationSchedule.find(schedule => schedule.time === time);
                        return {
                            time,
                            taken: schedule ? schedule.taken : false,
                            takenAt: schedule ? schedule.takenAt : null,
                        }
                    }),
                } as Medication
            })
            );
        } catch (error) {
            console.error("Error fetching medications:", error);
            res.status(500).json({ error: "Failed to fetch medications." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})
