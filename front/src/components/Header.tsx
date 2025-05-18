import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const isViewPage = location.pathname.startsWith('/view/');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isViewPage) return null;

  return (
    <header className="bg-primary-light/30 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-serif font-bold">
            TheEnd.page
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/create" 
                    className="px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
                  >
                    Créer votre fin
                  </Link>
                </li>
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
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-primary-light rounded-md shadow-xl">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
                  >
                    S'inscrire
                  </Link>
                </li>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
 