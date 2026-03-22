import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Album, Photo } from '../types'
import { MOCK_ALBUMS } from '../lib/mockData'

export function useAlbums() {
    const [albums, setAlbums] = useState<Album[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('albums')
                .select('*')
                .eq('is_published', true)
                .order('sort_order')
                .order('created_at', { ascending: false })
            // Fall back to mock data if database has no albums yet
            setAlbums(data && data.length > 0 ? data : MOCK_ALBUMS)
            setLoading(false)
        }
        load()
    }, [])

    return { albums, loading }
}

export function useAlbum(slug: string) {
    const [album, setAlbum] = useState<Album | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data: albumData } = await supabase
                .from('albums')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single()

            if (albumData) {
                setAlbum(albumData)
                const { data: photoData } = await supabase
                    .from('photos')
                    .select('*')
                    .eq('album_id', albumData.id)
                    .order('sort_order')
                setPhotos(photoData || [])
            }
            setLoading(false)
        }
        load()
    }, [slug])

    return { album, photos, loading }
}