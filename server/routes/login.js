import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import pool from '../config/sqlDB.js';

const router = express.Router();

// Local strategy authentication route
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Failed to login user' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Failed to login user' });
      }
      return res.json({ message: 'User logged in successfully' });
    });
  })(req, res, next);
});

export default router;
