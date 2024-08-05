import React, { useState, useEffect } from 'react';
import './LoginSelectionPage.css';
import Navbar from '../Components/NavBar.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = "http://3.85.135.37:3000";

  const handleFollowAndCreateChat = async (userId) => {
    const companyId = 1; // Business ID to follow
    try {
      // Follow the business
      await axios.post(`${apiUrl}/clientdashboard/${userId}`, { action: "follow business", businessId: companyId });

      // Check if a chat exists and create one if not
      const chatResponse = await axios.post(`${apiUrl}/chats/`, { businessId: companyId, clientId: userId });
      if (chatResponse.data.message === "No chatId found") {
        await axios.post(`${apiUrl}/chats/`, { action: "create new chat", businessId: companyId, clientId: userId });
      }
    } catch (error) {
      console.error('Error following business and creating chat:', error);
    }
  };


  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    console.log('Extracted token from URL:', token); // Debug log
    if (token) {
      localStorage.setItem('authToken', token);
      axios.get(`${apiUrl}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(async response => {
        console.log('Received user info from /auth/user:', response.data); // Debug log
        const { user } = response.data;
        if (user.role === 'client') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'client' }));
          await handleFollowAndCreateChat(user.id);
          navigate("/clientDashboard");
        } else if (user.role === 'business') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'business' }));
          navigate("/businessDashboard");
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        navigate("/errorPage");
      });
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting to log in with email:', email); // Debug log
  
    axios.post(`${apiUrl}/auth/login`, { email, password })
      .then(response => {
        console.log('Received response from login API:', response); // Debug log
  
        if (!response.data) {
          throw new Error('No data received from login API');
        }
  
        const { token, user } = response.data;
        
        if (!token) {
          throw new Error('Token not received');
        }
  
        if (!user) {
          throw new Error('User data not received');
        }
  
        localStorage.setItem('authToken', token);
  
        if (user.role === 'client') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'client' }));
          navigate("/clientDashboard");
        } else if (user.role === 'business') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'business' }));
          navigate("/businessDashboard");
        } else {
          throw new Error('Unknown user role');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        navigate("/errorPage");
      });
  };
  

  const handleGoogleSignIn = () => {
    window.location.href = `http://immivan.com:3000/auth/login/federated/google`;
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
