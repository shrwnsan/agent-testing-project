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
    });

    test('should hash the password before storing', async () => {
      const username = 'testuser';
      const password = 'password123';
      
      await authService.registerUser(username, password);
      const user = authService.users.get(username);
      
      // Verify password is hashed (bcrypt hashes start with $2b$)
      expect(user.password).toMatch(/^\$2[abxy]\$.*$/);
      // Verify password is not stored in plain text
      expect(user.password).not.toBe(password);
    });

    test('should store user with correct properties', async () => {
      const username = 'testuser';
      const password = 'password123';
      
      await authService.registerUser(username, password);
      const user = authService.users.get(username);
      
      expect(user.username).toBe(username);
      expect(user.password).toBeDefined();
      expect(user.created).toBeInstanceOf(Date);
    });

    test('should reject registration for existing user', async () => {
      const username = 'testuser';
      const password = 'password123';
      
      // Register first user
      await authService.registerUser(username, password);
      
      // Try to register the same user again
      const result = await authService.registerUser(username, 'differentpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User already exists');
    });

    test('should allow registering multiple different users', async () => {
      await authService.registerUser('user1', 'password1');
      await authService.registerUser('user2', 'password2');
      await authService.registerUser('user3', 'password3');
      
      expect(authService.users.size).toBe(3);
    });
  });

  describe('authenticateUser', () => {
    beforeEach(async () => {
      // Setup a test user for authentication tests
      await authService.registerUser('testuser', 'password123');
    });

    test('should authenticate user with correct credentials', async () => {
      const result = await authService.authenticateUser('testuser', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
    });

    test('should return user object with password hash (insecure behavior)', async () => {
      const result = await authService.authenticateUser('testuser', 'password123');
      
      expect(result.user.password).toBeDefined();
      // This is the security issue - password hash is exposed
      expect(result.user.password).toMatch(/^\$2[abxy]\$.*$/);
    });

    test('should reject authentication with incorrect password', async () => {
      const result = await authService.authenticateUser('testuser', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    test('should reject authentication for non-existent user', async () => {
      const result = await authService.authenticateUser('nonexistent', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    test('should reject authentication with empty username', async () => {
      const result = await authService.authenticateUser('', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    test('should reject authentication with empty password', async () => {
      const result = await authService.authenticateUser('testuser', '');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });
  });

  describe('getUserInfo', () => {
    beforeEach(async () => {
      // Setup a test user
      await authService.registerUser('testuser', 'password123');
    });

    test('should return user information for existing user', () => {
      const user = authService.getUserInfo('testuser');
      
      expect(user.username).toBe('testuser');
      expect(user.password).toBeDefined();
      expect(user.created).toBeInstanceOf(Date);
    });

    test('should throw error for non-existent user', () => {
      expect(() => {
        authService.getUserInfo('nonexistent');
      }).toThrow('User nonexistent not found');
    });

    test('should throw error for empty username', () => {
      expect(() => {
        authService.getUserInfo('');
      }).toThrow('User  not found');
    });
  });

  describe('findUserByQuery', () => {
    beforeEach(async () => {
      // Setup multiple test users
      await authService.registerUser('alice', 'password1');
      await authService.registerUser('bob', 'password2');
      await authService.registerUser('charlie', 'password3');
      await authService.registerUser('david', 'password4');
    });

    test('should find users by partial username match', () => {
      const results = authService.findUserByQuery('al');
      
      expect(results.length).toBe(1);
      expect(results[0].username).toBe('alice');
    });

    test('should find multiple users when query matches several', () => {
      const results = authService.findUserByQuery('a');
      
      expect(results.length).toBe(3); // alice, charlie, and david all contain 'a'
      const usernames = results.map(user => user.username);
      expect(usernames).toContain('alice');
      expect(usernames).toContain('charlie');
      expect(usernames).toContain('david');
    });

    test('should return empty array for no matches', () => {
      const results = authService.findUserByQuery('xyz');
      
      expect(results).toEqual([]);
    });

    test('should return all users for empty query', () => {
      const results = authService.findUserByQuery('');
      
      expect(results.length).toBe(4);
    });

    test('should handle special characters in query', () => {
      const results = authService.findUserByQuery('a*i'); // Pattern matching
      
      // No users should match this pattern
      expect(results).toEqual([]);
    });
  });
});