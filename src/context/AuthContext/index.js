import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const storedSession = localStorage.getItem('userSession');
      if (storedSession) {
        console.log("Attempting to validate token");
        console.log('Stored Session:', storedSession);
        const { token, user } = JSON.parse(storedSession);
        console.log('token:', token)
        console.log('user:', user);
        try {
          const response = await fetch('http://localhost:3001/api/auth/validate-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setUserSession({ token, user });
          } else {
            localStorage.removeItem('userSession');
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('userSession');
        }
      }
    };

    validateToken();
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
