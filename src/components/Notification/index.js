import React, { useEffect } from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '../../context/NotificationContext';

const Notification = () => {
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      const { message, type, duration=4200 } = notification;
      toast[type](message, { autoClose: duration });
    }
  }, [notification]);

  return (
    <ToastContainer
      position="bottom-right"
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="dark"
      transition={Slide}
    />
  );
};

export default Notification;



