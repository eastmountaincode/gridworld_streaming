const validateJwtToken = async () => {
    const storedSession = localStorage.getItem('userSession');
    if (storedSession) {
      const { token, userData } = JSON.parse(storedSession);
      console.log("validating token, info:", token, userData);
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
          console.log("validating token, response:", data);
          return { isValid: true };
        } else {
          return { isValid: false }; 
        }
      } catch (error) {
        console.error('Token validation error:', error);
        return { isValid: false };
      }
    }
    return { isValid: false };
  };
  
  export default validateJwtToken;
  