/**
 * migrate-products.mjs
 *
 * One-time migration script.
 * Reads the 300 static products from src/assets/products.js,
 * uploads each unique image to Cloudinary, then writes each product
 * to Firestore in the same shape used by src/services/productsService.js.
 *
 * USAGE:
 *   node migrate-products.mjs --dry-run     (test only, no upload/write)
 *   node migrate-products.mjs               (actually run the migration)
 *
 * SETUP (see chat instructions):
 *   1. npm install firebase-admin cloudinary dotenv
 *   2. Place serviceAccountKey.json in project root (gitignored)
 *   3. Create .env in project root with:
 *        CLOUDINARY_CLOUD_NAME=...
 *        CLOUDINARY_API_KEY=...
 *        CLOUDINARY_API_SECRET=...
 *   4. Run: node migrate-products.mjs --dry-run
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import { v2 as cloudinary } from 'cloudinary'

import { products } from './src/assets/products.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, 'src', 'assets', 'images')
const DRY_RUN = process.argv.includes('--dry-run')
const CONCURRENCY = 4 // how many uploads to run in parallel

/* ── Setup Firebase Admin ─────────────────────────────────────── */
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json')
if (!DRY_RUN) {
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ serviceAccountKey.json not found in project root.')
    process.exit(1)
  }
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}
const db = DRY_RUN ? null : admin.firestore()

/* ── Setup Cloudinary ─────────────────────────────────────────── */
if (!DRY_RUN) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/* ── Helpers ──────────────────────────────────────────────────── */
function resolveImagePath(relativeImage) {
  // relativeImage looks like './images/blue ice.jpg'
  if (!relativeImage) return null
  const filename = relativeImage.replace(/^\.\/images\//, '')
  return path.join(IMAGES_DIR, filename)
}

async function uploadToCloudinary(absPath) {
  const result = await cloudinary.uploader.upload(absPath, {
    folder: 'products',
  })
  return { imageUrl: result.secure_url, publicId: result.public_id }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ── Main migration ───────────────────────────────────────────── */
async function main() {
  console.log(`\n${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE RUN'} — ${products.length} products to process\n`)

  const missingFiles = []
  const noImage = []
  const uploadCache = new Map() // absPath -> { imageUrl, publicId }
  const results = []
  let uploadedCount = 0
  let skippedDuplicateUpload = 0

  // 1. Verification pass — check every image file exists
  for (const p of products) {
    if (!p.image) {
      noImage.push(p)
      continue
    }
    const absPath = resolveImagePath(p.image)
    if (!fs.existsSync(absPath)) {
      missingFiles.push({ id: p.id, name: p.name, expected: absPath })
    }
  }

  console.log(`✅ Products with valid image path: ${products.length - missingFiles.length - noImage.length}`)
  console.log(`⚠️  Products with NO image field: ${noImage.length}`)
  console.log(`❌ Products whose image file is missing on disk: ${missingFiles.length}\n`)

  if (missingFiles.length) {
    console.log('--- Missing files (will be skipped/created without image) ---')
    missingFiles.forEach((m) => console.log(`  #${m.id} "${m.name}" → ${m.expected}`))
    console.log('')
  }
  if (noImage.length) {
    console.log('--- Products with empty image field ---')
    noImage.forEach((m) => console.log(`  #${m.id} "${m.name}"`))
    console.log('')
  }

  if (DRY_RUN) {
    console.log('Dry run complete. Fix any missing files above, then run without --dry-run.\n')
    return
  }

  // 2. Process products in small concurrent batches
  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY)

    await Promise.all(
      batch.map(async (p) => {
        let imageUrl = ''
        let publicId = ''

        const absPath = p.image ? resolveImagePath(p.image) : null
        const imageExists = absPath && fs.existsSync(absPath)

        if (imageExists) {
          if (uploadCache.has(absPath)) {
            const cached = uploadCache.get(absPath)
            imageUrl = cached.imageUrl
            publicId = cached.publicId
            skippedDuplicateUpload++
          } else {
            try {
              const uploaded = await uploadToCloudinary(absPath)
              imageUrl = uploaded.imageUrl
              publicId = uploaded.publicId
              uploadCache.set(absPath, uploaded)
              uploadedCount++
            } catch (err) {
              console.error(`❌ Upload failed for #${p.id} "${p.name}":`, err.message)
            }
          }
        }

        try {
          await db.collection('products').add({
            name: p.name,
            price: p.price, // already like '11.5$'
            category: p.category,
            imageUrl,
            publicId,
            ml: p.ml || '',
            nicotine: p.nicotine || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })
          results.push(p.id)
          console.log(`✔ #${p.id} "${p.name}" migrated`)
        } catch (err) {
          console.error(`❌ Firestore write failed for #${p.id} "${p.name}":`, err.message)
        }
      })
    )

    // small pause between batches to be gentle on rate limits
    await sleep(300)
  }

  console.log(`\n✅ Done. ${results.length}/${products.length} products written to Firestore.`)
  console.log(`   Images uploaded: ${uploadedCount}, reused from cache: ${skippedDuplicateUpload}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})