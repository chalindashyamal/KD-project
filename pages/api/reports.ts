import { PrismaClient } from '@/generated/prisma';
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export default withAuth(async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            if (!req.doctor) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            // Fetch demographics data
            const demographicsRaw = await prisma.patient.findMany({
                select: { dateOfBirth: true },
            });

            // Helper function to calculate age
            const calculateAge = (dateOfBirth: Date): number => {
                const today = new Date();
                const birthDate = new Date(dateOfBirth);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };

            // Calculate age and group into ranges, removing zero-value ranges
            const demographicsData = [
                { name: "18-30", value: demographicsRaw.filter(p => calculateAge(p.dateOfBirth) >= 18 && calculateAge(p.dateOfBirth) <= 30).length },
                { name: "31-45", value: demographicsRaw.filter(p => calculateAge(p.dateOfBirth) >= 31 && calculateAge(p.dateOfBirth) <= 45).length },
                { name: "46-60", value: demographicsRaw.filter(p => calculateAge(p.dateOfBirth) >= 46 && calculateAge(p.dateOfBirth) <= 60).length },
                { name: "61-75", value: demographicsRaw.filter(p => calculateAge(p.dateOfBirth) >= 61 && calculateAge(p.dateOfBirth) <= 75).length },
                { name: "76+", value: demographicsRaw.filter(p => calculateAge(p.dateOfBirth) >= 76).length },
            ].filter(range => range.value > 0); // Remove zero-value ranges

            // Fetch diagnosis data
            const diagnosisRaw = await prisma.patient.groupBy({
                by: ['primaryDiagnosis'],
                _count: { primaryDiagnosis: true },
            });
            const diagnosisData = diagnosisRaw.map(item => ({
                name: item.primaryDiagnosis,
                value: item._count.primaryDiagnosis,
            }));

            // Fetch appointment data
            const appointmentsRaw = await prisma.appointment.groupBy({
                by: ['date'],
                _count: { date: true },
                orderBy: { date: 'asc' },
            });

            // Ensure all months are included in the result
            const allMonths = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));
            const appointmentData = allMonths.map(month => {
                const matchingItem = appointmentsRaw.find(item => {
                    const itemMonth = new Date(item.date).toLocaleString('default', { month: 'short' });
                    return itemMonth === month;
                });
                return {
                    month,
                    count: matchingItem ? matchingItem._count.date : 0, // Default to 0 if no appointments for the month
                };
            });

            res.status(200).json({
                demographicsData,
                diagnosisData,
                appointmentData,
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({ error: 'Failed to fetch reports' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
});