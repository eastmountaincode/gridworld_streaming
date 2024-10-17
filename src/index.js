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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
