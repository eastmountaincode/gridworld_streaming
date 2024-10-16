self.addEventListener('install', (event) => {
    console.log('in audio-service-worker.js, Audio Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('in audio-service-worker.js, Audio Service Worker activated');
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PLAY_AUDIO') {
        // Start the foreground service
        self.registration.showNotification('Audio Playing', {
            body: `Now playing: ${event.data.track.title}`,
            icon: 'favicon.ico',
            tag: 'audio-playback'
        });
    } else if (event.data && event.data.type === 'TRACK_ENDED') {
        console.log('Track ended, playing next track');
    } 
});
