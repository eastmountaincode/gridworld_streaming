import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
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
import SplashScreen from './components/splash-screen/SplashScreen';
import { useAuth } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';

function App() {
  const { authIsLoading } = useAuth();
  const { contentIsLoading } = useContent();

  if (authIsLoading || contentIsLoading) {
    return <SplashScreen />;
  }

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
