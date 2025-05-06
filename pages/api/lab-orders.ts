import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        patientId,
        testType,
        orderedDate,
        dueDate,
        priority,
      } = req.body;

      // Create a new lab order in the database
      const newLabOrder = await prisma.labTest.create({
        data: {
          patientId,
          testType,
          orderedDate: new Date(orderedDate),
          dueDate: new Date(dueDate),
          priority,
          status: "Ordered",
        },
        include: {
          patient: true,
        },
      });

      res.status(201).json(newLabOrder);
    } catch (error) {
      console.error("Error creating lab order:", error);
      res.status(500).json({ error: "Failed to create lab order." });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all lab orders from the database
      const labOrders = await prisma.labTest.findMany({
        include: {
          patient: true, // Include related patient information
        },
      });

      res.status(200).json(labOrders);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
      res.status(500).json({ error: "Failed to fetch lab orders." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
})