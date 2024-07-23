import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import "dotenv/config.js";

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.SQL_DATABASE}\`;`);
  await connection.end();
}

async function initializeTables(pool) {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      preferredLanguage VARCHAR(20),
      purpose TEXT,
      organization VARCHAR(100),
      familySize INT,
      role ENUM('user', 'business', 'admin') DEFAULT 'user' NOT NULL
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
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'business', 'admin') DEFAULT 'business' NOT NULL
);
  `;

  const createBusinessPostsTableQuery = `
  CREATE TABLE IF NOT EXISTS businessPosts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    businessId INT NOT NULL,
    title VarChar(200),
    content TEXT,
    likesCount INT DEFAULT 0,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    await connection.query(createUserTableQuery);
    await connection.query(createBusinessTableQuery);
    await connection.query(createBusinessPostsTableQuery);
    await connection.query(createPostCommentsTableQuery);
    await connection.query(createLikesTableQuery);
    console.log('SQL tables initialized');
  } finally {
    connection.release();
  }
}

async function createTestAccounts(pool) {
  const saltRounds = 10;
  const plainPassword = '12345';
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const testAccounts = [
    {
      table: 'users',
      firstName: 'Client',
      lastName: 'User',
      email: 'client@example.com',
      password: hashedPassword,
      role: 'user'
    },
    {
      table: 'users',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    },
    {
      table: 'business',
      loginEmail: 'business@example.com',
      loginPassword: hashedPassword,
      businessName: 'Business Name',
      businessType: 'Business Type',
      businessLocation: 'Business Location',
      information: 'Information',
      contactPerson: 'Contact Person',
      telephoneNumber: '1234567890',
      email: 'business@example.com',
      role: 'business'
    }
  ];

  const connection = await pool.getConnection();
  try {
    for (const account of testAccounts) {
      const { table } = account;

      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table} WHERE email = ?`, [account.email]);
      if (rows[0].count === 0) {
        if (table === 'users') {
          const { firstName, lastName, email, password, role } = account;
          await connection.query(
            `INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`,
            [firstName, lastName, email, password, role]
          );
        } else if (table === 'business') {
          const { loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role } = account;
          await connection.query(
            `INSERT INTO business (loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role]
          );
        }
        console.log(`Test account created: ${account.email}`);
      } else {
        console.log(`Test account already exists: ${account.email}`);
      }
    }
  } finally {
    connection.release();
  }
}

async function initializeDatabase() {
  await createDatabaseIfNotExists();
  
  const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  await initializeTables(pool);
  await createTestAccounts(pool);

  return pool;
}

const pool = await initializeDatabase();

// Export the pool for use in other parts of your application
export { initializeDatabase };
export default pool;
