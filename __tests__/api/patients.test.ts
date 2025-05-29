import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/patients';

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
        const user = { id: decoded.id, role: decoded.role };
        const staff = decoded.role === 'staff' ? user : null;
        return handler({ ...req, user, staff } as NextApiRequest, res);
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

describe('API /api/patients', () => {
  const mockPatient = {
    id: 'patient-789',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    phone: '555-1234',
    email: 'john.doe@example.com',
    emergencyContactName: 'Jane Doe',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '555-5678',
    activeTime: new Date().toDateString(),
    allergies: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/patients', () => {
    it('returns all patients with status for authenticated user', async () => {
      mockPrisma.patient.findMany.mockResolvedValue([mockPatient]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([{ ...mockPatient, status: 'Active' }]);
      expect(mockPrisma.patient.findMany).toHaveBeenCalledWith({
        include: { allergies: true },
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
      expect(mockPrisma.patient.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.patient.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to fetch patient data.' });
      expect(mockPrisma.patient.findMany).toHaveBeenCalled();
    });
  });

  describe('PUT /api/patients', () => {
    it('updates patient and user for authenticated staff', async () => {
      mockPrisma.patient.update.mockResolvedValue(mockPatient);
      mockPrisma.user.update.mockResolvedValue({ id: 'user-123', name: 'John Doe', username: 'john.doe@example.com' });
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'patient-789',
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
        where: { id: 'patient-789' },
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
        where: { patientId: 'patient-789' },
        data: {
          name: 'John Doe',
          username: 'john.doe@example.com',
        },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'PUT',
        headers: {},
        body: { id: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.patient.update).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 403 for non-staff user', async () => {
      const token = jwt.sign({ id: 'user-789', role: 'patient' }, 'test-secret');
      const body = {
        id: 'patient-789',
        firstName: 'John',
        lastName: 'Doe',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(403);
      expect(res.getBody()).toEqual({ error: 'Forbidden' });
      expect(mockPrisma.patient.update).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 400 for invalid data', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'patient-789',
        firstName: '',
        lastName: 'Doe',
      };

      const req = {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody().errors).toBeDefined();
      expect(mockPrisma.patient.update).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 404 if patient not found', async () => {
      mockPrisma.patient.update.mockRejectedValue({ code: 'P2025' });
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'patient-789',
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

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({ error: 'Patient not found' });
      expect(mockPrisma.patient.update).toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('returns 500 for server errors', async () => {
      mockPrisma.patient.update.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = {
        id: 'patient-789',
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

  describe('DELETE /api/patients', () => {
    it('deletes patient and user for authenticated staff', async () => {
      mockPrisma.user.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.patient.delete.mockResolvedValue(mockPatient);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: 'patient-789' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual({ message: 'Patient deleted successfully' });
      expect(mockPrisma.user.deleteMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-789' },
      });
      expect(mockPrisma.patient.delete).toHaveBeenCalledWith({
        where: { id: 'patient-789' },
      });
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'DELETE',
        headers: {},
        body: { id: 'patient-789' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.user.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.patient.delete).not.toHaveBeenCalled();
    });

    it('returns 403 for non-staff user', async () => {
      const token = jwt.sign({ id: 'user-789', role: 'patient' }, 'test-secret');
      const body = { id: 'patient-789' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(403);
      expect(res.getBody()).toEqual({ error: 'Forbidden' });
      expect(mockPrisma.user.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.patient.delete).not.toHaveBeenCalled();
    });

    it('returns 400 for invalid data', async () => {
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: '' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody().errors).toBeDefined();
      expect(mockPrisma.user.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.patient.delete).not.toHaveBeenCalled();
    });

    it('returns 404 if patient not found', async () => {
      mockPrisma.patient.delete.mockRejectedValue({ code: 'P2025' });
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: 'patient-789' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({ error: 'Patient not found' });
      expect(mockPrisma.user.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.patient.delete).toHaveBeenCalled();
    });

    it('returns 500 for server errors', async () => {
      mockPrisma.user.deleteMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');
      const body = { id: 'patient-789' };

      const req = {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to delete patient data.' });
      expect(mockPrisma.user.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.patient.delete).not.toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.patient.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.patient.update).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockPrisma.user.deleteMany).not.toHaveBeenCalled();
    expect(mockPrisma.patient.delete).not.toHaveBeenCalled();
  });
});