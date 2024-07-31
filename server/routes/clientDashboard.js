import express from 'express';
import pool from '../config/sqlDB.js';

const router = express.Router();

// Fetch followed business' posts and recommended companies
router.post('/', async (req, res) => {
  const followedbusiness = req.body.followedbusiness[0];
  // console.log(followedbusiness)
  if (req.body.action === "fetch posts") { 
    try {
      const [posts] = await pool.query(
        `SELECT p.*, b.businessName 
        FROM businessPosts p 
        LEFT JOIN business b ON p.businessId = b.id 
        WHERE p.businessId IN (?) 
        ORDER BY p.createDate DESC 
        LIMIT 50`,
        [followedbusiness]
      );
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else if (req.body.action === "fetch recommended businesses") {
    try {
      console.log("fetching recommended businesses")
      const [recommendedCompanies] = await pool.query(
        `SELECT b.id, b.businessName, b.businessType FROM business b
        WHERE id NOT IN (?) 
        ORDER BY RAND() 
        LIMIT 3`,
        [followedbusiness]
      );
      // console.log(recommendedCompanies)
    res.json(recommendedCompanies);
  } catch (error) {
    console.error('Error fetching recommended businesses',error) 
    res.status(500).json({ error: 'Failed to fetch recommended businesses' });
  }
};

// try {
  //   const query = `
  //     SELECT * FROM businesses 
  //     WHERE id NOT IN (?) 
  //     ORDER BY RAND() 
  //     LIMIT 3
  //   `;
  //   const [recommendedCompanies] = await pool.query(query, [followedCompanies]);
  //   res.json(recommendedCompanies);
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch recommended businesses' });
  // }
});
// const [posts] = await pool.query(
    //   `SELECT p.*, b.name as business_name 
    //   FROM posts p 
    //   JOIN businesses b ON p.business_id = b.id 
    //   WHERE p.business_id IN (?) 
    //   ORDER BY p.id DESC 
    //   LIMIT 50`,
    //   [followedBusinesses]
    // );
    // res.json(posts);
  // });
// Fetch followed companies' posts
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  try {
    const results = await pool.query('SELECT f.businessId, b.businessName FROM followedBusinesses f LEFT JOIN business b ON f.businessId = b.id WHERE userId = ?', [userId]);
    // console.log(results)
    if (!results[0][0].businessId) {
      console.log('No followed businesses');
      return res.json(["No followed businesses"]);
    }
    // console.log(results)
    res.json(results)
  } catch (error) {
    console.error('Error fetching followed business:', error);
    res.status(500).json({ error: 'Failed to fetch followed businesses' });
  }
});

export default router;
