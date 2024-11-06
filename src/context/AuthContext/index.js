import React, { createContext, useState, useContext, useEffect } from 'react';
import validateSession from '../../utils/validateSession';
import refreshUserData from '../../utils/refreshUserData';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [authIsLoading, setAuthIsLoading] = useState(true);

  useEffect(() => {
    const validateAndRefresh = async () => {
      setAuthIsLoading(true);

      // Add artificial delay
      //await new Promise(resolve => setTimeout(resolve, 1000)); // 2 second delay

      const { isValid } = await validateSession()
      if (isValid) {
        const { isRefreshed, userData } = await refreshUserData();
        if (isRefreshed) {
          console.log('User data refreshed successfully');
          console.log('User data:', userData);
          const storedSession = JSON.parse(localStorage.getItem('userSession'));
          setUserSession({ token: storedSession.token, userData });
        } else {
          setUserSession(null);
        }
      } else {
        setUserSession(null);
      }
      setAuthIsLoading(false);
    };

    validateAndRefresh();
  }, []);

  const login = (token, userData) => {
    const session = { token, userData };
    localStorage.setItem('userSession', JSON.stringify(session));
    setUserSession(session);
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!userSession,
      userData: userSession?.userData,
      authIsLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

