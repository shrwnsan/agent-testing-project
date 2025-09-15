# Authentication Service API Documentation

This document provides detailed documentation for the Authentication Service API endpoints. This is a mock implementation for testing purposes and contains several security vulnerabilities that should not be present in a production system.

## Base URL

```
http://localhost:3000
```

## Authentication

This API does not implement proper authentication tokens or sessions. All endpoints are publicly accessible.

## Endpoints

### 1. Register a New User

Registers a new user account in the system.

#### Endpoint
```
POST /register
```

#### Request Body
| Parameter | Type   | Required | Description                 | Constraints           |
|-----------|--------|----------|-----------------------------|-----------------------|
| username  | string | Yes      | Unique username for the user | 1-50 characters       |
| password  | string | Yes      | Password for the account     | 1-100 characters       |

#### Request Example
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

#### Response
##### Success (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

##### Error (400 Bad Request)
```json
{
  "success": false,
  "message": "User already exists"
}
```

##### Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### Curl Example
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "securePassword123"}'
```

---

### 2. Login

Authenticates a user with their credentials.

#### Endpoint
```
POST /login
```

#### Request Body
| Parameter | Type   | Required | Description         | Constraints     |
|-----------|--------|----------|---------------------|-----------------|
| username  | string | Yes      | Username of the user | 1-50 characters |
| password  | string | Yes      | User's password      | 1-100 characters |

#### Request Example
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

#### Response
##### Success (200 OK)
```json
{
  "success": true,
  "user": {
    "username": "john_doe",
    "password": "$2b$10$...",  // bcrypt hash (SECURITY ISSUE: Should not be exposed)
    "created": "2023-01-01T00:00:00.000Z"
  }
}
```

> ⚠️ **Security Note**: The response includes the password hash, which is a serious security vulnerability. In a production system, sensitive information like password hashes should never be sent to the client.

##### Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

##### Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### Curl Example
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "securePassword123"}'
```

---

### 3. Get User Information

Retrieves information about a specific user.

#### Endpoint
```
GET /user/:username
```

#### Path Parameters
| Parameter | Type   | Required | Description         | Constraints     |
|-----------|--------|----------|---------------------|-----------------|
| username  | string | Yes      | Username of the user | 1-50 characters |

#### Response
##### Success (200 OK)
```json
{
  "username": "john_doe",
  "password": "$2b$10$...",  // bcrypt hash (SECURITY ISSUE: Should not be exposed)
  "created": "2023-01-01T00:00:00.000Z"
}
```

> ⚠️ **Security Note**: This endpoint exposes sensitive information including the password hash. Additionally, it reveals whether a user exists or not, which can lead to user enumeration attacks.

##### Error (404 Not Found)
```json
{
  "success": false,
  "message": "User john_doe not found"
}
```

> ⚠️ **Security Note**: The error message reveals that a user doesn't exist, which is another security vulnerability that could be exploited for user enumeration.

##### Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### Curl Example
```bash
curl -X GET http://localhost:3000/user/john_doe
```

---

### 4. Search Users

Searches for users based on a query string.

#### Endpoint
```
GET /search
```

#### Query Parameters
| Parameter | Type   | Required | Description        | Constraints     |
|-----------|--------|----------|--------------------|-----------------|
| query     | string | No       | Search query term  | 0-100 characters |

#### Response
##### Success (200 OK)
Returns an array of user objects that match the search query:
```json
[
  {
    "username": "john_doe",
    "password": "$2b$10$...",  // bcrypt hash (SECURITY ISSUE: Should not be exposed)
    "created": "2023-01-01T00:00:00.000Z"
  },
  {
    "username": "jane_doe",
    "password": "$2b$10$...",
    "created": "2023-01-02T00:00:00.000Z"
  }
]
```

> ⚠️ **Security Note**: This endpoint also exposes password hashes and could be used to enumerate users in the system.

##### Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### Curl Example
```bash
curl -X GET "http://localhost:3000/search?query=john"
```

---

## Error Codes

| HTTP Status | Error Code | Description                           |
|-------------|------------|---------------------------------------|
| 200         | OK         | Successful GET request                |
| 201         | Created    | Successful POST request               |
| 400         | Bad Request| Invalid request data                  |
| 404         | Not Found  | Requested resource not found          |
| 500         | Internal Server Error | Server-side error         |

## Security Considerations

This is a mock implementation for testing purposes and contains several security vulnerabilities:

1. **Password Hash Exposure**: Password hashes are sent to the client in multiple endpoints.
2. **User Enumeration**: Error messages reveal whether users exist or not.
3. **Insecure Storage**: User data is stored in memory and is lost when the application restarts.
4. **Lack of Rate Limiting**: No protection against brute force attacks.
5. **No Input Validation**: Limited validation of user inputs.
6. **No Authentication**: Endpoints are publicly accessible without authentication.

These issues should be addressed in any production implementation.

## Rate Limiting

This mock implementation does not include rate limiting. In a production system, rate limiting should be implemented to prevent abuse of authentication endpoints.

## Data Persistence

User data is stored in memory using a JavaScript Map. This means all data is lost when the application restarts. A production system should use a persistent database.