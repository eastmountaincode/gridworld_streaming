const validateSession = async () => {
  const storedSession = localStorage.getItem('userSession');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (storedSession) {
    const { token } = JSON.parse(storedSession);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        return { isValid: true };
      } else {
        localStorage.removeItem('userSession');
        return { isValid: false };
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('userSession');
      return { isValid: false };
    }
  }
  return { isValid: false };
};

export default validateSession;


  