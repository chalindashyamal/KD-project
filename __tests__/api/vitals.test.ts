import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/vitals';

// Mock withAuth middleware
jest.mock('@/lib/auth', () => ({
  withAuth: (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return handler({ ...req, user: null } as NextApiRequest, res);
      }
      try {
        const decoded = jwt.verify(token, 'test-secret') as { id: string; role: string; patientId?: string | null };
        req.user = decoded;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    };
  },
}));

// Mock console.error to suppress error logs
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

describe('API /api/vitals', () => {
  const mockVitals = {
    id: 'vitals-123',
    patientId: 'patient-789',
    temperature: '98.6',
    systolic: '120',
    diastolic: '80',
    heartRate: '70',
    respiratoryRate: '16',
    oxygenSaturation: '98',
    weight: '70',
    notes: 'Stable condition',
    createdAt: new Date('2025-05-21T10:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/vitals', () => {
    it('creates vitals for authenticated user', async () => {
      mockPrisma.vitals.create.mockResolvedValue(mockVitals);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        temperature: '98.6',
        systolic: '120',
        diastolic: '80',
        heartRate: '70',
        respiratoryRate: '16',
        oxygenSaturation: '98',
        weight: '70',
        notes: 'Stable condition',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual(mockVitals);
      expect(mockPrisma.vitals.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient-789',
          temperature: '98.6',
          systolic: '120',
          diastolic: '80',
          heartRate: '70',
          respiratoryRate: '16',
          oxygenSaturation: '98',
          weight: '70',
          notes: 'Stable condition',
        },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { patientId: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.vitals.create).not.toHaveBeenCalled();
    });

    it('returns 400 for invalid data', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {}; // Omit patientId to trigger zod validation error

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody().errors).toBeDefined();
      expect(res.getBody().errors[0].message).toBe('Please select a patient.');
      expect(mockPrisma.vitals.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.vitals.create.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { patientId: 'patient-789' };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Internal Server Error' });
      expect(mockPrisma.vitals.create).toHaveBeenCalled();
    });
  });

  describe('GET /api/vitals', () => {
    it('returns all vitals for patient', async () => {
      mockPrisma.vitals.findMany.mockResolvedValue([mockVitals]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { patientId: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([mockVitals]);
      expect(mockPrisma.vitals.findMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-789' },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('returns vitals filtered by date', async () => {
      mockPrisma.vitals.findMany.mockResolvedValue([mockVitals]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const date = '2025-05-21';

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { patientId: 'patient-789', date },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([mockVitals]);
      expect(mockPrisma.vitals.findMany).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-789',
          createdAt: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('returns 400 if patientId is missing', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: {},
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Patient ID is required.' });
      expect(mockPrisma.vitals.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.vitals.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
        query: { patientId: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Internal Server Error' });
      expect(mockPrisma.vitals.findMany).toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.vitals.create).not.toHaveBeenCalled();
    expect(mockPrisma.vitals.findMany).not.toHaveBeenCalled();
  });
});