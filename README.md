# ERP System

A modular, scalable ERP system inspired by SAP's enterprise architecture.

## Project Structure

```
DVN/
├── backend/          # Spring Boot 4.1 + Java 21 API
├── frontend/         # React + Vite + Tailwind CSS
├── docker-compose.yml
└── README.md
```

## Tech Stack

| Layer    | Technology                                            |
|----------|-------------------------------------------------------|
| Backend  | Java 21, Spring Boot 4.1, PostgreSQL 17, Flyway      |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS             |
| Security | Spring Security + JWT                                 |
| Build    | Maven (backend), npm (frontend)                       |
| Infra    | Docker Compose                                        |

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- Docker & Docker Compose

### 1. Start the database

```bash
docker compose up -d
```

### 2. Start the backend

```bash
cd backend
export JWT_SECRET=$(openssl rand -base64 32)
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to `:8080`.

## Backend

See [backend/README.md](backend/README.md) for full API documentation.

### Quick Reference

| Endpoint                    | Description            | Auth |
|-----------------------------|------------------------|------|
| `POST /api/v1/auth/login`   | Login, get JWT tokens  | No   |
| `POST /api/v1/auth/refresh` | Refresh access token   | No   |
| `GET /actuator/health`      | Health check           | No   |
| All other `/api/v1/**`      | JWT Bearer token       | Yes  |

## License

Private - All rights reserved.
