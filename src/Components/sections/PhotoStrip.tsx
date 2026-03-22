import { useAlbums } from '../../hooks/useAlbums'

export default function PhotoStrip() {
    const { albums, loading } = useAlbums()
    const photos = albums.filter(a => a.cover_image_url)

    if (loading) return null
    if (photos.length < 1) return null

    // Repeat photos enough times so strip is always full (min 10 items)
    const repeated = Array.from({ length: Math.ceil(10 / photos.length) }, () => photos).flat()
    const doubled = [...repeated, ...repeated]

    return (
        <div style={{
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
                {doubled.map((album, i) => (
                    <div key={i} style={{
                        height: '100%',
                        width: '240px',
                        flexShrink: 0,
                        overflow: 'hidden',
                    }}>
                        <img
                            src={album.cover_image_url!}
                            alt={album.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'saturate(0.65)',
                                transition: 'filter 0.4s',
                                display: 'block',
                            }}
                            onMouseEnter={e => {
                                (e.target as HTMLImageElement).style.filter = 'saturate(1)'
                            }}
                            onMouseLeave={e => {
                                (e.target as HTMLImageElement).style.filter = 'saturate(0.65)'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}