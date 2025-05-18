import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ContentWarning } from '../services/contentModerationService';

interface ContentWarningProps {
  warnings: ContentWarning[];
}

const ContentWarning = ({ warnings }: ContentWarningProps) => {
  const { t } = useTranslation();
  
  if (warnings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-2 space-y-2"
      >
        {warnings.map((warning, index) => (
          <motion.div
            key={`${warning.type}-${warning.index}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-2 rounded-md text-sm ${
              warning.type === 'profanity' ? 'bg-red-500/10 text-red-400' :
              warning.type === 'harassment' ? 'bg-orange-500/10 text-orange-400' :
              warning.type === 'threats' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-blue-500/10 text-blue-400'
            }`}
          >
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{t(`warnings.${warning.type}`, { word: warning.word })}</span>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentWarning; 