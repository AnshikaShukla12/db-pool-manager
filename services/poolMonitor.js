const { getClient, getDB } = require("../config/db");
const config = require("../config/poolConfig.json");

function getPoolStatus() {

    const client = getClient();
    const db = getDB();

    return {
        database: db ? db.databaseName : "Not connected",
        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize,
        status: client ? "Connected" : "Disconnected",
        time: new Date()
    };
}

module.exports = getPoolStatus;