import React, { useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import { FaChevronDown } from 'react-icons/fa';

const AudioShelf = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const chevronStyle = {
    cursor: 'pointer',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
    padding: '10px',
    border: isHovered ? '1px solid #ccc' : '1px solid transparent',
    borderRadius: '10%',
  };

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
        {isExpanded && (
          <div className="audio-shelf-content">
            <AudioPlayer />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioShelf;
