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

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/aequitas
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRY_HOURS=24
PORT=8080
```

**Important Notes:**
- `JWT_SECRET` must be set for authentication to work
- Use a strong, random secret in production
- File must be ASCII or UTF-8 encoded (no BOM)
- Server validates JWT_SECRET on startup

## Setup Instructions

### Prerequisites
- Go 1.21 or higher
- MongoDB 6.0+ running locally or via Docker

### Installation Steps

1. **Install Go dependencies:**
   ```bash
   # Set GOPATH to avoid permission issues
   $env:GOPATH = "$env:USERPROFILE\go"
   go mod tidy
   ```

2. **Start MongoDB:**
   ```bash
   # Using Docker
   docker-compose up -d
   
   # Or use local MongoDB installation
   ```

3. **Create `.env` file** (see Environment Variables section above)

4. **Run the server:**
   ```bash
   go run cmd/server/main.go
   ```

Server will start on `http://localhost:8080`

You should see:
```
Configuration loaded successfully
Connected to MongoDB successfully
Server starting on port 8080
```

