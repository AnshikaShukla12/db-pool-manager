const fs = require("fs");
const path = require("path");

let requestCount = 0;

function increaseRequest() {
    requestCount++;
}

function getRequestCount() {
    return requestCount;
}

function resetRequests() {
    requestCount = 0;
}

function adjustPool() {

    let newPoolSize = 10;

    if (requestCount > 20) {
        newPoolSize = 30;
    } 
    else if (requestCount > 10) {
        newPoolSize = 20;
    }

    const configPath = path.join(__dirname, "../config/poolConfig.json");

    const config = {
        maxPoolSize: newPoolSize,
        minPoolSize: 2
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log("Pool updated to:", newPoolSize);

    resetRequests();
}

module.exports = {
    increaseRequest,
    adjustPool
};