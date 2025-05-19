import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema for patient validation
const patientSchema = z.object({
  id: z.string().min(1, "Patient ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

const deleteSchema = z.object({
  id: z.string().min(1, "Patient ID is required"),
});

export default withAuth(async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const patients = await prisma.patient.findMany({
        include: {
          allergies: true,
        },
      });
      patients.forEach((p: any) => {
        p.status = p.activeTime == new Date().toDateString() ? "Active" : "Stable";
      });

      res.status(200).json(patients);
    } catch (error: any) {
      console.error("Error fetching patients:", error.message);
      res.status(500).json({ error: "Failed to fetch patient data." });
    }
  } else if (req.method === "PUT") {
    try {
      if (!req.staff) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const data = patientSchema.parse(req.body);

      const updatedPatient = await prisma.patient.update({
        where: { id: data.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelation: data.emergencyContactRelation,
          emergencyContactPhone: data.emergencyContactPhone,
        },
      });

      await prisma.user.update({
        where: { patientId: data.id },
        data: {
          name: `${data.firstName} ${data.lastName}`,
          username: data.email || undefined,
        },
      });

      res.status(200).json(updatedPatient);
    } catch (error: any) {
      console.error("Error updating patient:", error.message);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.status(500).json({ error: "Failed to update patient data." });
    }
  } else if (req.method === "DELETE") {
    try {
      if (!req.staff) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const { id } = deleteSchema.parse(req.body);

      await prisma.user.deleteMany({
        where: { patientId: id },
      });

      await prisma.patient.delete({
        where: { id },
      });

      res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting patient:", error.message);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.status(500).json({ error: "Failed to delete patient data." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
});