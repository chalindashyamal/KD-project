import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/patient';

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
        return handler({ ...req, user: decoded } as NextApiRequest, res);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    };
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

// Mock console.error and console.log to suppress logs
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

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

describe('API /api/patient', () => {
  const mockPatient = {
    id: 'PT-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: new Date('1990-01-01'),
    diagnosisDate: new Date('2025-05-01'),
    allergies: [{ id: 'allergy-1', name: 'Peanuts' }],
  };

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    username: 'john.doe@example.com',
    password: 'hashed-password',
    role: 'patient',
    patientId: 'PT-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/patient', () => {
    it('creates a new patient and user for authenticated user', async () => {
      mockPrisma.patient.findMany.mockResolvedValue([{ id: 'PT-999' }]);
      mockPrisma.patient.create.mockResolvedValue(mockPatient);
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        dateOfBirth: '1990-01-01',
        diagnosisDate: '2025-05-01',
        allergies: [{ name: 'Peanuts' }],
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual(mockPatient);
      expect(mockPrisma.patient.findMany).toHaveBeenCalledWith({ select: { id: true } });
      expect(mockPrisma.patient.create).toHaveBeenCalledWith({
        data: {
          ...body,
          id: expect.stringMatching(/^PT-\d+$/),
          dateOfBirth: expect.any(Date),
          diagnosisDate: expect.any(Date),
          allergies: { create: [{ name: 'Peanuts' }] },
        },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'john.doe@example.com' },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          username: 'john.doe@example.com',
          password: 'hashed-password',
          role: 'patient',
          patientId: expect.stringMatching(/^PT-\d+$/),
        },
      });
    });

    it('returns 400 if username already exists', async () => {
      mockPrisma.patient.findMany.mockResolvedValue([{ id: 'PT-999' }]);
      mockPrisma.patient.create.mockResolvedValue(mockPatient);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        dateOfBirth: '1990-01-01',
        diagnosisDate: '2025-05-01',
        allergies: [{ name: 'Peanuts' }],
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Username already exists' });
      expect(mockPrisma.patient.findMany).toHaveBeenCalled();
      expect(mockPrisma.patient.create).toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'john.doe@example.com' },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { firstName: 'John', lastName: 'Doe' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.patient.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.patient.create).not.toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.patient.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        dateOfBirth: '1990-01-01',
        diagnosisDate: '2025-05-01',
        allergies: [{ name: 'Peanuts' }],
      };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to save patient data.' });
      expect(mockPrisma.patient.findMany).toHaveBeenCalled();
      expect(mockPrisma.patient.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/patient', () => {
    it('returns patient data for authenticated user with patientId', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(mockPatient);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'PT-123' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(mockPatient);
      expect(mockPrisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 'PT-123' },
      });
    });

    it('returns 400 if patientId is missing', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Patient ID is required' });
      expect(mockPrisma.patient.findUnique).not.toHaveBeenCalled();
    });

    it('returns 404 if patient not found', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(null);
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'PT-123' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({ error: 'Patient not found' });
      expect(mockPrisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 'PT-123' },
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
      expect(mockPrisma.patient.findUnique).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.patient.findUnique.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient', patientId: 'PT-123' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Internal Server Error' });
      expect(mockPrisma.patient.findUnique).toHaveBeenCalled();
    });
  });

  describe('PUT /api/patient', () => {
    it('updates patient and user for authenticated user', async () => {
      mockPrisma.patient.update.mockResolvedValue(mockPatient);
      mockPrisma.user.update.mockResolvedValue(mockUser);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'PT-123',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phone: '555-1234',
        email: 'john.doe@example.com',
        emergencyContactName: 'Jane Doe',
        emergencyContactRelation: 'Spouse',
        emergencyContactPhone: '555-5678',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual(mockPatient);
      expect(mockPrisma.patient.update).toHaveBeenCalledWith({
        where: { id: 'PT-123' },
        data: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phone: '555-1234',
          email: 'john.doe@example.com',
          emergencyContactName: 'Jane Doe',
          emergencyContactRelation: 'Spouse',
          emergencyContactPhone: '555-5678',
        },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { patientId: 'PT-123' },
        data: {
          name: 'John Doe',
          username: 'john.doe@example.com',
        },
      });
    });

    it('returns 400 if patient ID is missing', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({ error: 'Patient ID is required' });
      expect(mockPrisma.patient.update).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'PUT',
        headers: {},
        body: { id: 'P T-123', firstName: 'John', lastName: 'Doe' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.patient.update).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.patient.update.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'PT-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to update patient data.' });
      expect(mockPrisma.patient.update).toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.patient.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.patient.create).not.toHaveBeenCalled();
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockPrisma.patient.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.patient.update).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});