import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/cloudinary'
import type { Album, Photo, Testimonial } from '../../types'
import {
  LayoutDashboard, Images, MessageSquare, Settings,
  LogOut, Plus, Edit, Trash2, Eye, EyeOff, Upload,
  X, Check, ChevronRight, Camera, BarChart3, Mail
} from 'lucide-react'

// ══════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════
type Panel = 'dashboard' | 'albums' | 'testimonials' | 'enquiries' | 'settings' | 'photostrip'

interface Enquiry {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  service?: string
  event_date?: string
  message?: string
  is_read: boolean
  created_at: string
}

// ══════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════
export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState<Panel>('dashboard')
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAdminEmail(data.session?.user?.email || '')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const navItems = [
    { id: 'dashboard' as Panel, label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'albums' as Panel, label: 'Albums', icon: <Images size={17} /> },
    { id: 'testimonials' as Panel, label: 'Testimonials', icon: <MessageSquare size={17} /> },
    { id: 'enquiries' as Panel, label: 'Enquiries', icon: <Mail size={17} /> },
    { id: 'settings' as Panel, label: 'Site Settings', icon: <Settings size={17} /> },
    { id: 'photostrip' as Panel, label: 'Photo Strip', icon: <Images size={17} /> },
  ]

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--dark)',
      overflow: 'hidden',
    }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--charcoal)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 24px 28px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.2rem',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'var(--cream)',
          }}>
            Admin <span style={{ color: 'var(--gold)' }}>Panel</span>
          </div>
          <div style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginTop: '4px',
          }}>
            Photography Dashboard
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={activePanel === item.id}
              onClick={() => setActivePanel(item.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--muted)',
            marginBottom: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {adminEmail}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              padding: '8px 16px',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#e07070'
              e.currentTarget.style.color = '#e07070'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Topbar */}
        <div style={{
          padding: '20px 40px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--charcoal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.6rem',
            fontWeight: 300,
            color: 'var(--cream)',
          }}>
            {navItems.find(n => n.id === activePanel)?.label}
          </h1>
          <a
            href="/"
            target="_blank"
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            View Site <ChevronRight size={13} />
          </a>
        </div>

        {/* Panel Content */}
        <div style={{ padding: '40px', flex: 1 }}>
          {activePanel === 'dashboard' && <DashboardPanel />}
          {activePanel === 'albums' && <AlbumsPanel />}
          {activePanel === 'testimonials' && <TestimonialsPanel />}
          {activePanel === 'enquiries' && <EnquiriesPanel />}
          {activePanel === 'settings' && <SettingsPanel />}
          {activePanel === 'photostrip' && <PhotoStripPanel />}
        </div>
      </main>
    </div>
  )
}

// ══════════════════════════════════════════
// SIDEBAR ITEM
// ══════════════════════════════════════════
function SidebarItem({ label, icon, active, onClick }: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        fontSize: '0.82rem',
        fontWeight: 300,
        letterSpacing: '0.04em',
        color: active ? 'var(--gold)' : hovered ? 'var(--cream)' : 'var(--muted)',
        cursor: 'pointer',
        borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
        background: active ? 'rgba(201,169,110,0.06)' : hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        transition: 'all 0.2s',
        userSelect: 'none',
      }}
    >
      {icon} {label}
    </div>
  )
}

