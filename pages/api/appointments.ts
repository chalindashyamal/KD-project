import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';
import { parse, startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { type, date, time, location, notes, patientId } = req.body;

      // Validate required fields
      const finalPatientId = req.user?.role === "patient" ? req.user?.patientId : patientId;
      if (!type || !date || !time || !location || !finalPatientId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create a new appointment
      const newAppointment = await prisma.appointment.create({
        data: {
          patientId: finalPatientId,
          type,
          date: new Date(date),
          time,
          location,
          notes: notes || null,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(201).json(newAppointment);
    } catch (error: any) {
      console.error("POST /api/appointments error:", error.message, error.stack);
      res.status(500).json({ error: "Failed to create appointment", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      // Validate req.user
      if (!req.user || !req.user.role) {
        console.error("GET /api/appointments: Missing or invalid req.user", req.user);
        return res.status(401).json({ error: "Unauthorized: Invalid user authentication" });
      }

      console.log("GET /api/appointments: User details", {
        role: req.user.role,
        patientId: req.user.patientId,
        user: req.user,
      });

      const { date } = req.query;
      let where: any = {};

      // Set where clause based on role
      if (req.user.role === "staff" || req.user.role === "doctor") {
        // Staff and doctors can see all appointments
        where = {};
      } else if (req.user.role === "patient") {
        // Patients see only their own appointments
        if (!req.user.patientId) {
          console.error("GET /api/appointments: Missing patientId for patient role", req.user);
          return res.status(400).json({ error: "Missing patientId for patient user" });
        }
        where.patientId = req.user.patientId;
      } else {
        console.error("GET /api/appointments: Unsupported role", req.user.role);
        return res.status(403).json({ error: "Forbidden: Unsupported user role" });
      }

      // Handle date filtering
      if (date && typeof date === 'string') {
        try {
          const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
          if (isNaN(parsedDate.getTime())) {
            console.error("GET /api/appointments: Invalid date format", { date });
            return res.status(400).json({ error: "Invalid date format. Use yyyy-MM-dd" });
          }
          const start = startOfDay(parsedDate);
          const end = endOfDay(parsedDate);
          where.date = {
            gte: start,
            lte: end,
          };
        } catch (error: any) {
          console.error("GET /api/appointments: Date parsing error", error.message, { date });
          return res.status(400).json({ error: "Invalid date format. Use yyyy-MM-dd" });
        }
      }

      console.log("GET /api/appointments: Executing query with where clause", where);

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(200).json(appointments);
    } catch (error: any) {
      console.error("GET /api/appointments error:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        meta: error.meta,
      });
      res.status(500).json({ error: "Failed to fetch appointments", details: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, type, date, time, location, notes, patientId } = req.body;

      // Validate input
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Valid appointment ID (string) is required" });
      }
      if (!type || !date || !time || !location) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id },
      });
      if (!existingAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Staff/doctors can edit any appointment; patients can only edit their own
      if (req.user?.role !== "staff" && req.user?.role !== "doctor" && existingAppointment.patientId !== req.user?.patientId) {
        return res.status(403).json({ error: "Unauthorized to update this appointment" });
      }

      // Update appointment
      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          type,
          date: new Date(date),
          time,
          location,
          notes: notes || null,
          ...(patientId && (req.user?.role === "staff" || req.user?.role === "doctor") ? { patientId } : {}),
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.status(200).json(updatedAppointment);
    } catch (error: any) {
      console.error("PUT /api/appointments error:", error.message, error.stack);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.status(500).json({ error: "Failed to update appointment", details: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      // Validate input
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Valid appointment ID (string) is required" });
      }

      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id },
      });
      if (!existingAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Staff/doctors can delete any appointment; patients can only delete their own
      if (req.user?.role !== "staff" && req.user?.role !== "doctor" && existingAppointment.patientId !== req.user?.patientId) {
        return res.status(403).json({ error: "Unauthorized to delete this appointment" });
      }

      // Delete appointment
      await prisma.appointment.delete({
        where: { id },
      });

      res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error: any) {
      console.error("DELETE /api/appointments error:", error.message, error.stack);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.status(500).json({ error: "Failed to delete appointment", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
});