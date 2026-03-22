import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Card */}
        <div style={{
          background: 'var(--charcoal)',
          border: '1px solid var(--border)',
          padding: '56px 48px',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              border: '1px solid var(--border)',
              marginBottom: '20px',
              color: 'var(--gold)',
            }}>
              <Lock size={20} />
            </div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.8rem',
              fontWeight: 300,
              letterSpacing: '0.15em',
              color: 'var(--cream)',
              marginBottom: '4px',
            }}>
              Admin <span style={{ color: 'var(--gold)' }}>Panel</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              Photography Dashboard
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'var(--border)',
            marginBottom: '36px',
          }} />

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '10px',
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted)',
                pointerEvents: 'none',
              }}>
                <Mail size={15} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin@yoursite.com"
                style={{
                  width: '100%',
                  background: 'var(--dark)',
                  border: '1px solid var(--border)',
                  padding: '13px 14px 13px 42px',
                  color: 'var(--cream)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '10px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted)',
                pointerEvents: 'none',
              }}>
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  background: 'var(--dark)',
                  border: '1px solid var(--border)',
                  padding: '13px 44px 13px 42px',
                  color: 'var(--cream)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(224,112,112,0.1)',
              border: '1px solid rgba(224,112,112,0.3)',
              color: '#e07070',
              padding: '12px 16px',
              fontSize: '0.8rem',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <LoginButton
            loading={loading}
            onClick={handleLogin}
          />

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'var(--border)',
            margin: '32px 0 24px',
          }} />

          {/* Back to site link */}
          <div style={{ textAlign: 'center' }}>
            <a
              href="/"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              ← Back to Website
            </a>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.65rem',
          color: 'var(--muted)',
          letterSpacing: '0.1em',
        }}>
          Protected area — authorized personnel only
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Login Button ──
function LoginButton({ loading, onClick }: {
  loading: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        background: loading
          ? 'rgba(201,169,110,0.5)'
          : hovered ? 'rgba(201,169,110,0.85)' : 'var(--gold)',
        color: 'var(--dark)',
        border: 'none',
        padding: '15px',
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.72rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(14,12,10,0.3)',
            borderTopColor: 'var(--dark)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Signing In...
        </>
      ) : (
        'Sign In to Dashboard'
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}