// ══════════════════════════════════════════
// DASHBOARD PANEL
// ══════════════════════════════════════════
function DashboardPanel() {
  const [stats, setStats] = useState({
    albums: 0, published: 0, photos: 0,
    testimonials: 0, enquiries: 0, unread: 0,
  })
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([])

  useEffect(() => {
    async function load() {
      const [
        { count: albums },
        { count: published },
        { count: photos },
        { count: testimonials },
        { count: enquiries },
        { count: unread },
        { data: recent },
      ] = await Promise.all([
        supabase.from('albums').select('*', { count: 'exact', head: true }),
        supabase.from('albums').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('photos').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('albums').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        albums: albums || 0,
        published: published || 0,
        photos: photos || 0,
        testimonials: testimonials || 0,
        enquiries: enquiries || 0,
        unread: unread || 0,
      })
      setRecentAlbums(recent || [])
    }
    load()
  }, [])

  return (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '40px',
      }}>
        {[
          { label: 'Total Albums', value: stats.albums, icon: <Images size={18} /> },
          { label: 'Published', value: stats.published, icon: <Eye size={18} /> },
          { label: 'Total Photos', value: stats.photos, icon: <Camera size={18} /> },
          { label: 'Testimonials', value: stats.testimonials, icon: <MessageSquare size={18} /> },
          { label: 'Enquiries', value: stats.enquiries, icon: <Mail size={18} /> },
          { label: 'Unread', value: stats.unread, icon: <BarChart3 size={18} />, highlight: stats.unread > 0 },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--charcoal)',
            border: `1px solid ${stat.highlight ? 'rgba(201,169,110,0.4)' : 'var(--border)'}`,
            padding: '24px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <div style={{ color: 'var(--muted)' }}>{stat.icon}</div>
              {stat.highlight && (
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                }} />
              )}
            </div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.8rem',
              fontWeight: 300,
              color: stat.highlight ? 'var(--gold)' : 'var(--cream)',
              lineHeight: 1,
              marginBottom: '6px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Albums */}
      <div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.3rem',
          fontWeight: 300,
          color: 'var(--cream)',
          marginBottom: '20px',
        }}>
          Recent Albums
        </h3>
        {recentAlbums.length === 0 ? (
          <EmptyState message="No albums yet. Create your first album!" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title', 'Category', 'Status', 'Created'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left',
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAlbums.map(album => (
                <tr key={album.id}>
                  <td style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: 400, borderBottom: '1px solid rgba(201,169,110,0.06)' }}>{album.title}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--muted)', borderBottom: '1px solid rgba(201,169,110,0.06)' }}>{album.category}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      background: album.is_published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                      color: album.is_published ? '#4CAF50' : '#9e9e9e'
                    }}>
                      {album.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--muted)', borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
                    {new Date(album.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      border: '1px dashed var(--border)',
      background: 'rgba(255,255,255,0.02)',
      color: 'var(--muted)',
      fontSize: '0.9rem',
    }}>
      {message}
    </div>
  )
}

