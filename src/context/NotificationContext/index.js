import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // State to hold the current notification
  const [notification, setNotification] = useState(null);

  // Function to show a notification
  // This only sets the notification data, not the UI implementation
  const showNotification = (message, type, duration) => {
    setNotification({ message, type, duration });
  };

  // Provide the notification state and showNotification function to children
  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
