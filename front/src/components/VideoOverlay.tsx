import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoOverlay = ({ isOpen, onClose }: VideoOverlayProps) => {
  console.log("in video overlay, isOpen:", isOpen);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (isOpen && videoRef.current) {
        try {
          console.log("Attempting to play video...");
          
          // Reset video to beginning
          videoRef.current.currentTime = 0;
          
          // Request fullscreen when playing
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          }
          console.log("Fullscreen requested");
          
          // Ensure video is loaded
          if (videoRef.current.readyState < 3) {
            console.log("Waiting for video to load...");
            await new Promise((resolve) => {
              videoRef.current!.onloadeddata = resolve;
            });
          }
          
          // Play the video
          await videoRef.current.play();
          setIsPlaying(true);
          console.log("Video started playing successfully");
        } catch (error) {
          console.error('Video playback failed:', error);
          handleVideoEnd();
        }
      }
    };

    playVideo();

    // Cleanup function
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [isOpen]);

  const handleVideoEnd = () => {
    console.log("Video ended");
    setHasEnded(true);
    setIsPlaying(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    // Wait a brief moment before redirecting
    setTimeout(() => {
      onClose();
      navigate('/');
    }, 500);
  };

  const handlePlaybackError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    console.error("Error code:", videoRef.current?.error?.code);
    console.error("Error message:", videoRef.current?.error?.message);
    
    // Try to recover from error
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Failed to recover from error:", error);
        handleVideoEnd();
      });
    } else {
      handleVideoEnd();
    }
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
        onError={handlePlaybackError}
        onLoadStart={() => console.log("Video load started")}
        onLoadedData={() => console.log("Video data loaded")}
        onCanPlay={() => console.log("Video can play")}
        onWaiting={() => console.log("Video is waiting for data")}
        onStalled={() => console.log("Video playback stalled")}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
        autoPlay
        muted={true}
        controls={false}
        preload="auto"
      >
        <source src="/videos/thank-you.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {!isPlaying && !hasEnded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => videoRef.current?.play()}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full backdrop-blur-sm"
          >
            Play Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoOverlay; 