import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/medical-records';

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

describe('API /api/medical-records', () => {
  const mockMedicalRecord = {
    id: 1,
    patientId: 'patient-789',
    recordType: 'Consultation',
    date: new Date('2025-05-21T08:00:00Z'),
    provider: 'Dr. Smith',
    description: 'Annual checkup',
    patient: { id: 'patient-789', name: 'John Doe' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/medical-records', () => {
    it('creates a new medical record', async () => {
      mockPrisma.medicalRecord.create.mockResolvedValue(mockMedicalRecord);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        recordType: 'Consultation',
        date: '2025-05-21',
        provider: 'Dr. Smith',
        description: 'Annual checkup',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual(mockMedicalRecord);
      expect(mockPrisma.medicalRecord.create).toHaveBeenCalledWith({
        data: {
          patientId: 'patient-789',
          recordType: 'Consultation',
          date: expect.any(Date),
          provider: 'Dr. Smith',
          description: 'Annual checkup',
        },
        include: { patient: true },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { patientId: 'patient-789', recordType: 'Consultation', date: '2025-05-21', provider: 'Dr. Smith', description: 'Annual checkup' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medicalRecord.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medicalRecord.create.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        recordType: 'Consultation',
        date: '2025-05-21',
        provider: 'Dr. Smith',
        description: 'Annual checkup',
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to create medical record.' });
      expect(mockPrisma.medicalRecord.create).toHaveBeenCalled();
    });
  });

  describe('GET /api/medical-records', () => {
    it('returns all medical records', async () => {
      mockPrisma.medicalRecord.findMany.mockResolvedValue([mockMedicalRecord]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([mockMedicalRecord]);
      expect(mockPrisma.medicalRecord.findMany).toHaveBeenCalledWith({
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
      expect(mockPrisma.medicalRecord.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medicalRecord.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to fetch medical records.' });
      expect(mockPrisma.medicalRecord.findMany).toHaveBeenCalled();
    });
  });

  describe('PUT /api/medical-records', () => {
    it('updates a medical record', async () => {
      mockPrisma.medicalRecord.update.mockResolvedValue(mockMedicalRecord);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: '1',
        patientId: 'patient-789',
        recordType: 'Consultation',
        date: '2025-05-21',
        provider: 'Dr. Smith',
        description: 'Updated checkup',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(mockMedicalRecord);
      expect(mockPrisma.medicalRecord.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          patientId: 'patient-789',
          recordType: 'Consultation',
          date: expect.any(Date),
          provider: 'Dr. Smith',
          description: 'Updated checkup',
        },
        include: { patient: true },
      });
    });

    it('returns 400 if id is missing', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        patientId: 'patient-789',
        recordType: 'Consultation',
        date: '2025-05-21',
        provider: 'Dr. Smith',
        description: 'Updated checkup',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Medical record ID is required' });
      expect(mockPrisma.medicalRecord.update).not.toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'PUT',
        headers: {},
        body: { id: '1', patientId: 'patient-789', recordType: 'Consultation', date: '2025-05-21', provider: 'Dr. Smith', description: 'Updated checkup' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medicalRecord.update).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medicalRecord.update.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: '1',
        patientId: 'patient-789',
        recordType: 'Consultation',
        date: '2025-05-21',
        provider: 'Dr. Smith',
        description: 'Updated checkup',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to update medical record.' });
      expect(mockPrisma.medicalRecord.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/medical-records', () => {
    it('deletes a medical record', async () => {
      mockPrisma.medicalRecord.delete.mockResolvedValue(mockMedicalRecord);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: '1' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual({ message: 'Medical record deleted successfully' });
      expect(mockPrisma.medicalRecord.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('returns 400 if id is missing', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {};

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Medical record ID is required' });
      expect(mockPrisma.medicalRecord.delete).not.toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'DELETE',
        headers: {},
        body: { id: '1' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.medicalRecord.delete).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.medicalRecord.delete.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: '1' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to delete medical record.' });
      expect(mockPrisma.medicalRecord.delete).toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.medicalRecord.create).not.toHaveBeenCalled();
    expect(mockPrisma.medicalRecord.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.medicalRecord.update).not.toHaveBeenCalled();
    expect(mockPrisma.medicalRecord.delete).not.toHaveBeenCalled();
  });
});