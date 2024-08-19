import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import validateSession from '../../../utils/validateSession';

const BuyAccessToken = () => {
  const { isAuthenticated, logout, userData } = useAuth();
  const { showNotification } = useNotification();

  const handleBuyAccessToken = async () => {
    if (!isAuthenticated) {
      showNotification('Please log in or create an account first.', 'warning', 4000);
      return;
    }

    const { isValid } = await validateSession();
    if (!isValid) {
      showNotification('Your session has expired. Please log in again.', 'error', 4000);
      logout();
      return;
    }

    try {
      console.log("in BuyAccessToken. in handlebuyaccesstoken. userData.userId:", userData.userId);
      const response = await fetch('http://localhost:3001/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userSession')}`
        },
        body: JSON.stringify({ userId: userData.userId})
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
    <div>
      <button onClick={handleBuyAccessToken}>Buy Access Token</button>
      <img src='/images/access_token/bounce_2.gif' 
      alt="Token"
      style={{height: '100px'}} />
    </div>
  );
};

export default BuyAccessToken;
