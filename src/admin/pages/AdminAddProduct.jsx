import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { uploadToCloudinary, validateImageFile } from '../../lib/cloudinary'
import { addProduct } from '../../services/productsService'

const CATEGORIES = [
  { value: 'freebase',    label: 'Free Base'     },
  { value: 'salt',        label: 'Salt Nicotine'  },
  { value: 'disposables', label: 'Disposables'    },
  { value: 'devices',     label: 'Devices'        },
  { value: 'pod-system',  label: 'Pod System'     },
  { value: 'coils',       label: 'Coils & Pods'   },
]

const EMPTY_FORM = { name: '', price: '', category: 'freebase', ml: '', nicotine: '' }

const inputClass = `w-full px-4 py-3 rounded-xl
  bg-zinc-800 border border-zinc-700
  text-white placeholder:text-zinc-600
  focus:border-orange-500/60 focus:outline-none
  transition-all duration-200 text-sm`

/* ── Reusable labelled field wrapper ──────────────────────────── */
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/* ── Spinner icon ─────────────────────────────────────────────── */
const SpinIcon = () => (
  <svg className="animate-spin flex-shrink-0" width="15" height="15"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function AdminAddProduct() {
  const auth     = useAdminAuth()
  const navigate = useNavigate()

  /* form state */
  const [form,       setFormState]  = useState(EMPTY_FORM)
  const [errors,     setErrors]     = useState({})

  /* image state */
  const [imageFile,  setImageFile]  = useState(null)
  const [preview,    setPreview]    = useState('')
  const [dragging,   setDragging]   = useState(false)

  /* async state */
  const [uploading,  setUploading]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [saving,     setSaving]     = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [submitErr,  setSubmitErr]  = useState('')

  const fileRef  = useRef()
  const isWorking = uploading || saving

  if (!auth) return null

  /* ── Field setter (clears error on change) ── */
  const setField = (key, val) => {
    setFormState(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
    setSubmitErr('')
  }

  /* ── Client-side validation ── */
  const validate = () => {
    const e = {}
    if (!form.name.trim()) {
      e.name = 'Product name is required'
    }
    if (!form.price.trim()) {
      e.price = 'Price is required'
    } else if (isNaN(parseFloat(String(form.price).replace('$', '')))) {
      e.price = 'Enter a valid number (e.g. 12.5 or 12.5$)'
    }
    if (!form.category) {
      e.category = 'Select a category'
    }
    return e
  }

  /* ── File selection / drop ── */
  const handleFile = (file) => {
    if (!file) return
    try {
      validateImageFile(file)
    } catch (err) {
      setErrors(e => ({ ...e, image: err.message }))
      return
    }
    setErrors(e => ({ ...e, image: '' }))
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitErr('')

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    try {
      let imageUrl = ''
      let publicId = ''

      /* Step 1: Upload image to Cloudinary (if file selected) */
      if (imageFile) {
        setUploading(true)
        setProgress(0)

        const result = await uploadToCloudinary(imageFile, (pct) => setProgress(pct))
        imageUrl = result.url
        publicId = result.publicId

        setUploading(false)
        setProgress(0)
      }

      /* Step 2: Save product to Firestore */
      setSaving(true)
      await addProduct({ ...form, imageUrl, publicId })
      setSaving(false)

      /* Step 3: Success */
      setSuccess(true)
      setFormState(EMPTY_FORM)
      setPreview('')
      setImageFile(null)

      setTimeout(() => {
        setSuccess(false)
        navigate('/admin/products')
      }, 1800)

    } catch (err) {
      console.error('[AdminAddProduct] submit error:', err)
      setUploading(false)
      setSaving(false)
      setProgress(0)
      setSubmitErr(err.message || 'Something went wrong. Please try again.')
    }
  }

  /* ── Reset form ── */
  const handleReset = () => {
    setFormState(EMPTY_FORM)
    setPreview('')
    setImageFile(null)
    setErrors({})
    setSubmitErr('')
    setProgress(0)
  }

  /* ─────────────────────── RENDER ──────────────────────────── */
  return (
    <div className="max-w-2xl space-y-6">

      {/* ── Success toast ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3
              px-5 py-4 rounded-2xl bg-green-500 text-white font-semibold
              shadow-2xl shadow-green-900/40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Product saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div>
        <h2 className="text-white text-xl font-extrabold">Add New Product</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Image → Cloudinary &nbsp;·&nbsp; Data → Firestore &nbsp;·&nbsp; Syncs across all devices instantly
        </p>
      </div>

      {/* ── Global error banner ── */}
      <AnimatePresence>
        {submitErr && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30
              text-red-400 text-sm flex items-start gap-2"
          >
            <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {submitErr}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Card: Basic Info ── */}
        <div className="bg-zinc-900 border border-white/8 rounded-2xl p-6 space-y-5">
          <h3 className="text-zinc-300 text-sm font-bold border-b border-white/8 pb-3">
            Basic Information
          </h3>

          <Field label="Product Name" required error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="e.g. Dr Vape-Blue Ice"
              className={inputClass}
              disabled={isWorking}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" required error={errors.price}>
              <input
                type="text"
                value={form.price}
                onChange={e => setField('price', e.target.value)}
                placeholder="e.g. 12.5$"
                className={inputClass}
                disabled={isWorking}
              />
            </Field>
            <Field label="Category" required error={errors.category}>
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className={`${inputClass} cursor-pointer`}
                disabled={isWorking}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Card: Optional Details ── */}
        <div className="bg-zinc-900 border border-white/8 rounded-2xl p-6 space-y-5">
          <h3 className="text-zinc-300 text-sm font-bold border-b border-white/8 pb-3">
            Details <span className="text-zinc-600 font-normal">(Optional)</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Volume">
              <input type="text" value={form.ml}
                onChange={e => setField('ml', e.target.value)}
                placeholder="e.g. 60ml"
                className={inputClass}
                disabled={isWorking} />
            </Field>
            <Field label="Nicotine">
              <input type="text" value={form.nicotine}
                onChange={e => setField('nicotine', e.target.value)}
                placeholder="e.g. 3mg or 12/18mg"
                className={inputClass}
                disabled={isWorking} />
            </Field>
          </div>
        </div>

        {/* ── Card: Image Upload ── */}
        <div className="bg-zinc-900 border border-white/8 rounded-2xl p-6 space-y-4">
          <h3 className="text-zinc-300 text-sm font-bold border-b border-white/8 pb-3">
            Product Image
            <span className="text-zinc-600 font-normal ml-2">
              (Uploaded to Cloudinary CDN)
            </span>
          </h3>

          {/* Drop zone */}
          <div
            onClick={() => !isWorking && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={[
              'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
              isWorking ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
              dragging
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-800/50',
            ].join(' ')}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={e => handleFile(e.target.files?.[0])}
              className="hidden"
              disabled={isWorking}
            />

            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <img src={preview} alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-white/10" />
                <p className="text-zinc-400 text-xs">Click to change image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className="text-zinc-500">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-300 text-sm font-medium">
                    Drop image here or{' '}
                    <span className="text-orange-400">browse</span>
                  </p>
                  <p className="text-zinc-600 text-xs mt-1">
                    JPG · PNG · WEBP · GIF — max 10 MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Uploading to Cloudinary...</span>
                <span className="font-semibold text-orange-400">{progress}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
            </div>
          )}

          {errors.image && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
              </svg>
              {errors.image}
            </p>
          )}

          {preview && !isWorking && (
            <button
              type="button"
              onClick={() => { setPreview(''); setImageFile(null) }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              × Remove image
            </button>
          )}
        </div>

        {/* ── Submit row ── */}
        <div className="flex gap-3">
          <motion.button
            type="submit"
            disabled={isWorking || success}
            whileTap={{ scale: isWorking ? 1 : 0.97 }}
            className="flex-1 flex items-center justify-center gap-2
              py-3.5 rounded-xl font-bold text-sm
              bg-orange-500 hover:bg-orange-600 text-white
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors shadow-lg shadow-orange-500/20"
          >
            {uploading ? (
              <><SpinIcon /> Uploading ({progress}%)...</>
            ) : saving ? (
              <><SpinIcon /> Saving to Firestore...</>
            ) : success ? (
              <>✓ Saved!</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Product
              </>
            )}
          </motion.button>

          <button
            type="button"
            disabled={isWorking}
            onClick={handleReset}
            className="px-6 py-3.5 rounded-xl font-bold text-sm
              bg-zinc-800 hover:bg-zinc-700 text-zinc-300
              disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
  )
}
