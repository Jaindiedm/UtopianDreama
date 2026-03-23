import { useAlbums } from '../../hooks/useAlbums'
import { useSettings } from '../../hooks/useSettings'

export default function PhotoStrip() {
    const { albums, loading: albumsLoading } = useAlbums()
    const { settings, loading: settingsLoading } = useSettings()

    if (albumsLoading || settingsLoading) return null

    let customPhotos: { url: string }[] = []
    if (settings.photo_strip_images) {
        try {
            customPhotos = JSON.parse(settings.photo_strip_images)
        } catch (e) {
            // ignore
        }
    }

    const photos = customPhotos.length > 0
        ? customPhotos.map(p => p.url)
        : albums.filter(a => a.cover_image_url).map(a => a.cover_image_url!)

    if (photos.length < 1) return null

    // Repeat photos enough times so strip is always full (min 10 items)
    const repeated = Array.from({ length: Math.ceil(10 / photos.length) }, () => photos).flat()
    const doubled = [...repeated, ...repeated]

    return (
        <div className="photo-strip" style={{
            overflow: 'hidden',
            height: '320px',
            padding: 0,
        }}>
            <div style={{
                display: 'flex',
                gap: '4px',
                height: '100%',
                animation: 'stripScroll 40s linear infinite',
                width: 'max-content',
            }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'
                }}
            >
                {doubled.map((url, i) => (
                    <div key={i} style={{
                        height: '100%',
                        width: '240px',
                        flexShrink: 0,
                        overflow: 'hidden',
                    }}>
                        <img
                            src={url}
                            alt="Strip Image"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />
                    </div>
                ))}
            </div>
        <style>{`
        @media (max-width: 768px) {
          .photo-strip { height: 180px !important; }
        }
      `}</style>
    </div>
    )
}