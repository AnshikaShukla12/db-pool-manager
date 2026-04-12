const { getClient, getDB } = require("../config/db");
const config = require("../config/poolConfig.json");
const { getRequestCount } = require("./adaptivePool");

function getPoolStatus() {

    const client = getClient();
    const db = getDB();

    let connectionStatus = "Disconnected";

    if (client) {
        connectionStatus = "Connected";
    }

    return {
        database: db ? db.databaseName : "Not connected",

        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize,

        currentPoolSize: config.maxPoolSize,

        totalRequests: getRequestCount(),

        status: connectionStatus,

        time: new Date()
    };
}

module.exports = getPoolStatus;