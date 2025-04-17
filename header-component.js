import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import './Header.css';
import Logo from '../../assets/images/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="trending">
              <span>Trending:</span>
              <div className="trending-links">
                <a href="/teams/india">India</a>
                <a href="/tournaments/ipl">IPL</a>
                <a href="/players/virat-kohli">Virat Kohli</a>
              </div>
            </div>
            <div className="top-actions">
              <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <div className="header-content">
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            
            <div className="logo">
              <Link to="/">
                <img src={Logo} alt="CricAnalyzer Logo" />
              </Link>
            </div>

            <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <ul>
                <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                <li><Link to="/news" className={location.pathname.includes('/news') ? 'active' : ''}>News</Link></li>
                <li><Link to="/matches" className={location.pathname.includes('/matches') ? 'active' : ''}>Matches</Link></li>
                <li><Link to="/teams" className={location.pathname.includes('/teams') ? 'active' : ''}>Teams</Link></li>
                <li><Link to="/players" className={location.pathname.includes('/players') ? 'active' : ''}>Players</Link></li>
                <li><Link to="/stats" className={location.pathname.includes('/stats') ? 'active' : ''}>Stats</Link></li>
                <li><Link to="/rankings" className={location.pathname.includes('/rankings') ? 'active' : ''}>Rankings</Link></li>
              </ul>
            </nav>

            <div className="header-actions">
              <button 
                className="search-toggle" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                {isSearchOpen ? <FiX /> : <FiSearch />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="search-container">
          <div className="container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for news, players, teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" aria-label="Search">
                <FiSearch />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
