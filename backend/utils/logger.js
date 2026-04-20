const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

function log(message) {

    const time = new Date().toISOString();
    const logMessage = `${time} - ${message}\n`;

    console.log(logMessage);

    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = log;