import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../../hooks/useSettings'
import heroImg from '../../assets/UTD_9991 copy.webp'

export default function HeroSection() {
    const { settings } = useSettings()
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [scrollY, setScrollY] = useState(0)
    const [mounted, setMounted] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)

    // Parallax on mouse move
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20
            const y = (e.clientY / window.innerHeight - 0.5) * 20
            setMousePos({ x, y })
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    // Scroll parallax
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    const heroCover = heroImg

    return (
        <section
            ref={heroRef}
            style={{
                height: '100vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'var(--dark)',
            }}
        >
            {/* Background Image with Parallax */}
            {heroCover && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px) translateY(${scrollY * 0.4}px) scale(1.15)`,
                    transition: 'transform 0.1s ease-out',
                }}>
                    <img
                        src={heroCover}
                        alt="Hero"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.12,
                            filter: 'saturate(0.4)',
                        }}
                    />
                </div>
            )}

            {/* Subtle decorative gradient */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(179,139,77,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 3,
                textAlign: 'center',
                padding: '0 24px',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)',
            }}>
                {/* Eyebrow */}
                <div style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 300,
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}>
                    <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.6 }} />
                    Wedding & Portrait Photography
                    <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.6 }} />
                </div>

                {/* Title */}
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                    fontWeight: 300,
                    lineHeight: 0.9,
                    letterSpacing: '-0.02em',
                    color: '#1a1714',
                    marginBottom: '16px',
                }}>
                    Capturing{' '}
                    <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Love</em>
                    <br />
                    in Every Frame
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#7a7065',
                    marginBottom: '48px',
                    letterSpacing: '0.05em',
                }}>
                    {settings.hero_subtitle || 'Turning every moments into Utopian Dreams.'}
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <HeroButton href="#portfolio" primary>View Portfolio</HeroButton>
                    <HeroButton href="#contact" primary={false}>Book a Session</HeroButton>
                </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                opacity: mounted ? 1 : 0,
                transition: 'opacity 1s ease 1.2s',
            }}>
                <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#7a7065',
                }}>Scroll</span>
                <div style={{
                    width: '1px',
                    height: '50px',
                    background: 'linear-gradient(to bottom, var(--gold), transparent)',
                    animation: 'scrollPulse 2s ease-in-out infinite',
                }} />
            </div>

            <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1) translateY(8px); }
        }
      `}</style>
        </section>
    )
}

function HeroButton({ href, children, primary }: {
    href: string
    children: React.ReactNode
    primary: boolean
}) {
    const [hovered, setHovered] = useState(false)
    return (
        <a
            href={href}
            style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: '14px 36px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                fontFamily: 'Jost, sans-serif',
                ...(primary ? {
                    color: hovered ? 'var(--gold)' : '#fcfbf7',
                    background: hovered ? 'transparent' : 'var(--gold)',
                    border: '1px solid var(--gold)',
                } : {
                    color: hovered ? 'var(--gold)' : '#1a1714',
                    background: 'transparent',
                    border: `1px solid ${hovered ? 'var(--gold)' : 'rgba(26,23,20,0.3)'}`,
                }),
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </a>
    )
}

