const { MongoClient } = require("mongodb");
const config = require("./poolConfig.json");

let client;
let db;

async function connectDB() {

    client = new MongoClient(process.env.MONGO_URI, {
        maxPoolSize: config.maxPoolSize,
        minPoolSize: config.minPoolSize
    });

    await client.connect();

    db = client.db("poolDB");

    console.log("MongoDB Connected");
    console.log("Pool Size:", config.maxPoolSize);
}

function getDB() {
    return db;
}

function getClient() {
    return client;
}

module.exports = {
    connectDB,
    getDB,
    getClient
};