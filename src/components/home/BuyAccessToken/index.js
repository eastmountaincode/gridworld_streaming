import React from 'react';
import { Button } from 'antd'; // Import Button from antd
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import validateSession from '../../../utils/validateSession';

const BuyAccessToken = () => {
  const { isAuthenticated, logout, userData } = useAuth();
  const { showNotification } = useNotification();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
      const response = await fetch(`${API_BASE_URL}/api/checkout/create-checkout-session`, {
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

  const buttonStyle = {
    backgroundColor: 'whitesmoke',
    color: 'black',
    borderColor: 'black',
  };

  return (
    <div style={{margin: "0px 20px"}}>
      <Button type="default" onClick={handleBuyAccessToken} style={buttonStyle}>Buy Access Token</Button> {/* Use Ant Design Button */}
      <img src='/images/access_token/bounce_2.gif' 
      alt="Token"
      style={{height: '100px', marginLeft: '5px'}}/>
    </div>
  );
};

export default BuyAccessToken;