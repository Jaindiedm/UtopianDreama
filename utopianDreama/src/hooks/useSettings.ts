import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSettings } from '../types'

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('site_settings')
                .select('*')
            if (data) {
                const obj: SiteSettings = {}
                data.forEach((row: { key: string; value: string }) => {
                    obj[row.key] = row.value
                })
                setSettings(obj)
            }
            setLoading(false)
        }
        load()
    }, [])

    return { settings, loading }
}