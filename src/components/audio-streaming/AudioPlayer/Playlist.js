import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaPlay, FaPause } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const Playlist = ({ tracklist, audioShelfId, shelfColor }) => {
    const { currentTrack, isPlaying, play, pause } = useContext(AudioPlayerContext);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = (track) => {
        if (currentTrack?.trackId === track.trackId && isPlaying) {
            console.log('current track is this one, and isPlaying is true. pausing.')
            pause();
        } else {
            play(track, tracklist, audioShelfId);
        }
    };

    const getButtonStyle = (isPlayButton) => {
        return {
            backgroundColor: shelfColor,
            borderColor: 'black',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: isPlayButton ? '1px' : '0px',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: 999,
        };
    };

    return (
        <div className="playlist">
            {tracklist.map((track) => (
                <div key={track.trackId}
                    className={`playlist-item ${currentTrack?.trackId === track.trackId ? 'active' : ''}`}
                    style={{
                        margin: '10px',
                        padding: '10px',
                        border: `1px solid black`,
                        borderWidth: currentTrack?.trackId === track.trackId ? '1px' : '1px',
                        borderRadius: '6px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button
                                onClick={() => handlePlayPause(track)}
                                icon={currentTrack?.trackId === track.trackId && isPlaying ? <FaPause /> : <FaPlay />}
                                style={getButtonStyle(!(currentTrack?.trackId === track.trackId && isPlaying))}
                            />
                            <span className="track-number" style={{ marginLeft: '10px' }}>{track.trackNumber}</span>
                        </div>
                        <span className="track-title" style={{
                            fontWeight: currentTrack?.trackId === track.trackId ? '700' : 'normal',
                            marginLeft: '20px',
                            marginRight: '10px',
                            textAlign: 'left',
                            flex: 1
                        }}>
                            {track.trackTitle}
                        </span>
                        <span className="track-duration" >{formatDuration(track.trackDuration)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Playlist;