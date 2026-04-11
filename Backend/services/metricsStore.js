const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/poolConfig.json');
const maxPoints = 200;
const metrics = [];
const logs = [];

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {
    return { maxPoolSize: 10, minPoolSize: 2, waitQueueTimeoutMS: 1000 };
  }
}

function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createLog(action, oldValue, newValue) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    oldValue,
    newValue,
  };

  logs.unshift(entry);
  if (logs.length > maxPoints) logs.pop();
  return entry;
}

function generateBaseMetrics() {
  const config = readConfig();
  const now = Date.now();
  const base = [];
  let active = Math.round(config.maxPoolSize * 0.45);

  for (let index = 0; index < 24; index += 1) {
    const fluctuation = Math.round((Math.sin(index / 3) * 0.5 + 0.5) * config.maxPoolSize * 0.35);
    const value = clamp(active + fluctuation, config.minPoolSize, config.maxPoolSize);
    const idle = Math.max(0, config.maxPoolSize - value);
    const waiting = Math.round(Math.max(0, value - config.maxPoolSize * 0.75));

    base.push({
      timestamp: new Date(now - (23 - index) * 300000).toISOString(),
      activeConnections: value,
      idleConnections: idle,
      waitingRequests: waiting,
      maxPoolSize: config.maxPoolSize,
      minPoolSize: config.minPoolSize,
      waitQueueTimeoutMS: config.waitQueueTimeoutMS,
    });
  }

  return base;
}

function pushMetric(snapshot) {
  metrics.unshift(snapshot);
  if (metrics.length > maxPoints) metrics.pop();
}

function getLatestSnapshot() {
  return metrics[0] || null;
}

function createMetricSnapshot(requestCount = 0) {
  const config = readConfig();
  const previous = getLatestSnapshot();
  const baseline = previous || {
    activeConnections: Math.round(config.maxPoolSize * 0.5),
    idleConnections: Math.round(config.maxPoolSize * 0.5),
    waitingRequests: 0,
  };

  const drift = Math.round((Math.random() - 0.5) * config.maxPoolSize * 0.2);
  let active = clamp(baseline.activeConnections + drift + Math.round(requestCount * 0.04), config.minPoolSize, config.maxPoolSize);
  let idle = Math.max(0, config.maxPoolSize - active);
  const waiting = Math.max(0, Math.round((active - config.maxPoolSize * 0.72) * 1.2));

  const snapshot = {
    timestamp: new Date().toISOString(),
    activeConnections: active,
    idleConnections: idle,
    waitingRequests: waiting,
    maxPoolSize: config.maxPoolSize,
    minPoolSize: config.minPoolSize,
    waitQueueTimeoutMS: config.waitQueueTimeoutMS,
  };

  pushMetric(snapshot);
  return snapshot;
}

function initMetrics() {
  if (metrics.length === 0) {
    const baseline = generateBaseMetrics();
    baseline.forEach(pushMetric);
  }
}

function getMetrics() {
  return metrics.slice();
}

function getLogs() {
  return logs.slice();
}

function addPoolConfigLog(oldConfig, newConfig) {
  return createLog('Pool configuration updated', oldConfig, newConfig);
}

function addAutoscaleLog(oldConfig, newConfig) {
  return createLog('Pool auto-resized', oldConfig, newConfig);
}

module.exports = {
  createMetricSnapshot,
  getMetrics,
  getLogs,
  initMetrics,
  addPoolConfigLog,
  addAutoscaleLog,
  readConfig,
  writeConfig,
};
