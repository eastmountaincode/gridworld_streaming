import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const { isAuthenticated, userData, authIsLoading } = useAuth();
  const [albumsData, setAlbumsData] = useState({});
  const [contentIsLoading, setContentIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (authIsLoading) return;
      
      setContentIsLoading(true);

      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const headers = {
          'Content-Type': 'application/json'
        };

        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          const { token } = JSON.parse(storedSession);
          headers['Authorization'] = `Bearer ${token}`;
        }

        const albumTitles = isAuthenticated && userData?.hasAccessToken 
          ? ['Gridworld', 'Gridworld Instrumentals', 'Windy Gridworld']
          : ['Gridworld Lite'];

        const fetchedAlbums = {};
        for (const title of albumTitles) {
          const response = await fetch(`${API_BASE_URL}/api/album?title=${encodeURIComponent(title)}`, {
            headers
          });
          if (response.ok) {
            fetchedAlbums[title] = await response.json();
          }
        }

        setAlbumsData(fetchedAlbums);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setContentIsLoading(false);
      }
    };

    fetchContent();
  }, [authIsLoading, isAuthenticated, userData?.hasAccessToken]);

  return (
    <ContentContext.Provider value={{
      albumsData,
      contentIsLoading,
      isAuthenticated,
      hasAccessToken: userData?.hasAccessToken
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
