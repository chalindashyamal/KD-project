import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { patientId, weekday, weekend } = req.body;

      // Validate input
      if (!patientId || typeof patientId !== "string") {
        return res.status(400).json({ error: "Invalid or missing patientId" });
      }
      if (!weekday || !weekend) {
        return res.status(400).json({ error: "Missing weekday or weekend data" });
      }

      // Ensure patient exists
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      // Create diet plan
      const dietPlan = await prisma.dietPlan.create({
        data: {
          patientId,
          weekday: JSON.stringify(weekday), // Serialize to string
          weekend: JSON.stringify(weekend), // Serialize to string
        },
      });

      return res.status(201).json({
        ...dietPlan,
        weekday: JSON.parse(dietPlan.weekday), // Parse for response
        weekend: JSON.parse(dietPlan.weekend), // Parse for response
      });
    } else if (req.method === "GET") {
      if (!req.patient) {
        return res.status(400).json({ error: "Invalid or missing patientId" });
      }

      const dietPlans = await prisma.dietPlan.findMany({
        where: { patientId: req.patient.id },
        orderBy: { createdAt: "desc" },
      });

      // Parse weekday and weekend strings
      const parsedDietPlans = dietPlans.map((plan) => ({
        ...plan,
        weekday: JSON.parse(plan.weekday),
        weekend: JSON.parse(plan.weekend),
      }));

      return res.status(200).json(parsedDietPlans);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
})
