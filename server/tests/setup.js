// Global test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';

// Increase timeout for tests
jest.setTimeout(30000);

// Mock console.log and console.error to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};