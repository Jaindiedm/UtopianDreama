import { Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{
      padding: '100px 60px 60px',
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '60px',
      }}>
        {/* Brand Column */}
        <div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.8rem',
            fontWeight: 300,
            letterSpacing: '0.15em',
            marginBottom: '30px',
          }}>
            Utopian <span style={{ color: 'var(--gold)' }}>Dreama</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '300px',
            marginBottom: '40px',
          }}>
            Capturing the ethereal moments and timeless stories that define your life's journey.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.instagram.com/utopiandreama?igsh=bml0dzY1dXhqNGFr" style={{ color: 'var(--gold)' }} className="hoverable"><Instagram size={20} /></a>
            <a href="https://www.facebook.com/share/17cFnZoRk6/" style={{ color: 'var(--gold)' }} className="hoverable"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Explore Column */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '30px',
            color: 'var(--gold)',
          }}>Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '15px' }}>
            {['About', 'Portfolio', 'Services', 'Stories'].map(item => (
              <li key={item}>
                <a href={`/#${item.toLowerCase()}`} style={{
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s',
                }} className="hoverable">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '30px',
            color: 'var(--gold)',
          }}>Contact</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '15px' }}>
            <li style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Utopiandreama@gmail.com</li>
            <li style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>0772113761</li>
            <li style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Gampaha, Sri Lanka</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        paddingTop: '40px',
        borderTop: '1px solid rgba(179, 139, 77, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', opacity: 0.8, letterSpacing: '0.1em' }}>
          © {currentYear} UTOPIAN DREAMA. ALL RIGHTS RESERVED.
        </p>

      </div>

      <style>{`
        footer a:hover { color: var(--gold) !important; }
        @media (max-width: 768px) {
          footer { padding: 80px 30px 40px !important; }
        }
      `}</style>
    </footer>
  )
}