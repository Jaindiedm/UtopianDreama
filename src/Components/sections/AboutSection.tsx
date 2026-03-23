import { useSettings } from '../../hooks/useSettings'
import { useAlbums } from '../../hooks/useAlbums'
import { useReveal } from '../../hooks/useReveal'
import aboutImg from '../../assets/UTD_4657 copy 3.webp'

export default function AboutSection() {
    const { settings } = useSettings()
    const { albums } = useAlbums()
    const { ref, visible } = useReveal()


    return (
        <section
            id="about"
            style={{
                background: 'var(--charcoal)',
                padding: '120px 0',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 60px',
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: '100px',
                alignItems: 'center',
            }}>

                {/* Image */}
                <div
                    ref={ref}
                    style={{
                        position: 'relative',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                        right: '20px',
                        bottom: '20px',
                        border: '1px solid var(--border)',
                        zIndex: 0,
                    }} />
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        aspectRatio: '3/4',
                        background: 'var(--dark)',
                        overflow: 'hidden',
                    }}>
                        <img
                            src={aboutImg}
                            alt="About the Artist"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'saturate(0.8)',
                            }}
                        />
                    </div>

                    {/* Stat badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        right: '-30px',
                        background: 'var(--gold)',
                        color: 'var(--dark)',
                        padding: '24px 30px',
                        textAlign: 'center',
                        zIndex: 2,
                    }}>
                        <span style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '3rem',
                            fontWeight: 300,
                            lineHeight: 1,
                            display: 'block',
                        }}>
                            {albums.length > 0 ? albums.length + '+' : '100+'}
                        </span>
                        <span style={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            fontWeight: 400,
                            display: 'block',
                            marginTop: '4px',
                        }}>
                            Weddings Captured
                        </span>
                    </div>
                </div>

                {/* Text */}
                <div style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
                }}>
                    <div style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        fontWeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px',
                    }}>
                        <span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold)' }} />
                        About the Artist
                    </div>

                    <h2 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 300,
                        lineHeight: 1.1,
                        color: 'var(--cream)',
                        marginBottom: '28px',
                    }}>
                        An Artist.<br />
                        A <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Storyteller.</em>
                    </h2>

                    <p style={{
                        color: 'var(--muted)',
                        fontWeight: 300,
                        lineHeight: 1.9,
                        fontSize: '1.05rem',
                        marginBottom: '24px',
                    }}>
                        {settings.bio || 'I believe every wedding holds hundreds of intimate moments — a stolen glance, a trembling hand, a burst of laughter between tears.'}
                    </p>

                    <p style={{
                        color: 'var(--muted)',
                        fontWeight: 300,
                        lineHeight: 1.9,
                        fontSize: '1.05rem',
                        marginBottom: '24px',
                    }}>
                        Based in {settings.location || 'Sri Lanka'}, I travel across the country and beyond to document love in all its forms.
                    </p>

                    <div style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '2rem',
                        fontStyle: 'italic',
                        color: 'var(--gold)',
                        marginTop: '40px',
                    }}>
                        {settings.photographer_name || 'Your Name'}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #about > div {
            grid-template-columns: 1fr !important;
            padding: 0 24px !important;
            gap: 60px !important;
          }
        }
      `}</style>
        </section>
    )
}