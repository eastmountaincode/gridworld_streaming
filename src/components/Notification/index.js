import React, { useEffect } from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '../../context/NotificationContext';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer).attrs({
  // This ensures theme and other ToastContainer props are passed through
  position: "bottom-right",
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  theme: "light",
  transition: Slide
})`
  &.Toastify__toast-container {
    @media (max-width: 480px) {
      width: 90%;
      margin: 0 auto 1rem auto;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
    }
  }

  .Toastify__toast {
    @media (max-width: 480px) {
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }
  }
`;

const Notification = () => {
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      const { message, type, duration=4200 } = notification;
      toast[type](message, { autoClose: duration });
    }
  }, [notification]);

  return <StyledToastContainer />;
};

export default Notification;