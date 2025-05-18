import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import AttemptsWarningModal from '../components/AttemptsWarningModal';

interface LocationState {
  from?: {
    pathname: string;
  };
}

interface LoginPageProps {
  setShowScene: (show: boolean) => void;
}

const LoginPage = ({ setShowScene }: LoginPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/';
  
  useEffect(() => {
    setShowScene(true);
    
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, setShowScene]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('loginPage.errors.emptyFields'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Check if it's an API error response
      if (err.response?.data) {
        const { error, attempts_left, is_active } = err.response.data;
        
        if (error === 'Account is deactivated due to too many failed attempts. Please contact support.') {
          setIsAccountDeactivated(true);
          setShowAttemptsModal(true);
          setError(t('loginPage.accountDeactivated'));
        } else if (attempts_left !== undefined) {
          setAttemptsLeft(attempts_left);
          setShowAttemptsModal(true);
          setError(t('loginPage.attemptsRemaining', { count: attempts_left }));
        } else {
          setError(t('loginPage.error'));
        }
      } else {
        setError(t('loginPage.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-primary-light/30 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">
            {t('loginPage.title')}
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('loginPage.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder={t('loginPage.emailPlaceholder')}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('loginPage.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-primary-light rounded-md border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder={t('loginPage.passwordPlaceholder')}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-secondary hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('loginPage.loginButton')}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-400">
              {t('loginPage.noAccount')}{" "}
              <Link
                to="/register"
                className="text-secondary hover:text-secondary-light font-medium"
              >
                {t('loginPage.registerLink')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <AttemptsWarningModal
        isOpen={showAttemptsModal}
        onClose={() => setShowAttemptsModal(false)}
        attemptsLeft={attemptsLeft}
        isDeactivated={isAccountDeactivated}
      />
    </div>
  );
};

export default LoginPage;
 