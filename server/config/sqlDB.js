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
      role ENUM('client', 'business', 'admin') DEFAULT 'client' NOT NULL
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

  const createFollowedBusinessesTableQuery = `
    CREATE TABLE IF NOT EXISTS followedBusinesses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      businessId INT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (businessId) REFERENCES business(id)
    );
  `;

  const createBusinessPostsTableQuery = `
    CREATE TABLE IF NOT EXISTS businessPosts (
      postId INT AUTO_INCREMENT PRIMARY KEY,
      businessId INT NOT NULL,
      businessName VARCHAR(100) NOT NULL,
      title VARCHAR(200),
      content TEXT,
      likesCount INT DEFAULT 0,
      createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (businessId) REFERENCES business(id)
    );
  `;

  const createPostCommentsTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
      commentId INT AUTO_INCREMENT PRIMARY KEY,
      postId INT,
      content TEXT,
      id INT,
      FOREIGN KEY (postId) REFERENCES businessPosts(postId),
      FOREIGN KEY (id) REFERENCES users(id)
    );
  `;

  const createLikesTableQuery = `
    CREATE TABLE IF NOT EXISTS likes (
      likeId INT AUTO_INCREMENT PRIMARY KEY,
      postId INT,
      id INT,
      FOREIGN KEY (postId) REFERENCES businessPosts(postId),
      FOREIGN KEY (id) REFERENCES users(id)
    );
  `;

  const createChatTableQuery = `
    CREATE TABLE IF NOT EXISTS chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      businessId INT NOT NULL,
      clientId INT NOT NULL,
      createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      modifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (businessId) REFERENCES business(id),
      FOREIGN KEY (clientId) REFERENCES users(id)
    );
  `;

  const createMessageTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chatId INT NOT NULL,
      senderId INT NOT NULL,
      senderRole ENUM('business', 'client') NOT NULL,
      message TEXT,
      createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chatId) REFERENCES chats(id),
      FOREIGN KEY (senderId) REFERENCES users(id)
    );
  `;

  const connection = await pool.getConnection();
  try {
    await connection.query(createUserTableQuery);
    await connection.query(createBusinessTableQuery);
    await connection.query(createFollowedBusinessesTableQuery);
    await connection.query(createBusinessPostsTableQuery);
    await connection.query(createPostCommentsTableQuery);
    await connection.query(createLikesTableQuery);
    await connection.query(createChatTableQuery);
    await connection.query(createMessageTableQuery);
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
      role: 'client'
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

  const newBusinesses = [
    {
      loginEmail: 'business1@example.com',
      loginPassword: await bcrypt.hash('password123', saltRounds),
      businessName: 'ImmiVan',
      businessType: 'Consulting',
      businessLocation: '123 Main St, Cityville',
      information: 'A leading retail business.',
      contactPerson: 'John Doe',
      telephoneNumber: '555-1234',
      email: 'contact@business1.com',
      role: 'business'
    },
    {
      loginEmail: 'business2@example.com',
      loginPassword: await bcrypt.hash('password456', saltRounds),
      businessName: 'Local goods',
      businessType: 'Retail',
      businessLocation: '456 Elm St, Townsville',
      information: 'Consulting services for small businesses.',
      contactPerson: 'Jane Smith',
      telephoneNumber: '555-5678',
      email: 'contact@business2.com',
      role: 'business'
    },
    {
      loginEmail: 'business3@example.com',
      loginPassword: await bcrypt.hash('password789', saltRounds),
      businessName: 'Amazing Food',
      businessType: 'Restaurant',
      businessLocation: '789 Oak St, Villagetown',
      information: 'Manufacturing high-quality goods.',
      contactPerson: 'Alice Johnson',
      telephoneNumber: '555-9012',
      email: 'contact@business3.com',
      role: 'business'
    },
    {
      loginEmail: 'business4@example.com',
      loginPassword: await bcrypt.hash('password101', saltRounds),
      businessName: 'Money',
      businessType: 'Accounting',
      businessLocation: '101 Pine St, Hamletville',
      information: 'Providing top-notch healthcare services.',
      contactPerson: 'Bob Brown',
      telephoneNumber: '555-3456',
      email: 'contact@business4.com',
      role: 'business'
    },
    {
      loginEmail: 'business5@example.com',
      loginPassword: await bcrypt.hash('password112', saltRounds),
      businessName: 'A+',
      businessType: 'Education',
      businessLocation: '112 Maple St, Citytown',
      information: 'Educational services for all ages.',
      contactPerson: 'Carol White',
      telephoneNumber: '555-7890',
      email: 'contact@business5.com',
      role: 'business'
    }
  ];

  const newPosts = [
    { businessId: 1, businessName: 'ImmiVan', title: 'Immigration Consultation Services', content: 'Book your immigration consultation today and take the first step towards your new life.' },
    { businessId: 2, businessName: 'Local goods', title: 'New Inventory Arrival', content: 'We\'ve just received a fresh shipment of locally sourced products. Come check out our new items!' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Weekend Special: Half-Price Appetizers', content: 'Join us this weekend for half-price appetizers with any main course order.' },
    { businessId: 4, businessName: 'Money', title: 'Tax Season Tips', content: 'Get ahead of tax season with our top 5 tips for small business owners.' },
    { businessId: 5, businessName: 'A+', title: 'Summer Learning Programs Now Open', content: 'Enroll your child in our engaging summer learning programs. Spots filling up fast!' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Visa Application Workshop', content: 'Join our free workshop on navigating the visa application process this Saturday.' },
    { businessId: 2, businessName: 'Local goods', title: 'Customer Appreciation Day', content: 'This Friday, enjoy 20% off all purchases as a thank you to our loyal customers.' },
    { businessId: 3, businessName: 'Amazing Food', title: 'New Menu Item: Vegan Delight', content: 'Try our new vegan-friendly dish, packed with flavors that will surprise your taste buds.' },
    { businessId: 4, businessName: 'Money', title: 'Free Consultation Week', content: 'Book a free 30-minute consultation with our experts this week only.' },
    { businessId: 5, businessName: 'A+', title: 'Parent-Teacher Conference Dates', content: 'Mark your calendars! Parent-teacher conferences scheduled for next month.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Understanding Work Visas', content: 'Our latest blog post breaks down different types of work visas. Check it out!' },
    { businessId: 2, businessName: 'Local goods', title: 'Eco-Friendly Product Line Launch', content: 'Introducing our new eco-friendly product line. Sustainable shopping made easy!' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Chef\'s Table Experience', content: 'Reserve your spot for an exclusive chef\'s table experience this Saturday.' },
    { businessId: 4, businessName: 'Money', title: 'Webinar: Investment Strategies for 2024', content: 'Join our free webinar on smart investment strategies for the coming year.' },
    { businessId: 5, businessName: 'A+', title: 'New After-School Program', content: 'Enrolling now for our new STEM-focused after-school program. Limited spots available!' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Immigration Policy Updates', content: 'Stay informed about recent changes in immigration policies. Read our latest update.' },
    { businessId: 2, businessName: 'Local goods', title: 'Local Artisan Spotlight', content: 'Meet the talented local artisans behind our handcrafted jewelry collection.' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Happy Hour Extended', content: 'Our popular happy hour is now extended! Enjoy discounted drinks and snacks from 4-7 PM daily.' },
    { businessId: 4, businessName: 'Money', title: 'Small Business Loan Guide', content: 'Download our comprehensive guide on securing small business loans.' },
    { businessId: 5, businessName: 'A+', title: 'College Prep Workshop', content: 'Attention high school students! Join our college prep workshop series starting next week.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Family Reunification Services', content: 'Learn about our specialized services for family reunification immigration cases.' },
    { businessId: 2, businessName: 'Local goods', title: 'Holiday Gift Guide', content: 'Find the perfect gifts for everyone on your list with our curated holiday gift guide.' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Cooking Class Announcement', content: 'Learn to cook our most popular dishes in our new monthly cooking classes.' },
    { businessId: 4, businessName: 'Money', title: 'Year-End Financial Checklist', content: 'Ensure your finances are in order with our year-end financial checklist.' },
    { businessId: 5, businessName: 'A+', title: 'Early Bird Registration Discount', content: 'Register early for next semester and receive a 10% discount on tuition.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Citizenship Test Prep Course', content: 'Prepare for your citizenship test with our comprehensive prep course. New sessions starting soon!' },
    { businessId: 2, businessName: 'Local goods', title: 'Community Clean-Up Event', content: 'Join us this Saturday for a community clean-up event. Free t-shirt for all volunteers!' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Catering Services Now Available', content: 'Let us cater your next event! Introducing our new catering menu for all occasions.' },
    { businessId: 4, businessName: 'Money', title: 'Retirement Planning Seminar', content: 'Secure your future: Join our retirement planning seminar next Thursday evening.' },
    { businessId: 5, businessName: 'A+', title: 'Student Art Exhibition', content: 'Come support our talented students at the annual art exhibition this Friday.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Success Story: From Visa to Citizenship', content: 'Read about Maria\'s journey from visa applicant to proud citizen in our latest success story.' },
    { businessId: 2, businessName: 'Local goods', title: 'Summer Sale Kickoff', content: 'Beat the heat with cool savings! Our summer sale starts tomorrow with up to 50% off.' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Live Music Fridays', content: 'Enjoy live local music every Friday night while you dine. See our lineup for this month!' },
    { businessId: 4, businessName: 'Money', title: 'New Mobile App Launch', content: 'Managing your finances just got easier with our new mobile app. Download now!' },
    { businessId: 5, businessName: 'A+', title: 'Tutoring Services Expanded', content: 'We\'ve expanded our tutoring services to cover more subjects. Book your session today!' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Immigration Law Seminar', content: 'Attorneys and paralegals, join our seminar on recent developments in immigration law.' },
    { businessId: 2, businessName: 'Local goods', title: 'Farmer\'s Market Pop-Up', content: 'This Sunday, we\'re hosting a farmer\'s market in our parking lot. Fresh produce and more!' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Customer Recipe Contest', content: 'Submit your original recipe for a chance to feature it on our menu and win a prize!' },
    { businessId: 4, businessName: 'Money', title: 'Business Credit Card Comparison', content: 'Find the right business credit card for you with our detailed comparison guide.' },
    { businessId: 5, businessName: 'A+', title: 'New Language Courses', content: 'Expand your horizons with our new language courses. Beginner to advanced levels available.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Virtual Consultations Now Available', content: 'Can\'t come to our office? Book a virtual consultation for the same expert advice.' },
    { businessId: 2, businessName: 'Local goods', title: 'Sustainable Packaging Initiative', content: 'We\'re going green! Learn about our new sustainable packaging initiative.' },
    { businessId: 3, businessName: 'Amazing Food', title: 'Monday Kids Eat Free', content: 'Every Monday, kids eat free with the purchase of an adult entree. Family dinner made easy!' },
    { businessId: 4, businessName: 'Money', title: 'Quarterly Market Update', content: 'Stay informed with our quarterly market update. What\'s trending in the financial world?' },
    { businessId: 5, businessName: 'A+', title: 'Science Fair Winners Announced', content: 'Congratulations to our science fair winners! Check out the innovative projects.' },
    { businessId: 1, businessName: 'ImmiVan', title: 'Document Checklist for Visa Applications', content: 'Ensure you have all necessary documents for your visa application with our comprehensive checklist.' },
  ];

  const connection = await pool.getConnection();
  try {
    for (const account of testAccounts) {
      const { table } = account;

      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table} WHERE ${table === 'business' ? 'loginEmail' : 'email'} = ?`, [account.email]);
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

    // Insert new business accounts
    for (const business of newBusinesses) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM business WHERE loginEmail = ?`, [business.loginEmail]);
      if (rows[0].count === 0) {
        const { loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role } = business;
        await connection.query(
          `INSERT INTO business (loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [loginEmail, loginPassword, businessName, businessType, businessLocation, information, contactPerson, telephoneNumber, email, role]
        );
        console.log(`New business account created: ${business.loginEmail}`);
      } else {
        console.log(`Business account already exists: ${business.loginEmail}`);
      }
    }

    // Insert new posts
    for (const post of newPosts) {
      const { businessId, businessName, title, content } = post;
      await connection.query(
        `INSERT INTO businessPosts (businessId, businessName, title, content) VALUES (?, ?, ?, ?)`,
        [businessId, businessName, title, content]
      );
    }

    // Insert initial followed business and chat entries
    await connection.query(
      `INSERT INTO followedBusinesses (userId, businessId) VALUES (?, ?)`,
      [1, 1]
    );
    await connection.query(
      `INSERT INTO chats (businessId, clientId) VALUES (?, ?)`,
      [1, 1]
    );
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
