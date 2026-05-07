'use client'
import { createContext, useContext, useState } from 'react'
import { t as translate, type Lang, type TranslationKey } from './lang'

interface LanguageContextValue {
  lang: Lang
  t: (key: TranslationKey) => string
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: (k) => k,
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggle = () => setLang(l => l === 'en' ? 'te' : 'en')
  const t = (key: TranslationKey) => translate(lang, key)
  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
