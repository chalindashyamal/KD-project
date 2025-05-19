import { PrismaClient } from '@/generated/prisma';
import { z } from "zod";
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// Zod schema for donor validation
const donorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bloodType: z.string().min(1, "Blood type is required"),
    contact: z.string().min(1, "Contact is required"),
    relationship: z.string().min(1, "Relationship is required"),
    healthStatus: z.string().min(1, "Health status is required"),
    status: z.string().min(1, "Status is required"),
});

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            if (!req.staff) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { name, bloodType, contact, relationship, healthStatus, status } = donorSchema.parse(req.body);

            const newDonor = await prisma.donor.create({
                data: { name, bloodType, contact, relationship, healthStatus, status },
            });

            res.status(201).json(newDonor);
        } catch (error) {
            console.error("Error creating donor:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            res.status(500).json({ error: "Failed to create donor" });
        }
    } else if (req.method === "GET") {
        try {
            const donors = await prisma.donor.findMany();
            res.status(200).json(donors);
        } catch (error) {
            console.error("Error fetching donors:", error);
            res.status(500).json({ error: "Failed to fetch donors" });
        }
    } else if (req.method === "PUT") {
        try {
            if (!req.staff) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { id, name, bloodType, contact, relationship, healthStatus, status } = donorSchema.extend({
                id: z.number().int().positive("Invalid donor ID"),
            }).parse(req.body);

            const updatedDonor = await prisma.donor.update({
                where: { id },
                data: { name, bloodType, contact, relationship, healthStatus, status },
            });

            res.status(200).json(updatedDonor);
        } catch (error) {
            console.error("Error updating donor:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2025") { // Prisma error for record not found
                return res.status(404).json({ error: "Donor not found" });
            }
            res.status(500).json({ error: "Failed to update donor" });
        }
    } else if (req.method === "DELETE") {
        try {
            if (!req.staff) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { id } = z.object({ id: z.number().int().positive("Invalid donor ID") }).parse(req.body);

            await prisma.donor.delete({
                where: { id },
            });

            res.status(200).json({ message: "Donor deleted successfully" });
        } catch (error) {
            console.error("Error deleting donor:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            if (error.code === "P2025") { // Prisma error for record not found
                return res.status(404).json({ error: "Donor not found" });
            }
            res.status(500).json({ error: "Failed to delete donor" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
});