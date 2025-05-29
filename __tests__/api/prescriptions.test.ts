import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/prescriptions';

// Mock withAuth middleware
jest.mock('@/lib/auth', () => ({
  withAuth: (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const decoded = jwt.verify(token, 'test-secret') as { id: string; role: string };
        return handler({ ...req, user: decoded } as NextApiRequest, res);
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

describe('API /api/prescriptions', () => {
  const mockPrescription = {
    id: 'prescription-123',
    patientId: 'patient-789',
    medication: 'Aspirin',
    dosage: '100mg',
    frequency: 'Daily',
    prescribedDate: new Date('2025-05-21'),
    expiryDate: new Date('2025-06-21'),
    refills: 2,
    status: 'Active',
    patient: { id: 'patient-789', name: 'John Doe' },
  };

  const mockMedication = {
    id: 'medication-123',
    patientId: 'patient-789',
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'Daily',
    times: '08:00,12:00',
    instructions: 'Take with food',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/prescriptions', () => {
    it('creates a new prescription and medication for authenticated user', async () => {
      mockPrisma.prescription.create.mockResolvedValue(mockPrescription);
      mockPrisma.medication.create.mockResolvedValue(mockMedication);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        medication: 'Aspirin',
        dosage: '100mg',
        frequency: 'Daily',
        prescribedDate: '2025-05-21',
        expiryDate: '2025-06-21',
        refills: '2',
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
      expect(res.getBody()).toEqual(mockPrescription);
      expect(mockPrisma.prescription.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient-789',
          medication: 'Aspirin',
          dosage: '100mg',
          frequency: 'Daily',
          prescribedDate: expect.any(Date),
          expiryDate: expect.any(Date),
          refills: 2,
          status: 'Active',
        },
        include: { patient: true },
      });
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
        body: { patientId: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.prescription.create).not.toHaveBeenCalled();
      expect(mockPrisma.medication.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.prescription.create.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        medication: 'Aspirin',
        dosage: '100mg',
        frequency: 'Daily',
        prescribedDate: '2025-05-21',
        expiryDate: '2025-06-21',
        refills: '2',
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
      expect(res.getBody()).toEqual({ error: 'Failed to create prescription.' });
      expect(mockPrisma.prescription.create).toHaveBeenCalled();
      expect(mockPrisma.medication.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/prescriptions', () => {
    it('returns all prescriptions for authenticated user', async () => {
      mockPrisma.prescription.findMany.mockResolvedValue([mockPrescription]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([mockPrescription]);
      expect(mockPrisma.prescription.findMany).toHaveBeenCalledWith({
        include: { patient: true },
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
      expect(mockPrisma.prescription.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.prescription.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to fetch prescriptions.' });
      expect(mockPrisma.prescription.findMany).toHaveBeenCalled();
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
    expect(mockPrisma.prescription.create).not.toHaveBeenCalled();
    expect(mockPrisma.medication.create).not.toHaveBeenCalled();
    expect(mockPrisma.prescription.findMany).not.toHaveBeenCalled();
  });
});