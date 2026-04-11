const express = require("express");
const router = express.Router();

const metricsController = require("../controllers/metricsController");

router.get("/metrics", metricsController);

module.exports = router;