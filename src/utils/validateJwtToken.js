const validateJwtToken = async () => {
    const storedSession = localStorage.getItem('userSession');
    if (storedSession) {
      const { token } = JSON.parse(storedSession);
      try {
        const response = await fetch('http://localhost:3001/api/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return { isValid: true, user: data.user };
        } else {
          localStorage.removeItem('userSession');
          return { isValid: false };
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('userSession');
        return { isValid: false };
      }
    }
    return { isValid: false };
  };
  
  export default validateJwtToken;
  