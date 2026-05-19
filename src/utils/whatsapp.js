/**
 * src/utils/whatsapp.js
 * WhatsApp ordering utility — includes product name, price, nicotine, ml.
 */

export const WHATSAPP_NUMBER = '963998067029'
export const INSTAGRAM_URL   = 'https://www.instagram.com/cityvpsy?igsh=MXVuejZkYnE4cXNrOQ=='
export const WHATSAPP_CHAT   = 'https://wa.me/message/IXYMUJRDLYOXA1'

/**
 * Build a pre-filled WhatsApp order URL.
 * Message includes: product name, price, nicotine level, ml size.
 */
export function buildWhatsAppOrder(product) {
  const lines = [
    'Hello, I want to order:',
    `Product: ${product.name}`,
    `Price: ${product.price}`,
  ]
  if (product.nicotine) lines.push(`Nicotine: ${product.nicotine}`)
  if (product.ml)       lines.push(`Size: ${product.ml}`)

  const message = lines.join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
