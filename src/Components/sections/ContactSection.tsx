import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import { useReveal } from '../../hooks/useReveal'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactSection() {
    const { settings } = useSettings()
    const { ref, visible } = useReveal()
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '',
        phone: '', service: '', event_date: '', message: '',
    })
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

    const handleSubmit = async () => {
        if (!form.first_name || !form.email || !form.message) {
            alert('Please fill in your name, email and message')
            return
        }
        setStatus('sending')
        const { error } = await supabase.from('enquiries').insert(form)
        if (error) {
            setStatus('error')
        } else {
            setStatus('success')
            setForm({
                first_name: '', last_name: '', email: '',
                phone: '', service: '', event_date: '', message: '',
            })
        }
    }

    return (
        <section id="contact" style={{ background: 'var(--charcoal)', padding: '80px 0' }}>
            <div
                ref={ref}
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 60px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '100px',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                {/* Info */}
                <div>
                    <div style={{
                        fontSize: '0.65rem', letterSpacing: '0.4em',
                        textTransform: 'uppercase', color: 'var(--gold)',
                        display: 'flex', alignItems: 'center',
                        gap: '16px', marginBottom: '20px',
                    }}>
                        <span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold)' }} />
                        Get in Touch
                    </div>
                    <h2 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 300, color: 'var(--cream)', marginBottom: '24px',
                    }}>
                        Let's Create <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Together</em>
                    </h2>
                    <p style={{
                        color: 'var(--muted)', lineHeight: 1.8,
                        marginBottom: '48px', fontWeight: 300,
                    }}>
                        I'd love to hear about your upcoming wedding or project. Reach out and let's start crafting your story.
                    </p>

                    {/* Contact details */}
                    {[
                        { icon: <Mail size={14} />, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                        { icon: <Phone size={14} />, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
                        { icon: <MapPin size={14} />, label: 'Location', value: settings.location, href: undefined },
                    ].map(item => item.value && (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'flex-start',
                            gap: '16px', marginBottom: '24px',
                        }}>
                            <div style={{
                                width: '36px', height: '36px',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, color: 'var(--gold)',
                            }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '0.6rem', letterSpacing: '0.25em',
                                    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2px',
                                }}>
                                    {item.label}
                                </div>
                                {item.href ? (
                                    <a href={item.href} style={{
                                        color: 'var(--cream)', textDecoration: 'none',
                                        fontSize: '0.95rem', transition: 'color 0.3s',
                                    }}>
                                        {item.value}
                                    </a>
                                ) : (
                                    <span style={{ color: 'var(--cream)', fontSize: '0.95rem' }}>
                                        {item.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div>
                    {status === 'success' ? (
                        <div style={{
                            textAlign: 'center', padding: '80px 40px',
                            border: '1px solid var(--border)',
                        }}>
                            <div style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '2rem', fontStyle: 'italic',
                                color: 'var(--gold)', marginBottom: '16px',
                            }}>
                                Thank you!
                            </div>
                            <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
                                Your message has been received. I'll get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                style={{
                                    marginTop: '24px', background: 'transparent',
                                    border: '1px solid var(--border)', color: 'var(--muted)',
                                    padding: '10px 24px', cursor: 'pointer',
                                    fontSize: '0.7rem', letterSpacing: '0.2em',
                                    textTransform: 'uppercase', fontFamily: 'Jost, sans-serif',
                                }}
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <FormField
                                    label="First Name"
                                    value={form.first_name}
                                    onChange={v => setForm(f => ({ ...f, first_name: v }))}
                                    placeholder="Your first name"
                                />
                                <FormField
                                    label="Last Name"
                                    value={form.last_name}
                                    onChange={v => setForm(f => ({ ...f, last_name: v }))}
                                    placeholder="Your last name"
                                />
                            </div>
                            <FormField
                                label="Email"
                                value={form.email}
                                onChange={v => setForm(f => ({ ...f, email: v }))}
                                placeholder="your@email.com"
                                type="email"
                            />
                            <FormField
                                label="Phone"
                                value={form.phone}
                                onChange={v => setForm(f => ({ ...f, phone: v }))}
                                placeholder="+94 77 123 4567"
                            />
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block', fontSize: '0.62rem',
                                    letterSpacing: '0.25em', textTransform: 'uppercase',
                                    color: 'var(--muted)', marginBottom: '8px',
                                }}>
                                    Service
                                </label>
                                <select
                                    value={form.service}
                                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                                    style={{
                                        width: '100%', background: 'transparent',
                                        border: 'none', borderBottom: '1px solid rgba(138,127,114,0.3)',
                                        padding: '12px 0', color: 'var(--cream)',
                                        fontFamily: 'Jost, sans-serif', fontSize: '0.95rem',
                                        outline: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <option value="" style={{ background: 'var(--charcoal)' }}>Select a service</option>
                                    <option value="Wedding Photography" style={{ background: 'var(--charcoal)' }}>Wedding Photography</option>
                                    <option value="Pre-Wedding Shoot" style={{ background: 'var(--charcoal)' }}>Pre-Wedding Shoot</option>
                                    <option value="Fashion & Editorial" style={{ background: 'var(--charcoal)' }}>Fashion & Editorial</option>
                                    <option value="Other" style={{ background: 'var(--charcoal)' }}>Other</option>
                                </select>
                            </div>
                            <FormField
                                label="Event Date"
                                value={form.event_date}
                                onChange={v => setForm(f => ({ ...f, event_date: v }))}
                                placeholder="Month, Year"
                            />
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block', fontSize: '0.62rem',
                                    letterSpacing: '0.25em', textTransform: 'uppercase',
                                    color: 'var(--muted)', marginBottom: '8px',
                                }}>
                                    Message
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    placeholder="Tell me about your wedding or project..."
                                    rows={4}
                                    style={{
                                        width: '100%', background: 'transparent',
                                        border: 'none', borderBottom: '1px solid rgba(138,127,114,0.3)',
                                        padding: '12px 0', color: 'var(--cream)',
                                        fontFamily: 'Jost, sans-serif', fontSize: '0.95rem',
                                        outline: 'none', resize: 'none',
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={status === 'sending'}
                                style={{
                                    width: '100%', background: 'var(--gold)',
                                    color: 'var(--dark)', border: 'none',
                                    padding: '16px', fontFamily: 'Jost, sans-serif',
                                    fontSize: '0.7rem', letterSpacing: '0.25em',
                                    textTransform: 'uppercase', cursor: 'pointer',
                                    opacity: status === 'sending' ? 0.7 : 1,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'error' && (
                                <p style={{ color: '#e07070', fontSize: '0.8rem', marginTop: '12px', textAlign: 'center' }}>
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #contact > div {
            grid-template-columns: 1fr !important;
            padding: 0 24px !important;
            gap: 60px !important;
          }
        }
      `}</style>
        </section>
    )
}

function FormField({ label, value, onChange, placeholder, type = 'text' }: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder: string
    type?: string
}) {
    const [focused, setFocused] = useState(false)
    return (
        <div style={{ marginBottom: '24px' }}>
            <label style={{
                display: 'block', fontSize: '0.62rem',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: '8px',
            }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%', background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${focused ? 'var(--gold)' : 'rgba(138,127,114,0.3)'}`,
                    padding: '12px 0', color: 'var(--cream)',
                    fontFamily: 'Jost, sans-serif', fontSize: '0.95rem',
                    outline: 'none', transition: 'border-color 0.3s',
                }}
            />
        </div>
    )
}