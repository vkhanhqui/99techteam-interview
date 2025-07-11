# Problem 6: Architecture

## Software Requirements
1. We have a website with a score board, which shows the top 10 user’s scores.
2. We want live update of the score board.
3. User can do an action (which we do not need to care what the action is), completing this action will increase the user’s score.
4. Upon completion the action will dispatch an API call to the application server to update the score.
5. We want to prevent malicious users from increasing scores without authorisation.

## Solution

### High-level Design

![Overview](/diagrams/overview.excalidraw.png)

Overview:
- First, frontend fetches the score board from API and establishes WebSocket connection.
- When a user performs an action, frontend calls API to increase their score.
- After updating the score, backend publishes a message to SQS.
- Worker polls SQS, list top 10 from database and published the result via Redis Pub/Sub.
- As a subscriber, backend receives the update and pushes the new top 10 scores to websocket clients.

Techstack:
- Node.js, Express, TypeScript
- AWS Cognito, SQS
- Redis, PostgreSQL

### Detail Design

#### API Server Flow
![API Server Flow](/diagrams/api_server_flow.png)

##### API Documentation
1. POST /users/auth/login
Authenticate user credentials and return access tokens.
Note: Tokens are issued by Cognito.
    ```json
    Request:
    {
        "email": "user@example.com",
        "password": "your_password"
    }

    Response:
    {
        "accessToken": "token",
        "refreshToken": "token"
    }

    Status Codes:
    - 200 OK
    - 401 Unauthorized
    ```

2. GET /scores
Returns the current top 10 users by score.
Note:
    - First tries to read from Redis cache with key `leaderboard:top10`.
    - Cache miss, falls back to PostgreSQL and write results to Redis with TTL 1 minute.
    ```json
    Response:
    {
        "scores": [
            { "email": "<email1>", "score": 10 },
            { "email": "<email2>", "score": 9 },
            ...
        ]
    }

    Status Codes:
    - 200 OK
    ```

3. POST /scores/increment
Increments the user's score by 1.
    ```json
    Headers:
    - Authorization: Bearer <accessToken>

    Response:
    {
        "message": "Score incremented"
    }

    Status Codes:
    - 200 OK
    - 401 Unauthorized
    ```
    Note:
    - Auth is required.
    - Send a message to SQS after incrementing:
    ```json
    Payload:
    {
        "userId": "<userId>",
        "email": "<email>",
        "type": "score.increment"
    }
    ```

4. WebSocket Connection
Opens a real-time connection for receiving live scoreboard updates.
URL: `wss://<host>/scores/websocket`
Note: Server listens for `leaderboard:updated` events via Redis.
    ```json
    {
        "scores": [
            { "email": "<email1>", "score": 10 },
            { "email": "<email2>", "score": 9 },
            ...
        ]
    }
    ```

#### Worker Flow
![Worker Flow](/diagrams/worker_flow.png)

1. Do long polling SQS for messages with batch size 10.
2. Filter message type: ```{ type: "score.increment" }```
3. Select top 10 from PostgreSQL.
4. Write result to Redis key `leaderboard:top10` with TTL 1 minute.
5. Publish to Redis channel `leaderboard:updated` with payload:
    ```json
    {
        "scores": [
            { "email": "<email1>", "score": 10 },
            { "email": "<email2>", "score": 9 },
            ...
        ]
    }
    ```
6. Remove messages after successful processing.

## Future Improvement

- Use Cloudflare to protect public endpoints from DDoS.
- Add rate limiter to prevent score spamming.
- Store action history for auditing.
