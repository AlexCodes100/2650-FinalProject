import express from "express";
import pool from "../config/sqlDB.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";

const router = express.Router();

// fetch Chats by userId
async function fetchChats(id, role) {
  let result;
  if (role === "business") {
    result = await pool.query("SELECT * FROM chats WHERE businessId = ?", [id]);
  } else if (role === "client") {
    result = await pool.query("SELECT * FROM chats WHERE clientId = ?", [id]);
  }
  
  const rows = result.rows;
  
  if (rows.length === 0) {
    return null;
  }
  return rows;
}
 // fetch chats for a specific client
router.post("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const role = req.body.role;
  const chats = await fetchChats(id, role);
  if (!chats) {
    console.log("No chats found for this user");
  }
  res.status(200).send(chats);
});

// fetch Chat by chatId
async function fetchChat(chatId) {
  const [rows] = await pool.query("SELECT * FROM chats WHERE id = ?", [chatId]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}
router.get("/:chatId", async (req, res) => {
  const chatId = parseInt(req.params.chatId, 10);
  const chat = await fetchChat(chatId);
  if (!chat) {
    console.log("No chat found for this chatId");
  }
  res.status(200).send(chat);
});

export default router;