const fs = require("fs");
const path = require("path");

const { getClient, getDB } = require("../config/db");
const { getRequestCount, getLastPoolAdjustment } = require("./adaptivePool");

const configPath = path.join(__dirname, "../config/poolConfig.json");

const startTime = new Date();
const metricsHistory = [];

function getMetrics() {
    const client = getClient();
    const config = JSON.parse(fs.readFileSync(configPath));
    const currentRequests = getRequestCount();

    // Simulate metrics based on current requests and pool size
    const maxPool = config.maxPoolSize;
    // Active connections scale with requests, capped at maxPool
    const active = Math.min(currentRequests, maxPool) + Math.floor(Math.random() * 2); 
    // Idle is maxPool minus active (simulated)
    const idle = Math.max(0, maxPool - active);
    // Waiting is requests that exceed maxPool
    const waiting = Math.max(0, currentRequests - maxPool);

    const newMetric = {
        timestamp: new Date().toISOString(),
        activeConnections: active,
        idleConnections: idle,
        waitingRequests: waiting
    };

    // Keep the last 50 metrics to form a history chart for the frontend
    metricsHistory.unshift(newMetric);
    if (metricsHistory.length > 50) {
        metricsHistory.pop();
    }

    return metricsHistory;
}

module.exports = getMetrics;