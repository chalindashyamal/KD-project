import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const data = req.body

            const ids = await prisma.patient.findMany({ select: { id: true } })
            //generate a new id not in the existing ids
            const existingIds = ids.map((patient) => patient.id)
            let newId = ''
            while (1) {
                newId = 'PT-' + Math.floor(Math.random() * 1000).toString()
                if (!existingIds.includes(newId)) {
                    break
                }
            }

            const newPatient = await prisma.patient.create({
                data: {
                    ...data,
                    id: newId,
                    dateOfBirth: new Date(data.dateOfBirth),
                    diagnosisDate: new Date(data.diagnosisDate),
                    allergies: { create: data.allergies },
                },
            });

            res.status(201).json(newPatient)
        } catch (error: any) {
            console.log("Error saving patient:", error.message)
            res.status(500).json({ error: "Failed to save patient data." })
        }
    } else if (req.method === "GET") {
        try {
            const id = req.user.patientId
            if (!id) {
                return res.status(400).json({ error: "Patient ID is required" })
            }

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
    } else {
        res.status(405).json({ error: "Method Not Allowed" })
    }
})
