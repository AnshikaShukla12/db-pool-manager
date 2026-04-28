/**
 * healthcheck.js
 * Checks if the app server and database are healthy.
 * Run with: node scripts/healthcheck.js
 */

require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

const API_HOST = process.env.HOST || 'localhost';
const API_PORT = process.env.PORT || 5000;

// ── Check API Server ────────────────────────────────────────────
const checkAPI = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ ok: true, message: `API is UP (status: ${res.statusCode})` });
        } else {
          resolve({ ok: false, message: `API returned status ${res.statusCode}` });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ ok: false, message: `API is DOWN — ${err.message}` });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, message: 'API check timed out' });
    });

    req.end();
  });
};

// ── Check Database ──────────────────────────────────────────────
const checkDatabase = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'pooldb',
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();
    return { ok: true, message: 'Database is UP' };
  } catch (err) {
    return { ok: false, message: `Database is DOWN — ${err.message}` };
  }
};

// ── Run All Checks ──────────────────────────────────────────────
const runHealthCheck = async () => {
  console.log('🏥 Running health checks...\n');
  console.log('────────────────────────────────');

  const [apiResult, dbResult] = await Promise.all([
    checkAPI(),
    checkDatabase(),
  ]);

  // Print results
  console.log(`  API Server : ${apiResult.ok ? '✅' : '❌'} ${apiResult.message}`);
  console.log(`  Database   : ${dbResult.ok ? '✅' : '❌'} ${dbResult.message}`);
  console.log('────────────────────────────────');

  const allHealthy = apiResult.ok && dbResult.ok;
  if (allHealthy) {
    console.log('\n🎉 All systems are healthy!\n');
    process.exit(0);
  } else {
    console.log('\n🚨 Some services are unhealthy. Check above.\n');
    process.exit(1);
  }
};

runHealthCheck();