// ══════════════════════════════════════════
// ALBUMS PANEL
// ══════════════════════════════════════════
function AlbumsPanel() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [showPhotos, setShowPhotos] = useState<Album | null>(null)

  const loadAlbums = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false })
    setAlbums(data || [])
    setLoading(false)
  }

  useEffect(() => { loadAlbums() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will also delete all photos.`)) return
    await supabase.from('photos').delete().eq('album_id', id)
    await supabase.from('albums').delete().eq('id', id)
    loadAlbums()
  }

  const handleTogglePublish = async (album: Album) => {
    await supabase.from('albums').update({ is_published: !album.is_published }).eq('id', album.id)
    loadAlbums()
  }

  if (showPhotos) {
    return (
      <PhotosManager
        album={showPhotos}
        onBack={() => { setShowPhotos(null); loadAlbums() }}
      />
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          {albums.length} album{albums.length !== 1 ? 's' : ''} total
        </div>
        <GoldButton onClick={() => { setEditingAlbum(null); setShowModal(true) }} icon={<Plus size={15} />}>
          New Album
        </GoldButton>
      </div>

      {loading ? (
        <LoadingRows />
      ) : albums.length === 0 ? (
        <EmptyState message="No albums yet. Create your first album!" />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Cover', 'Album', 'Category', 'Photos', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', fontSize: '0.6rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--muted)', padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {albums.map(album => (
              <AlbumRow
                key={album.id}
                album={album}
                onEdit={() => { setEditingAlbum(album); setShowModal(true) }}
                onDelete={() => handleDelete(album.id, album.title)}
                onTogglePublish={() => handleTogglePublish(album)}
                onManagePhotos={() => setShowPhotos(album)}
              />
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <AlbumModal
          album={editingAlbum}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); loadAlbums() }}
        />
      )}
    </div>
  )
}

function AlbumRow({ album, onEdit, onDelete, onTogglePublish, onManagePhotos }: {
  album: Album
  onEdit: () => void
  onDelete: () => void
  onTogglePublish: () => void
  onManagePhotos: () => void
}) {
  const [photoCount, setPhotoCount] = useState(0)

  useEffect(() => {
    supabase.from('photos').select('*', { count: 'exact', head: true })
      .eq('album_id', album.id)
      .then(({ count }) => setPhotoCount(count || 0))
  }, [album.id])

  return (
    <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
      <td style={{ padding: '12px 16px' }}>
        {album.cover_image_url ? (
          <img src={album.cover_image_url} style={{ width: '48px', height: '48px', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '48px', height: '48px', background: 'var(--dark)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={16} color="var(--muted)" />
          </div>
        )}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 400, color: 'var(--cream)' }}>{album.title}</div>
        {album.location && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>{album.location}</div>}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--muted)' }}>{album.category}</td>
      <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--muted)' }}>{photoCount}</td>
      <td style={{ padding: '12px 16px' }}><StatusBadge published={album.is_published} /></td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <SmallButton onClick={onManagePhotos} title="Manage Photos"><Camera size={13} /></SmallButton>
          <SmallButton onClick={onEdit} title="Edit"><Edit size={13} /></SmallButton>
          <SmallButton onClick={onTogglePublish} title={album.is_published ? 'Unpublish' : 'Publish'}>
            {album.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
          </SmallButton>
          <SmallButton onClick={onDelete} title="Delete" danger><Trash2 size={13} /></SmallButton>
        </div>
      </td>
    </tr>
  )
}

function AlbumModal({ album, onClose, onSaved }: {
  album: Album | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: album?.title || '',
    slug: album?.slug || '',
    category: album?.category || 'Wedding',
    couple_names: album?.couple_names || '',
    event_date: album?.event_date || '',
    location: album?.location || '',
    description: album?.description || '',
    is_published: album?.is_published || false,
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState(album?.cover_image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!form.title || !form.slug) { setError('Title and slug are required'); return }
    setSaving(true)
    setError('')

    let coverUrl = album?.cover_image_url || ''
    let coverPublicId = album?.cover_image_public_id || ''

    if (coverFile) {
      try {
        const result = await uploadImage(coverFile)
        coverUrl = result.url
        coverPublicId = result.public_id
      } catch {
        setError('Cover image upload failed. Please try again.')
        setSaving(false)
        return
      }
    }

    const payload = {
      ...form,
      cover_image_url: coverUrl,
      cover_image_public_id: coverPublicId,
      updated_at: new Date().toISOString(),
    }

    if (album) {
      const { error: err } = await supabase.from('albums').update(payload).eq('id', album.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('albums').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }

    onSaved()
  }

  return (
    <Modal title={album ? 'Edit Album' : 'New Album'} onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ModalField label="Album Title *">
          <input
            value={form.title}
            onChange={e => {
              const val = e.target.value
              setForm(f => ({ ...f, title: val, ...(!album && { slug: autoSlug(val) }) }))
            }}
            placeholder="e.g. Priya & Ashan"
            style={inputStyle}
          />
        </ModalField>
        <ModalField label="URL Slug *">
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="priya-and-ashan" style={inputStyle} />
        </ModalField>
        <ModalField label="Category">
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
            {['Wedding', 'Pre-Wedding', 'Fashion', 'Artistic', 'Portrait'].map(c => (
              <option key={c} value={c} style={{ background: 'var(--charcoal)' }}>{c}</option>
            ))}
          </select>
        </ModalField>
        <ModalField label="Event Date">
          <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} style={inputStyle} />
        </ModalField>
        <ModalField label="Couple Names">
          <input value={form.couple_names} onChange={e => setForm(f => ({ ...f, couple_names: e.target.value }))} placeholder="Priya & Ashan" style={inputStyle} />
        </ModalField>
        <ModalField label="Location">
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Colombo, Sri Lanka" style={inputStyle} />
        </ModalField>
        <div style={{ gridColumn: 'span 2' }}>
          <ModalField label="Description">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="A short description..." style={{ ...inputStyle, resize: 'vertical' }} />
          </ModalField>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--muted)' }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }} />
            Publish this album (visible on website)
          </label>
        </div>
      </div>

      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>Cover Image</div>
        {coverPreview && (
          <div style={{ marginBottom: '12px', position: 'relative', display: 'inline-block' }}>
            <img src={coverPreview} style={{ height: '120px', objectFit: 'cover', display: 'block', border: '1px solid var(--border)' }} />
            <button onClick={() => { setCoverPreview(''); setCoverFile(null) }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(224,112,112,0.9)', border: 'none', color: 'white', width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={12} />
            </button>
          </div>
        )}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '16px', border: '2px dashed var(--border)',
          cursor: 'pointer', fontSize: '0.75rem', color: 'var(--muted)',
          transition: 'all 0.3s', letterSpacing: '0.1em',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
        >
          <Upload size={16} />
          {coverPreview ? 'Change Cover Image' : 'Upload Cover Image'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]
            if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)) }
          }} />
        </label>
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <OutlineButton onClick={onClose}>Cancel</OutlineButton>
        <GoldButton onClick={handleSave} loading={saving} icon={<Check size={14} />}>
          {saving ? 'Saving...' : album ? 'Save Changes' : 'Create Album'}
        </GoldButton>
      </div>
    </Modal>
  )
}

// ══════════════════════════════════════════
// PHOTOS MANAGER
// ══════════════════════════════════════════
function PhotosManager({ album, onBack }: { album: Album; onBack: () => void }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [dragOver, setDragOver] = useState(false)

  const loadPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').eq('album_id', album.id).order('sort_order')
    setPhotos(data || [])
  }

  useEffect(() => { loadPhotos() }, [album.id])

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const key = `${Date.now()}-${i}`
      setUploadProgress(p => ({ ...p, [key]: 0 }))
      try {
        const result = await uploadImage(file, (pct) => {
          setUploadProgress(p => ({ ...p, [key]: pct }))
        })
        await supabase.from('photos').insert({
          album_id: album.id,
          url: result.url,
          thumbnail_url: result.url.replace('/upload/', '/upload/c_thumb,w_400,h_400/'),
          public_id: result.public_id,
          sort_order: photos.length + i,
        })
        setUploadProgress(p => { const next = { ...p }; delete next[key]; return next })
      } catch {
        setUploadProgress(p => { const next = { ...p }; delete next[key]; return next })
      }
    }
    loadPhotos()
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return
    await supabase.from('photos').delete().eq('id', photo.id)
    loadPhotos()
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', color: 'var(--muted)',
          cursor: 'pointer', fontSize: '0.72rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', fontFamily: 'Jost, sans-serif',
          marginBottom: '24px', padding: 0, transition: 'color 0.3s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
      >
        ← Back to Albums
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>
          {album.title}
        </h2>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} in this album
        </div>
      </div>

      <label
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '12px', padding: '40px',
          border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--border)'}`,
          background: dragOver ? 'rgba(201,169,110,0.04)' : 'transparent',
          cursor: 'pointer', marginBottom: '24px', transition: 'all 0.3s',
        }}
      >
        <Upload size={28} color={dragOver ? 'var(--gold)' : 'var(--muted)'} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--cream)', marginBottom: '4px' }}>
            Click to upload or drag & drop photos
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
            JPG, PNG, WEBP — multiple files supported
          </div>
        </div>
        <input type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => e.target.files && handleFiles(e.target.files)} />
      </label>

      {Object.entries(uploadProgress).map(([key, pct]) => (
        <div key={key} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Uploading...</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{pct}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '3px' }}>
            <div style={{ height: '100%', background: 'var(--gold)', width: `${pct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      ))}

      {photos.length === 0 ? (
        <EmptyState message="No photos yet. Upload some photos above!" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
          {photos.map(photo => (
            <PhotoThumb key={photo.id} photo={photo} onDelete={() => handleDelete(photo)} />
          ))}
        </div>
      )}
    </div>
  )
}

function PhotoThumb({ photo, onDelete }: { photo: Photo; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--charcoal)' }}
    >
      <img src={photo.thumbnail_url || photo.url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} loading="lazy" />
      {hovered && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,12,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={onDelete} style={{ background: 'rgba(224,112,112,0.9)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
// TESTIMONIALS PANEL
// ══════════════════════════════════════════
function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order').order('created_at')
    setTestimonials(data || [])
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    load()
  }

  const handleToggle = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_published: !t.is_published }).eq('id', t.id)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <GoldButton onClick={() => { setEditing(null); setShowModal(true) }} icon={<Plus size={15} />}>
          Add Testimonial
        </GoldButton>
      </div>
      {testimonials.length === 0 ? (
        <EmptyState message="No testimonials yet." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {testimonials.map(t => (
            <div key={t.id} style={{
              background: 'var(--charcoal)', border: '1px solid var(--border)',
              padding: '20px 24px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 400, color: 'var(--cream)' }}>{t.couple_names}</div>
                  {t.wedding_year && <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t.wedding_year}</div>}
                  <StatusBadge published={t.is_published} />
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{t.message.slice(0, 120)}{t.message.length > 120 ? '...' : ''}"
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <SmallButton onClick={() => { setEditing(t); setShowModal(true) }}><Edit size={13} /></SmallButton>
                <SmallButton onClick={() => handleToggle(t)}>{t.is_published ? <EyeOff size={13} /> : <Eye size={13} />}</SmallButton>
                <SmallButton onClick={() => handleDelete(t.id)} danger><Trash2 size={13} /></SmallButton>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <TestimonialModal
          testimonial={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load() }}
        />
      )}
    </div>
  )
}

function TestimonialModal({ testimonial, onClose, onSaved }: {
  testimonial: Testimonial | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    couple_names: testimonial?.couple_names || '',
    wedding_year: testimonial?.wedding_year || '',
    message: testimonial?.message || '',
    is_published: testimonial?.is_published ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.couple_names || !form.message) return
    setSaving(true)
    if (testimonial) {
      await supabase.from('testimonials').update(form).eq('id', testimonial.id)
    } else {
      await supabase.from('testimonials').insert(form)
    }
    setSaving(false)
    onSaved()
  }

  return (
    <Modal title={testimonial ? 'Edit Testimonial' : 'New Testimonial'} onClose={onClose}>
      <ModalField label="Couple Names *">
        <input value={form.couple_names} onChange={e => setForm(f => ({ ...f, couple_names: e.target.value }))} placeholder="e.g. Priya & Ashan" style={inputStyle} />
      </ModalField>
      <ModalField label="Wedding Year">
        <input value={form.wedding_year} onChange={e => setForm(f => ({ ...f, wedding_year: e.target.value }))} placeholder="e.g. 2024" style={inputStyle} />
      </ModalField>
      <ModalField label="Message *">
        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder="Their kind words..." style={{ ...inputStyle, resize: 'vertical' }} />
      </ModalField>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--muted)', marginTop: '8px' }}>
        <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }} />
        Published (visible on website)
      </label>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <OutlineButton onClick={onClose}>Cancel</OutlineButton>
        <GoldButton onClick={handleSave} loading={saving} icon={<Check size={14} />}>
          {saving ? 'Saving...' : 'Save'}
        </GoldButton>
      </div>
    </Modal>
  )
}

// ══════════════════════════════════════════
// ENQUIRIES PANEL
// ══════════════════════════════════════════
function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [selected, setSelected] = useState<Enquiry | null>(null)

  const load = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    setEnquiries(data || [])
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await supabase.from('enquiries').update({ is_read: true }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return
    await supabase.from('enquiries').delete().eq('id', id)
    setSelected(null)
    load()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', height: 'calc(100vh - 200px)' }}>
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {enquiries.length === 0 ? (
          <EmptyState message="No enquiries yet." />
        ) : enquiries.map(e => (
          <div
            key={e.id}
            onClick={() => { setSelected(e); if (!e.is_read) markRead(e.id) }}
            style={{
              background: selected?.id === e.id ? 'rgba(201,169,110,0.08)' : 'var(--charcoal)',
              border: `1px solid ${selected?.id === e.id ? 'var(--gold)' : 'var(--border)'}`,
              padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 400, color: e.is_read ? 'var(--muted)' : 'var(--cream)' }}>
                {e.first_name} {e.last_name}
                {!e.is_read && <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--gold)', marginLeft: '8px', verticalAlign: 'middle' }} />}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{new Date(e.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '4px' }}>{e.email}</div>
            {e.service && <div style={{ fontSize: '0.68rem', color: 'var(--gold)' }}>{e.service}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '28px', overflowY: 'auto' }}>
        {!selected ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem' }}>
            Select an enquiry to view
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>
                  {selected.first_name} {selected.last_name}
                </h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{new Date(selected.created_at).toLocaleString()}</div>
              </div>
              <SmallButton onClick={() => handleDelete(selected.id)} danger><Trash2 size={13} /></SmallButton>
            </div>
            {[
              { label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
              { label: 'Phone', value: selected.phone },
              { label: 'Service', value: selected.service },
              { label: 'Event Date', value: selected.event_date },
            ].map(item => item.value && (
              <div key={item.label} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} style={{ color: 'var(--gold)', fontSize: '0.88rem', textDecoration: 'none' }}>{item.value}</a>
                ) : (
                  <div style={{ color: 'var(--cream)', fontSize: '0.88rem' }}>{item.value}</div>
                )}
              </div>
            ))}
            {selected.message && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>Message</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.8 }}>{selected.message}</p>
              </div>
            )}
            <div style={{ marginTop: '24px' }}>
              <a href={`mailto:${selected.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', color: 'var(--dark)', padding: '10px 24px', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// SETTINGS PANEL
// ══════════════════════════════════════════
function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      const obj: Record<string, string> = {}
      data?.forEach(row => { obj[row.key] = row.value })
      setSettings(obj)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(settings).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString(),
    }))
    await supabase.from('site_settings').upsert(updates, { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fields = [
    { key: 'photographer_name', label: 'Photographer Name' },
    { key: 'tagline', label: 'Hero Tagline' },
    { key: 'hero_subtitle', label: 'Hero Subtitle' },
    { key: 'phone', label: 'Phone / WhatsApp' },
    { key: 'email', label: 'Email Address' },
    { key: 'location', label: 'Location' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'facebook_url', label: 'Facebook URL' },
  ]

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {fields.map(f => (
          <div key={f.key}>
            <ModalField label={f.label}>
              <input value={settings[f.key] || ''} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))} style={inputStyle} />
            </ModalField>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2' }}>
          <ModalField label="About Bio">
            <textarea value={settings['bio'] || ''} onChange={e => setSettings(s => ({ ...s, bio: e.target.value }))} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </ModalField>
        </div>
      </div>
      <GoldButton onClick={handleSave} loading={saving} icon={saved ? <Check size={14} /> : undefined}>
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </GoldButton>
    </div>
  )
}

// ══════════════════════════════════════════
// PHOTO STRIP PANEL
// ══════════════════════════════════════════
function PhotoStripPanel() {
  const [photos, setPhotos] = useState<{ url: string, public_id: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [dragOver, setDragOver] = useState(false)

  const loadPhotos = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'photo_strip_images').single()
    if (data && data.value) {
      try {
        setPhotos(JSON.parse(data.value))
      } catch (e) {
        setPhotos([])
      }
    } else {
      setPhotos([])
    }
    setLoading(false)
  }

  useEffect(() => { loadPhotos() }, [])

  const savePhotos = async (newPhotos: { url: string, public_id: string }[]) => {
    await supabase.from('site_settings').upsert({
      key: 'photo_strip_images',
      value: JSON.stringify(newPhotos),
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })
    setPhotos(newPhotos)
  }

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    let currentPhotos = [...photos]

    for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const key = `${Date.now()}-${i}`
        setUploadProgress(p => ({ ...p, [key]: 0 }))
        try {
            const result = await uploadImage(file, (pct) => {
                setUploadProgress(p => ({ ...p, [key]: pct }))
            })
            const newPhoto = { url: result.url, public_id: result.public_id }
            currentPhotos = [...currentPhotos, newPhoto]
            setUploadProgress(p => { const next = { ...p }; delete next[key]; return next })
        } catch {
            setUploadProgress(p => { const next = { ...p }; delete next[key]; return next })
        }
    }
    await savePhotos(currentPhotos)
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Remove this photo from the strip?')) return
    const newPhotos = photos.filter((_, i) => i !== index)
    await savePhotos(newPhotos)
  }

  if (loading) return <LoadingRows />

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>
          Custom Photo Strip
        </h2>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} in the home page strip
        </div>
      </div>

      <label
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '12px', padding: '40px',
          border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--border)'}`,
          background: dragOver ? 'rgba(201,169,110,0.04)' : 'transparent',
          cursor: 'pointer', marginBottom: '24px', transition: 'all 0.3s',
        }}
      >
        <Upload size={28} color={dragOver ? 'var(--gold)' : 'var(--muted)'} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--cream)', marginBottom: '4px' }}>
            Click to upload or drag & drop photos
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
            JPG, PNG, WEBP — multiple files supported
          </div>
        </div>
        <input type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => e.target.files && handleFiles(e.target.files)} />
      </label>

      {Object.entries(uploadProgress).map(([key, pct]) => (
        <div key={key} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Uploading...</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{pct}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '3px' }}>
            <div style={{ height: '100%', background: 'var(--gold)', width: `${pct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      ))}

      {photos.length === 0 ? (
        <EmptyState message="No photos added to the strip yet. The website will use album covers by default." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              className="hover-container"
              style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--charcoal)' }}
            >
              <img src={photo.url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }} className="hover-img" loading="lazy" />
              <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(14,12,10,0.6)', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={() => handleDelete(i)} style={{ background: 'rgba(224,112,112,0.9)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <style>{`
            .hover-container:hover .hover-img { transform: scale(1.05); }
            .hover-container:hover .hover-overlay { display: flex !important; }
          `}</style>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
// SHARED UI COMPONENTS
// ══════════════════════════════════════════
function Modal({ title, children, onClose }: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,8,6,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--charcoal)', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 300 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          ><X size={20} /></button>
        </div>
        <div style={{ padding: '28px' }}>{children}</div>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>{label}</label>
      {children}
    </div>
  )
}

function GoldButton({ children, onClick, loading, icon }: {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  icon?: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} disabled={loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: loading ? 'rgba(201,169,110,0.5)' : hovered ? 'rgba(201,169,110,0.85)' : 'var(--gold)', color: 'var(--dark)', border: 'none', padding: '10px 22px', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
      {icon}{children}
    </button>
  )
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'transparent', border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`, color: hovered ? 'var(--gold)' : 'var(--muted)', padding: '10px 22px', fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}>
      {children}
    </button>
  )
}

function SmallButton({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'transparent', border: `1px solid ${hovered ? (danger ? 'rgba(224,112,112,0.5)' : 'var(--gold)') : 'var(--border)'}`, color: hovered ? (danger ? '#e07070' : 'var(--gold)') : 'var(--muted)', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
      {children}
    </button>
  )
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: published ? 'rgba(112,201,160,0.12)' : 'rgba(138,127,114,0.12)', color: published ? '#70c9a0' : 'var(--muted)' }}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.3)', color: '#e07070', padding: '12px 16px', fontSize: '0.8rem', marginTop: '16px', lineHeight: 1.5 }}>
      {message}
    </div>
  )
}

function LoadingRows() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: '60px', background: 'var(--charcoal)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--dark)',
  border: '1px solid var(--border)',
  padding: '10px 14px',
  color: 'var(--cream)',
  fontFamily: 'Jost, sans-serif',
  fontSize: '0.88rem',
  fontWeight: 300,
  outline: 'none',
}