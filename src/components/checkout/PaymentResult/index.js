import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import validateSession from '../../../utils/validateSession';

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
          const session = JSON.parse(localStorage.getItem('userSession'));

          //login(localStorage.getItem('userSession'), userData);
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

