import React, { createContext, useState, useContext, useEffect } from 'react';
import validateJwtToken from '../../utils/validateJwtToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const { isValid, user } = await validateJwtToken();
      if (isValid) {
        setUserSession({ token: localStorage.getItem('userSession'), user });
      } else {
        setUserSession(null);
      }
    };

    checkToken();
  }, []);

  const login = (token, userData) => {
    const session = { token, user: userData };
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
      user: userSession?.user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
