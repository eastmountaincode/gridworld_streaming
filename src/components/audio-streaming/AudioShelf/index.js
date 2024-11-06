import React, { useState, useEffect, useContext, useRef } from 'react';
import AudioPlayer from '../AudioPlayer';
import { FaChevronDown } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './AudioShelf.css'; // Import the CSS file
import DownloadArea from './DownloadArea';
import { Collapse } from 'antd';
import styled from 'styled-components';
import { keyframes } from 'styled-components';


const createGradientAnimation = (shelfcolor) => keyframes`
  0% {
    background-color: slategray;
  }
  100% {
    background: linear-gradient(
      to bottom,
      slategray 0%,
      slategray 50%,
      ${shelfcolor || 'slategray'} 100%
    );
  }
`;

const StyledCollapse = styled(Collapse)`
  &&& {
    width: 100%;
    max-width: 550px;
    border: 1px solid black;
    border-radius: 8px;
    color: black;
    background-color: slategray;
    margin: 0 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 19px; /* this is what controls the space between shelves */
    min-width: 300px;

    .ant-collapse-item-active {
      animation: ${({ shelfcolor }) => createGradientAnimation(shelfcolor)} 0.3s linear forwards;
    }

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


const AudioShelf = ({ albumTitle, shelfcolor, audioShelfId, albumData }) => {
  console.log('hello')
  console.log(albumData)
  
  const [error, setError] = useState(null);

  const { activeAudioShelfId, isPlaying } = useContext(AudioPlayerContext);

  const isActiveAndPlaying = (activeAudioShelfId === audioShelfId) && isPlaying
  
  if (error && error.message !== 'Incomplete album data') return null;
  if (error) return <div>Error loading album data: {error.message}</div>;

  return (
    <div className="audio-shelf-container">
      <StyledCollapse
        expandIconPosition='end'
        collapsible='header'
        className='audio-shelf-collapse'
        shelfcolor={shelfcolor}

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
                <h2 className='album-title'>{albumData && albumData.albumTitle}</h2>
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
                {albumData && albumData.downloadable && (
                  <DownloadArea
                    formats={albumData.downloadable.formats}
                    shelfcolor={shelfcolor}
                    audioShelfId={audioShelfId}
                  />
                )}
              </div>
            )
          }
        ]}
      />
    </div>
  );

};
export default AudioShelf;