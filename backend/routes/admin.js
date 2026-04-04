const express = require('express');
const router = express.Router();

// Verify admin PIN
router.post('/verify', (req, res) => {
  const { pin } = req.body;
  const adminPin = process.env.ADMIN_PIN || 'satyam2025';

  if (!pin) {
    return res.status(400).json({ error: 'PIN required' });
  }

  if (pin === adminPin) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`admin-${Date.now()}`).toString('base64');
    res.json({ success: true, token, message: 'Admin verified' });
  } else {
    res.status(401).json({ error: 'Invalid PIN', success: false });
  }
});

module.exports = router;
