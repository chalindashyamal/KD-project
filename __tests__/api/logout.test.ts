import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/logout';

// Mock the cookie serialize function
jest.mock('cookie', () => ({
  serialize: jest.fn(),
}));

// Mock response utility
class MockResponse {
  private statusCode: number = 200;
  private body: any = null;
  private headers: { [key: string]: string | undefined } = {};

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  getStatus() {
    return this.statusCode;
  }

  getBody() {
    return this.body;
  }

  getHeader(key: string) {
    return this.headers[key];
  }
}

describe('API /api/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (serialize as jest.Mock).mockReturnValue('token=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('clears token cookie and returns success message in development', async () => {
    process.env.NODE_ENV = 'development';
    const req = { method: 'GET' } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual({ message: 'Logged out successfully' });
    expect(res.getHeader('Set-Cookie')).toBe('token=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(serialize).toHaveBeenCalledWith('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });
  });

  it('clears token cookie and returns success message in production', async () => {
    process.env.NODE_ENV = 'production';
    const req = { method: 'GET' } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual({ message: 'Logged out successfully' });
    expect(res.getHeader('Set-Cookie')).toBe('token=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(serialize).toHaveBeenCalledWith('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });
  });

  it('works with POST method', async () => {
    process.env.NODE_ENV = 'development';
    const req = { method: 'POST' } as NextApiRequest;
    const res = new MockResponse() as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    expect(res.getBody()).toEqual({ message: 'Logged out successfully' });
    expect(res.getHeader('Set-Cookie')).toBe('token=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(serialize).toHaveBeenCalledWith('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });
  });
});