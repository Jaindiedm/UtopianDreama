export interface Album {
  id: string
  title: string
  slug: string
  category: string
  couple_names?: string
  event_date?: string
  location?: string
  description?: string
  cover_image_url?: string
  cover_image_public_id?: string
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface Photo {
  id: string
  album_id: string
  url: string
  thumbnail_url?: string
  public_id: string
  caption?: string
  sort_order: number
}

export interface Testimonial {
  id: string
  couple_names: string
  wedding_year?: string
  message: string
  is_published: boolean
  sort_order: number
}

export interface SiteSettings {
  [key: string]: string
}