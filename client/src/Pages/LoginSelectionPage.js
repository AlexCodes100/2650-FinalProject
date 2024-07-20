import React, { useState } from 'react';
import './LoginSelectionPage.css';
import Navbar from '../Components/NavBar.js'
import axios from 'axios';

const LoginSelectionPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Send the email and plain password to the server
    axios.post('http://localhost:3000/login', { email, password })
      .then(response => {
        console.log(response.data);
        // Handle successful login. Redirect to client or business dashboard.
      })
      .catch(error => {
        console.error(error);
        // Handle login error (e.g., display error message to the user)
      });
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/login/federated/google';
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder='Enter your password'
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="google-sign-in">
          <h3>Or sign in with Google</h3>
          <button onClick={handleGoogleSignIn} className="google-button">
            <img src="/photos/google-logo.png" alt="Google logo" className="google-logo" />
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginSelectionPage;
