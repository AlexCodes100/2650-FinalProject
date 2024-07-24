import express from 'express';
import pool from '../config/sqlDB.js';

const router = express.Router();

// Fetch recommended companies
router.post('/', async (req, res) => {
  const followedCompanies = req.body.followedCompanies;
  try {
    const query = `
      SELECT * FROM businesses 
      WHERE id NOT IN (?) 
      ORDER BY RAND() 
      LIMIT 3
    `;
    const [recommendedCompanies] = await pool.query(query, [followedCompanies]);
    res.json(recommendedCompanies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommended businesses' });
  }
});

// Fetch followed companies' posts
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [user] = await pool.query('SELECT followed_businesses FROM users WHERE id = ?', [userId]);
    if (!user[0] || !user[0].followed_businesses) {
      return res.json([]);
    }

    const followedBusinesses = JSON.parse(user[0].followed_businesses);

    const [posts] = await pool.query(
      `SELECT p.*, b.name as business_name 
      FROM posts p 
      JOIN businesses b ON p.business_id = b.id 
      WHERE p.business_id IN (?) 
      ORDER BY p.id DESC 
      LIMIT 50`,
      [followedBusinesses]
    );

    res.json(posts);
  } catch (error) {
    console.error('Error fetching followed posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts from followed businesses' });
  }
});

export default router;
