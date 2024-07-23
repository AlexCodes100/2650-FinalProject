import express from 'express';
import pool from '../config/sqlDB.js';
import "dotenv/config.js";

const router = express.Router();

// fetch 3 recommended companies
async function getUnfollowedBusinesses(followedBusinesses, limit) {
  const query = `
    SELECT * FROM businesses 
    WHERE id NOT IN (${followedBusinesses.join(',')}) 
    ORDER BY RAND() 
    LIMIT ?
  `;
  return await db.query(query, [limit]);
}
router.post('/', async (req, res) => {
  const followedBusinesses = req.body.followedCompanies;
  try {
    // const user = await getUserById(userId);
    // const followedBusinesses = user.followed_businesses ? JSON.parse(user.followed_businesses) : [];
    const unfollowedBusinesses = await getUnfollowedBusinesses(followedBusinesses, 3);
    const result = {
      unfollowedBusinesses: unfollowedBusinesses,
      result: "successful"
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unfollowed businesses' });
  }
});

// fetch followed companies' posts
app.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Get the user's followed businesses
    const [user] = await pool.query('SELECT followed_businesses FROM users WHERE id = ?', [userId]);
    if (!user[0] || !user[0].followed_businesses) {
      return res.json([]);
    }

    const followedBusinesses = JSON.parse(user[0].followed_businesses);

    // Fetch posts from followed businesses
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