import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { settings } = useSettings()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Services', href: '/#services' },
    { label: 'Stories', href: '/#testimonials' },
  ]

  const photographerName = settings.photographer_name || 'Your Name'
  const nameParts = photographerName.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ')
  const lastName = nameParts[nameParts.length - 1]

  return (
    <>
      <nav
        className={`nav-inner${scrolled ? ' nav-scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          background: scrolled ? 'rgba(252,251,247,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.4s ease',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.5rem',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: 'var(--cream)',
          textDecoration: 'none',
        }}>
          {firstName} <span style={{ color: 'var(--gold)' }}>{lastName}</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="desktop-links" style={{
          display: 'flex',
          gap: '40px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}>
          {navLinks.map(link => (
            <li key={link.label}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <BookButton />

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cream)',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
            className="hamburger"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--dark)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2.5rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--cream)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              border: '1px solid var(--border)',
              padding: '14px 36px',
              textDecoration: 'none',
              marginTop: '20px',
            }}
          >
            Book a Session
          </a>
        </div>
      )}

      <style>{`
        .nav-scrolled { padding-top: 16px !important; padding-bottom: 16px !important; }
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .hamburger { display: flex !important; }
          .book-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ── Small helper components to avoid inline handler errors ──

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      style={{
        textDecoration: 'none',
        color: hovered ? 'var(--gold)' : 'var(--muted)',
        fontSize: '0.72rem',
        fontWeight: 300,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        transition: 'color 0.3s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  )
}

function BookButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="/#contact"
      className="book-btn"
      style={{
        fontSize: '0.72rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: hovered ? 'var(--dark)' : 'var(--gold)',
        background: hovered ? 'var(--gold)' : 'transparent',
        border: '1px solid var(--border)',
        padding: '10px 24px',
        textDecoration: 'none',
        transition: 'all 0.3s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Book a Session
    </a>
  )
}