import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

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
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message === 'Invalid credentials.'
            ? t('loginPage.errors.invalidCredentials')
            : err.message
          : t('loginPage.errors.loginFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo login function
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await login('demo@example.com', 'demo123');
      navigate(from, { replace: true });
    } catch (err) {
      setError(t('loginPage.demoError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
                {t('loginPage.emailLabel')}
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
                {t('loginPage.passwordLabel')}
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
              className="w-full py-3 bg-secondary hover:bg-secondary-light rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="loader-sm" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  {t('loginPage.loginButton')}
                </>
              )}
            </button>
          </form>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-md">
              <h3 className="text-lg font-medium mb-2 text-secondary">{t('loginPage.demo.title')}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">{t('loginPage.demo.email')}</span>
                  <code className="ml-2 px-2 py-1 bg-black/30 rounded">emma.garcia@theendpage.com</code>
                </div>
                <div>
                  <span className="text-gray-400">{t('loginPage.demo.password')}</span>
                  <code className="ml-2 px-2 py-1 bg-black/30 rounded">writer456</code>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-400">
              {t('loginPage.registerPrompt')}{" "}
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
    </div>
  );
};

export default LoginPage;
 