
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import { v2 as cloudinary } from 'cloudinary'
import { products } from './src/assets/products-backup.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, 'src', 'assets', 'images')

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf-8'))
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

cloudinary.config({
  cloud_name: 'dbspsw3jx',
  api_key: '284116261852919',
  api_secret: '0MKmoFVCoylSKwqWk75RJ8YkXks',
})
async function main() {
  const snap = await db.collection('products').get()
  const toFix = snap.docs.filter(d => !d.data().imageUrl)
  console.log(`Found ${toFix.length} products without imageUrl`)

  for (const docSnap of toFix) {
    const data = docSnap.data()
    const match = products.find(p => p.name === data.name)

    if (!match?.image) {
      console.log(`⚠️ No match: ${data.name}`)
      continue
    }

    const filename = match.image.replace('./images/', '')
    const absPath = path.join(IMAGES_DIR, filename)

    if (!fs.existsSync(absPath)) {
      console.log(`❌ Missing file: ${filename}`)
      continue
    }

    try {
      const result = await cloudinary.uploader.upload(absPath, { folder: 'products' })
      await docSnap.ref.update({ imageUrl: result.secure_url, publicId: result.public_id })
      console.log(`✅ Fixed: ${data.name}`)
    } catch (err) {
      console.log(`❌ Failed: ${data.name} — ${err.message}`)
    }
  }
  console.log('✅ Done!')
}

main().catch(console.error)
