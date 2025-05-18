import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoOverlay = ({ isOpen, onClose }: VideoOverlayProps) => {
  console.log("in video overlay, isOpen:", isOpen);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const playVideo = async () => {
      if (isOpen && videoRef.current) {
        try {
          // Request fullscreen when playing
          document.documentElement.requestFullscreen();
          await videoRef.current.play();
          console.log("video started playing");
        } catch (error) {
          console.error('Video playback failed:', error);
          handleVideoEnd();
        }
      }
    };

    playVideo();

    // Cleanup function to exit fullscreen
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [isOpen]);

  const handleVideoEnd = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
    navigate('/');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] w-screen h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onError={(e) => console.error("Video error:", e)}
        onLoadStart={() => console.log("Video load started")}
        onLoadedData={() => console.log("Video data loaded")}
        playsInline
        autoPlay
        muted={false}
        controls={false}
        preload="auto"
      >
        <source src="/videos/thank-you.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoOverlay; 