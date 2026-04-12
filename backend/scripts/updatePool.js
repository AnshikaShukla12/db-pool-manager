const fs = require("fs");
const path = require("path");

const poolSize = process.argv[2];

const configPath = path.join(__dirname, "../config/poolConfig.json");

let config = JSON.parse(fs.readFileSync(configPath));

config.maxPoolSize = Number(poolSize);

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log("Updated maxPoolSize to:", poolSize);