self.addEventListener('install', (event) => {
    console.log('in audio-service-worker.js, Audio Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('in audio-service-worker.js, Audio Service Worker activated');
});

self.addEventListener('message', (event) => {
    console.log("Receiving message in audio-service-worker.js:", event.data);
    if (event.data && event.data.type === 'PLAY_AUDIO') {
        console.log('Service Worker: Playing audio', event.data.track);
    } else if (event.data && event.data.type === 'TRACK_ENDED') {
        console.log('Service Worker: Track ended, playing next track');
    } 
});
