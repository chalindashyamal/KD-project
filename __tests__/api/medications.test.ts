import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/medications';

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

describe('API /api/medications', () => {
  const mockMedication = {
    id: 'medication-123',
    patientId: 'patient-789',
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'Daily',
    times: '08:00,12:00',
    instructions: 'Take with food',
    patient: { id: 'patient-789', name: 'John Doe' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/medications', () => {
    it('creates a new medication for authenticated patient', async () => {
      mockPrisma.medication.create.mockResolvedValue(mockMedication);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');
      const body = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Daily',
        time: ['08:00', '12:00'],
        instructions: 'Take with food',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual(mockMedication);
      expect(mockPrisma.medication.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient-789',
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Daily',
          times: '08:00,12:00',
          instructions: 'Take with food',
        },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { name: 'Aspirin', dosage: '100mg', frequency: 'Daily', time: ['08:00'], instructions: 'Take with food' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medication.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medication.create.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');
      const body = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Daily',
        time: ['08:00', '12:00'],
        instructions: 'Take with food',
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
      expect(mockPrisma.medication.create).toHaveBeenCalled();
    });
  });

  describe('GET /api/medications', () => {
    it('returns all medications for authenticated patient', async () => {
      mockPrisma.medication.findMany.mockResolvedValue([mockMedication]);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'patient-789' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([
        {
          ...mockMedication,
          times: ['08:00', '12:00'],
        },
      ]);
      expect(mockPrisma.medication.findMany).toHaveBeenCalledWith({
        include: { patient: true },
        where: { patientId: 'patient-789' },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'GET',
        headers: {},
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
    expect(mockPrisma.medication.create).not.toHaveBeenCalled();
    expect(mockPrisma.medication.findMany).not.toHaveBeenCalled();
  });
});