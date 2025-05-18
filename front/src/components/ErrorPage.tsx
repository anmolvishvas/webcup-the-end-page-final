import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  setShowScene?: (show: boolean) => void;
  status?: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ setShowScene, status }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide the 3D scene if it exists
  if (setShowScene) {
    setShowScene(false);
  }

  // Determine error type from props or location state
  const getErrorType = () => {
    const errorStatus = status || location.state?.status;
    switch (errorStatus) {
      case 404:
        return 'notFound';
      case 403:
        return 'forbidden';
      case 500:
        return 'serverError';
      default:
        return 'generic';
    }
  };

  const errorType = getErrorType();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-primary-light/30 backdrop-blur-lg rounded-xl p-8 text-center border border-white/10"
      >
        <h1 className="text-4xl font-serif text-white mb-2">
          {t(`errorPage.${errorType}.title`)}
        </h1>
        
        <p className="text-2xl text-white/80 mb-6 font-serif italic">
          {t(`errorPage.${errorType}.message`)}
        </p>

        <p className="text-white/60 mb-8">
          {t(`errorPage.${errorType}.description`)}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <Home size={20} />
            {t('errorPage.actions.goHome')}
          </button>

          <button
            onClick={() => navigate(0)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <RefreshCw size={20} />
            {t('errorPage.actions.tryAgain')}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <ArrowLeft size={20} />
            {t('errorPage.actions.goBack')}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary-dark/30 rounded-full blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage; 