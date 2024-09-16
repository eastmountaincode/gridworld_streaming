import React, { useContext, useState } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const PlayerHeader = ({ albumArtworkUrl, audioPlayerId }) => {
    const { currentTrack, currentTracklist, activeAudioPlayerId, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const isActiveAudioPlayer = activeAudioPlayerId === audioPlayerId;

    const handlePlayPause = () => {
        if (currentTrack && isActiveAudioPlayer) {
            if (isPlaying) {
                pause();
            } else {
                play(currentTrack, currentTracklist, audioPlayerId);
            }
        }
    };

    const buttonStyle = {
        cursor: isActiveAudioPlayer && currentTrack ? 'pointer' : 'default',
        opacity: isActiveAudioPlayer && currentTrack ? 1 : 0.5,
        pointerEvents: isActiveAudioPlayer && currentTrack ? 'auto' : 'none',
        marginTop: '10px'
    };

    return (
        <div className="player-header" style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
            {/* ALBUM ARTWORK */}
            {albumArtworkUrl && (
                <img
                    src={albumArtworkUrl}
                    alt="Album artwork"
                    style={{ width: '200px', height: '200px' }}
                />
            )}

            {/* GLOBAL PLAY BUTTON */}
            <div style={{margin: "10px"}}>
                <button
                    onClick={handlePlayPause}
                    style={buttonStyle}
                >
                    {isActiveAudioPlayer && isPlaying ? '⏸️' : '▶️'}
                </button>
            </div>

            {/* CURRENT TRACK INFO */}
            <div style={{ height: '30px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
                {isActiveAudioPlayer && currentTrack && <h3>{currentTrack.trackTitle}</h3>}
            </div>
        </div>
    );
};

export default PlayerHeader;