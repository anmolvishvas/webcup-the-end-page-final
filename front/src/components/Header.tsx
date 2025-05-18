import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, ChevronDown, Menu, X, PenLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const isViewPage = location.pathname.startsWith('/view/');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isViewPage) return null;

  const NavigationLinks = () => (
    <>
      {isAuthenticated && (
        <>
          <li>
            <Link 
              to="/create" 
              className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PenLine className="h-5 w-5" />
              <span>{t('header.create')}</span>
            </Link>
          </li>
          <li>
            <Link
              to="/my-pages"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>{t('header.myPages')}</span>
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-primary-light/30 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-serif font-bold">
            TheEnd.page
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              <li>
                <LanguageToggle />
              </li>
              <NavigationLinks />
              {isAuthenticated ? (
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{currentUser!.firstName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-primary-light rounded-md shadow-xl z-40">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('header.logout')}</span>
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {t('header.login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
                    >
                      {t('header.register')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="z-50">
              <LanguageToggle />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden py-4 space-y-2"
          >
            <ul className="space-y-2">
              <NavigationLinks />
              {isAuthenticated ? (
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('header.logout')}</span>
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('header.login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('header.register')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
 