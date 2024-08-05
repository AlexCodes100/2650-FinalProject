import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginSuccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    const fetchUserInfo = async () => {
      setLoading(true);
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        localStorage.setItem('authToken', token);
        try {
          const response = await axios.get(`${apiUrl}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user } = response.data;
          localStorage.setItem('ImmivanRole', JSON.stringify({ ...user, role: 'client' }));
          await handleFollowAndCreateChat(user.id);
          navigate("/clientDashboard");
        } catch (error) {
          console.error('Error fetching user info:', error);
          setError('Failed to get user information. Please try again.');
          setLoading(false);
        }
      } else {
        setError('No token found in URL. Please try again.');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <div>
      <h2>Google Login Successful</h2>
      <p>{loading ? 'Processing...' : 'Redirecting to your dashboard.'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleLoginSuccess;
