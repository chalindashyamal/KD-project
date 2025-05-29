import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/user';

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

describe('GET /api/user', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    username: 'johndoe',
    role: 'staff',
    patientId: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user data for authenticated staff user', async () => {
    mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual(mockUser);
    expect(mockPrisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      select: { id: true, name: true, username: true, role: true, patientId: true },
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
    expect(mockPrisma.user.findUniqueOrThrow).not.toHaveBeenCalled();
  });

  it('returns 500 if Prisma throws an error', async () => {
    mockPrisma.user.findUniqueOrThrow.mockRejectedValue(new Error('Database error'));
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(500);
    expect(res.getBody()).toEqual({ error: 'Failed to fetch staff data' });
    expect(mockPrisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      select: { id: true, name: true, username: true, role: true, patientId: true },
    });
  });

  it('returns 405 for non-GET methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.user.findUniqueOrThrow).not.toHaveBeenCalled();
  });
});