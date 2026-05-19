import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'

const ContactCard = ({ href, icon, title, subtitle, color, delay }) => (
  <motion.a
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-${color}-500/10 transition-all duration-300`}
  >
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}>
      {icon}
    </div>
    <div>
      <p className="font-bold text-zinc-900 dark:text-white">{title}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-auto text-zinc-300 dark:text-zinc-600">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  </motion.a>
)

export default function ContactPage() {
  const { t, isRTL } = useTranslation()

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-screen-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            {t('contactTitle')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        {/* Social Contacts */}
        <div className="space-y-3 mb-10">
          <ContactCard
            delay={0.1}
            href="https://wa.me/message/IXYMUJRDLYOXA1"
            color="green"
            title="WhatsApp"
            subtitle="+963 998 067 029"
            icon={<WhatsAppIcon />}
          />
          <ContactCard
            delay={0.2}
            href="https://www.instagram.com/cityvpsy?igsh=MXVuejZkYnE4cXNrOQ=="
            color="pink"
            title="Instagram"
            subtitle="@cityvpsy"
            icon={<InstagramIcon />}
          />
        </div>

        {/* Locations */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{t('ourLocations')}</h2>
          <div className="space-y-3">
            <ContactCard
              delay={0.3}
              href="https://maps.google.com/?q=33.518898,36.280708"
              color="blue"
              title={t('alJahiz')}
              subtitle="Al-Jahiz Street, Damascus"
              icon={<MapIcon />}
            />
            <ContactCard
              delay={0.4}
              href="https://maps.app.goo.gl/7Pwk6Y3beyesFKCF7"
              color="blue"
              title={t('masaken')}
              subtitle="Masaken Barzeh, Damascus"
              icon={<MapIcon />}
            />
          </div>
        </div>

        {/* Quick Order Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 text-center text-white"
        >
          <h3 className="text-xl font-bold mb-2">Ready to Order?</h3>
          <p className="text-orange-100 text-sm mb-6">Browse our catalog and order directly via WhatsApp</p>
          <a
            href="https://wa.me/message/IXYMUJRDLYOXA1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 font-bold text-sm hover:bg-orange-50 transition-colors"
          >
            <WhatsAppIcon />
            Start Chat
          </a>
        </motion.div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
