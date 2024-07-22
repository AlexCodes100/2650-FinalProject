import express from 'express';
import pool from '../config/sqlDB.js';
import "dotenv/config.js";

const router = express.Router();



// fetch business data
async function businessLogin () {
  try {
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
  console.log(req.body)
  let businesses = [];
  businesses = await businessLogin();
  
  let matchedBusiness = businesses.find((business) => business.loginEmail === req.body.email);
  console.log(matchedBusiness)
  console.log(matchedBusiness.loginPassword)
  console.log(req.body.password)
  if (matchedBusiness.loginPassword === req.body.password) {
    const result = {
      role: "business",
      id: matchedBusiness.id,
      businessName: matchedBusiness.businessName,
      businessType: matchedBusiness.businessType,
      businessLocation: matchedBusiness.businessLocation,
      information: matchedBusiness.information,
      contactPerson: matchedBusiness.contactPerson,
      telephoneNumber: matchedBusiness.telephoneNumber,
      email: matchedBusiness.email,
      result: "Login Successful"
    }
    console.log(result)
    res.status(200).send(result);
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