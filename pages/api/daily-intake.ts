import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            if (!req.patient) {
                return res.status(403).json({ error: "Forbidden" })
            }
            const patientId = req.patient.id

            const { intake } = req.body

            if (typeof intake !== "number" || intake < 0) {
                return res.status(400).json({ error: "Invalid intake value" })
            }

            const today = new Date()
            today.setHours(0, 0, 0, 0) // Start of the day

            const updatedDailyIntake = await prisma.dailyIntake.upsert({
                where: { date: today, patientId },
                update: { intake },
                create: { date: today, intake, patientId },
            })

            res.status(200).json(updatedDailyIntake)
        } catch (error) {
            res.status(500).json({ error: "Failed to update daily intake data" })
        }
    } else if (req.method === "GET") {
        try {
            // Fetch the last 7 days of daily intake data
            type WeeklyData = {
                day: string
                amount: number
                current: boolean
            }

            const today = new Date()
            today.setHours(0, 0, 0, 0) // Start of the day

            // Calculate the start date (7 days ago)
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 6)

            // Fetch data for the last 7 days
            const weeklyIntake = await prisma.dailyIntake.findMany({
                where: {
                    date: {
                        gte: startDate,
                        lte: today,
                    },
                },
                orderBy: {
                    date: 'asc',
                },
            })

            // Map the results to include the day of the week and current day flag
            const result: WeeklyData[] = weeklyIntake.map((entry) => {
                const date = new Date(entry.date)
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }) // e.g., Monday
                return {
                    day: dayOfWeek,
                    amount: entry.intake,
                    current: date.getTime() === today.getTime(),
                }
            })

            // Fill in the missing days with zero intake
            const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const filledResult: WeeklyData[] = allDays.map((day) => {
                const entry = result.find((entry) => entry.day === day)
                return {
                    day,
                    amount: entry ? entry.amount : 0,
                    current: entry ? entry.current : day === allDays[new Date().getDay()], // Check if it's the current day
                }
            })

            // Return the data
            res.status(200).json(filledResult)
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch daily intake data" })
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})