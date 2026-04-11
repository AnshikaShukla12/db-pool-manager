DB Pool Manager

A full-stack application designed to manage and monitor database connection pooling efficiently, featuring a Node.js + Express backend and a React (Vite) frontend dashboard.

Project Overview

The repository is divided into two main modules:

Backend/ → Handles API services, connection pool monitoring, adaptive scaling logic, and real-time communication via WebSockets.
Frontend/ → Provides an interactive dashboard to visualize metrics, analyze performance, manage configurations, and monitor system health.
Core Features
Real-time updates of pool metrics using WebSockets
Dashboard displaying key metrics such as active, idle, waiting connections, and pool saturation
Advanced analytics with historical data trends, heatmap-style visualization, and basic load prediction
Metrics page with options to export data in JSON and CSV formats
Configuration panel with role-based access control (Admin / Viewer)
Audit logs to track configuration changes and system events
Dark mode support with persistent user preference
Fully responsive design for both desktop and mobile devices
Centralized API handling using Axios with interceptors and retry mechanisms
Backend Details
Technology Stack
Node.js
Express.js
MongoDB
Socket.IO
Key Files
Backend/app.js → Entry point managing REST APIs and WebSocket events
Backend/services/metricsStore.js → Stores historical metrics and audit logs
Backend/services/poolMonitor.js → Tracks real-time pool status
Backend/services/adaptivePool.js → Implements dynamic pool resizing logic
Backend/config/poolConfig.json → Contains default pool configurations
Run Backend
cd Backend
npm install
npm start

By default, the backend runs on:
http://localhost:3000

Frontend Details
Technology Stack
React (with Vite)
Tailwind CSS
React Router
Recharts
Axios
Socket.IO Client
Key Files
Frontend/src/App.jsx → Manages routing, layout, and lazy loading
Frontend/src/context/PoolContext.jsx → Global state management with WebSocket integration and alert handling
Frontend/src/services/api.js → Axios configuration with interceptors
Frontend/src/hooks/useMetrics.js → Polling fallback for fetching metrics
Frontend/src/pages/Dashboard.jsx → Main monitoring dashboard
Frontend/src/pages/Analytics.jsx → Data analysis and prediction view
Frontend/src/pages/Metrics.jsx → Detailed metrics table with export functionality
Frontend/src/pages/Settings.jsx → Pool configuration with role-based access
Frontend/src/pages/Logs.jsx → Displays audit logs and system activity
Run Frontend
cd Frontend
npm install
npm run dev
Environment Configuration
The frontend allows backend URL customization using:
VITE_API_URL
Project Structure
Backend/
  app.js
  config/
    db.js
    poolConfig.json
  routes/
  services/
    adaptivePool.js
    metricsStore.js
    poolMonitor.js

Frontend/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    utils/
    App.jsx
    main.jsx
    index.css
Additional Notes
The frontend build has been successfully verified using npm run build
Backend supports real-time updates, historical metrics tracking, and audit logging
Update VITE_API_URL if the backend runs on a different host or port


