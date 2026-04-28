const poolService = require('../services/poolService');
const connectionService = require('../services/connectionService');

describe('Services Tests', () => {

  // ─── POOL SERVICE ──────────────────────────────────────────────

  describe('poolService', () => {

    describe('validatePoolConfig()', () => {
      test('should pass for valid config', () => {
        const config = { name: 'my-pool', host: 'localhost', database: 'testdb', max: 10 };
        expect(() => poolService.validatePoolConfig(config)).not.toThrow();
      });

      test('should throw if name is empty string', () => {
        const config = { name: '', host: 'localhost', database: 'testdb' };
        expect(() => poolService.validatePoolConfig(config)).toThrow();
      });

      test('should throw if max is 0', () => {
        const config = { name: 'pool', host: 'localhost', database: 'testdb', max: 0 };
        expect(() => poolService.validatePoolConfig(config)).toThrow();
      });

      test('should throw if host is missing', () => {
        const config = { name: 'pool', database: 'testdb', max: 5 };
        expect(() => poolService.validatePoolConfig(config)).toThrow();
      });
    });

    describe('formatPoolResponse()', () => {
      test('should format pool data correctly', () => {
        const rawPool = {
          name: 'my-pool',
          host: 'localhost',
          max: 10,
          _password: 'secret',
          _internalState: {},
        };
        const formatted = poolService.formatPoolResponse(rawPool);
        expect(formatted.name).toBe('my-pool');
        expect(formatted._password).toBeUndefined();
        expect(formatted._internalState).toBeUndefined();
      });
    });

    describe('isPoolHealthy()', () => {
      test('should return true if pool has idle connections', async () => {
        const poolName = 'health-pool';
        await poolService.createPool({ name: poolName, host: 'localhost', database: 'testdb' });
        const healthy = await poolService.isPoolHealthy(poolName);
        expect(healthy).toBe(true);
      });

      test('should return false if pool is fully exhausted', async () => {
        const healthy = await poolService.isPoolHealthy('exhausted-pool');
        expect(healthy).toBe(false);
      });
    });

    describe('resizePool()', () => {
      test('should increase max connections', async () => {
        const poolName = 'resize-pool';
        await poolService.createPool({ name: poolName, host: 'localhost', database: 'testdb', max: 5 });
        await poolService.resizePool(poolName, 15);

        const pool = poolService.getPool(poolName);
        expect(pool.max).toBe(15);
      });

      test('should throw if new size is less than active connections', async () => {
        await expect(poolService.resizePool('active-pool', 0)).rejects.toThrow();
      });
    });
  });

  // ─── CONNECTION SERVICE ────────────────────────────────────────

  describe('connectionService', () => {

    describe('isConnectionAlive()', () => {
      test('should return true for a valid active connection', async () => {
        const conn = await connectionService.acquireConnection('test-pool');
        const alive = await connectionService.isConnectionAlive(conn.id);
        expect(alive).toBe(true);
      });

      test('should return false for an invalid connection ID', async () => {
        const alive = await connectionService.isConnectionAlive('bad-id-999');
        expect(alive).toBe(false);
      });
    });

    describe('getActiveConnections()', () => {
      test('should return array of active connection IDs', async () => {
        const active = await connectionService.getActiveConnections('test-pool');
        expect(Array.isArray(active)).toBe(true);
      });
    });

    describe('forceReleaseAll()', () => {
      test('should release all connections in a pool', async () => {
        await connectionService.acquireConnection('test-pool');
        await connectionService.acquireConnection('test-pool');

        await connectionService.forceReleaseAll('test-pool');

        const stats = await connectionService.getConnectionStats('test-pool');
        expect(stats.active).toBe(0);
      });
    });

    describe('getWaitingCount()', () => {
      test('should return number of requests waiting for a connection', async () => {
        const waiting = await connectionService.getWaitingCount('test-pool');
        expect(typeof waiting).toBe('number');
        expect(waiting).toBeGreaterThanOrEqual(0);
      });
    });
  });

});
