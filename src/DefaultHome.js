import React from 'react';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import validateJwtToken from './utils/validateJwtToken';

const DefaultHome = () => {
  const { isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();

  const handleBuyAccessToken = async () => {
    if (!isAuthenticated) {
      showNotification('Please log in or create an account first.', 'warning', 4000);
      return;
    }

    const { isValid } = await validateJwtToken();
    if (!isValid) {
      showNotification('Your session has expired. Please log in again.', 'error', 4000);
      logout();
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userSession')}`
        },
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        showNotification('Error creating checkout session', 'error', 4200);
      }
    } catch (error) {
      showNotification('Error creating checkout session', 'error', 4200);
    }
  };

  return (
    <div className="default-home">
      <h1>Welcome to Gridworld Streaming</h1>
      <button onClick={handleBuyAccessToken}>Buy Access Token</button>
    </div>
  );
};

export default DefaultHome;
