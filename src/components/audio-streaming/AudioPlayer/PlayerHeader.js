import React, { useContext, useState } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const PlayerHeader = ({ albumArtworkUrl, audioPlayerId }) => {
    const { currentTrack, activeAudioPlayerId, audioRef } = useContext(AudioPlayerContext);
    const [isArtworkView, setIsArtworkView] = useState(true);

    const isActiveAudioPlayer = activeAudioPlayerId === audioPlayerId;

    const toggleView = () => {
        setIsArtworkView(!isArtworkView);
    };

    return (
        <div className="player-header" style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
            <button onClick={toggleView} style={{ marginBottom: '10px' }}>
                {isArtworkView ? 'Show Visualizer' : 'Show Album Artwork'}
            </button>
            {isArtworkView ? (
                albumArtworkUrl && (
                    <img
                        src={albumArtworkUrl}
                        alt="Album artwork"
                        style={{ width: '200px', height: '200px', marginBottom: '10px' }}
                    />
                )
            ) : (
                <div>
                    <p>Visualizer</p>
                    </div>
                // <Visualizer />
            )}
            <div style={{ height: '30px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
                {isActiveAudioPlayer && currentTrack && <h3>{currentTrack.trackTitle}</h3>}
            </div>
        </div>
    );
};

export default PlayerHeader;