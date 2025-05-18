import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttemptsWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  attemptsLeft: number;
}

const AttemptsWarningModal = ({ isOpen, onClose, attemptsLeft }: AttemptsWarningModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-primary-light/90 backdrop-blur-md rounded-xl p-8 shadow-2xl max-w-lg w-full mx-4 border border-red-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-serif mb-4 text-red-500">
          {t("attempts.warningTitle")}
        </h2>
        
        <p className="text-white/90 mb-4">
          {t("attempts.lostOneAttempt")}
        </p>

        <p className="text-white/90 mb-6">
          {t("attempts.remainingAttempts", { count: attemptsLeft })}
        </p>

        <div className="text-white/70 text-sm">
          {t("attempts.warning")}
        </div>
      </div>
    </div>
  );
};

export default AttemptsWarningModal; 