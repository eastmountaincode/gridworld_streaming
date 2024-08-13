import React from 'react';
import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '../context/NotificationContext';

const Notification = () => {
  const { notification } = useNotification();

  if (notification) {
    const { message, type, duration } = notification;
    toast[type](message, { autoClose: duration });
  }

  return <ToastContainer
    position="top-right"
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable={false}
    pauseOnHover={false}
    theme="dark"
    transition={Flip}
  />;
};

export default Notification;


