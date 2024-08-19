import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import validateSession from './utils/validateSession';
import config from './utils/config';

const DefaultHome = () => {
  const { isAuthenticated, logout, userData } = useAuth();
  const { showNotification } = useNotification();

  const [currentTokenIndex, setCurrentTokenIndex] = React.useState(0);
  const token_images = [
    'bw.png',
    'griddy.png',
    'new_W.png',
    // 'OG_animation.gif',
    'OG_minimal.png',
    'OG.png',
    // 'slow_animation.gif',
    'token_active.PNG',
    'token_inactive.PNG',
    'bw_empty.png',
    'griddy_empty.png',
    'bounce_2.gif'
  ]

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setCurrentTokenIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : token_images.length - 1
        );
      } else if (event.key === 'ArrowRight') {
        setCurrentTokenIndex((prevIndex) => 
          prevIndex < token_images.length - 1 ? prevIndex + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [token_images.length]);

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
      console.log("in default home. in handlebuyaccesstoken. userData.userId:", userData.userId);
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

  console.log(config.ACCESS_TOKEN_IMAGE_PATH);

  return (
    <div className="default-home">
      <h1>Welcome to Gridworld Streaming</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={handleBuyAccessToken}>Buy Access Token</button>
        <img 
          src={`/images/access_token/${token_images[currentTokenIndex]}`} 
          alt="Token" 
          style={{ width: '80px', marginLeft: '20px' }}
        />      
      </div>
    </div>
  );
};

export default DefaultHome;
