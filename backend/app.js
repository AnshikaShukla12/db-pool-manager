const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* DB */
const { connectDB } = require("./config/db");

/* Routes */
const userRoutes = require("./routes/userRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const logRoutes = require("./routes/logRoutes");

/* Services */
const getPoolStatus = require("./services/poolMonitor");
const { increaseRequest, adjustPool } = require("./services/adaptivePool");

/* Middleware */
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(requestLogger);

/* Request Counter */
app.use((req, res, next) => {
    increaseRequest();
    next();
});

/* Home */
app.get("/", (req, res) => {
    res.send("Database Pool Manager Running");
});

/* Health */
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        time: new Date()
    });
});

/* Pool Status */
app.get("/pool-status", (req, res) => {
    res.json({
        status: "Pool Running",
        data: getPoolStatus()
    });
});

/* Routes */
app.use("/", monitorRoutes);
app.use("/", metricsRoutes);
app.use("/", logRoutes);
app.use("/api", userRoutes);

/* 404 Handler */
app.use((req, res, next) => {
    const error = new Error("Route Not Found");
    error.status = 404;
    next(error);
});

/* Global Error Handler */
app.use(errorHandler);

/* Start Server */
async function startServer() {

    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("Server running on port", PORT);
    });

    /* Adaptive Pool Scaling */
    setInterval(() => {
        adjustPool();
    }, 30000);
}

startServer();