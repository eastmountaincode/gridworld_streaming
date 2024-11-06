import React, { createContext, useContext, useState } from 'react';

const GlobalLoadingContext = createContext();

export const GlobalLoadingProvider = ({ children }) => {
  const [loadingComponents, setLoadingComponents] = useState(new Map());
  
  const setComponentLoading = (componentId, isLoading) => {
    console.log('setting component loading with componentID:', componentId, " isLoading: ", isLoading);
    setLoadingComponents(prev => {
      const newMap = new Map(prev);
      if (isLoading) {
        newMap.set(componentId, isLoading);
      } else {
        newMap.delete(componentId);
      }
      return newMap;
    });
  };

  const isEverythingReady = loadingComponents.size === 0;

  return (
    <GlobalLoadingContext.Provider value={{ 
      setComponentLoading, 
      isEverythingReady,
      loadingComponents 
    }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};
