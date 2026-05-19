/**
 * src/assets/imageMap.js
 *
 * Resolves product image paths to usable URLs.
 *
 * Handles three cases:
 *  1. Full URL (Cloudinary / Firebase Storage / CDN) → pass through as-is
 *  2. Local asset path (./images/xxx.jpg)            → resolve via Vite glob
 *  3. Empty / missing                                → return ''
 */

const imageFiles = import.meta.glob(
  './images/*',
  { eager: true, import: 'default' }
)

// Map:  "blue ice.jpg" → resolved/hashed URL
export const imageMap = Object.fromEntries(
  Object.entries(imageFiles).map(([path, url]) => {
    const filename = path.replace('./images/', '')
    return [filename, url]
  })
)

/**
 * Resolve any product image value to a usable <img src>.
 *
 * @param {string} imagePath
 * @returns {string}
 */
export function getImage(imagePath) {
  if (!imagePath) return ''

  // ── Case 1: Full CDN / cloud URL (Cloudinary, Firebase Storage, etc.)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // ── Case 2: Local asset — strip prefix and look up hashed URL
  const filename = imagePath
    .replace('./images/', '')
    .replace('/images/', '')

  return imageMap[filename] ?? ''
}
