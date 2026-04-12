const fs = require("fs");
const path = require("path");

const getPoolStatus = require("../services/poolMonitor");

/* Health Controller */
function getHealth(req, res) {
    res.json({
        status: "OK",
        message: "Server is running",
        time: new Date()
    });
}

/* Pool Status Controller */
function getPool(req, res) {

    try {

        const poolStatus = getPoolStatus();

        res.json({
            status: "Pool Running",
            data: poolStatus,
            time: new Date()
        });

    } catch (error) {

        res.status(500).json({
            status: "Error",
            message: "Unable to fetch pool status"
        });
    }
}

/* Logs Controller */
function getLogs(req, res) {

    const logFilePath = path.join(__dirname, "../logs/app.log");

    try {

        if (!fs.existsSync(logFilePath)) {
            return res.json({
                status: "Logs not found",
                logs: ""
            });
        }

        const logs = fs.readFileSync(logFilePath, "utf-8");

        res.json({
            status: "Logs fetched",
            logs: logs
        });

    } catch (error) {

        res.status(500).json({
            status: "Error",
            message: "Unable to read logs"
        });
    }
}

module.exports = {
    getHealth,
    getPool,
    getLogs
};