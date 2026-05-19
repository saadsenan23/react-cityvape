/**
 * src/lib/cloudinary.js
 *
 * Cloudinary unsigned upload utility.
 * Config: Cloud Name = dbspsw3jx, Preset = city-vape-products
 * All values read from .env — never hardcoded here.
 */

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const MAX_SIZE    = 10 * 1024 * 1024  // 10 MB
const ALLOWED     = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** Validate file before uploading — throws descriptive Error on failure */
export function validateImageFile(file) {
  if (!file) throw new Error('No file selected.')
  if (!ALLOWED.includes(file.type))
    throw new Error('Unsupported format. Use JPG, PNG, WEBP, or GIF.')
  if (file.size > MAX_SIZE)
    throw new Error(`File too large (max ${MAX_SIZE / 1024 / 1024} MB).`)
}

/**
 * Upload image to Cloudinary via unsigned preset.
 * @param {File}     file
 * @param {Function} [onProgress]  callback (0–100)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const form     = new FormData()
    form.append('file',          file)
    form.append('upload_preset', UPLOAD_PRESET)
    form.append('folder',        'city-vape/products')

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve({ url: data.secure_url, publicId: data.public_id })
        } catch {
          reject(new Error('Invalid Cloudinary response.'))
        }
      } else {
        let msg = 'Upload failed.'
        try { msg = JSON.parse(xhr.responseText)?.error?.message || msg } catch {}
        reject(new Error(msg))
      }
    })

    xhr.addEventListener('error',   () => reject(new Error('Network error during upload.')))
    xhr.addEventListener('abort',   () => reject(new Error('Upload cancelled.')))
    xhr.addEventListener('timeout', () => reject(new Error('Upload timed out.')))

    xhr.timeout = 60_000
    xhr.open('POST', endpoint)
    xhr.send(form)
  })
}
