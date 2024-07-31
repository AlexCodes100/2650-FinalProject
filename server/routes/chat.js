import express from "express";
import pool from "../config/sqlDB.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import { parse } from "path";

const router = express.Router();

// fetch Chats by userId
async function fetchChats(id, role) {
  let result;
  try {
    if (role === "business") {
      result = await pool.query(`SELECT c.*, m.id as messageId, m.message, u.firstName, u.lastName 
        FROM chats c 
        LEFT JOIN (SELECT chatId, MAX(createDate) AS latestMessage 
        FROM messages GROUP BY chatId) lastest ON c.id = lastest.chatId 
        LEFT JOIN messages m 
        ON c.id = m.chatId AND m.createDate = lastest.latestMessage 
        LEFT JOIN users u 
        ON c.clientId = u.id 
        WHERE c.businessId = ?`, [id]);
  } else if (role === "client") {
    result = await pool.query(`SELECT c.*, m.id as messageId, m.message, b.businessName 
      FROM chats c 
      LEFT JOIN (SELECT chatId, MAX(createDate) AS latestMessage 
      FROM messages 
      GROUP BY chatId) lastest 
      ON c.id = lastest.chatId 
      LEFT JOIN messages m 
      ON c.id = m.chatId AND m.createDate = lastest.latestMessage LEFT JOIN business b ON c.businessId = b.id 
      WHERE c.clientId = ?`, [id]);
  }  
    // console.log(result);
  } catch (err) {
    console.log(`No Message found ${err}`);
  }
  if (result.length === 0) {
    console.log("No chats found for this user");
    return null;
  }
  const rows = result[0];
  // console.log(rows)
  return rows;
}
 // fetch chats for a specific client
router.post("/:id", async (req, res) => {
  console.log("fetching chats");
  const id = parseInt(req.params.id, 10);
  const role = req.body.role;
  // console.log(id, role);
  let chats = await fetchChats(id, role);
  if (chats.length === 0) {
    console.log("No chats found for this userrrr");
    res.status(200).send("No chats found for this user");
  }
  res.status(200).send(chats);
});

async function getChatMessages(chatroomId) {
  const query = `
    SELECT m.*
    FROM messages m
    WHERE m.chatId = ?
    ORDER BY m.createDate ASC
  `;
  
  try {
    const [rows] = await pool.query(query, [chatroomId]);
    return rows;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
}
router.get("/:chatId", async (req, res) => {
  const chatId = parseInt(req.params.chatId, 10);
  const chat = await getChatMessages(chatId);
  // console.log(chat);
  if (!chat) {
    console.log("No chat found for this chatId");
    // res.status(200).send("No chats found for this user");
  }
  res.status(200).send(chat);
});

async function fetchChatId(businessId, clientId) {
  const query = `
    SELECT * 
    FROM chats
    WHERE businessId = ? AND clientId = ?
  `;
  
  try {
    const result = await pool.query(query, [businessId, clientId]);
    // console.log(result[0]);
    return result[0];
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}
router.post("/", async (req, res) => {
  const { businessId, clientId } = req.body;
  const chatId = await fetchChatId(businessId, clientId);
  // console.log(chatId);
  res.status(200).send(chatId);
});

export default router;