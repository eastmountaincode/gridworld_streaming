const validateUserSession = async () => {
  const storedSession = localStorage.getItem('userSession');
  if (storedSession) {
    const { token, userData } = JSON.parse(storedSession);
    try {
      const response = await fetch('http://localhost:3001/api/auth/validate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return { isValid: true, userData: data.userData };
      } else {
        localStorage.removeItem('userSession');
        return { isValid: false, userData: null };
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('userSession');
      return { isValid: false, userData: null };
    }
  }
  return { isValid: false, userData: null };
};

export default validateUserSession;

  