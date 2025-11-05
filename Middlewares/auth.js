const jwt = require('jsonwebtoken');
const connection = require('../config/database');

const verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user in database
        const sql = 'SELECT user_id, username, email, role FROM users WHERE user_id = ?';
        connection.execute(sql, [decoded.user_id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Attach user to request
            req.user = results[0];
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

module.exports = { verifyToken };

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure JWT_SECRET is in your .env
    const userId = decoded.user_id;

    // fetch user from DB
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = results[0]; // set req.user for later use
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;