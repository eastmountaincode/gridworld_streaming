import React, { useContext } from 'react';
import { Button } from 'antd';
import { FaPlay, FaPause } from 'react-icons/fa';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';
import './PlayerHeader.css';
const PlayerHeader = ({ albumArtworkUrl, audioShelfId, shelfcolor, tracklist, firstTrack, albumBlurb }) => {
    const { currentTrack,
        currentTracklist,
        activeAudioShelfId,
        isPlaying,
        play,
        pause
    } = useContext(AudioPlayerContext);

    const isActiveAudioPlayer = activeAudioShelfId === audioShelfId;

    const handlePlayPause = () => {
        if (currentTrack && isActiveAudioPlayer) {
            if (isPlaying) {
                pause();
            } else {
                play(currentTrack, currentTracklist, audioShelfId, albumArtworkUrl);
            }
        } else if (tracklist && firstTrack) {
            play(firstTrack, tracklist, audioShelfId, albumArtworkUrl);
            
        }
    };

    const buttonStyle = {
        backgroundColor: shelfcolor,
        borderColor: 'black',
        color: 'black',
        fontSize: '20px',
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

    const playIconStyle = {
        position: 'relative',
        left: '1px',
    };

    return (
        <div className="player-header">
            {albumBlurb && (
                <div className="album-blurb" dangerouslySetInnerHTML={{ __html: albumBlurb }} style={{ textAlign: 'left', margin: '5px 18px 10px 18px', fontSize: '18px', }} />
            )}
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
                        style={buttonStyle}
                    >
                        {isActiveAudioPlayer && isPlaying ?
                            <FaPause /> :
                            <FaPlay style={playIconStyle} />
                        }
                    </Button>
                </div>

                <div className="current-track-info">
                    {isActiveAudioPlayer && currentTrack && <h4>{currentTrack.trackTitle}</h4>}
                </div>
            </div>
        </div>
    );
};
export default PlayerHeader;