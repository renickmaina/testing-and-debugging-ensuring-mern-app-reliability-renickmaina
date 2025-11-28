module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup.js'], // Change to setupFiles
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/tests/**'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  testTimeout: 30000,
  forceExit: true,
  clearMocks: true,
  resetModules: true,
  restoreMocks: true
};