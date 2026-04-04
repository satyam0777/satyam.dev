const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Generate secure token (32 bytes = 256 bits, hex encoded)
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Store valid tokens in memory (in production, use Redis or database)
let validTokens = new Set();
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Export validTokens for use in other routes
const getValidTokens = () => validTokens;
const addToken = (token) => validTokens.add(token);
const removeToken = (token) => validTokens.delete(token);
const hasToken = (token) => validTokens.has(token);

// Clean expired tokens periodically
setInterval(() => {
  validTokens.forEach(token => {
    // In production, track token creation time and remove expired ones
    // For now, tokens don't expire in memory, but should be stored with timestamps
  });
}, 60 * 60 * 1000); // Every hour

// Verify admin PIN
router.post('/verify', (req, res) => {
  const { pin } = req.body;
  
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN required and must be a string' });
  }

  if (pin.length < 4) {
    return res.status(400).json({ error: 'PIN too short' });
  }

  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin || adminPin.length === 0) {
    return res.status(500).json({ error: 'Admin PIN not configured' });
  }

  if (pin === adminPin) {
    const token = generateToken();
    addToken(token);
    res.json({ 
      success: true, 
      token, 
      message: 'Admin verified',
      expiresIn: TOKEN_EXPIRY
    });
  } else {
    res.status(401).json({ error: 'Invalid PIN', success: false });
  }
});

// Validate token (optional endpoint for frontend to check token status)
router.post('/validate-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }

  if (hasToken(token)) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false, error: 'Token invalid or expired' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    removeToken(token);
  }
  
  res.json({ message: 'Logged out' });
});

module.exports = router;
module.exports.getValidTokens = getValidTokens;
module.exports.hasToken = hasToken;
module.exports.addToken = addToken;
module.exports.removeToken = removeToken;
