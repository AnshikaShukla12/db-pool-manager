const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

function log(message) {

    const time = new Date().toISOString();
    const logMessage = `${time} - ${message}\n`;

    console.log(logMessage);

    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = log;