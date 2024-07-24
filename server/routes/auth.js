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
      // Check user database
      const [userRows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
      if (userRows.length > 0) {
        const user = userRows[0];
        console.log('User found:', user); // Debug log
        console.log('Comparing password:', password, 'with hash:', user.password); // Debug log
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log('Authenticated user:', user); // Debug log
          return done(null, { ...user, role: 'client' });
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
          return done(null, { ...business, role: 'business' });
        }
      }

      return done(null, false, { message: 'Invalid email or password' });
    } catch (err) {
      console.error('Error during local authentication:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, cb) => {
  console.log('Serializing user:', user); // Debug log
  cb(null, { id: user.id, role: user.role });
});

// Deserialize user instance from session
passport.deserializeUser(async (obj, cb) => {
  try {
    if (obj.role === 'client') {
      const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [obj.id]);
      cb(null, rows[0]);
    } else if (obj.role === 'business') {
      const [rows] = await pool.query(`SELECT * FROM business WHERE id = ?`, [obj.id]);
      cb(null, rows[0]);
    }
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
router.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user.role === 'client') {
    res.json({ user: req.user, role: 'client' });
  } else if (req.user.role === 'business') {
    res.json({ user: req.user, role: 'business' });
  }
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



export default router;
