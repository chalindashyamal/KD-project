import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Create a mocked PrismaClient
export const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

// Mock the PrismaClient import
jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});