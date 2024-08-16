import React, { createContext, useState, useContext, useEffect } from 'react';
import validateJwtToken from '../../utils/validateJwtToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);

  const checkToken = async () => {
    const { isValid } = await validateJwtToken();
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (isValid && session) {
      setUserSession(session);
    } else {
      localStorage.removeItem('userSession');
      setUserSession(null);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = (token, userData) => {
    console.log("in login");
    console.log("in login token", token);
    console.log("in login userData", userData);
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
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
