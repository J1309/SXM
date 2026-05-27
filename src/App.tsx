import { useState, useCallback } from 'react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [transitioning, setTransitioning] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
    // Show navbar after loader fades
    setTimeout(() => setNavVisible(true), 100);
  }, []);

  const handleNavigate = useCallback(
    (page: 'home' | 'about') => {
      if (page === currentPage) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        setTimeout(() => setTransitioning(false), 50);
      }, 400);
    },
    [currentPage]
  );

  return (
    <>
      <CustomCursor />

      {loading && <Loader onComplete={handleLoaderComplete} />}

      {!loading && (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            visible={navVisible}
          />

          <main className={`page-content ${transitioning ? 'transitioning' : ''}`}>
            {currentPage === 'home' ? (
              <HomePage onNavigate={handleNavigate} />
            ) : (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {/* Footer */}
            <footer className="site-footer">
              <p>© 2025 Stoxcom. All rights reserved.</p>
              <p className="footer-tagline">Learn the market. Master the chart. Trade with discipline.</p>
            </footer>
          </main>
        </>
      )}
    </>
  );
}
