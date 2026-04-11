const express = require("express");

const router = express.Router();

const {
    getHealth,
    getPool,
    getLogs
} = require("../controllers/poolController");

/* Health Route */
router.get("/health", getHealth);

/* Pool Status Route */
router.get("/pool-status", getPool);

/* Logs Route */
router.get("/logs", getLogs);

module.exports = router;