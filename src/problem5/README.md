# Problem 5: A Crude Server

## Introduction
Simple CRUD server built with TypeScript, Express, PostgreSQL, following monorepo structure.

### Project Structure
```
.
├── __tests__              # Integration tests
└── services/api           # API service
    └── src
        ├── api            # Route handlers
        ├── dto            # Input validation
        ├── models         # Database models
        ├── repositories   # Database layer
        └── services       # Business logic layer
```

### Features
- Create a subscriber
- List subscribers
- Get details of a subscriber
- Update a subscriber
- Get details of a subscriber

## Starting project

### Docker

1. Start all services:
```bash
make compose-all
```

2. Run integration tests:
```bash
make test-integration
```

3. Shutdown all services:
```bash
make compose-down
```

### Local development

**Set up project**
1. Start infra & install node_modules:
```bash
make compose
npm i && npm build
```

2. Select service:
```bash
# cd services/{service_name}
cd services/api
cp .env.dist .env
```

3. Open `.env` and rename host. For example:
```
From: PG_DB_CONN_URI=postgresql://postgres:postgres@postgres:5432/appdb?sslmode=disable
To:   PG_DB_CONN_URI=postgresql://postgres:postgres@localhost:5432/appdb?sslmode=disable
```

4. Start service:
```bash
npm start
```

5. Debug with VS Code:
Debug > Attach by Process ID

**Run integration tests**
1. Open another terminal at root, then rename host (the same as step 3):
```bash
cp .env.test .env
```

2. Run integration tests:
```bash
make test-integration
```

### Sample `cURL` commands

1. Create a subscriber
```bash
curl --location 'http://localhost:3000/subscribers' \
--header 'Content-Type: application/json' \
--data '{
    "email": "mock@mock.com",
    "status": "mock",
    "first_name": "mock",
    "last_name": "mock"
  }'
```

Response:
```json
{
    "id": "0197f49e-555e-7176-baee-adb0bb958564",
    "status": "mock",
    "email": "mock@mock.com",
    "first_name": "mock",
    "last_name": "mock",
    "created_at": "2025-07-10T13:55:06.748Z",
    "updated_at": "2025-07-10T13:55:06.748Z"
}
```

2. List subscribers
```bash
curl --location 'http://localhost:3000/subscribers?status=&perPage=10&page=1&sort_by=created_at&order=desc&email='
```

Response:
```json
{
    "data": [
        {
            "id": "0197f49e-555e-7176-baee-adb0bb958564",
            "status": "mock",
            "email": "mock@mock.com",
            "first_name": "mock",
            "last_name": "mock",
            "created_at": "2025-07-10T13:55:06.748Z",
            "updated_at": "2025-07-10T13:55:06.748Z"
        },
        {
            "id": "0197f397-338f-702d-8358-e5776148a679",
            "status": "inactive",
            "email": "delete+0197f397-338f-702d-8358-e0442d30b0a4@example.com",
            "first_name": "mock",
            "last_name": "mock",
            "created_at": "2025-07-10T09:07:42.103Z",
            "updated_at": "2025-07-10T09:07:42.103Z"
        },
        {
            "id": "0197f397-32d0-70fc-bd63-b1e8ec2e1f54",
            "status": "inactive",
            "email": "update+0197f397-32d0-70fc-bd63-aec72b7e3b39@example.com",
            "first_name": "mock",
            "last_name": "mock",
            "created_at": "2025-07-10T09:07:41.921Z",
            "updated_at": "2025-07-10T09:07:41.921Z"
        },
        {
            "id": "0197f397-32ce-7614-859c-192f8b9b5ad0",
            "status": "active",
            "email": "john+0197f397-32ce-7614-859c-17d2e1e38381@example.com",
            "first_name": "mock",
            "last_name": "mock",
            "created_at": "2025-07-10T09:07:41.919Z",
            "updated_at": "2025-07-10T09:07:41.919Z"
        }
    ],
    "pagination": {
        "page": 1,
        "perPage": 10,
        "total": 4,
        "totalPages": 1
    }
}
```

3. Get details of a subscriber
```bash
curl --location 'http://localhost:3000/subscribers/{id}'
```

Response:
```json
{
    "id": "0197f49e-555e-7176-baee-adb0bb958564",
    "status": "mock",
    "email": "mock@mock.com",
    "first_name": "mock",
    "last_name": "mock",
    "created_at": "2025-07-10T13:55:06.748Z",
    "updated_at": "2025-07-10T13:55:06.748Z"
}
```

4. Update a subscriber
```bash
curl --location --request PUT 'http://localhost:3000/subscribers/{id}' \
--header 'Content-Type: application/json' \
--data '{
    "status": "mock",
    "first_name": "mock"
  }'
```

Response:
```json
{
    "id": "0197f49e-555e-7176-baee-adb0bb958564",
    "status": "mock",
    "email": "mock@mock.com",
    "first_name": "mock",
    "last_name": "mock",
    "created_at": "2025-07-10T13:55:06.748Z",
    "updated_at": "2025-07-10T13:58:39.850Z"
}
```

5. Delete a subscriber
```bash
curl --location --request DELETE 'http://localhost:3000/subscribers/{id}'
```