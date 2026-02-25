# Aladia NestJS Technical Challenge

## Overview

This repository is my submission for the Aladia NestJS Backend Technical Challenge. Below I document how each requirement was addressed, along with the bonus features implemented and key architectural decisions.

## Project Structure

As required, the project uses a NestJS Monorepo with the following `apps/` layout:

```text
apps/
├── gateway/          # Public HTTP REST API
├── authentication/   # Internal TCP microservice
├── common/           # Shared DTOs, RTOs, NetworkingService
├── core/             # Logger, GlobalExceptionFilter, TransformInterceptor
└── config/           # Typed environment configuration
```

### Monorepo Architecture

The project uses the native NestJS `apps/` monorepo structure. Each app is independently runnable and shares code only through the `common`, `core`, and `config` libraries.

### Controller → Service → Repository

As explicitly requested (no Clean or Hexagonal Architecture), all feature code follows a strict 3-tier pattern:

- **Controllers** live in `apps/gateway` and handle HTTP routing and DTO validation.
- **Services** in `apps/authentication` contain business logic.
- **Repositories** in `apps/authentication` handle all Mongoose/MongoDB interactions.

### HTTP Logic in Gateway, Business Logic in Authentication

All REST endpoints are defined in `apps/gateway`. The gateway does not interact with the database directly — it forwards every operation to the authentication microservice via TCP.

### TCP Communication via NetworkingService

The two apps communicate exclusively over TCP using `@nestjs/microservices`. A dedicated `NetworkingService` (in `apps/common`) abstracts the message-passing logic, so gateway controllers never reference the TCP client directly. This was a specific requirement of the challenge.

### User Management Endpoints

Both required endpoints are implemented:

| Method | Endpoint         | Description                                                                   |
| :----- | :--------------- | :---------------------------------------------------------------------------- |
| `POST` | `/auth/register` | Registers a new user (validated DTO → TCP → authentication service → MongoDB) |
| `GET`  | `/auth/users`    | Returns all registered users                                                  |

### Validation with DTOs

`class-validator` and `class-transformer` are used on all incoming request bodies. DTOs are defined in `apps/common` so both apps share the same contracts.

### Database: MongoDB with Mongoose

User persistence is handled in `apps/authentication` using `@nestjs/mongoose`. MongoDB is provisioned via Docker Compose with authentication enabled.

### Centralized Logging Module

A custom `LoggerService` lives in `apps/core` and is used across all apps for context-aware, structured logging.

### Health Checks

A `GET /health` endpoint is exposed on the gateway. It pings the authentication service and verifies DB connectivity, providing a basic readiness probe.

### In-Memory Caching

`@nestjs/cache-manager` is applied to `GET /auth/users` with a 60-second TTL, as a practical example of reducing load on high-read endpoints.

### Swagger Documentation

Auto-generated API docs are available at [http://localhost:3000/swagger](http://localhost:3000/swagger), with annotated response models and endpoint descriptions.

### Postman Collection

You can import the [Aladia.postman_collection.json](./Aladia.postman_collection.json) file directly into Postman to test the API endpoints.

### Response Standardization

A `TransformInterceptor` in `apps/core` wraps all responses:

```json
{
  "success": true | false,
  "message": "...",
  "data": {} | null,
  "timestamp": "..."
}
```

### Global Exception Filter

A `GlobalExceptionFilter` in `apps/core` standardizes error responses and correctly propagates exceptions thrown inside the authentication microservice back through TCP to the gateway and out to the client.

---

## Docker Setup

A `docker-compose.yml` orchestrates all three containers:

1. **aladia-mongodb** — persistent store with auth enabled
2. **authentication** — internal service with a TCP health check
3. **gateway** — waits for authentication to be healthy before starting

### Quick start:

```bash
cp .env.example .env

# start the project
docker compose up -d --build
```
