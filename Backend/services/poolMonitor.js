const { getClient, getDB } = require("../config/db");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config/poolConfig.json");

function readConfig() {
    try {
        return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
        return { maxPoolSize: 10, minPoolSize: 2, waitQueueTimeoutMS: 1000 };
    }
}

function getPoolStatus() {
    const client = getClient();
    const db = getDB();
    const config = readConfig();

    return {
        database: db ? db.databaseName : "Not connected",
        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize,
        waitQueueTimeoutMS: config.waitQueueTimeoutMS,
        status: client ? "Connected" : "Disconnected",
        time: new Date(),
    };
}

module.exports = getPoolStatus;
