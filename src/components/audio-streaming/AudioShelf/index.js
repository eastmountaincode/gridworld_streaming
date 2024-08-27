import React, { useState, useEffect } from 'react';
import AudioPlayer from '../AudioPlayer';
import { FaChevronDown } from 'react-icons/fa';

const AudioShelf = ({ albumTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [tracklist, setTracklist] = useState(null);
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/album?title=${albumTitle}`);
        const data = await response.json();

        if (!data || !data.tracklistId || !data.albumArtworkId) {
          throw new Error('Incomplete album data');
        }

        setAlbumData(data);

        const trackListResponse = await fetch(`http://localhost:3001/api/tracklist?id=${data.tracklistId}`);
        const trackListData = await trackListResponse.json();

        if (!trackListData || !trackListData.tracks) {
          throw new Error('Incomplete track list data');
        }

        setTracklist(trackListData);

        const albumArtworkResponse = await fetch(`http://localhost:3001/api/album-artwork?id=${data.albumArtworkId}`);
        const albumArtworkData = await albumArtworkResponse.json();

        if (!albumArtworkData || !albumArtworkData.firebaseUrl) {
          throw new Error('Incomplete album artwork data');
        }

        setAlbumArtworkUrl(albumArtworkData.firebaseUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching album data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumTitle]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const chevronStyle = {
    cursor: 'pointer',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
    padding: '10px',
    border: isHovered ? '1px solid #ccc' : '1px solid transparent',
    borderRadius: '10%',
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading album data: {error.message}</div>;

  return (
    <div className="audio-shelf-container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="audio-shelf" style={{
        border: '1px solid #ccc',
        width: '500px',
      }}>
        <div className="audio-shelf-header" onClick={toggleExpand} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
        }}>
          <h3>{albumTitle}</h3>
          <div 
            style={chevronStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FaChevronDown />
          </div>
        </div>
        {isExpanded && albumData && tracklist && albumArtworkUrl && (
          <div className="audio-shelf-content">
            <AudioPlayer albumData={albumData} tracklist={tracklist} albumArtworkUrl={albumArtworkUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioShelf;