# Architecture Overview

## How db-pool-manager Works

```
Client Request
      │
      ▼
┌─────────────┐
│   Routes    │  ← defines API endpoints
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ← auth, validation, rate limiting, error handling
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  ← handles request/response logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ← core business logic (pool & connection management)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Config    │  ← DB config, pool settings from .env
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │  ← PostgreSQL / MySQL
└─────────────┘
```

---

## Folder Responsibilities

| Folder | Responsibility |
|--------|---------------|
| `routes/` | Maps HTTP methods + URLs to controllers |
| `controllers/` | Parses request, calls service, sends response |
| `services/` | Pool creation, connection acquire/release logic |
| `middleware/` | Auth, validation, error handler, rate limiter |
| `config/` | DB connection config, env variable loading |
| `utils/` | Reusable helpers (logger, response formatter) |
| `scripts/` | Admin scripts (adjust pool size, health checks) |

---

## Pool Lifecycle

```
createPool() → pool stored in memory
      │
      ▼
acquireConnection() → pulls idle connection from pool
      │
      ▼
[ DB query executes ]
      │
      ▼
releaseConnection() → returns connection to idle pool
      │
      ▼
idleTimeout reached → connection closed automatically
      │
      ▼
deletePool() → all connections closed, pool removed
```

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL / MySQL
- **Auth:** JWT (JSON Web Tokens)
- **Testing:** Jest
- **CI:** GitHub Actions
