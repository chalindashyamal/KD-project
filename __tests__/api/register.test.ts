import { mockPrisma } from '../../jest.setup';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/register';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

// Mock console.log to suppress error logs
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

describe('POST /api/register', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    username: 'johndoe',
    password: 'hashed-password',
    role: 'staff',
    specialty: 'Cardiology',
    department: 'Medicine',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user successfully', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);
    const body = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123',
      role: 'staff',
      specialty: 'Cardiology',
      department: 'Medicine',
    };

    const req = {
      method: 'POST',
      body,
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(201);
    expect(res.getBody()).toEqual({
      message: 'User registered successfully',
      user: {
        username: 'johndoe',
        role: 'staff',
        name: 'John Doe',
        password: 'password123',
        specialty: 'Cardiology',
        department: 'Medicine',
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'johndoe' },
    });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: 'hashed-password',
        role: 'staff',
        specialty: 'Cardiology',
        department: 'Medicine',
      },
    });
  });

  it('returns 400 if username already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    const body = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123',
      role: 'staff',
      specialty: 'Cardiology',
      department: 'Medicine',
    };

    const req = {
      method: 'POST',
      body,
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(400);
    expect(res.getBody()).toEqual({ error: 'Username already exists' });
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'johndoe' },
    });
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('returns 405 for non-POST methods', async () => {
    const req = {
      method: 'GET',
      body: {},
    } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(405);
    expect(res.getBody()).toEqual({ error: 'Method not allowed' });
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});