import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from '../config/sqlDB.js';
import crypto from 'crypto';

const router = express.Router();

// Configure the Google strategy for use by Passport.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/oauth2/redirect/google',
  scope: ['profile', 'email']
}, async (issuer, profile, cb) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [profile.emails[0].value]);
    let user;
    if (rows.length === 0) {
      const placeholderPassword = crypto.randomBytes(16).toString('hex'); // Generate a random placeholder password
      const hashedPassword = await bcrypt.hash(placeholderPassword, 10); // Hash the placeholder password
      const [result] = await pool.query(`INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`, 
        [profile.name.givenName, profile.name.familyName, profile.emails[0].value, hashedPassword]);
      user = { id: result.insertId, firstName: profile.name.givenName, lastName: profile.name.familyName, email: profile.emails[0].value };
    } else {
      user = rows[0];
    }
    console.log('Authenticated user:', user); // Debug log
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  
        if (rows.length === 0) {
          return done(null, false, { message: 'Invalid email or password' });
        }
  
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
  
        if (!match) {
          return done(null, false, { message: 'Invalid email or password' });
        }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

passport.serializeUser((user, cb) => {
  console.log('Serializing user:', user); // Debug log
  cb(null, user.id); // Ensure the ID is correctly passed
});

// Deserialize user instance from session
passport.deserializeUser(async (id, cb) => {
  console.log('Deserializing user ID:', id); // Debug log
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    const user = rows[0];
    console.log('Found user in SQL DB:', user); // Debug log
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Route to initiate Google login
router.get('/login/federated/google', passport.authenticate('google'));

// Callback route to handle Google login response
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}));

// Route to handle local login
router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  }));

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



export default router;
