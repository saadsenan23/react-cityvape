import { useAppStore } from '../store/useAppStore'
import { translations } from '../i18n/translations'

export function useTranslation() {
  const language = useAppStore((s) => s.language)
  const t = (key) => translations[language]?.[key] ?? translations['en']?.[key] ?? key
  const isRTL = language === 'ar'
  return { t, isRTL, language }
}
