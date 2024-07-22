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
  const createBusinessTableQuery = `
  CREATE TABLE IF NOT EXISTS business (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loginEmail VARCHAR(100) UNIQUE NOT NULL,
    loginPassword VARCHAR(100) NOT NULL,
    businessName VARCHAR(100) NOT NULL,
    businessType VARCHAR(50),
    businessLocation VARCHAR(100),
    information TEXT,
    contactPerson VARCHAR(100),
    telephoneNumber VARCHAR(20),
    email VARCHAR(100) UNIQUE
);
  `;

  const createBusinessPostsTableQuery = `
  CREATE TABLE IF NOT EXISTS businessPosts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    businessId INT,
    content TEXT,
    likesCount INT DEFAULT 0,
    FOREIGN KEY (businessId) REFERENCES business(id)
);`;

  const createPostCommentsTableQuery = `
  CREATE TABLE IF NOT EXISTS comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,
    content TEXT,
    id INT
    FOREIGN KEY (postId) REFERENCES businessPosts(postId),
    FOREIGN KEY (id) REFERENCES users(id)
  );`;

  const createLikesTableQuery = `
  CREATE TABLE IF NOT EXISTS likes (
    likeId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,
    id INT,
    FOREIGN KEY (postId) REFERENCES businessPosts(postId),
    FOREIGN KEY (id) REFERENCES users(id)
  );`
  

  const connection = await pool.getConnection();
  try {
    await connection.query(createTableQuery);
    await connection.query(createBusinessTableQuery);
    console.log('SQL tables initialized');
  } finally {
    connection.release();
  }
}

initializeTables();

export { initializeTables };

export default pool;
