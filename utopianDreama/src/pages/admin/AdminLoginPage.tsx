import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { LogIn, User, Lock, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--dark)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: '#fff',
        padding: '60px 50px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.5rem',
            fontWeight: 300,
            marginBottom: '10px',
          }}>
            Admin <span style={{ color: 'var(--gold)' }}>Portal</span>
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Utopian Dreama Portfolio
          </p>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            background: 'rgba(255, 0, 0, 0.05)',
            border: '1px solid rgba(255, 0, 0, 0.1)',
            borderRadius: '4px',
            color: '#cc0000',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px',
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '25px' }}>
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={iconStyle} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '18px',
              background: loading ? 'var(--muted)' : 'var(--cream)',
              color: '#fff',
              border: 'none',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s',
            }}
            className="hoverable"
          >
            {loading ? 'Authenticating...' : (
              <>
                Access Dashboard <LogIn size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/" style={{
            color: 'var(--gold)',
            fontSize: '0.8rem',
            textDecoration: 'none',
            letterSpacing: '0.1em',
          }}>
            ← Return to Website
          </a>
        </div>
      </div>

      <style>{`
        .hoverable:hover { transform: translateY(-2px); opacity: 0.9; }
        ::placeholder { color: #ccc; opacity: 1; }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px 15px 15px 45px',
  border: '1px solid #e8e4dc',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s',
}

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#a89f94',
}
