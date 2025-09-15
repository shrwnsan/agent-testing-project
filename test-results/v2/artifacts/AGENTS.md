# AGENTS.md - Context for Agent Interactions

This document provides comprehensive context for all agents working with this project, ensuring consistent and effective interactions.

## Project Overview

This is a mock Node.js project designed specifically to test the capabilities of our subagents team:
- Code Reviewer
- Security Code Reviewer
- Testing Expert
- Documentation Writer

The project implements a simple authentication service with user registration, login, user information retrieval, and search functionality. While intentionally basic, it contains several code quality and security issues to provide meaningful test scenarios for our agents.

### Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: bcrypt for password hashing
- **Testing**: Jest
- **Storage**: In-memory Map (for demonstration purposes only)

### Project Structure

```
.
├── src/
│   ├── index.js          # Express application with API endpoints
│   └── authService.js    # Authentication service implementation
├── tests/
│   └── authService.test.js  # Jest tests for AuthService
├── docs/
│   └── api.md            # API documentation
├── package.json          # Project dependencies and scripts
└── AGENT-TESTING-PLAN.md # Detailed testing scenarios for agents
```

## Building and Running

### Prerequisites
- Node.js (version not specified)
- npm (comes with Node.js)

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```
This starts the Express server (default port configuration not specified in code).

### Running Tests
```bash
npm test
```
This executes the Jest test suite.

## Development Conventions

### Code Structure
- Services are implemented as ES6 classes
- Express.js is used for routing and HTTP handling
- Async/await is used for asynchronous operations
- Error handling follows try/catch patterns
- Bcrypt is used for secure password hashing

### Testing Approach
- Jest is used as the testing framework
- Tests follow the Arrange-Act-Assert pattern
- Tests are organized in describe/test blocks
- Mock data is created in beforeEach hooks when needed

### Known Issues (For Agent Testing)
The project intentionally contains several issues for agent evaluation:
1. **Security Issues**:
   - Password hashes are returned to clients
   - User existence is revealed through error messages
   - No rate limiting on authentication endpoints
   - No input validation on search endpoint

2. **Code Quality Issues**:
   - In-memory storage (not suitable for production)
   - Limited error handling
   - Missing input validation
   - Poor separation of concerns in some areas

## API Endpoints

### POST /register
Registers a new user with username and password.

### POST /login
Authenticates a user with username and password.

### GET /user/:username
Retrieves information about a specific user.

### GET /search
Searches for users based on a query parameter.

## Agent-Specific Information

### Code Reviewer
Focus on:
- Code organization and structure
- Performance considerations
- Best practices adherence
- Error handling completeness
- Readability and maintainability
- Testability of the code

### Security Code Reviewer
Focus on:
- Authentication and authorization implementation
- Input validation
- Information disclosure vulnerabilities
- Data handling security
- Password management practices
- Session management (if applicable)

### Testing Expert
Focus on:
- Comprehensive test coverage
- Edge case identification
- Test data management
- Assertion quality
- Test organization
- Mocking strategies (if needed)

### Documentation Writer
Focus on:
- Clear endpoint descriptions
- Parameter documentation with types and constraints
- Response format examples
- Error code explanations
- Authentication requirements
- Usage examples

## Test Scenarios

Detailed in `AGENT-TESTING-PLAN.md`:
1. Code Reviewer: General code quality assessment
2. Security Code Reviewer: Security vulnerability identification
3. Testing Expert: Unit test creation and enhancement
4. Documentation Writer: API documentation creation

## Qwen Added Memories
- AuthService has 4 main methods: registerUser, authenticateUser, getUserInfo, and findUserByQuery. Each method has specific security considerations and edge cases that need to be tested.
- The existing tests/authService.test.js file has basic tests for registerUser and authenticateUser methods but lacks comprehensive coverage for all methods and edge cases.
- AuthService.registerUser(username, password) method: 1) Should successfully register a new user with valid credentials, 2) Should fail to register a user that already exists, 3) Should handle edge cases like empty username/password.
- AuthService.authenticateUser(username, password) method: 1) Should authenticate a user with correct credentials, 2) Should fail with incorrect username, 3) Should fail with incorrect password, 4) Should handle edge cases.
- AuthService.getUserInfo(username) method: 1) Should return user info for existing user, 2) Should throw error for non-existent user (security issue), 3) Should handle edge cases.
- AuthService.findUserByQuery(query) method: 1) Should find users matching query, 2) Should return empty array for no matches, 3) Should handle edge cases like empty query or special characters.
- The project is a mock authentication service with Express.js and bcrypt. It includes endpoints for user registration, login, user info retrieval, and user search. There are intentional security vulnerabilities in the implementation that should be noted in the documentation.
