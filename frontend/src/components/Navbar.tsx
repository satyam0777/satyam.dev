import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: `1px solid ${scrolled ? 'var(--border-bright)' : 'var(--border)'}`,
      background: scrolled ? 'rgba(var(--bg-raw, 10,10,10), 0.92)' : 'var(--bg-primary)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      transition: 'all 0.2s',
    }}>
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'var(--accent)', letterSpacing: '0.05em', fontWeight: 500 }}>
          SP.dev
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: isActive(l.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderBottom: isActive(l.to) ? '1px solid var(--accent)' : '1px solid transparent',
              paddingBottom: 2, transition: 'color 0.15s',
            }}>{l.label}</Link>
          ))}
          <button onClick={toggleTheme} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 6,
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 8px',
            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
          }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <Link to="/admin" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            padding: '6px 14px', background: 'var(--accent)', color: '#000',
            letterSpacing: '0.06em', fontWeight: 600, borderRadius: 4,
          }}>Admin</Link>
        </div>

        {/* Mobile */}
        <button onClick={() => setMenuOpen(m => !m)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} className="mobile-menu-btn">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)', padding: '1rem 2rem' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{ display: 'block', padding: '0.6rem 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-secondary)' }}>{l.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link to="/admin" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '6px 14px', background: 'var(--accent)', color: '#000', letterSpacing: '0.06em', fontWeight: 600, borderRadius: 4 }}>Admin</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none !important; }
        }

        /* Mobile menu styling */
        @media (max-width: 1024px) {
          nav {
            flex-wrap: wrap !important;
          }

          .mobile-menu-content {
            width: 100%;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .mobile-menu-content.open {
            max-height: 500px;
          }
        }

        /* Navbar padding responsive */
        @media (max-width: 640px) {
          nav {
            padding: 0 0.5rem !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          nav {
            padding: 0 1rem !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
