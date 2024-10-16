import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AudioPlayerProvider>
        <NotificationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </NotificationProvider>
    </AudioPlayerProvider>
);

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/audio-service-worker.js')
//         .then(registration => {
//           console.log('Audio Service Worker registered successfully:', registration.scope);
//         })
//         .catch(error => {
//           console.error('Audio Service Worker registration failed:', error);
//         });
//     });
//   }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
