import mysql from 'mysql2/promise';
import "dotenv/config.js";

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeTables() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) DEFAULT NULL,
      preferredLanguage VARCHAR(20),
      purpose TEXT,
      organization VARCHAR(100),
      familySize INT
    );
  `;

  const connection = await pool.getConnection();
  try {
    await connection.query(createTableQuery);
    console.log('SQL tables initialized');
  } finally {
    connection.release();
  }
}

initializeTables();

export { initializeTables };

export default pool;
