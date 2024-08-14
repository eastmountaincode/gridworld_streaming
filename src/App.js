import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminPanel from './components/admin/AdminPanel';
import './App.css';

import DefaultHome from './DefaultHome';
import CreateAccount from './components/account/CreateAccount';

import Notification from './components/Notification';
import Login from './components/account/Login';
import MainNavbar from './components/navigation/MainNavbar';


function App() {
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


        </Routes>

      </div>
    </Router>
  );
}

export default App;
