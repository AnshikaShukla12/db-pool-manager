const getMetrics = require("../services/metricsService");

function metricsController(req, res) {

    res.json({
        status: "Metrics Running",
        data: getMetrics()
    });
}

module.exports = metricsController;