import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import StarRatingCanvas from './StarRatingCanvas';
import VideoOverlay from './VideoOverlay';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  isRatingComplete: boolean;
}

const RatingModal = ({ isOpen, onClose, onRate, isRatingComplete }: RatingModalProps) => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isRatingComplete) {
      console.log("Rating complete, showing video");
      setShowVideo(true);
    }
  }, [isRatingComplete]);

  if (!isOpen && !showVideo) return null;

  const handleRate = (rating: number) => {
    console.log("Rating submitted:", rating);
    onRate(rating);
    // Show video immediately after rating
    setShowVideo(true);
  };

  const handleVideoClose = () => {
    console.log("Video closing");
    setShowVideo(false);
    onClose();
  };

  return (
    <>
      {!showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-primary-light/90 backdrop-blur-md rounded-xl p-8 shadow-2xl max-w-lg w-full mx-4 border border-secondary/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-3xl font-serif mb-2 text-white gradient-text">Rate this End Page</h2>
            <p className="text-white/70 mb-8">How would you rate this goodbye message?</p>
            
            <div className="flex justify-center">
              <StarRatingCanvas onRate={handleRate} />
            </div>

            <div className="text-center mt-6 text-white/50 text-sm">
              Your rating helps others discover meaningful goodbyes
            </div>
          </div>
        </div>
      )}

      <VideoOverlay 
        isOpen={showVideo} 
        onClose={handleVideoClose} 
      />
    </>
  );
};

export default RatingModal; 