import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/medication-schedule';

// Mock withAuth middleware
jest.mock('@/lib/auth', () => ({
  withAuth: (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const decoded = jwt.verify(token, 'test-secret') as { id: string; role: string; patientId?: string };
        const patient = decoded.patientId ? { id: decoded.patientId } : null;
        return handler({ ...req, user: decoded, patient } as NextApiRequest, res);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    };
  },
}));

// Mock console.error to suppress logs
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock response utility
class MockResponse {
  private statusCode: number = 200;
  private body: any = null;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }

  getStatus() {
    return this.statusCode;
  }

  getBody() {
    return this.body;
  }
}

describe('API /api/medication-schedule', () => {
  const mockMedication = {
    id: 1,
    patientId: 'patient-789',
    name: 'Aspirin',
    dosage: '100mg',
    times: '08:00,12:00',
    instructions: 'Take with food',
    MedicationSchedule: [
      {
        patientId: 'patient-789',
        medicationId: 1,
        date: new Date('2025-05-21T00:00:00Z'),
        time: '08:00',
        taken: true,
        takenAt: new Date('2025-05-21T08:00:00Z'),
        AdministeredBy: 'Nurse Jane',
      },
    ],
    patient: { id: 'patient-789', name: 'John Doe' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/medication-schedule', () => {
    it('marks medication as taken for authenticated patient', async () => {
      mockPrisma.medicationSchedule.upsert.mockResolvedValue({
        patientId: 'patient-789',
        medicationId: 1,
        date: new Date('2025-05-21T00:00:00Z'),
        time: '08:00',
        taken: true,
        takenAt: new Date('2025-05-21T08:00:00Z'),
        AdministeredBy: 'Nurse Jane',
      });
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');
      const body = {
        medicationId: 1,
        time: '08:00',
        administeredBy: 'Nurse Jane',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual({ message: 'Medication marked as taken successfully!' });
      expect(mockPrisma.medicationSchedule.upsert).toHaveBeenCalledWith({
        create: {
          medicationId: 1,
          patientId: 'patient-789',
          date: expect.any(Date),
          time: '08:00',
          taken: true,
          takenAt: expect.any(Date),
          AdministeredBy: 'Nurse Jane',
        },
        update: {
          taken: true,
          takenAt: expect.any(Date),
          AdministeredBy: 'Nurse Jane',
        },
        where: {
          patientId_medicationId_date_time: {
            patientId: 'patient-789',
            medicationId: 1,
            date: expect.any(Date),
            time: '08:00',
          },
        },
      });
    });

    it('marks medication as taken with patientId from body', async () => {
      mockPrisma.medicationSchedule.upsert.mockResolvedValue({
        patientId: 'patient-456',
        medicationId: 1,
        date: new Date('2025-05-21T00:00:00Z'),
        time: '08:00',
        taken: true,
        takenAt: new Date('2025-05-21T08:00:00Z'),
        AdministeredBy: '',
      });
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-456',
        medicationId: 1,
        time: '08:00',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual({ message: 'Medication marked as taken successfully!' });
      expect(mockPrisma.medicationSchedule.upsert).toHaveBeenCalledWith({
        create: {
          medicationId: 1,
          patientId: 'patient-456',
          date: expect.any(Date),
          time: '08:00',
          taken: true,
          takenAt: expect.any(Date),
          AdministeredBy: '',
        },
        update: {
          taken: true,
          takenAt: expect.any(Date),
          AdministeredBy: '',
        },
        where: {
          patientId_medicationId_date_time: {
            patientId: 'patient-456',
            medicationId: 1,
            date: expect.any(Date),
            time: '08:00',
          },
        },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { medicationId: 1, time: '08:00' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medicationSchedule.upsert).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medicationSchedule.upsert.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');
      const body = {
        medicationId: 1,
        time: '08:00',
        administeredBy: 'Nurse Jane',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to save medication data.' });
      expect(mockPrisma.medicationSchedule.upsert).toHaveBeenCalled();
    });
  });

  describe('GET /api/medication-schedule', () => {
    it('returns medications with schedules for today', async () => {
      mockPrisma.medication.findMany.mockResolvedValue([mockMedication]);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {},
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([
        {
          id: 1,
          patientId: 'patient-789',
          patient: { id: 'patient-789', name: 'John Doe' },
          name: 'Aspirin',
          dosage: '100mg',
          times: ['08:00', '12:00'],
          instructions: 'Take with food',
          status: [
            { time: '08:00', taken: true, takenAt: expect.any(Date) },
            { time: '12:00', taken: false, takenAt: null },
          ],
        },
      ]);
      expect(mockPrisma.medication.findMany).toHaveBeenCalledWith({
        include: {
          MedicationSchedule: {
            where: {
              date: {
                gte: expect.any(Date),
                lte: expect.any(Date),
              },
            },
          },
          patient: true,
        },
      });
    });

    it('returns medications with schedules for specified date', async () => {
      mockPrisma.medication.findMany.mockResolvedValue([mockMedication]);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { date: '2025-05-21' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([
        {
          id: 1,
          patientId: 'patient-789',
          patient: { id: 'patient-789', name: 'John Doe' },
          name: 'Aspirin',
          dosage: '100mg',
          times: ['08:00', '12:00'],
          instructions: 'Take with food',
          status: [
            { time: '08:00', taken: true, takenAt: expect.any(Date) },
            { time: '12:00', taken: false, takenAt: null },
          ],
        },
      ]);
      expect(mockPrisma.medication.findMany).toHaveBeenCalledWith({
        include: {
          MedicationSchedule: {
            where: {
              date: {
                gte: new Date('2025-05-20T18:30:00.000Z'),
                lte: new Date('2025-05-21T18:29:59.999Z'),
              },
            },
          },
          patient: true,
        },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'GET',
        headers: {},
        query: {},
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medication.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medication.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {},
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to fetch medications.' });
      expect(mockPrisma.medication.findMany).toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');

    const req = {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.medicationSchedule.upsert).not.toHaveBeenCalled();
    expect(mockPrisma.medication.findMany).not.toHaveBeenCalled();
  });
});