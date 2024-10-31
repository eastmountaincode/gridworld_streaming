import React, { useState, useEffect, useContext, useRef } from 'react';
import AudioPlayer from '../AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { FaChevronDown } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './AudioShelf.css'; // Import the CSS file
import DownloadArea from './DownloadArea';
import { Collapse } from 'antd';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
  &&& {
    width: 100%;
    max-width: 550px;
    border: 1px solid black;
    border-radius: 3px;
    color: black;
    background-color: slategray;
    margin: 0 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 20px; /* this is what controls the space between shelves */
    min-width: 300px;

    @media (max-width: 481px) {
      margin-bottom: 16px; // Different margin for mobile
    }

  }

  .ant-collapse-header {
    display: flex;
    align-items: center !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 70px;
  }

  .ant-collapse-content {
    background-color: transparent;
    border-top: 1px solid black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .album-title-container {
    display: flex; /* allow content to be horizontally arranged */
  }

  .ant-collapse-content-box {
    white-space: normal; /* give the text a margin */
  }





  






`;


const AudioShelf = ({ albumTitle, shelfcolor }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [audioShelfId] = useState(() => uuidv4());

  const { activeAudioShelfId, isPlaying } = useContext(AudioPlayerContext);

  const isActiveAndPlaying = (activeAudioShelfId === audioShelfId) && isPlaying

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

        // Parse the response body as JSON
        const responseData = JSON.parse(responseBody);

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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  if (error && error.message !== 'Incomplete album data') return null;
  if (error) return <div>Error loading album data: {error.message}</div>;

  return (
    <div className="audio-shelf-container">
      <StyledCollapse
        expandIconPosition='end'
        collapsible='header'
        className='audio-shelf-collapse'

        expandIcon={({ isActive }) => (
          <FaChevronDown
            style={{
              fontSize: '20px',
              transform: `rotate(${isActive ? -90 : 0}deg)`,
              transition: 'transform 0.3s'
            }}
          />
        )}
        items={[
          {
            key: "1",
            label: (
              <div className="album-title-container">
                <h2 className='album-title'>{albumTitle}</h2>
                {isActiveAndPlaying ? (
                  <img src="/images/music-0130.gif" className="album-icon" style={{ height: '40px', width: '40px' }} />
                ) : (
                  albumData && albumData.albumArtworkUrl && (
                    <img src={albumData.albumArtworkUrl} alt="Album artwork" className="album-icon" style={{ height: '40px', width: '40px' }} />
                  )
                )}
              </div>
            ),
            children: (
              <div className='audio-shelf-content' >
                {albumData && (
                  <AudioPlayer
                    tracklist={albumData.tracklist}
                    albumArtworkUrl={albumData.albumArtworkUrl}
                    audioShelfId={audioShelfId}
                    shelfcolor={shelfcolor}
                    albumBlurb={albumData.albumBlurb}
                  />
                )}
                {albumData.downloadable &&
                  <DownloadArea
                    formats={albumData.downloadable.formats}
                    shelfcolor={shelfcolor}
                    audioShelfId={audioShelfId}
                  />
                }
              </div>
            )
          }
        ]}
      />
    </div>
  );

};
export default AudioShelf;