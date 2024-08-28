import React, { useContext } from 'react';
import { AudioPlayerContext } from '../../../context/AudioPlayerContext';

const PlayerHeader = ({ albumArtworkUrl, audioPlayerId }) => {
    const { currentTrack, activeAudioPlayerId } = useContext(AudioPlayerContext);

    const isActiveAudioPlayer = activeAudioPlayerId === audioPlayerId;


    return (
        <div className="player-header" style={{ height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
            {albumArtworkUrl && (
                <img
                    src={albumArtworkUrl}
                    alt="Album artwork"
                    style={{ width: '200px', height: '200px', marginBottom: '10px' }}
                />
            )}
            <div style={{ height: '30px', width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid blue', borderRadius: '5px' }}>
                {isActiveAudioPlayer && currentTrack && <h3>{currentTrack.trackTitle}</h3>}
            </div>
        </div>
    );
};

export default PlayerHeader;
