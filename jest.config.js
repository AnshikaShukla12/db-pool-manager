module.exports = {
  // ── Test Environment ──────────────────────────────────────────
  testEnvironment: 'node',

  // ── Test File Detection ───────────────────────────────────────
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
  ],

  // ── Ignore Paths ──────────────────────────────────────────────
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],

  // ── Coverage Settings ─────────────────────────────────────────
  collectCoverage: false,              // enable with --coverage flag
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // ── Setup ─────────────────────────────────────────────────────
  setupFilesAfterFramework: [],
  globalSetup: undefined,
  globalTeardown: undefined,

  // ── Timeouts ──────────────────────────────────────────────────
  testTimeout: 10000,                 // 10 seconds per test

  // ── Display ───────────────────────────────────────────────────
  verbose: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
};
