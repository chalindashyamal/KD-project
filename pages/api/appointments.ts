import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient()

const formSchema = z.object({
  type: z.string({
    required_error: "Please select an appointment type.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  location: z.string().min(1, {
    message: "Please select a location.",
  }),
  notes: z.string().optional(),
})

export default withAuth(async function handler(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method === "POST") {
    try {
      const patientId = req.query.patientId as string || req.patient!.id

      // Validate the request body
      const data = formSchema.parse({
        ...req.body,
        date: new Date(req.body.date), // Parse ISO string into Date object
      })

      // Save the appointment to the database
      const appointment = await prisma.appointment.create({
        data: {
          type: data.type,
          date: data.date,
          time: data.time,
          location: data.location,
          notes: data.notes || null,
          patientId,
        },
      })

      return res.status(201).json(appointment)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors })
      }
      return res.status(500).json({ error: "Internal Server Error" })
    }
  } else if (req.method === "GET") {
    try {
      const { date } = req.query
      const patientId = req.query.patientId as string || req.patient?.id

      let appointments
      if (date) {
        const selectedDate = new Date(date as string)

        // Fetch appointments filtered by date and patientId
        appointments = await prisma.appointment.findMany({
          where: {
            patientId,
            date: {
              gte: selectedDate,
              lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Same day range
            },
          },
          orderBy: { date: "asc" },
          include: {
            patient: true,
          },
        })
      } else {
        // Fetch all appointments for the authenticated user
        appointments = await prisma.appointment.findMany({
          where: { patientId },
          orderBy: { date: "asc" },
          include: {
            patient: true,
          },
        })
      }

      res.status(200).json(appointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
})
