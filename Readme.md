# Salon Partner Queue Management System

A scalable, microservices-based backend system that manages real-time salon customer queues, partner requests, bookings, and shop discovery — optimized for concurrency, real-time updates, and async task handling.

---

## 🚀 Features

- 🎯 Real-time request queueing per salon partner using Redis-backed queues
- ⏳ Cool-off timers & soft cancellation logic to prevent spam requests
- ⌛ Request auto-expiry and status transitions via BullMQ background jobs
- 📍 Geo-hashed shop discovery using MongoDB and location filtering
- 🔁 Firebase-triggered real-time updates to frontend (debounced)
- 🔐 JWT-authenticated API Gateway for internal service routing
- 🐳 Dockerized microservices with Compose for orchestration

---

## 🧠 Core Microservices

- **request-service**: Manages customer-partner request queues using Redis
- **booking-service**: Handles confirmed bookings and status transitions
- **notification-service**: Simulates real-time Firebase triggers for UI updates
- **analytics-service**: (Optional) For tracking flow metrics (under development)
- **gateway**: JWT-authenticated API gateway for unified routing

---

## ⚙️ Tech Stack

- **Node.js**, **Express.js**
- **Redis**, **BullMQ**
- **MongoDB** (Geo-indexed)
- **Firebase Realtime Database** (for client triggers)
- **Docker**, **Docker Compose**
- **JWT** (Auth middleware)

---

## 📐 System Design Highlights

- Each partner has an **isolated Redis queue** to ensure request order and avoid cross-queue collisions
- **BullMQ jobs** are scheduled to timeout requests or move incomplete bookings to "pending"
- Firebase triggers are written only when needed to reduce UI load (debounced ~500ms)
- MongoDB geo-bucketing is used to pre-filter shops before exact `$geoWithin` checks — improves performance
- Cool-off keys (Redis TTL) prevent spamming the same partner repeatedly

---

## 🛠️ Local Setup (Basic)

```bash
# Clone the repo
git clone https://github.com/ArjunR00T/project-s-backend.git
cd project-s-backend

# Install dependencies per service (sample for request-service)
cd request-service
npm install

# Start Redis and MongoDB (locally or via Docker)
# Then run services using Docker Compose
docker-compose up --build
```

## 🙌 Author
Built with ❤️ by Arjun Gireesh
Currently open to backend-focused roles at product-first companies.
