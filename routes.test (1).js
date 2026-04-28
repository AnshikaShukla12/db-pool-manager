const request = require('supertest');
const app = require('../app');

describe('API Routes Tests', () => {

  let authToken;

  // ─── SETUP ────────────────────────────────────────────────────
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password123' });
    authToken = res.body.token;
  });

  // ─── HEALTH CHECK ─────────────────────────────────────────────
  describe('GET /api/health', () => {
    test('should return 200 and status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ─── AUTH ROUTES ──────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    test('should return token on valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'password123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('should return 401 on invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wrong', password: 'wrong' });
      expect(res.statusCode).toBe(401);
    });

    test('should return 400 if fields missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  // ─── POOL ROUTES ──────────────────────────────────────────────
  describe('GET /api/pools', () => {
    test('should return list of pools', async () => {
      const res = await request(app)
        .get('/api/pools')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 401 without token', async () => {
      const res = await request(app).get('/api/pools');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/pools', () => {
    test('should create pool with valid data', async () => {
      const res = await request(app)
        .post('/api/pools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'route-test-pool',
          host: 'localhost',
          port: 5432,
          database: 'testdb',
          max: 10,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.pool.name).toBe('route-test-pool');
    });

    test('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/pools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ host: 'localhost', database: 'testdb' });
      expect(res.statusCode).toBe(400);
    });

    test('should return 409 if pool name already exists', async () => {
      await request(app)
        .post('/api/pools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'duplicate-pool', host: 'localhost', database: 'testdb' });

      const res = await request(app)
        .post('/api/pools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'duplicate-pool', host: 'localhost', database: 'testdb' });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('GET /api/pools/:name', () => {
    test('should return pool details by name', async () => {
      const res = await request(app)
        .get('/api/pools/route-test-pool')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('route-test-pool');
    });

    test('should return 404 for non-existent pool', async () => {
      const res = await request(app)
        .get('/api/pools/ghost-pool')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/pools/:name', () => {
    test('should delete pool successfully', async () => {
      const res = await request(app)
        .delete('/api/pools/route-test-pool')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    test('should return 404 when deleting non-existent pool', async () => {
      const res = await request(app)
        .delete('/api/pools/no-such-pool')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  // ─── STATS ROUTES ─────────────────────────────────────────────
  describe('GET /api/pools/:name/stats', () => {
    test('should return connection stats', async () => {
      const res = await request(app)
        .get('/api/pools/route-test-pool/stats')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('active');
      expect(res.body).toHaveProperty('idle');
    });
  });

});
