import React, { createContext, useState, useContext } from 'react';

const DownloadRadioButtonContext = createContext();

export const DownloadRadioButtonProvider = ({ children }) => {
  const [activeRadioComponentId, setActiveRadioComponentId] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');

  return (
    <DownloadRadioButtonContext.Provider 
      value={{ 
        activeRadioComponentId, 
        setActiveRadioComponentId,
      }}
    >
      {children}
    </DownloadRadioButtonContext.Provider>
  );
};

export const useDownloadRadioButton = () => useContext(DownloadRadioButtonContext);