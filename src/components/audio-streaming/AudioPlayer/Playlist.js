import React, { useContext } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const Playlist = ({ tracklist }) => {
    const { currentTrackId, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = (track) => {
        if (currentTrackId === track.trackId && isPlaying) {
            pause();
        } else {
            play(track.trackId, track.firebaseURL, track.trackDuration);
        }
    };

    return (
        <div className="playlist" style={{border: '2px solid yellow'}}>
            {tracklist.tracks.map((track) => (
                <div key={track.trackId}
                    className={`playlist-item ${currentTrackId === track.trackId ? 'active' : ''}`}
                    style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => handlePlayPause(track)}>
                            {currentTrackId === track.trackId && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <span className="track-number">{track.trackNumber}</span>
                        <span className="track-title" onClick={() => handlePlayPause(track)}>{track.trackTitle}</span>
                        <span className="track-duration">{formatDuration(track.trackDuration)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Playlist;