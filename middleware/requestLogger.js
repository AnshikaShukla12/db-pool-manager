const logger = require('../utils/logger');

function requestLogger(req, res, next) {

    const message = `${req.method} ${req.url}`;

    logger(message);

    next();
}

module.exports = requestLogger;