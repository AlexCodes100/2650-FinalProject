import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from '../config/sqlDB.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import axios from 'axios';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/login/federated/google', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: 'http://localhost:3000/auth/oauth2/redirect/google',
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
    state: JSON.stringify({
      callbackUrl: '/',
    }),
  };
  console.log('Redirecting to Google OAuth with options:', options); // Debug log
  res.redirect(`${rootUrl}?${querystring.stringify(options)}`);
});

router.get('/oauth2/redirect/google', async (req, res) => {
  const code = req.query.code;
  console.log('Received code from Google:', code); // Debug log

  const googleTokenUrl = 'https://oauth2.googleapis.com/token';
  const options = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/auth/oauth2/redirect/google',
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post(googleTokenUrl, querystring.stringify(options), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token, access_token } = response.data;
    console.log('Received tokens from Google:', { id_token, access_token }); // Debug log
    const googleUser = jwt.decode(id_token);
    console.log('Decoded Google user:', googleUser); // Debug log

    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [googleUser.email]);
    let user;
    if (rows.length === 0) {
      console.log('User not found, creating new user:', googleUser); // Debug log
      const placeholderPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
      const [result] = await pool.query(`INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`, 
        [googleUser.given_name, googleUser.family_name, googleUser.email, hashedPassword]);
      user = { id: result.insertId, firstName: googleUser.given_name, lastName: googleUser.family_name, email: googleUser.email };
    } else {
      user = rows[0];
    }
    console.log('Authenticated user:', user);
    const token = generateToken({ id: user.id, role: 'client' });
    console.log('Generated JWT:', token);
    res.redirect(`http://localhost:4000/googleLoginSuccess?token=${token}`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.redirect('/errorPage');
  }
});

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      // Check user database
      const [userRows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
      if (userRows.length > 0) {
        const user = userRows[0];
        console.log('User found:', user); // Debug log
        console.log('Comparing password:', password, 'with hash:', user.password); // Debug log
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log('Authenticated user:', user); // Debug log
          const token = generateToken({ id: user.id, role: 'client' });
          return done(null, { user, token });
        }
      }

      // Check business database
      const [businessRows] = await pool.query(`SELECT * FROM business WHERE loginEmail = ?`, [email]);
      if (businessRows.length > 0) {
        const business = businessRows[0];
        console.log('Business found:', business); // Debug log
        console.log('Comparing password:', password, 'with hash:', business.loginPassword); // Debug log
        const match = await bcrypt.compare(password, business.loginPassword);
        if (match) {
          console.log('Authenticated business:', business); // Debug log
          const token = generateToken({ id: business.id, role: 'business' });
          return done(null, { user: business, token });
        }
      }

      return done(null, false, { message: 'Invalid email or password' });
    } catch (err) {
      console.error('Error during local authentication:', err);
      return done(err);
    }
  }
));


// Route to handle local login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { user, token } = req.user;
  res.json({ user, token });
});


// Route to get authenticated user data
router.get('/user', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Route to log out the user
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



export default router;
