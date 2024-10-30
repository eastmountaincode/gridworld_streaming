import React, { useState, useEffect, useContext, useRef } from 'react';
import AudioPlayer from '../AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { FaChevronDown } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './AudioShelf.css'; // Import the CSS file
import DownloadArea from './DownloadArea';

const AudioShelf = ({ albumTitle, shelfcolor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [audioShelfId] = useState(() => uuidv4());

  const { activeAudioShelfId, isPlaying } = useContext(AudioPlayerContext);
  const contentRef = useRef(null);

  const isActiveAndPlaying = (activeAudioShelfId === audioShelfId) && isPlaying

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  //console.log('api base url:', API_BASE_URL)

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
        const fullUrl = `${API_BASE_URL}/api/album?title=${encodeURIComponent(albumTitle)}`;
        //console.log('full url:', fullUrl);
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching album data:', errorText);

          const errorData = JSON.parse(errorText);

          if (errorData.error === 'token_invalid' || errorData.error === 'token_expired') {
            // Do not show any error message on the audio shelf for token errors
            setLoading(false);
            return;
          } else {
            throw new Error(errorData.message || 'Error fetching album data');
          }
        }

        // Read the response body once
        const responseBody = await response.text();
        //console.log('Response body:', responseBody);

        // Parse the response body as JSON
        const responseData = JSON.parse(responseBody);
        //console.log('Response data:', responseData);

        if (!responseData || !responseData.tracklist || !responseData.albumArtworkUrl) {
          throw new Error('Incomplete album data');
        }

        setAlbumData(responseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching album data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumTitle]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Add a guard clause to check if contentRef.current exists
    if (!contentRef.current) return;

    if (isExpanded) {
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      setTimeout(() => {
        contentRef.current.style.height = '0';
      }, 0);
    } else {
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      setTimeout(() => {
        contentRef.current.style.height = 'auto';
      }, 1000);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  if (error && error.message !== 'Incomplete album data') return null;
  if (error) return <div>Error loading album data: {error.message}</div>;

  return (
    <div className="audio-shelf-container">
      <div className={`audio-shelf ${isExpanded ? '' : 'collapsed'}`}>
        <div className="audio-shelf-header">
          <div className="album-title-container">
            {/* ALBUM TITLE */}
            <h2 className="album-title">{albumTitle}</h2>

            {/* ALBUM ARTWORK ICON OR PLAYING ICON */}
            {isActiveAndPlaying ? (
              <img src="/images/music-0130.gif" className="album-icon" style={{ height: '35px', width: '35px' }} />
            ) : (
              albumData && albumData.albumArtworkUrl && (
                <img
                  src={albumData.albumArtworkUrl}
                  alt="Album artwork"
                  className="album-icon"
                  style={{ height: '40px', width: '40px' }}
                />
              )
            )}
          </div>
          {/* EXPAND / COLLAPSE BUTTON */}
          <div
            className="chevron-container"
            onClick={toggleExpand}
          >
            <FaChevronDown style={{ width: '20px', height: '20px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>
        </div>
        <div className={`audio-shelf-content ${isExpanded ? 'expanded' : ''}`} ref={contentRef}>
          {albumData && (
            <AudioPlayer
              tracklist={albumData.tracklist}
              albumArtworkUrl={albumData.albumArtworkUrl}
              audioShelfId={audioShelfId}
              shelfcolor={shelfcolor}
              albumBlurb={albumData.albumBlurb}
            />
          )}
          {albumData.downloadable && <DownloadArea formats={albumData.downloadable.formats} shelfcolor={shelfcolor} audioShelfId={audioShelfId} />}
        </div>
      </div>
    </div>
  );
};
export default AudioShelf;