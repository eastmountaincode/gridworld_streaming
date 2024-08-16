import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';

import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Context
  const { showNotification } = useNotification();
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // store the token and the userData in AuthContext
        login(data.token, data.userData);
        showNotification('Login successful', 'success');
        navigate('/', {replace: true});

      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Login failed', 'error');
      }
    } catch (error) {
      showNotification('An error occurred during login', 'error');
    }
  };

  return (
    <div className="login" style={{ textAlign: 'left', margin: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
    </div>
  );
};

export default Login;
