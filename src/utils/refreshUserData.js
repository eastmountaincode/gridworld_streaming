const refreshUserData = async () => {
  const storedSession = localStorage.getItem('userSession');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (storedSession) {
    const { token } = JSON.parse(storedSession);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-user-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const updatedSession = { token, userData: data.userData };
        localStorage.setItem('userSession', JSON.stringify(updatedSession));
        return { isRefreshed: true, userData: data.userData };
      } else {
        return { isRefreshed: false, userData: null };
      }
    } catch (error) {
      console.error('User data refresh error:', error);
      return { isRefreshed: false, userData: null };
    }
  }
  return { isRefreshed: false, userData: null };
};

export default refreshUserData;

  