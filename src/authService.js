const bcrypt = require('bcrypt');

class AuthService {
  constructor() {
    this.users = new Map();
    this.SALT_ROUNDS = 10;
  }

  // Register a new user
  async registerUser(username, password) {
    // Check if user already exists
    if (this.users.has(username)) {
      return { success: false, message: 'User already exists' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    
    // Store user (insecure: storing in memory)
    this.users.set(username, {
      username: username,
      password: hashedPassword,
      created: new Date()
    });

    return { success: true, message: 'User registered successfully' };
  }

  // Authenticate a user
  async authenticateUser(username, password) {
    // Get user from storage
    const user = this.users.get(username);
    
    if (!user) {
      // Security issue: revealing that user doesn't exist
      return { success: false, message: 'Invalid username or password' };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Insecure: returning the user object with password hash
    return { success: true, user: user };
  }

  // Insecure function that reveals too much information
  getUserInfo(username) {
    const user = this.users.get(username);
    if (!user) {
      // Security issue: revealing that user doesn't exist
      throw new Error(`User ${username} not found`);
    }
    return user;
  }

  // Function with potential injection vulnerability
  findUserByQuery(query) {
    // This is a mock implementation, but in a real DB this could be vulnerable
    // Insecure: no input validation
    const results = [];
    for (const [username, user] of this.users.entries()) {
      if (username.includes(query) || user.username.includes(query)) {
        results.push(user);
      }
    }
    return results;
  }
}

module.exports = AuthService;