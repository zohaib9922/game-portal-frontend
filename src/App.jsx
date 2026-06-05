import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home     from './pages/Home';
import GamePage from './pages/GamePage';
import './index.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <span className="logo-dot" />
        GamePortal
      </Link>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Browse</Link>
        <a href="#" className="navbar__link">Top Rated</a>
        <a href="#" className="navbar__cta">+ Add Game</a>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Routes>
        </main>
        <footer className="footer">
          © 2026 <span>GamePortal</span> · Free browser games · No download required
        </footer>
      </div>
    </BrowserRouter>
  );
}