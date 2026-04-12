# Database Connection Pool Manager

An intelligent full-stack application designed to dynamically manage, monitor, and scale MongoDB connection pools based on real-time traffic and request loads.

## 🌟 Key Features

* **Real-time Monitoring Dashboard:** A React/Vite frontend UI offering live metrics showing Active Connections, Idle Connections, and Pool Saturation.
* **Intelligent Auto-Scaling:** The Express Node.js backend continuously measures `requestCount` and autonomously adjusts the MongoDB `maxPoolSize` up or down to gracefully handle traffic spikes without dropping requests.
* **Historical Trend Predictions:** Analyzes past metric arrays natively to predict if server load is currently "*Increasing*", "*Decreasing*", or "*Stable*".
* **Extensible Scripting:** Easily trigger pool adjustments manually through external Unix shell scripts (`adjustPool.sh`).
* **Health Scoring System:** Calculates a live generic "Health" score based on active connections against waiting queued requests.

## 🛠️ Technology Stack

**Frontend:**
* React (Vite)
* Tailwind CSS for dynamic dark/light interface execution
* Socket.IO-client & Axios
* Recharts (for live connection charting)

**Backend:**
* Node.js (Express framework)
* MongoDB Ecosystem Native Node Driver (`mongodb`)
* CORS

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and a local MongoDB instance running (usually at `mongodb://127.0.0.1:27017` by default).

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the developmental Node.js API (runs natively on **Port 5000**):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a *second* terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend packages:
   ```bash
   npm install
   ```
3. Boot up the Vite developer server (configured to **Port 3000**):
   ```bash
   npm run dev
   ```

### 3. Usage
Once both endpoints are booted, open up `http://localhost:3000` in your browser. 
As requests are made over time to the backend, you'll see the line chart actively logging connections flowing in and out in real-time.

---

## 💻 Manual Adjustments

If you want to manually trigger a test resizing event from the terminal, simply run the accompanied bash script inside the backend:
```bash
# Example: Immediately adjust the maxPoolSize to 25
bash backend/scripts/adjustPool.sh 25
```
