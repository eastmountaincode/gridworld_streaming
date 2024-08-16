import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showNotification } = useNotification();
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const status = params.get('status');
  
      if (status === 'success') {
        showNotification('Access token purchase successful!', 'success', 5000);
      } else if (status === 'cancel') {
        showNotification('Purchase canceled.', 'info', 3000);
      }
  
      navigate('/');
    }, [location, navigate, showNotification]);
  
    return null;
  };
  
  export default PaymentResult;
