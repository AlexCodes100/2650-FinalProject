import React, { useState, useEffect } from 'react';
import './LoginSelectionPage.css';
import Navbar from '../Components/NavBar.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;


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
  }, [apiUrl, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFollowAndCreateChat = async (userId) => {
      const companyId = 1; // Business ID to follow
      console.log('Following business and creating chat:', companyId, " with clientId: ", userId); // Debug log
      try {
        // Follow the business
        await axios.post(`${apiUrl}/clientdashboard/${userId}`, { action: "follow business", businessId: companyId });
        // Check if a chat exists and create one if not
        const chatResponse = await axios.post(`${apiUrl}/chats/`, { businessId: companyId, clientId: userId });
        console.log('Received chat response:', chatResponse.data); // Debug log
        if (chatResponse.data.message === "No chatId found") {
          await axios.post(`${apiUrl}/chats/`, { action: "create new chat", businessId: companyId, clientId: userId });
        }
      } catch (error) {
        console.error('Error following business and creating chat:', error);
      }
    };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting to log in with email:', email); // Debug log
    axios.post(`${apiUrl}/auth/login`, { email, password })
      .then(async response => {
        const { token, user } = response.data;
        console.log('Received token and user:', token, user); // Debug log
        localStorage.setItem('authToken', token);
        if (user.role === 'user') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'client' }));
          await handleFollowAndCreateChat(user.id);
          navigate("/clientDashboard");
        } else if (user.role === 'business') {
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'business' }));
          navigate("/businessDashboard");
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        navigate("/errorPage");
      });
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${apiUrl}/auth/login/federated/google`;
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
