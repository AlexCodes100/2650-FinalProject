import express from 'express';
import pool from '../config/sqlDB.js';
import "dotenv/config.js";

const router = express.Router();

// fetch post where businessId === businessId
router.get('/:id', async (req, res) => {
  const businessId = parseInt(req.params.id, 10);
  console.log(businessId)
  console.log(typeof(businessId))
  try {
    // SQL query to fetch all business posts for a specific businessId
    const [rows] = await pool.execute(
      'SELECT * FROM businessPosts WHERE businessId = ?',
      [businessId]
    );

    console.log(rows)

    // Send the fetched posts as a response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching business posts:', error);
    res.status(500).json({ error: 'An error occurred while fetching business posts' });
  }
});
// create new post
router.post('/', async (req, res) => {
  const { businessId, content } = req.body;

  if (!businessId || !content) {
    return res.status(400).json({ error: 'Business ID and content are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO businessPosts (businessId, content) VALUES (?, ?)',
      [businessId, content]
    );

    const newPost = {
      postId: result.insertId,
      businessId,
      content,
      likesCount: 0
    };

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }
});

// update post(from business: content)
router.put('/:id', async (req, res) => {
  console.log("hi")
  console.log(req.params.id)
  console.log(req.body.content)
  console.log("hi again")
  const postId = parseInt(req.params.id, 10);
  const content = req.body.content;
  const businessId = req.body.businessId;

  try {
    const [result] = await pool.execute(
      'UPDATE businessPosts SET content = ? WHERE postId = ? AND businessId = ?',
      [content, postId, businessId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).send({result: "success"})
  } catch (err) {

  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId,10);
  const businessId = parseInt(req.body.businessId,10);
  console.log(businessId)

  if (!businessId) {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM businessPosts WHERE postId = ? AND businessId = ?',
      [postId, businessId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found or does not belong to this business' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});


export default router;