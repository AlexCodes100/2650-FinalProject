import express from 'express';
import pool from '../config/sqlDB.js';
import "dotenv/config.js";
import bcrypt from 'bcrypt';

const router = express.Router();



// fetch business data
async function businessLogin(email, password) {
  const [rows] = await pool.query(`SELECT * FROM business WHERE loginEmail = ?`, [email]);
  if (rows.length === 0) {
    return null;
  }
  const business = rows[0];
  const match = await bcrypt.compare(password, business.password);
  if (!match) {
    return null;
  }
  return business;
}

//Business database:
  // id, loginEmail, password, name, businessType (business), businessLocation (location), inofrmation, contactPerson, telephoneNumber, email

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const business = await businessLogin(email, password);
  if (business) {
    const result = {
      role: "business",
      id: business.id,
      businessName: business.businessName,
      businessType: business.businessType,
      businessLocation: business.businessLocation,
      information: business.information,
      contactPerson: business.contactPerson,
      telephoneNumber: business.telephoneNumber,
      email: business.email,
      result: "Login Successful"
    };
    res.status(200).send(result);
  } else {
    res.status(401).send({ result: "Invalid email or password" });
  }
});

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

  values.push(parseInt(userId, 10));

  const query = `
    UPDATE business
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    console.log('Before pool.query');
    pool.query(query, values)
      .then(results => {
        console.log('Query executed successfully');
        console.log('Raw MySQL results:', results);
        resolve(results);
      })
      .catch(error => {
        console.error('Database error:', error);
        reject(error);
      })
      .finally(() => {
        console.log('Query operation completed');
      });
    console.log('After pool.query');
  });
}

router.put('/:id', async (req,res) => {
  const userId = req.params.id;
  const updateFields = req.body.updatedInfo;
  console.log('Received update request for user ID:', userId);
  console.log('Update fields:', updateFields);

  try {
    const mysqlResults = await updateUserById(userId, updateFields);
    console.log('MySQL results:', mysqlResults);

    if (mysqlResults[0].affectedRows > 0 || mysqlResults[0].changedRows === 0) {
      res.status(200).json([{
        result: "successful",
        message: 'User updated successfully',
        affectedRows: mysqlResults.affectedRows,
        changedRows: mysqlResults.changedRows
      }]);
    } else {
      res.status(404).json([{
        result: "failed",
        message: 'No user found with the given ID',
        affectedRows: 0
      }]);
    }
  } catch (err) {
    console.log(`Error occur during updating mySQL DB: ${err};
    `);
    res.status(500).send({ 
      result:"failed",
      message: 'Error updating user',
      error: err.message
    });
  }
})


// fetch chat
// check if chat db table businessid == params.id

export default router;