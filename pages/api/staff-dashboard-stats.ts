import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            if (!req.staff) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Fetch today's appointments
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            const todaysAppointments = await prisma.appointment.findMany({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            const checkedInAppointments = todaysAppointments.filter(appointment => appointment.createdAt != appointment.updatedAt).length;

            // Fetch pending vitals
            const pendingVitals = await prisma.vitals.count({
                where: {
                    OR: [
                        { systolic: null },
                        { diastolic: null },
                        { heartRate: null },
                        { respiratoryRate: null },
                        { oxygenSaturation: null },
                    ],
                },
            });

            const highPriorityVitals = await prisma.vitals.count({
                where: {
                    AND: [
                        { systolic: { gte: '140' } }, // Example condition for high priority
                        { diastolic: { gte: '90' } },
                    ],
                },
            });

            // Fetch medication tasks
            const medicationTasks = await prisma.medicationSchedule.count({
                where: {
                    taken: false,
                },
            });

            const dueSoonTasks = await prisma.medicationSchedule.count({
                where: {
                    taken: false,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    time: {
                        lte: new Date().toISOString().split('T')[1], // Tasks due in the next hour
                    },
                },
            });

            res.status(200).json({
                name: req.user.name,
                todaysAppointmentsTotal: todaysAppointments.length,
                todaysAppointmentsCheckedIn: checkedInAppointments,
                pendingVitalsTotal: pendingVitals,
                pendingVitalsHighPriority: highPriorityVitals,
                medicationTasksTotal: medicationTasks,
                medicationTasksDueSoon: dueSoonTasks,
            });

        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Failed to fetch reports' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
});