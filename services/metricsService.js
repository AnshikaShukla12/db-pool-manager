const fs = require("fs");
const path = require("path");

const { getClient, getDB } = require("../config/db");
const { getRequestCount, getLastPoolAdjustment } = require("./adaptivePool");

const configPath = path.join(__dirname, "../config/poolConfig.json");

const startTime = new Date();

function getMetrics() {

    const client = getClient();
    const db = getDB();

    const config = JSON.parse(fs.readFileSync(configPath));

    const uptimeMs = new Date() - startTime;

    const uptimeMinutes = Math.floor(uptimeMs / 60000);
    const uptimeSeconds = Math.floor((uptimeMs % 60000) / 1000);

    return {
        database: db ? db.databaseName : "Not connected",

        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize,
        currentPoolSize: config.maxPoolSize,

        totalRequests: getRequestCount(),

        serverUptime: `${uptimeMinutes} min ${uptimeSeconds} sec`,

        lastPoolAdjustment: getLastPoolAdjustment(),

        status: client ? "Connected" : "Disconnected",

        time: new Date()
    };
}

module.exports = getMetrics;