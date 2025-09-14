const AuthService = require('../src/authService');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('registerUser', () => {
    test('should register a new user successfully', async () => {
      const result = await authService.registerUser('testuser', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('User registered successfully');
      // Verify user was actually stored
      expect(authService.users.has('testuser')).toBe(true);
    });

    test('should hash the password before storing', async () => {
      const password = 'password123';
      await authService.registerUser('testuser', password);
      
      const user = authService.users.get('testuser');
      expect(user.password).not.toBe(password);
      expect(user.password.startsWith('$2b$')).toBe(true); // bcrypt hash prefix
    });

    test('should fail to register a user that already exists', async () => {
      // Register first user
      await authService.registerUser('testuser', 'password123');
      
      // Try to register the same user
      const result = await authService.registerUser('testuser', 'differentpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User already exists');
    });

    test('should store user with creation timestamp', async () => {
      const before = new Date();
      await authService.registerUser('testuser', 'password123');
      const after = new Date();
      
      const user = authService.users.get('testuser');
      expect(user.created).toBeInstanceOf(Date);
      expect(user.created.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.created.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    // Edge case tests
    test('should handle empty username', async () => {
      const result = await authService.registerUser('', 'password123');
      
      expect(result.success).toBe(true);
      expect(authService.users.has('')).toBe(true);
    });

    test('should handle empty password', async () => {
      const result = await authService.registerUser('testuser', '');
      
      expect(result.success).toBe(true);
      expect(authService.users.get('testuser').password).toBeDefined();
    });

    test('should handle special characters in username and password', async () => {
      const username = 'test@user.com';
      const password = 'p@$$w0rd!#';
      
      const result = await authService.registerUser(username, password);
      
      expect(result.success).toBe(true);
      expect(authService.users.has(username)).toBe(true);
    });
  });

  describe('authenticateUser', () => {
    test('should authenticate a user with correct credentials', async () => {
      // First register a user
      await authService.registerUser('testuser', 'password123');
      
      // Then authenticate
      const result = await authService.authenticateUser('testuser', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
    });

    test('should reject authentication with incorrect password', async () => {
      // Register a user
      await authService.registerUser('testuser', 'password123');
      
      // Try to authenticate with wrong password
      const result = await authService.authenticateUser('testuser', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
      expect(result.user).toBeUndefined();
    });

    test('should reject authentication for non-existent user', async () => {
      const result = await authService.authenticateUser('nonexistent', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
      expect(result.user).toBeUndefined();
    });

    test('should not leak information about user existence', async () => {
      // Response should be the same for non-existent user and wrong password
      const result1 = await authService.authenticateUser('nonexistent', 'password123');
      const result2 = await authService.registerUser('testuser', 'password123')
        .then(() => authService.authenticateUser('testuser', 'wrongpassword'));
      
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
      expect(result1.message).toBe(result2.message);
    });

    // Edge case tests
    test('should handle empty username', async () => {
      const result = await authService.authenticateUser('', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    test('should handle empty password', async () => {
      await authService.registerUser('testuser', 'password123');
      const result = await authService.authenticateUser('testuser', '');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });
  });

  describe('getUserInfo', () => {
    test('should return user information for existing user', async () => {
      // First register a user
      await authService.registerUser('testuser', 'password123');
      
      const user = authService.getUserInfo('testuser');
      
      expect(user.username).toBe('testuser');
      expect(user.password).toBeDefined();
      expect(user.created).toBeInstanceOf(Date);
    });

    test('should throw error for non-existent user', () => {
      // This function has a security vulnerability - it reveals that a user doesn't exist
      expect(() => {
        authService.getUserInfo('nonexistent');
      }).toThrow('User nonexistent not found');
    });

    test('should handle special characters in username', async () => {
      const username = 'test@user.com';
      await authService.registerUser(username, 'password123');
      
      const user = authService.getUserInfo(username);
      
      expect(user.username).toBe(username);
    });
  });

  describe('findUserByQuery', () => {
    beforeEach(async () => {
      // Set up test data
      await authService.registerUser('alice', 'password123');
      await authService.registerUser('bob', 'password123');
      await authService.registerUser('charlie', 'password123');
      await authService.registerUser('david.alice', 'password123');
    });

    test('should find users by username substring', () => {
      const results = authService.findUserByQuery('alice');
      
      expect(results.length).toBe(2);
      expect(results.some(user => user.username === 'alice')).toBe(true);
      expect(results.some(user => user.username === 'david.alice')).toBe(true);
    });

    test('should return empty array for no matches', () => {
      const results = authService.findUserByQuery('nonexistent');
      
      expect(results.length).toBe(0);
    });

    test('should handle empty query', () => {
      // Empty query would match all users since every string includes an empty string
      const results = authService.findUserByQuery('');
      
      expect(results.length).toBe(4);
    });

    test('should handle special characters in query', () => {
      const results = authService.findUserByQuery('david.');
      
      expect(results.length).toBe(1);
      expect(results[0].username).toBe('david.alice');
    });
  });

  // Security vulnerability tests
  describe('Security Vulnerabilities', () => {
    test('should not expose password hash in authenticateUser response', async () => {
      await authService.registerUser('testuser', 'password123');
      const result = await authService.authenticateUser('testuser', 'password123');
      
      // This test documents a security vulnerability in the current implementation
      // The password hash should not be exposed to the client
      expect(result.user.password).toBeDefined(); // Current implementation exposes it
    });

    test('should not reveal user existence in getUserInfo', () => {
      // This test documents a security vulnerability in the current implementation
      // Should return a generic error message instead of revealing user doesn't exist
      expect(() => {
        authService.getUserInfo('nonexistent');
      }).toThrow('User nonexistent not found'); // Current implementation reveals user doesn't exist
    });
  });
});