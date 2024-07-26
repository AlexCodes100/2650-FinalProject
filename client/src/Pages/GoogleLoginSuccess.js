import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginSuccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/auth/user', { withCredentials: true });
        localStorage.setItem('ImmivanRole', JSON.stringify({ ...response.data.user, role: 'client' }));
        navigate("/clientDashboard");
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to get user information. Please try again.');
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
