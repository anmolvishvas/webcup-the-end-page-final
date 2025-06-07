import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share, ArrowLeft, BookOpen, Lock } from "lucide-react";
import { endPageService } from "../services/endPageService";
import { useTranslation } from "react-i18next";
import DiaryBook from "../components/diary/DiaryBook";
import type { CreateEndPageResponse } from "../services/endPageService";
import type { Tone } from "../types";
import RatingModal from "../components/RatingModal";
import { useEndPage } from "../context/EndPageContext";
import { useAuth } from "../context/AuthContext";

interface ViewPageProps {
  setShowScene: (show: boolean) => void;
}

const ViewPage = ({ setShowScene }: ViewPageProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { refreshPages, getPage, showRatingModal, setShowRatingModal, isRatingComplete, setIsRatingComplete } = useEndPage();
  const { currentUser } = useAuth();
  const [page, setPage] = useState<CreateEndPageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"standard" | "diary">("standard");

  const getEmojisForTone = (tone: string) => {
    const emojis = {
      dramatic: ["😭", "💔", "😢", "💫"],
      ironic: ["🙄", "😏", "😒", "🤪"],
      absurd: ["🤡", "🎪", "🌈", "✨"],
      honest: ["💝", "💫", "✨", "💖"],
      "passive-aggressive": ["😊", "🙃", "💅", "✨"],
      "ultra-cringe": ["😳", "🤦", "💀", "🗿"],
      classe: ["🎩", "✨", "💫", "⭐"],
      touchant: ["💔", "🥺", "💫", "✨"]
    };
    return emojis[tone as keyof typeof emojis] || [];
  };

  useEffect(() => {
    setShowScene(false);
  }, [setShowScene]);

  const fetchEndPage = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const result = await endPageService.getEndPage(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch end page");
      }

      // Check if the page is private and user is not authenticated
      if (result.data.private && !currentUser) {
        throw new Error("This page is private. Please log in to view it.");
      }

      setPage(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchEndPage();
  }, [fetchEndPage]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: page?.title || "My End Page",
          text: "Check out my goodbye message",
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "standard" ? "diary" : "standard");
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If the current user is the page owner, redirect directly to home
    if (currentUser && page && page.user === `/api/users/${currentUser.id}`) {
      navigate('/');
      return;
    }
    
    setShowRatingModal(true);
  };

  const handleRate = async (rating: number) => {
    if (!id) return;
    
    // Double-check to prevent rating own page
    if (currentUser && page && page.user === `/api/users/${currentUser.id}`) {
      navigate('/');
      return;
    }
    
    try {
      const result = await endPageService.addRating(id, rating);
      if (!result.success) {
        throw new Error(result.error || "Failed to submit rating");
      }
      
      // Refresh the page data to show updated rating
      await fetchEndPage();
      // Refresh the top pages in the context
      await refreshPages();
      setIsRatingComplete(true);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  const handleModalClose = () => {
    setShowRatingModal(false);
    setIsRatingComplete(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
          </div>
          <p className="text-red-400">{error || "End page not found"}</p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
            >
              {t("common.backToHome")}
            </button>
            {!currentUser && (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-secondary hover:bg-secondary-light rounded-md transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {viewMode === "standard" && page && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {getEmojisForTone(page.tone).map((emoji, index) => (
            <div
              key={index}
              className="floating-emoji"
              style={{
                top: `${15 + index * 20}%`,
                left: "50%",
                transform: "translateX(-50%)"
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
      <div
        className={`min-h-screen py-12 px-6 ${
          viewMode === "standard" ? page?.tone : ""
        }`}
        style={
          viewMode === "standard"
            ? {
                backgroundImage: `url(${page.backgroundValue})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }
            : {}
        }
      >
        <div className="max-w-4xl mx-auto relative">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/"
              onClick={handleBack}
              className="text-white/80 hover:text-white flex items-center text-sm"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>

            <button
              onClick={toggleViewMode}
              className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-sm"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {viewMode === "standard" ? "View as Diary" : "Standard View"}
            </button>
          </div>

          {viewMode === "standard" ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/30 backdrop-blur-sm p-8 rounded-xl shadow-xl drift-animation"
              >
                <h1 className="text-4xl font-serif font-bold mb-6">
                  {page.title}
                </h1>

                <div className="whitespace-pre-wrap mb-8 text-lg">
                  {page.content}
                </div>

                {page.medias && page.medias.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {page.medias.map((media, idx) => (
                      media.media_type.startsWith('video') ? (
                        <video
                          key={`video-${idx}`}
                          src={media.full_url}
                          className="w-full rounded-md shadow-lg"
                          controls
                        />
                      ) : media.media_type.startsWith('audio') ? (
                        <div key={`audio-${idx}`} className="flex items-center bg-black/30 p-4 rounded-md shadow-lg">
                          <audio
                            src={media.full_url}
                            className="w-full"
                            controls
                          />
                        </div>
                      ) : (
                        <img
                          key={`img-${idx}`}
                          src={media.full_url}
                          alt={`Media ${idx + 1}`}
                          className="w-full rounded-md shadow-lg"
                        />
                      )
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-white/70">
                  <span>
                    Created on {new Date(page.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleShare}
                      className="flex items-center hover:text-white"
                    >
                      <Share className="mr-1 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <DiaryBook
                title={page.title}
                content={page.content}
                tone={page.tone as Tone}
                medias={page.medias}
              />
            </div>
          )}
        </div>
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={handleModalClose}
        onRate={handleRate}
        isRatingComplete={isRatingComplete}
      />
    </div>
  );
};

export default ViewPage;
