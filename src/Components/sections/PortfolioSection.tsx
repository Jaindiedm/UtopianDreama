import { useState, useEffect } from 'react'
import { useAlbums } from '../../hooks/useAlbums'
import { useNavigate } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { supabase } from '../../lib/supabase'
import type { Album } from '../../types'

const CATEGORIES = ['All', 'Wedding', 'Pre-Wedding', 'Fashion', 'Artistic']

export default function PortfolioSection() {
  const { albums, loading: albumsLoading } = useAlbums()
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref, visible } = useReveal()
  const navigate = useNavigate()

  const [singles, setSingles] = useState<{url: string, public_id: string, category: string}[]>([])
  const [singlesLoading, setSinglesLoading] = useState(true)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  useEffect(() => {
    setSinglesLoading(true)
    supabase.from('site_settings').select('value').eq('key', 'singles_portfolio').single().then(({ data }) => {
      if (data && data.value) {
        try { setSingles(JSON.parse(data.value)) } catch (e) {}
      }
      setSinglesLoading(false)
    })
  }, [])

  const filteredAlbums = activeCategory === 'All'
    ? albums
    : albums.filter(a => a.category === activeCategory)

  const showSingles = activeCategory === 'Fashion' || activeCategory === 'Artistic'
  const filteredSingles = singles.filter(s => s.category === activeCategory)
  const loading = albumsLoading || singlesLoading

  return (
    <section id="portfolio" style={{ background: 'var(--dark)', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 60px' }}>

        {/* Header */}
        <div
          ref={ref}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px',
            }}>
              <span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold)' }} />
              Recent Work
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              color: 'var(--cream)',
            }}>
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Albums</em>
            </h2>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '48px',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(cat => (
            <FilterButton
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Album Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '3px',
          }} className="album-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{
                aspectRatio: '1/1',
                background: 'var(--charcoal)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : showSingles ? (
          filteredSingles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px',
              color: 'var(--muted)',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem',
              fontStyle: 'italic',
            }}>
              No single photos added for this category yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {filteredSingles.map((photo, i) => (
                <div 
                  key={i} 
                  onClick={() => setLightboxImg(photo.url)} 
                  className="single-hover-wrap"
                  style={{ position: 'relative', aspectRatio: '3/4', cursor: 'zoom-in', overflow: 'hidden' }}
                >
                  <img src={photo.url} className="single-hover-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s easeOut' }} loading="lazy" />
                  <div className="single-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(14,12,10,0.2)', opacity: 0, transition: 'opacity 0.4s' }} />
                </div>
              ))}
            </div>
          )
        ) : filteredAlbums.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px',
            color: 'var(--muted)',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            fontStyle: 'italic',
          }}>
            No albums in this category yet.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '3px',
          }} className="album-grid">
            {filteredAlbums.slice(0, 4).map(album => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => navigate(`/albums/${album.slug}`)}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <button
            onClick={() => navigate('/albums')}
            style={{
              padding: '16px 40px',
              background: 'transparent',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = '#1a1714';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--gold)';
            }}
          >
            View All Collections
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .single-hover-wrap:hover .single-hover-img { transform: scale(1.04); }
        .single-hover-wrap:hover .single-hover-overlay { opacity: 1; }
        @media (max-width: 768px) {
          #portfolio > div {
            padding: 0 24px !important;
          }
          #portfolio .album-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #portfolio .album-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Lightbox for Singles */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(10,8,6,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <img src={lightboxImg} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', animation: 'scaleUp 0.3s ease-out' }} />
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
          `}</style>
        </div>
      )}
    </section>
  )
}

function AlbumCard({ album, onClick }: {
  album: Album
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '1/1',
      }}
    >
      {album.cover_image_url ? (
        <img
          src={album.cover_image_url}
          alt={album.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            filter: hovered ? 'saturate(0.9)' : 'saturate(0.7)',
            transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: '300px',
          background: 'linear-gradient(135deg, #1a1410, #2a1e14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
        }}>
          No Cover
        </div>
      )}

      {/* Hover Info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '60px 28px 28px',
        background: 'linear-gradient(to top, rgba(14,12,10,0.92), transparent)',
        transform: hovered ? 'translateY(0)' : 'translateY(20px)',
        opacity: hovered ? 1 : 0,
        transition: 'transform 0.5s, opacity 0.5s',
      }}>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '6px',
        }}>
          {album.category}
        </div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.5rem',
          fontWeight: 300,
          color: 'var(--cream)',
        }}>
          {album.title}
        </div>
        {album.location && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--muted)',
            marginTop: '4px',
          }}>
            {album.location}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterButton({ label, active, onClick }: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active ? 'var(--gold)' : 'transparent',
        color: active ? 'var(--dark)' : (hovered ? 'var(--gold)' : 'var(--muted)'),
        border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
        padding: '8px 20px',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'Jost, sans-serif',
      }}
    >
      {label}
    </button>
  )
}