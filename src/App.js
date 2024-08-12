import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminPanel from './admin/AdminPanel';
import './App.css';

import DefaultHome from './DefaultHome';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ backgroundColor: 'lightblue', padding: '10px' }}>
          <h1>Navbar</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<DefaultHome />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
