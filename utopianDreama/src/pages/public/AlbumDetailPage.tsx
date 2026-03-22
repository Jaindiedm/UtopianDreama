import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Calendar, Camera } from 'lucide-react'
import { useAlbum } from '../../hooks/useAlbums'
import type { Photo } from '../../types'

export default function AlbumDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { album, photos, loading } = useAlbum(slug || '')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return
    if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? Math.min(i + 1, photos.length - 1) : null)
    if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null)
    if (e.key === 'Escape') setLightboxIndex(null)
  }, [lightboxIndex, photos.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) return <LoadingState />
  if (!album) return <NotFoundState onBack={() => navigate('/')} />

  const formattedDate = album.event_date
    ? new Date(album.event_date).toLocaleDateString('en-GB', {
      month: 'long', year: 'numeric'
    })
    : null

  return (
    <>
      <Helmet>
        <title>{album.title} | Photography</title>
        <meta name="description" content={album.description || `${album.category} photography — ${album.couple_names}`} />
        <meta property="og:title" content={album.title} />
        <meta property="og:description" content={album.description || ''} />
        {album.cover_image_url && <meta property="og:image" content={album.cover_image_url} />}
      </Helmet>

      {/* Hero Banner */}
      <div style={{
        height: '70vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={album.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.8)',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1410, #2a1e14)',
          }} />
        )}

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(14,12,10,0.3) 0%, rgba(14,12,10,0.2) 40%, rgba(14,12,10,0.85) 100%)',
        }} />

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '100px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(14,12,10,0.6)',
            border: '1px solid var(--border)',
            color: 'var(--cream)',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Jost, sans-serif',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,169,110,0.2)'
              ; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,12,10,0.6)'
              ; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
          }}
        >
          <ArrowLeft size={14} />
          Back to Portfolio
        </button>

        {/* Album Info */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          right: '60px',
        }}>
          {/* Category */}
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--gold)' }} />
            {album.category}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 300,
            color: 'var(--cream)',
            lineHeight: 1,
            marginBottom: '20px',
          }}>
            {album.title}
          </h1>

          {/* Meta info row */}
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            {album.couple_names && (
              <MetaTag icon={<Camera size={13} />} text={album.couple_names} />
            )}
            {album.location && (
              <MetaTag icon={<MapPin size={13} />} text={album.location} />
            )}
            {formattedDate && (
              <MetaTag icon={<Calendar size={13} />} text={formattedDate} />
            )}
            <MetaTag icon={<Camera size={13} />} text={`${photos.length} Photos`} />
          </div>
        </div>
      </div>

      {/* Description */}
      {album.description && (
        <div style={{
          background: 'var(--charcoal)',
          padding: '48px 60px',
          borderBottom: '1px solid var(--border)',
        }}>
          <p style={{
            maxWidth: '700px',
            color: 'var(--muted)',
            lineHeight: 1.9,
            fontSize: '1.05rem',
            fontWeight: 300,
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
          }}>
            {album.description}
          </p>
        </div>
      )}

      {/* Photo Grid */}
      <div style={{
        background: 'var(--dark)',
        padding: '60px',
        minHeight: '400px',
      }}>
        {photos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            color: 'var(--muted)',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            fontStyle: 'italic',
          }}>
            No photos in this album yet.
          </div>
        ) : (
          <div style={{
            columns: 3,
            columnGap: '6px',
          }}>
            {photos.map((photo, index) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                index={index}
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null)}
          onNext={() => setLightboxIndex(i => i !== null ? Math.min(i + 1, photos.length - 1) : null)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .album-hero-back { top: 80px !important; left: 24px !important; }
          .album-hero-info { left: 24px !important; right: 24px !important; bottom: 32px !important; }
          .album-description { padding: 32px 24px !important; }
          .album-grid { padding: 32px 16px !important; columns: 2 !important; }
        }
        @media (max-width: 480px) {
          .album-grid { columns: 1 !important; }
        }
      `}</style>
    </>
  )
}

// ── Photo Item ──
function PhotoItem({ photo, index, onClick }: {
  photo: Photo
  index: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: '6px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: 'var(--charcoal)',
        opacity: loaded ? 1 : 0.5,
        transition: 'opacity 0.3s',
      }}
    >
      <img
        src={photo.url}
        alt={photo.caption || `Photo ${index + 1}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          display: 'block',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          filter: hovered ? 'saturate(1)' : 'saturate(0.8)',
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s',
        }}
      />

      {/* Hover overlay */}
      {hovered && photo.caption && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '32px 16px 16px',
          background: 'linear-gradient(to top, rgba(14,12,10,0.85), transparent)',
        }}>
          <p style={{
            color: 'var(--cream)',
            fontSize: '0.8rem',
            fontStyle: 'italic',
            fontFamily: 'Cormorant Garamond, serif',
          }}>
            {photo.caption}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Lightbox ──
function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }: {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const photo = photos[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === photos.length - 1

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,8,6,0.96)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          padding: '8px',
          transition: 'color 0.3s',
          zIndex: 1,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        top: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        color: 'var(--muted)',
      }}>
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev button */}
      {!isFirst && (
        <LightboxNavButton
          direction="prev"
          onClick={e => { e.stopPropagation(); onPrev() }}
        />
      )}

      {/* Image */}
      <img
        src={photo.url}
        alt={photo.caption || ''}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '88vh',
          objectFit: 'contain',
          animation: 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Next button */}
      {!isLast && (
        <LightboxNavButton
          direction="next"
          onClick={e => { e.stopPropagation(); onNext() }}
        />
      )}

      {/* Caption */}
      {photo.caption && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.8rem',
          fontStyle: 'italic',
          fontFamily: 'Cormorant Garamond, serif',
          color: 'var(--muted)',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}>
          {photo.caption}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// ── Lightbox Nav Button ──
function LightboxNavButton({ direction, onClick }: {
  direction: 'prev' | 'next'
  onClick: (e: React.MouseEvent) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'prev' ? 'left' : 'right']: '24px',
        background: hovered ? 'rgba(201,169,110,0.2)' : 'rgba(201,169,110,0.08)',
        border: '1px solid var(--border)',
        color: 'var(--gold)',
        width: '52px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s',
      }}
    >
      {direction === 'prev' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  )
}

// ── Meta Tag ──
function MetaTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: 'rgba(245,240,232,0.7)',
      fontSize: '0.8rem',
      letterSpacing: '0.05em',
    }}>
      <span style={{ color: 'var(--gold)' }}>{icon}</span>
      {text}
    </div>
  )
}

// ── Loading State ──
function LoadingState() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div style={{
        height: '70vh',
        background: 'var(--charcoal)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <div style={{
        background: 'var(--dark)',
        padding: '60px',
        columns: 3,
        columnGap: '6px',
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} style={{
            breakInside: 'avoid',
            marginBottom: '6px',
            height: `${150 + (i % 3) * 80}px`,
            background: 'var(--charcoal)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

// ── Not Found State ──
function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      paddingTop: '80px',
    }}>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '5rem',
        fontWeight: 300,
        color: 'var(--border)',
        lineHeight: 1,
      }}>
        404
      </div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: 'var(--muted)',
      }}>
        Album not found
      </div>
      <button
        onClick={onBack}
        style={{
          background: 'var(--gold)',
          color: 'var(--dark)',
          border: 'none',
          padding: '12px 32px',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'Jost, sans-serif',
          marginTop: '8px',
        }}
      >
        Back to Portfolio
      </button>
    </div>
  )
}