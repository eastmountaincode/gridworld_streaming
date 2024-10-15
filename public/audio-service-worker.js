self.addEventListener('install', (event) => {
    console.log('Audio Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Audio Service Worker activated');
});


self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PLAY_AUDIO') {
        // Start the foreground service
        self.registration.showNotification('Audio Playing', {
            body: 'Your music is playing in the background',
            icon: 'favicon.ico',
            tag: 'audio-playback'
        });
    }
});
