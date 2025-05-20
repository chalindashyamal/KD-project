import { PrismaClient } from '@/generated/prisma';
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
          patient: true,
        },
      });

      res.status(200).json(labOrders);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
      res.status(500).json({ error: "Failed to fetch lab orders." });
    }
  } else if (req.method === "PUT") {
    try {
      const {
        id,
        patientId,
        testType,
        orderedDate,
        dueDate,
        priority,
        status,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Lab order ID is required" });
      }

      // Update lab order in the database
      const updatedLabOrder = await prisma.labTest.update({
        where: { id: parseInt(id) },
        data: {
          patientId,
          testType,
          orderedDate: new Date(orderedDate),
          dueDate: new Date(dueDate),
          priority,
          status,
        },
        include: {
          patient: true,
        },
      });

      res.status(200).json(updatedLabOrder);
    } catch (error) {
      console.error("Error updating lab order:", error);
      res.status(500).json({ error: "Failed to update lab order." });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Lab order ID is required" });
      }

      // Delete lab order from the database
      await prisma.labTest.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Lab order deleted successfully" });
    } catch (error) {
      console.error("Error deleting lab order:", error);
      res.status(500).json({ error: "Failed to delete lab order." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
})