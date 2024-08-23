import React, { useState, useEffect } from 'react';
import AudioPlayer from '../AudioPlayer';
import { FaChevronDown } from 'react-icons/fa';

// AudioShelf is responsible for fetching and managing album data, while
// the AudioPlayer component focuses on playback and rendering the album data.
const AudioShelf = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [albumData, setAlbumData] = useState(null);
  const [trackList, setTrackList] = useState(null);
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const chevronStyle = {
    cursor: 'pointer',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
    padding: '10px',
    border: isHovered ? '1px solid #ccc' : '1px solid transparent',
    borderRadius: '10%',
  };

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/album?title=${title}`);
        const data = await response.json();
        setAlbumData(data);
        console.log("data after fetchAlbumData:", data);

        if (data.tracklistId) {
          console.log("tracklistId:", data.tracklistId);
          const trackListResponse = await fetch(`http://localhost:3001/api/tracklist?id=${data.tracklistId}`);
          const trackListData = await trackListResponse.json();
          setTrackList(trackListData);
          console.log("trackListData after fetchAlbumData:", trackListData);
        }

        if (data.albumArtworkId) {
          const albumArtworkResponse = await fetch(`http://localhost:3001/api/album-artwork?id=${data.albumArtworkId}`);
          const albumArtworkData = await albumArtworkResponse.json();
          setAlbumArtworkUrl(albumArtworkData.firebaseUrl);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [title]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading album data</div>;

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
          <h3>{title}</h3>
          <div 
            style={chevronStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FaChevronDown />
          </div>
        </div>
        {isExpanded && albumData && trackList && albumArtworkUrl && (
          <div className="audio-shelf-content">
            <AudioPlayer albumData={albumData} trackList={trackList} albumArtworkUrl={albumArtworkUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioShelf;