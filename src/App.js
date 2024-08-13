import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminPanel from './admin/AdminPanel';
import './App.css';

import DefaultHome from './DefaultHome';
import CreateAccount from './account/CreateAccount';

import { NotificationProvider } from './context/NotificationContext';
import Notification from './Notification';


function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Notification/>
          <nav style={{ backgroundColor: 'lightblue', padding: '10px', textAlign: 'left' }}>
            <h1>Navbar</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
              <li>
                <Link to="/create-account">Create Account</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<DefaultHome />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/create-account" element={<CreateAccount />} />

          </Routes>

        </div>
      </Router>
    </NotificationProvider >
  );
}

export default App;
