// Simple test to verify the testing environment works
const AuthService = require('../src/authService');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  test('should register a new user', async () => {
    const result = await authService.registerUser('testuser', 'password123');
    expect(result.success).toBe(true);
  });

  test('should authenticate a user with correct credentials', async () => {
    // First register a user
    await authService.registerUser('testuser', 'password123');
    
    // Then authenticate
    const result = await authService.authenticateUser('testuser', 'password123');
    expect(result.success).toBe(true);
  });
});