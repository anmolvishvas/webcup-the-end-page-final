import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    // Store the language preference
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary-light hover:bg-gray-700 transition-colors"
      title={t('language.toggle')}
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.language === 'en' ? t('language.fr') : t('language.en')}</span>
    </button>
  );
};

export default LanguageToggle; 