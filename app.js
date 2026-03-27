const express = require("express");
require("dotenv").config();

const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const getPoolStatus = require("./services/poolMonitor");
const { increaseRequest, adjustPool } = require("./services/adaptivePool");

const app = express();
app.use(express.json());

/* Middleware to count requests */
app.use((req, res, next) => {
    increaseRequest();
    next();
});

/* Home Route */
app.get("/", (req, res) => {
    res.send("Database Pool Manager Running");
});

/* Health Check */
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        time: new Date()
    });
});

/* API Routes */
app.use("/api", userRoutes);

/* Pool Status */
app.get("/pool-status", (req, res) => {
    res.json(getPoolStatus());
});

/* Start Server */
async function startServer() {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("Server running on port", PORT);
    });

    /* Adaptive Pool Scaling every 30 sec */
    setInterval(() => {
        adjustPool();
    }, 30000);
}

startServer();