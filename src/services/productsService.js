/**
 * src/services/productsService.js
 *
 * Canonical Firestore service for all product CRUD.
 * Images are stored in Cloudinary — only URLs live in Firestore.
 *
 * Firestore document shape:
 * {
 *   name, price, category, imageUrl, publicId,
 *   nicotine, ml, createdAt, updatedAt?
 * }
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

const COL = 'products'

/* ── Normalize raw Firestore doc → clean product object ─────────── */
function normalize(snap) {
  const d = snap.data()
  const img = d.imageUrl || d.image || ''
  return {
    id: snap.id,
    name: d.name ?? '',
    price: d.price ?? '',
    category: d.category ?? '',
    image: img,            // ProductCard reads .image
    imageUrl: img,            // AdminProductsPage reads .imageUrl
    publicId: d.publicId ?? '',
    ml: d.ml ?? '',
    nicotine: d.nicotine ?? '',
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  }
}

/* ── Real-time subscription ──────────────────────────────────────── */
export function subscribeProducts(callback) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(normalize)),
    (err) => console.error('[productsService] snapshot error:', err)
  )
}

/* ── One-shot fetch ──────────────────────────────────────────────── */
export async function fetchProducts() {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')))
    return snap.docs.map(normalize)
  } catch (err) {
    console.error('[productsService] fetchProducts:', err)
    return []
  }
}

/* ── Add new product ─────────────────────────────────────────────── */
export async function addProduct(data) {
  if (!data.name?.trim()) throw new Error('Product name is required.')
  if (!data.price?.trim()) throw new Error('Product price is required.')
  if (!data.category) throw new Error('Product category is required.')

  const price = String(data.price).trim()

  const ref = await addDoc(collection(db, COL), {
    name: data.name.trim(),
    price: price.endsWith('$') ? price : `${price}$`,
    category: data.category,
    imageUrl: data.imageUrl ?? data.image ?? '',
    publicId: data.publicId ?? '',
    ml: data.ml ?? '',
    nicotine: data.nicotine ?? '',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/* ── Update existing product ─────────────────────────────────────── */
export async function updateProduct(id, updates) {
  if (!id) throw new Error('Product id required.')

  if (updates.price) {
    const p = String(updates.price).trim()
    updates.price = p.endsWith('$') ? p : `${p}$`
  }
  // Keep imageUrl in sync if old field name is passed
  if (updates.image && !updates.imageUrl) updates.imageUrl = updates.image

  await updateDoc(doc(db, COL, id), { ...updates, updatedAt: serverTimestamp() })
}

/* ── Delete product ──────────────────────────────────────────────── */
export async function deleteProduct(id) {
  if (!id) throw new Error('Product id required.')
  await deleteDoc(doc(db, COL, id))
  // Note: Cloudinary image deletion requires server-side signed request.
  // publicId is stored for future cleanup via a backend function.
}
