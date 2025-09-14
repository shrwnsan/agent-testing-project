# Authentication Service API Documentation

This document provides detailed information about the Authentication Service API endpoints, including request/response formats, parameter details, error codes, and security considerations.

## Base URL

All endpoints are relative to the base URL of the authentication service.

## Authentication

This service does not implement a token-based authentication system. Each endpoint handles authentication as part of its specific functionality. However, this implementation has security issues that are documented in the specific endpoints.

## Endpoints

### 1. Register a New User

**Endpoint:** `POST /register`

**Description:** Registers a new user in the system with a username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Parameters:**

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| username | string | Yes | Unique identifier for the user | 3-20 characters, alphanumeric only |
| password | string | Yes | User's password | Minimum 6 characters |

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 400 | `{"success": false, "message": "User already exists"}` | When attempting to register with an existing username |
| 500 | `{"success": false, "message": "Internal server error"}` | Server-side error during registration process |

**Security Considerations:**
- Passwords are hashed using bcrypt before storage
- No rate limiting is implemented, making this endpoint vulnerable to abuse
- No validation is performed on password strength

### 2. User Login

**Endpoint:** `POST /login`

**Description:** Authenticates a user with their username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Parameters:**

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| username | string | Yes | User's unique identifier | Must exist in the system |
| password | string | Yes | User's password | Must match stored password hash |

**Success Response:**
```json
{
  "success": true,
  "user": {
    "username": "string",
    "password": "string", // Security issue: Password hash is exposed
    "created": "date"
  }
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 400 | `{"success": false, "message": "Invalid username or password"}` | Incorrect username or password |
| 500 | `{"success": false, "message": "Internal server error"}` | Server-side error during authentication process |

**Security Considerations:**
- Security vulnerability: The response includes the password hash which should never be exposed
- No rate limiting is implemented, making this endpoint vulnerable to brute force attacks
- The error message is the same for invalid username and invalid password, which is good for security

### 3. Get User Information

**Endpoint:** `GET /user/:username`

**Description:** Retrieves information about a specific user.

**Path Parameters:**

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| username | string | Yes | Username of the user to retrieve | Must exist in the system |

**Query Parameters:**
None

**Success Response:**
```json
{
  "username": "string",
  "password": "string", // Security issue: Password hash is exposed
  "created": "date"
}
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 404 | `{"success": false, "message": "User {username} not found"}` | Requested user does not exist |
| 500 | `{"success": false, "message": "Internal server error"}` | Server-side error during retrieval process |

**Security Considerations:**
- Security vulnerability: The response includes the password hash which should never be exposed
- Security vulnerability: Error messages reveal whether a user exists in the system
- No authentication is required to access this endpoint, making all user information public

### 4. Search Users

**Endpoint:** `GET /search`

**Description:** Searches for users based on a query string.

**Query Parameters:**

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| query | string | Yes | Search term to match against usernames | None |

**Path Parameters:**
None

**Success Response:**
```json
[
  {
    "username": "string",
    "password": "string", // Security issue: Password hash is exposed
    "created": "date"
  },
  ...
]
```

**Error Responses:**

| Status Code | Response | Description |
|-------------|----------|-------------|
| 500 | `{"success": false, "message": "Internal server error"}` | Server-side error during search process |

**Security Considerations:**
- Security vulnerability: The response includes password hashes which should never be exposed
- No authentication is required to access this endpoint, making user enumeration possible
- No input validation is performed on the search query, which could lead to injection vulnerabilities in a real database implementation

## Security Issues Summary

The authentication service has several critical security issues that should be addressed:

1. **Password Hash Exposure:** Password hashes are included in API responses, which is a serious security vulnerability.
2. **User Enumeration:** Error messages and the search endpoint reveal whether users exist in the system.
3. **Lack of Rate Limiting:** No protection against brute force attacks on login or registration endpoints.
4. **No Input Validation:** No validation on password strength or username format.
5. **No Session Management:** No token-based authentication system is implemented.
6. **Public User Information:** No authentication required to access user information.

## Error Code Explanations

| Error Code | Description |
|------------|-------------|
| 200 | Success - Request processed successfully |
| 201 | Created - Resource created successfully (registration) |
| 400 | Bad Request - Invalid request data |
| 404 | Not Found - Requested resource does not exist |
| 500 | Internal Server Error - Unexpected server-side error |

## Rate Limiting

Currently, there is no rate limiting implemented. In a production environment, rate limiting should be applied to prevent abuse of the authentication endpoints.

## Data Storage

User data is stored in-memory using a JavaScript Map. In a production environment, this should be replaced with a persistent database solution.