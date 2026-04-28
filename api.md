# API Documentation

Base URL: `http://localhost:5000/api`

All requests must include the header:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

---

## 🔐 Auth

### POST `/auth/login`
Login and receive a JWT token.

**Request Body:**
```json
{ "username": "admin", "password": "password123" }
```
**Response:**
```json
{ "token": "eyJhbGci...", "expiresIn": "7d" }
```

---

## 🏊 Pool Management

### GET `/pools`
Returns all active pools.

**Response:**
```json
[
  { "name": "my-pool", "host": "localhost", "max": 10, "active": 3, "idle": 7 }
]
```

---

### POST `/pools`
Create a new connection pool.

**Request Body:**
```json
{
  "name": "my-pool",
  "host": "localhost",
  "port": 5432,
  "database": "mydb",
  "user": "admin",
  "password": "password",
  "max": 10,
  "min": 2,
  "idleTimeoutMillis": 30000
}
```
**Response:** `201 Created`
```json
{ "message": "Pool created successfully", "pool": { "name": "my-pool", "max": 10 } }
```

---

### GET `/pools/:name`
Get details of a specific pool.

**Response:**
```json
{
  "name": "my-pool",
  "host": "localhost",
  "max": 10,
  "active": 3,
  "idle": 7,
  "waiting": 0
}
```

---

### DELETE `/pools/:name`
Delete a pool by name.

**Response:** `200 OK`
```json
{ "message": "Pool deleted successfully" }
```

---

## 🔌 Connection Management

### POST `/pools/:name/acquire`
Acquire a connection from a pool.

**Response:**
```json
{ "connectionId": "conn-abc123", "status": "active" }
```

---

### POST `/connections/:id/release`
Release a connection back to the pool.

**Response:**
```json
{ "message": "Connection released", "connectionId": "conn-abc123" }
```

---

### GET `/pools/:name/stats`
Get live connection stats for a pool.

**Response:**
```json
{
  "total": 10,
  "active": 3,
  "idle": 7,
  "waiting": 0
}
```

---

## ❌ Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — invalid config or missing fields |
| `401` | Unauthorized — missing or invalid token |
| `404` | Not Found — pool or connection does not exist |
| `409` | Conflict — pool with that name already exists |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal Server Error |

**Error Response Format:**
```json
{ "error": true, "message": "Pool not found", "statusCode": 404 }
```
