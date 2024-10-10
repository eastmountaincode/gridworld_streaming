import { useEffect, useState } from 'react';
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

  const [successNotificationShown, setSuccessNotificationShown] = useState(false);

  useEffect(() => {
    const handlePaymentResult = async () => {
      const params = new URLSearchParams(location.search);
      const status = params.get('status');

      if (status === 'success' && !successNotificationShown) {
        showNotification('Access token purchase successful!', 'success');
        setSuccessNotificationShown(true);

        // Fetch updated user data
        const { isValid } = await validateSession();
        if (isValid) {
          const { isRefreshed, userData } = await refreshUserData();
          if (isRefreshed && userData) {
            const storedSession = JSON.parse(localStorage.getItem('userSession'));
            login(storedSession.token, userData);
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
  }, []);

  return null;
};

export default PaymentResult;