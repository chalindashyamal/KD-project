import { mockPrisma } from '../../jest.setup';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/messages';

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

describe('API /api/messages', () => {
  const mockMessage = {
    id: 'message-123',
    senderId: 'user-123',
    recipientId: 'user-456',
    content: 'Hello!',
    timestamp: new Date('2025-05-21T08:00:00Z'),
  };

  const mockSender = { id: 'user-123', name: 'John Doe', role: 'patient' };
  const mockRecipient = { id: 'user-456', name: 'Dr. Smith', role: 'doctor' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/messages', () => {
    it('creates a new message for authenticated user', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(mockSender)
        .mockResolvedValueOnce(mockRecipient);
      mockPrisma.message.create.mockResolvedValue(mockMessage);
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');
      const body = { to: 'user-456', content: 'Hello!' };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(201);
      expect(res.getBody()).toEqual({
        id: 'message-123',
        sender: 'John Doe',
        senderId: 'user-123',
        recipient: 'Dr. Smith',
        recipientId: 'user-456',
        content: 'Hello!',
        timestamp: expect.any(Date),
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { name: true },
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-456' },
        select: { name: true, role: true },
      });
      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          senderId: 'user-123',
          recipientId: 'user-456',
          content: 'Hello!',
          timestamp: expect.any(Date),
        },
      });
    });

    it('returns 404 if sender or recipient not found', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(mockSender)
        .mockResolvedValueOnce(null);
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');
      const body = { to: 'user-456', content: 'Hello!' };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({ error: 'Sender or recipient not found.' });
      expect(mockPrisma.message.create).not.toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated request', async () => {
      const req = {
        method: 'POST',
        headers: {},
        body: { to: 'user-456', content: 'Hello!' },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(401);
      expect(res.getBody()).toEqual({ error: 'Unauthorized' });
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.message.create).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(mockSender)
        .mockResolvedValueOnce(mockRecipient);
      mockPrisma.message.create.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');
      const body = { to: 'user-456', content: 'Hello!' };

      const req = {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body,
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to create message.' });
      expect(mockPrisma.message.create).toHaveBeenCalled();
    });
  });

  describe('GET /api/messages', () => {
    it('returns conversations for authenticated patient user', async () => {
      mockPrisma.message.findMany.mockResolvedValue([
        {
          ...mockMessage,
          sender: mockSender,
          recipient: mockRecipient,
        },
      ]);
      mockPrisma.user.findMany.mockResolvedValue([mockRecipient]);
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([
        {
          id: 'user-123-user-456',
          participant: 'Dr. Smith',
          participantId: 'user-456',
          role: 'doctor',
          lastMessage: 'Hello!',
          timestamp: expect.any(Date),
          messages: [
            {
              id: 'message-123',
              sender: 'John Doe',
              senderId: 'user-123',
              recipient: 'Dr. Smith',
              recipientId: 'user-456',
              content: 'Hello!',
              timestamp: expect.any(Date),
            },
          ],
        },
      ]);
      expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ senderId: 'user-123' }, { recipientId: 'user-123' }],
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          recipient: { select: { id: true, name: true, role: true } },
        },
      });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ role: 'doctor' }, { role: 'staff' }],
        },
      });
    });

    it('returns conversations for authenticated staff user with empty conversation', async () => {
      mockPrisma.message.findMany.mockResolvedValue([]);
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'user-456', name: 'Dr. Smith', role: 'doctor' },
        { id: 'user-789', name: 'Jane Doe', role: 'patient' },
      ]);
      const token = jwt.sign({ id: 'user-123', role: 'staff' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual([
        {
          id: 'user-123-user-456',
          participant: 'Dr. Smith',
          participantId: 'user-456',
          role: 'doctor',
          lastMessage: '',
          timestamp: expect.any(Date),
          messages: [],
        },
        {
          id: 'user-123-user-789',
          participant: 'Jane Doe',
          participantId: 'user-789',
          role: 'patient',
          lastMessage: '',
          timestamp: expect.any(Date),
          messages: [],
        },
      ]);
      expect(mockPrisma.message.findMany).toHaveBeenCalled();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
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
      expect(mockPrisma.message.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.user.findMany).not.toHaveBeenCalled();
    });

    it('returns 500 if Prisma throws an error', async () => {
      mockPrisma.message.findMany.mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');

      const req = {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      } as NextApiRequest;
      const res = new MockResponse() as unknown as NextApiResponse;

      await handler(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({ error: 'Failed to fetch messages.' });
      expect(mockPrisma.message.findMany).toHaveBeenCalled();
    });
  });

  it('returns 405 for invalid methods', async () => {
    const token = jwt.sign({ id: 'user-123', role: 'patient' }, 'test-secret');

    const req = {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method Not Allowed' });
    expect(mockPrisma.message.create).not.toHaveBeenCalled();
    expect(mockPrisma.message.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.user.findMany).not.toHaveBeenCalled();
  });
});