const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/app.log");

function getLogs() {

    try {

        if (!fs.existsSync(logFilePath)) {
            return ["No logs found"];
        }

        const logs = fs.readFileSync(logFilePath, "utf-8");

        if (!logs) {
            return ["Log file is empty"];
        }

        return logs.split("\n").filter(log => log.trim() !== "");

    } catch (error) {

        return ["Error reading logs"];
    }
}

module.exports = getLogs;