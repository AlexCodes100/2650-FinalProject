import express from 'express';
import mysql from "mysql2/promise";
// import pool from '../config/sqlDB';
import "dotenv/config.js";

const router = express.Router();



// fetch business data
async function businessLogin () {
  try {
    // const connection = await mysql.createConnection({
    //   host: process.env.SQL_HOST,
    //   user: process.env.SQL_USER,
    //   password: process.env.SQL_PASSWORD,
    //   database: process.env.SQL_DATABASE, // business?
    //   waitForConnections: true,
    //   connectionLimit: 10,
    //   queueLimit: 0
    // });
    // const [rows, fields] = await connection.execute(`SELECT id, name, business, location, information, contactPerson, telephoneNumber, email FROM business WHERE id = ?`, [userId]);
    // await connection.end();
    // return rows;
    const connection = await pool.getConnection();
    try {
      const [rows, fields] = await connection.execute(`SELECT * FROM business`);
      return rows;
    } catch (err) {
      console.log(`Error: connecting to mysql ${err}`)
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(`Error: connecting to mysql ${err}`)
  }
}

//Business database:
  // id, loginEmail, password, name, businessType (business), businessLocation (location), inofrmation, contactPerson, telephoneNumber, email
router.post('/', async (req,res) => {
  let businesses = [];
  businesses = await businessLogin();
  let matchedBusiness = businesses.find((business) => business.loginEmail === req.body.email);
  if (matchedBusiness.password === req.body.password) {
    const response = {
      role: "business",
      id: matchedBusiness.id,
      name: matchedBusiness.name,
      business: matchedBusiness.business,
      location: matchedBusiness.location,
      information: matchedBusiness.information,
      contactPerson: matchedBusiness.contactPerson,
      telephoneNumber: matchedBusiness.telephoneNumber,
      email: matchedBusiness.email,
      result: "Login Successful"
    }
    res.status(200).send(response);
  }
})

// update business data

async function updateUserById(userId, updateFields) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (key !== 'email' && key !== 'password') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  // const connection = await pool.getConnection();

  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

router.put('/:id', async (req,res) => {
  const userId = req.params.id;
  const updateFields = req.body;

  try {
    const results = await updateUserById(userId, updateFields);
    res.status(200).json({ 
      result: "successful",
      message: 'User updated successfully',
      results
    });
  } catch (err) {
    console.log(`Error occur during updating mySQL DB: ${err};
    `);
    res.status(500).json({ 
      result:"failed",
      message: 'Error updating user',
      err
    });
  }
})


// fetch chat
// check if chat db table businessid == params.id

export default router;