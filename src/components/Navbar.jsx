import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="#0066FF"/>
              <rect x="13" y="2" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
              <rect x="2" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
              <rect x="13" y="13" width="9" height="9" rx="2" fill="#0066FF"/>
            </svg>
          </span>
          <span className="navbar__logo-text">Tinku Krishna AR</span>
        </Link>

        {/* Desktop nav */}
        <ul className="navbar__links">
          {navLinks.map(({ label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hire Me CTA */}
        <div className="navbar__actions">
          <Link to="/contact" className="btn btn-primary navbar__hire">
            Hire Me
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__mobile-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Hire Me
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
