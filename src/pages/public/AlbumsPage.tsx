import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAlbums } from '../../hooks/useAlbums'

export default function AlbumsPage() {
    const { albums, loading } = useAlbums()
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        window.scrollTo(0, 0)
    }, [])

    return (
        <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '80px' }}>
            <Helmet>
                <title>Collections | Utopian Dreama</title>
                <meta name="description" content="Explore our beautiful photography collections and albums." />
            </Helmet>

            {/* Hero Section */}
            <header style={{ 
                padding: '120px 24px', 
                textAlign: 'center',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 1s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <div style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                }}>
                    <span style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.6 }} />
                    Our Masterpieces
                    <span style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.6 }} />
                </div>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                    fontWeight: 300,
                    color: '#1a1714',
                    lineHeight: 1
                }}>
                    The <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Collections</em>
                </h1>
            </header>

            {/* Editorial Layout */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 120px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
                        Loading collections...
                    </div>
                ) : albums.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
                        No collections available yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                        {albums.map((album, index) => {
                            const isEven = index % 2 === 0
                            return (
                                <AlbumEditorialRow 
                                    key={album.id} 
                                    album={album} 
                                    isEven={isEven} 
                                    onClick={() => navigate(`/albums/${album.slug}`)} 
                                />
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

function AlbumEditorialRow({ album, isEven, onClick }: { album: any; isEven: boolean; onClick: () => void }) {
    const [hovered, setHovered] = useState(false)

    return (
        <article 
            style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center',
                gap: '8vw',
                // Responsive layout wrapper class
                flexWrap: 'wrap'
            }}
            className={isEven ? 'row-even' : 'row-odd'}
        >
            {/* Image Side */}
                <div 
                    style={{ 
                        flex: '1 1 500px', 
                        position: 'relative', 
                        overflow: 'hidden',
                        cursor: 'pointer',
                        order: isEven ? 1 : 2,
                    }}
                    className="img-container"
                    onClick={onClick}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {album.cover_image_url ? (
                        <img 
                            src={album.cover_image_url} 
                            alt={album.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '80vh',
                                objectFit: 'cover',
                                display: 'block',
                            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1), filter 0.8s',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                            filter: hovered ? 'saturate(1)' : 'saturate(0.8)'
                        }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--charcoal)' }} />
                )}
                
                {/* Image overlay gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(14,12,10,0.4), transparent 50%)',
                    opacity: hovered ? 0 : 1,
                    transition: 'opacity 0.8s',
                    pointerEvents: 'none'
                }} />
            </div>

            {/* Text Side */}
            <div 
                style={{ 
                    flex: '1 1 300px',
                    order: isEven ? 2 : 1,
                    padding: '24px 0'
                }}
                className="text-container"
            >
                <div style={{ 
                    fontSize: '0.65rem', 
                    letterSpacing: '0.3em', 
                    textTransform: 'uppercase', 
                    color: 'var(--muted)',
                    marginBottom: '16px'
                }}>
                    {album.category} {album.event_date && ` • ${new Date(album.event_date).getFullYear()}`}
                </div>
                
                <h2 style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: '#1a1714',
                    marginBottom: '24px'
                }}>
                    {album.title}
                </h2>
                
                {album.location && (
                    <div style={{ 
                        fontStyle: 'italic', 
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.4rem',
                        color: 'var(--gold)',
                        marginBottom: '32px'
                    }}>
                        {album.location}
                    </div>
                )}
                
                {album.description && (
                    <p style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.8,
                        color: 'var(--muted)',
                        fontWeight: 300,
                        marginBottom: '40px',
                        maxWidth: '400px'
                    }}>
                        {album.description.slice(0, 150)}{album.description.length > 150 ? '...' : ''}
                    </p>
                )}

                <button
                    onClick={onClick}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `1px solid ${hovered ? 'var(--gold)' : 'rgba(26,23,20,0.3)'}`,
                        color: hovered ? 'var(--gold)' : '#1a1714',
                        padding: '0 0 8px 0',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.75rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    Explore Gallery <span style={{ transition: 'transform 0.3s', transform: hovered ? 'translateX(5px)' : 'translateX(0)' }}>→</span>
                </button>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .row-even, .row-odd {
                        flex-direction: column !important;
                        gap: 40px !important;
                    }
                    .img-container { order: 1 !important; width: 100% !important; flex: none !important; }
                    .text-container { order: 2 !important; width: 100% !important; flex: none !important; padding: 0 5vw !important; text-align: center; display: flex; flex-direction: column; align-items: center; }
                }
            `}</style>
        </article>
    )
}
