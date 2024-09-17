import React, { useState, useEffect, useContext } from 'react';
import AudioPlayer from '../AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { FaChevronDown, FaPlayCircle } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const AudioShelf = ({ albumTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [audioShelfId] = useState(() => uuidv4());

  const { activeAudioShelfId, isPlaying } = useContext(AudioPlayerContext);

  const isActiveAndPlaying = (activeAudioShelfId === audioShelfId) && isPlaying
  
  useEffect(() => {
    const fetchAlbumData = async () => {
      const storedSession = localStorage.getItem('userSession');
      let headers = {
        'Content-Type': 'application/json'
      };

      if (storedSession) {
        const { token } = JSON.parse(storedSession);
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/album?title=${albumTitle}`, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === 'token_invalid' || errorData.error === 'token_expired') {
            // Do not show any error message on the audio shelf for token errors
            setLoading(false);
            return;
          } else {
            throw new Error(errorData.message || 'Error fetching album data');
          }
        }

        const data = await response.json();

        if (!data || !data.tracklist || !data.albumArtworkUrl) {
          throw new Error('Incomplete album data');
        }

        setAlbumData(data);
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  if (error && error.message !== 'Incomplete album data') return null;
  if (error) return <div>Error loading album data: {error.message}</div>;

  return (
    <div className="audio-shelf-container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="audio-shelf" style={{
        border: '1px solid #ccc',
        width: '500px',
        margin: '5px 20px',
        overflow: 'hidden',
      }}>
        <div className="audio-shelf-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* ALBUM TITLE */}
              <h2 style={{ marginLeft: "5px", textAlign: "left", border: "1px solid red" }}>{albumTitle}</h2>

              {/* ALBUM ARTWORK ICON */}
              {albumData && albumData.albumArtworkUrl && (
                <img
                  src={albumData.albumArtworkUrl}
                  alt="Album artwork"
                  style={{ width: '40px', height: '40px', marginLeft: '16px' }}
                />
              )}
            </div>

            {/* PLAYING ICON */}
            {isActiveAndPlaying && <FaPlayCircle style={{ color: 'green', width: '38px', height: '38px', marginRight: '8px' }} />}
          </div>
          {/* EXPAND / COLLAPSE BUTTON */}
          <div
            style={chevronStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleExpand}
          >
            <FaChevronDown style={{ width: '20px', height: '20px' }} />
          </div>
        </div>
        <div className="audio-shelf-content" style={{ display: isExpanded ? 'block' : 'none' }}>
          {albumData && (
            <AudioPlayer
              tracklist={albumData.tracklist}
              albumArtworkUrl={albumData.albumArtworkUrl}
              audioShelfId={audioShelfId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default AudioShelf;