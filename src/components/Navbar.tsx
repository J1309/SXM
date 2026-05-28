import { useState, useCallback } from 'react';

interface NavbarProps {
  currentPage: 'home' | 'about';
  onNavigate: (page: 'home' | 'about') => void;
  visible: boolean;
}

export default function Navbar({ currentPage, onNavigate, visible }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = useCallback(
    (page: 'home' | 'about') => {
      onNavigate(page);
      setMenuOpen(false);
    },
    [onNavigate]
  );

  return (
    <>
      <nav className={`navbar ${visible ? 'visible' : ''}`} id="main-nav">
        <div className="navbar-logo" onClick={() => handleNavigate('home')} role="button" tabIndex={0}>
          <img src="/STX-logo.png" alt="Stoxcom logo" />
          <span>Stoxcom</span>
        </div>

        <ul className="navbar-links">
          <li>
            <button
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => handleNavigate('home')}
              id="nav-home"
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'about' ? 'active' : ''}
              onClick={() => handleNavigate('about')}
              id="nav-about"
            >
              About
            </button>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="btn btn-outline btn-sm" id="nav-view-courses">View Courses</button>
          <button className="btn btn-primary btn-sm" id="nav-start-learning">Start Learning</button>
        </div>

        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => handleNavigate('home')}
        >
          Home
        </button>
        <button
          className={currentPage === 'about' ? 'active' : ''}
          onClick={() => handleNavigate('about')}
        >
          About
        </button>
        <div className="mobile-menu-actions">
          <button className="btn btn-outline btn-sm">View Courses</button>
          <button className="btn btn-primary btn-sm">Start Learning</button>
        </div>
      </div>
    </>
  );
}
