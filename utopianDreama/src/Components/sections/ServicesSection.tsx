import { useState, useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'

const SERVICES = [
    {
        num: '01',
        name: 'Wedding Photography',
        desc: 'Full-day coverage of your ceremony and reception. Every laugh, every tear, every stolen glance — documented with intention and artistry.',
    },
    {
        num: '02',
        name: 'Pre-Wedding Shoots',
        desc: 'Intimate sessions for couples before the big day. We explore locations, light, and the quiet magic between two people in love.',
    },
    {
        num: '03',
        name: 'Fashion & Editorial',
        desc: 'High-concept fashion photography for brands, designers, and creatives seeking a distinctive visual identity.',
    },
]

export default function ServicesSection() {
    const { ref, visible } = useReveal()

    return (
        <section id="services" style={{ background: 'var(--dark)', padding: '80px 0' }}>
            <div
                ref={ref}
                style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 60px' }}
            >
                <div style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    <div style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px',
                    }}>
                        <span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold)' }} />
                        What I Offer
                    </div>
                    <h2 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 300,
                        color: 'var(--cream)',
                    }}>
                        Photography <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Services</em>
                    </h2>
                </div>

                {/* Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    marginTop: '60px',
                    border: '1px solid var(--border)',
                }}>
                    {SERVICES.map((s, i) => (
                        <ServiceCard
                            key={s.num}
                            service={s}
                            delay={i * 0.1}
                            visible={visible}
                        />
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #services > div {
            padding: 0 24px !important;
          }
          #services .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    )
}

function ServiceCard({ service, delay, visible }: {
    service: { num: string; name: string; desc: string }
    delay: number
    visible: boolean
}) {
    const [hovered, setHovered] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const onMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={onMouseMove}
            style={{
                padding: '50px 40px',
                borderRight: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
                background: hovered ? 'rgba(201,169,110,0.04)' : 'transparent',
                transition: 'background 0.4s',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}s`,
                transitionDuration: '0.8s',
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
            }}
        >
            {/* Spotlight effect */}
            {hovered && (
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
                    left: mousePos.x - 150,
                    top: mousePos.y - 150,
                    pointerEvents: 'none',
                    transition: 'left 0.05s, top 0.05s',
                }} />
            )}

            <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3.5rem',
                fontWeight: 300,
                color: hovered ? 'rgba(201,169,110,0.3)' : 'var(--border)',
                lineHeight: 1,
                marginBottom: '24px',
                transition: 'color 0.4s',
            }}>
                {service.num}
            </div>
            <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: 'var(--cream)',
                marginBottom: '16px',
            }}>
                {service.name}
            </div>
            <p style={{
                fontSize: '0.85rem',
                lineHeight: 1.8,
                color: 'var(--muted)',
                fontWeight: 300,
            }}>
                {service.desc}
            </p>
        </div>
    )
}