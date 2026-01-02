# Aequitas Backend

Go backend for Aequitas retail stock trading platform.

## Architecture

This backend follows the **Controller-Service-Repository (CSR)** pattern:

- **Controllers**: Thin HTTP layer (< 100 lines)
- **Services**: Business logic (< 300 lines)
- **Repositories**: Data access layer (< 200 lines)
- **Utils**: Helper functions (< 100 lines)

## Setup

1. Install dependencies:
```bash
go mod download
```

2. Start MongoDB (using Docker):
```bash
docker-compose up -d
```

3. Run the server:
```bash
go run cmd/server/main.go
```

Server will start on `http://localhost:8080`

## API Endpoints

### Authentication

**Register User** (US-0.1.1)
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login** (US-0.1.3)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## API Response Format

All endpoints follow this standardized format:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message"
}
```

## Environment Variables

See `.env` file for configuration.
