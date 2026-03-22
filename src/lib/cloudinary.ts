const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; public_id: string }> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'photography-site')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.upload.onprogress = e => {
      if (e.lengthComputable)
        onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status === 200)
        resolve({ url: data.secure_url, public_id: data.public_id })
      else reject(new Error(data.error?.message || 'Upload failed'))
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(fd)
  })
}
export function optimizeImage(url: string, width: number = 800): string {
  if (!url) return ''
  if (!url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
}
