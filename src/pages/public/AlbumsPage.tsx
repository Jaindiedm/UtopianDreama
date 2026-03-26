import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight } from 'lucide-react'
import { useAlbums } from '../../hooks/useAlbums'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['All', 'Wedding', 'Pre-Wedding', 'Fashion', 'Artistic']

export default function AlbumsPage() {
    const { albums, loading: albumsLoading } = useAlbums()
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)
    const [activeCategory, setActiveCategory] = useState('All')

    const [singles, setSingles] = useState<{url: string, public_id: string, category: string}[]>([])
    const [singlesLoading, setSinglesLoading] = useState(true)
    const [lightboxImg, setLightboxImg] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setSinglesLoading(true)
        supabase.from('site_settings').select('value').eq('key', 'singles_portfolio').single().then(({ data }) => {
            if (data?.value) {
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

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '48px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '1400px',
                margin: '0 auto 48px',
                padding: '0 24px'
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

            {/* Gallery Layout */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 120px' }}>
                {loading ? (
                    <div className="bento-gallery">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bento-item" style={{
                                background: 'var(--charcoal)',
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        ))}
                    </div>
                ) : showSingles ? (
                    filteredSingles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
                            No single photos added for this category yet.
                        </div>
                    ) : (
                        <div style={{ columnCount: 3, columnGap: '16px' }} className="single-masonry">
                            {filteredSingles.map((photo, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setLightboxImg(photo.url)}
                                    style={{ position: 'relative', cursor: 'zoom-in', overflow: 'hidden', marginBottom: '16px', breakInside: 'avoid' }}
                                    className="single-hover-wrap"
                                >
                                    <img src={photo.url} className="single-hover-img" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s easeOut' }} loading="lazy" />
                                    <div className="single-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(14,12,10,0.2)', opacity: 0, transition: 'opacity 0.4s' }} />
                                </div>
                            ))}
                        </div>
                    )
                ) : filteredAlbums.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
                        No collections available in this category.
                    </div>
                ) : (
                    <div className="masonry-gallery" style={{ columnCount: 4, columnGap: '16px' }}>
                        {filteredAlbums.map(album => (
                            <MasonryAlbumCard 
                                key={album.id} 
                                album={album} 
                                onClick={() => navigate(`/albums/${album.slug}`)} 
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Lightbox for Singles */}
            {lightboxImg && (
                <div 
                    onClick={() => setLightboxImg(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(10,8,6,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
                        cursor: 'zoom-out', animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <img src={lightboxImg} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', animation: 'scaleUp 0.3s ease-out' }} />
                </div>
            )}

            <style>{`
                .single-hover-wrap:hover .single-hover-img { transform: scale(1.04); }
                .single-hover-wrap:hover .single-hover-overlay { opacity: 1; }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
                
                @media (max-width: 900px) {
                    .masonry-gallery { column-count: 2 !important; }
                    .single-masonry { column-count: 2 !important; }
                }
                @media (max-width: 600px) {
                    .masonry-gallery { column-count: 1 !important; }
                    .single-masonry { column-count: 1 !important; }
                }
            `}</style>
        </div>
    )
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'transparent',
                color: active || hovered ? 'var(--gold)' : 'var(--muted)',
                border: 'none',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                position: 'relative',
            }}
        >
            {label}
            <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: active ? '100%' : hovered ? '50%' : '0',
                height: '1px',
                background: 'var(--gold)',
                transition: 'width 0.3s ease',
                opacity: 0.5,
            }} />
        </button>
    )
}

function MasonryAlbumCard({ album, onClick }: { album: any; onClick: () => void }) {
    const [hovered, setHovered] = useState(false)

    return (
        <article 
            className="masonry-item"
            style={{ position: 'relative', breakInside: 'avoid', marginBottom: '16px', cursor: 'pointer', overflow: 'hidden' }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {album.cover_image_url && (
                <img 
                    src={album.cover_image_url} 
                    alt={album.title}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transform: hovered ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)'
                    }}
                />
            )}
            
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14,12,10,0.85) 0%, rgba(14,12,10,0.2) 50%, transparent 100%)',
                opacity: hovered ? 1 : 0.7,
                transition: 'opacity 0.4s',
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                <div style={{ 
                    fontSize: '0.6rem', 
                    letterSpacing: '0.25em', 
                    textTransform: 'uppercase', 
                    color: 'var(--gold)',
                    transform: hovered ? 'translateY(0)' : 'translateY(8px)',
                    opacity: hovered ? 1 : 0,
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)'
                }}>
                    {album.category} {album.event_date && `• ${new Date(album.event_date).getFullYear()}`}
                </div>
                
                <h2 style={{ 
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: 'var(--cream)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {album.title}
                    <ArrowUpRight 
                        size={20} 
                        style={{ 
                            color: 'var(--gold)', 
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translate(0, 0)' : 'translate(-10px, 10px)',
                            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' 
                        }} 
                    />
                </h2>
                
                {album.couple_names && album.couple_names.trim().toLowerCase() !== album.title.trim().toLowerCase() && (
                    <div style={{ 
                        fontSize: '0.9rem', 
                        fontStyle: 'italic', 
                        fontWeight: 600,
                        fontFamily: 'Cormorant Garamond, serif', 
                        color: 'white',
                        marginTop: '2px'
                    }}>
                        {album.couple_names}
                    </div>
                )}
            </div>
        </article>
    )
}

// file end
