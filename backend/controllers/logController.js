const getLogs = require("../services/logService");

function logController(req, res) {

    res.json({
        status: "Logs Retrieved",
        logs: getLogs()
    });
}

module.exports = logController;