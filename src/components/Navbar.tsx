interface NavbarProps {
  currentPage: 'home' | 'about';
  onNavigate: (page: 'home' | 'about') => void;
  visible: boolean;
}

export default function Navbar({ currentPage, onNavigate, visible }: NavbarProps) {
  return (
    <nav className={`navbar ${visible ? 'visible' : ''}`} id="main-nav">
      <div className="navbar-logo" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
        <img src="/STX-logo.png" alt="Stoxcom logo" />
        <span>Stoxcom</span>
      </div>

      <ul className="navbar-links">
        <li>
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => onNavigate('home')}
            id="nav-home"
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={currentPage === 'about' ? 'active' : ''}
            onClick={() => onNavigate('about')}
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
    </nav>
  );
}
