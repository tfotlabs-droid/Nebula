import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ruTranslations from './ru/common.json';
import enTranslations from './en/common.json';
import esTranslations from './es/common.json';
import zhTranslations from './zh/common.json';
import deTranslations from './de/common.json';
import heTranslations from './he/common.json';
import arTranslations from './ar/common.json';
import frTranslations from './fr/common.json';

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

export default i18n;