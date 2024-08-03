import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/sqlDB.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, preferredLanguage, purpose, organization, familySize } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (firstName, lastName, email, password, preferredLanguage, purpose, organization, familySize, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, preferredLanguage, purpose, organization, familySize, 'client']
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Failed to register user', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

export default router;
