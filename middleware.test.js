const httpMocks = require('node-mocks-http');
const { authenticate } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validatePoolConfig } = require('../middleware/validateMiddleware');

describe('Middleware Tests', () => {

  // ─── AUTH MIDDLEWARE ───────────────────────────────────────────

  describe('authenticate()', () => {
    test('should call next() with valid token', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer valid-token-123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should return 401 if no token provided', () => {
      const req = httpMocks.createRequest({ headers: {} });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is invalid', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer invalid-token' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.statusCode).toBe(401);
    });

    test('should return 401 for malformed Authorization header', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'malformed-header' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      authenticate(req, res, next);
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── ERROR HANDLER MIDDLEWARE ──────────────────────────────────

  describe('errorHandler()', () => {
    test('should return 500 for generic errors', () => {
      const err = new Error('Something went wrong');
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data.message).toBe('Something went wrong');
    });

    test('should return custom status code if set on error', () => {
      const err = new Error('Not Found');
      err.statusCode = 404;

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);
      expect(res.statusCode).toBe(404);
    });

    test('should return error stack in development mode', () => {
      process.env.NODE_ENV = 'development';
      const err = new Error('Dev error');
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);
      const data = res._getJSONData();
      expect(data.stack).toBeDefined();
    });

    test('should NOT return error stack in production mode', () => {
      process.env.NODE_ENV = 'production';
      const err = new Error('Prod error');
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      errorHandler(err, req, res, next);
      const data = res._getJSONData();
      expect(data.stack).toBeUndefined();
    });
  });

  // ─── VALIDATE POOL CONFIG MIDDLEWARE ──────────────────────────

  describe('validatePoolConfig()', () => {
    test('should call next() for valid pool config', () => {
      const req = httpMocks.createRequest({
        body: {
          name: 'my-pool',
          host: 'localhost',
          port: 5432,
          database: 'testdb',
          max: 10,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      validatePoolConfig(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should return 400 if pool name is missing', () => {
      const req = httpMocks.createRequest({
        body: { host: 'localhost', database: 'testdb' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      validatePoolConfig(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if max connections is negative', () => {
      const req = httpMocks.createRequest({
        body: { name: 'pool', host: 'localhost', database: 'db', max: -1 },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      validatePoolConfig(req, res, next);
      expect(res.statusCode).toBe(400);
    });
  });

  // ─── RATE LIMITER MIDDLEWARE ───────────────────────────────────

  describe('rateLimiter()', () => {
    test('should allow requests under the rate limit', () => {
      const req = httpMocks.createRequest({ ip: '127.0.0.1' });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      rateLimiter(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should block requests exceeding the rate limit', () => {
      const req = httpMocks.createRequest({ ip: '192.168.1.1' });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      // Simulate hitting the limit
      for (let i = 0; i < 100; i++) rateLimiter(req, res, next);

      rateLimiter(req, res, next);
      expect(res.statusCode).toBe(429);
    });
  });

});
