import React, { useContext } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const Playlist = ({ tracklist, audioPlayerId }) => {
    const { currentTrack, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = (track) => {
        if (currentTrack?.trackId === track.trackId && isPlaying) {
            pause();
        } else {
            play(track, tracklist, audioPlayerId);
        }
    };

    return (
        <div className="playlist" style={{border: '2px solid yellow'}}>
            {tracklist.map((track) => (
                <div key={track.trackId}
                    className={`playlist-item ${currentTrack?.trackId === track.trackId ? 'active' : ''}`}
                    style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button 
                            onClick={() => handlePlayPause(track)}
                            style={{ cursor: 'pointer' }}
                        >
                            {currentTrack?.trackId === track.trackId && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <span className="track-number">{track.trackNumber}</span>
                        <span className="track-title">{track.trackTitle}</span>
                        <span className="track-duration">{formatDuration(track.trackDuration)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Playlist;