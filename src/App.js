import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';

import AdminPanel from './components/admin/AdminPanel';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DefaultHome from './components/DefaultHome';
import CreateAccount from './components/account/CreateAccount';

import Notification from './components/Notification';
import Login from './components/account/Login';
import MainNavbar from './components/navigation/MainNavbar';
import ForgotPassword from './components/account/ForgotPassword';
import AccountPage from './components/account/AccountPage';
import PaymentResult from './components/checkout/PaymentResult';

// import { AudioPlayerContext } from './context/AudioPlayerContext';


function App() {
  // const { play, pause, currentTrack, currentTracklist, activeAudioShelfId, albumArtworkUrl } = useContext(AudioPlayerContext);

  // useEffect(() => {
  //   if ('mediaSession' in navigator) {
  //     console.log('in App.js, mediaSession is in navigator');
  //     // Set up media session handlers here
  //     // navigator.mediaSession.setActionHandler('play', () => play(currentTrack, currentTracklist, activeAudioShelfId, albumArtworkUrl));
  //     // navigator.mediaSession.setActionHandler('pause', pause);
  //   } else {
  //     console.log('mediaSession is not in navigator');
  //   }
  // }, []);

  console.log('hello')

  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker.register('/audio-service-worker.js')
  //       .then(registration => {
  //         console.log('Audio Service Worker registered successfully:', registration.scope);
  //       })
  //       .catch(error => {
  //         console.error('Audio Service Worker registration failed:', error);
  //       });
  //   });
  // }


  return (
    <Router>
      <div className="App">
        <Notification />
        <MainNavbar />

        <Routes>
          <Route path="/" element={<DefaultHome />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />



        </Routes>

      </div>
    </Router>
  );
}

export default App;
