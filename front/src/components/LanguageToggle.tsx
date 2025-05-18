import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary-light hover:bg-gray-700 transition-colors"
        title={t('language.toggle')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{i18n.language === 'en' ? 'English' : 'Français'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 py-2 bg-primary-light rounded-md shadow-xl z-50">
          <button
            onClick={() => toggleLanguage('en')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
              i18n.language === 'en' ? 'text-secondary' : 'text-gray-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => toggleLanguage('fr')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
              i18n.language === 'fr' ? 'text-secondary' : 'text-gray-300'
            }`}
          >
            Français
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle; 