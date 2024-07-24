import React, { useState } from 'react';
import './LoginSelectionPage.css';
import Navbar from '../Components/NavBar.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Send the email and plain password to the server
    axios.post('http://localhost:3000/auth/login', { email, password })
      .then(response => {
        console.log(response.data);
        if (response.data.role === 'client') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...response.data.user, role: 'client' }));
          navigate("/clientDashboard");
        } else if (response.data.role === 'business') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...response.data.user, role: 'business' }));
          navigate("/businessDashboard");
        }
      })
      .catch(error => {
        console.error(error);
        navigate("/errorPage");
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
