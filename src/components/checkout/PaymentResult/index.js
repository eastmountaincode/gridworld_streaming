import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import validateSession from '../../../utils/validateSession';
import refreshUserData from '../../../utils/refreshUserData';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { login } = useAuth();

  useEffect(() => {
    const handlePaymentResult = async () => {
      const params = new URLSearchParams(location.search);
      const status = params.get('status');

      if (status === 'success') {
        showNotification('Access token purchase successful!', 'success');
        
        // Fetch updated user data
        const { isValid } = await validateSession();
        if (isValid) {
          const { isRefreshed, userData } = await refreshUserData();
          if (isRefreshed && userData) {
            login(JSON.parse(localStorage.getItem('userSession')), userData);
          }
        } else {
          showNotification('Session expired. Please log in again.', 'warning');
          return;
        }
      } else if (status === 'cancel') {
        showNotification('Purchase canceled.', 'info');
      }

      navigate('/');
    };

    handlePaymentResult();
  }, [location, navigate, showNotification, login]);

  return null;
};

export default PaymentResult;