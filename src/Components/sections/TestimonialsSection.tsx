import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Testimonial } from '../../types'
import { useReveal } from '../../hooks/useReveal'

const MOCK_TESTIMONIALS: Testimonial[] = [
    {
        id: 'mock-1',
        couple_names: 'Sarah & Mark',
        wedding_year: '2023',
        message: 'The most incredible experience we could have asked for. Every moment was captured with such grace and beauty. We will cherish these photos forever.',
        is_published: true,
        sort_order: 1,
    },
    {
        id: 'mock-2',
        couple_names: 'Emily & Jack',
        wedding_year: '2024',
        message: 'Working with you was a dream. You made us feel so comfortable and the results are simply breathtaking. Thank you for capturing our love so perfectly.',
        is_published: true,
        sort_order: 2,
    },
    {
        id: 'mock-3',
        couple_names: 'Nadia & Ruwan',
        wedding_year: '2024',
        message: 'The photos exceeded every expectation. There is a quietness, an intimacy to each shot that makes you feel like you are right there in the moment again. Truly extraordinary work.',
        is_published: true,
        sort_order: 3,
    },
]

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS)
    const [current, setCurrent] = useState(0)
    const { ref, visible } = useReveal()

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_published', true)
                .order('sort_order')
            
            if (data && data.length > 0) {
                setTestimonials(data)
            }
        }
        load()
    }, [])

    useEffect(() => {
        if (testimonials.length === 0) return
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [testimonials])

    if (testimonials.length === 0) return null

    return (
        <section
            id="testimonials"
            style={{ background: 'var(--charcoal)', padding: '80px 0' }}
        >
            <div
                ref={ref}
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 60px',
                    textAlign: 'center',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                {/* Label */}
                <div style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '16px',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    Client Stories
                </div>

                <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 300,
                    color: 'var(--cream)',
                    marginBottom: '60px',
                }}>
                    Words of <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Love</em>
                </h2>

                {/* Testimonial */}
                <div style={{ minHeight: '200px', position: 'relative' }}>
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            style={{
                                position: i === current ? 'relative' : 'absolute',
                                opacity: i === current ? 1 : 0,
                                transform: i === current ? 'translateY(0)' : 'translateY(10px)',
                                transition: 'all 0.6s ease',
                                top: 0, left: 0, right: 0,
                                pointerEvents: i === current ? 'auto' : 'none',
                            }}
                        >
                            <p style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                lineHeight: 1.7,
                                color: 'var(--cream)',
                                marginBottom: '32px',
                            }}>
                                <span style={{
                                    color: 'var(--gold)',
                                    fontSize: '3.5rem',
                                    lineHeight: 0,
                                    verticalAlign: '-1rem',
                                    marginRight: '8px',
                                    fontFamily: 'Georgia, serif',
                                }}>
                                    "
                                </span>
                                {t.message}
                            </p>
                            <div style={{
                                fontSize: '0.7rem',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: 'var(--gold)',
                            }}>
                                {t.couple_names}
                                {t.wedding_year && ` — ${t.wedding_year}`}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '40px',
                }}>
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            style={{
                                width: i === current ? '24px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                background: i === current ? 'var(--gold)' : 'var(--muted)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </div>
            </div>
            <style>{`
        @media (max-width: 768px) {
          #testimonials > div {
            padding: 0 24px !important;
          }
        }
      `}</style>
        </section>
    )
}