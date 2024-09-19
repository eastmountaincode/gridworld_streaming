import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaPlay, FaPause } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './PlayerHeader.css';
const PlayerHeader = ({ albumArtworkUrl, audioShelfId, shelfColor, tracklist, firstTrack }) => {
    const { currentTrack, currentTracklist, activeAudioShelfId, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const isActiveAudioPlayer = activeAudioShelfId === audioShelfId;

    const handlePlayPause = () => {
        if (currentTrack && isActiveAudioPlayer) {
            if (isPlaying) {
                pause();
            } else {
                play(currentTrack, currentTracklist, audioShelfId);
            }
        } else if (tracklist && firstTrack) {
            play(firstTrack, tracklist, audioShelfId);
        }
    };

    const buttonStyle = {
        backgroundColor: shelfColor,
        borderColor: 'white',
        color: 'white',
        fontSize: '20px',
        paddingLeft: '1px',
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        opacity: 1,
        pointerEvents: 'auto',
        marginTop: '10px',
    };

    return (
        <div className="player-header">
            {albumArtworkUrl && (
                <img
                    className='album-artwork'
                    src={albumArtworkUrl}
                    alt="Album artwork"
                />
            )}

            <div className="player-header-content">
                <div className="play-button-container">
                    <Button
                        onClick={handlePlayPause}
                        icon={isActiveAudioPlayer && isPlaying ? <FaPause /> : <FaPlay />}
                        style={buttonStyle}
                    />
                </div>

                <div className="current-track-info">
                    {isActiveAudioPlayer && currentTrack && <h4>{currentTrack.trackTitle}</h4>}
                </div>
            </div>
        </div>
    );
};
export default PlayerHeader;