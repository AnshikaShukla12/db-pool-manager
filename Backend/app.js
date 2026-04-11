const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const getPoolStatus = require('./services/poolMonitor');
const { increaseRequest, adjustPool } = require('./services/adaptivePool');
const metricsStore = require('./services/metricsStore');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.use(express.json());

app.use((req, res, next) => {
  increaseRequest();
  next();
});

app.get('/', (req, res) => {
  res.send('Database Pool Manager Running');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date(),
  });
});

app.use('/api', userRoutes);

app.get('/pool-status', (req, res) => {
  const status = getPoolStatus();
  const latestMetric = metricsStore.getMetrics()[0];
  res.json({
    ...status,
    ...(latestMetric || {}),
  });
});

app.get('/metrics', (req, res) => {
  res.json(metricsStore.getMetrics());
});

app.get('/logs', (req, res) => {
  res.json(metricsStore.getLogs());
});

app.put('/config', (req, res) => {
  const currentConfig = metricsStore.readConfig();
  const nextConfig = {
    ...currentConfig,
    ...req.body,
  };

  if (typeof nextConfig.maxPoolSize !== 'number' || nextConfig.maxPoolSize < 1) {
    return res.status(400).json({ message: 'maxPoolSize must be a valid positive number.' });
  }

  if (typeof nextConfig.minPoolSize !== 'number' || nextConfig.minPoolSize < 0) {
    return res.status(400).json({ message: 'minPoolSize must be a valid non-negative number.' });
  }

  if (typeof nextConfig.waitQueueTimeoutMS !== 'number' || nextConfig.waitQueueTimeoutMS < 0) {
    return res.status(400).json({ message: 'waitQueueTimeoutMS must be a valid non-negative number.' });
  }

  metricsStore.writeConfig(nextConfig);
  const logEntry = metricsStore.addPoolConfigLog(currentConfig, nextConfig);
  io.emit('pool:update', getPoolStatus());
  io.emit('logs:update', logEntry);

  return res.json(nextConfig);
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.emit('socket:connected', { message: 'Connected to pool manager websocket.' });
  socket.emit('pool:update', getPoolStatus());
  socket.emit('metrics:update', metricsStore.getMetrics()[0] || metricsStore.createMetricSnapshot());

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

async function startServer() {
  await connectDB();
  metricsStore.initMetrics();

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });

  setInterval(() => {
    const snapshot = metricsStore.createMetricSnapshot();
    io.emit('metrics:update', snapshot);
  }, 4500);

  setInterval(() => {
    const oldConfig = metricsStore.readConfig();
    adjustPool();
    const newConfig = metricsStore.readConfig();

    if (oldConfig.maxPoolSize !== newConfig.maxPoolSize) {
      const logEntry = metricsStore.addAutoscaleLog(oldConfig, newConfig);
      io.emit('pool:update', getPoolStatus());
      io.emit('logs:update', logEntry);
    }
  }, 30000);
}

startServer();
