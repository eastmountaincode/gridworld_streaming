import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaPlay, FaPause } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './PlayerHeader.css';

const PlayerHeader = ({ albumArtworkUrl, audioShelfId, shelfColor }) => {
    const { currentTrack, currentTracklist, activeAudioShelfId, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const isActiveAudioPlayer = activeAudioShelfId === audioShelfId;

    const handlePlayPause = () => {
        if (currentTrack && isActiveAudioPlayer) {
            if (isPlaying) {
                pause();
            } else {
                play(currentTrack, currentTracklist, audioShelfId);
            }
        }
    };

    const buttonClass = isActiveAudioPlayer && currentTrack ? 'active-button' : 'inactive-button';

    const buttonStyle = {
        backgroundColor: shelfColor, // Green background color
        borderColor: 'white', // Tomato Red border color
        color: 'white', // White text color
        fontSize: '20px', // Font size
        width: '50px', // Button width
        height: '50px', // Button height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };


    return (
        <div className="player-header">
            {/* ALBUM ARTWORK */}
            {albumArtworkUrl && (
                <img
                    className='album-artwork'
                    src={albumArtworkUrl}
                    alt="Album artwork"
                />
            )}

            {/* GLOBAL PLAY BUTTON */}
            <div className="play-button-container">
                <Button
                    onClick={handlePlayPause}
                    className={buttonClass}
                    icon={isActiveAudioPlayer && isPlaying ? <FaPause /> : <FaPlay />}
                    style={buttonStyle}
                />
            </div>

            {/* CURRENT TRACK INFO */}
            <div className="current-track-info">
                {isActiveAudioPlayer && currentTrack && <h3>{currentTrack.trackTitle}</h3>}
            </div>
        </div>
    );
};

export default PlayerHeader;