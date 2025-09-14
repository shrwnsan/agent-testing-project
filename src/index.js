const AuthService = require('./authService');

// Simple Express app for demonstration
const express = require('express');
const app = express();

app.use(express.json());

const authService = new AuthService();

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.registerUser(username, password);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.authenticateUser(username, password);
    
    // Insecure: sending user object (which includes password hash)
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// User info endpoint
app.get('/user/:username', (req, res) => {
  try {
    const user = authService.getUserInfo(req.params.username);
    res.json(user);
  } catch (error) {
    // Insecure: revealing that user doesn't exist
    res.status(404).json({ success: false, message: error.message });
  }
});

// Search endpoint
app.get('/search', (req, res) => {
  try {
    const { query } = req.query;
    const results = authService.findUserByQuery(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = app;