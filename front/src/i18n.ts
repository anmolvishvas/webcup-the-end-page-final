import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './i18n/locales/en.json';
import frTranslations from './i18n/locales/fr.json';
import { format as formatDate } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

// Get stored language preference or default to French
const storedLanguage = localStorage.getItem('preferredLanguage') || 'fr';

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Helper function to format dates based on current language
export const formatDateLocalized = (date: Date | string, formatStr: string = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDate(dateObj, formatStr, {
    locale: i18n.language === 'fr' ? fr : enUS
  });
};

export default i18n; 