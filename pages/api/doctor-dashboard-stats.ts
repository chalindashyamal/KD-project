import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            if (!req.doctor) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Count total patients assigned to the doctor
            const totalPatients = await prisma.patient.count();

            // Count today's appointments for the doctor
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            const todaysAppointments = await prisma.appointment.count({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            // Count pending lab reports for the doctor's patients
            const pendingReports = await prisma.labTest.count({
                where: {
                    status: 'pending',
                },
            });

            res.status(200).json({
                name: req.doctor.name,
                totalPatients,
                todaysAppointments,
                pendingReports,
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Failed to fetch reports' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
});