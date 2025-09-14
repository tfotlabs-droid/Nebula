import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ruTranslations from './locales/ru/common.json';
import enTranslations from './locales/en/common.json';
import esTranslations from './locales/es/common.json';
import zhTranslations from './locales/zh/common.json';
import deTranslations from './locales/de/common.json';
import heTranslations from './locales/he/common.json';
import arTranslations from './locales/ar/common.json';
import frTranslations from './locales/fr/common.json';
import jaTranslations from './locales/ja/common.json';
import koTranslations from './locales/ko/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { common: ruTranslations },
      en: { common: enTranslations },
      es: { common: esTranslations },
      zh: { common: zhTranslations },
      de: { common: deTranslations },
      he: { common: heTranslations },
      ar: { common: arTranslations },
      fr: { common: frTranslations },
      ja: { common: jaTranslations },
      ko: { common: koTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    ns: 'common',
    defaultNS: 'common',
  });

// RTL support
i18n.on('languageChanged', (lng: string) => {
  const isRTL = ['ar', 'he'].includes(lng);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-rtl', isRTL);
  // Use Intl for formatting: new Intl.DateTimeFormat(lng).format(date)
  // new Intl.NumberFormat(lng, {style: 'currency', currency: 'USD'}).format(num)
});

export default i18n;