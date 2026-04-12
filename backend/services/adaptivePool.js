const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config/poolConfig.json");

let requestCount = 0;
let lastPoolAdjustment = new Date();

/* Increase Request Count */
function increaseRequest() {
    requestCount++;
}

/* Get Request Count */
function getRequestCount() {
    return requestCount;
}

/* Get Last Pool Adjustment */
function getLastPoolAdjustment() {
    return lastPoolAdjustment;
}

/* Adjust Pool Size */
function adjustPool() {

    let config = JSON.parse(fs.readFileSync(configPath));

    if (requestCount > 10) {

        config.maxPoolSize += 2;
        console.log("Pool increased to:", config.maxPoolSize);
        lastPoolAdjustment = new Date();

    } 
    else if (requestCount > 0 && requestCount < 3 && config.maxPoolSize > config.minPoolSize) {

        config.maxPoolSize -= 1;
        console.log("Pool decreased to:", config.maxPoolSize);
        lastPoolAdjustment = new Date();
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    requestCount = 0;
}

module.exports = {
    increaseRequest,
    adjustPool,
    getRequestCount,
    getLastPoolAdjustment
};